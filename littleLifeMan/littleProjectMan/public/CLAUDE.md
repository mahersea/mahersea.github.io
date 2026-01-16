# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Development Commands
- `npm start` - Start the server (if server.js is available)
- `python -m http.server 3007` - Alternative way to serve the static site locally
- `open public/index.html` - Open the static HTML file directly in a browser

## Code Style Guidelines

### HTML/CSS
- Use HTML5 semantic elements
- Indent with 2 spaces
- Follow the established CSS variable pattern in style.css
- Use the BEM naming convention for CSS classes

### JavaScript
- Follow ES6+ standards (arrow functions, template literals)
- Use camelCase for variables and functions
- Include semicolons at the end of statements
- Use 2 spaces for indentation

### Naming and Structure
- Maintain the existing folder structure (public/css, public/images, public/js)
- Keep component-specific code in dedicated files
- Use descriptive and consistent naming

### Colors and UI
- Use defined CSS variables for colors (--primary, --secondary, etc.)
- Follow the established UI patterns with tabs and containers
- Use Montserrat for headings and Open Sans for body text