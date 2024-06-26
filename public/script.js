let currentFocusColor = "";
const predefinedFocuses = [
  {
    name: "Health",
    description: "Focus on health and well-being",
    color: "#FF6347",
  },
  {
    name: "Career",
    description: "Focus on career development",
    color: "#4682B4",
  },
  {
    name: "Relationships",
    description: "Focus on relationships and social life",
    color: "#FFD700",
  },
  {
    name: "Hobbies",
    description: "Focus on hobbies and interests",
    color: "#32CD32",
  },
  {
    name: "Finance",
    description: "Focus on financial management",
    color: "#FF69B4",
  },
];

async function loadFocuses() {
  const response = await fetch("/api/focus/focuses");
  const focuses = await response.json();
  const focusList = document.getElementById("focus-list");
  focusList.innerHTML = "";
  focuses.forEach((focus, index) => {
    const focusDiv = document.createElement("div");
    focusDiv.className = "focus-item";
    focusDiv.setAttribute("draggable", "true");
    focusDiv.setAttribute("data-index", index);
    focusDiv.innerHTML = `
            <h3>${focus.name}</h3>
            <div class="focus-description">${focus.description}</div>
            <div class="button-group">
                <button class="circle-button task-button" onclick="openTaskMenu('${focus.name}')">
                    <span class="tooltip">Tasks</span>
                    <img src="icons/tasks.svg" alt="Tasks" width="16" height="16">
                </button>
                <button class="circle-button set-focus-button" onclick="setTodayFocus('${focus.name}', '${focus.color}')">
                    <span class="tooltip">Set as Today's Focus</span>
                    <img src="icons/set-focus.svg" alt="Set Focus" width="16" height="16">
                </button>
                <button class="circle-button remove-focus-button" onclick="removeFocus('${focus.name}')">
                    <span class="tooltip">Remove Focus</span>
                    <img src="icons/remove.svg" alt="Remove" width="16" height="16">
                </button>
            </div>
        `;
    focusDiv.style.backgroundColor = focus.color;
    focusList.appendChild(focusDiv);
  });
  arrangeFocusesInCircle();
  enableDragAndDrop();
}

function arrangeFocusesInCircle() {
  const focusList = document.getElementById("focus-list");
  const focusItems = focusList.querySelectorAll(".focus-item");
  const radius = 200; // Adjust as necessary
  const angleStep = (2 * Math.PI) / focusItems.length;

  focusItems.forEach((item, index) => {
    const angle = index * angleStep;
    const x = radius * Math.cos(angle) - item.clientWidth / 2;
    const y = radius * Math.sin(angle) - item.clientHeight / 2;
    item.style.position = "absolute";
    item.style.left = `calc(50% + ${x}px)`;
    item.style.top = `calc(50% + ${y}px)`;
    item.style.transform = `translate(-50%, -50%)`;
  });
}

async function setTodayFocus(focusName, color) {
  const response = await fetch("/api/focus/set-today-focus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ focusName }),
  });
  const data = await response.json();
  document.getElementById("focus-name").innerText = data.name;
  document.getElementById("focus-description").innerText = data.description;
  currentFocusColor = color;
  document.getElementById("today-focus").style.backgroundColor = color;

  const focusItems = document.querySelectorAll(".focus-item");
  focusItems.forEach((item) => {
    const focusHeader = item.querySelector("h3");
    if (focusHeader.innerText === focusName) {
      item.classList.add("highlight");
    } else {
      item.classList.remove("highlight");
    }
  });
}

async function addFocus() {
  const name = document.getElementById("new-focus-name").value;
  const description =
    document.getElementById("new-focus-description").value || "";
  const color = currentFocusColor;
  if (!name.trim()) {
    alert("Focus name cannot be empty");
    return;
  }
  await fetch("/api/focus/add-focus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description, color }),
  });
  loadFocuses();
  closeAddFocusModal();
}

async function addRandomFocus() {
  const randomFocus =
    predefinedFocuses[Math.floor(Math.random() * predefinedFocuses.length)];
  await fetch("/api/focus/add-focus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(randomFocus),
  });
  loadFocuses();
}

async function removeFocus(focusName) {
  await fetch("/api/focus/remove-focus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ focusName }),
  });
  loadFocuses();
}

