// src/models/Note.js
const mongoose = require('mongoose');


//permission model to track users' permission when they are invited to a note
const PermissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    requirsed: true
  },

  role: {
    type: String,
    enum: ['owner', 'editor', 'viewer'],
    required: true
  }
}, { _id: false });



const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  content: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  permissions: [PermissionSchema],
  trashed: { 
    type: Boolean, 
    default: false 
  },  
  trashedAt: { 
    type: Date 
  }, 
  isFavorite: { 
    type: Boolean, 
    default: false 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Note', noteSchema);
