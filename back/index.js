// Load Environment Variables
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const cors = require("cors");
const dbController = require("./controllers/dbController");

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();

const { storeNotification } = require("./controllers/notificationController");

// Middleware for JSON request and response
app.use(express.json());

// // Middleware for enabling CORS requests from PORT 3000
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Connect to MongoDB Atlas
dbController.connectToDatabase();

//Importing Routes Files
const commonRoutes = require("./routes/commonRoutes");
const authRoutes = require("./routes/authRoutes");

//Defining Route Paths
app.use("", commonRoutes);
app.use("", authRoutes);

// Example RESTful endpoint
app.get("/", (req, res) => {
  res.send({
    message: "Setting up NodeJS backend.",
  });
});

const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
  socket.on("disconnect", () => {});

  socket.on("buyItem", (data) => {
    storeNotification(data);
    io.emit(data.courseId, { message: data.message });
  });

  socket.on("manageRequest", (data) => {
    storeNotification(data);
    io.emit(data.studentId, { message: data.message });
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

module.exports = app;
