const express = require('express');
const User = require('../models/userModel');
const Student = require('../models/studentModel');
const Instructor = require('../models/instructorModel');
const router = express.Router();

// Route for all users to view the leaderboard
router.get("/leaderboard", (req, res) => {
  // Logic to view the leaderboard
  res.send({
    message: "You get the latest leaderboard.",
  });
});

router.get("/courses/:username", async (req, res) => {
  try {
    const {username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let courses;

    switch (user.role) {
      case "student":
        courses = await Student.findOne({ userId: user._id }).populate('enrolledCourses');
        break;

      case "instructor":
        courses = await Instructor.findOne({ userId: user._id }).populate('coursesTeaching');
        break;

      default:
        return res.status(400).json({ message: "Invalid role error" });
    }

    if (!courses) {
      return res.status(404).json({ message: "Courses not found" });
    }

    courses = user.role === "student" ? courses.enrolledCourses : courses.coursesTeaching

    res.status(200).json({ 
      username: username, 
      courses: courses
    });
    
  } 
  catch(error) {
    console.error(error);
    res.status(500).json({message: "Internal server error"});
  }
})

module.exports = router;
