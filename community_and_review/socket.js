import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import chatMessage from './models/chatMessage.js';

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: '*' }, // Avoid '*' in production
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.user.user_id);

    socket.on('join_room', (clubId) => {
      socket.join(clubId);
    });

    socket.on('send_message', async ({ clubId, message }) => {
     const newMsg = await chatMessage.create({
        clubId,
        senderId: socket.user.user_id,
        message,
      });

      io.to(clubId).emit('receive_message', newMsg);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

export default setupSocket;