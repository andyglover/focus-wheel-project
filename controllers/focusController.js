const {
  getTodaysFocus,
  getRandomFocus,
  getFocusForDay,
  addFocusArea,
} = require("../src/index");

const getTodaysFocusController = (req, res) => {
  const focus = getTodaysFocus();
  res.json(focus);
};

const getRandomFocusController = (req, res) => {
  const focus = getRandomFocus();
  res.json(focus);
};

const addFocusAreaController = (req, res) => {
  const { name, description } = req.body;
  addFocusArea({ name, description });
  res
    .status(201)
    .json({ message: "Focus area added", focusArea: { name, description } });
};

module.exports = {
  getTodaysFocusController,
  getRandomFocusController,
  addFocusAreaController,
};
