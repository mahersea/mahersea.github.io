const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// ---------------- Constants ----------------
const BLOCK_SIZE = 20; // pixel size for each block in a falling object
const FALLING_OBJECT_MIN_SIZE = 1;
const FALLING_OBJECT_MAX_SIZE = 3;
const INITIAL_ROTATION_SPEED = 90; // degrees per second
const INITIAL_FALL_SPEED = 50; // pixels per second
const TORPEDO_SPEED = 300; // pixels per second
const TORPEDO_WIDTH = 15;
const TORPEDO_HEIGHT = 5;
const EXPLOSION_DURATION = 500; // milliseconds
const SPACESHIP_WIDTH = 40;
const SPACESHIP_HEIGHT = 20;
const SPACESHIP_SPEED = 200; // pixels per second
const BALL_DROP_DELAY = 10000; // 60 seconds delay before the ball drops

// ---------------- Game Variables ----------------
let fallingObjects = [];
let torpedoes = [];
let explosions = [];
let landedObjects = []; // objects that have landed and now stack
let spaceship = {
  x: canvas.width / 2 - SPACESHIP_WIDTH / 2,
  y: canvas.height - SPACESHIP_HEIGHT - 10,
  width: SPACESHIP_WIDTH,
  height: SPACESHIP_HEIGHT,
  color: 'green'
};
let ball = {
  x: canvas.width / 2,
  y: 50,
  radius: 10,
  vx: 150,
  vy: 150,
  active: false  // ball is inactive until the drop delay expires
};
let ballDropTime = performance.now() + BALL_DROP_DELAY; // schedule drop 60 sec from start
let keys = {};
let lastTime = performance.now();
let spawnInterval = 2000; // milliseconds between spawning falling objects
let lastSpawnTime = performance.now();
let level = 1;
let score = 0;
let gameState = "playing"; // "playing" or "gameOver"

// ---------------- Utility Functions ----------------
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a random grid shape (1×1 up to 9×9). Each cell has a 50% chance to be filled.
// Ensure at least one cell is true.
function generateShape() {
  const gridSize = randInt(FALLING_OBJECT_MIN_SIZE, FALLING_OBJECT_MAX_SIZE);
  let grid = [];
  let hasBlock = false;
  for (let row = 0; row < gridSize; row++) {
    grid[row] = [];
    for (let col = 0; col < gridSize; col++) {
      let cell = Math.random() < 0.5;
      grid[row][col] = cell;
      if (cell) hasBlock = true;
    }
  }
  if (!hasBlock) {
    grid[randInt(0, gridSize - 1)][randInt(0, gridSize - 1)] = true;
  }
  return grid;
}

// Create a falling object with a random grid shape.
function createFallingObject() {
  const grid = generateShape();
  const gridSize = grid.length;
  return {
    x: randInt(0, canvas.width - gridSize * BLOCK_SIZE),
    y: -gridSize * BLOCK_SIZE, // start above the screen
    grid: grid,
    gridSize: gridSize,
    rotation: 0, // degrees
    rotationSpeed: INITIAL_ROTATION_SPEED * (1 + 0.1 * (level - 1)),
    fallSpeed: INITIAL_FALL_SPEED * (1 + 0.1 * (level - 1)),
    landed: false,
    exploded: false
  };
}

// For a falling object, compute the on-canvas positions of its filled blocks (taking rotation into account).
// Rotation is around the center of its grid.
function getFallingObjectBlocks(obj) {
  let blocks = [];
  const gridPixelSize = obj.gridSize * BLOCK_SIZE;
  const centerX = obj.x + gridPixelSize / 2;
  const centerY = obj.y + gridPixelSize / 2;
  const rad = obj.rotation * Math.PI / 180;
  for (let row = 0; row < obj.gridSize; row++) {
    for (let col = 0; col < obj.gridSize; col++) {
      if (obj.grid[row][col]) {
        const localX = col * BLOCK_SIZE + BLOCK_SIZE / 2 - gridPixelSize / 2;
        const localY = row * BLOCK_SIZE + BLOCK_SIZE / 2 - gridPixelSize / 2;
        const rotatedX = localX * Math.cos(rad) - localY * Math.sin(rad);
        const rotatedY = localX * Math.sin(rad) + localY * Math.cos(rad);
        blocks.push({
          x: centerX + rotatedX - BLOCK_SIZE / 2,
          y: centerY + rotatedY - BLOCK_SIZE / 2,
          size: BLOCK_SIZE
        });
      }
    }
  }
  return blocks;
}

