const fs = require("fs");
const fs = require("fs").promises;
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

const readData = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return []; // Return empty array if file does not exist
    }
    throw error;
  }
};

const writeData = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    throw error;
  }
};

module.exports = {
  readUsersData,
  writeUsersData,
  readData,
  writeData,
};
