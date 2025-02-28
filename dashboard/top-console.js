// Canvas setup
const staggered_wave_canvas = document.getElementById('top-console');
const staggered_wave_ctx = staggered_wave_canvas.getContext('2d');

// Drawing physics constants
const WAVE_FREQUENCY = 0.1; // Controls the wavelength
const WAVE_AMPLITUDE = 20; // Controls the height of the wave
const WAVE_OFFSET_STEP = 5; // Spacing between staggered waves
const WAVE_RANGE = 10; // Range of offsets for waves
const STROKE_STYLE = getRandomColor(); // Wave color
const LINE_WIDTH = 2; // Line thickness
const WAVE_SPEED = .1; // Controls the animation speed

let frame = 0;

// Utility for random color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Function to draw staggered sine waves
function drawStaggeredSineWaves(position) {
  staggered_wave_ctx.strokeStyle = STROKE_STYLE;
  staggered_wave_ctx.lineWidth = LINE_WIDTH;

  for (let offset = -WAVE_RANGE; offset <= WAVE_RANGE; offset += WAVE_OFFSET_STEP) {
    staggered_wave_ctx.beginPath();

    for (let x = 0; x < staggered_wave_canvas.width; x++) {
      const y = position + Math.sin((x + frame) * WAVE_FREQUENCY + offset) * WAVE_AMPLITUDE;
      if (x === 0) {
        staggered_wave_ctx.moveTo(x, y);
      } else {
        staggered_wave_ctx.lineTo(x, y);
      }
    }

    staggered_wave_ctx.stroke();
  }
}

// Function to animate the dashboard
function drawDashboard() {
  staggered_wave_ctx.clearRect(0, 0, staggered_wave_canvas.width, staggered_wave_canvas.height);

  const staggered_wave_position = staggered_wave_canvas.height - 50; // Base position for waves
  drawStaggeredSineWaves(staggered_wave_position);

  frame += WAVE_SPEED; // Increment the frame by WAVE_SPEED
  requestAnimationFrame(drawDashboard);
}

// Start the animation
drawDashboard();