// Check if two rectangles (with x, y, size) overlap.
function rectsOverlap(r1, r2) {
  return !(r1.x + r1.size <= r2.x || r1.x >= r2.x + r2.size ||
           r1.y + r1.size <= r2.y || r1.y >= r2.y + r2.size);
}

// Standard collision test between a circle and a rectangle (square version).
function circleRectCollision(circle, rect) {
  let closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.size));
  let closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.size));
  let dx = circle.x - closestX;
  let dy = circle.y - closestY;
  return (dx * dx + dy * dy) < (circle.radius * circle.radius);
}

// Collision between a circle and a generic rectangle (with width and height).
function circleRectCollisionGeneric(circle, rect) {
  let closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  let closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
  let dx = circle.x - closestX;
  let dy = circle.y - closestY;
  return (dx * dx + dy * dy) < (circle.radius * circle.radius);
}

// Collision between a circle and the spaceship (which is a rectangle).
function circleSpaceshipCollision(circle, spaceship) {
  return circleRectCollisionGeneric(circle, spaceship);
}

// ---------------- Game Initialization ----------------
function initGame() {
  fallingObjects = [];
  torpedoes = [];
  explosions = [];
  landedObjects = [];
  spaceship.x = canvas.width / 2 - spaceship.width / 2;
  spaceship.y = canvas.height - spaceship.height - 10;
  ball.x = canvas.width / 2;
  ball.y = 50;
  ball.vx = 150;
  ball.vy = 150;
  ball.active = false;
  ballDropTime = performance.now() + BALL_DROP_DELAY;
  level = 1;
  score = 0;
  lastSpawnTime = performance.now();
  gameState = "playing";
}

// ---------------- Update Functions ----------------

// Update falling objects, checking for collision with the bottom or with any landed object so they can stack.
function updateFallingObjects(deltaTime) {
  for (let obj of fallingObjects) {
    if (obj.landed || obj.exploded) continue;
    obj.y += obj.fallSpeed * (deltaTime / 1000);
    obj.rotation += obj.rotationSpeed * (deltaTime / 1000);
    obj.rotation %= 360;
    
    let blocks = getFallingObjectBlocks(obj);
    let collisionDetected = false;
    let adjustment = Infinity;
    
    for (let block of blocks) {
      // Check collision with the bottom wall.
      if (block.y + block.size >= canvas.height) {
        collisionDetected = true;
        adjustment = Math.min(adjustment, block.y + block.size - canvas.height);
      }
      // Check collision with each landed block.
      for (let landed of landedObjects) {
        for (let row = 0; row < landed.gridSize; row++) {
          for (let col = 0; col < landed.gridSize; col++) {
            if (landed.grid[row][col]) {
              let landedBlock = {
                x: landed.x + col * BLOCK_SIZE,
                y: landed.y + row * BLOCK_SIZE,
                size: BLOCK_SIZE
              };
              if (rectsOverlap(block, landedBlock)) {
                collisionDetected = true;
                adjustment = Math.min(adjustment, block.y + block.size - landedBlock.y);
              }
            }
          }
        }
      }
    }
    if (collisionDetected) {
      if (adjustment === Infinity) adjustment = 0;
      obj.y -= adjustment; // snap upward to reduce overlap
      obj.landed = true;
      landedObjects.push(obj);
    }
  }
  fallingObjects = fallingObjects.filter(obj => !obj.landed && !obj.exploded);
}

