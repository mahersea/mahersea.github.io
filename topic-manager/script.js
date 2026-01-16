// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
  const TOPICS_FILE = '../topics.json';
  let topicsData = {};
  let editingTopic = null;
  
  // DOM Elements
  const topicsTable = document.getElementById('topicsTable');
  const topicFormContainer = document.getElementById('topicFormContainer');
  const topicForm = document.getElementById('topicForm');
  const errorMessage = document.getElementById('errorMessage');
  const cancelTopicBtn = document.getElementById('cancelTopicBtn');
  
  // Function to show error message
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
      errorMessage.style.display = 'none';
    }, 5000);
  }
  
  // Function to load topics from JSON file
  async function loadTopics() {
    try {
      const response = await fetch(TOPICS_FILE);
      const data = await response.json();
      
      topicsData = data;
      renderTopicsTable(data.topics);
    } catch (error) {
      showError(`Error loading topics: ${error.message}`);
    }
  }
  
  // Function to render topics table
  function renderTopicsTable(topics) {
    const tbody = topicsTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    topics.forEach(topic => {
      const row = document.createElement('tr');
      
      // Icon display
      const iconDisplay = document.createElement('div');
      iconDisplay.className = 'topic-icon';
      iconDisplay.title = `Icon: ${topic.icon}`;
      iconDisplay.textContent = topic.icon;
      
      row.innerHTML = `
        <td>${topic.name}</td>
        <td>${topic.description || ''}</td>
        <td></td>
        <td>
          <div class="action-buttons">
            <button type="button" class="btn-secondary edit-topic" data-id="${topic.id}">Edit</button>
            <button type="button" class="btn-danger delete-topic" data-id="${topic.id}">Delete</button>
          </div>
        </td>
      `;
      
      // Add icon to the icon cell
      row.querySelector('td:nth-child(3)').appendChild(iconDisplay);
      
      tbody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-topic').forEach(btn => {
      btn.addEventListener('click', function() {
        const topicId = this.getAttribute('data-id');
        editTopic(topicId);
      });
    });
    
    document.querySelectorAll('.delete-topic').forEach(btn => {
      btn.addEventListener('click', function() {
        const topicId = this.getAttribute('data-id');
        deleteTopic(topicId);
      });
    });
  }
  
  // Function to edit a topic
  function editTopic(topicId) {
    const topic = topicsData.topics.find(t => t.id === topicId);
    
    if (topic) {
      editingTopic = topic;
      
      // Fill form fields with topic data
      document.getElementById('topicId').value = topic.id;
      document.getElementById('id').value = topic.id;
      document.getElementById('name').value = topic.name;
      document.getElementById('description').value = topic.description || '';
      document.getElementById('icon').value = topic.icon || '';
      
      // Show form and update title
      document.getElementById('topicFormTitle').textContent = 'Edit Topic';
      topicFormContainer.style.display = 'block';
    } else {
      showError('Topic not found!');
    }
  }
  
  // Function to delete a topic
  function deleteTopic(topicId) {
    if (confirm('Are you sure you want to delete this topic?')) {
      const topicIndex = topicsData.topics.findIndex(t => t.id === topicId);
      
      if (topicIndex !== -1) {
        // Remove topic from data
        topicsData.topics.splice(topicIndex, 1);
        
        // Save updated topics data
        saveTopics();
      } else {
        showError('Topic not found!');
      }
    }
  }
  
  // Function to save topics data
  async function saveTopics() {
    try {
      const response = await fetch(TOPICS_FILE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(topicsData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save topics data');
      }
      
      // Reload topics after save
      loadTopics();
      
      // Reset form and hide it
      resetTopicForm();
    } catch (error) {
      showError(`Error saving topics: ${error.message}`);
      console.error('Due to browser limitations, direct file saving is not possible. In a real app, this would save to server.');
      console.log('Updated topics data:', JSON.stringify(topicsData, null, 2));
      
      // For demonstration, update the UI anyway
      renderTopicsTable(topicsData.topics);
    }
  }
  
  // Function to reset the topic form
  function resetTopicForm() {
    topicForm.reset();
    document.getElementById('topicId').value = '';
    document.getElementById('topicFormTitle').textContent = 'Add New Topic';
    topicFormContainer.style.display = 'none';
    editingTopic = null;
  }
  
  // Event listener for form submit
  topicForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
      id: document.getElementById('id').value,
      name: document.getElementById('name').value,
      description: document.getElementById('description').value,
      icon: document.getElementById('icon').value
    };
    
    // Validate required fields
    if (!formData.id || !formData.name || !formData.icon) {
      showError('Please fill in all required fields');
      return;
    }
    
    if (editingTopic) {
      // Update existing topic
      const topicIndex = topicsData.topics.findIndex(t => t.id === editingTopic.id);
      
      if (topicIndex !== -1) {
        topicsData.topics[topicIndex] = formData;
      } else {
        showError('Topic not found!');
        return;
      }
    } else {
      // Check if ID already exists
      if (topicsData.topics.some(t => t.id === formData.id)) {
        showError('A topic with this ID already exists!');
        return;
      }
      
      // Add new topic
      topicsData.topics.push(formData);
    }
    
    // Save topics data
    saveTopics();
  });
  
  // Event listener for cancel button
  cancelTopicBtn.addEventListener('click', resetTopicForm);
  
  // Event listener for toggle form button
  document.querySelector('.toggle-form').addEventListener('click', function() {
    if (topicFormContainer.style.display === 'block') {
      resetTopicForm();
    } else {
      resetTopicForm(); // Reset form first to clear any previous data
      topicFormContainer.style.display = 'block';
    }
  });
  
  // Initialize
  loadTopics();
});