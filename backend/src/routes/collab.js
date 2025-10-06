// const express = require('express');
// const collabController = require('../controllers/collabController');
// const authMiddleware = require('../middlewares/auth');
// const router = express.Router();


// // Invite a user to collaborate on a note
// router.post('/invite', authMiddleware, collabController.inviteUser);

// // Get collaborators for a note
// router.get('/:noteId/collaborators', authMiddleware, collabController.getCollaborators);

// // Remove a collaborator
// router.delete('/:noteId/collaborators/:userId', authMiddleware, collabController.removeCollaborator);

// module.exports = router;