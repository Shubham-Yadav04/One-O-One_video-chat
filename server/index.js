
import express from "express";
import { Server } from "socket.io";
import http from "http";
import userRouter from "./routes/userRoute.js"
import { connectDb } from "./dbConfig/connectDB.js";
import cors from 'cors'
import cookieParser from "cookie-parser";
// import { createClient } from "redis";

const app = express();
const server = http.createServer(); 
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"] 
  }
});

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDb()
app.get("/health", (req, res) => res.send("OK"));
app.get("/session/:id", async (req, res) => {
  const session = await getSession(req.params.id);
  return res.json(session ?? {});
});
app.use('/user',userRouter);
const rooms = new Map();
const socketToRoom = new Map();
const waitingUsers = [];

io.on('connection', (socket) => {
  console.log("New client connected:", socket.id);
  console.log("Transport:", socket.conn.transport.name);
  
  socket.on('upgrade', () => {
    console.log(`${socket.id} upgraded to:`, socket.conn.transport.name);
  });

  socket.on('find-partner', () => {
    console.log(`${socket.id} is looking for a partner...`);
    
    // if (socketToRoom.has(socket.id)) {
    //   console.log(`${socket.id} is already in a conversation`);
    //   socket.emit('error', { message: 'Already in a conversation' });
    //   return;
    // }

    if (waitingUsers.includes(socket.id)) {
      console.log(`${socket.id} is already in waiting list`);
      return;
    }

    if (waitingUsers.length > 0) {
      const partnerId = waitingUsers.shift();
      const partnerSocket = io.sockets.sockets.get(partnerId); // getting the partner socket through its socket id 
      
      if (!partnerSocket) {
        console.log(`Partner ${partnerId} disconnected, searching again...`);
        if (waitingUsers.length > 0) {
          socket.emit('find-partner');
        } else {
          waitingUsers.push(socket.id);
          socket.emit('waiting');
        }
        return;
      }

      const roomId = crypto.randomUUID();
      rooms.set(roomId, { user1: partnerId, user2: socket.id });
      socketToRoom.set(partnerId, roomId);
      socketToRoom.set(socket.id, roomId);

      socket.join(roomId);
      partnerSocket.join(roomId);

      console.log(`Matched ${partnerId} with ${socket.id} in room ${roomId}`);

      io.to(partnerId).emit('partner-found', { 
        roomId, 
        shouldCreateOffer: true 
      });
      io.to(socket.id).emit('partner-found', { 
        roomId, 
        shouldCreateOffer: false 
      });
    } else {
      waitingUsers.push(socket.id);
      socket.emit('waiting');
    }
  });

  socket.on('offer', ({ offer }) => {
    const roomId = socketToRoom.get(socket.id);
    if (!roomId) {
      
      return;
    }

    socket.to(roomId).emit('offer', { offer });
  });

  socket.on('answer', ({ answer }) => {
    const roomId = socketToRoom.get(socket.id);
    if (!roomId) return;
   
    socket.to(roomId).emit('answer', { answer });
  });

  socket.on('ice-candidate', ({ candidate }) => {
    const roomId = socketToRoom.get(socket.id);
    if (!roomId) return;
    
    socket.to(roomId).emit('ice-candidate', { candidate });
  });

  socket.on('skip-partner', () => {
    handleDisconnect(socket);
  });

  socket.on('leave-room', () => {

    handleDisconnect(socket);
  });

  socket.on('disconnect', () => {

    handleDisconnect(socket);
  });

  function handleDisconnect(socket) {
    const socketId = socket.id;
    const waitingIndex = waitingUsers.indexOf(socketId);
    if (waitingIndex > -1) {
      waitingUsers.splice(waitingIndex, 1);
    }

    const roomId = socketToRoom.get(socketId);
    if (roomId) {
      const room = rooms.get(roomId);
      if (room) {
        const partnerId = room.user1 === socketId ? room.user2 : room.user1;
        io.to(partnerId).emit('partner-disconnected');
        socketToRoom.delete(partnerId);
        const partnerSocket = io.sockets.sockets.get(partnerId);
        if (partnerSocket) {
          partnerSocket.leave(roomId);
        }
      }
      rooms.delete(roomId);
      socketToRoom.delete(socketId);
      socket.leave(roomId);
    }
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("Random 1:1 signaling server running on", PORT));
server.listen(8001,()=>console.log("socket server running on 8001"))