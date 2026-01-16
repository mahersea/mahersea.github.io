const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3003;

// Data file paths
const TASKS_FILE = path.join(__dirname, 'tasks.json');
const USERS_FILE = path.join(__dirname, 'users.json');
const PROJECTS_FILE = path.join(__dirname, 'projects.json');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Validation Middleware
function validateTask(req, res, next) {
  const { title, project, assignedUser, deadline, status } = req.body;
  
  if (!title || !project || !assignedUser || !deadline || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const validStatuses = ['Open', 'In Progress', 'Completed', 'Blocked', 'Postponed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }
  
  // Gantt-specific validation
  if (req.body.start_date && !/^\d{4}-\d{2}-\d{2}$/.test(req.body.start_date)) {
    return res.status(400).json({ error: 'Invalid start date format. Use YYYY-MM-DD' });
  }
  
  if (req.body.duration && (isNaN(req.body.duration) || req.body.duration < 1)) {
    return res.status(400).json({ error: 'Duration must be a positive number' });
  }
  
  next();
}

function validateUser(req, res, next) {
  const { username, role } = req.body;
  
  if (!username || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const validRoles = ['admin', 'user'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role value' });
  }
  
  next();
}

function validateProject(req, res, next) {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  next();
}

// Helper functions for file operations
function readData(file) {
  if (!fs.existsSync(file)) {
    console.warn(`File not found: ${file}. Creating empty file.`);
    writeData(file, []);
    return [];
  }
  
  try {
    const data = fs.readFileSync(file, 'utf8');
    return data.trim() ? JSON.parse(data) : [];
  } catch (err) {
    console.error(`Error reading file ${file}:`, err);
    return [];
  }
}

function writeData(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing to file ${file}:`, err);
    throw new Error(`Failed to write data to ${file}`);
  }
}

/* ------------------ Tasks Endpoints ------------------ */
// GET all tasks
app.get('/api/tasks', (req, res) => {
  const tasks = readData(TASKS_FILE);
  res.json(tasks);
});

// GET a single task
app.get('/api/tasks/:id', (req, res) => {
  const tasks = readData(TASKS_FILE);
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  task ? res.json(task) : res.status(404).send('Task not found');
});

// POST a new task
app.post('/api/tasks', validateTask, (req, res) => {
  const tasks = readData(TASKS_FILE);
  const newTask = req.body;
  newTask.id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
  
  // Add Gantt-specific properties if not provided
  if (!newTask.start_date) {
    newTask.start_date = new Date().toISOString().split('T')[0]; // Today's date
  }
  
  if (!newTask.duration) {
    // Calculate days between start and deadline
    const start = new Date(newTask.start_date);
    const end = new Date(newTask.deadline);
    const diffTime = Math.abs(end - start);
    newTask.duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // At least 1 day
  }
  
  // Optional dependencies array
  if (!newTask.dependencies) {
    newTask.dependencies = [];
  }
  
  tasks.push(newTask);
  writeData(TASKS_FILE, tasks);
  res.status(201).json(newTask);
});

// PUT update a task
app.put('/api/tasks/:id', validateTask, (req, res) => {
  const tasks = readData(TASKS_FILE);
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...req.body };
    writeData(TASKS_FILE, tasks);
    res.json(tasks[index]);
  } else {
    res.status(404).send('Task not found');
  }
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
  let tasks = readData(TASKS_FILE);
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  if (tasks.length < initialLength) {
    writeData(TASKS_FILE, tasks);
    res.status(204).send();
  } else {
    res.status(404).send('Task not found');
  }
});

/* ------------------ Users Endpoints ------------------ */
// GET all users
app.get('/api/users', (req, res) => {
  const users = readData(USERS_FILE);
  res.json(users);
});

// GET a single user
app.get('/api/users/:id', (req, res) => {
  const users = readData(USERS_FILE);
  const user = users.find(u => u.id === parseInt(req.params.id));
  user ? res.json(user) : res.status(404).send('User not found');
});

// POST a new user
app.post('/api/users', validateUser, (req, res) => {
  const users = readData(USERS_FILE);
  const newUser = req.body;
  newUser.id = users.length ? users[users.length - 1].id + 1 : 1;
  users.push(newUser);
  writeData(USERS_FILE, users);
  res.status(201).json(newUser);
});

// PUT update a user
app.put('/api/users/:id', validateUser, (req, res) => {
  const users = readData(USERS_FILE);
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    writeData(USERS_FILE, users);
    res.json(users[index]);
  } else {
    res.status(404).send('User not found');
  }
});

// DELETE a user
app.delete('/api/users/:id', (req, res) => {
  let users = readData(USERS_FILE);
  const initialLength = users.length;
  users = users.filter(u => u.id !== parseInt(req.params.id));
  if (users.length < initialLength) {
    writeData(USERS_FILE, users);
    res.status(204).send();
  } else {
    res.status(404).send('User not found');
  }
});

/* ------------------ Projects Endpoints ------------------ */
// GET all projects
app.get('/api/projects', (req, res) => {
  const projects = readData(PROJECTS_FILE);
  res.json(projects);
});

// GET a single project
app.get('/api/projects/:id', (req, res) => {
  const projects = readData(PROJECTS_FILE);
  const project = projects.find(p => p.id === parseInt(req.params.id));
  project ? res.json(project) : res.status(404).send('Project not found');
});

// POST a new project
app.post('/api/projects', validateProject, (req, res) => {
  const projects = readData(PROJECTS_FILE);
  const newProject = req.body;
  newProject.id = projects.length ? projects[projects.length - 1].id + 1 : 1;
  projects.push(newProject);
  writeData(PROJECTS_FILE, projects);
  res.status(201).json(newProject);
});

// PUT update a project
app.put('/api/projects/:id', validateProject, (req, res) => {
  const projects = readData(PROJECTS_FILE);
  const index = projects.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    projects[index] = { ...projects[index], ...req.body };
    writeData(PROJECTS_FILE, projects);
    res.json(projects[index]);
  } else {
    res.status(404).send('Project not found');
  }
});

// DELETE a project
app.delete('/api/projects/:id', (req, res) => {
  let projects = readData(PROJECTS_FILE);
  const initialLength = projects.length;
  projects = projects.filter(p => p.id !== parseInt(req.params.id));
  if (projects.length < initialLength) {
    writeData(PROJECTS_FILE, projects);
    res.status(204).send();
  } else {
    res.status(404).send('Project not found');
  }
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'An unexpected error occurred',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
