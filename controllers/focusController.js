const path = require("path");
const { readData, writeData } = require("../utils/dataUtils");

const focusFilePath = path.join(__dirname, "../data/focuses.json");

const getFocuses = async (req, res) => {
  try {
    const focuses = await readData(focusFilePath);
    res.json(focuses);
  } catch (error) {
    res.status(500).send("Error reading focus data");
  }
};

const addFocus = async (req, res) => {
  try {
    const focuses = await readData(focusFilePath);
    const newFocus = req.body;
    focuses.push(newFocus);
    await writeData(focusFilePath, focuses);
    res.status(201).send("Focus added");
  } catch (error) {
    res.status(500).send("Error adding focus");
  }
};

const removeFocus = async (req, res) => {
  try {
    const focuses = await readData(focusFilePath);
    const focusName = req.body.focusName;
    const updatedFocuses = focuses.filter((focus) => focus.name !== focusName);
    await writeData(focusFilePath, updatedFocuses);
    res.send("Focus removed");
  } catch (error) {
    res.status(500).send("Error removing focus");
  }
};

const setTodayFocus = async (req, res) => {
  try {
    const focuses = await readData(focusFilePath);
    const todayFocus = req.body.focusName;
    const focus = focuses.find((focus) => focus.name === todayFocus);
    if (focus) {
      res.json(focus);
    } else {
      res.status(404).send("Focus not found");
    }
  } catch (error) {
    res.status(500).send("Error setting today's focus");
  }
};

module.exports = { getFocuses, addFocus, removeFocus, setTodayFocus };
