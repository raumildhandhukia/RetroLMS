const Submission = require('../models/submissionModel'); // Adjust the path as necessary

// Create a new submission
exports.createSubmission = async (req, res) => {
  try {
    const decoded = JWT.decode(jwt);
    const username = decoded.username;
    const user = await User.findOne({ username });
    const studentId = user._id
    const subBody = {
        studentId : studentId,
        taskId : req.body.taskId,
        points_received : req.body.points_received,
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

// Update a submission by ID
exports.updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findByIdAndUpdate(id, req.body, { new: true });
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
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
