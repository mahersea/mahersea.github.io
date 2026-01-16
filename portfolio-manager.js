#!/usr/bin/env node

/**
 * Portfolio Manager - Automated project scanner and organizer
 * Scans directories, validates projects, and maintains projects.json
 */

const fs = require('fs');
const path = require('path');

class PortfolioManager {
  constructor() {
    this.rootDir = process.cwd();
    this.projectsFile = path.join(this.rootDir, 'projects.json');
    this.ignoredDirs = new Set([
      'node_modules', '.git', '.github', 'images', 'css', '_layouts', '_posts',
      'littleTaskMan', 'littleLifeMan', 'topic-manager', 'fudge', 'graphql-resolvers',
      'tailwind-explorer', 'Chamber'
    ]);
    this.categories = new Set([
      'Small Games', 'Medium Sized Games', 'Visualizations', 'Mathematical Expressions',
      'Web Tools', 'Tools', 'Learning', 'Experiments'
    ]);
  }

  /**
   * Main scanner function - discovers all projects in the directory
   */
  scanProjects() {
    console.log('🔍 Scanning for projects...');
    const discovered = [];
    const items = fs.readdirSync(this.rootDir);

    for (const item of items) {
      const itemPath = path.join(this.rootDir, item);
      
      if (this.isValidProject(itemPath, item)) {
        const project = this.analyzeProject(itemPath, item);
        if (project) {
          discovered.push(project);
        }
      }
    }

    console.log(`✅ Found ${discovered.length} projects`);
    return discovered;
  }

  /**
   * Check if directory is a valid project
   */
  isValidProject(itemPath, itemName) {
    if (this.ignoredDirs.has(itemName)) return false;
    if (!fs.statSync(itemPath).isDirectory()) return false;
    if (itemName.startsWith('.') || itemName.startsWith('_')) return false;
    
    // Must have either index.html or README.md
    const hasIndex = fs.existsSync(path.join(itemPath, 'index.html'));
    const hasReadme = fs.existsSync(path.join(itemPath, 'README.md'));
    
    return hasIndex || hasReadme;
  }

  /**
   * Analyze a project directory and extract metadata
   */
  analyzeProject(projectPath, projectName) {
    const project = {
      id: projectName,
      title: this.formatTitle(projectName),
      directory: projectName,
      status: 'discovered',
      hasIndex: fs.existsSync(path.join(projectPath, 'index.html')),
      hasReadme: fs.existsSync(path.join(projectPath, 'README.md')),
      hasThumbnail: false,
      files: [],
      technologies: [],
      category: 'Experiments',
      description: '',
      link: projectName
    };

    // Check for thumbnail
    const thumbnailPath = path.join(this.rootDir, 'images', `${projectName}_thumb.png`);
    if (fs.existsSync(thumbnailPath)) {
      project.hasThumbnail = true;
      project.thumbnail = `images/${projectName}_thumb.png`;
    }

    // Read README.md if it exists
    if (project.hasReadme) {
      const readmeContent = fs.readFileSync(path.join(projectPath, 'README.md'), 'utf8');
      const metadata = this.parseReadme(readmeContent);
      Object.assign(project, metadata);
    }

    // Scan files to detect technologies
    project.files = this.scanProjectFiles(projectPath);
    project.technologies = this.detectTechnologies(project.files);

    // Determine project status
    project.status = this.determineStatus(project);

    return project;
  }

  /**
   * Parse README.md for metadata
   */
  parseReadme(content) {
    const metadata = {};
    
    // Extract title from first heading
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      metadata.title = titleMatch[1];
    }

