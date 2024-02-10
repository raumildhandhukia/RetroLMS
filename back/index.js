// Load Environment Variables
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const mongooseConnection = require('./db');

const app = express();

const PORT = process.env.PORT || 8080;

// Middleware for JSON request and response
app.use(express.json());

// Middleware for enabling CORS requests from PORT 3000
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

//Importing Routes Files
const adminRoutes = require('./routes/adminRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const studentRoutes = require('./routes/studentRoutes');
const commonRoutes = require('./routes/commonRoutes');
const authRoutes = require("./routes/authRoutes");

//Defining Route Paths
app.use('/admin', adminRoutes);
app.use('/instructors', instructorRoutes);
app.use('/students', studentRoutes);
app.use('/', commonRoutes);
app.use('', authRoutes);

// Example RESTful endpoint
app.get("/", (req, res) => {
  res.send({
    message: "Setting up NodeJS backend.",
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
