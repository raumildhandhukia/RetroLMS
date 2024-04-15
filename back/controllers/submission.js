const Submission = require("../models/submissionModel"); // Adjust the path as necessary
const User = require("../models/userModel");
const Course = require("../models/courseModel");
const Task = require("../models/taskModel");
const Student = require("../models/studentModel");
const Instructor = require("../models/instructorModel");
const JWT = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs").promises;
const xlsx = require("xlsx");
const mongoose = require("mongoose");

// Create a new submission
exports.gradingMutlipleSubmission = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const workbook = xlsx.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const item of data) {
      const { taskId, points, username } = item;
      const user = await User.findOne({ username });
      const studentId = user._id;

      if (!studentId || !taskId) {
        throw new Error("Missing studentId or taskId in some entries");
      }

      // Create a new submission document
      const submission = new Submission({
        studentId,
        taskId,
        points_recevied: points,
        current_state: true,
      });
      await submission.save({ session });

      // Update Task document by pushing new submission ID
      await Task.findByIdAndUpdate(
        taskId,
        {
          $push: { submissionId: submission._id },
        },
        { session }
      );
    }
    await session.commitTransaction();
    res.send("Submissions processed and tasks updated.");
  } catch (error) {
    await session.abortTransaction();
    console.error("Error processing file:", error);
    res.status(500).send(`Error processing file: ${error.message}`);
  } finally {
    session.endSession();
    try {
      await fs.unlink(req.file.path);
      console.log("File deleted successfully");
    } catch (err) {
      console.error("Failed to delete file:", err);
    }
  }
};

// Grading a submission by ID
exports.gradingSingleSubmission = async (req, res) => {
  let savedSubmission = null;
  try {
    const { studentId, taskId, pointsReceived, currentState } = req.body;

    // Create a new Submission document
    const submission = new Submission({
      studentId,
      taskId,
      points_recevied: pointsReceived,
      current_state: currentState,
    });

    // Save the submission to the database
    savedSubmission = await submission.save();

    try {
      // Attempt to update the corresponding Task document
      await Task.findByIdAndUpdate(
        taskId,
        { $push: { submissionId: savedSubmission._id } },
        { new: true }
      );
    } catch (error) {
      // If an error occurs while updating the Task, rollback the Submission creation
      console.error("Error updating task with submission ID:", error);
      if (savedSubmission) {
        await Submission.findByIdAndDelete(savedSubmission._id);
      }
      return res.status(500).json({
        message: "Failed to link submission to task, submission rolled back.",
      });
    }

    // Respond with the created submission
    res.status(201).json({
      message: "Submission added successfully",
      submission: savedSubmission,
    });
  } catch (error) {
    console.error("Error adding submission:", error);
    // If the initial submission creation fails, no need for rollback as it wasn't created
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.allocatePointsToStudent = async (req, res) => {
  const { submissionId } = req.params;
  const { points } = req.body;
  try {
    const submission = await Submission.findByIdAndUpdate(
      submissionId,
      { points },
      { new: true }
    );
    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSubmissionsForTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const submissions = await Submission.find({ taskId });
    const submissionsWithStudentName = await Promise.all(
      submissions.map(async (submission) => {
        const student = await Student.findOne({ _id: submission.studentId });
        const user = await User.findOne({ _id: student.userId });
        return {
          ...submission.toObject(),
          studentName: user.profile.firstName + " " + user.profile.lastName,
        };
      })
    );

    res.status(200).json(submissionsWithStudentName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentGrades = async (req, res) => {
  const { taskId } = req.params;
  const jwt = req.cookies && req.cookies.jwt;
  const decoded = JWT.decode(jwt);
  const username = decoded.username;
  const user = await User.findOne({ username });
  const student = await Student.findOne({ userId: user._id });
  const submission = await Submission.findOne({
    taskId,
    studentId: student._id,
  });

  if (!submission) {
    return res.status(404).json({ message: "Submission not found" });
  } else {
    res.status(200).json({ grade: submission.points });
  }
};
