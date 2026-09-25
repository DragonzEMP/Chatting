const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    index: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderDisplayName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  replyTo: {
    messageId: String,
    senderDisplayName: String,
    content: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // TTL index for 24-hour auto delete
  },
});

module.exports = mongoose.model('Message', messageSchema);
