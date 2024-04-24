const mongoose = require("mongoose");
const Notification = require("../models/notificationModel");
const Course = require("../models/courseModel");
const Instructor = require("../models/instructorModel");
const User = require("../models/userModel");
const JWT = require("jsonwebtoken");
const Student = require("../models/studentModel");

const storeNotification = async (data) => {
  try {
    if (data.studentId) {
      const student = await Student.findById(data.studentId);
      const userId = student.userId;
      const notification = new Notification({
        userId: userId,
        message: data.message,
        read: false,
      });
      await notification.save();
    } else {
      const course = await Course.findById(data.courseId);
      const instructor = await Instructor.findById(course.instructorId);
      const userId = instructor.userId;
      const notification = new Notification({
        userId: userId,
        courseId: data.courseId,
        message: data.message,
        read: false,
      });
      await notification.save();
    }
  } catch (error) {}
};

const getNotifications = async (req, res) => {
  try {
    const jwt = req.cookies && req.cookies.jwt;
    const decoded = JWT.decode(jwt);
    const username = decoded.username;
    const user = await User.findOne({ username });
    const userId = user._id;
    const courseId = req.body.courseId;
    const role = req.body.role;
    let notifications;
    if (role === "instructor") {
      notifications = await Notification.find({ userId, courseId });
    } else {
      notifications = await Notification.find({ userId });
    }
    notifications.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).send(notifications);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

const updateNotifications = async (req, res) => {
  try {
    const notifications = req.body.notifications;
    for (let i = 0; i < notifications.length; i++) {
      await Notification.findByIdAndUpdate(notifications[i]._id, {
        read: true,
      });
    }
    res.status(200).send({ message: "Notifications updated" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = { storeNotification, getNotifications, updateNotifications };
