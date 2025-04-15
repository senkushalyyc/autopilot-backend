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

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
