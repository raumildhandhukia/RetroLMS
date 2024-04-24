const User = require("../models/userModel.js");
const Instructor = require("../models/instructorModel.js");
const JWT = require("jsonwebtoken");

const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password"); // Excludes the password from the result set for security
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  updateInstructor: async (req, res) => {
    try {
      const token = req.cookies.jwt;
      const decoded = JWT.decode(token);
      const username = decoded.username;
      const user = await User.findOne({ username });
      const userId = user._id;
      const instructor = await Instructor.findOne({ userId });
      const { makeStudentEditable } = req.body;
      instructor.makeStudentEditable = makeStudentEditable;
      await instructor.save();
      res.status(200).json(instructor);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  getInstructors: async (req, res) => {
    try {
      const instructors = await User.find({ role: "instructor" });
      res.status(200).json(instructors);
    } catch (error) {
      console.error("Failed to retrieve instructors:", error);
      res.status(500).send("Error retrieving instructors");
    }
  },
};
module.exports = userController;
