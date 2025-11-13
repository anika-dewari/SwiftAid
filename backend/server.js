import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import router from './routes/routes.js';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.IO setup with CORS
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

app.use(cors());
app.use(bodyParser.json());

// Make io available in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api', router);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  // User joins their personal room for notifications
  socket.on('join-user-room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Driver updates location
  socket.on('update-location', (data) => {
    socket.broadcast.emit('driver-location-updated', data);
  });

  // Driver status change
  socket.on('driver-status-change', (data) => {
    socket.broadcast.emit('driver-status-changed', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 SwiftAid Backend Server Running`);
  console.log(`📡 HTTP Server: http://localhost:${PORT}`);
  console.log(`⚡ Socket.IO: Enabled`);
  console.log(`🔗 API Endpoint: http://localhost:${PORT}/api`);
  console.log('='.repeat(50));
});
