# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a WebGL Tank Game built as a single HTML file with embedded JavaScript. It's part of a larger portfolio website hosted on GitHub Pages. The game is a 3D tank battle simulator using Three.js for WebGL rendering.

## Architecture

### Single-File Structure
- `index.html` - Contains all game code, CSS, and HTML in one monolithic file
- `README.md` - Project documentation and feature description
- No build process or external dependencies beyond CDN-loaded Three.js

### Code Organization (within index.html)
The game follows this architectural pattern:
1. **CSS Styles** (lines ~7-93) - Theme system with CSS variables for light/dark mode
2. **HTML Structure** (lines ~94-113) - UI elements and canvas
3. **JavaScript Game Engine** (lines ~116+) - All game logic in embedded script tag

### Core Game Systems
- **Scene Management**: Three.js scene with camera, lighting, and fog
- **Entity System**: Tank, bunkers (enemy/medic), projectiles, particles, trees
- **Physics**: Custom collision detection, projectile trajectories, movement
- **Game State**: Health, score, win/lose conditions
- **Visual Effects**: Particle explosions, muzzle flashes, lighting effects
- **Input System**: Keyboard controls (arrow keys, spacebar)

### Key Variables and Objects
- `scene` - Three.js scene containing all 3D objects
- `camera` - Perspective camera following the tank
- `tankBody` - Main tank group with physics properties
- `targets[]` - Array of enemy bunkers
- `projectiles[]` - Array of active projectiles
- `medicBunkers[]` - Array of healing stations

## Development

### Running the Game
```bash
# Navigate to project directory
cd webgl-tank

# Open directly in browser (no build required)
open index.html

# Or serve via parent portfolio system
cd ..
npm start
```

### Parent Portfolio Integration
This project is part of a larger portfolio management system:
```bash
# From parent directory
npm run scan          # Discovers and catalogs this project
npm run build         # Runs scan + thumbnail generation
```

### Testing
No automated tests. Manual testing involves:
- Loading the game in browser
- Testing controls (arrow keys, spacebar)
- Verifying collision detection
- Testing theme toggle functionality
- Checking responsive behavior

## Code Conventions

### Three.js Patterns
- Objects are THREE.Group() containers with child meshes
- Materials use MeshPhongMaterial for lighting interaction
- Positions use THREE.Vector3 for 3D coordinates
- Colors defined as hex values (0x008000 for green, etc.)

### Game Loop Structure
The `animate()` function handles:
1. Input processing (keyboard state)
2. Physics updates (movement, projectiles)
3. Collision detection
4. AI behavior (enemy firing, mortars)
5. Particle system updates
6. Rendering

### Naming Conventions
- camelCase for variables and functions
- Descriptive names: `createExplosion()`, `fireProjectile()`
- Arrays are plural: `projectiles[]`, `targets[]`
- Three.js objects suffixed by type: `tankMeshGeo`, `tankMeshMat`

## Modification Guidelines

### Adding Features
- All code goes in the single HTML file
- Follow existing patterns for Three.js object creation
- Add new game entities to appropriate arrays
- Update collision detection system if needed
- Consider theme system for new UI elements

### Performance Considerations
- Object pooling used for projectiles and particles
- Scene traversal happens in collision detection
- Remove objects from scene when no longer needed
- Limit particle counts to maintain 60fps

### Theme System
New UI elements should use CSS custom properties:
- `--primary1` through `--primary5` for themed colors
- `--bg-color` and `--text-color` for backgrounds/text
- Automatic inversion in dark mode via body.dark-mode class