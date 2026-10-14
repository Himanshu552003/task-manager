const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id, rememberMe) => {
  // if remember me is checked token will last longer
  const expiresIn = rememberMe ? "30d" : "1d";
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

const emailRegex = /^\S+@\S+\.\S+$/;
// min 6 chars, atleast one letter and one number
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

// @route POST /api/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must be at least 6 characters and contain a letter and a number",
    });
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    return res.status(400).json({ message: "User with this email already exists" });
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, false),
  });
};

// @route POST /api/login
const loginUser = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // need to select password because select:false in model
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, rememberMe),
  });
};

// @route GET /api/me
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { registerUser, loginUser, getMe };
