// db.js
const mongoose = require('mongoose');

// MongoDB connection string
const DB_URL = process.env.DB_URL;

// Establishing database connection
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));

module.exports = mongoose.connection;
