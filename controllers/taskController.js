const path = require("path");
const { readData, writeData } = require("../utils/dataUtils");

const taskFilePath = path.join(__dirname, "../data/tasks.json");

const getTasks = async (req, res) => {
  try {
    const tasks = await readData(taskFilePath);
    const focusName = req.query.focus;
    const focusTasks = tasks[focusName] || [];
    res.json(focusTasks);
  } catch (error) {
    res.status(500).send("Error reading task data");
  }
};

const addTask = async (req, res) => {
  try {
    const tasks = await readData(taskFilePath);
    const { focusName, taskName } = req.body;
    tasks[focusName] = tasks[focusName] || [];
    tasks[focusName].push({ name: taskName, completed: false });
    await writeData(taskFilePath, tasks);
    res.status(201).send("Task added");
  } catch (error) {
    res.status(500).send("Error adding task");
  }
};

const deleteTask = async (req, res) => {
  try {
    const tasks = await readData(taskFilePath);
    const { focusName, taskName } = req.body;
    tasks[focusName] = tasks[focusName].filter(
      (task) => task.name !== taskName
    );
    await writeData(taskFilePath, tasks);
    res.send("Task deleted");
  } catch (error) {
    res.status(500).send("Error deleting task");
  }
};

const toggleTaskCompletion = async (req, res) => {
  try {
    const tasks = await readData(taskFilePath);
    const { focusName, taskName } = req.body;
    const task = tasks[focusName].find((task) => task.name === taskName);
    if (task) {
      task.completed = !task.completed;
      await writeData(taskFilePath, tasks);
      res.send("Task status updated");
    } else {
      res.status(404).send("Task not found");
    }
  } catch (error) {
    res.status(500).send("Error updating task status");
  }
};

module.exports = { getTasks, addTask, deleteTask, toggleTaskCompletion };
