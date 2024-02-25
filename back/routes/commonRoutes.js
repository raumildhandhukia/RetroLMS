const express = require("express");
const User = require("../models/userModel");
const Course = require("../models/courseModel");
const Student = require("../models/studentModel");
const Instructor = require("../models/instructorModel");
const router = express.Router();
const cookieParser = require("cookie-parser");
const JWT = require("jsonwebtoken");
router.use(cookieParser());

// Route for all users to view the leaderboard
router.get("/leaderboard", (req, res) => {
  // Logic to view the leaderboard
  res.send({
    message: "You get the latest leaderboard.",
  });
});


//This route should be used to create as well as update the course
router.put("/courses", async (req, res) => {

  try {
    const { title, instructorId, courseKey } = req.body;

    // Check if the user is authorized (has the role of admin or instructor)
    if (req.user.role !== 'admin' && req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
  

    // Check if the course already exists
    let existingCourse = await Course.findOne({ title });

    if (existingCourse) {
      // Update existing course
      existingCourse.instructorId = instructorId;
      existingCourse.courseKey = courseKey;
      await existingCourse.save();

      return res.status(200).json({
        message: `Course '${title}' updated successfully`,
        course: existingCourse,
      });
    }

    // Create a new course if it doesn't exist
    const newCourse = new Course({
      title,
      instructorId,
      courseKey,
    });

    // Save the new course to the database
    await newCourse.save();

    res.status(201).json({
      message: `Course '${title}' created successfully`,
      course: newCourse,
    });
  } catch (error) {
    console.error("Error updating/creating course:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});



//not working, wait for PR
router.get("/courses", async (req, res) => {
  try {
    jwt = res.cookies && res.cookies.jwt;
    const decoded = JWT.decode(jwt);
    const username = decoded.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let courses;

    switch (user.role) {
      case "student":
        courses = await Student.findOne({ userId: user._id }).populate(
          "enrolledCourses"
        );
        break;

      case "instructor":
        courses = await Instructor.findOne({ userId: user._id }).populate(
          "coursesTeaching"
        );
        break;

      default:
        return res.status(400).json({ message: "Invalid role error" });
    }

    if (!courses) {
      return res.status(404).json({ message: "Courses not found" });
    }

    courses =
      user.role === "student"
        ? courses.enrolledCourses
        : courses.coursesTeaching;

    res.status(200).json({
      username: username,
      courses: courses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/profile", async (req, res) => {
  try {
    jwt = req.cookies && req.cookies.jwt;
    const decoded = JWT.decode(jwt);
    const username = decoded.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      profile: user.profile,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Method to delete the course and also to remove it from the enrolledCourses array of all students.
router.delete("/courses", async (req, res) => {
  try {
    const { title, instructorId, courseKey } = req.body;

    // Check if the user is authorized (has the role of admin or instructor)
    if (req.user.role !== 'admin' && req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Find the course to be deleted based on the input
    let query = {};
    if (title && instructorId) {
      query = { title, instructorId };
    } else if (instructorId && courseKey) {
      query = { instructorId, courseKey };
    } else {
      return res.status(400).json({ message: 'Invalid input' });
    }

    // Delete the course
    const deletedCourse = await Course.findOneAndDelete(query);

    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Remove the deleted course from the enrolledCourses array of all students
    await Student.updateMany(
      { enrolledCourses: deletedCourse._id },
      { $pull: { enrolledCourses: deletedCourse._id } }
    );

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
