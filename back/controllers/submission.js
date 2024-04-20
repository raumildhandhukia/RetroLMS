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

function checkData(data) {
  val = new Set();
  for (const item of data) {
    if (val.has(item.username)) {
      return false;
    }
    val.add(item.username);
  }
  return true;
}

async function isEnrolled(data) {
  for (const item of data) {
    const user = await User.findOne({ username: item.username });
    const studentUserId = await Student.findOne({ userId: user._id });
    if (!studentUserId) {
      return true;
    }
  }
  return false;
}
exports.gradingMutlipleSubmission = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const workbook = xlsx.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);

  const courseId = Task.findOne({ _id: req.body.taskId });
  const workflow = checkData(data);
  const isEnrolledFlag = await isEnrolled(data);
  if (!workflow) {
    return res.status(400).send({
      message: "Duplicate username found in excel sheet so skip excel parsing.",
    });
  }
  if (isEnrolledFlag) {
    return res.status(400).send({
      message: "User is not enrolled in the course so skip excel parsing.",
    });
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  skipUserNames = [];
  try {
    const taskId = req.body.taskId;
    for (const item of data) {
      const { points, username } = item;
      const user = await User.findOne({ username });
      const studentUserId = await Student.findOne({ userId: user._id });
      const userStudentId = studentUserId._id;

      if (!userStudentId || !taskId) {
        throw new Error("Missing userStudentId or taskId in some entries");
      }

      skipUserNames.push(username);
      try {
        const submission = await Submission.findOne({
          taskId: taskId,
          studentId: userStudentId,
        });
        if (submission) {
          const oldPoints = submission.points; // Existing points
          submission.points = points;
          await submission.save();
          const student = await Student.findOne({
            _id: userStudentId,
          });
          if (student) {
            const pointsDifference = points - oldPoints;
            student.currentCurrency += pointsDifference;
            await student.save();
          }
        } else {
          res.status(400).send({
            message: `Username: ${username} not enrolled in given course so skip excel parsing`,
          });
        }
      } catch (error) {
        console.error(
          "Error updating submission model after for duplicate:",
          error
        );
      }
    }
    await session.commitTransaction();
    if (skipUserNames.length > 0) {
      res.send({
        message: `Marks Updated for marks of ${skipUserNames.length} students.`,
      });
    } else {
      res.send({
        message:
          "Submissions processed, tasks updated, and student tasks marked as completed for all users",
      });
    }
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

// Get all submissions for given Task ID

// Grading a submission by ID
exports.gradingSingleSubmission = async (req, res) => {
  let savedSubmission = null;
  try {
    const { studentId, taskId, pointsReceived, currentState } = req.body;

    // Create a new Submission document
    const submission = new Submission({
      studentId,
      taskId,
      points: pointsReceived,
    });
    savedSubmission = await submission.save();

    try {
      await Task.findByIdAndUpdate(
        taskId,
        { $push: { submissionId: savedSubmission._id } },
        { new: true }
      );
      // Update Student document by adding taskId to completedTask
      await Student.findOneAndUpdate(
        { userId: studentId },
        {
          $push: { completedTask: taskId },
        },
        { session }
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
    const submission = await Submission.findById(submissionId);
    const student = await Student.findOne({ _id: submission.studentId });
    difference = points - submission.points;
    student.currentCurrency += difference;
    submission.points = points;
    await student.save();
    await submission.save();
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
    return res.status(401).json({ message: "Submission not found" });
  } else {
    res.status(200).json({ grade: submission.points });
  }
};
