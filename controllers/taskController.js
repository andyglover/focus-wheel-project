const { readUsersData, writeUsersData } = require("../utils/dataUtils");

const predefinedTasks = {
  Health: ["Exercise", "Meditate", "Eat Healthy"],
  Career: ["Update Resume", "Attend Workshop", "Network"],
  Relationships: ["Call Family", "Plan Date Night", "Spend Time with Friends"],
  Finance: ["Budget Planning", "Review Investments", "Save Money"],
  "Personal Growth": ["Read Book", "Learn New Skill", "Reflect"],
};

const getTasks = (req, res) => {
  const { focus } = req.query;
  const users = readUsersData();
  const tasks = users[focus] ? users[focus].tasks : [];
  res.json(tasks);
};

const addTask = (req, res) => {
  const { focusName, taskName } = req.body;
  const users = readUsersData();
  if (!users[focusName]) {
    users[focusName] = { tasks: [] };
  }
  users[focusName].tasks.push({ name: taskName, completed: false });
  writeUsersData(users);
  res.status(201).json({ message: "Task added" });
};

const deleteTask = (req, res) => {
  const { focusName, taskName } = req.body;
  const users = readUsersData();
  if (users[focusName]) {
    users[focusName].tasks = users[focusName].tasks.filter(
      (task) => task.name !== taskName
    );
    writeUsersData(users);
  }
  res.status(200).json({ message: "Task deleted" });
};

const toggleTaskCompletion = (req, res) => {
  const { focusName, taskName } = req.body;
  const users = readUsersData();
  if (users[focusName]) {
    users[focusName].tasks = users[focusName].tasks.map((task) =>
      task.name === taskName ? { ...task, completed: !task.completed } : task
    );
    writeUsersData(users);
  }
  res.status(200).json({ message: "Task completion toggled" });
};

const getPredefinedTasks = (req, res) => {
  const { focus } = req.query;
  const tasks = predefinedTasks[focus] || [];
  res.json(tasks);
};

module.exports = {
  getTasks,
  addTask,
  deleteTask,
  toggleTaskCompletion,
  getPredefinedTasks,
};
