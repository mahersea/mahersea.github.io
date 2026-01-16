# CLAUDE.md - Portfolio Management System

This repository uses an automated portfolio management system for organizing and maintaining a collection of 88+ web projects.

## Quick Commands

```bash
# Scan all projects and update projects.json
npm run scan

# Generate placeholder thumbnails for projects missing them
npm run generate-thumbnails

# Set up README files for projects that need them
npm run setup-readme

# Run complete build process
npm run build

# Start the local server
npm start
```

## Project Structure

### Automated Tools
- `portfolio-manager.js` - Main scanner that discovers and analyzes projects
- `setup-readme.js` - Interactive tool for creating README files
- `generate-thumbnails.js` - Creates SVG placeholder thumbnails
- `portfolio-status.html` - Management dashboard for tracking project status

### Key Files
- `projects.json` - Auto-generated project database with metadata
- `project-template.md` - Template for standardizing README files
- `index.html` - Main portfolio page
- `script.js` - Portfolio UI logic

## Project Status Levels

1. **ready** - Has index.html, README.md, thumbnail, and description
2. **needs-docs** - Missing README.md documentation  
3. **needs-thumbnail** - Missing thumbnail image
4. **incomplete** - Missing index.html (not functional)

## Project Categories

- **Small Games** - Simple interactive games
- **Medium Sized Games** - More complex game projects
- **Visualizations** - Data viz, physics simulations, charts
- **Mathematical Expressions** - Math/science visualizations
- **Web Tools** - Development utilities and playgrounds
- **Tools** - General purpose applications
- **Learning** - Educational and tutorial projects  
- **Experiments** - Proof-of-concepts and creative coding

## Workflow

### Adding a New Project
1. Create directory with `index.html`
2. Run `npm run scan` to discover it
3. Run `npm run setup-readme` to add documentation
4. Run `npm run generate-thumbnails` for placeholder
5. Replace SVG thumbnail with actual screenshot if desired

### Project Requirements
Each project directory should contain:
- `index.html` (required)
- `README.md` (auto-generated template available)
- Thumbnail in `images/project-name_thumb.png`

### README Template Format
```markdown
# Project Title
Brief description

## Features
- Feature 1
- Feature 2

## Technologies
- HTML5, CSS3, JavaScript
- [Additional libraries]

## Category
[Choose from predefined categories]

## Demo
[Live Demo](./index.html)
```

## Ignored Directories

The scanner automatically ignores these directories:
- `node_modules`, `.git`, `.github`
- `images`, `css`, `_layouts`, `_posts`
- `littleTaskMan`, `littleLifeMan`, `topic-manager`
- `fudge`, `graphql-resolvers`, `tailwind-explorer`
- `Chamber`

## Technology Detection

The system automatically detects technologies based on file extensions:
- `.js` → JavaScript
- `.ts` → TypeScript  
- `.html` → HTML
- `.css` → CSS
- `.py` → Python
- `.php` → PHP
- `package.json` → Node.js

Special library detection for Three.js, D3.js, Chart.js based on filenames.

## Portfolio UI Features

- Dynamic project loading from JSON
- Category-based filtering
- Technology-based filtering
- Responsive grid layout
- Modal project previews
- Search functionality

## Hosting

Currently hosted on GitHub Pages at mahersea.github.io

Recommended alternatives:
- **Netlify** - Enhanced build tools, form handling
- **Vercel** - If migrating to React/Next.js  
- **Surge.sh** - Simple CLI deployment

## Development Notes

- Keep littleTaskMan as-is (separate task management system)
- All automation tools are Node.js scripts
- Projects.json is automatically generated - don't edit manually
- SVG thumbnails are placeholders - replace with screenshots for better presentation
- The system merges existing project metadata with newly discovered projects

## Dashboard Access

Visit `portfolio-status.html` for:
- Project status overview
- Category breakdowns
- Technology statistics
- Management actions