const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3004;

// Data file paths
const TASKS_FILE = path.join(__dirname, 'tasks.json');
const USERS_FILE = path.join(__dirname, 'users.json');
const PROBLEMS_FILE = path.join(__dirname, 'problems.json');
const CHAT_FILE = path.join(__dirname, 'chat.json');

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

function validateProblem(req, res, next) {
  console.log('Validating problem:', req.body);
  const { name } = req.body;
  
  if (!name) {
    console.log('Problem validation failed: Missing name field');
    return res.status(400).json({ error: 'Missing required fields (name)' });
  }
  
  console.log('Problem validation passed');
  next();
}

function validateChatMessage(req, res, next) {
  const { problemId, userId, message } = req.body;
  
  if (!problemId || !userId || !message) {
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

/* ------------------ Problems Endpoints ------------------ */
// GET all problems
app.get('/api/problems', (req, res) => {
  const problems = readData(PROBLEMS_FILE);
  res.json(problems);
});

// GET a single problem
app.get('/api/problems/:id', (req, res) => {
  const problems = readData(PROBLEMS_FILE);
  const problem = problems.find(p => p.id === parseInt(req.params.id));
  problem ? res.json(problem) : res.status(404).send('Problem not found');
});

// POST a new problem
app.post('/api/problems', validateProblem, (req, res) => {
  console.log('Creating new problem:', req.body);
  const problems = readData(PROBLEMS_FILE);
  const newProblem = req.body;
  newProblem.id = problems.length ? problems[problems.length - 1].id + 1 : 1;
  console.log('Assigned problem ID:', newProblem.id);
  problems.push(newProblem);
  writeData(PROBLEMS_FILE, problems);
  console.log('Problem saved successfully:', newProblem);
  res.status(201).json(newProblem);
});

// PUT update a problem
app.put('/api/problems/:id', validateProblem, (req, res) => {
  const problems = readData(PROBLEMS_FILE);
  const index = problems.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    problems[index] = { ...problems[index], ...req.body };
    writeData(PROBLEMS_FILE, problems);
    res.json(problems[index]);
  } else {
    res.status(404).send('Problem not found');
  }
});

// DELETE a problem
app.delete('/api/problems/:id', (req, res) => {
  let problems = readData(PROBLEMS_FILE);
  const initialLength = problems.length;
  problems = problems.filter(p => p.id !== parseInt(req.params.id));
  if (problems.length < initialLength) {
    writeData(PROBLEMS_FILE, problems);
    res.status(204).send();
  } else {
    res.status(404).send('Problem not found');
  }
});

/* ------------------ Chat Endpoints ------------------ */
// GET all chat messages
app.get('/api/chat', (req, res) => {
  const chat = readData(CHAT_FILE);
  res.json(chat);
});

// GET chat messages for a specific problem
app.get('/api/chat/problem/:problemId', (req, res) => {
  const chat = readData(CHAT_FILE);
  const problemMessages = chat.filter(msg => msg.problemId === parseInt(req.params.problemId));
  res.json(problemMessages);
});

// POST a new chat message
app.post('/api/chat', validateChatMessage, (req, res) => {
  const chat = readData(CHAT_FILE);
  const newMessage = {
    ...req.body,
    id: chat.length ? chat[chat.length - 1].id + 1 : 1,
    timestamp: new Date().toISOString(),
    isAi: req.body.isAi || false
  };
  
  chat.push(newMessage);
  writeData(CHAT_FILE, chat);
  
  // If it's a user message, generate AI response
  if (!newMessage.isAi) {
    // Create AI response
    const aiResponse = {
      id: chat.length ? chat[chat.length - 1].id + 1 : 1,
      problemId: newMessage.problemId,
      userId: 'ai',
      message: generateAiResponse(newMessage.message),
      timestamp: new Date().toISOString(),
      isAi: true
    };
    
    chat.push(aiResponse);
    writeData(CHAT_FILE, chat);
  }
  
  res.status(201).json(newMessage);
});

// Helper function to generate AI responses
function generateAiResponse(userMessage) {
  const responses = [
    "Let's break down this problem step by step. First, we need to identify the key components.",
    "The key to solving this problem is creating a clear plan with well-defined steps.",
    "I suggest we approach this by identifying the main goal and working backwards.",
    "Every problem has a solution. Let's start by defining what success looks like.",
    "This is an interesting challenge. Let's map out a strategy to address it.",
    "For this problem, we should consider the constraints and available resources first.",
    "I recommend creating a visual representation of this problem to better understand it.",
    "Let's identify the stakeholders and their needs before diving into solutions.",
    "The most effective approach would be to create a timeline with specific milestones.",
    "Breaking this down into smaller, manageable tasks will make it much easier to solve."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

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
