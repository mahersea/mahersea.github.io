// Reference canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game properties
let score = 1;
let frame_count = 0;
let game_win = false;

// Level management scaled by frame count
let level = 10;
let level_threshold = 1000;
let level_increment = 1000;
let game_text = "Game Over";

// Environment properties
const SPACE_MODE = true; // SKY IS BLACK AND STARS VISIBLE
const PLANET_MODE = true; // PLANET IS VISIBLE, CHANGES APPARENT MOVEMENT OF STARS

// Load spaceship pngs
const basic_ship = "images/retro-ship.png"
const hit_ship = "images/retro-ship-hit.png" 
const gain_ship = "images/retro-ship-gain.png" 
const shield_ship = "images/retro-ship-shield.png" 

const shipImage = new Image();
shipImage.src = basic_ship; // Choose the spaceship image to load

// Ship properties
let shipX = 100;
let shipY = 100;
let shipSize = 30;
let shipVelocityX = 4; // Velocity in x-direction
let shipVelocityY = 5; // Velocity in y-direction
let shield = false;
const acceleration = 1.5; // Acceleration factor for ship movement
const maxSpeed = 10; // Max ship speed
const friction = 0.99; // Friction factor for gradual slowdown

// Object properties
let sharpObjects = [];
let roundObjects = [];
let goldObjects = [];
const SHARP_WIDTH = 3;
const SHARP_HEIGHT = 20;
const SHARP_OBJECT_SPEED = .1;
const ROUND_RADIUS = 10;
const ROUND_OBJECT_SPEED = 2;
const GOLD_RADIUS = 5;
const GOLD_OBJECT_SPEED = 1;
const GOLD_OBJECT_VALUE = .25; // 0.25 X 2000 = 25% (500) SHIELD DURATION
const SHIELD_DURATION = 2000;

// Explosion properties
const PARTICLE_COUNT = 100; // Number of particles in the explosion
const PARTICLE_SIZE = 2; // Size of each particle
const PARTICLE_SPEED = 2; // Maximum speed of the particles

let particles = [];

// Shield properties
let shield_effect = SHIELD_DURATION;

// Star properties
let stars = [];
const STAR_SPEEDS = [0.3, 0.5, 0.9];
const STAR_COUNTS = [200, 50, 25];

let gameOver = false;

// Generate star background
function createStars() {
    for (let i = 0; i < STAR_COUNTS.length; i++) {
        const starArray = [];
        for (let j = 0; j < STAR_COUNTS[i]; j++) {
            starArray.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 ,
            });
        }
        stars.push(starArray);
    }
}
createStars();

// Draw ship
function drawShip() {
    if(PLANET_MODE){
        ctx.drawImage(shipImage, shipX, shipY, shipSize*2, shipSize * 2); // parameters are (image, x, y, width, height)
    }else{
        ctx.drawImage(shipImage, shipX, shipY, shipSize, shipSize * 2);
    }
}

// Draw stars
function drawStars() {
    stars.forEach((starArray, index) => {
        const speed = STAR_SPEEDS[index];
        const color = index === 0 ? 'red' : index === 1 ? 'yellow' : 'purple';
        ctx.fillStyle = color;

        starArray.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
                star.x += speed;
                if (star.y > canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * canvas.width;
                }
            star.y += speed;
        });
    });
}

function drawStarsPlanet() {
    stars.forEach((starArray, index) => {
        const speed = STAR_SPEEDS[index];
        const color = index === 0 ? '#f7e2a1' : index === 1 ? '#f7e2a1' : 'orange';
        ctx.fillStyle = color;

        starArray.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Move stars from right to left
            star.x -= speed;

            // Reset position if it moves off the left edge
            if (star.x < 0) {
                star.x = canvas.width; // Reset to the right edge
                star.y = Math.random() * canvas.height; // Randomize the vertical position
            }
        });
    });
}

function drawSharpObjects() {
    ctx.fillStyle = '#33ff00';
    sharpObjects.forEach(obj => {
        if (PLANET_MODE) {
            ctx.fillRect(canvas.width - obj.x, obj.y, SHARP_HEIGHT, SHARP_WIDTH);
        } else {
            ctx.fillRect(obj.x, obj.y, SHARP_WIDTH, SHARP_HEIGHT);
        }
    });
}

function drawRoundObjects() {
    ctx.fillStyle = 'white';
    roundObjects.forEach(obj => {
        ctx.beginPath();
        if (PLANET_MODE) {
            ctx.arc(obj.x, obj.y, ROUND_RADIUS, 0, Math.PI * 2); // the parameters are defined as (x, y, radius, startAngle, endAngle)
        } else {
            ctx.arc(obj.x, obj.y, ROUND_RADIUS, 0, Math.PI * 2);
        }
        ctx.fill();
    });
}

function drawGoldObjects() {
    ctx.fillStyle = 'yellow';
    goldObjects.forEach(obj => {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, GOLD_RADIUS, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Function to create an explosion at a given position
function createExplosion(x, y) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2; // Random direction
        const speed = Math.random() * PARTICLE_SPEED; // Random speed
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed, // Velocity in x
            vy: Math.sin(angle) * speed, // Velocity in y
            alpha: 1 // Initial opacity
        });
    }
}

