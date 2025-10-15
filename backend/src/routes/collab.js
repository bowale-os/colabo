const express = require('express');
const collabController = require('../controllers/colabController');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();



// Invite a user to collaborate on a note
router.post('/invite', authMiddleware, collabController.inviteUser);

// Get collaborators for a note
router.get('/:noteId/collabs', authMiddleware, collabController.getAllCollabs);

//update accepted invite
router.post('/:inviteId/accept', authMiddleware, collabController.updateAcceptedInvite);

// Remove a collsaborator (for owner only)
router.delete('/:collabId/remove', authMiddleware, collabController.removeCollab);

//change collaborator role (for owner only)
router.patch('/:noteId/change-role/:collabId', authMiddleware, collabController.changeCollabRole);

// Get all pending invites for a note
router.get('/:noteId/invites/:currentUserId', authMiddleware, collabController.getPendingInvites);


// router.get('/:noteId/invites', (req, res) => {
//   res.json({ message: 'Route reached', noteId: req.params.noteId });
// });


module.exports = router;