const express = require("express");
const path = require("path");
const {
  getTodaysFocus,
  getRandomFocus,
  getFocusForDay,
  addFocusArea,
} = require("./src/index");
const { readUsersData, writeUsersData } = require("./models/userStorage");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const usersFilePath = path.join(__dirname, "data", "users.json");

// Read users data from the JSON file
const readUsersData = () => {
  if (fs.existsSync(usersFilePath)) {
    const data = fs.readFileSync(usersFilePath, "utf8");
    return JSON.parse(data);
  }
  return {};
};

// Write users data to the JSON file
const writeUsersData = (data) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), "utf8");
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/todays-focus", (req, res) => {
  const focus = getTodaysFocus();
  res.json(focus);
});

app.get("/api/random-focus", (req, res) => {
  const focus = getRandomFocus();
  res.json(focus);
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

app.post("/api/focus-area", (req, res) => {
  const { name, description } = req.body;
  addFocusArea({ name, description });
  res
    .status(201)
    .json({ message: "Focus area added", focusArea: { name, description } });
});
