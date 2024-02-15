const express = require("express");

const dotenv = require("dotenv");
const chats = require("./data/data");
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDb();
const app = express();
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT;
const server = app.listen(PORT, console.log(PORT));
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected ");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room" + room);
    // socket.emit("User Joined Room" + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("Users Undefined");

    chat.users.forEach((user) => {
      console.log(user);
      if (user._id === newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
      socket.in(user);
    });
  });
  // Add additional event handling here as needed
});
