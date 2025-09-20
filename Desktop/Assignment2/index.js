// === Elements ===
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");
const darkToggle = document.getElementById("darkToggle");

// === Data (stored in localStorage) ===
const STORAGE_KEY = "todo_tasks";
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Save & Load
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// === Add Task ===
taskForm.addEventListener("submit", e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text,
    completed: false,
    priority: prioritySelect.value
  };

  tasks.unshift(newTask);
  saveTasks();
  taskForm.reset();
  renderTasks();
});

// === Render Tasks ===
function renderTasks() {
  taskList.innerHTML = "";

  let filtered = tasks.filter(t =>
    t.text.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  if (filterStatus.value === "active") filtered = filtered.filter(t => !t.completed);
  if (filterStatus.value === "completed") filtered = filtered.filter(t => t.completed);

  filtered.forEach(task => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center p-3 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600";

    const span = document.createElement("span");
    span.textContent = task.text;
    if (task.completed) span.classList.add("completed");

    // Priority badge
    const badge = document.createElement("span");
    badge.textContent = task.priority;
    badge.className = "ml-2 px-2 py-0.5 rounded text-xs text-white";
    if (task.priority === "high") badge.classList.add("bg-red-500");
    if (task.priority === "normal") badge.classList.add("bg-gray-500");
    if (task.priority === "low") badge.classList.add("bg-blue-500");

    // Buttons
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✔";
    completeBtn.className = "px-2 text-green-600";
    completeBtn.onclick = () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.className = "px-2 text-red-600";
    deleteBtn.onclick = () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    };

    li.appendChild(span);
    li.appendChild(badge);
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// === Dark Mode ===
function initTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") document.documentElement.classList.add("dark");
}
initTheme();

darkToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme",
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
});

// === Search & Filter ===
searchInput.addEventListener("input", renderTasks);
filterStatus.addEventListener("change", renderTasks);

// === Start ===
renderTasks();

