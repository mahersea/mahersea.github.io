#!/bin/bash

# This script creates a basic structure for each "little{SOMETHING}Man" project
# Usage: ./create_structure.sh projectName primaryColor secondaryColor

if [ "$#" -lt 3 ]; then
  echo "Usage: $0 projectName primaryColor secondaryColor"
  echo "Example: $0 Money '#3498DB' '#2ECC71'"
  exit 1
fi

PROJECT_NAME=$1
PRIMARY_COLOR=$2
SECONDARY_COLOR=$3
PROJECT_DIR="/Users/maherse/mahersea-projects/mahersea.github.io/littleLifeMan/little${PROJECT_NAME}Man"

# Create directory structure
mkdir -p "${PROJECT_DIR}/public/css"
mkdir -p "${PROJECT_DIR}/public/js"
mkdir -p "${PROJECT_DIR}/public/images"

# Create CSS file
cat > "${PROJECT_DIR}/public/css/style.css" << EOF
/* Little${PROJECT_NAME}Man Styles */

/* Global Styles & Variables */
:root {
  /* Primary Colors - ${PROJECT_NAME} theme */
  --primary: ${PRIMARY_COLOR};
  --secondary: ${SECONDARY_COLOR};
  --background: #F5F5F5;    /* Light Grey */
  --text: #333333;          /* Charcoal */

  /* Status Colors */
  --status-open: #de8787;
  --status-in-progress: #F39C12;
  --status-completed: #aade87;
  --status-blocked: #8E44AD;
  --status-postponed: #7F8C8D;
  
  /* UI Colors */
  --border-light: #EEEEEE;
  --background-light: #F8F8F8;
  --shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/* Typography */
body {
  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: var(--text);
  margin: 20px;
  background-color: var(--background-light);
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  margin-top: 0;
}

h1 {
  font-size: 28px;
  color: var(--primary);
}

h2 {
  font-size: 24px;
  color: var(--primary);
  display: inline-block;
  margin-right: 10px;
}

/* Layout */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  box-shadow: var(--shadow);
  border-radius: 8px;
}

/* Logo and Header */
.app-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

#logo-text {
  font-size: 18px;
  color: var(--primary);
  font-weight: bold;
  font-family: 'Montserrat', sans-serif;
  margin-left: 16px;
}

/* Tab Navigation */
.tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border-light);
  align-items: center;
}

.tab {
  padding: 12px 24px;
  margin-right: 5px;
  background: white;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  font-weight: 600;
  transition: all 0.2s ease;
  border: 1px solid var(--border-light);
  border-bottom: none;
  color: var(--text);
}

.tab:hover {
  background: var(--background);
  color: var(--text);
}

.tab.active {
  background: var(--status-completed);
  color: rgb(51, 51, 51);
  font-weight: 600; 
}

.view {
  display: none;
  background: white;
  border-radius: 8px;
}

.view.active {
  display: block;
  padding: 20px;
  box-shadow: var(--shadow);
}

/* Buttons */
button {
  cursor: pointer;
  border-radius: 8px;
  padding: 10px 16px;
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
  border: none;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background-color: white;
  color: var(--primary);
  border: 1px solid var(--primary);
}

.btn-secondary:hover {
  background-color: #E5F1F3;
}

/* Responsive Design */
@media (max-width: 768px) {
  body {
    margin: 0;
  }
  
  .container {
    padding: 15px;
    border-radius: 0;
  }
  
  .tabs {
    flex-wrap: wrap;
  }
  
  .tab {
    flex: 1 0 auto;
    text-align: center;
    padding: 10px;
  }
}
EOF

# Create HTML file
cat > "${PROJECT_DIR}/public/index.html" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>little${PROJECT_NAME}Man</title>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
  
  <!-- Custom CSS -->
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <!-- Header with Logo -->
    <header class="app-title">
      <img src="images/logo.svg" width="40" height="40" alt="Logo"/>
      <span id="logo-text">little${PROJECT_NAME}Man</span>
    </header>

    <!-- Tab Navigation -->
    <div class="tabs">
      <div class="tab active" data-view="mainView">Main</div>
      <div class="tab" data-view="secondView">Second</div>
      <div class="tab" data-view="thirdView">Third</div>
    </div>
    
    <!-- Main View -->
    <div id="mainView" class="view active">
      <h2>Main View</h2>
      <p>This is the main view content for little${PROJECT_NAME}Man.</p>
    </div>

    <!-- Second View -->
    <div id="secondView" class="view">
      <h2>Second View</h2>
      <p>This is the second view content.</p>
    </div>

    <!-- Third View -->
    <div id="thirdView" class="view">
      <h2>Third View</h2>
      <p>This is the third view content.</p>
    </div>
  
    <!-- Basic JavaScript for Tab Navigation -->
    <script>
      // Tab Navigation
      document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
          tab.classList.add('active');
          document.getElementById(tab.dataset.view).classList.add('active');
        });
      });
    </script>
  </div>
</body>
</html>
EOF

# Create simple logo SVG
cat > "${PROJECT_DIR}/public/images/logo.svg" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" rx="20" fill="${PRIMARY_COLOR}"/>
  <circle cx="50" cy="50" r="30" fill="#FFFFFF"/>
  <path d="M35 50 L 45 60 L 65 40" stroke="${PRIMARY_COLOR}" stroke-width="6" fill="none"/>
</svg>
EOF

echo "Created structure for little${PROJECT_NAME}Man with colors ${PRIMARY_COLOR} and ${SECONDARY_COLOR}"