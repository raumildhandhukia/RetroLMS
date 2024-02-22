const express = require("express");
const User = require("../models/userModel");
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

//not working, wait for PR
router.put("/courses", async (req, res) => {
  try {
    const { title, instructorId, cart } = req.body;
    // Check if the user already exists
    const existingCourse = await User.findOne({ title });
    if (existingCourse) {
      return res
        .status(400)
        .json({ message: `Course: ${title} already exists` });
    }
    // Create a new user
    const newCourse = new Course({
      title,
      instructorId,
      cart,
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

module.exports = router;
