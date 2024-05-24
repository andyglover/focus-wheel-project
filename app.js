const express = require("express");
const path = require("path");
const { readUsersData, writeUsersData } = require("./models/userStorage");
const focusRoutes = require("./routes/focusRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use("/api", focusRoutes);

const predefinedTasks = {
  Health: ["Exercise", "Meditate", "Eat Healthy"],
  Career: ["Update Resume", "Attend Workshop", "Network"],
  Relationships: ["Call Family", "Plan Date Night", "Spend Time with Friends"],
  Finance: ["Budget Planning", "Review Investments", "Save Money"],
  "Personal Growth": ["Read Book", "Learn New Skill", "Reflect"],
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/focuses", (req, res) => {
  const focuses = [
    {
      name: "Health",
      description: "Focus on your physical and mental health.",
      color: "#FF6347",
      percentComplete: 50,
    },
    {
      name: "Career",
      description: "Focus on your professional growth and tasks.",
      color: "#4682B4",
      percentComplete: 70,
    },
    {
      name: "Relationships",
      description: "Spend quality time with family and friends.",
      color: "#FFD700",
      percentComplete: 60,
    },
    {
      name: "Finance",
      description: "Manage your finances and plan your budget.",
      color: "#32CD32",
      percentComplete: 80,
    },
    {
      name: "Personal Growth",
      description: "Engage in activities that promote self-improvement.",
      color: "#FF69B4",
      percentComplete: 40,
    },
  ];
  res.json(focuses);
});

app.post("/api/set-today-focus", (req, res) => {
  const { focusName } = req.body;
  const todayFocus = {
    name: focusName,
    description: "Description for " + focusName,
  };
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
