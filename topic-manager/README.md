# Topic Manager

A simple CRUD application for managing topic tags with detailed properties. This tool allows you to curate content through standardized topic tags with consistent icons.

## Features

- Create, read, update, and delete topic tags
- Manage topic properties including ID, name, description, and icon
- Store topics in a central JSON file for easy reference
- Simple and intuitive user interface
- Express.js backend for handling data operations

## Usage

1. Start the server:
   ```
   npm start
   ```
   
2. Open your browser and navigate to `http://localhost:3040`

3. Use the interface to manage your topics:
   - Click "Add New Topic" to create a new topic
   - Use the table to view existing topics
   - Click "Edit" on any topic to modify its properties
   - Click "Delete" to remove a topic

## Topic Structure

Each topic has the following properties:

- **ID**: A unique identifier for the topic (used for referencing)
- **Name**: The display name of the topic
- **Description**: A brief explanation of what the topic represents
- **Icon**: An emoji or character representation for visual identification

## Integration with Portfolio

The topics defined here can be used to tag and categorize projects in your portfolio, enabling filtering and organization of content.