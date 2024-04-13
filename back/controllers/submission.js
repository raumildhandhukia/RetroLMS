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
exports.gradingSingleSubmission = async (req, res) => {
  let savedSubmission = null;
  try {
    const { studentId, taskId, pointsReceived, currentState } = req.body;

    // Create a new Submission document
    const submission = new Submission({
      studentId,
      taskId,
      points_recevied: pointsReceived,
      current_state: currentState
    });

    // Save the submission to the database
    savedSubmission = await submission.save();

    try {
      // Attempt to update the corresponding Task document
      console.log(savedSubmission._id)
      await Task.findByIdAndUpdate(
        taskId,
        { $push: { submissionId: savedSubmission._id } }, // Use $push to add the submission ID to the task's submissionId array
        { new: true } // Return the updated document
      );
    } catch (error) {
      // If an error occurs while updating the Task, rollback the Submission creation
      console.error("Error updating task with submission ID:", error);
      if (savedSubmission) {
        await Submission.findByIdAndDelete(savedSubmission._id);
      }
      return res.status(500).json({ message: "Failed to link submission to task, submission rolled back." });
    }

    // Respond with the created submission
    res.status(201).json({
      message: "Submission added successfully",
      submission: savedSubmission
    });
  } catch (error) {
    console.error("Error adding submission:", error);
    // If the initial submission creation fails, no need for rollback as it wasn't created
    res.status(500).json({ message: "Internal Server Error" });
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
