// Gantt chart implementation for LittleTaskMan

// Make sure we have access to the API endpoints
if (typeof TASKS_API === 'undefined') {
  window.TASKS_API = '/api/tasks';
}
if (typeof USERS_API === 'undefined') {
  window.USERS_API = '/api/users';
}
if (typeof PROJECTS_API === 'undefined') {
  window.PROJECTS_API = '/api/projects';
}

// Gantt chart initialization
window.initGanttChart = function() {
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

window.setupGantt = function() {
  const gantt = window.gantt;
  
  // Configure gantt
  gantt.config.date_format = "%Y-%m-%d";
  gantt.config.drag_progress = false;
  gantt.config.row_height = 30;
  gantt.config.xml_date = "%Y-%m-%d";
  
  // Define task coloring by status
  gantt.templates.task_class = function(start, end, task) {
    switch(task.status.toLowerCase()) {
      case 'open': return 'status-open';
      case 'in progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
      case 'blocked': return 'status-blocked';
      case 'postponed': return 'status-postponed';
      default: return '';
    }
  };
  
  // Task tooltip
  gantt.templates.tooltip_text = function(start, end, task) {
    return `<b>Task:</b> ${task.text}<br>
            <b>Project:</b> ${task.project}<br>
            <b>User:</b> ${task.assignedUser}<br>
            <b>Start date:</b> ${gantt.date.date_to_str('%Y-%m-%d')(start)}<br>
            <b>End date:</b> ${gantt.date.date_to_str('%Y-%m-%d')(end)}<br>
            <b>Status:</b> ${task.status}`;
  };
  
  // Initialize gantt
  gantt.init("ganttChart");
  
  // Configure scales
  gantt.config.scales = [
    {unit: "month", step: 1, format: "%F, %Y"},
    {unit: "week", step: 1, format: "Week #%W"},
    {unit: "day", step: 1, format: "%d %M"}
  ];
  
  // Load data from our API
  loadGanttData();
  
  // Setup gantt controls
  document.getElementById('zoomInBtn').addEventListener('click', () => {
    if (gantt.ext && gantt.ext.zoom) {
      gantt.ext.zoom.zoomIn();
    } else {
      console.log('Zoom extension not available');
    }
  });
  
  document.getElementById('zoomOutBtn').addEventListener('click', () => {
    if (gantt.ext && gantt.ext.zoom) {
      gantt.ext.zoom.zoomOut();
    } else {
      console.log('Zoom extension not available');
    }
  });
  
  document.getElementById('todayBtn').addEventListener('click', () => {
    gantt.showDate(new Date());
  });
  
  // Filter by project
  document.getElementById('ganttProjectFilter').addEventListener('change', function() {
    loadGanttData(this.value);
  });
}

window.loadGanttData = async function(projectFilter = 'all') {
  try {
    const tasks = await fetchWithErrorHandling(TASKS_API);
    
    // Format data for gantt
    const ganttData = {
      data: tasks.filter(task => {
        return projectFilter === 'all' || task.project === projectFilter;
      }).map(task => ({
        id: task.id,
        text: task.title,
        project: task.project,
        assignedUser: task.assignedUser,
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
    populateGanttProjectFilter();
  } catch (error) {
    console.error("Error loading Gantt data:", error);
  }
}

window.populateGanttProjectFilter = async function() {
  try {
    const projects = await fetchWithErrorHandling(PROJECTS_API);
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
  } catch (error) {
    console.error("Error populating project filter:", error);
  }
}

// Initialize Gantt when the tab is clicked
window.initGanttView = function() {
  document.querySelector('.tab[data-view="ganttView"]').addEventListener('click', function() {
    if (!window.ganttInitialized) {
      initGanttChart();
      window.ganttInitialized = true;
    }
  });
}

// Add to initialization
document.addEventListener("DOMContentLoaded", function() {
  initGanttView();
});