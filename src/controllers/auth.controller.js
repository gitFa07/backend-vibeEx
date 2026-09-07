const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register controller

async function registerUser(req, res) {
  const { username, email, password, role = "user" } = req.body; // destructure

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }], // Check if username or email already exists
  });

  if (isUserAlreadyExists) {
    return res
      .status(409)
      .json({ message: "Username or email already exists" });
  }

  const hash = await bcrypt.hash(/*plaintext*/ password, 10); // Hash the password

  const user = await userModel.create({
    username,
    email,
    password: hash,
    role,
  });

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
}

// Login controller

async function loginUser(req, res) {
  const { username, email, password } = req.body; // destructure

  const user = await userModel.findOne({
    $or: [{ username }, { email }], // Check if username or email exists
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password); // Compare the password

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
}

module.exports = {
  registerUser,
  loginUser,
};
