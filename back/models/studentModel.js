const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
    // enrolledCourses: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Course"
    //   },
    // ]
    // academicDetails: {
    //   type: Map,
    //   of: String, // Example: {"gradeLevel": "Junior", "major": "Computer Science"}
    // }
    
  },
  {
    timestamps: true
  }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
