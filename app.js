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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
