require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);

// CORS configuration for frontend
const io = new Server(server, {
  cors: {
    origin: "*", // For development. In production, restrict to frontend URL
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/incognito-chat';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.IO logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a room (the 5-digit code)
  socket.on('join_room', async (roomCode) => {
    socket.join(roomCode);
    console.log(`User ${socket.id} joined room ${roomCode}`);
    
    // Fetch and send message history for this room
    try {
      const messages = await Message.find({ roomCode }).sort({ createdAt: 1 });
      socket.emit('message_history', messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  });

  // Handle incoming messages
  socket.on('send_message', async (data) => {
    // data should contain { roomCode, sender, content }
    const { roomCode, sender, content } = data;
    
    try {
      // Save message to database
      const newMessage = new Message({
        roomCode,
        sender,
        content
      });
      await newMessage.save();

      // Broadcast to everyone in the room (including sender to confirm)
      io.to(roomCode).emit('receive_message', newMessage);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
