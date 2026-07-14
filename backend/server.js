const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDatabase = require("./db/Database");
const User = require("./model/user");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server for handling uncaught exception");
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/.env" });
}

// connect db
connectDatabase().then(seedAdmin);

async function seedAdmin() {
  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (existing) return;
  await User.create({
    name: process.env.ADMIN_NAME || "Admin",
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: "Admin",
    avatar: {
      public_id: "admin_avatar",
      url: "https://i.ibb.co/4pDNDk1/avatar.png",
    },
  });
  console.log(`Admin user seeded: ${process.env.ADMIN_EMAIL}`);
}

// HTTP server (so socket.io can attach to it)
const server = http.createServer(app);

// -------------------- SOCKET.IO (real-time chat) --------------------
const socketOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  ...(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
];

const io = new Server(server, {
  cors: {
    origin: socketOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let onlineUsers = [];

const addUser = (userId, socketId) => {
  if (!onlineUsers.some((u) => u.userId === userId)) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((u) => u.socketId !== socketId);
};

const getUser = (receiverId) => onlineUsers.find((u) => u.userId === receiverId);

io.on("connection", (socket) => {
  // register the connected user/seller
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", onlineUsers);
  });

  // deliver a message to the recipient in real time
  socket.on("sendMessage", ({ senderId, receiverId, text, images }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
        images,
        createdAt: Date.now(),
      });
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", onlineUsers);
  });
});

// start
server.listen(process.env.PORT || 8000, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT || 8000}`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
