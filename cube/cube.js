// Scene, camera, and renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a cube with muted colors for each face
const geometry = new THREE.BoxGeometry();
const materials = [
    new THREE.MeshBasicMaterial({ color: 0x1f0000 }), // Dark Red
    new THREE.MeshBasicMaterial({ color: 0x1f3f1f }), // Dark Green
    new THREE.MeshBasicMaterial({ color: 0x1f1f3f }), // Dark Blue
    new THREE.MeshBasicMaterial({ color: 0x1f1f00 }), // Dark Yellow
    new THREE.MeshBasicMaterial({ color: 0x1f1f1f }), // Dark Magenta
    new THREE.MeshBasicMaterial({ color: 0x1f3f3f })  // Dark Cyan
];
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

// Position the camera
camera.position.z = 5;

// Mouse controls
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    // Slow down the rotation
    cube.rotation.x += (mouseY * 0.01); // Reduced rotation speed
    cube.rotation.y += (mouseX * 0.01); // Reduced rotation speed
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation
animate();