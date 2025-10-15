const Note = require('../models/Note');

//Get all notes for the authemticated user
exports.getAllNotes = async (req, res) => {
    try{
        const notes = await Note.find({ owner: req.user._id });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: 'Server error'})
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
        permissions: [{
          user: req.user._id,
          role: 'owner'
        }]
    });

    console.log('note was created');
    await note.save();

    console.log('note was saved');

    res.status(201).json(note);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to create note'});
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
