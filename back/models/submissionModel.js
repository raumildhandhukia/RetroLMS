const mongoose = require("mongoose");

const submissionModel = new mongoose.Schema(
  {
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
      },
      taskId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
      },
      points_recevied:{
        type: Number,
        require: true
      }
  }
);

const Submission = mongoose.model("Submission", submissionModel);

module.exports = Submission;
