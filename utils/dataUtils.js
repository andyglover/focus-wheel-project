const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "users.json");

const readUsersData = () => {
  try {
    const data = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return {};
  }
};

const writeUsersData = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  readUsersData,
  writeUsersData,
};
