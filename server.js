const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));

// Function to extract topic tags from README content
async function extractTopicTags(readmeContent) {
  // Look for a "## Topics" or "### Topics" section
  const topicsMatch = readmeContent.match(/##\s*Topics\s*\n([\s\S]*?)(\n##|\n###|$)/);
  
  if (topicsMatch && topicsMatch[1]) {
    // Extract hashtags from the topics section
    const tagsText = topicsMatch[1].trim();
    const tags = tagsText.match(/#[\w-]+/g) || [];
    
    // Remove the # prefix and return the tag names
    return tags.map(tag => tag.substring(1));
  }
  
  return [];
}

// Function to load and parse the topics.json file
async function loadTopicsData() {
  try {
    const topicsContent = await fs.readFile(path.join(__dirname, 'topics.json'), 'utf8');
    return JSON.parse(topicsContent);
  } catch (err) {
    console.error('Error loading topics.json:', err);
    return { topics: [] };
  }
}

// API endpoint to get all directories that contain a README.md file
app.get('/api/directories', async (req, res) => {
  try {
    // Get all directories in the current path (excluding node_modules, hidden files, etc.)
    const entries = await fs.readdir(__dirname, { withFileTypes: true });
    const directories = entries
      .filter(entry => entry.isDirectory())
      .filter(dir => !dir.name.startsWith('.') && 
                     dir.name !== 'node_modules' &&
                     dir.name !== '_layouts' &&
                     dir.name !== '_posts' &&
                     dir.name !== 'css' &&
                     dir.name !== 'images');

    // Load topics mapping data
    const topicsData = await loadTopicsData();
    const topicsMap = {};
    
    // Create a map of topic ID to icon for easier lookup
    topicsData.topics.forEach(topic => {
      topicsMap[topic.id] = {
        name: topic.name,
        icon: topic.icon
      };
    });

    // Check each directory for a README.md file
    const directoriesWithReadme = [];
    
    for (const dir of directories) {
      try {
        const dirPath = path.join(__dirname, dir.name);
        const files = await fs.readdir(dirPath);
        
        if (files.includes('README.md')) {
          // This directory has a README.md file
          const readmePath = path.join(dirPath, 'README.md');
          const readmeContent = await fs.readFile(readmePath, 'utf8');
          
          // Extract the title (first heading)
          const firstLine = readmeContent.split('\n')[0].replace(/^#\s*/, '').trim();
          const title = firstLine || formatDirectoryName(dir.name);
          
          // Extract topic tags from README
          const topicTags = await extractTopicTags(readmeContent);
          
          // Map topic tags to their icons
          const topicIcons = topicTags
            .map(tag => {
              // Try exact match first
              if (topicsMap[tag]) {
                return topicsMap[tag].icon;
              }
              
              // Try variations (singular/plural forms, etc.)
              const singularForm = tag.replace(/s$/, '');
              if (topicsMap[singularForm]) {
                return topicsMap[singularForm].icon;
              }
              
              return null;
            })
            .filter(icon => icon !== null);
          
          directoriesWithReadme.push({
            path: dir.name,
            title: title,
            topicTags: topicTags,
            topics: topicTags, // Add this field for the filter to work
            topicIcons: topicIcons
          });
        }
      } catch (err) {
        console.error(`Error processing directory ${dir.name}:`, err);
      }
    }
    
    res.json({ directories: directoriesWithReadme });
  } catch (err) {
    console.error('Error reading directories:', err);
    res.status(500).json({ error: 'Failed to read directories' });
  }
});

// Helper function to format directory names as titles
function formatDirectoryName(dirName) {
  return dirName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Start the server
const PORT = 8082; // Changed port to avoid conflicts
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});