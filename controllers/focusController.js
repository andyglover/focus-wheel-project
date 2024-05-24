const { readUsersData, writeUsersData } = require("../utils/dataUtils");

const addFocus = (req, res) => {
  const { name, description, color } = req.body;
  const users = readUsersData();
  if (!users.focuses) {
    users.focuses = [];
  }
  users.focuses.push({ name, description, color, percentComplete: 0 });
  writeUsersData(users);
  res.status(201).json({ message: "Focus added" });
};

const removeFocus = (req, res) => {
  const { focusName } = req.body;
  const users = readUsersData();
  if (users.focuses) {
    users.focuses = users.focuses.filter((focus) => focus.name !== focusName);
    writeUsersData(users);
  }
  res.status(200).json({ message: "Focus removed" });
};

const getFocuses = (req, res) => {
  const users = readUsersData();
  const focuses = users.focuses || [];
  res.json(focuses);
};

const setTodayFocus = (req, res) => {
  const { focusName } = req.body;
  const users = readUsersData();
  const todayFocus = users.focuses.find((focus) => focus.name === focusName);
  res.json(todayFocus);
};

const updateFocusOrder = (req, res) => {
  const newOrder = req.body;
  console.log("New order of focuses:", newOrder);
  res.status(200).json({ message: "Focus order updated" });
};

module.exports = {
  addFocus,
  removeFocus,
  getFocuses,
  setTodayFocus,
  updateFocusOrder,
};
