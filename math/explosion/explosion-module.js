
const canvas = document.getElementById('explosion');
const ctx = canvas.getContext('2d');

// Explosion Configuration
const PARTICLE_COUNT = 100; // Number of particles in the explosion
const PARTICLE_SIZE = 2; // Size of each particle
const PARTICLE_SPEED = 2; // Maximum speed of the particles

let particles = [];

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
        ctx.fillStyle = `rgba(0, 211, 255, ${particle.alpha})`; // Fade out effect
        //00d3ff
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

// Example Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Draw sharp objects
    //drawSharpObjects();

    // Draw explosion particles
    drawParticles();

    requestAnimationFrame(animate);
}

// Example of triggering an explosion
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createExplosion(x, y);
});

// Start the animation
animate();
