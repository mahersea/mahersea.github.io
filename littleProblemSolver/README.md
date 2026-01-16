# littlePathMan

A web application for problem solving, path planning, and step management with AI assistance.

## Features

- **Problem Management**: Create, track, and organize problems that need to be solved
- **Step Management**: Break down problems into actionable steps
- **User Management**: Assign steps to team members
- **Gantt Chart**: Visualize problem solving timeline
- **AI Problem Solver**: Chat with an AI assistant to develop a structured plan for solving problems
- **Plan Conversion**: Convert generated plans into actionable steps

## Color Palette

The application uses a color palette extracted from the logo:

- Teal: `#2a7b8b`
- Gold: `#ffe680`
- Coral: `#de8787`
- Light Blue: `#aaccff`
- Peach: `#ffb380`
- Light Teal: `#afe9dd`
- Light Green: `#aade87`

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   node server.js
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3003
   ```

## Key Components

- Express.js backend with RESTful APIs
- Simple file-based data storage using JSON
- Clean, responsive UI with CSS custom properties
- AI-assisted problem solving and planning interface

## Project Structure

- `/public` - Static assets and frontend code
  - `/css` - Stylesheets
  - `/js` - JavaScript utilities
  - `/images` - Images and icons
- `/server.js` - Express.js server and API endpoints
- JSON files for data storage:
  - `problems.json` - Problem records
  - `tasks.json` - Step records
  - `users.json` - User records
  - `chat.json` - Chat messages for problem solving sessions