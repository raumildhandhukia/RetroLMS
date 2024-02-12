const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  Details: {
    type: String,
    required: true
  },
  Points: {
    type: Number,
    required: true
  },
  CourseId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
