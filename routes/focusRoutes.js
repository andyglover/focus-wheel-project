const express = require("express");
const {
  getTodaysFocusController,
  getRandomFocusController,
  addFocusAreaController,
} = require("../controllers/focusController");

const router = express.Router();

router.get("/todays-focus", getTodaysFocusController);
router.get("/random-focus", getRandomFocusController);
router.post("/focus-area", addFocusAreaController);

module.exports = router;
