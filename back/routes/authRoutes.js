const User = require("../models/userModel.js");
const Instructor = require("../models/instructorModel.js");
const Student = require("../models/studentModel.js");
const Admin = require("../models/adminModel.js");
const { faker } = require("@faker-js/faker");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const authMiddleware = require("../middleware/authMiddleware.js");
const JWT = require("jsonwebtoken");
const Task = require("../models/taskModel.js");
const Submission = require("../models/submissionModel.js");
const Course = require("../models/courseModel.js");

router.use(cookieParser());

const secretKey = process.env.JWT_SECRET_KEY;
function generateRandomUser() {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const username = faker.internet.userName(firstName, lastName);
  const password = faker.internet.password();
  return {
    username,
    password,
    role: "student",
    profile: {
      firstName,
      lastName,
      email: `${username}@gmail.com`,
    },
  };
}

async function generateRespectiveObject(userObject,role, userId) {
  if (role == "admin") {
    const newMod = new Admin({
      userId,
    });
    await newMod.save();
    return newMod.id;
  } else if (role == "instructor") {
    const newMod = new Instructor({
      userId,
      instructorPassword: userObject.password
    });
    await newMod.save();
    return newMod.id;
  } else {
    const newMod = new Student({
      userId,
    });
    await newMod.save();
    return newMod.id;
  }
}

router.post("/signup", async (req, res) => {
  try {
    const { username, password, role, profile } = req.body;
    // Check if the user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { "profile.email": profile.email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: `User: ${username} already exists` });
    }
    // Create a new user
    const newUser = new User({
      username,
      password,
      role,
      profile,
    });
    // Save the user to the database
    await newUser.save();
    const roleId = await generateRespectiveObject(newUser,role, newUser.id);
    res.status(201).json({
      message: `Role: ${role}, Username: ${username}. User created successfully. ${role}_ID = ${roleId}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    // Check if the password is correct
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create a JWT token with user roe and expiration time

    const token = jwt.sign({ username, role: user.role }, secretKey, {
      expiresIn: "24h",
    });

    // You may also create a refresh token if needed
    // const refreshToken = createRefreshToken();
    res.cookie("jwt", token, { httpOnly: true });
    let currency = null;
    let resetPassword = false;
    let makeStudentEditable = false;
    if (user.role === "student") {
      const student = await Student.findOne({ userId: user._id });
      currency = student.currentCurrency;
      resetPassword = student.resetPassword;
      const courseEnrolled = student.enrolledCourses;
      const course = await Course.find({ _id: { $in: courseEnrolled } });
      const instructor = await Instructor.find({
        _id: { $in: course.instructorId },
      });
      makeStudentEditable = instructor.makeStudentEditable;
    }
    res.status(201).json({
      profile: user.profile,
      username: user.username,
      role: user.role,
      currency: currency,
      resetPassword: resetPassword,
      makeStudentEditable,
    });
    // res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/logout", async (req, res) => {
  //clear the JWT token
  res.clearCookie("jwt", { httpOnly: true });
  res.status(200).json({ message: "Logout successful" });
});

router.get("/check-auth", async (req, res) => {
  // Retrieve the JWT from the request cookies
  const token = req.cookies && req.cookies["jwt"];

  if (!token) {
    // No JWT found, consider the user not authenticated
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the JWT signature and check expiration
    const decoded = jwt.verify(token, secretKey);

    const username = decoded.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let currency = null;
    let resetPassword = false;
    let makeStudentEditable = false;
    if (user.role === "student") {
      const student = await Student.findOne({ userId: user._id });
      currency = student.currentCurrency;
      resetPassword = student.resetPassword;
      const courseEnrolled = student.enrolledCourses;
      const course = await Course.find({ _id: { $in: courseEnrolled } });
      const firstCourse = course[0];
      const instructor = await Instructor.findOne({
        _id: firstCourse.instructorId,
      });
      makeStudentEditable = instructor.makeStudentEditable;
    }
    res.status(200).json({
      profile: user.profile,
      username: user.username,
      role: user.role,
      currency,
      resetPassword,
      makeStudentEditable,
    });

    // If verification succeeds, the JWT is valid
  } catch (error) {
    // If verification fails, the JWT is expired or invalid
    res.status(401).json({ message: "Unauthorized" });
  }
});

router.post("/studentSignup", async (req, res) => {
  const { count, courseId } = req.body;
  const students = [];
  for (let i = 0; i < count; i++) {
    const newUser = generateRandomUser();
    try {
      const user = new User(newUser);
      await user.save();

      const student = new Student({
        userId: user._id,
        studentPassword: newUser.password,
        resetPassword: true,
        enrolledCourses: [courseId],
      });
      await student.save();
      students.push(student);
      const tasks = await Task.find({ courseId });
      const taskIds = tasks.map((task) => task._id);
      await Promise.all(
        taskIds.map(async (taskId) => {
          const newSubmission = new Submission({
            taskId,
            studentId: student._id,
            points: 0,
          });
          return await newSubmission.save();
        })
      );
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error creating student" });
    }
  }
  res.status(201).json({
    message: `${count} students created and enrolled in course ${courseId}`,
    // students: students
  });
});

router.post("/updateStudent", async (req, res) => {
  try {
    const jwt = req.cookies && req.cookies.jwt;
    const decoded = JWT.decode(jwt);
    const username = decoded.username;
    const user = await User.findOne({ username });
    const userId = user._id;
    user.password = req.body.password;
    user.profile.firstName = req.body.firstName;
    user.profile.lastName = req.body.lastName;
    user.save();
    const student = await Student.findOne({ userId });
    student.resetPassword = false;
    student.studentPassword = "**********";
    student.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/regeneratePassword", async (req, res) => {
  try {
    const studentId = req.body.studentId;
    const student = await Student.findById(studentId);
    const user = await User.findById(student.userId);
    const password = faker.internet.password();
    user.password = password;
    user.save();
    student.resetPassword = true;
    student.studentPassword = password;
    student.save();
    res.status(200).json({ message: "Password Generated", password });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
