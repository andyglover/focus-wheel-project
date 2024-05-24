const express = require("express");
const path = require("path");
const { getTodaysFocus, getRandomFocus } = require("./src/index");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/todays-focus", (req, res) => {
  res.json(getTodaysFocus());
});

app.get("/api/random-focus", (req, res) => {
  res.json(getRandomFocus());
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
