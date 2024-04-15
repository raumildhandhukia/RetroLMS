const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  point: {
    type: Number,
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  deadline: {
    type: Date,
  },
  submissionIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
    },
  ],
  graded: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
