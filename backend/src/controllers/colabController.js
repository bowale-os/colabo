const Note = require('../models/Note');
const User = require('../models/User');
const Invite = require('../models/Invite')
const mongoose = require('mongoose');

//works!!
exports.inviteUser = async (req, res) => {
    const { currentUserId, collabEmail, noteId, collabRole } = req.body;

    try{
        if (!mongoose.Types.ObjectId.isValid(currentUserId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return res.status(400).json({ error: 'Invalid note ID format' });
        }

        //check that current user exists
        const user = await User.findById(currentUserId);
        if (!user) return res.status(404).json({ error: 'User in session was not found' });
        
        //check that rerefences note exists
        const note = await Note.findById(noteId);
        if (!note) return res.status(404).json({ error: 'Referenced note was not found' });
        
        //check that collab to be invited has an account
        const collab = await User.findOne({ email: collabEmail })
        if (!collab) return res.status(404).json({ error: 'Invitee not found' });

        //block current user from sending invite to-self
        if (String(user._id) === String(collab._id)){
            return res.status(400).json({ error: 'User owns this note!' });
        }

        // Block if already accepted/collaborator
        const alreadyCollaborating = await Invite.findOne({
            recipient: collab._id,
            note: note._id,
            status: 'accepted'
        });
        if (alreadyCollaborating) {
            return res.status(400).json({ error: 'User is already a collab on this note!' });
        }

        //prevent duplicate existing accepted invites
        const existingInvite = await Invite.findOne({ 
            sender: user._id,
            recipient: collab._id,
            note: note._id,
            status: 'pending'
        });
        
        if (existingInvite) {
            return res.status(400).json({ error: 'Invite was already sent but is still pending!' });
        }
        
        //make new invite if the preceding conditions fail
        const invite = new Invite({ 
            sender: user._id,
            recipient: collab._id,
            note: note._id,
            role: collabRole || 'viewer'
        })

        await invite.save();

        return res.status(201).json({ message: 'Invite sent successfully!' });


    }catch(err){
        res.status(500).json({
            error: err.message
        })
    }

}

//works!!
//get all collabs for a note
exports.getAllCollabs = async (req, res) => {
    try {
        const noteId = req.params.noteId;

        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return res.status(400).json({ error: 'Invalid note ID format' });
        }

        // Populate user info from permissions array for the note
        const note = await Note.findById(noteId)
            .populate('permissions.user', 'name email') // get name and email only
            .populate('owner', 'name email');           // include owner details

        if (!note) return res.status(404).json({ error: 'Note not found' });

        //construct collaborators array
        const collabs = [
            {
                user: note.owner,
                role: 'owner'
            }, 
            ...note.permissions.map(p => ({
                user: p.user,
                role: p.role
            }))
        ];

        res.status(200).json({ collabs });
    } catch (err){
        res.status(500).json({ error: err.message })
    }
};


