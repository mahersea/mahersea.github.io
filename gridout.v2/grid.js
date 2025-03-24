const grid_canvas = document.getElementById('grid');
const grid_ctx = grid_canvas.getContext('2d');

let grid_frame = 0;
const columns = 1; // Number of grid columns
const rows = 16; // Number of grid rows
const gridSpacingX = grid_canvas.width / columns;
const gridSpacingY = (grid_canvas.height - 80) / rows; // Leave space for the wave

const strobe_rate = 120; // Strobe rate in frames

const signal_offset = grid_canvas.height / 4; // Offset for the signal waves

// Color palette
const base = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff"];
const tranquilSerenityPalette = ["#B3E5FC", "#CE93D8", "#A5D6A7", "#FAFAFA", "#B0BEC5"];
const vibrantEnergyPalette = ["#FF7043", "#C6FF00", "#2979FF", "#FF4081", "#FFEB3B"];
const nostalgicVintagePalette = ["#E64A19", "#FFD54F", "#8D6E63", "#D32F2F", "#FFF8E1"];
const mysteriousTwilightPalette = ["#283593", "#6A1B9A", "#37474F", "#C62828", "#FF8F00"];
const playfulWhimsyPalette = ["#FF80AB", "#FFEB3B", "#40C4FF", "#69F0AE", "#E1BEE7"];

// Choose a palette
const palette = base;
//const palette = tranquilSerenityPalette;
//const palette = vibrantEnergyPalette;
//const palette = nostalgicVintagePalette;
//const palette = mysteriousTwilightPalette;
//const palette = playfulWhimsyPalette;

// Utility for random color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Generate grid of shapes with random initial colors
const shapes = [];
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < columns; col++) {
    const x = col * gridSpacingX + gridSpacingX / 2;
    const y = row * gridSpacingY + gridSpacingY / 2;
    const isCircle = Math.random() > 0.5;
    shapes.push({ x, y, isCircle, color: getRandomColor() });
  }
}

// Draw shape (circle or square)
function drawShape(shape) {
  grid_ctx.fillStyle = shape.color;
  grid_ctx.shadowColor = shape.color;
  grid_ctx.shadowBlur = 10;

  const size = 10;
  if (shape.isCircle) {
    grid_ctx.beginPath();
    grid_ctx.arc(shape.x, shape.y, size/2, 0, Math.PI * 2);
    grid_ctx.fill();
  } else {
    grid_ctx.fillRect(shape.x - size / 2, shape.y - size / 2, size, size);
  }

  grid_ctx.shadowBlur = 0;
}

// Draw dashboard
function drawGrid() {
  grid_ctx.clearRect(0, 0, grid_canvas.width, grid_canvas.height);

  // Update and draw shapes
  for (const shape of shapes) {
    if (grid_frame % strobe_rate === 0) {
      // Change color every other frame for a fast strobe
      shape.color = getRandomColor();
      // filter the colors into a palette of 5 colors
        const color = shape.color;
        const r = parseInt(color.substring(1, 3), 16);
        const g = parseInt(color.substring(3, 5), 16);  
        const b = parseInt(color.substring(5, 7), 16);
        const avg = (r + g + b) / 3;
        

        const index = Math.floor(avg / 51);
        shape.color = palette[index];
    }
    drawShape(shape);
  }

  grid_frame++;
  requestAnimationFrame(drawGrid);
}

drawGrid();
