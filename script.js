// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    const projectsGrid = document.querySelector(".projects-grid");
    const modal = document.getElementById("modal");
    const modalBody = document.querySelector(".modal-body");
    const closeButton = document.querySelector(".close-button");
    let projectsData = {};
  
    // Fetch the projects data from the JSON file
    fetch('projects.json')
      .then(response => response.json())
      .then(data => {
        projectsData = data;
        renderProjects(data.projects);
        setupEventListeners();
      })
      .catch(error => {
        console.error('Error loading project data:', error);
      });
  
    // Render project cards based on JSON data
    function renderProjects(projects) {
      // Clear existing content
      projectsGrid.innerHTML = '';
      
      // Create a card for each project
      projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.setAttribute('data-project', project.id);
        
        projectCard.innerHTML = `
          <img src="${project.thumbnail}" alt="" />
          <h3 class="project-title">${project.title}</h3>
        `;
        
        projectsGrid.appendChild(projectCard);
      });
    }
  
    // Set up event listeners after projects are loaded
    function setupEventListeners() {
      const projectCards = document.querySelectorAll(".project-card");
  
      // Open modal when a project card is clicked
      projectCards.forEach((card) => {
        card.addEventListener("click", function () {
          const projectId = card.getAttribute("data-project");
          const project = projectsData.projects.find(p => p.id === projectId);
          // go directly to the project link: `project.link`
          if (project) {
            window.location.href =
            project.link;
            return;
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