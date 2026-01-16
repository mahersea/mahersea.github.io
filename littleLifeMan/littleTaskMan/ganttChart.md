# Gantt Chart Implementation

## Overview
A Gantt chart view for LittleTaskMan will visualize tasks, their timelines, and dependencies in a calendar-based format.

## Implementation Plan

### 1. Add New Dependencies
Add to package.json:
```json
"dependencies": {
  "body-parser": "^2.2.0",
  "express": "^5.1.0",
  "dhtmlx-gantt": "^8.0.1"  // Modern Gantt chart library
}
```

### 2. Create Gantt View HTML
Add a new tab and view section in index.html:

```html
<!-- Tab Navigation - Add this -->
<div class="tab" data-view="ganttView">Gantt Chart</div>

<!-- Gantt View - Add this section -->
<div id="ganttView" class="view">
  <h2>Project Timeline</h2>
  <div class="gantt-toolbar">
    <select id="ganttProjectFilter">
      <option value="all">All Projects</option>
      <!-- Projects will be added here -->
    </select>
    <button id="zoomInBtn">Zoom In</button>
    <button id="zoomOutBtn">Zoom Out</button>
    <button id="todayBtn">Today</button>
  </div>
  <div id="ganttChart" style="width:100%; height:500px;"></div>
</div>
```

### 3. Data Structure Updates
Update the task schema to include Gantt data:

```javascript
// POST a new task - Update with new fields
app.post('/api/tasks', (req, res) => {
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
```

### 4. Gantt Chart Implementation (JavaScript)
Add this to a new file: `public/js/gantt.js`

```javascript
// Gantt chart initialization
function initGanttChart() {
  // Link CSS file
  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = 'https://cdn.dhtmlx.com/gantt/edge/dhtmlxgantt.css';
  document.head.appendChild(linkElement);
  
  // Load script dynamically
  const script = document.createElement('script');
  script.src = 'https://cdn.dhtmlx.com/gantt/edge/dhtmlxgantt.js';
  script.onload = setupGantt;
  document.head.appendChild(script);
}

function setupGantt() {
  const gantt = window.gantt;
  
  // Configure gantt
  gantt.config.date_format = "%Y-%m-%d";
  gantt.config.drag_progress = false;
  
  // Define task coloring by status
  gantt.templates.task_class = function(start, end, task) {
    switch(task.status.toLowerCase()) {
      case 'open': return 'status-open';
      case 'in progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };
  
  // Initialize gantt
  gantt.init("ganttChart");
  
  // Load data from our API
  loadGanttData();
  
  // Setup gantt controls
  document.getElementById('zoomInBtn').addEventListener('click', () => {
    gantt.ext.zoom.zoomIn();
  });
  
  document.getElementById('zoomOutBtn').addEventListener('click', () => {
    gantt.ext.zoom.zoomOut();
  });
  
  document.getElementById('todayBtn').addEventListener('click', () => {
    gantt.showDate(new Date());
  });
  
  // Filter by project
  document.getElementById('ganttProjectFilter').addEventListener('change', function() {
    loadGanttData(this.value);
  });
}

async function loadGanttData(projectFilter = 'all') {
  try {
    const response = await fetch(TASKS_API);
    const tasks = await response.json();
    
    // Format data for gantt
    const ganttData = {
      data: tasks.filter(task => {
        return projectFilter === 'all' || task.project === projectFilter;
      }).map(task => ({
        id: task.id,
        text: task.title,
        start_date: task.start_date || task.deadline,
        duration: task.duration || 1,
        status: task.status,
        progress: task.status === 'Completed' ? 1 : 
                 task.status === 'In Progress' ? 0.5 : 0.0,
      })),
      links: [] // We'll add links for dependencies in a later phase
    };
    
    gantt.parse(ganttData);
    
    // Also populate the project filter
    populateProjectFilter();
  } catch (error) {
    console.error("Error loading Gantt data:", error);
  }
}

async function populateProjectFilter() {
  const response = await fetch(PROJECTS_API);
  const projects = await response.json();
  const filter = document.getElementById('ganttProjectFilter');
  
  // Keep the "All Projects" option
  const allOption = filter.options[0];
  filter.innerHTML = '';
  filter.appendChild(allOption);
  
  // Add project options
  projects.forEach(project => {
    const option = document.createElement('option');
    option.value = project.name;
    option.textContent = project.name;
    filter.appendChild(option);
  });
}

// Call at initialization
document.addEventListener("DOMContentLoaded", function() {
  // Add tab click listener for Gantt view
  document.querySelector('.tab[data-view="ganttView"]').addEventListener('click', function() {
    if (!window.ganttInitialized) {
      initGanttChart();
      window.ganttInitialized = true;
    }
  });
});
```

### 5. Update the Task Form
Add new fields to the task form to support Gantt data:

```html
<!-- Inside the task form, add these fields -->
<div>
  <label>Start Date: </label>
  <input type="date" id="startDate">
</div>
<div>
  <label>Duration (days): </label>
  <input type="number" id="duration" min="1" value="1">
</div>
<div>
  <label>Dependencies: </label>
  <select id="dependencies" multiple>
    <!-- Will be populated with existing tasks -->
  </select>
</div>
```

## Additional Required CSS
```css
/* Gantt-specific styles */
#ganttChart {
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 15px;
}

.gantt-toolbar {
  margin: 10px 0;
  display: flex;
  gap: 10px;
}

.gantt_task_line.status-open {
  background-color: #E74C3C;
}

.gantt_task_line.status-in-progress {
  background-color: #F39C12;
}

.gantt_task_line.status-completed {
  background-color: #27AE60;
}
```