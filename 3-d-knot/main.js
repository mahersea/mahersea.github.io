import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Square Knot Geometry
const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16, 3, 4); // Adjust params for a square knot
const material = new THREE.MeshStandardMaterial(
    { 
        //color: 0x0077ff, 
        //greenish
        color: 0x00ff00,
        metalness: 0.5, 
        roughness: 0.5 
    }
);
const knot = new THREE.Mesh(geometry, material);
scene.add(knot);

// Lighting
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(5, 5, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040); // Soft ambient light
scene.add(ambientLight);

// Camera Position
camera.position.z = 5;

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth rotation
controls.dampingFactor = 0.05;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate the knot
    knot.rotation.x += 0.01;
    knot.rotation.y += 0.01;

    controls.update(); // For smooth controls
    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});