const express = require('express');
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

router.get('/', authMiddleware, noteController.getAllNotes);
router.post('/', authMiddleware, noteController.createNote);
router.get('/:id', authMiddleware, noteController.getNoteById);
router.put('/:id', authMiddleware, noteController.updateNote);
router.delete('/:id', authMiddleware, noteController.deleteNote);

module.exports = router;
