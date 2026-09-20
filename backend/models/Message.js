const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    index: true,
  },
  sender: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // TTL index: 86400 seconds = 24 hours
  }
});

module.exports = mongoose.model('Message', MessageSchema);
