const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

// @route   GET /api/messages/:roomId
// @desc    Get all messages for a room
// @access  Private
router.get('/:roomId', protect, async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/messages/:roomId
// @desc    Clear all messages in a room
// @access  Private
router.delete('/:roomId', protect, async (req, res) => {
  try {
    await Message.deleteMany({ roomId: req.params.roomId });
    
    // Broadcast clear event
    const io = req.app.get('io');
    if (io) {
      io.to(req.params.roomId).emit('messages_cleared');
    }

    res.json({ message: 'Messages cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
