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

app.post("/api/user/:username/focus", (req, res) => {
  const { username } = req.params;
  const { focus } = req.body;
  const users = readUsersData();

  if (!users[username]) {
    users[username] = [];
  }
  users[username].push(focus);
  writeUsersData(users);

  res.status(201).json({ message: "Focus area added to user history", focus });
});

app.get("/api/user/:username/focus", (req, res) => {
  const { username } = req.params;
  const users = readUsersData();

  if (!users[username]) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(users[username]);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
