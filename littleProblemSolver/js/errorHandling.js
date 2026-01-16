// Error handling and utility functions

// Enhanced fetch with error handling
window.fetchWithErrorHandling = async function(url, options = {}) {
  try {
    console.log(`API Request: ${options.method || 'GET'} ${url}`);
    if (options.body) {
      console.log('Request Body:', options.body);
    }
    
    const response = await fetch(url, options);
    console.log(`Response Status: ${response.status}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', errorData);
      throw new Error(errorData.message || errorData.error || `Request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response Data:', data);
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    showErrorMessage(error.message || 'Failed to complete request');
    throw error;
  }
}

// Display error message
window.showErrorMessage = function(message) {
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}

// Empty state renderers
window.renderEmptyTasksState = function(tbody) {
  const tr = document.createElement('tr');
  const td = document.createElement('td');
  td.colSpan = 6; // Match your column count
  td.className = 'empty-state';
  td.innerHTML = `
    <div class="empty-state-message">
      <p>No tasks found</p>
      <button class="btn-primary" onclick="document.querySelector('[data-target=\\'taskFormContainer\\']').click()">
        Create your first task
      </button>
    </div>
  `;
  tr.appendChild(td);
  tbody.appendChild(tr);
}

window.renderEmptyUsersState = function(tbody) {
  const tr = document.createElement('tr');
  const td = document.createElement('td');
  td.colSpan = 3; // Match your column count
  td.className = 'empty-state';
  td.innerHTML = `
    <div class="empty-state-message">
      <p>No users found</p>
      <button class="btn-primary" onclick="document.querySelector('[data-target=\\'userFormContainer\\']').click()">
        Create your first user
      </button>
    </div>
  `;
  tr.appendChild(td);
  tbody.appendChild(tr);
}

window.renderEmptyProjectsState = function(tbody) {
  const tr = document.createElement('tr');
  const td = document.createElement('td');
  td.colSpan = 2; // Match your column count
  td.className = 'empty-state';
  td.innerHTML = `
    <div class="empty-state-message">
      <p>No projects found</p>
      <button class="btn-primary" onclick="document.querySelector('[data-target=\\'projectFormContainer\\']').click()">
        Create your first project
      </button>
    </div>
  `;
  tr.appendChild(td);
  tbody.appendChild(tr);
}