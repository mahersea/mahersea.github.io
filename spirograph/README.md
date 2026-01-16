# Hypotrochoid (Spirograph) Visualization

An interactive simulation of spirograph patterns through mathematical hypotrochoid curves.

## About
This project creates beautiful spirograph-like patterns by plotting hypotrochoid curves, which are the mathematical patterns created when a circle rolls inside another circle and a point fixed to the rolling circle traces a path.

## Features
- Adjustable outer radius, inner radius, and distance parameters
- Real-time visualization with colorful, rainbow-like trail effect
- Speed control for adjustable animation pace
- Fade trail option for enhanced visual effect
- Pause/resume functionality

## Mathematics
The visualization uses the parametric equations of a hypotrochoid:
- x(¸) = (R - r) × cos(¸) + d × cos(((R - r) / r) × ¸)
- y(¸) = (R - r) × sin(¸) - d × sin(((R - r) / r) × ¸)

Where R is the outer radius, r is the inner radius, d is the distance from the center of the inner circle, and ¸ is the angle parameter.

## Topics
#mathematics #parametric-curves #spirograph #hypotrochoid #interactive #visualization #javascript #canvas