// Function to draw particles
function drawParticles() {
    particles.forEach((particle, index) => {
        ctx.fillStyle = `rgba(255, 69, 0, ${particle.alpha})`; // Fade out effect
        ctx.fillRect(particle.x, particle.y, PARTICLE_SIZE, PARTICLE_SIZE);

        // Update particle position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Reduce opacity over time
        particle.alpha -= 0.02;

        // Remove particle if it's invisible
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        }
    });
}

function updateScore(increment) {
    score += increment;
}

const calculatePercentage = (num1, num2) => {
    const max = Math.max(num1, num2);
    return {
      percentage1: (num1 / max) * 100,
      percentage2: (num2 / max) * 100,
    };
};

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.fillText('Score: ' + score, canvas.width - 180, 30);

    ctx.fillStyle = 'gold';
    ctx.font = '20px Arial';
    //ctx.fillText('Frame Count: ' + frame_count, canvas.width - 180, 55);
    //ctx.fillText('Shield Effect: ' + shield_effect, canvas.width - 400, 55);

    // draw a rectangle to display the shield effect
    let shield_bar = 100;
    if(shield){
        const { percentage1, percentage2 } = calculatePercentage(shield_effect, SHIELD_DURATION);
        console.log(`Percentage 1: ${percentage1}%`); // 50%
        console.log(`Percentage 2: ${percentage2}%`); // 100%
        ctx.fillStyle = 'gold';
        ctx.fillRect(canvas.width - 180, 40, percentage1, 20);
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText(`Shield ${percentage1}%`, canvas.width - 160, 55);
    } else {
        ctx.fillStyle = '#242402';
        ctx.fillRect(canvas.width - 180, 40, shield_bar, 20);
        ctx.fillStyle = '#6e5b05';
        ctx.font = '12px Arial';
        ctx.fillText('Shield 0% ', canvas.width - 160, 55);
    }
}

function drawShipStats() {
    ctx.fillStyle = 'green';
    ctx.font = '12px Arial';
    ctx.fillText('X: ' + shipX, canvas.width - 180, 75);
    ctx.fillText('Y: ' + shipY, canvas.width - 180, 90);
    ctx.fillText('Velocity X: ' + shipVelocityX, canvas.width - 180, 105);
    ctx.fillText('Velocity Y: ' + shipVelocityY, canvas.width - 180, 120);
}

function update() {
    frame_count++;
    if (shield){
        shield_effect--;
    }
    
    if (frame_count % 300 == 0 && !shield) {
        shipImage.src = basic_ship
    } 

    if (shield_effect == 0){ 
        shipImage.src = basic_ship
        shield = false;
    }

    if (gameOver) {
        displayGameOver();
        return;
    }

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply friction to slow down gradually
    shipVelocityX *= friction;
    shipVelocityY *= friction;

    // Update ship position
    shipX += shipVelocityX;
    shipY += shipVelocityY;

    // Keep ship within canvas bounds
    shipX = Math.min(Math.max(shipX, 0), canvas.width - shipSize);
    shipY = Math.min(Math.max(shipY, 0), canvas.height - shipSize * 2);

    // Update sharp objects
    sharpObjects.forEach(obj => {
        if (PLANET_MODE) {
            obj.x += SHARP_OBJECT_SPEED+1; // Move horizontally
            console.log("obj.x: " + obj.x);
        } else {
            obj.y += SHARP_OBJECT_SPEED+1; // Move vertically
            console.log("obj.y: " + obj.y);
        }
    });
    sharpObjects = sharpObjects.filter(obj => 
        PLANET_MODE ? obj.y < canvas.height : obj.x < canvas.width 
    );

    // Update round objects
    roundObjects.forEach(obj => {
        if (PLANET_MODE) {
            obj.x += ROUND_OBJECT_SPEED; // Move horizontally
        } else {
            obj.y += ROUND_OBJECT_SPEED; // Move vertically
        }
    });
    roundObjects = roundObjects.filter(obj => 
        PLANET_MODE ? obj.x < canvas.height : obj.y < canvas.width
    );
    
    // Update gold objects
    goldObjects.forEach(obj => {
        if (PLANET_MODE) {
            obj.x += GOLD_OBJECT_SPEED; // Move horizontally
        } else {
            obj.y += GOLD_OBJECT_SPEED; // Move vertically
        }
    });
    goldObjects = goldObjects.filter(obj => 
        PLANET_MODE ? obj.x < canvas.height : obj.y < canvas.width
    );
        

    checkCollisions();
    if (PLANET_MODE) {
        drawStarsPlanet();
    } else {
        drawStars();
    }
    drawStarsPlanet();
    drawShip();
    drawSharpObjects();
    drawRoundObjects();
    drawGoldObjects();
    drawShipStats();
    drawScore();
    drawParticles();
    requestAnimationFrame(update);
}