function updateTorpedoes(deltaTime) {
  for (let torp of torpedoes) {
    torp.x += torp.direction === 'left'
      ? -TORPEDO_SPEED * (deltaTime / 1000)
      : TORPEDO_SPEED * (deltaTime / 1000);
  }
  torpedoes = torpedoes.filter(torp => torp.x + TORPEDO_WIDTH >= 0 && torp.x <= canvas.width);
}

function updateExplosions(deltaTime) {
  for (let exp of explosions) {
    exp.timer -= deltaTime;
  }
  explosions = explosions.filter(exp => exp.timer > 0);
}

// Update the spaceship’s position; now it moves in all four directions.
function updateSpaceship(deltaTime) {
  if (keys['ArrowLeft']) spaceship.x -= SPACESHIP_SPEED * (deltaTime / 1000);
  if (keys['ArrowRight']) spaceship.x += SPACESHIP_SPEED * (deltaTime / 1000);
  if (keys['ArrowUp']) spaceship.y -= SPACESHIP_SPEED * (deltaTime / 1000);
  if (keys['ArrowDown']) spaceship.y += SPACESHIP_SPEED * (deltaTime / 1000);
  spaceship.x = Math.max(0, Math.min(canvas.width - spaceship.width, spaceship.x));
  spaceship.y = Math.max(0, Math.min(canvas.height - spaceship.height, spaceship.y));
}

// This function checks for collisions between the ball and any blue blocks (from falling or landed objects)
// If a collision is detected, the ball is bounced upward.
function handleBallBlueCollisions() {
  if (!ball.active) return false;
  // Check falling objects
  for (let obj of fallingObjects) {
    let blocks = getFallingObjectBlocks(obj);
    for (let block of blocks) {
      if (circleRectCollision(ball, block)) {
        ball.vy = -Math.abs(ball.vy);
        ball.y = block.y + block.size + ball.radius;
        return true;
      }
    }
  }
  // Check landed (stacked) objects
  for (let obj of landedObjects) {
    for (let row = 0; row < obj.gridSize; row++) {
      for (let col = 0; col < obj.gridSize; col++) {
        if (obj.grid[row][col]) {
          let landedBlock = {
            x: obj.x + col * BLOCK_SIZE,
            y: obj.y + row * BLOCK_SIZE,
            size: BLOCK_SIZE
          };
          if (circleRectCollision(ball, landedBlock)) {
            ball.vy = -Math.abs(ball.vy);
            ball.y = landedBlock.y + landedBlock.size + ball.radius;
            return true;
          }
        }
      }
    }
  }
  return false;
}

// Update the ball’s position and handle its collisions.
// Once active:
// - It bounces off left/right walls.
// - It bounces off the spaceship.
// - It bounces off blue objects (falling and stacked) via handleBallBlueCollisions().
// - The game ends if it hits the top.
// - If it touches the bottom, it bounces and scores a point if it contacts a blue block.
function updateBall(deltaTime) {
  if (!ball.active) {
    if (performance.now() >= ballDropTime) {
      ball.active = true;
    } else {
      return;
    }
  }
  
  ball.x += ball.vx * (deltaTime / 1000);
  ball.y += ball.vy * (deltaTime / 1000);
  
  // Bounce off left/right walls.
  if (ball.x - ball.radius < 0) {
    ball.x = ball.radius;
    ball.vx = Math.abs(ball.vx);
  }
  if (ball.x + ball.radius > canvas.width) {
    ball.x = canvas.width - ball.radius;
    ball.vx = -Math.abs(ball.vx);
  }
  
  // Bounce off the spaceship.
  if (circleSpaceshipCollision(ball, spaceship)) {
    ball.vy = -Math.abs(ball.vy);
    ball.y = spaceship.y - ball.radius;
  }
  
  // Bounce off falling and stacked blue objects.
  handleBallBlueCollisions();
  
  // Game over if ball hits the top.
  if (ball.y - ball.radius < 0) {
    gameOver();
  }
  
  // When the ball touches the bottom wall...
  if (ball.y + ball.radius >= canvas.height) {
    let hitStack = false;
    for (let landed of landedObjects) {
      for (let row = 0; row < landed.gridSize; row++) {
        for (let col = 0; col < landed.gridSize; col++) {
          if (landed.grid[row][col]) {
            let landedBlock = {
              x: landed.x + col * BLOCK_SIZE,
              y: landed.y + row * BLOCK_SIZE,
              size: BLOCK_SIZE
            };
            if (circleRectCollision(ball, landedBlock)) {
              hitStack = true;
              break;
            }
          }
        }
        if (hitStack) break;
      }
      if (hitStack) break;
    }
    if (hitStack) {
      score += 1;
    }
    ball.vy = -Math.abs(ball.vy);
    ball.y = canvas.height - ball.radius;
  }
}

