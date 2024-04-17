const User = require("../models/userModel");
const Course = require("../models/courseModel");
const Student = require("../models/studentModel");
const Instructor = require("../models/instructorModel");
const Submission = require("../models/submissionModel");
const Transaction = require("../models/transactionModel");
const Task = require("../models/taskModel");
const Item = require("../models/itemModel");
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");

const courseController = {
  getEnrolledStudents: async (req, res) => {
    try {
      const { courseId } = req.params;
      const students = await Student.find({ enrolledCourses: courseId });
      const studentsData = await Promise.all(
        students.map(async (student) => {
          const user = await User.findById(student.userId);
          return {
            studentId: student._id,
            userId: student.userId,
            userName: user.username,
            fullName: user.profile.firstName + " " + user.profile.lastName,
            password: student.studentPassword,
          };
        })
      );
      res.status(200).json(studentsData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deleteStudentFromCourse: async (req, res) => {
    try {
      const { studentId } = req.params;
      await Student.findByIdAndDelete(studentId);
      const submissions = await Submission.find({ studentId });
      const submissionIds = submissions.map((submission) => submission._id);
      await Submission.deleteMany({ _id: { $in: submissionIds } });
      const transactions = await Transaction.find({ studentId });
      const transactionIds = transactions.map((transaction) => transaction._id);
      await Transaction.deleteMany({ _id: { $in: transactionIds } });
      res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  createCourse: async (req, res) => {
    try {
      const jwt = req.cookies && req.cookies.jwt;
      const decoded = JWT.decode(jwt);
      const username = decoded.username;
      const user = await User.findOne({ username });
      const userId = user._id;
      const instructor = await Instructor.findOne({ userId });
      const instructorId = instructor._id;
      const { title, courseKey, details } = req.body;
      let course = await Course.findOne({ title });

      if (course) {
        return res.status(400).json({
          message: "A course with the same title already exists",
        });

        // No need to update the instructor here since the course already exists
      } else {
        // Create a new course
        course = new Course({
          title,
          details,
          courseKey,
          instructorId,
        });
        await course.save();

        instructor.coursesTeaching.push(course._id);
        await instructor.save();
      }

      res.status(201).json({
        message: `Course '${title}' created successfully`,
        course,
      });
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  editCourse: async (req, res) => {
    try {
      // Authorize user
      // const jwt = req.cookies && req.cookies.jwt;
      // const decoded = JWT.decode(jwt);
      // const username = decoded.username;
      // const user = await User.findOne({ username });

      const { courseId, title, courseKey, details } = req.body;
      // Check if there's another course with the same title
      const existingTitleCourse = await Course.findOne({ title });
      if (existingTitleCourse && existingTitleCourse._id != courseId) {
        return res.status(400).json({
          error: "Another course with the same title already exists.",
        });
      }

      // Check if there's another course with the same courseKey
      const existingKeyCourse = await Course.findOne({ courseKey });
      if (existingKeyCourse && existingKeyCourse._id != courseId) {
        return res.status(400).json({
          error: "Another course with the same course key already exists.",
        });
      }

      // Update the course
      await Course.findByIdAndUpdate(courseId, { title, courseKey, details });
      res.status(200).json({ message: "Course updated successfully." });
    } catch (err) {
      console.error("Error updating course:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  enrollCourse: async (req, res) => {
    try {
      const { courseId } = req.body;
      console.log(courseId);
      const jwt = req.cookies && req.cookies.jwt;
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
      const { courseId } = req.body;
      const students = await Student.find({ enrolledCourses: courseId });
      const studentIds = students.map((student) => student._id);
      for (const studentId of studentIds) {
        await Student.findByIdAndDelete(studentId);
        const submissions = await Submission.find({ studentId });
        const submissionIds = submissions.map((submission) => submission._id);

        // Delete submissions
        await Submission.deleteMany({ _id: { $in: submissionIds } });

        const transactions = await Transaction.find({ studentId });
        const transactionIds = transactions.map(
          (transaction) => transaction._id
        );

        // Delete transactions
        await Transaction.deleteMany({ _id: { $in: transactionIds } });
      }

      const tasks = await Task.find({ courseId });
      const taskIds = tasks.map((task) => task._id);
      await Task.deleteMany({ _id: { $in: taskIds } });
      const deletedCourse = await Course.findByIdAndDelete(courseId);

      const items = await Item.find({ courseId });
      const itemIds = items.map((item) => item._id);
      await Item.deleteMany({ _id: { $in: itemIds } });

      if (!deletedCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

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
      let courses;
      if (user.role === "student") {
        // If the user is a student, fetch enrolled courses
        const student = await Student.findOne({
          userId: user.id,
        }).populate("enrolledCourses");

        courses = student.enrolledCourses;
      } else if (user.role === "instructor") {
        // If the user is an instructor, fetch courses based on instructorId
        const ins = await Instructor.findOne({ userId: user.id });
        courses = await Course.find({ instructorId: ins.id });
      } else {
        return res.status(400).json({ message: "Invalid user role" });
      }
      // const coursesTS = {
      //   _id: courses._id,
      //   title: courses.title,
      //   courseKey: courses.courseKey,
      // };

      const coursesTS = courses.map((course) =>
        Object.assign(
          {},
          {
            _id: course._id,
            title: course.title,
            courseKey: course.courseKey,
            details: course.details,
          }
        )
      );
      return res.status(200).json(coursesTS);
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

  // getStudentsByCourseId: async (req, res) => {
  //   try {
  //     if (!req.params) {
  //       res.status(422).json({ message: "Missing Parameter" });
  //     }
  //     const courseId = req.params.courseId;
  //     const students = await Student.find({
  //       enrolledCourses: courseId,
  //     }).populate("userId");
  //     if (!students.length) {
  //       return res
  //         .status(404)
  //         .json({ message: "No students found enrolled in this course" });
  //     }
  //     res.status(200).json(students.map((student) => student.userId.profile));
  //   } catch (err) {
  //     res.status(500).json({ message: err.message });
  //   }
  // },

  getLeaderBoard: async (req, res) => {
    const { courseId } = req.body;
    const taskIds = await Task.find({ courseId }).select("_id");
    const studentIds = await Student.find({
      enrolledCourses: courseId,
    }).populate("userId");
    const submissions = await Submission.find({
      taskId: { $in: taskIds },
      studentId: { $in: studentIds },
    });
    const studentScores = studentIds.map((studentId) => {
      const studentSubmissions = submissions.filter(
        (submission) => submission.studentId == studentId.id
      );
      const score = studentSubmissions.reduce((acc, submission) => {
        return acc + submission.points;
      }, 0);

      const name =
        studentId.userId.profile.firstName +
        " " +
        studentId.userId.profile.lastName;
      return { name, score };
    });

    studentScores.sort((a, b) => b.score - a.score);
    res.status(200).json(studentScores);
  },

  //   getLeaderBoard: async (req, res) => {
  //     const { courseId } = req.body;
  //     console.log(courseId);
  //     try {
  //       let matchStage = {};
  //       if (courseId) {
  //         matchStage = { enrolledCourses: new mongoose.Types.ObjectId(courseId) };

  //         const pipe = [
  //           {
  //             $match: matchStage,
  //           },
  //         ];

  //         const pipeline = [
  //           {
  //             $match: matchStage,
  //           },
  //           {
  //             $lookup: {
  //               from: "courses",
  //               localField: "enrolledCourses",
  //               foreignField: "_id",
  //               as: "courseDetails",
  //             },
  //           },
  //           {
  //             $unwind: "$courseDetails",
  //           },
  //           {
  //             $lookup: {
  //               from: "users",
  //               localField: "userId",
  //               foreignField: "_id",
  //               as: "userDetails",
  //             },
  //           },
  //           {
  //             $unwind: "$userDetails",
  //           },
  //           {
  //             $sort: { currentCurrency: -1 },
  //           },
  //           {
  //             $group: {
  //               _id: "$courseDetails._id",
  //               students: {
  //                 $push: {
  //                   username: "$userDetails.username",
  //                   currentCurrency: "$currentCurrency",
  //                 },
  //               },
  //             },
  //           },
  //           {
  //             $project: {
  //               courseId: "$_id",
  //               students: 1,
  //               _id: 0,
  //             },
  //           },
  //         ];

  //         const leaderboard = await Student.aggregate(pipeline);

  //         res.send({
  //           leaderboard,
  //         });
  //       } else {
  //         res.status(500).send("CourseId is empty");
  //       }
  //     } catch (error) {
  //       console.error("Failed to retrieve leaderboard:", error);
  //       res.status(500).send("Error retrieving leaderboard");
  //     }
  //   },
};

module.exports = courseController;
