const fs = require("fs");
const path = require("path");

const usersFilePath = path.join(__dirname, "../data", "users.json");

const readUsersData = () => {
  if (fs.existsSync(usersFilePath)) {
    const data = fs.readFileSync(usersFilePath, "utf8");
    return JSON.parse(data);
  }
  return {};
};

const writeUsersData = (data) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), "utf8");
};

module.exports = { readUsersData, writeUsersData };
