const express = require('express');
const router = express.Router();

// Route for students to submit a task
router.post("/tasks", (req, res) => {
  // Logic for students to submit a task
});

// Route for students to view points earned per task
router.get("/points", (req, res) => {
  // Logic for students to view points earned per task
});

// Route for students to trade coins for items in the shop
router.post("/shop/trade", (req, res) => {
  // Logic for students to trade coins for items in the shop
});

module.exports = router;
