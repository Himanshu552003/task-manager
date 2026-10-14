const mongoose = require("mongoose");
const Task = require("../models/Task");
const User = require("../models/User");

// admin can see all tasks, normal user only sees tasks
// created by him or assigned to him
const getAccessFilter = (user) => {
  if (user.role === "admin") return {};
  return { $or: [{ createdBy: user._id }, { assignedTo: user._id }] };
};

const canAccess = (task, user) => {
  if (user.role === "admin") return true;
  const createdById = task.createdBy._id || task.createdBy;
  const assignedToId = task.assignedTo._id || task.assignedTo;
  return (
    createdById.toString() === user._id.toString() ||
    assignedToId.toString() === user._id.toString()
  );
};

const validStatus = ["pending", "in-progress", "completed"];
const validPriority = ["low", "medium", "high"];

// @route GET /api/tasks
// query params: search, status, priority, sort, page, limit
const getTasks = async (req, res) => {
  const { search, status, priority, sort, page = 1, limit = 6 } = req.query;

  const query = { ...getAccessFilter(req.user) };

  if (search) {
    // escape special characters so regex doesnt break
    const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.title = { $regex: safeSearch, $options: "i" };
  }

  if (status) {
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status filter" });
    }
    query.status = status;
  }

  if (priority) {
    if (!validPriority.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority filter" });
    }
    query.priority = priority;
  }

  let sortBy = { createdAt: -1 };
  if (sort === "dueDate-asc") sortBy = { dueDate: 1 };
  if (sort === "dueDate-desc") sortBy = { dueDate: -1 };
  if (sort === "oldest") sortBy = { createdAt: 1 };

  const pageNum = Math.max(parseInt(page) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit) || 6, 1), 50);

  const total = await Task.countDocuments(query);
  const tasks = await Task.find(query)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .sort(sortBy)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  res.json({
    tasks,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    total,
  });
};

// @route GET /api/tasks/stats
const getTaskStats = async (req, res) => {
  const filter = getAccessFilter(req.user);

  const [total, pending, inProgress, completed] = await Promise.all([
    Task.countDocuments(filter),
    Task.countDocuments({ ...filter, status: "pending" }),
    Task.countDocuments({ ...filter, status: "in-progress" }),
    Task.countDocuments({ ...filter, status: "completed" }),
  ]);

  const priorityCounts = await Task.aggregate([
    { $match: filter },
    { $group: { _id: "$priority", count: { $sum: 1 } } },
  ]);

  const byPriority = { low: 0, medium: 0, high: 0 };
  priorityCounts.forEach((p) => {
    byPriority[p._id] = p.count;
  });

  res.json({ total, pending, inProgress, completed, byPriority });
};

// @route GET /api/tasks/:id
const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (!canAccess(task, req.user)) {
    return res.status(403).json({ message: "You are not allowed to view this task" });
  }

  res.json(task);
};

// @route POST /api/tasks
const createTask = async (req, res) => {
  const { title, description, priority, status, dueDate, assignedTo } = req.body;

  if (!title || !dueDate || !assignedTo) {
    return res.status(400).json({ message: "Title, due date and assigned user are required" });
  }

  if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
    return res.status(400).json({ message: "Invalid assigned user" });
  }

  const userExists = await User.findById(assignedTo);
  if (!userExists) {
    return res.status(404).json({ message: "Assigned user not found" });
  }

  const task = await Task.create({
    title,
    description,
    priority,
    status,
    dueDate,
    assignedTo,
    createdBy: req.user._id,
  });

  await task.populate([
    { path: "assignedTo", select: "name email" },
    { path: "createdBy", select: "name email" },
  ]);

  res.status(201).json(task);
};

// @route PUT /api/tasks/:id
const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (!canAccess(task, req.user)) {
    return res.status(403).json({ message: "You are not allowed to edit this task" });
  }

  const { title, description, priority, status, dueDate, assignedTo } = req.body;

  if (assignedTo) {
    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res.status(400).json({ message: "Invalid assigned user" });
    }
    const userExists = await User.findById(assignedTo);
    if (!userExists) {
      return res.status(404).json({ message: "Assigned user not found" });
    }
    task.assignedTo = assignedTo;
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (priority !== undefined) task.priority = priority;
  if (status !== undefined) task.status = status;
  if (dueDate !== undefined) task.dueDate = dueDate;

  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  res.json(updatedTask);
};

// @route DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // only the creator or admin can delete
  if (req.user.role !== "admin" && task.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only the creator or admin can delete this task" });
  }

  await task.deleteOne();
  res.json({ message: "Task deleted successfully", id: req.params.id });
};

module.exports = {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
