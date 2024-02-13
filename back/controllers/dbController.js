// db.js
const mongoose = require('mongoose');

// MongoDB connection string
const DB_URL = process.env.DB_URL;

// Establishing database connection
const connectToDatabase = async () => {
    try {
      await mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to MongoDB Atlas!');
    } catch (error) {
      console.error('Error connecting to MongoDB Atlas:', error);
    }
  };
  
  module.exports = { connectToDatabase };