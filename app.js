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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
