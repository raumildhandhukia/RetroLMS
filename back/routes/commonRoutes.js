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

router.put("/courses", async (req, res) => {
  try {
    const { title, instructorId, courseKey } = req.body;
    const existingCourse = await Course.findOne({ title });
    if (existingCourse) {
      return res
        .status(400)
        .json({ message: `Course: ${title} already exists` });
    }
    // Create a new user
    const newCourse = new Course({
      title,
      instructorId,
      courseKey,
    });
    // Save the user to the database
    await newCourse.save();
    res.status(201).json({
      message: `Course: ${title} created successfully.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Get endpoint to fetch courses based on user role
router.get("/courses", async (req, res) => {
  try {
    jwt = req.cookies && req.cookies.jwt;
    const decoded = JWT.decode(jwt);
    const username = decoded.username;
    const user = await User.findOne({ username });
    if (user.role === "student") {
      // If the user is a student, fetch enrolled courses
      const student = await Student.findOne({
        userId: user.id,
      }).populate("enrolledCourses");
      return res.status(200).json({ courses: student.enrolledCourses });
    } else if (user.role === "instructor") {
      // If the user is an instructor, fetch courses based on instructorId
      const instructorId = await Instructor.findOne({
        userId: user.id,
      });
      const courses = await Course.find({ instructorId });
      return res.status(200).json({ courses });
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to add a course to the student
router.post("/add-course", async (req, res) => {
  try {
    const { courseId, username } = req.body;
    const user = await User.findOne({ username });

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update the student's enrolledCourses array
    const updatedStudent = await Student.findOneAndUpdate(
      { userId: user.id },
      { $addToSet: { enrolledCourses: courseId } },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Course added successfully", student: updatedStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
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

module.exports = router;
