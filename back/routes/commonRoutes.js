const express = require("express");
const User = require("../models/userModel");
const Course = require("../models/courseModel");
const Student = require("../models/studentModel");
const Instructor = require("../models/instructorModel");
const router = express.Router();
const cookieParser = require("cookie-parser");
const JWT = require("jsonwebtoken");
router.use(cookieParser());
const taskController = require("../controllers/task");
// Route for all users to view the leaderboard
router.get("/leaderboard", (req, res) => {
  // Logic to view the leaderboard
  res.send({
    message: "You get the latest leaderboard.",
  });
});
router.get("/profile", async (req, res) => {
  try {
    jwt = req.cookies && req.cookies.jwt;
    const decoded = JWT.decode(jwt);
    const username = decoded.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      profile: user.profile,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/course/:courseId/leaderboard", middleware(['student','instructor', 'admin']), courseController.getLeaderboard);

router.post("/createcourse", middleware(['instructor','admin']), courseController.createCourse);

router.get("/coursesById", courseController.getCourseByUserId);

//router.get("/getAllCourses",courseController.getAllCourses);

// Route to add a course to the student
router.post("/enrollstudent",middleware(['student']),courseController.enrollCourse)

//Method to delete the course and also to remove it from the enrolledCourses array of all students.
router.delete("/courses", middleware(['admin', 'instructor']),courseController.deleteCourse);

// ================= Routes for Task =================== //

// Get all tasks
router.get("/task/getAll", taskController.getAllTasks);


// Get a single task by ID
router.get("/task/get/:id", taskController.getTaskById);

// Delete a single task by ID
router.delete("/task/delete/:id", taskController.deleteTask);

// Update a task by ID
router.put("/task/update/:id", taskController.updateTask);
// Create a task
router.post("/task/create", taskController.addTask);



module.exports = router;