// Check collision between a torpedo and a falling object's blocks.
function checkTorpedoCollision(torpedo, obj) {
  const blocks = getFallingObjectBlocks(obj);
  for (let block of blocks) {
    if (
      torpedo.x < block.x + block.size &&
      torpedo.x + TORPEDO_WIDTH > block.x &&
      torpedo.y < block.y + block.size &&
      torpedo.y + TORPEDO_HEIGHT > block.y
    ) {
      return true;
    }
  }
  return false;
}

// Handle torpedo collisions with falling objects.
function handleCollisions() {
  for (let i = torpedoes.length - 1; i >= 0; i--) {
    let torp = torpedoes[i];
    for (let j = fallingObjects.length - 1; j >= 0; j--) {
      let obj = fallingObjects[j];
      if (checkTorpedoCollision(torp, obj)) {
        const gridPixelSize = obj.gridSize * BLOCK_SIZE;
        explosions.push({
          x: obj.x + gridPixelSize / 2,
          y: obj.y + gridPixelSize / 2,
          timer: EXPLOSION_DURATION
        });
        obj.exploded = true;
        fallingObjects.splice(j, 1);
        torpedoes.splice(i, 1);
        score += 10;
        break;
      }
    }
  }
}

// New: Handle collisions between torpedoes and the ball.
function handleBallTorpedoCollisions() {
  if (!ball.active) return;
  for (let i = torpedoes.length - 1; i >= 0; i--) {
    let torp = torpedoes[i];
    let rect = { x: torp.x, y: torp.y, width: TORPEDO_WIDTH, height: TORPEDO_HEIGHT };
    if (circleRectCollisionGeneric(ball, rect)) {
      explosions.push({
        x: ball.x,
        y: ball.y,
        timer: EXPLOSION_DURATION
      });
      ball.active = false;
      ball.x = canvas.width / 2;
      ball.y = 50;
      ball.vx = 150;
      ball.vy = 150;
      ballDropTime = performance.now() + BALL_DROP_DELAY;
      torpedoes.splice(i, 1);
    }
  }
}

// ---------------- Draw Functions ----------------
function drawFallingObjects() {
  for (let obj of fallingObjects) {
    const gridPixelSize = obj.gridSize * BLOCK_SIZE;
    ctx.save();
    ctx.translate(obj.x + gridPixelSize / 2, obj.y + gridPixelSize / 2);
    ctx.rotate(obj.rotation * Math.PI / 180);
    for (let row = 0; row < obj.gridSize; row++) {
      for (let col = 0; col < obj.gridSize; col++) {
        if (obj.grid[row][col]) {
          ctx.fillStyle = 'blue';
          ctx.fillRect(
            col * BLOCK_SIZE - gridPixelSize / 2,
            row * BLOCK_SIZE - gridPixelSize / 2,
            BLOCK_SIZE,
            BLOCK_SIZE
          );
        }
      }
    }
    ctx.restore();
  }
}

// Draw the landed (stacked) objects without rotation.
function drawLandedObjects() {
  for (let obj of landedObjects) {
    for (let row = 0; row < obj.gridSize; row++) {
      for (let col = 0; col < obj.gridSize; col++) {
        if (obj.grid[row][col]) {
          ctx.fillStyle = 'blue';
          ctx.fillRect(
            obj.x + col * BLOCK_SIZE,
            obj.y + row * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
          );
        }
      }
    }
  }
}

