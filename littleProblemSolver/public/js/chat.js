/**
 * Chat Problem Solver JavaScript Functions
 * 
 * This module handles the AI-assisted problem-solving chat interface.
 */

// Global variables
let currentProblemId = null;
let planSteps = [];

// Initialize chat interface
function initChatInterface() {
  document.getElementById('chatProblemSelect').addEventListener('change', handleProblemChange);
  document.getElementById('chatSendBtn').addEventListener('click', sendChatMessage);
  document.getElementById('chatInput').addEventListener('keypress', handleChatInputKeypress);
  document.getElementById('createTasksBtn').addEventListener('click', createTasksFromPlan);
}

// Handle problem selection change
async function handleProblemChange() {
  const problemId = this.value;
  const chatInterface = document.getElementById('chatInterface');
  
  if (!problemId) {
    chatInterface.style.display = 'none';
    return;
  }
  
  currentProblemId = parseInt(problemId);
  chatInterface.style.display = 'block';
  
  // Clear existing messages
  document.getElementById('chatMessages').innerHTML = '';
  
  // Clear existing plan steps
  document.getElementById('planSteps').innerHTML = '';
  planSteps = [];
  
  // Load existing chat messages for this problem
  try {
    const messages = await fetchWithErrorHandling(`${CHAT_API}/problem/${problemId}`);
    if (messages && messages.length > 0) {
      messages.forEach(msg => {
        addMessageToChat(msg);
      });
      
      // Automatically generate plan steps from the conversation
      generatePlanSteps(messages);
    } else {
      // Add a welcome message from the AI
      const welcomeMessage = {
        isAi: true,
        message: "Hello! I'm your problem-solving assistant. Let's break down this problem and create a plan to solve it. What specific challenges are you facing with this problem?"
      };
      addMessageToChat(welcomeMessage);
    }
  } catch (error) {
    console.error('Error loading chat messages:', error);
  }
}

// Handle enter key press in chat input
function handleChatInputKeypress(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChatMessage();
  }
}

// Send a chat message
async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  
  if (!message || !currentProblemId) return;
  
  input.value = '';
  
  try {
    // Send message to server
    const userMessage = {
      problemId: currentProblemId,
      userId: 1, // Use the first user ID for now
      message: message,
      isAi: false
    };
    
    // Add message to chat immediately for better UX
    addMessageToChat(userMessage);
    
    // Send to server
    const response = await fetchWithErrorHandling(CHAT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userMessage)
    });
    
    // Load all messages again to get the AI response
    const messages = await fetchWithErrorHandling(`${CHAT_API}/problem/${currentProblemId}`);
    
    // Add only the latest AI message that we don't already have
    const aiMessages = messages.filter(msg => msg.isAi);
    if (aiMessages.length > 0) {
      const latestAiMessage = aiMessages[aiMessages.length - 1];
      // Only add if it's new
      const chatMessages = document.getElementById('chatMessages');
      if (!chatMessages.querySelector(`[data-message-id="${latestAiMessage.id}"]`)) {
        addMessageToChat(latestAiMessage);
      }
    }
    
    // Update the plan based on the conversation
    generatePlanSteps(messages);
    
  } catch (error) {
    console.error('Error sending chat message:', error);
  }
}

// Add a message to the chat display
function addMessageToChat(message) {
  const chatMessages = document.getElementById('chatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${message.isAi ? 'message-ai' : 'message-user'}`;
  if (message.id) {
    messageDiv.setAttribute('data-message-id', message.id);
  }
  
  const timeStr = message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString();
  messageDiv.innerHTML = `
    <div>${message.message}</div>
    <div class="message-meta">${message.isAi ? 'AI Assistant' : 'You'} - ${timeStr}</div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Generate plan steps from chat messages
function generatePlanSteps(messages) {
  // Simple algorithm to generate steps from AI messages
  const aiMessages = messages.filter(msg => msg.isAi);
  
  if (aiMessages.length === 0) return;
  
  // Clear existing plan steps
  planSteps = [];
  
  // Extract key points from AI messages and create plan steps
  // This is a simplified version - in a real app, you'd use NLP or more sophisticated techniques
  aiMessages.forEach(msg => {
    const sentences = msg.message.split(/[.!?]/).filter(s => s.trim().length > 0);
    
    sentences.forEach(sentence => {
      // Look for sentences that seem like they contain actionable steps
      if (
        sentence.includes('should') || 
        sentence.includes('need to') || 
        sentence.includes('recommend') ||
        sentence.includes('suggest') ||
        sentence.includes('approach') ||
        sentence.includes('step') ||
        sentence.includes('first') ||
        sentence.includes('start by') ||
        sentence.includes('create a')
      ) {
        // Don't add duplicate steps
        const trimmedSentence = sentence.trim();
        if (!planSteps.includes(trimmedSentence)) {
          planSteps.push(trimmedSentence);
        }
      }
    });
  });
  
  // If we didn't find specific steps, add a generic step from the latest message
  if (planSteps.length === 0 && aiMessages.length > 0) {
    planSteps.push(aiMessages[aiMessages.length - 1].message);
  }
  
  // Render the plan steps
  renderPlanSteps();
}

// Render the plan steps in the UI
function renderPlanSteps() {
  const planStepsContainer = document.getElementById('planSteps');
  planStepsContainer.innerHTML = '';
  
  if (planSteps.length === 0) {
    planStepsContainer.innerHTML = '<p>Continue the conversation to develop a plan.</p>';
    return;
  }
  
  planSteps.forEach((step, index) => {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'plan-step';
    stepDiv.innerHTML = `
      <div class="step-number">${index + 1}</div>
      <div class="step-content">${step}</div>
    `;
    planStepsContainer.appendChild(stepDiv);
  });
}

// Create tasks from the generated plan
async function createTasksFromPlan() {
  if (!currentProblemId || planSteps.length === 0) {
    alert('Please select a problem and develop a plan first.');
    return;
  }
  
  try {
    // Get the current problem
    const problem = await fetchWithErrorHandling(`${PROBLEMS_API}/${currentProblemId}`);
    
    // Get the first user (in a real app, you'd use the logged-in user)
    const users = await fetchWithErrorHandling(USERS_API);
    const firstUser = users.length > 0 ? users[0].username : '';
    
    if (!firstUser) {
      alert('Please create a user first.');
      return;
    }
    
    // Create tasks from plan steps
    const today = new Date();
    const taskPromises = planSteps.map((step, index) => {
      const deadline = new Date(today);
      deadline.setDate(today.getDate() + (index + 1) * 3); // Space tasks 3 days apart
      
      const taskData = {
        problem: problem.name,
        title: step,
        assignedUser: firstUser,
        start_date: today.toISOString().split('T')[0],
        deadline: deadline.toISOString().split('T')[0],
        duration: 3,
        status: 'Open'
      };
      
      return fetchWithErrorHandling(TASKS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
    });
    
    await Promise.all(taskPromises);
    
    alert('Steps created successfully! Switch to the Steps tab to view them.');
    fetchTasks(); // Refresh tasks in case the user switches to that tab
    
  } catch (error) {
    console.error('Error creating tasks from plan:', error);
    alert('Error creating tasks. Please try again.');
  }
}