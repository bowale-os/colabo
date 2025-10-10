const Invite = require('../models/Invite');
const Note = require('../models/Note');
const User = require('../models/User');


//Get all notes for the autheticated user
exports.getAllCollaborators = async (req, res) => {
    try{
        const collaborators = await Note.find({ owner: req.user._id });
        res.json(collaborators);
    } catch (err) {
        res.status(500).json({ error: 'Server error'})
    }
};

exports.inviteUser = async (req, res) => {
  // ... input validation ...
  try {
    const { email, noteId } = req.body;
    const note = await Note.findOne({ _id: noteId, owner: req.user._id });
    if (!note){
        return res.status(404).json({ error: 'Note not found or you are not the owner' });
    }

    // Get all existing collaborators for this note
    const existingCollaborators = await Note.findById(noteId)
      .populate('collaborators', 'email');

    const collaboratorEmails = existingCollaborators.collaborators.map(collab => collab.email);
    
    if (collaboratorEmails.includes(email)) {
        return res.status(400).json({ error: 'User is already a collaborator' });
    }

    //prevent owner from inviting themselves
    if (note.owner.email.equals(email)) {
        return res.status(400).json({ error: 'You cannot invite yourself' });
    }

    // Find invitee, check ownership, create invite, emit socket event
    const invitee = await User.findOne({ email });
    
    if (!invitee) {
        return res.status(404).json({ error: 'User not found' });
    }

    const existingInvite = await Invite.findOne({ noteId: noteId, invitee: invitee._id });

    if (existingInvite) {
        return res.status(400).json({ error: 'Invite already sent' });
    }
    const invite = new Invite({ note: note, sender: note.owner, recipient: invitee });
    await invite.save();

    io.to(`user-${invitee._id}`).emit('invite-received', {
        inviteId: invite._id,
        noteId: note._id,
        note: note,
        senderName: note.owner.name || req.user.name,
        senderEmail: note.owner.email || req.user.email,
        status: invite.status
    });

    res.status(201).json({ message: 'Invite sent', invite });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


// Get a single note by ID
exports.getNoteById = async (req, res) => {
    try{
        const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
        if (!note) return res.status(404).json({ error: 'Note not found' });
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};


// Create a new note
exports.createNote = async (req, res) => {
  try {

    console.log('process started')

    const note = new Note({
        ...req.body,
        owner: req.user._id,
    });

    console.log('note was created');

    await note.save();

    console.log('note was saved');

    res.status(201).json(note);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: 'Failed to create note'});
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update note' });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!note) return res.status(404).json({ error: 'Note not found' });
        res.json({ message: 'Note deleted' });
    } catch (err){
        res.status(500).json({ error: 'Server error' });
    }
};
