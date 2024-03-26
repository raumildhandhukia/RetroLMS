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
const courseController = require("../controllers/course");
const itemController =  require("../controllers/item");
const userController = require("../controllers/user")
const submissionController = require("../controllers/submission")
const middleware = require("../middleware/authMiddleware")


// Route for all users to view the leaderboard
router.get("/leaderboard", (req, res) => {
  // Logic to view the leaderboard
  res.send({
    message: "You get the latest leaderboard.",
  });
});

// =============== User Profile routes =============== //

router.get('/allusers', userController.getAllUsers);


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



router.post("/createcourse", middleware(['instructor','admin']), courseController.createCourse);

router.get("/coursesById", courseController.getCourseByUserId);

router.get("/getAllCourses",courseController.getAllCourses)

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


// ======================= Routes for Items and Shop ====================== //

// Route to create a new item
router.post('/createitem', middleware(['admin', 'instructor']), itemController.createItem);

// Route to update an item by ID
router.patch('/items/:itemId',middleware(['admin', 'instructor']), itemController.updateItem);

// Route to get all items for a given course ID
router.get('/items/course/:courseId', middleware(['admin', 'instructor']), itemController.getItemsByCourse);

// Route to get a single item by ID (assuming the filter by course ID is handled internally based on user's login and permissions)
router.get('/items/:itemId', middleware(['admin', 'instructor']), itemController.getSingleItem);


// ======================= Routes for Submission ====================== //

router.post('/submit/:courseId', middleware(['student']),submissionController.createSubmission );

router.post('grading/:courseId/:taskId', middleware(['instructor']), submissionController.gradingTask )

module.exports = router;
