const express = require("express");
const {
  addFocus,
  removeFocus,
  getFocuses,
  setTodayFocus,
  updateFocusOrder,
} = require("../controllers/focusController");

const router = express.Router();

router.post("/add-focus", addFocus);
router.post("/remove-focus", removeFocus);
router.get("/focuses", getFocuses);
router.post("/set-today-focus", setTodayFocus);
router.post("/update-focus-order", updateFocusOrder);

module.exports = router;
