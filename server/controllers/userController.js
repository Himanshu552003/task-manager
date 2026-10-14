const User = require("../models/User");

// @route GET /api/users
// used for the "assign to" dropdown
const getUsers = async (req, res) => {
  const users = await User.find().select("name email role").sort({ name: 1 });
  res.json(users);
};

module.exports = { getUsers };
