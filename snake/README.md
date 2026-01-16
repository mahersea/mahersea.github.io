# Caterpillar Game

A creative take on the classic snake game, featuring a segmented caterpillar with overlapping body parts and image-based rendering.

## Description

This project reimagines the classic snake game with a caterpillar theme. Players control a caterpillar that moves around the screen, eating food to grow longer. The implementation features custom graphics for the head, body, and tail segments, with a unique overlapping segment algorithm that creates a more natural, organic movement compared to traditional grid-based snake games.

## Features

- Custom sprite-based rendering with separate head, body, and tail images
- Overlapping segment algorithm for smooth, natural movement
- Wrap-around screen boundaries
- Collision detection with the caterpillar's own body
- Randomized food placement
- Arrow key controls
- Game over state with alert notification
- Green tint overlay effect for visual enhancement

## Technical Details

The implementation utilizes:
1. Canvas API for all rendering
2. Image loading with Promise.all for synchronization
3. Time-controlled game loop using setTimeout
4. Vector-based movement physics
5. Grid-based collision detection
6. Canvas composite operations for visual effects
7. Event listeners for keyboard input

## Topics
#game #snake #canvas #javascript #sprite-based #animation #collision-detection