// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    const projectsGrid = document.querySelector(".projects-grid");
    const modal = document.getElementById("modal");
    const modalBody = document.querySelector(".modal-body");
    const closeButton = document.querySelector(".close-button");
    const topicSelect = document.getElementById("topicSelect");
    let directoryData = {};
    let allTopics = new Set();
  
    // Load project directories dynamically
    loadDirectories();
    loadTopics();
  
    async function loadDirectories() {
      try {
        // Fetch directory list from server API
        const response = await fetch('/api/directories');
        
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        directoryData = data;
        renderDirectories(data.directories);
        setupEventListeners();
      } catch (error) {
        console.error('Error loading directory data:', error);
        projectsGrid.innerHTML = '<div class="error-message">Error loading projects. Please try again later.</div>';
      }
    }
    
    async function loadTopics() {
      try {
        // Fetch topics from topics.json
        const response = await fetch('/topics.json');
        
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        populateTopicFilter(data.topics);
      } catch (error) {
        console.error('Error loading topic data:', error);
      }
    }
    
    function populateTopicFilter(topics) {
      // Sort topics alphabetically by name
      const sortedTopics = [...topics].sort((a, b) => a.name.localeCompare(b.name));
      
      // Add topics to dropdown
      sortedTopics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic.id;
        option.textContent = `${topic.icon} ${topic.name}`;
        topicSelect.appendChild(option);
      });
      
      // Add event listener for topic filter
      topicSelect.addEventListener('change', function() {
        const selectedTopic = this.value;
        filterDirectoriesByTopic(selectedTopic);
      });
    }
    
    function filterDirectoriesByTopic(topicId) {
      if (!directoryData || !directoryData.directories) return;
      
      const projectCards = document.querySelectorAll('.project-card');
      
      if (topicId === 'all') {
        // Show all projects
        projectCards.forEach(card => {
          card.classList.remove('hidden');
        });
      } else {
        // Filter projects by topic
        projectCards.forEach(card => {
          const path = card.getAttribute('data-path');
          const directory = directoryData.directories.find(dir => dir.path === path);
          
          if (directory && directory.topics && directory.topics.includes(topicId)) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      }
    }
  
    // Render directory entries
    function renderDirectories(directories) {
      // Clear existing content
      projectsGrid.innerHTML = '';
      
      if (!directories || directories.length === 0) {
        projectsGrid.innerHTML = '<div class="no-projects">No projects with README.md files found.</div>';
        return;
      }
      
      // Create a simple grid of all directories
      const grid = document.createElement('div');
      grid.className = 'type-grid';
      
      // Sort alphabetically by title
      const sortedDirs = [...directories].sort((a, b) => a.title.localeCompare(b.title));
      
      sortedDirs.forEach(dir => {
        const dirCard = document.createElement('div');
        dirCard.className = 'project-card';
        dirCard.setAttribute('data-path', dir.path);
        
        // Store topics as data attribute
        if (dir.topics) {
          dirCard.setAttribute('data-topics', dir.topics.join(','));
          
          // Collect all topics for the filter dropdown
          dir.topics.forEach(topic => allTopics.add(topic));
        }

        // Create topic icons HTML and De-dupe icons if necessary
        let topicIconsHTML = '';
        const uniqueIcons = new Set();
        if (dir.topicIcons && dir.topicIcons.length > 0) {
          topicIconsHTML = dir.topicIcons.map(icon => {
            if (!uniqueIcons.has(icon)) {
              uniqueIcons.add(icon);
              return `<span class="topic-icon" title="${icon}">${icon}</span>`;
            }
            return '';
          }
          ).join('');
        }

        dirCard.innerHTML = `
          <div>
            <h3 class="project-title"> ${dir.title}</h3>
            <div style="margin-top:30px">${topicIconsHTML}</div>
          </div>
        `;
        
        grid.appendChild(dirCard);
      });
      
      projectsGrid.appendChild(grid);
    }
  
    // Set up event listeners after directories are loaded
    function setupEventListeners() {
      const projectCards = document.querySelectorAll(".project-card");
  
      // Open project when a card is clicked
      projectCards.forEach((card) => {
        card.addEventListener("click", function () {
          const path = card.getAttribute("data-path");
          if (path) {
            window.location.href = `/${path}/`;
          }
        });
      });
    }
  
    // Close modal when the close button is clicked
    closeButton.addEventListener("click", function () {
      modal.style.display = "none";
    });
  
    // Close modal when clicking outside the modal content
    window.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  
    // Subtle parallax effect for hero content on scroll
    window.addEventListener("scroll", function () {
      const scrolled = window.pageYOffset;
      const heroContent = document.querySelector(".hero-content");
      if (heroContent) {
        // Move the hero content at 30% of the scroll speed for a subtle parallax effect
        heroContent.style.transform = "translateY(" + scrolled * 0.3 + "px)";
      }
    });
  
    ////// Canvas animation for hero section
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');

    // Optionally, adjust the canvas size to match the hero dimensions
    canvas.width = document.getElementById('hero').offsetWidth;
    canvas.height = document.getElementById('hero').offsetHeight;

    // Array to store active pixels
    const pixels = [];

    // Pixel class to manage individual pixels
    class Pixel {
    constructor(row) {
        this.x = 0;
        this.y = row;
        this.speed = Math.random() * 2 + 0.5;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.size = 2;
        this.stuck = false;
    }
    
    update() {
        if (!this.stuck) {
        this.x += this.speed;
        
        // Check if pixel should stick to another pixel in the same row
        const pixelsInRow = pixels.filter(p => 
            p !== this && 
            p.y === this.y && 
            Math.abs(p.x - this.x) < this.size &&
            p.stuck
        );
        
        if (pixelsInRow.length > 0) {
            this.stuck = true;
        }
        
        // Random chance to unstick and leave the canvas
        if (this.stuck && Math.random() < 0.001) {
            this.stuck = false;
            this.x = -10; // Reset position off canvas
        }
        }
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    }

    // Function to randomly add new pixels
    function addPixel() {
    if (Math.random() < 0.3) {
        const row = Math.floor(Math.random() * canvas.height);
        pixels.push(new Pixel(row));
    }
    }

    // Animation loop
    function animate() {
    // Use a semi-transparent fill to create a trailing effect
    ctx.fillStyle = 'rgba(111, 111, 111, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw each pixel
    for (let i = pixels.length - 1; i >= 0; i--) {
        pixels[i].update();
        pixels[i].draw();
        
        // Remove pixels that have moved off the canvas
        if (pixels[i].x < -10 || pixels[i].x > canvas.width + 10) {
        pixels.splice(i, 1);
        }
    }
    
    addPixel();
    requestAnimationFrame(animate);
    }

    animate();
});