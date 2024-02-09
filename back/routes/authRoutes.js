const User = require('../models/userModel.js')
const express = require('express')
const router = express.Router()

router.post('/signup', async (req, res) => {
    try {
    const { username, password, role, profile } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { "profile.email": profile.email }],
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({
      username, password, role, profile
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

})

// router.post('/login',() => {

// })

module.exports = router;