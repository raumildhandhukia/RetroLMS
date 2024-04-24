// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Course = require("../models/courseModel");
const Student = require("../models/studentModel");
const Instructor = require("../models/instructorModel");
// Middleware function to authenticate and authorize requests
const authMiddleware = (allowedRoles) => {
  return async (req, res, next) => {
    // Extract the JWT token from the request headers
    const jwtvalue = req.cookies && req.cookies.jwt;

    if (!jwtvalue) {
      // If token is not provided, send an unauthorized response
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    // Verify the JWT token
    jwt.verify(jwtvalue, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        // If token is invalid or expired, send an unauthorized response
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      } else {
        // Extract the role from the decoded token
        const role = decoded.role;

        // Check if the role is one of the allowed values
        if (allowedRoles.includes(role)) {
          // Add role and username to the request object
          const { courseId } = req.params;
          const username = decoded.username;
          const user = await User.findOne({ username });
          const userId = user.id;
          const course = await Course.findById(courseId);
          if (!course)
            return res.status(404).json({ message: "Course not found" });

          // Check if the user is a student enrolled in the course
          const student = await Student.findOne({
            userId,
            enrolledCourses: courseId,
          });
          if (student) return next(); // Student is enrolled in the course, proceed

          // Check if the user is an instructor teaching the course
          const instructor = await Instructor.findOne({
            userId,
            coursesTeaching: courseId,
          });
          if (instructor) return next(); // Instructor is teaching the course, proceed
          // If neither, return an error
          res.status(403).json({
            message: "User is not enrolled in or teaching the course",
          });
          //   next(); // Authorized, proceed to the next middleware or route handler
        } else {
          // If role is invalid, send an unauthorized response
          return res.status(401).json({
            message: "Forbidden: Privilge is not provide for this user",
          });
        }
      }
    });
  };
};
module.exports = authMiddleware;
