const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const TASKS_FILE = path.join(__dirname, "tasks.json");

function loadTasks() {
  if (!fs.existsSync(TASKS_FILE)) return {};
  return JSON.parse(fs.readFileSync(TASKS_FILE));
}

function saveTasks(data) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2));
}

app.get("/tasks/:date", (req, res) => {
  const tasks = loadTasks();
  res.json(tasks[req.params.date] || []);
});

app.post("/tasks/:date", (req, res) => {
  const tasks = loadTasks();
  const date = req.params.date;
  if (!tasks[date]) tasks[date] = [];
  tasks[date].push(req.body);
  saveTasks(tasks);
  res.json({ status: "ok" });
});

const MEMORY_FILE = path.join(__dirname, "memory.json");

// Load memory
function loadMemory() {
  if (!fs.existsSync(MEMORY_FILE)) return [];
  return JSON.parse(fs.readFileSync(MEMORY_FILE));
}

// Save memory
function saveMemory(data) {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2));
}

// GET all memory
app.get("/memory", (req, res) => {
  const memory = loadMemory();
  res.json(memory);
});

// POST a new memory entry
app.post("/memory", (req, res) => {
  const memory = loadMemory();
  const newEntry = {
    date: new Date().toISOString(),
    ...req.body,
  };
  memory.push(newEntry);
  saveMemory(memory);
  res.json({ status: "ok", saved: newEntry });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});

// DELETE a memory by index
app.delete("/memory/:index", (req, res) => {
  const memory = loadMemory();
  const idx = parseInt(req.params.index);
  if (isNaN(idx) || idx < 0 || idx >= memory.length) {
    return res.status(400).json({ error: "Invalid index" });
  }
  const deleted = memory.splice(idx, 1);
  saveMemory(memory);
  res.json({ status: "deleted", entry: deleted[0] });
});
