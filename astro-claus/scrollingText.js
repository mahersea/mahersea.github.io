const canvas = document.getElementById('starWarsCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// use images/intro-background.jpg as the background
const background = new Image();
background.src = 'images/intro-background.png';

function drawBackground() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

function drawButton() {
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.color = 'black';
  ctx.fillText('Continue', canvas.width / 2 + 7, canvas.height - 130,);
  canvas.addEventListener('click', function() {
    window.location.href = 'game.html';
  });

}


const textLines = [
  "You are Astro-Claus,",
  "The Admiral of the Nebulon Fleet",
  "and captain of the Jingleblast 3000",
  "",
  "In a distant corner of the galaxy,",
  "where candy canes orbit binary stars",
  "and gingerbread asteroids drift in cosmic winds,",
  "an interstellar calamity has struck!",
  "",
  "The dastardly Grincheroids have stolen",
  "the Galactic Gift Reserves, threatening",
  "joy and cheer across the universe.",
  "",
  "Blast through nebulae, outwit the Grincheroid fleets,",
  "with their green candy laser torpedoes,",
  "and deliver holiday magic to every star system.",
  "",
  "Suit up, Commander Claus—",
  "Christmas depends on you!"
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
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'yellow';

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
    offset += 40; // Line height
  }

  ctx.restore();

  scrollPosition -= .5; // Slow scroll speed for better pacing

  // Reset position when all text is off the screen
  if (scrollPosition < -textLines.length * 40) {
    scrollPosition = canvas.height; // Reset scroll to start
  }

  requestAnimationFrame(drawText);
}

drawText();

