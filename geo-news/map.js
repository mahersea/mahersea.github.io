// map.js - Map rendering and interaction handling

// Minnesota and surrounding regions bounding box 
// Covers Minnesota, parts of Wisconsin, Iowa, North/South Dakota, and southern Manitoba/Ontario
const DEFAULT_BOUNDS = {
    north: 49.5, // Northern Minnesota/Canadian border 
    south: 42.5, // Southern Minnesota/Iowa border
    east: -86.5, // Eastern Wisconsin
    west: -97.5  // Western South/North Dakota
  };
  
  class NewsMap {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      
      // Adjust canvas for retina displays
      this.setupCanvas();
      
      // Map state
      this.zoom = 1;
      this.pan = { x: 0, y: 0 };
      this.bounds = {...DEFAULT_BOUNDS};
      this.events = [];
      this.filteredEvents = [];
      
      // Map rendering parameters
      this.stateLines = [];
      this.cityMarkers = [];
      
      // UI interaction state
      this.isDragging = false;
      this.lastMousePos = { x: 0, y: 0 };
      this.hoveredEvent = null;
      
      // Initialize
      this.loadBaseMapData();
      this.setupEventListeners();
      this.render();
    }
    
    setupCanvas() {
      // Handle high-DPI displays
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = this.canvas.clientWidth * dpr;
      this.canvas.height = this.canvas.clientHeight * dpr;
      this.ctx.scale(dpr, dpr);
      
      // Handle resizing
      window.addEventListener('resize', () => {
        this.canvas.width = this.canvas.clientWidth * dpr;
        this.canvas.height = this.canvas.clientHeight * dpr;
        this.ctx.scale(dpr, dpr);
        this.render();
      });
    }
    
    loadBaseMapData() {
      // In a real implementation, load GeoJSON data for states/provinces, counties, etc.
      // For the POC, we'll use simplified placeholder data
      
      // Major cities in the region (simplified lat/long)
      this.cityMarkers = [
        { name: "Minneapolis", lat: 44.9778, lon: -93.2650 },
        { name: "St. Paul", lat: 44.9537, lon: -93.0900 },
        { name: "Duluth", lat: 46.7867, lon: -92.1005 },
        { name: "Rochester", lat: 44.0121, lon: -92.4802 },
        { name: "Winnipeg", lat: 49.8951, lon: -97.1384 },
        { name: "Milwaukee", lat: 43.0389, lon: -87.9065 },
        { name: "Des Moines", lat: 41.5868, lon: -93.6250 },
        { name: "Fargo", lat: 46.8772, lon: -96.7898 },
        { name: "Thunder Bay", lat: 48.3809, lon: -89.2477 }
      ];
      
      // This would be replaced with actual GeoJSON data in the real implementation
      console.log("Base map data loaded");
    }
    
    setupEventListeners() {
      // Mouse/touch interactions
      this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
      this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
      this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
      this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
      
      // Touch support
      this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
      this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
      this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
      
      // UI controls
      document.getElementById('zoom-in').addEventListener('click', () => this.adjustZoom(1.2));
      document.getElementById('zoom-out').addEventListener('click', () => this.adjustZoom(0.8));
      document.getElementById('reset-view').addEventListener('click', this.resetView.bind(this));
      document.getElementById('time-range').addEventListener('change', this.updateFilters.bind(this));
    }
    
    // Coordinate conversion methods
    lonToX(lon) {
      const width = this.canvas.clientWidth;
      return ((lon - this.bounds.west) / (this.bounds.east - this.bounds.west)) * width + this.pan.x;
    }
    
    latToY(lat) {
      const height = this.canvas.clientHeight;
      return (1 - (lat - this.bounds.south) / (this.bounds.north - this.bounds.south)) * height + this.pan.y;
    }
    
    // Inverse coordinate conversion
    xToLon(x) {
      const width = this.canvas.clientWidth;
      return this.bounds.west + ((x - this.pan.x) / width) * (this.bounds.east - this.bounds.west);
    }
    
    yToLat(y) {
      const height = this.canvas.clientHeight;
      return this.bounds.north - ((y - this.pan.y) / height) * (this.bounds.north - this.bounds.south);
    }
    
    // Update event data and filters
    setEvents(events) {
      this.events = events;
      this.updateFilters();
    }
    
    updateFilters() {
      // Get currently selected time range
      const timeRange = document.getElementById('time-range').value;
      const now = new Date();
      let cutoff = now;
      
      // Calculate cutoff date based on selected range
      if (timeRange === 'day') {
        cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      } else if (timeRange === 'week') {
        cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (timeRange === 'month') {
        cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      
      // Get selected categories
      const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
      const selectedCategories = Array.from(categoryCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
      
      // Filter events by time and category
      this.filteredEvents = this.events.filter(event => {
        const eventDate = new Date(event.date);
        const categoryMatch = selectedCategories.length === 0 || 
                            selectedCategories.includes(event.category);
        return eventDate >= cutoff && categoryMatch;
      });
      
      this.render();
    }
    
    // Mouse/touch event handlers
    handleMouseDown(e) {
      this.isDragging = true;
      this.lastMousePos = {
        x: e.clientX,
        y: e.clientY
      };
      
      // Check if clicked on an event
      const clickX = e.clientX;
      const clickY = e.clientY;
      
      for (const event of this.filteredEvents) {
        const x = this.lonToX(event.lon);
        const y = this.latToY(event.lat);
        
        // Check if click is within marker radius
        const distance = Math.sqrt(Math.pow(clickX - x, 2) + Math.pow(clickY - y, 2));
        if (distance <= 10) {
          this.showPopup(event, x, y);
          return;
        }
      }
      
      // Hide popup if clicked elsewhere
      this.hidePopup();
    }
    
    handleMouseMove(e) {
      if (this.isDragging) {
        const dx = e.clientX - this.lastMousePos.x;
        const dy = e.clientY - this.lastMousePos.y;
        
        this.pan.x += dx;
        this.pan.y += dy;
        
        this.lastMousePos = {
          x: e.clientX,
          y: e.clientY
        };
        
        this.render();
      } else {
        // Check for hover over events
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        let hoveredNewEvent = null;
        
        for (const event of this.filteredEvents) {
          const x = this.lonToX(event.lon);
          const y = this.latToY(event.lat);
          
          // Check if mouse is within marker radius
          const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2));
          if (distance <= 10) {
            hoveredNewEvent = event;
            this.canvas.style.cursor = 'pointer';
            break;
          }
        }
        
        if (!hoveredNewEvent) {
          this.canvas.style.cursor = 'grab';
        }
        
        if (hoveredNewEvent !== this.hoveredEvent) {
          this.hoveredEvent = hoveredNewEvent;
          this.render();
        }
      }
    }
    
    handleMouseUp() {
      this.isDragging = false;
    }
    
    handleWheel(e) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      this.adjustZoom(zoomFactor);
    }
    
    // Touch event handlers (simplified)
    handleTouchStart(e) {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.lastMousePos = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
        
        // Check if touching an event (similar to mouse click)
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        
        for (const event of this.filteredEvents) {
          const x = this.lonToX(event.lon);
          const y = this.latToY(event.lat);
          
          const distance = Math.sqrt(Math.pow(touchX - x, 2) + Math.pow(touchY - y, 2));
          if (distance <= 15) { // Slightly larger touch target
            this.showPopup(event, x, y);
            this.isDragging = false;
            return;
          }
        }
      }
    }
    
    handleTouchMove(e) {
      if (this.isDragging && e.touches.length === 1) {
        e.preventDefault();
        
        const dx = e.touches[0].clientX - this.lastMousePos.x;
        const dy = e.touches[0].clientY - this.lastMousePos.y;
        
        this.pan.x += dx;
        this.pan.y += dy;
        
        this.lastMousePos = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
        
        this.render();
      }
    }
    
    handleTouchEnd() {
      this.isDragging = false;
    }
    
    // Zoom control
    adjustZoom(factor) {
      // Calculate center of viewport in geographical coordinates (before zoom change)
      const centerLon = this.xToLon(this.canvas.clientWidth / 2 - this.pan.x);
      const centerLat = this.yToLat(this.canvas.clientHeight / 2 - this.pan.y);
      
      // Adjust bounds (zoom)
      const widthHalf = (this.bounds.east - this.bounds.west) / 2;
      const heightHalf = (this.bounds.north - this.bounds.south) / 2;
      
      const newWidthHalf = widthHalf / factor;
      const newHeightHalf = heightHalf / factor;
      
      this.bounds = {
        west: centerLon - newWidthHalf,
        east: centerLon + newWidthHalf,
        north: centerLat + newHeightHalf,
        south: centerLat - newHeightHalf
      };
      
      // Reset pan to keep center point
      this.pan = { x: 0, y: 0 };
      
      this.render();
    }
    
    resetView() {
      this.bounds = {...DEFAULT_BOUNDS};
      this.pan = { x: 0, y: 0 };
      this.render();
    }
    
    // Popup handlers
    showPopup(event, x, y) {
      const popup = document.getElementById('event-popup');
      document.getElementById('popup-title').textContent = event.title;
      document.getElementById('popup-description').textContent = event.description;
      document.getElementById('popup-date').textContent = new Date(event.date).toLocaleString();
      
      const link = document.getElementById('popup-link');
      link.href = event.url;
      
      // Position popup
      popup.style.left = `${x + 15}px`;
      popup.style.top = `${y - 10}px`;
      popup.style.display = 'block';
    }
    
    hidePopup() {
      document.getElementById('event-popup').style.display = 'none';
    }
    
    // Rendering
    render() {
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw background
      this.ctx.fillStyle = '#e8f4f8';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw state/province boundaries (simplified)
      this.renderBaseMap();
      
      // Draw city markers
      this.renderCityMarkers();
      
      // Draw events
      this.renderEvents();
    }
    
    renderBaseMap() {
      // In a real implementation, this would draw GeoJSON data for states and counties
      // For the POC, we'll use a simplified placeholder visualization
      
      // Example: Draw outline of Minnesota (very simplified)
      this.ctx.beginPath();
      this.ctx.strokeStyle = '#444';
      this.ctx.lineWidth = 1;
      
      // Simplified Minnesota outline (would be replaced with proper GeoJSON rendering)
      const mnOutline = [
        [46.7, -92.1], // Duluth area
        [49.4, -95.1], // Northwest angle
        [49.0, -97.2], // Western border with Canada
        [43.5, -96.4], // SW corner
        [43.5, -91.2], // SE corner
        [46.7, -92.1]  // Back to Duluth
      ];
      
      let first = true;
      for (const point of mnOutline) {
        const x = this.lonToX(point[1]);
        const y = this.latToY(point[0]);
        if (first) {
          this.ctx.moveTo(x, y);
          first = false;
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      
      this.ctx.stroke();
      
      // Water features - simplified
      this.ctx.fillStyle = '#a8d1df';
      
      // Lake Superior (very simplified)
      this.ctx.beginPath();
      const superiorOutline = [
        [46.8, -92.1], // Duluth
        [48.0, -89.5], // Thunder Bay direction
        [46.5, -84.6], // Eastern edge (would extend beyond our map)
        [46.4, -91.2]  // Western Wisconsin shore
      ];
      
      first = true;
      for (const point of superiorOutline) {
        const x = this.lonToX(point[1]);
        const y = this.latToY(point[0]);
        if (first) {
          this.ctx.moveTo(x, y);
          first = false;
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      
      this.ctx.fill();
    }
    
    renderCityMarkers() {
      for (const city of this.cityMarkers) {
        const x = this.lonToX(city.lon);
        const y = this.latToY(city.lat);
        
        // Draw city dot
        this.ctx.beginPath();
        this.ctx.fillStyle = '#333';
        this.ctx.arc(x, y, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw city name
        this.ctx.fillStyle = '#333';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(city.name, x + 5, y - 5);
      }
    }
    
    renderEvents() {
      // Define colors for different event categories
      const categoryColors = {
        'crime': '#e74c3c',
        'politics': '#3498db',
        'weather': '#f39c12',
        'sports': '#2ecc71',
        'business': '#9b59b6',
        'entertainment': '#e67e22',
        'health': '#1abc9c',
        'default': '#7f8c8d'
      };
      
      // Draw each event marker
      for (const event of this.filteredEvents) {
        const x = this.lonToX(event.lon);
        const y = this.latToY(event.lat);
        
        // Skip if outside visible area
        if (x < -20 || x > this.canvas.clientWidth + 20 || 
            y < -20 || y > this.canvas.clientHeight + 20) {
          continue;
        }
        
        // Determine marker color based on category
        const color = categoryColors[event.category] || categoryColors.default;
        
        // Draw marker circle
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        
        // Make hovered event larger
        const radius = (this.hoveredEvent === event) ? 8 : 6;
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add white border
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
        
        // Draw circle for "freshness" (more recent = fuller circle)
        if (event.date) {
          const now = new Date();
          const eventDate = new Date(event.date);
          const ageInDays = (now - eventDate) / (1000 * 60 * 60 * 24);
          
          // Events less than a day old get special treatment
          if (ageInDays < 1) {
            // Pulsing effect for very recent events
            const pulseRadius = radius + 3 + Math.sin(Date.now() / 200) * 2;
            this.ctx.beginPath();
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 1;
            this.ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
            this.ctx.stroke();
          }
        }
      }
    }
  }
  
  // Will be initialized in events.js
  let newsMap;