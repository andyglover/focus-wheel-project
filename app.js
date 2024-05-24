const express = require("express");
const path = require("path");
const focusRoutes = require("./routes/focusRoutes");
const { readUsersData, writeUsersData } = require("./models/userStorage");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use("/api", focusRoutes);

app.post("/api/add-focus", (req, res) => {
  const { name, description, color } = req.body;
  const users = readUsersData();
  if (!users.focuses) {
    users.focuses = [];
  }
  users.focuses.push({ name, description, color, percentComplete: 0 });
  writeUsersData(users);
  res.status(201).json({ message: "Focus added" });
});

app.post("/api/remove-focus", (req, res) => {
  const { focusName } = req.body;
  const users = readUsersData();
  if (users.focuses) {
    users.focuses = users.focuses.filter((focus) => focus.name !== focusName);
    writeUsersData(users);
  }
  res.status(200).json({ message: "Focus removed" });
});

app.get("/api/focuses", (req, res) => {
  const users = readUsersData();
  const focuses = users.focuses || [];
  res.json(focuses);
});

app.post("/api/set-today-focus", (req, res) => {
  const { focusName } = req.body;
  const users = readUsersData();
  const todayFocus = users.focuses.find((focus) => focus.name === focusName);
  res.json(todayFocus);
});

app.get("/api/tasks", (req, res) => {
  const { focus } = req.query;
  const users = readUsersData();
  const tasks = users[focus] ? users[focus].tasks : [];
  res.json(tasks);
});

app.get("/api/predefined-tasks", (req, res) => {
  const { focus } = req.query;
  const predefinedTasks = {
    Health: ["Exercise", "Meditate", "Eat Healthy"],
    Career: ["Update Resume", "Attend Workshop", "Network"],
    Relationships: [
      "Call Family",
      "Plan Date Night",
      "Spend Time with Friends",
    ],
    Finance: ["Budget Planning", "Review Investments", "Save Money"],
    "Personal Growth": ["Read Book", "Learn New Skill", "Reflect"],
  };
  const tasks = predefinedTasks[focus] || [];
  res.json(tasks);
});

app.post("/api/add-task", (req, res) => {
  const { focusName, taskName } = req.body;
  const users = readUsersData();
  if (!users[focusName]) {
    users[focusName] = { tasks: [] };
  }
  users[focusName].tasks.push({ name: taskName, completed: false });
  writeUsersData(users);
  res.status(201).json({ message: "Task added" });
});

app.post("/api/delete-task", (req, res) => {
  const { focusName, taskName } = req.body;
  const users = readUsersData();
  if (users[focusName]) {
    users[focusName].tasks = users[focusName].tasks.filter(
      (task) => task.name !== taskName
    );
    writeUsersData(users);
  }
  res.status(200).json({ message: "Task deleted" });
});

app.post("/api/toggle-task-completion", (req, res) => {
  const { focusName, taskName } = req.body;
  const users = readUsersData();
  if (users[focusName]) {
    users[focusName].tasks = users[focusName].tasks.map((task) =>
      task.name === taskName ? { ...task, completed: !task.completed } : task
    );
    writeUsersData(users);
  }
  res.status(200).json({ message: "Task completion toggled" });
});

app.post("/api/update-focus-order", (req, res) => {
  const newOrder = req.body;
  console.log("New order of focuses:", newOrder);
  res.status(200).json({ message: "Focus order updated" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
