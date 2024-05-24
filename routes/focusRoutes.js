const express = require("express");
const {
  getFocuses,
  addFocus,
  removeFocus,
  setTodayFocus,
} = require("../controllers/focusController");
const router = express.Router();

router.get("/focuses", getFocuses);
router.post("/add-focus", addFocus);
router.post("/remove-focus", removeFocus);
router.post("/set-today-focus", setTodayFocus);

module.exports = router;
