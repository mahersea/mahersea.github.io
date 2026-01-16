const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3040;

// Path to topics.json file
const TOPICS_FILE = path.join(__dirname, '..', 'topics.json');

// Middleware
app.use(express.json());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '..')));

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Read topics data
function readTopics() {
  try {
    const data = fs.readFileSync(TOPICS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading topics file: ${error.message}`);
    return { topics: [] };
  }
}

// Write topics data
function writeTopics(data) {
  try {
    fs.writeFileSync(TOPICS_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing topics file: ${error.message}`);
    return false;
  }
}

// API Routes
// Get all topics
app.get('/api/topics', (req, res) => {
  const topics = readTopics();
  res.json(topics);
});

// Get a single topic
app.get('/api/topics/:id', (req, res) => {
  const topics = readTopics();
  const topic = topics.topics.find(t => t.id === req.params.id);
  
  if (topic) {
    res.json(topic);
  } else {
    res.status(404).json({ error: 'Topic not found' });
  }
});

// Create a new topic
app.post('/api/topics', (req, res) => {
  const newTopic = req.body;
  const topics = readTopics();
  
  // Check if topic ID already exists
  if (topics.topics.some(t => t.id === newTopic.id)) {
    return res.status(400).json({ error: 'A topic with this ID already exists' });
  }
  
  // Add the new topic
  topics.topics.push(newTopic);
  
  if (writeTopics(topics)) {
    res.status(201).json(newTopic);
  } else {
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

// Update a topic
app.put('/api/topics/:id', (req, res) => {
  const updatedTopic = req.body;
  const topics = readTopics();
  const index = topics.topics.findIndex(t => t.id === req.params.id);
  
  if (index !== -1) {
    topics.topics[index] = updatedTopic;
    
    if (writeTopics(topics)) {
      res.json(updatedTopic);
    } else {
      res.status(500).json({ error: 'Failed to update topic' });
    }
  } else {
    res.status(404).json({ error: 'Topic not found' });
  }
});

// Delete a topic
app.delete('/api/topics/:id', (req, res) => {
  const topics = readTopics();
  const filteredTopics = topics.topics.filter(t => t.id !== req.params.id);
  
  if (filteredTopics.length < topics.topics.length) {
    topics.topics = filteredTopics;
    
    if (writeTopics(topics)) {
      res.status(204).end();
    } else {
      res.status(500).json({ error: 'Failed to delete topic' });
    }
  } else {
    res.status(404).json({ error: 'Topic not found' });
  }
});

// Update the entire topics.json file
app.put('/api/topics', (req, res) => {
  if (writeTopics(req.body)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to update topics' });
  }
});

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});