function drawTorpedoes() {
  for (let torp of torpedoes) {
    ctx.fillStyle = 'red';
    ctx.fillRect(torp.x - 2, torp.y - 2, TORPEDO_WIDTH + 4, TORPEDO_HEIGHT + 4);
    ctx.fillStyle = 'red';
    ctx.fillRect(torp.x, torp.y, TORPEDO_WIDTH, TORPEDO_HEIGHT);
  }
}

function drawExplosions() {
  for (let exp of explosions) {
    let progress = 1 - exp.timer / EXPLOSION_DURATION;
    let radius = progress * 30;
    ctx.beginPath();
    ctx.arc(exp.x, exp.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255,165,0,${1 - progress})`;
    ctx.fill();
  }
}

function drawSpaceship() {
  ctx.fillStyle = spaceship.color;
  ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function drawBall() {
  if (!ball.active) return;
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
  ctx.fill();
}

function drawHUD() {
  ctx.fillStyle = 'white';
  ctx.font = '18px Arial';
  ctx.textAlign = 'left';
  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("Level: " + level, 10, 40);
  
  if (!ball.active) {
    let remaining = Math.max(0, Math.ceil((ballDropTime - performance.now()) / 1000));
    ctx.fillStyle = 'yellow';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText("Ball drop in: " + remaining + "s", canvas.width / 2, 60);
  }
}

function drawGameOver() {
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '36px Arial';
  ctx.textAlign = 'center';
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = '24px Arial';
  ctx.fillText("Final Score: " + score, canvas.width / 2, canvas.height / 2 + 20);
  ctx.fillText("Click to Restart", canvas.width / 2, canvas.height / 2 + 60);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  drawLandedObjects();
  drawFallingObjects();
  drawTorpedoes();
  drawExplosions();
  drawSpaceship();
  drawBall();
  drawHUD();
  
  if (gameState === "gameOver") {
    drawGameOver();
  }
}

// ---------------- Game Over ----------------
function gameOver() {
  gameState = "gameOver";
}

// ---------------- Game Loop ----------------
function gameLoop(timestamp) {
  if (gameState === "gameOver") {
    draw();
    requestAnimationFrame(gameLoop);
    return;
  }
  
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  
  updateSpaceship(deltaTime);
  updateFallingObjects(deltaTime);
  updateTorpedoes(deltaTime);
  updateExplosions(deltaTime);
  updateBall(deltaTime);
  handleCollisions();
  handleBallTorpedoCollisions();
  
  if (timestamp - lastSpawnTime > spawnInterval) {
    fallingObjects.push(createFallingObject());
    lastSpawnTime = timestamp;
  }
  
  if (score > level * 100) {
    level++;
  }
  
  draw();
  requestAnimationFrame(gameLoop);
}

// ---------------- Event Listeners ----------------
document.addEventListener('keydown', function(e) {
  keys[e.key] = true;
  
  if (e.key === ' ') {
    const centerY = spaceship.y + spaceship.height / 2;
    torpedoes.push({
      x: spaceship.x,
      y: centerY - TORPEDO_HEIGHT / 2,
      direction: 'left'
    });
    torpedoes.push({
      x: spaceship.x + spaceship.width,
      y: centerY - TORPEDO_HEIGHT / 2,
      direction: 'right'
    });
  }
  
  // "K" key kills the ball if active.
  if (e.key.toLowerCase() === 'k') {
    if (ball.active) {
      explosions.push({
        x: ball.x,
        y: ball.y,
        timer: EXPLOSION_DURATION
      });
      ball.active = false;
      ball.x = canvas.width / 2;
      ball.y = 50;
      ball.vx = 150;
      ball.vy = 150;
      ballDropTime = performance.now() + BALL_DROP_DELAY;
    }
  }
});

document.addEventListener('keyup', function(e) {
  keys[e.key] = false;
});

canvas.addEventListener('click', function() {
  if (gameState === "gameOver") {
    initGame();
  }
});

// ---------------- Start the Game ----------------
initGame();
lastTime = performance.now();
requestAnimationFrame(gameLoop);
