const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
    sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
    recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },  
  status: { type: String, enum: ['pending', 'accepted', 'cancelled'], default: 'pending' },
  note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
  sentAt: { type: Date, default: Date.now },
  AcceptedAt: { type: Date}, 
});


module.exports = mongoose.model('Invite', inviteSchema)
