// server.js - MCP server with external conversion rules

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { createServer } = require('http');
const converterService = require('./converter-service');
const conversionRules = require('./conversion-rules');

// Initialize express app
const app = express();
const port = 3001; // Changed to 3001 to avoid conflict

// Create HTTP server
const httpServer = createServer(app);

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Ensure output directory exists
if (!fs.existsSync('output')) {
  fs.mkdirSync('output');
}

// Serve static files from the public directory
app.use(express.static('public'));

// Add middleware for parsing JSON
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Endpoint to add a new conversion rule
app.post('/api/rules/add', (req, res) => {
  try {
    const { pattern, replacement } = req.body;
    
    if (!pattern || !replacement) {
      return res.status(400).json({ 
        error: 'Invalid rule format', 
        message: 'Both pattern and replacement are required' 
      });
    }
    
    // Convert string pattern to RegExp
    const regexPattern = new RegExp(pattern, 'g');
    
    // Add the new rule
    conversionRules.addConversionRule({
      pattern: regexPattern,
      replacement: replacement
    });
    
    res.json({ 
      status: 'success', 
      message: 'Rule added successfully' 
    });
  } catch (error) {
    console.error('Error adding conversion rule:', error);
    res.status(500).json({ 
      error: 'Error adding conversion rule',
      details: error.message || String(error)
    });
  }
});

// File conversion endpoint
app.post('/api/convert', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const inputPath = req.file.path;
  const outputPath = path.join('output', req.file.originalname);
  
  try {
    // Convert the file
    const success = converterService.convertFile(inputPath, outputPath);
    
    if (!success) {
      return res.status(500).json({ error: 'Error during file conversion' });
    }
    
    // Send the converted file for download
    res.download(outputPath, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        return res.status(500).json({ error: 'Error downloading converted file' });
      }
    });
  } catch (error) {
    console.error('Error during conversion:', error);
    res.status(500).json({ 
      error: 'Error during file conversion',
      details: error.message || String(error)
    });
  }
});

// For backward compatibility with the original server
app.post('/convert', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const inputPath = req.file.path;
  const outputPath = path.join('output', req.file.originalname);
  
  try {
    // Convert the file
    const success = converterService.convertFile(inputPath, outputPath);
    
    if (!success) {
      return res.status(500).send('Error during file conversion');
    }
    
    // Send the converted file for download
    res.download(outputPath, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        return res.status(500).send('Error downloading converted file');
      }
    });
  } catch (error) {
    console.error('Error during conversion:', error);
    res.status(500).send('Error during file conversion');
  }
});

// Folder conversion endpoint
app.post('/api/convert-folder', (req, res) => {
  const { folderPath } = req.body;
  
  if (!folderPath) {
    return res.status(400).json({ error: 'No folder path provided' });
  }
  
  try {
    // Convert the folder using the convertFolder function
    const outputFolderPath = converterService.convertFolder(folderPath);
    
    res.json({ 
      status: 'success', 
      message: 'Folder converted successfully',
      outputPath: outputFolderPath
    });
  } catch (error) {
    console.error('Error during folder conversion:', error);
    res.status(500).json({ 
      error: 'Error during folder conversion',
      details: error.message || String(error)
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`MCP server listening at http://localhost:${port}`);
  console.log(`- Access the UI at http://localhost:${port}`);
  console.log(`- Health check at http://localhost:${port}/api/health`);
  console.log(`- Convert files at http://localhost:${port}/api/convert`);
  console.log(`- Convert folders at http://localhost:${port}/api/convert-folder`);
  console.log(`- Add rules at http://localhost:${port}/api/rules/add`);
});