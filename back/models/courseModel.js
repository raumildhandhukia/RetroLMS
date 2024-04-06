const mongoose = require("mongoose");
const Transaction = require("./transactionModel");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
  },
  cart: {
    type: String,
  },
  task: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  transaction:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    }
  ],
  courseKey: {
    // SER517 will be used for capstone project
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
