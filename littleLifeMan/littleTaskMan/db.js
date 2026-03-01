const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set!');
  console.error('Please add a PostgreSQL database to your Railway project.');
  console.error('For local development, create a .env file with DATABASE_URL.');
  process.exit(1);
}

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✓ Database connection successful');
    client.release();
    return true;
  } catch (err) {
    console.error('✗ Database connection failed:', err.message);
    throw err;
  }
}

// Initialize database tables
async function initializeDatabase() {
  try {
    const initSQL = fs.readFileSync(path.join(__dirname, 'db-init.sql'), 'utf8');
    await pool.query(initSQL);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
}

/* ------------------ Tasks Database Functions ------------------ */
async function getAllTasks() {
  const result = await pool.query('SELECT * FROM tasks ORDER BY id');
  return result.rows.map(formatTask);
}

async function getTaskById(id) {
  const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
  return result.rows.length ? formatTask(result.rows[0]) : null;
}

async function createTask(task) {
  const { title, project, assignedUser, deadline, status, start_date, duration, dependencies } = task;
  const result = await pool.query(
    `INSERT INTO tasks (title, project, assigned_user, deadline, status, start_date, duration, dependencies)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [title, project, assignedUser, deadline, status, start_date, duration, JSON.stringify(dependencies || [])]
  );
  return formatTask(result.rows[0]);
}

async function updateTask(id, task) {
  const { title, project, assignedUser, deadline, status, start_date, duration, dependencies } = task;
  const result = await pool.query(
    `UPDATE tasks
     SET title = $1, project = $2, assigned_user = $3, deadline = $4, status = $5,
         start_date = $6, duration = $7, dependencies = $8, updated_at = CURRENT_TIMESTAMP
     WHERE id = $9
     RETURNING *`,
    [title, project, assignedUser, deadline, status, start_date, duration, JSON.stringify(dependencies || []), id]
  );
  return result.rows.length ? formatTask(result.rows[0]) : null;
}

async function deleteTask(id) {
  const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  return result.rowCount > 0;
}

/* ------------------ Users Database Functions ------------------ */
async function getAllUsers() {
  const result = await pool.query('SELECT * FROM users ORDER BY id');
  return result.rows;
}

async function getUserById(id) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows.length ? result.rows[0] : null;
}

async function createUser(user) {
  const { username, role } = user;
  const result = await pool.query(
    'INSERT INTO users (username, role) VALUES ($1, $2) RETURNING *',
    [username, role]
  );
  return result.rows[0];
}

async function updateUser(id, user) {
  const { username, role } = user;
  const result = await pool.query(
    'UPDATE users SET username = $1, role = $2 WHERE id = $3 RETURNING *',
    [username, role, id]
  );
  return result.rows.length ? result.rows[0] : null;
}

async function deleteUser(id) {
  const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
  return result.rowCount > 0;
}

/* ------------------ Projects Database Functions ------------------ */
async function getAllProjects() {
  const result = await pool.query('SELECT * FROM projects ORDER BY id');
  return result.rows;
}

async function getProjectById(id) {
  const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
  return result.rows.length ? result.rows[0] : null;
}

async function createProject(project) {
  const { name, description } = project;
  const result = await pool.query(
    'INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *',
    [name, description || null]
  );
  return result.rows[0];
}

async function updateProject(id, project) {
  const { name, description } = project;
  const result = await pool.query(
    'UPDATE projects SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description || null, id]
  );
  return result.rows.length ? result.rows[0] : null;
}

async function deleteProject(id) {
  const result = await pool.query('DELETE FROM projects WHERE id = $1', [id]);
  return result.rowCount > 0;
}

/* ------------------ Helper Functions ------------------ */
function formatTask(task) {
  // Convert snake_case DB fields to camelCase for API compatibility
  return {
    id: task.id,
    title: task.title,
    project: task.project,
    assignedUser: task.assigned_user,
    deadline: task.deadline,
    status: task.status,
    start_date: task.start_date,
    duration: task.duration,
    dependencies: task.dependencies || []
  };
}

module.exports = {
  pool,
  testConnection,
  initializeDatabase,
  // Tasks
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  // Users
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  // Projects
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
