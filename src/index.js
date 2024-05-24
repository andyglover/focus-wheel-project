let focusAreas = [
  { name: "Health", description: "Focus on your physical and mental health." },
  {
    name: "Career",
    description: "Focus on your professional growth and tasks.",
  },
  {
    name: "Relationships",
    description: "Spend quality time with family and friends.",
  },
  {
    name: "Finance",
    description: "Manage your finances and plan your budget.",
  },
  {
    name: "Personal Growth",
    description: "Engage in activities that promote self-improvement.",
  },
  {
    name: "Leisure",
    description: "Take time to relax and enjoy your hobbies.",
  },
  {
    name: "Community",
    description: "Participate in community service and social causes.",
  },
  {
    name: "Creativity",
    description: "Explore creative activities and projects.",
  },
  {
    name: "Spirituality",
    description: "Spend time on spiritual growth and practices.",
  },
];

/**
 * Focus areas for the focus wheel.
 * @typedef {Object} FocusArea
 * @property {string} name - The name of the focus area.
 * @property {string} description - A brief description of the focus area.
 */

/**
 * Get recommendations for today's focus area.
 * @returns {FocusArea} The recommended focus area for today.
 */
function getTodaysFocus() {
  const today = new Date().getDay();
  return focusAreas[today % focusAreas.length];
}

/**
 * Get a random focus area.
 * @returns {FocusArea} A randomly selected focus area.
 */
function getRandomFocus() {
  const randomIndex = Math.floor(Math.random() * focusAreas.length);
  return focusAreas[randomIndex];
}

/**
 * Get the focus area for a specific day.
 * @param {number} day - The day of the week (0-6), where 0 is Sunday and 6 is Saturday.
 * @returns {FocusArea} The focus area for the specified day.
 */
function getFocusForDay(day) {
  if (day < 0 || day > 6) {
    throw new Error("Day must be between 0 (Sunday) and 6 (Saturday).");
  }
  return focusAreas[day % focusAreas.length];
}

/**
 * Add a new focus area.
 * @param {FocusArea} focusArea - The focus area to add.
 */
function addFocusArea(focusArea) {
  focusAreas.push(focusArea);
}

module.exports = {
  getTodaysFocus,
  getRandomFocus,
  getFocusForDay,
  addFocusArea,
};
