const canvas = document.getElementById('starWarsCanvas');
//const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const background = new Image();
background.src = 'images/intro-background.png';

const prize = new Image();
prize.src = 'images/prize.png';

function drawBackground() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

function drawPrize() {
  const prizeWidth = 600;
  const prizeHeight = 600;
  // center prize on canvas
  const x = (prizeWidth - canvas.width * 0.95) / 3;
  const y = (canvas.height - prizeHeight) - 35;
  ctx.drawImage(prize, x, y, prizeWidth, prizeHeight);
}

function drawButton() {
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.color = 'black';
  ctx.fillText('Play Again', canvas.width / 2 + 6, canvas.height - 150,);
  canvas.addEventListener('click', function() {
    window.location.href = 'game.html';
  });

}

const textLines = [
  "",
];

let scrollPosition = canvas.height; // Start below the canvas
const fadeInStart = canvas.height * 0.8; // Start fading in near the bottom
const fadeOutStart = canvas.height * 0.2; // Start fading out near the top

function drawText() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawButton();
  ctx.save();

  // Move to the center of the canvas
  ctx.translate(canvas.width / 2, 0);

  // Apply perspective tilt
  ctx.scale(1, 0.7); // Adjust the scale for a subtle tilt
  ctx.font = '36px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'green';

  let offset = scrollPosition;
  for (let i = 0; i < textLines.length; i++) {
    const relativeY = canvas.height - offset; // Determine text's position relative to canvas height

    // Calculate alpha (fade-in and fade-out)
    if (relativeY > fadeInStart) {
      ctx.globalAlpha = Math.min(1, (canvas.height - relativeY) / (canvas.height - fadeInStart));
    } else if (relativeY < fadeOutStart) {
      ctx.globalAlpha = Math.max(0, relativeY / fadeOutStart);
    } else {
      ctx.globalAlpha = 1; // Fully opaque between fade zones
    }

    ctx.fillText(textLines[i], 0, offset);
    offset += 60; // Line height
  }
  drawPrize();
  ctx.restore();

  scrollPosition -= .5; // Slow scroll speed for better pacing

  // Reset position when all text is off the screen
  if (scrollPosition < -textLines.length * 40) {
    scrollPosition = canvas.height; // Reset scroll to start
  }

  requestAnimationFrame(drawText);
}

drawText();