//works!!
//the collab is the person logged it: the person calling this route
exports.updateAcceptedInvite = async (req, res) => {
    try{
        const inviteId = req.params.inviteId;
        const { currentUserId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(currentUserId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        if (!mongoose.Types.ObjectId.isValid(inviteId)) {
            return res.status(400).json({ error: 'Invalid invite ID format' });
        }

        //check that invite still exists
        const invite = await Invite.findById(inviteId);
        if (!invite) return res.status(404).json({ error: "Invite not found!" });

        //check that note in invite exists
        const note = await Note.findById(invite.note);
        if (!note) return res.status(404).json({ error: "Note associated with invite was not found!" });
        
        // Make sure invitee matches the logged-in user
        if (String(invite.recipient) !== String(currentUserId))
            return res.status(403).json({ error: "You are not authorized to accept this invite!" });

        //check that this user did not initiate an invite to-self
        if (String(invite.sender) === String(currentUserId))
            return res.status(403).json({ error: "You are not authorized to accept this invite!" });

        console.log('invite.status:', invite.status)
        //was invite already accepted
        if (String(invite.status) !== 'pending')
            return res.status(400).json({ error: "You probably already accepted invite" });

        //check if user already has permission, incase they already accepted the invite
        const alreadyHasPermission = note.permissions.find(
            p => String(p.user) === String(currentUserId)
        );

        if (alreadyHasPermission) return res.status(400).json({ error: "User already accepted the invite and has permission to this note." })
    

        //Accept the invite
        invite.status = 'accepted';
        invite.AcceptedAt = new Date();
        await invite.save();
        console.log('invite status was changed!')

        //add user and role to the note's permissions list
        note.permissions.push({
            user: currentUserId,
            role: invite.role || 'viewer'
        });
       
        await note.save();
        console.log("route ran succcessfully!")
        return res.status(201).json({ message: "Invited accepted successfully!" });

        } catch (err){
            return res.status(500).json({ error: err.message});
    }
}

//works!!
//remove a collab (only note owner)
exports.removeCollab = async (req, res) => {
    try{

        const collabId = req.params.collabId;
        const { currentUserId, noteId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(currentUserId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return res.status(400).json({ error: 'Invalid note ID format' });
        }

        if (!mongoose.Types.ObjectId.isValid(collabId)) {
            return res.status(400).json({ error: 'Invalid collab ID format' });
        }



        //find note that is referenced
        const note = await Note.findById(noteId);
        if (!note) return res.status(404).json({ error: 'Note not found' });

        //check that user in session owns this note
        if (String(note.owner) !== String(currentUserId)) 
            return res.status(403).json({ error: 'Only the note owner has this permission' });

        // Check that collab to be removed had permission to this note
        const hadPermission = note.permissions.find(
            p => String(p.user) === String(collabId)
        );

        if (!hadPermission) {
            return res.status(404).json({ error: 'User did not have access to this note' });
        }

        //upate invite status to 'cancelled'
        const invite = await Invite.findOne({
            note: noteId,
            recipient: collabId,
            sender: currentUserId,
            status: { $in: ['pending', 'accepted'] } // covers both cases
        });
        if (!invite) return res.status(400).json({ error: "There's no corresponding invite"});
        
        //invite status changed to 'cancelled'
        invite.status = 'cancelled';
        await invite.save();
        

        // Remove permissions from note's permissions
        note.permissions = note.permissions.filter(
            p => String(p.user) != String(collabId)
        );
        await note.save();

        res.status(200).json({ message: 'user access removed and invite cancelled.' });

    } catch (err)  {
        res.status(500).json({ error: err.message });
    }

}

//works!!
//check if the person accepted the invite
//user should not be able to change their role
exports.changeCollabRole = async (req, res) => {
    try{
        const { noteId, collabId } = req.params;
        const { newRole, currentUserId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(currentUserId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return res.status(400).json({ error: 'Invalid note ID format' });
        }

        if (!mongoose.Types.ObjectId.isValid(collabId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        //check that note exists
        const note = await Note.findById(noteId);
        if (!note) return res.status(404).json({ error: 'Note not found' });
        
        //check that user in session owns the note
        if (String(note.owner) !== String(currentUserId)) {
            return res.status(403).json({ error: 'Only the note owner has permission to change roles' });
        }

        // user cannot change their role ?! i'll block this in frontend
        if (String(note.owner) === String(collabId)) {
            return res.status(403).json({ error: 'Cannot change role for the note owner' });
        }

        // check that collab had permission in referenced note
        const permission = note.permissions.find(
            p => String(p.user) === String(collabId)
        );
        
        if (!permission) {
            return res.status(404).json({ error: 'user did not have access to this note' });
        }

        // Validate requested role
        const validRoles = ['viewer', 'editor'];
        if (!validRoles.includes(newRole)) {
            return res.status(400).json({ error: 'This role does not exist' });
        }
        
        //updating Permission in Note
        permission.role = newRole.toLowerCase();
        await note.save();

        res.status(200).json({ message: 'user role updated successfully', permissions: note.permissions });

    } catch (err){
        res.status(500).json({ error: err.message });
    }
}

//works!!
//get all pending invites for note
exports.getPendingInvites = async (req, res) => {
    try{

        const noteId = req.params.noteId;
        const currentUserId = req.params.currentUserId;

        if (!mongoose.Types.ObjectId.isValid(currentUserId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return res.status(400).json({ error: 'Invalid note ID format' });
        }

        //check that note exists
        const note = await Note.findById(noteId)
        if (!note) return res.status(404).json({ error: 'Note not found' });

        //check that current user owns nite
        const user = await User.findById(currentUserId);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (String(user._id) !== String(note.owner)) {
            return res.status(403).json({ error: "Only an owner can view sent invites" })
        }

        // Find all pending invites for the given noteId
        const pendingInvites = await Invite.find({ note: noteId, status: 'pending' })
        .populate('recipient', 'name email')
        .populate('sender', 'name email');

        return res.status(200).json({ pendingInvites });

    } catch(err){
        return res.status(500).json({ error: err.message });
    }
}
//sharing link to public users