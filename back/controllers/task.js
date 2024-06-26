const Task = require("../models/taskModel");
const JWT = require("jsonwebtoken");
const User = require("../models/userModel.js");
const Instructor = require("../models/instructorModel.js");
const Student = require("../models/studentModel.js");
const Course = require("../models/courseModel");
const Submission = require("../models/submissionModel");

exports.addTask = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(500).json({ sendMsg: "Need more information" });
    }
    const taskObj = {
      title: req.body.title,
      details: req.body.details,
      point: req.body.point,
      courseId: req.body.courseId,
      // deadline: req.body.deadline,
      graded: false,
      submissionIds: [],
      // submissionId: req.body.submissionId,
    };
    const taskItem = new Task(taskObj);
    const students = await Student.find({ enrolledCourses: taskObj.courseId });
    students.forEach(async (student) => {
      const submission = new Submission({
        taskId: taskItem._id,
        studentId: student._id,
        points: 0,
      });
      await submission.save();
      taskItem.submissionIds.push(submission._id);
    });
    // Save the new Task document
    const savedTask = await taskItem.save();
    try {
      // Attempt to update the corresponding Course
      await Course.findByIdAndUpdate(
        taskObj.courseId,
        { $push: { task: savedTask._id } }, // Use $push to add the new task's ID to the task array
        { new: true, upsert: false } // upsert:false ensures that no new Course is created if it doesn't exist
      );
    } catch (courseUpdateError) {
      // If an error occurs during the course update, log it and return an error response
      await Task.findByIdAndDelete(savedTask._id);
      return res.status(500).json({
        message: "Error updating course with new task.",
      });
    }

    // If everything goes well, return success response
    res.status(201).json({
      message: `Task: ${taskObj.title} created successfully.`,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.updateTask = async (req, res) => {
  const updates = req.body;
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "Request body is empty" });
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    jwt = req.cookies && req.cookies.jwt;
    const decoded = JWT.decode(jwt);
    const username = decoded.username;
    const user = await User.findOne({ username });
    if (user.role === "student") {
      // If the user is a student, fetch enrolled courses
      const student = await Student.findOne({
        userId: user._id,
      }).populate("enrolledCourses");
      return res.status(200).json({ courses: student.enrolledCourses });
    } else if (user.role === "instructor") {
      // If the user is an instructor, fetch courses based on instructorId
      const instructorId = await Instructor.findOne({
        userId: user._id,
      });
      const tasks = await Task.find(instructorId).populate(
        "courseId submissionId"
      );
      res.status(200).json(tasks);
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    const submissions = await Submission.find({ taskId: req.params.id });
    const submissionIds = submissions.map((submission) => submission._id);
    await Submission.deleteMany({ _id: { $in: submissionIds } });
    if (task) {
      res.status(200).json({ message: "Task deleted successfully" });
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTasksByCourseId = async (req, res) => {
  try {
    const tasks = await Task.find({ courseId: req.body.courseId });
    if (tasks) {
      res.status(200).json(tasks);
    } else {
      res.status(404).json({ message: "Tasks not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
