const Task = require("../models/taskModel");

exports.addTask = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(500).json({ sendMsg: "Need more informations" });
    }
    const taskObj = {
      title: req.body.title,
      details: req.body.details,
      point: req.body.point,
      courseId: req.body.courseId,
      deadline: req.body.deadline,
      submissionId: req.body.submissionId,
    };

    const taskItem = new Task(taskObj);
    const savedDoc = await taskItem.save();
    res.status(201).json({
      message: `Task: ${title} created successfully.`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.updateTask = async (req, res) => {
  const updates = req.body;
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'Request body is empty' });
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllTask = async (req, res) => {
  try {
    let query = {};
    if (req.body.userId) {
      query.userId = req.body.userId;
    }
    const tasks = await Task.find(query).populate('courseId submissionId');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (task) {
      res.status(200).json({ message: 'Task deleted successfully' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('courseId submissionId');
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

