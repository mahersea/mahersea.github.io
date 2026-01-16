# Error Handling Improvements

## Current Situation
The app has basic error handling for file operations, but needs more robust handling for:
- Empty data files
- API error responses
- User input validation
- Frontend error states

## Server-Side Improvements

### Enhanced readData Function
```javascript
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
```

### API Error Handling Middleware
```javascript
// Add this after your other middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'An unexpected error occurred',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
  });
});
```

### Input Validation
Add validation middleware for POST/PUT requests:
```javascript
function validateTask(req, res, next) {
  const { title, project, assignedUser, deadline, status } = req.body;
  
  if (!title || !project || !assignedUser || !deadline || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Additional validation as needed
  const validStatuses = ['Open', 'In Progress', 'Completed', 'Blocked', 'Postponed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }
  
  next();
}

// Then use in routes:
app.post('/api/tasks', validateTask, (req, res) => {
  // Existing code
});
```

## Frontend Improvements

### API Error Handling
```javascript
async function fetchWithErrorHandling(url, options = {}) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    showErrorMessage(error.message || 'Failed to complete request');
    throw error;
  }
}

function showErrorMessage(message) {
  const errorDiv = document.getElementById('errorMessage') || createErrorElement();
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}

function createErrorElement() {
  const errorDiv = document.createElement('div');
  errorDiv.id = 'errorMessage';
  errorDiv.className = 'error-message';
  errorDiv.style.cssText = 'display:none; position:fixed; top:20px; right:20px; background:#E74C3C; color:white; padding:10px 20px; border-radius:4px; z-index:1000;';
  document.body.appendChild(errorDiv);
  return errorDiv;
}
```

### Empty State Handling
```javascript
function renderTasks(tasks) {
  const tbody = document.querySelector('#tasksTable tbody');
  tbody.innerHTML = '';
  
  if (tasks.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 6; // Adjust to match your column count
    td.className = 'empty-state';
    td.innerHTML = `
      <div class="empty-state-message">
        <p>No tasks found</p>
        <button onclick="document.querySelector('[data-target=\\'taskFormContainer\\']').click()">
          Create your first task
        </button>
      </div>
    `;
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }
  
  // Existing task rendering code
}
```

## Add Empty State CSS
```css
.empty-state {
  text-align: center;
  padding: 40px 0 !important;
}

.empty-state-message {
  color: #7F8C8D;
}

.empty-state-message button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #2A7B8B;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
```