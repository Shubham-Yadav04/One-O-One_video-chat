import express from "express";
import { Server } from "socket.io";
import http from "http";
import crypto from "crypto";
import userRouter from "./routes/userRoute.js";
import { connectDb } from "./dbConfig/connectDB.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import passport from "./config/passportConfig.js";
// import { createClient } from "redis";

const app = express();
const server = http.createServer();
// socket.io attached to a dedicated http server (port configured below)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

await connectDb();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Passport initialization
app.use(passport.initialize());

app.get("/health", (req, res) => res.send("OK"));
app.get("/session/:id", async (req, res) => {
  const session = await getSession(req.params.id);
  return res.json(session ?? {});
});
app.use("/user", userRouter);
const rooms = new Map();
const socketToRoom = new Map();
const waitingUsers = [];

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  console.log("Transport:", socket.conn.transport.name);

  socket.on("upgrade", () => {
    console.log(`${socket.id} upgraded to:`, socket.conn.transport.name);
  });

  socket.on("find-partner", () => {
    console.log(`${socket.id} is looking for a partner...`);

    if (socketToRoom.has(socket.id)) {
      console.log(`${socket.id} is already in a conversation`);
      socket.emit("error", { message: "Already in a conversation" });
      return;
    }

    if (waitingUsers.length > 0) {
      const randomIndexDecimal = Math.random();
      const randomIndex = Math.floor(randomIndexDecimal * waitingUsers.length);
      const partnerId = waitingUsers[randomIndex];
      const partnerSocket = io.sockets.sockets.get(partnerId); 
      
      // console.log(partnerSocket)
      
      // getting the partner socket through its socket id

      // if (!partnerSocket) {
      //   console.log(`Partner ${partnerId} disconnected, searching again...`);
      //   if (waitingUsers.length > 0) {
      //     socket.emit('find-partner');
      //   } else {
      //     waitingUsers.push(socket.id);
      //     socket.emit('waiting');
      //   }
      //   return;
      // }

      if (!partnerSocket) {
        // partner disconnected unexpectedly, remove them from waiting list and retry
        waitingUsers.splice(randomIndex, 1);
        socket.emit("waiting");
        return;
      }

      const roomId = crypto.randomUUID();
      rooms.set(roomId, { user1: partnerId, user2: socket.id });
      socketToRoom.set(partnerId, roomId);
      socketToRoom.set(socket.id, roomId);

      // remove partner from waiting list
      waitingUsers.splice(randomIndex, 1);

      socket.join(roomId);
      partnerSocket.join(roomId);

      console.log(`Matched ${partnerId} with ${socket.id} in room ${roomId}`);

      // Tell one side to create the offer (the waiting partner), and the other to wait
      partnerSocket.emit("partner-found", {
        roomId,
        shouldCreateOffer: true,
      });

      socket.emit("partner-found", {
        roomId,
        shouldCreateOffer: false,
      });
    } else {
      if (waitingUsers.includes(socket.id)) {
        console.log(`${socket.id} is already in waiting list`);
        return;
      }
      waitingUsers.push(socket.id);
      socket.emit("waiting");
    }
  });

  socket.on("offer", ({ offer }) => {
    const roomId = socketToRoom.get(socket.id);
    if (!roomId) {
      return;
    }
    const partnerId =
      rooms.get(roomId).user1 === socket.id
        ? rooms.get(roomId).user2
        : rooms.get(roomId).user1;

    socket.to(partnerId).emit("offer-created", { offer, roomId });
  });

  socket.on("answer", ({ answer, roomId }) => {
    if (!roomId) return;
    const partnerId =
      rooms.get(roomId).user1 === socket.id
        ? rooms.get(roomId).user2
        : rooms.get(roomId).user1;
    socket.to(partnerId).emit("answer-created", { answer, roomId });
  });
socket.on("answer-recieved",()=>{
  const roomId = socketToRoom.get(socket.id);
  if (!roomId) {
    return;
  }
  const partnerId =
    rooms.get(roomId).user1 === socket.id
      ? rooms.get(roomId).user2
      : rooms.get(roomId).user1;
  socket.to(partnerId).emit("connection-established");
})
  socket.on("ice-candidate", ({ candidate }) => {
    const roomId = socketToRoom.get(socket.id);
    if (!roomId) return;
    const partnerId =
      rooms.get(roomId).user1 === socket.id
        ? rooms.get(roomId).user2
        : rooms.get(roomId).user1;
    socket.to(partnerId).emit("new-ice-candidate", { candidate });
  });

  socket.on("skip-partner", () => {
    handleDisconnect(socket);
  });

  socket.on("leave-room", () => {
    handleDisconnect(socket);
  });

  socket.on("disconnect", () => {
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
        io.to(partnerId).emit("partner-disconnected");
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
app.listen(PORT, () =>
  console.log("Random 1:1 signaling server running on", PORT)
);
server.listen(8001, () => console.log("socket server running on 8001"));