    // Extract description (first paragraph after title)
    const lines = content.split('\n');
    let descStart = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() && !lines[i].startsWith('#')) {
        descStart = i;
        break;
      }
    }
    
    if (descStart >= 0) {
      let description = '';
      for (let i = descStart; i < lines.length; i++) {
        if (lines[i].trim() === '' || lines[i].startsWith('#')) break;
        description += lines[i] + ' ';
      }
      metadata.description = description.trim();
    }

    // Extract category from markdown
    const categoryMatch = content.match(/category:\s*(.+)/i);
    if (categoryMatch) {
      metadata.category = categoryMatch[1].trim();
    }

    // Extract technologies from markdown
    const techMatch = content.match(/technologies?:\s*(.+)/i);
    if (techMatch) {
      metadata.technologies = techMatch[1].split(',').map(t => t.trim());
    }

    return metadata;
  }

  /**
   * Scan project files
   */
  scanProjectFiles(projectPath) {
    const files = [];
    try {
      const items = fs.readdirSync(projectPath);
      for (const item of items) {
        const itemPath = path.join(projectPath, item);
        if (fs.statSync(itemPath).isFile()) {
          files.push(item);
        }
      }
    } catch (error) {
      console.warn(`⚠️  Could not scan files in ${projectPath}`);
    }
    return files;
  }

  /**
   * Detect technologies based on file extensions
   */
  detectTechnologies(files) {
    const tech = new Set();
    
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      const name = path.basename(file, ext).toLowerCase();
      
      switch (ext) {
        case '.js': tech.add('JavaScript'); break;
        case '.ts': tech.add('TypeScript'); break;
        case '.html': tech.add('HTML'); break;
        case '.css': tech.add('CSS'); break;
        case '.py': tech.add('Python'); break;
        case '.php': tech.add('PHP'); break;
        case '.json': 
          if (name === 'package') tech.add('Node.js');
          break;
      }
      
      // Check for specific libraries/frameworks
      if (file.includes('three') || file.includes('Three')) tech.add('Three.js');
      if (file.includes('d3') || file.includes('D3')) tech.add('D3.js');
      if (file.includes('chart') || file.includes('Chart')) tech.add('Chart.js');
    }
    
    return Array.from(tech);
  }

  /**
   * Determine project status
   */
  determineStatus(project) {
    if (!project.hasIndex) return 'incomplete';
    if (!project.hasReadme) return 'needs-docs';
    if (!project.hasThumbnail) return 'needs-thumbnail';
    if (!project.description) return 'needs-description';
    return 'ready';
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
   * Load existing projects.json
   */
  loadExistingProjects() {
    try {
      const content = fs.readFileSync(this.projectsFile, 'utf8');
      const data = JSON.parse(content);
      return data.projects || [];
    } catch (error) {
      console.warn('⚠️  Could not load existing projects.json');
      return [];
    }
  }

  /**
   * Merge discovered projects with existing data
   */
  mergeProjects(discovered, existing) {
    const merged = [];
    const existingMap = new Map(existing.map(p => [p.id || p.directory, p]));

    for (const project of discovered) {
      const existing = existingMap.get(project.id);
      if (existing) {
        // Merge with existing, keeping manual edits
        merged.push({
          ...project,
          ...existing,
          // Always update these from scan
          hasIndex: project.hasIndex,
          hasReadme: project.hasReadme,
          hasThumbnail: project.hasThumbnail,
          files: project.files,
          status: project.status,
          technologies: project.technologies.length > 0 ? project.technologies : existing.technologies || []
        });
      } else {
        merged.push(project);
      }
    }

    return merged.sort((a, b) => (a.title || a.id).localeCompare(b.title || b.id));
  }

  /**
   * Generate updated projects.json
   */
  updateProjectsJson(projects) {
    const data = {
      lastUpdated: new Date().toISOString(),
      totalProjects: projects.length,
      summary: this.generateSummary(projects),
      projects: projects
    };

    fs.writeFileSync(this.projectsFile, JSON.stringify(data, null, 2));
    console.log(`✅ Updated ${this.projectsFile}`);
  }

  /**
   * Generate summary statistics
   */
  generateSummary(projects) {
    const summary = {
      byStatus: {},
      byCategory: {},
      byTechnology: {}
    };

    for (const project of projects) {
      // Count by status
      summary.byStatus[project.status] = (summary.byStatus[project.status] || 0) + 1;
      
      // Count by category
      summary.byCategory[project.category] = (summary.byCategory[project.category] || 0) + 1;
      
      // Count by technology
      for (const tech of project.technologies || []) {
        summary.byTechnology[tech] = (summary.byTechnology[tech] || 0) + 1;
      }
    }

    return summary;
  }

  /**
   * Run the complete portfolio scan and update
   */
  run() {
    console.log('🚀 Portfolio Manager Starting...');
    
    const discovered = this.scanProjects();
    const existing = this.loadExistingProjects();
    const merged = this.mergeProjects(discovered, existing);
    
    this.updateProjectsJson(merged);
    
    console.log('\n📊 Summary:');
    console.log(`Total projects: ${merged.length}`);
    
    const statusCounts = {};
    merged.forEach(p => {
      statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
    });
    
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
    
    console.log('\n✨ Portfolio scan complete!');
  }
}

// CLI execution
if (require.main === module) {
  const manager = new PortfolioManager();
  manager.run();
}

module.exports = PortfolioManager;