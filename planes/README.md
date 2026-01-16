# MSP Flight Arrivals and Departures Visualizer

An interactive visualization displaying flight patterns to and from Minneapolis-Saint Paul International Airport (MSP) with sonification elements.

## Description

This application creates a real-time, data-driven visualization of aircraft movements in and out of Minneapolis-Saint Paul International Airport. The visualization maps flight routes between MSP and major US airports, with animated planes representing actual flight data sourced from the OpenSky Network API. Each aircraft is depicted with a trailing path and color-coded by airline, creating an immersive representation of air traffic patterns.

Beyond the visual dimension, the application incorporates audio sonification, with each route assigned a distinct musical note that plays as planes arrive at or depart from MSP. This creates a generative soundscape that directly corresponds to the visualized flight data, blending sight and sound into a comprehensive flight tracking experience.

## Features

- Real-time visualization of flight arrivals and departures at MSP Airport
- API integration with OpenSky Network for actual flight data
- Color-coded trails for different airlines (Delta, United, American, Southwest, etc.)
- Sonification of flight data with unique musical notes for each destination
- Interactive controls (show/hide arrivals or departures, toggle labels)
- Time warp slider to adjust simulation speed
- Detailed flight information display (airline, callsign, origin/destination, time)
- Responsive design that adapts to different screen sizes
- Fallback to sample data if API is unavailable
- Simulated flight board with scrolling arrivals and departures

## Technical Details

- Built with p5.js for animation and visual rendering
- Uses p5.sound library for audio synthesis and playback
- Implements the Web Audio API for real-time sound generation
- Custom WebGL-accelerated rendering for smooth animation
- API integration with error handling and fallback mechanisms
- Object-oriented approach with Plane class for encapsulation
- Dynamic particle system for flight trail rendering
- Responsive canvas sizing with window event handlers
- Color interpolation algorithms for airline identification

## Topics

#data-visualization #aviation #sonification #p5js #api-integration #interactive-map #flight-tracking #web-audio