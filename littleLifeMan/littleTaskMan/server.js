require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3003;

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

/* ------------------ Tasks Endpoints ------------------ */
// GET all tasks
app.get('/api/tasks', async (req, res, next) => {
  try {
    const tasks = await db.getAllTasks();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// GET a single task
app.get('/api/tasks/:id', async (req, res, next) => {
  try {
    const task = await db.getTaskById(parseInt(req.params.id));
    task ? res.json(task) : res.status(404).json({ error: 'Task not found' });
  } catch (err) {
    next(err);
  }
});

// POST a new task
app.post('/api/tasks', validateTask, async (req, res, next) => {
  try {
    const newTask = req.body;

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

    const task = await db.createTask(newTask);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// PUT update a task
app.put('/api/tasks/:id', validateTask, async (req, res, next) => {
  try {
    const task = await db.updateTask(parseInt(req.params.id), req.body);
    task ? res.json(task) : res.status(404).json({ error: 'Task not found' });
  } catch (err) {
    next(err);
  }
});

// DELETE a task
app.delete('/api/tasks/:id', async (req, res, next) => {
  try {
    const deleted = await db.deleteTask(parseInt(req.params.id));
    deleted ? res.status(204).send() : res.status(404).json({ error: 'Task not found' });
  } catch (err) {
    next(err);
  }
});

/* ------------------ Users Endpoints ------------------ */
// GET all users
app.get('/api/users', async (req, res, next) => {
  try {
    const users = await db.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET a single user
app.get('/api/users/:id', async (req, res, next) => {
  try {
    const user = await db.getUserById(parseInt(req.params.id));
    user ? res.json(user) : res.status(404).json({ error: 'User not found' });
  } catch (err) {
    next(err);
  }
});

// POST a new user
app.post('/api/users', validateUser, async (req, res, next) => {
  try {
    const user = await db.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// PUT update a user
app.put('/api/users/:id', validateUser, async (req, res, next) => {
  try {
    const user = await db.updateUser(parseInt(req.params.id), req.body);
    user ? res.json(user) : res.status(404).json({ error: 'User not found' });
  } catch (err) {
    next(err);
  }
});

// DELETE a user
app.delete('/api/users/:id', async (req, res, next) => {
  try {
    const deleted = await db.deleteUser(parseInt(req.params.id));
    deleted ? res.status(204).send() : res.status(404).json({ error: 'User not found' });
  } catch (err) {
    next(err);
  }
});

/* ------------------ Projects Endpoints ------------------ */
// GET all projects
app.get('/api/projects', async (req, res, next) => {
  try {
    const projects = await db.getAllProjects();
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// GET a single project
app.get('/api/projects/:id', async (req, res, next) => {
  try {
    const project = await db.getProjectById(parseInt(req.params.id));
    project ? res.json(project) : res.status(404).json({ error: 'Project not found' });
  } catch (err) {
    next(err);
  }
});

// POST a new project
app.post('/api/projects', validateProject, async (req, res, next) => {
  try {
    const project = await db.createProject(req.body);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

// PUT update a project
app.put('/api/projects/:id', validateProject, async (req, res, next) => {
  try {
    const project = await db.updateProject(parseInt(req.params.id), req.body);
    project ? res.json(project) : res.status(404).json({ error: 'Project not found' });
  } catch (err) {
    next(err);
  }
});

// DELETE a project
app.delete('/api/projects/:id', async (req, res, next) => {
  try {
    const deleted = await db.deleteProject(parseInt(req.params.id));
    deleted ? res.status(204).send() : res.status(404).json({ error: 'Project not found' });
  } catch (err) {
    next(err);
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

// Initialize database and start server
async function startServer() {
  try {
    console.log('Starting littleTaskMan server...');
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Port: ${PORT}`);

    // Test database connection first
    await db.testConnection();

    // Initialize database tables
    await db.initializeDatabase();

    // Start the server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log('Ready to accept requests');
    });
  } catch (err) {
    console.error('✗ Failed to start server:', err.message);
    console.error('Stack trace:', err.stack);
    process.exit(1);
  }
}

startServer();
