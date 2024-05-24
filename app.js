const express = require("express");
const path = require("path");
const { readUsersData, writeUsersData } = require("./models/userStorage");
const focusRoutes = require("./routes/focusRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use("/api", focusRoutes);

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
    // Add more focuses here
  ];
  res.json(focuses);
});

app.post("/api/set-today-focus", (req, res) => {
  const { focusName } = req.body;
  // Logic to set today's focus
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

app.post("/api/add-task", (req, res) => {
  const { focusName, taskName } = req.body;
  const users = readUsersData();
  if (!users[focusName]) {
    users[focusName] = { tasks: [] };
  }
  users[focusName].tasks.push({ name: taskName });
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

app.post("/api/update-focus-order", (req, res) => {
  const newOrder = req.body;
  // Logic to update the order of focuses
  console.log("New order of focuses:", newOrder);
  res.status(200).json({ message: "Focus order updated" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
