const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  InstructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor'
  },
  Cart: {
    type: String,
    required: true
  },
  Task:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }]
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
