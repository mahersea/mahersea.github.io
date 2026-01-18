# Mandelbrot Set Visualization

Interactive visualization of the Mandelbrot set with multiple color palettes and full responsive design support. Explore the iconic mathematical fractal with smooth rendering across all devices.

## Features

- **Real-time Mandelbrot Rendering**: Compute and visualize the Mandelbrot set using iterative complex number calculations
- **Multiple Color Palettes**: Choose from Grayscale, Rainbow, Blue, and Hot color schemes
- **Fully Responsive Design**: Optimized layouts for mobile, tablet, and desktop devices
- **Dynamic Canvas Sizing**: Automatically scales visualization to fit any screen size
- **Touch-Friendly Interface**: Large touch targets and vertical stacking on mobile devices
- **Performance Optimized**: Smaller canvas on mobile devices provides 61-84% faster rendering
- **Pure Vanilla JavaScript**: No external dependencies or libraries required

## Technologies

- HTML5 Canvas API
- CSS3 with Flexbox and Media Queries
- JavaScript (ES6)
- Responsive Web Design principles
- Complex number mathematics

## Mathematical Background

The Mandelbrot set is a famous fractal defined by iterating the function:

**z<sub>n+1</sub> = z<sub>n</sub><sup>2</sup> + c**

Where:
- z starts at 0
- c is a complex number corresponding to each pixel
- Points that remain bounded (don't diverge to infinity) are part of the set
- The iteration count determines the color of pixels outside the set

## Color Palettes

1. **Grayscale**: Classic black and white gradient
2. **Rainbow**: Full HSL spectrum (360° hue rotation)
3. **Blue**: Monochromatic blue gradient
4. **Hot**: Heat map (red → yellow → white)

## Responsive Design

The visualization adapts to three breakpoints:

- **Desktop (>768px)**: Canvas up to 800×800px, horizontal controls
- **Tablet (600-768px)**: Scaled canvas, flexible control layout
- **Mobile (<600px)**: Optimized canvas (320-500px), vertical controls, larger touch targets

See [RESPONSIVE-DESIGN.md](./RESPONSIVE-DESIGN.md) for detailed technical documentation.

## Performance

| Device | Canvas Size | Rendering Speed |
|--------|-------------|-----------------|
| Desktop | 800×800 | Baseline |
| Tablet | 600×600 | 44% faster |
| Mobile (large) | 500×500 | 61% faster |
| Mobile (small) | 320×320 | 84% faster |

Smaller viewports automatically use smaller canvas dimensions, resulting in significantly faster rendering times.

## Browser Compatibility

- Chrome/Edge (Chromium)
- Safari (iOS/macOS)
- Firefox
- All modern mobile browsers

## Usage

1. Open `index.html` in a web browser
2. Select a color palette from the dropdown menu
3. Click "Render Mandelbrot" to generate the visualization
4. Resize the browser window to see responsive behavior

## Technical Details

- **Algorithm**: Escape-time algorithm with 100 maximum iterations
- **Coordinate System**: Complex plane centered at (-0.5, 0)
- **Zoom Level**: Fixed at 1.0 (full set view)
- **Color Mapping**: HSL to RGB conversion for rainbow palette
- **Rendering**: Direct pixel manipulation using ImageData API

## Category

Mathematical Expressions

## Demo

[Live Demo](./index.html)

## Project Structure

```
mandelbrot/
├── index.html              # Single-file application
├── README.md              # This file
├── RESPONSIVE-DESIGN.md   # Technical responsive design documentation
└── CHANGELOG.md           # Version history and changes
```

## Future Enhancements

- Interactive zoom and pan controls
- Custom color palette editor
- Julia set mode
- WebGL acceleration for faster rendering
- Export functionality (PNG/SVG)
- Zoom history and bookmarks
- Animation mode

## License

Part of the mahersea.github.io portfolio

## Author

Created as part of the mathematical visualizations collection

## Related Projects

- Other mathematical visualizations in the `/math` directory
- Physics simulations and interactive visualizations across the portfolio

---

*For detailed information about the responsive design implementation, see [RESPONSIVE-DESIGN.md](./RESPONSIVE-DESIGN.md)*
