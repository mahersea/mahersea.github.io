#!/usr/bin/env node

/**
 * README Setup Helper
 * Creates README.md files for projects that don't have them
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class ReadmeSetup {
  constructor() {
    this.rootDir = process.cwd();
    this.templatePath = path.join(this.rootDir, 'project-template.md');
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async setupReadme(projectDir) {
    const projectPath = path.join(this.rootDir, projectDir);
    const readmePath = path.join(projectPath, 'README.md');
    
    console.log(`\n📝 Setting up README for: ${projectDir}`);
    
    if (fs.existsSync(readmePath)) {
      console.log('✅ README.md already exists');
      return;
    }

    // Read template
    const template = fs.readFileSync(this.templatePath, 'utf8');
    
    // Get project info from user
    const title = await this.ask(`Project title [${this.formatTitle(projectDir)}]: `) || this.formatTitle(projectDir);
    const description = await this.ask('Brief description: ');
    const category = await this.ask('Category (Games/Visualizations/Tools/etc): ') || 'Experiments';
    const technologies = await this.ask('Technologies (comma-separated): ') || 'HTML, CSS, JavaScript';
    
    // Replace template placeholders
    let content = template
      .replace('# Project Title', `# ${title}`)
      .replace('Brief one-line description of what this project does.', description || 'Interactive web application.')
      .replace('[Additional libraries/frameworks used]', technologies)
      .replace('Choose one: Small Games | Medium Sized Games | Visualizations | Mathematical Expressions | Web Tools | Tools | Learning | Experiments', category);

    // Write README
    fs.writeFileSync(readmePath, content);
    console.log(`✅ Created README.md for ${projectDir}`);
  }

  async ask(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  formatTitle(name) {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async findProjectsNeedingReadme() {
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
      const hasReadme = fs.existsSync(path.join(itemPath, 'README.md'));
      
      if (hasIndex && !hasReadme) {
        projects.push(item);
      }
    }

    return projects;
  }

  async run() {
    console.log('🚀 README Setup Helper');
    
    const projects = await this.findProjectsNeedingReadme();
    console.log(`\nFound ${projects.length} projects without README.md:`);
    
    for (const project of projects) {
      console.log(`  - ${project}`);
    }

    if (projects.length === 0) {
      console.log('✅ All projects already have README files!');
      this.rl.close();
      return;
    }

    const setupAll = await this.ask('\nSetup README for all projects? (y/n): ');
    
    if (setupAll.toLowerCase() === 'y') {
      for (const project of projects) {
        await this.setupReadme(project);
      }
    } else {
      const selected = await this.ask('Enter project name to setup (or "exit"): ');
      if (selected !== 'exit' && projects.includes(selected)) {
        await this.setupReadme(selected);
      }
    }
    
    this.rl.close();
    console.log('\n✨ Setup complete!');
  }
}

// CLI execution
if (require.main === module) {
  const setup = new ReadmeSetup();
  setup.run().catch(console.error);
}

module.exports = ReadmeSetup;