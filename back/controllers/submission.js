const Submission = require("../models/submissionModel"); // Adjust the path as necessary
const User = require("../models/userModel");
const Course = require("../models/courseModel");
const Task = require("../models/taskModel");
const Student = require("../models/studentModel");
const Instructor = require("../models/instructorModel");
const JWT = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const xlsx = require("xlsx");

// Create a new submission
exports.gradingMutlipleSubmission = async (req, res) => {
  try {
    if (req.file) {
      const workbook = xlsx.readFile(req.file.path);
      // Assuming the first sheet in the workbook; adjust as needed
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      // Convert sheet to JSON
      const data = xlsx.utils.sheet_to_json(worksheet);
      for (const item of data) {
        const username = item.username;
        const user = await User.findOne({ username });
        const studentId = user._id;
        const subBody = {
          studentId: studentId,
          taskId: item.taskId,
          points_recevied: item.mark,
          current_state: true,
        };
        console.log(subBody);
        const submission = new Submission(subBody);

        await submission.save();
        try {
          // Attempt to update the corresponding Task
          await Task.findByIdAndUpdate(
            subBody.taskId,
            { $push: { submissionId: submission._id } }, // Use $push to add the new task's ID to the task array
            { new: true, upsert: false } // upsert:false ensures that no new Course is created if it doesn't exist
          );
        } catch (taskUpdateError) {
          // If an error occurs during the course update, log it and return an error response
          console.error(
            "Error updating task with new submission:",
            taskUpdateError
          );
          await Submission.findByIdAndDelete(submission._id);
          return res.status(500).json({
            message: "Error updating task with new submission.",
          });
        }
        // If everything goes well, return success response
        res.status(201).json({
          message: `Submission created successfully.`,
        });
      }

      // Optionally, delete the file after parsing if you don't need to keep it
      fs.unlinkSync(req.file.path);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Grading a submission by ID
exports.gradingTask = async (req, res) => {
  try {
    const { courseId, taskId } = req.params;
    console.log(courseId, taskId);
    const submission = await Submission.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// View all submissions for the logged-in user
exports.viewSubmissionsByCourse = async (req, res) => {
  // Assuming you have some way to identify the logged-in user and course ID is passed in query
  const { userId, courseId } = req.query;
  try {
    const submissions = await Submission.find({
      studentId: userId,
      courseId: courseId,
    }).populate("taskId");
    res.json(submissions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// View a single submission for the logged-in user filtered by course ID
exports.viewSingleSubmission = async (req, res) => {
  const { submissionId } = req.params;
  const { userId, courseId } = req.query;
  try {
    const submission = await Submission.findOne({
      _id: submissionId,
      studentId: userId,
      courseId: courseId,
    }).populate("taskId");
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.allocatePointsToStudent = async (req, res) => {
  const { submissionId, pointsReceived } = req.body;

  if (!submissionId || pointsReceived === undefined) {
    return res
      .status(400)
      .json({ message: "Submission ID and points received are required." });
  }

  try {
    const submission = await Submission.findByIdAndUpdate(
      submissionId,
      { points_received: pointsReceived },
      { new: true } // Return the updated document
    );

    if (!submission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
