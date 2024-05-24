const express = require("express");
const bodyParser = require("body-parser");
const focusRoutes = require("./routes/focusRoutes");
const taskRoutes = require("./routes/taskRoutes");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/focus", focusRoutes);
app.use("/api/task", taskRoutes);

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
