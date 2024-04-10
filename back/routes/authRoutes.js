const User = require("../models/userModel.js");
const Instructor = require("../models/instructorModel.js");
const Student = require("../models/studentModel.js");
const Admin = require("../models/userModel.js");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const authMiddleware = require("../middleware/authMiddleware.js");

router.use(cookieParser());

const secretKey = process.env.JWT_SECRET_KEY;

async function generateRespectiveObject(role, userId) {
  if (role == "admin") {
    const newMod = new Admin({
      userId,
    });
    await newMod.save();
    return newMod.id;
  } else if (role == "instructor") {
    const newMod = new Instructor({
      userId,
    });
    await newMod.save();
    return newMod.id;
  } else {
    const newMod = new Student({
      userId,
    });
    await newMod.save();
    return newMod.id;
  }
}

router.post("/signup", async (req, res) => {
  try {
    const { username, password, role, profile } = req.body;
    // Check if the user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { "profile.email": profile.email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: `User: ${username} already exists` });
    }
    // Create a new user
    const newUser = new User({
      username,
      password,
      role,
      profile,
    });
    // Save the user to the database
    await newUser.save();
    const roleId = await generateRespectiveObject(role, newUser.id);
    res.status(201).json({
      message: `Role: ${role}, Username: ${username}. User created successfully. ${role}_ID = ${roleId}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    // Check if the password is correct
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create a JWT token with user roe and expiration time

    const token = jwt.sign({ username, role: user.role }, secretKey, {
      expiresIn: "24h",
    });

    // You may also create a refresh token if needed
    // const refreshToken = createRefreshToken();
    res.cookie("jwt", token, { httpOnly: true });

    res.json({ success: true });
    // res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/logout", async (req, res) => {
  //clear the JWT token
  res.clearCookie("jwt", { httpOnly: true });

  res.redirect("/login");
});

router.get("/check-auth", (req, res) => {
  // Retrieve the JWT from the request cookies
  const token = req.cookies && req.cookies["jwt"];

  if (!token) {
    // No JWT found, consider the user not authenticated
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the JWT signature and check expiration
    const decoded = jwt.verify(token, secretKey);
    res.status(200).json({ message: "Authentication successful" });

    // If verification succeeds, the JWT is valid
  } catch (error) {
    // If verification fails, the JWT is expired or invalid
    res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = router;
