#!/usr/bin/env node

/**
 * Thumbnail Generator
 * Creates placeholder thumbnails for projects missing them
 */

const fs = require('fs');
const path = require('path');

class ThumbnailGenerator {
  constructor() {
    this.rootDir = process.cwd();
    this.imagesDir = path.join(this.rootDir, 'images');
  }

  /**
   * Generate SVG placeholder thumbnail
   */
  generatePlaceholderSVG(projectName, category = 'Experiment') {
    const colors = {
      'Small Games': '#FF6B6B',
      'Medium Sized Games': '#4ECDC4', 
      'Visualizations': '#45B7D1',
      'Mathematical Expressions': '#96CEB4',
      'Web Tools': '#FFEAA7',
      'Tools': '#DDA0DD',
      'Learning': '#98D8C8',
      'Experiments': '#F7DC6F'
    };

    const color = colors[category] || colors['Experiments'];
    const title = this.formatTitle(projectName);
    const initials = title.split(' ').map(word => word[0]).join('').substring(0, 3);

    return `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${this.darkenColor(color, 20)};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="300" height="200" fill="url(#grad)" rx="8"/>
  <circle cx="150" cy="70" r="30" fill="rgba(255,255,255,0.2)"/>
  <text x="150" y="80" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
        text-anchor="middle" fill="white">${initials}</text>
  <text x="150" y="130" font-family="Arial, sans-serif" font-size="16" font-weight="normal" 
        text-anchor="middle" fill="white">${title}</text>
  <text x="150" y="150" font-family="Arial, sans-serif" font-size="12" 
        text-anchor="middle" fill="rgba(255,255,255,0.8)">${category}</text>
</svg>`;
  }

  /**
   * Darken a hex color by a percentage
   */
  darkenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  /**
   * Format project name for display
   */
  formatTitle(name) {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Find projects missing thumbnails
   */
  findProjectsNeedingThumbnails() {
    const ignoredDirs = new Set([
      'node_modules', '.git', '.github', 'images', 'css', '_layouts', '_posts',
      'littleTaskMan', 'littleLifeMan', 'topic-manager', 'fudge', 'graphql-resolvers',
      'tailwind-explorer', 'Chamber'
    ]);

    const projects = [];
    const items = fs.readdirSync(this.rootDir);

    for (const item of items) {
      const itemPath = path.join(this.rootDir, item);
      
      if (ignoredDirs.has(item)) continue;
      if (!fs.statSync(itemPath).isDirectory()) continue;
      if (item.startsWith('.') || item.startsWith('_')) continue;
      
      const hasIndex = fs.existsSync(path.join(itemPath, 'index.html'));
      const thumbnailPath = path.join(this.imagesDir, `${item}_thumb.png`);
      const hasThumbnail = fs.existsSync(thumbnailPath);
      
      if (hasIndex && !hasThumbnail) {
        projects.push(item);
      }
    }

    return projects;
  }

  /**
   * Get project category from README or guess from name
   */
  getProjectCategory(projectName) {
    const readmePath = path.join(this.rootDir, projectName, 'README.md');
    
    if (fs.existsSync(readmePath)) {
      const content = fs.readFileSync(readmePath, 'utf8');
      const categoryMatch = content.match(/category:\s*(.+)/i);
      if (categoryMatch) {
        return categoryMatch[1].trim();
      }
    }

    // Guess category from name
    const name = projectName.toLowerCase();
    if (name.includes('game') || name.includes('asteroids') || name.includes('snake') || 
        name.includes('puzzle') || name.includes('tic-tac-toe')) {
      return 'Small Games';
    }
    if (name.includes('visual') || name.includes('chart') || name.includes('graph') || 
        name.includes('plot')) {
      return 'Visualizations';
    }
    if (name.includes('math') || name.includes('euler') || name.includes('fourier') || 
        name.includes('mandelbrot')) {
      return 'Mathematical Expressions';
    }
    if (name.includes('tool') || name.includes('explorer') || name.includes('playground')) {
      return 'Web Tools';
    }
    
    return 'Experiments';
  }

  /**
   * Generate thumbnail for a project
   */
  generateThumbnail(projectName) {
    const category = this.getProjectCategory(projectName);
    const svg = this.generatePlaceholderSVG(projectName, category);
    const outputPath = path.join(this.imagesDir, `${projectName}_thumb.svg`);
    
    // Ensure images directory exists
    if (!fs.existsSync(this.imagesDir)) {
      fs.mkdirSync(this.imagesDir);
    }
    
    fs.writeFileSync(outputPath, svg);
    console.log(`✅ Generated thumbnail: ${projectName}_thumb.svg`);
  }

  /**
   * Run thumbnail generation
   */
  run() {
    console.log('🖼️  Thumbnail Generator Starting...');
    
    const projects = this.findProjectsNeedingThumbnails();
    console.log(`Found ${projects.length} projects needing thumbnails`);
    
    if (projects.length === 0) {
      console.log('✅ All projects already have thumbnails!');
      return;
    }

    for (const project of projects) {
      this.generateThumbnail(project);
    }
    
    console.log(`\n✨ Generated ${projects.length} thumbnails!`);
    console.log('💡 Note: These are placeholder SVGs. Replace with actual screenshots for better results.');
  }
}

// CLI execution
if (require.main === module) {
  const generator = new ThumbnailGenerator();
  generator.run();
}

module.exports = ThumbnailGenerator;