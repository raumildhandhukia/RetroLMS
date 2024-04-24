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
const itemController = require("../controllers/item");
const userController = require("../controllers/user");
const submissionController = require("../controllers/submission");
const middleware = require("../middleware/authMiddleware");
const multer = require("multer");
const onlyRolesMiddleware = require("../middleware/onlyRolesMiddleware");
const upload = multer({ dest: "uploads/" });
const notificationController = require("../controllers/notificationController");

// Route for all users to view the leaderboard
router.post("/leaderboard", courseController.getLeaderBoard);

// =============== User Profile routes =============== //

router.get("/allusers", userController.getAllUsers);

router.get("/getAllInstructors", userController.getInstructors);

router.delete("/deleteInstructor/:username", userController.deleteInstructor);

router.post("/updateInstructorDetails/:username",userController.updateInstructorObject)

router.get("/profile", async (req, res) => {
  try {
    jwt = req.cookies && req.cookies.jwt;
    const decoded = JWT.decode(jwt);
    const username = decoded.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let currency = null;
    let resetPassword = false;
    let studentId = null;
    let makeStudentEditable = false;
    if (user.role === "student") {
      const student = await Student.findOne({ userId: user._id });
      currency = student.currentCurrency;
      resetPassword = student.resetPassword;
      studentId = student._id;
    } else if (user.role === "instructor") {
      const instructor = await Instructor.findOne({ userId: user._id });
      makeStudentEditable = instructor.makeStudentEditable;
    }
    res.status(200).json({
      profile: user.profile,
      username: user.username,
      role: user.role,
      currency: currency,
      resetPassword: resetPassword,
      studentId: studentId,
      makeStudentEditable,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/updateInstrutor", userController.updateInstructor);
router.post("/createcourse", courseController.createCourse);
router.post("/editCourse", courseController.editCourse);

router.get("/coursesById", courseController.getCourseByUserId);

router.get("/getAllCourses", courseController.getAllCourses);

// Route to add a course to the student
router.post("/enrollstudent", courseController.enrollCourse);

// Route to delete a student from course
router.delete(
  "/deleteStudent/:studentId",
  courseController.deleteStudentFromCourse
);

router.get(
  "/getEnrolledStudents/:courseId",
  courseController.getEnrolledStudents
);

router.get(
  "/getEnrolledStudentsByCourseId/:courseId",
  courseController.getEnrolledStudentsByCourseIdExcel
);
//Method to delete the course and also to remove it from the enrolledCourses array of all students.
router.delete("/courses", courseController.deleteCourse);

//Method to get Students enrolled in given course
// router.get(
//   "/course/:courseId",
//   middleware(["student", "instructor"]),
//   courseController.getStudentsByCourseId
// );

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

// Get Tasks By Course ID ()
router.post("/task/getTasksByCourseId", taskController.getTasksByCourseId);

// ======================= Routes for Items and Shop ====================== //

// Route to create a new item
router.post("/createitem", itemController.createItem);

// Route to update an item by ID
router.patch("/items/:itemId", itemController.updateItem);

// Route to get all items for a given course ID
router.get("/items/course/:courseId", itemController.getItemsByCourse);

router.delete("/items/:itemId", itemController.deleteItem);

// Route to get a single item by ID (assuming the filter by course ID is handled internally based on user's login and permissions)
router.get(
  "/items/:itemId",
  middleware(["admin", "instructor"]),
  itemController.getSingleItem
);

// ======================= Routes for Submission ====================== //
router.get(
  "/getSubmissionsByTask/:taskId",
  submissionController.getSubmissionsForTask
);
router.put(
  "/updateSubmission/:submissionId",
  submissionController.allocatePointsToStudent
);

router.post(
  "/gradingMutipleSubmission",
  // middleware(["instructor"]),
  upload.single("file"),
  submissionController.gradingMutlipleSubmission
);

router.post(
  "/gradingSingleSubmission",
  submissionController.gradingSingleSubmission
);

router.get("/getGradePoints/:taskId", submissionController.getStudentGrades);

// ======================= Routes for Transaction ====================== //
router.post("/requestItem", itemController.requestItem);
router.get("/getTransactions/:courseId", itemController.getTransactions);
router.get(
  "/getTrasactionsByItemByStudent/:itemId",
  itemController.getTransactionByItemByStudent
);
router.post(
  "/updateTransaction/:transactionId",
  itemController.updateTransaction
);
router.get(
  "/getTransactionsByItem/:itemId",
  itemController.getTransactionByItem
);

// ======================= Routes for Notification ====================== //
router.get("/notifications", notificationController.getNotifications);
router.post("/updateNotifications", notificationController.updateNotifications);

module.exports = router;
