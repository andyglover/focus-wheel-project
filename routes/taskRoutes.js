const express = require("express");
const {
  getTasks,
  addTask,
  deleteTask,
  toggleTaskCompletion,
} = require("../controllers/taskController");
const router = express.Router();

router.get("/tasks", getTasks);
router.post("/add-task", addTask);
router.post("/delete-task", deleteTask);
router.post("/toggle-task-completion", toggleTaskCompletion);

module.exports = router;
