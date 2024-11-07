const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const PORT = process.env.PORT || 5000;
require("dotenv").config();

const Message = require('./models/message.model');

const morgan = require("morgan");
const cors = require("cors");

const allowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      const msg =
        "The CORS policy for this site does not allow access from the specified origin.";
      return callback(new Error(msg), false);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

// Khởi tạo Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket connection handling
const userSockets = new Map();

io.on('connection', (socket) => {
  socket.on('login', (userId) => {
    userSockets.set(userId, socket.id);
    console.log('User logged in:', userId);
  });

  socket.on('send_message', async (data) => {
    try {
      const { senderId, recipientId, content } = data;
      
      if (!senderId || !recipientId || !content) {
        throw new Error('Missing required fields');
      }

      const message = new Message({
        senderId: senderId.toString(),
        recipientId: recipientId.toString(),
        content,
        timestamp: new Date(),
        read: false
      });
      await message.save();

      const recipientSocketId = userSockets.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('receive_message', message);
      }

      socket.emit('message_sent', { success: true, data: message });

    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message_sent', { success: false, error: error.message });
    }
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        break;
      }
    }
  });
});
// Kết nối với database
const connectDB = require("./configs/db.js");
connectDB();

// Router
const hostelRoute = require("./routes/hostel.route.js");
const roomRoute = require("./routes/room.route.js");
const userRoute = require("./routes/user.route.js");
const authRoutes = require("./routes/auth.route");
const landlordRoute = require("./routes/landlord.route");
const messageRoute = require("./routes/message.route");


// Api
app.use("/api/room", roomRoute);
app.use("/api/user", userRoute);
app.use("/api/auth", authRoutes);
app.use("/api/landlord", landlordRoute);
app.use("/api/messages", messageRoute);
server.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);

