const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const squares = [];
const squareCount = 500; // Number of squares
const baseSquareSize = 10; // Base size of the squares
const sizeIncrease = 90; // Size increase on hover
const tossForce = 5; // Force applied to toss the squares

function createSquares() {
    for (let i = 0; i < squareCount; i++) {
        const x = Math.random() * (canvas.width - baseSquareSize);
        const y = Math.random() * (canvas.height - baseSquareSize);
        // Set initial color to random shades of red
        const redShade = Math.floor(Math.random() * 256);
        const blueShade = Math.floor(Math.random() * 200);
        const dx = (Math.random() - 0.5) * 2;
        const dy = (Math.random() - 0.5) * 2;
        let color = `rgb(${blueShade}, 25, 150)`;
        console.log("-------dx", dx);

        if (dx < -0.8) {
            color = "rgb(255, 182, 193)";  // pastelPink
        } else if (dx >= -0.8 && dx < -0.6) {
            color = "rgb(173, 216, 230)";  // pastelBlue
        } else if (dx >= -0.6 && dx < -0.4) {
            color = "rgb(152, 251, 152)";  // pastelGreen
        } else if (dx >= -0.4 && dx < -0.2) {
            color = "rgb(253, 253, 150)";  // pastelYellow
        } else if (dx >= -0.2 && dx < 0) {
            color = "rgb(216, 191, 216)";  // pastelPurple
        } else if (dx >= 0 && dx < 0.2) {
            color = "rgb(255, 179, 71)";   // pastelOrange
        } else if (dx >= 0.2 && dx < 0.4) {
            color = "rgb(189, 252, 201)";  // pastelMint
        } else if (dx >= 0.4 && dx < 0.6) {
            color = "rgb(255, 160, 122)";  // pastelCoral
        } else if (dx >= 0.6 && dx < 0.8) {
            color = "rgb(255, 218, 185)";  // pastelPeach
        } else {
            color = "rgb(230, 230, 250)";  // pastelLavender
        }
       
        // adjust brightness and saturation. Master control variable
        const brightness = 10;
        const saturation = 50;
        const lightness = 50;
        const hsl = `hsl(${blueShade}, ${saturation}%, ${lightness}%)`;
        color = hsl;

        squares.push({
            x,
            y,
            color: color,
            size: baseSquareSize,
            dx: dx,
            dy: dy,
        });
    }
}

function drawSquares() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    squares.forEach(({ x, y, color, size }) => {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, size, size);
    });
}

function jiggleSquare(e) {
    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;

    squares.forEach(square => {
        const isHovering =
            mouseX >= square.x &&
            mouseX <= square.x + square.size &&
            mouseY >= square.y &&
            mouseY <= square.y + square.size;

        if (isHovering) {
            // Calculate toss direction
            const tossX = (mouseX - (square.x + square.size / 2)) / 10; // Normalize toss direction
            const tossY = (mouseY - (square.y + square.size / 2)) / 10;

            // Apply toss force
            square.dx += tossX * tossForce; // Toss in the X direction
            square.dy += tossY * tossForce; // Toss in the Y direction

            // Change color to a random shade of red on hover
            const redShade = Math.floor(Math.random() * 256); // New random red shade
            const blueShade = `rgb(78,65,34)`; // blue shade
            square.color = `rgb(${blueShade}, 0, 0)`; // Change to new red shade
            square.size = baseSquareSize + sizeIncrease; // Increase size
        } else {
            // Reset size if not hovering
            square.size = baseSquareSize;
        }
    });
}

function updateSquares() {
    squares.forEach(square => {
        square.x += square.dx;
        square.y += square.dy;

        // Apply friction to slow down the squares over time
        square.dx *= 0.99999; // Friction on X
        square.dy *= 0.99999; // Friction on Y

        // Keep squares within the canvas bounds
        if (square.x < 0 || square.x > canvas.width - square.size) {
            square.dx *= -0.5; // Reverse direction on X axis
            square.x = Math.max(0, Math.min(square.x, canvas.width - square.size)); // Correct position
        }
        if (square.y < 0 || square.y > canvas.height - square.size) {
            square.dy *= -0.5; // Reverse direction on Y axis
            square.y = Math.max(0, Math.min(square.y, canvas.height - square.size)); // Correct position
        }

        // Check for collisions with other squares
        squares.forEach(otherSquare => {
            if (square !== otherSquare) {
                const dx = otherSquare.x - square.x;
                const dy = otherSquare.y - square.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = (square.size + otherSquare.size) / 1.8;

                if (distance < minDistance) {
                    // Calculate overlap
                    const overlap = minDistance - distance;
                    const angle = Math.atan2(dy, dx);

                    // Push squares apart
                    const pushX = Math.cos(angle) * overlap;
                    const pushY = Math.sin(angle) * overlap;

                    // Adjust positions based on overlap
                    square.x -= pushX / 2; // Push the square back
                    square.y -= pushY / 2; // Push the square back
                    otherSquare.x += pushX / 2; // Push the other square away
                    otherSquare.y += pushY / 2; // Push the other square away
                }
            }
        });
    });
}

function animate() {
    drawSquares();
    updateSquares();
    requestAnimationFrame(animate); // Loop the animation
}

// Initialize the squares and set up the mouseover event
createSquares();
drawSquares();
canvas.addEventListener('mousemove', jiggleSquare);
animate(); // Start the animation loop
