-- Database initialization script for littleTaskMan

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  project VARCHAR(255) NOT NULL,
  assigned_user VARCHAR(255) NOT NULL,
  deadline DATE NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('Open', 'In Progress', 'Completed', 'Blocked', 'Postponed')),
  start_date DATE NOT NULL,
  duration INTEGER NOT NULL DEFAULT 1,
  dependencies JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on task status for faster filtering
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Create index on task assigned_user for faster filtering
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_user ON tasks(assigned_user);

-- Create index on project name for faster lookups
CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(name);
