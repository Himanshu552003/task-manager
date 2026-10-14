const express = require("express");
const {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// all task routes need login
router.use(protect);

router.route("/").get(getTasks).post(createTask);
router.get("/stats", getTaskStats); // keep this above /:id
router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);

module.exports = router;
