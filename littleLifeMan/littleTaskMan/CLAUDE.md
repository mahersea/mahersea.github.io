# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Development Commands
- `npm start` - Start the server on port 3003
- `node server.js` - Alternative way to start server
- `npm test` - Run tests (not yet implemented)

## Code Style Guidelines

### JavaScript
- Use ES6+ features (arrow functions, template literals, destructuring)
- Indent with 2 spaces
- Use camelCase for variables and functions, PascalCase for components
- Include semicolons at the end of statements
- Follow RESTful conventions for API endpoints (GET, POST, PUT, DELETE)

### File Operations
- Always use helper functions `readData()` and `writeData()` for JSON file operations
- Handle errors with try/catch blocks around file and API operations
- Use the global error handling middleware for server errors

### UI/Styling
- Follow BEM naming convention for CSS classes
- Use semantic HTML elements
- Use brand colors as defined in brandStyle.md:
  - Primary: #2A7B8B (Deep Teal)
  - Secondary: #F26C4F (Soft Coral)
  - Background: #DCEDC2 (Light Sage)
  - Text: #333333 (Deep Charcoal)
- Use Montserrat for headings and Open Sans for body text

### Validation
- Use validation middleware before processing requests
- Return appropriate HTTP status codes (200, 201, 204, 400, 404, 500)
- Structure responses consistently as JSON objects
- Validate all user inputs