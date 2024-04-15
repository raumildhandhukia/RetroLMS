const mongoose = require("mongoose");

const submissionModel = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      require: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      require: true,
    },
    points: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Submission = mongoose.model("Submission", submissionModel);

module.exports = Submission;
