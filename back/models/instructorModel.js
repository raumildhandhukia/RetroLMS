const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    coursesTeaching: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    makeStudentEditable: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

const Instructor = mongoose.model("Instructor", instructorSchema);

module.exports = Instructor;
