const User = require("../models/userModel");
const Course = require("../models/courseModel");
const Student = require("../models/studentModel");
const Instructor = require("../models/instructorModel");
const JWT = require("jsonwebtoken");

const courseController = {
  createCourse: async (req, res) => {
    try {
      const { title, instructorId, courseKey } = req.body;

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
      console.log(newCourse);
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
  },

  enrollCourse: async (req, res) => {
    try {
      const { courseId } = req.body;
      jwt = req.cookies && req.cookies.jwt;
      const decoded = JWT.decode(jwt);
      const username = decoded.username;
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

      res.status(200).json({
        message: "Course added successfully",
        student: updatedStudent,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deleteCourse: async (req, res) => {
    try {
      const { title, instructorId, courseKey } = req.body;

      // Find the course to be deleted based on the input
      let query = {};
      if (title && instructorId) {
        query = { title, instructorId };
      } else if (instructorId && courseKey) {
        query = { instructorId, courseKey };
      } else {
        return res.status(400).json({ message: "Invalid input" });
      }

      // Delete the course
      const deletedCourse = await Course.findOneAndDelete(query);

      if (!deletedCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Remove the deleted course from the enrolledCourses array of all students
      await Student.updateMany(
        { enrolledCourses: deletedCourse._id },
        { $pull: { enrolledCourses: deletedCourse._id } }
      );

      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getCourseByUserId: async (req, res) => {
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
        const courses = await Course.find({ instructorId: user._id });
        return res.status(200).json({ courses });
      } else {
        return res.status(400).json({ message: "Invalid user role" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getAllCourses: async (req, res) => {
    try {
      // If you want to populate instructorId or task fields to get detailed information, you can use .populate()
      const courses = await Course.find().populate("instructorId");
      res.status(200).json(courses);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
module.exports = courseController;