function checkCollisions() {
    sharpObjects.forEach((sharpObj, index) => {
        let objectX = PLANET_MODE ? canvas.width - sharpObj.x : sharpObj.x;
        let objectWidth = PLANET_MODE ? SHARP_HEIGHT : SHARP_WIDTH;
        let objectHeight = PLANET_MODE ? SHARP_WIDTH : SHARP_HEIGHT;
    
        if (shipX < objectX + objectWidth &&
            shipX + shipSize > objectX &&
            shipY < sharpObj.y + objectHeight &&
            shipY + shipSize * 2 > sharpObj.y &&
            !shield) {
            sharpObjects.splice(index, 1);
            if (shipSize <= 10) {
                gameOver = true;
            }
            updateScore(-1);
            createExplosion(objectX, sharpObj.y);
            shipImage.src = hit_ship
        }
    });

    roundObjects.forEach((roundObj, index) => {
        if (shipX < roundObj.x + ROUND_RADIUS * 2 &&
            shipX + shipSize > roundObj.x &&
            shipY < roundObj.y + ROUND_RADIUS * 2 &&
            shipY + shipSize * 2 > roundObj.y) {
            //shipSize = Math.min(50, shipSize);
            roundObjects.splice(index, 1);
            updateScore(1);
            if (shield == false){
                shipImage.src = gain_ship
            }
        }
    });

    goldObjects.forEach((goldObj, index) => {
        if (shipX < goldObj.x + GOLD_RADIUS * 2 &&
            shipX + shipSize > goldObj.x &&
            shipY < goldObj.y + GOLD_RADIUS * 2 &&
            shipY + shipSize * 2 > goldObj.y) {
            goldObjects.splice(index, 1);
            updateScore(5);
            shipImage.src = shield_ship
            if (shield == false){ 
                frame_count = 0 
                shield_effect = SHIELD_DURATION
            } else {
                frame_count += SHIELD_DURATION
                shield_effect += SHIELD_DURATION * GOLD_OBJECT_VALUE
            }
            shield = true;
        }
    });

    if (score < 0) {
        gameOver = true;
        game_win = false;
        game_text = "Game Over";
    }
    if (score >= 10) {
        gameOver = true;
        game_win = true;
        game_text = "Congratulations! \nYou saved Christmas!";
    }
}

function displayGameOver() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(game_text, canvas.width / 2, canvas.height / 2);
    if (game_win) {
        //ctx.fillText(game_text, canvas.width / 2, canvas.height / 2 + 40);
        setTimeout(() => {
            window.location.href = "prize.html";
        }, 3000);
    } else {
        setTimeout(() => {
            window.location.href = "index.html";
        }, 3000);
    }
    
}

// Handle keydown events for smooth acceleration
document.addEventListener('keydown', (event) => {
    if (gameOver && event.key === 'Spacebar') {
        resetGame();
        return;
    }
    switch (event.key) {
        case 'ArrowUp':
            shipVelocityY = Math.max(shipVelocityY - acceleration, -maxSpeed);
            break;
        case 'ArrowDown':
            shipVelocityY = Math.min(shipVelocityY + acceleration, maxSpeed);
            break;
        case 'ArrowLeft':
            shipVelocityX = Math.max(shipVelocityX - acceleration, -maxSpeed);
            break;
        case 'ArrowRight':
            shipVelocityX = Math.min(shipVelocityX + acceleration, maxSpeed);
            break;
    }
});

function spawnSharpObject() {
    if (PLANET_MODE) {
        const y = Math.random() * (canvas.width - SHARP_WIDTH);
        sharpObjects.push({ y, x: 0 });
    } else {
        const x = Math.random() * (canvas.width - SHARP_WIDTH);
        sharpObjects.push({ x, y: 0 });
    }

}

function spawnRoundObject() {
    if (PLANET_MODE) {
        const y = Math.random() * (canvas.width - ROUND_RADIUS * 2) + ROUND_RADIUS;
        roundObjects.push({ y, x: 0 });
    } else {
        const x = Math.random() * (canvas.width - ROUND_RADIUS * 2) + ROUND_RADIUS;
        roundObjects.push({ x, y: 0 });
    }
}

function spawnGoldObject() {
    if (PLANET_MODE) {
        const y = Math.random() * (canvas.width - GOLD_RADIUS * 2) + GOLD_RADIUS;
        goldObjects.push({ y, x: 0 });
    } else {
        const x = Math.random() * (canvas.width - GOLD_RADIUS * 2) + GOLD_RADIUS;
        goldObjects.push({ x, y: 0 });
    }
}

function resetGame() {
    shipSize = 30;
    shipX = 100;
    shipY = 100;
    shipVelocityX = 0;
    shipVelocityY = 0;
    sharpObjects = [];
    roundObjects = [];
    goldObjects = [];
    gameOver = false;
}

setInterval(spawnSharpObject, 200);
setInterval(spawnRoundObject, 1500);
setInterval(spawnGoldObject, 10000);

update();