async function removeRandomFocus() {
  const response = await fetch("/api/focus/focuses");
  const focuses = await response.json();
  if (focuses.length > 0) {
    const randomFocus = focuses[Math.floor(Math.random() * focuses.length)];
    await removeFocus(randomFocus.name);
  }
}

async function openTaskMenu(focusName) {
  document.getElementById("task-modal").style.display = "block";
  document.getElementById("task-focus-name").innerText = focusName;
  loadTasks(focusName);
  loadPredefinedTasks(focusName);
}

async function closeTaskMenu() {
  document.getElementById("task-modal").style.display = "none";
}

async function loadTasks(focusName) {
  const response = await fetch(`/api/task/tasks?focus=${focusName}`);
  const tasks = await response.json();
  console.log("Tasks received:", tasks); // Debug log
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = ""; // Ensure task list is cleared before adding new tasks
  tasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.className = "task-item";
    taskItem.innerHTML = `
            <input type="checkbox" ${
              task.completed ? "checked" : ""
            } onclick="toggleTaskCompletion('${focusName}', '${task.name}')">
            <span>${task.name}</span>
            <button onclick="deleteTask('${focusName}', '${
      task.name
    }')">Delete</button>
        `;
    taskList.appendChild(taskItem);
  });
  const newTaskItem = document.createElement("div");
  newTaskItem.className = "task-item";
  newTaskItem.innerHTML = `
        <input type="text" id="new-task" placeholder="New task">
        <button onclick="addTask('${focusName}')">Add Task</button>
    `;
  taskList.appendChild(newTaskItem);
}

async function loadPredefinedTasks(focusName) {
  const response = await fetch(`/api/task/predefined-tasks?focus=${focusName}`);
  const tasks = await response.json();
  const predefinedTaskList = document.getElementById("predefined-task-list");
  predefinedTaskList.innerHTML = "<h3>Predefined Tasks</h3>";
  tasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.className = "task-item predefined-task";
    taskItem.innerHTML = `
            <span>${task}</span>
            <button onclick="addPredefinedTask('${focusName}', '${task}')">Add</button>
        `;
    predefinedTaskList.appendChild(taskItem);
  });
}

async function addTask(focusName) {
  const taskName = document.getElementById("new-task").value;
  if (!taskName.trim()) {
    alert("Task name cannot be empty");
    return;
  }
  await fetch("/api/task/add-task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ focusName, taskName }),
  });
  loadTasks(focusName);
  document.getElementById("new-task").value = "";
}

async function addPredefinedTask(focusName, taskName) {
  await fetch("/api/task/add-task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ focusName, taskName }),
  });
  loadTasks(focusName);
}

async function deleteTask(focusName, taskName) {
  await fetch("/api/task/delete-task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ focusName, taskName }),
  });
  loadTasks(focusName);
}

async function toggleTaskCompletion(focusName, taskName) {
  await fetch("/api/task/toggle-task-completion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ focusName, taskName }),
  });
  loadTasks(focusName);
}

function enableDragAndDrop() {
  const draggables = document.querySelectorAll(".focus-item");
  const container = document.querySelector(".focus-list");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
      updateFocusOrder();
    });
  });

  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector(".dragging");
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".focus-item:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

async function updateFocusOrder() {
  const focusList = document.querySelectorAll(".focus-item");
  const newOrder = [];
  focusList.forEach((focusItem, index) => {
    const name = focusItem.querySelector("h3").innerText;
    newOrder.push({ name, order: index });
  });
  await fetch("/api/focus/update-focus-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newOrder),
  });
}

// Close modal when clicking outside of it
window.onclick = function (event) {
  const modal = document.getElementById("task-modal");
  if (event.target === modal) {
    closeTaskMenu();
  }
};

function openAddFocusModal() {
  document.getElementById("add-focus-modal").style.display = "block";
}

function closeAddFocusModal() {
  document.getElementById("add-focus-modal").style.display = "none";
}

function selectColor(color) {
  currentFocusColor = color;
  document.querySelectorAll(".color-option").forEach((option) => {
    option.classList.remove("selected");
  });
  document
    .querySelector(`.color-option[style="background-color: ${color};"]`)
    .classList.add("selected");
}

loadFocuses();
