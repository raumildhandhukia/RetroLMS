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
      const instructors = await User.find({ role: "instructor" }).select(
        "-password"
      );
      const returnObj = instructors.map((instructor) => ({
        firstName: instructor.profile.firstName,
        lastName: instructor.profile.lastName,
        username: instructor.username,
        email: instructor.profile.email,
      }));
      res.status(200).json(returnObj);
    } catch (error) {
      console.error("Failed to retrieve instructors:", error);
      res.status(500).send("Error retrieving instructors");
    }
  },
  deleteInstructor: async (req, res) => {
    const username = req.params.username;
    try {
      // First, find the user by username to get the userId
      const user = await User.findOne({ username: username });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // Use the userId to delete the instructor
      const result = await Instructor.findOneAndDelete({ userId: user._id });
      // if (!result) {
      //     return res.status(201).send({ message: "Instructor not found" });
      // }

      // Optionally, also delete the user associated with the instructor
      await User.findByIdAndDelete(user._id);

      res
        .status(200)
        .send({ message: "Instructor and user deleted successfully" });
    } catch (error) {
      console.error("Error deleting instructor:", error);
      res
        .status(500)
        .send({ message: "Error deleting instructor", error: error.message });
    }
  },
  updateInstructorObject: async (req, res) => {
    const username = req.params.username;
    const { firstName, lastName, email, password } = req.body;

    try {
      const updatedInstructor = await User.findOneAndUpdate(
        { username: username },
        {
          $set: {
            "profile.firstName": firstName,
            "profile.lastName": lastName,
            "profile.email": email,
            password: password,
          },
        },
        { new: true } // This option returns the document after update was applied
      );

      if (!updatedInstructor) {
        return res.status(404).json({ message: "Instructor not found" });
      }

      res.json(updatedInstructor);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating instructor", error: error.message });
    }
  },
};
module.exports = userController;
