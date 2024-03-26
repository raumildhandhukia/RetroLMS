const Submission = require('../models/submissionModel'); // Adjust the path as necessary
const User = require("../models/userModel");
const Course = require("../models/courseModel");
const Student = require("../models/studentModel");
const Instructor = require("../models/instructorModel");
const JWT = require("jsonwebtoken");

// Create a new submission
exports.createSubmission = async (req, res) => {
  try {
    jwt = req.cookies && req.cookies.jwt;
    const decoded = JWT.decode(jwt);
    const username = decoded.username;
    const user = await User.findOne({ username });
    const studentId = user._id
    const subBody = {
        studentId : studentId,
        taskId : req.body.taskId,
        // points_received : req.body.points_received,
        current_state: req.body.current_state
    }
    console.log(subBody)
    const submission = new Submission(subBody);
    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Grading a submission by ID
exports.gradingTask = async (req, res) => {
  try {
    const { courseId,taskId } = req.params;
    console.log(courseId,taskId)
  //   const submission = await Submission.findByIdAndUpdate(id, req.body, { new: true });
  //   if (!submission) {
  //     return res.status(404).json({ message: 'Submission not found' });
  //   }
  //   res.json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// View all submissions for the logged-in user
exports.viewSubmissionsByCourse = async (req, res) => {
  // Assuming you have some way to identify the logged-in user and course ID is passed in query
  const { userId, courseId } = req.query;
  try {
    const submissions = await Submission.find({ studentId: userId, courseId: courseId }).populate('taskId');
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
    const submission = await Submission.findOne({ _id: submissionId, studentId: userId, courseId: courseId }).populate('taskId');
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    res.json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.allocatePointsToStudent = async(req, res) => {
  const { submissionId, pointsReceived } = req.body;

  if (!submissionId || pointsReceived === undefined) {
    return res.status(400).json({ message: 'Submission ID and points received are required.' });
  }

  try {
    const submission = await Submission.findByIdAndUpdate(
      submissionId,
      { points_received: pointsReceived },
      { new: true } // Return the updated document
    );

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
