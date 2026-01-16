# LittleLifeMan Projects

This repository contains multiple "little{SOMETHING}Man" projects with a common theme and structure.

## Project Structure

Each project follows the same basic structure:

```
little{PROJECT_TYPE}Man/
├── public/
│   ├── css/
│   │   └── style.css     # Project-specific styling
│   ├── js/
│   │   └── ...           # JavaScript files
│   ├── images/
│   │   └── logo.svg      # Project logo
│   └── index.html        # Main HTML file
├── ...                   # Project-specific files
```

## Theme System

All projects use a common theme system with CSS variables to maintain consistency while allowing for project-specific styling. The main theme variables are:

- `--primary`: Primary color for the project
- `--secondary`: Secondary accent color
- `--background`: Background color
- `--text`: Text color

## Creating a New Project

To create a new project structure, use the included script:

```bash
./create_structure.sh ProjectName PrimaryColor SecondaryColor
```

For example:
```bash
./create_structure.sh Money "#3498DB" "#2ECC71"
```

This will create a new project with the structure described above.

## Customizing a Project

1. Edit the `public/css/style.css` file to modify the theme colors
2. Update the `public/index.html` file with project-specific tabs and content
3. Replace the `public/images/logo.svg` with a custom logo

## Running a Project

Each project can be run by serving the public directory with a web server. For example:

```bash
cd littleTaskMan
# Using Python's built-in server
python -m http.server --directory public
# Or with Node.js's http-server if installed
# npx http-server public
```

Then open your browser to http://localhost:8000 (or the port shown in the console).