const User = require("../models/userModel.js");

const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password"); // Excludes the password from the result set for security
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = userController;
