import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config(); //load .env file
//mongodb connection
connectDB();

const app = express();
app.use(express.json());
// ✅ 1. CORS sabse pehle
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// ✅ 2. Preflight
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// =========SOCKET SETUP=========
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // join user room
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // join chat room
  socket.on("join chat", (chatId) => {
    socket.join(chatId);
  });

  // new message
  socket.on("new message", (message) => {
    const chat = message.chat;
    if (!chat.users) return;

    chat.users.forEach((user) => {
      if (user._id === message.sender._id) return;

      socket.to(user._id).emit("message received", message);
    });
  });
});

const PORT = 5000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
