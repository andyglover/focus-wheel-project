const path = require("path");
const { readData, writeData } = require("../utils/dataUtils");

const taskFilePath = path.join(__dirname, "../data/tasks.json");

const getTasks = async (req, res) => {
  try {
    const tasks = await readData(taskFilePath);
    const focusName = req.query.focus;
    console.log("Fetching tasks for focus:", focusName); // Debug log
    const focusTasks = tasks[focusName] || [];
    console.log("Tasks fetched:", focusTasks); // Debug log
    res.json(focusTasks);
  } catch (error) {
    console.error("Error reading task data:", error); // Debug log
    res.status(500).send("Error reading task data");
  }
};

const addTask = async (req, res) => {
  try {
    const tasks = await readData(taskFilePath);
    const { focusName, taskName } = req.body;
    console.log("Adding task:", taskName, "to focus:", focusName); // Debug log
    tasks[focusName] = tasks[focusName] || [];
    tasks[focusName].push({ name: taskName, completed: false });
    await writeData(taskFilePath, tasks);
    res.status(201).send("Task added");
  } catch (error) {
    console.error("Error adding task:", error); // Debug log
    res.status(500).send("Error adding task");
  }
};

const deleteTask = async (req, res) => {
  try {
    const tasks = await readData(taskFilePath);
    const { focusName, taskName } = req.body;
    console.log("Deleting task:", taskName, "from focus:", focusName); // Debug log
    tasks[focusName] = tasks[focusName].filter(
      (task) => task.name !== taskName
    );
    await writeData(taskFilePath, tasks);
    res.send("Task deleted");
  } catch (error) {
    console.error("Error deleting task:", error); // Debug log
    res.status(500).send("Error deleting task");
  }
};

const toggleTaskCompletion = async (req, res) => {
  try {
    const tasks = await readData(taskFilePath);
    const { focusName, taskName } = req.body;
    console.log(
      "Toggling task completion for task:",
      taskName,
      "in focus:",
      focusName
    ); // Debug log
    const task = tasks[focusName].find((task) => task.name === taskName);
    if (task) {
      task.completed = !task.completed;
      await writeData(taskFilePath, tasks);
      res.send("Task status updated");
    } else {
      res.status(404).send("Task not found");
    }
  } catch (error) {
    console.error("Error updating task status:", error); // Debug log
    res.status(500).send("Error updating task status");
  }
};

module.exports = { getTasks, addTask, deleteTask, toggleTaskCompletion };
