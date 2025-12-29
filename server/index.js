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
const waitingQueue = [];           
const socketToRoom = new Map();   
const rooms = new Map();    

function tryMatch() {
  while (waitingQueue.length >= 2) {
    const user1 = waitingQueue.shift();
    const user2 = waitingQueue.shift();

    const s1 = io.sockets.sockets.get(user1);
    const s2 = io.sockets.sockets.get(user2);

    // One disconnected → skip and retry
    if (!s1 || !s2) {
      if (s1) waitingQueue.unshift(user1);
      if (s2) waitingQueue.unshift(user2);
      continue;
    }

    const roomId = crypto.randomUUID();

    rooms.set(roomId, { user1, user2 });
    socketToRoom.set(user1, roomId);
    socketToRoom.set(user2, roomId);

    s1.join(roomId);
    s2.join(roomId);

    s1.emit("partner-found", { roomId, shouldCreateOffer: true });
    s2.emit("partner-found", { roomId, shouldCreateOffer: false });

    console.log(`Matched ${user1} ↔ ${user2} in room ${roomId}`);
  }
}
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  console.log("Transport:", socket.conn.transport.name);

  socket.on("upgrade", () => {
    console.log(`${socket.id} upgraded to:`, socket.conn.transport.name);
  });

  socket.on("find-partner", () => {
  if (socketToRoom.has(socket.id)) {
    return socket.emit("error", { message: "Already in a room" });
  }

  if (!waitingQueue.includes(socket.id)) {
    waitingQueue.push(socket.id);
    socket.emit("waiting");
  }

  tryMatch();
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
  socket.to(partnerId).emit("connection-established",{ roomId });
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

  // Remove from waiting queue
  const idx = waitingQueue.indexOf(socketId);
  if (idx !== -1) {
    waitingQueue.splice(idx, 1);
  }

  const roomId = socketToRoom.get(socketId);
  if (!roomId) return;

  const room = rooms.get(roomId);
  if (!room) return;

  const partnerId =
    room.user1 === socketId ? room.user2 : room.user1;

  const partnerSocket = io.sockets.sockets.get(partnerId);

  // Cleanup room
  rooms.delete(roomId);
  socketToRoom.delete(socketId);
  socketToRoom.delete(partnerId);

  socket.leave(roomId);

  if (partnerSocket) {
    partnerSocket.leave(roomId);
    partnerSocket.emit("partner-disconnected");

    waitingQueue.push(partnerId);
    partnerSocket.emit("waiting");
  }

  tryMatch();
}
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log("Random 1:1 signaling server running on", PORT)
);
server.listen(8001, () => console.log("socket server running on 8001"));
