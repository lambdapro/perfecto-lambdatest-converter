

// convert-cli.js - Command line interface for Perfecto to Appium conversion

const fs = require('fs');
const path = require('path');
const converterService = require('./converter-service');

// Parse command line arguments
const args = process.argv.slice(2);

// Show help if no arguments or help flag
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log('Perfecto to Appium Converter CLI');
  console.log('--------------------------------');
  console.log('Usage:');
  console.log('  node convert-cli.js <command> [options]');
  console.log('');
  console.log('Commands:');
  console.log('  file <inputPath> [outputPath]    Convert a single file');
  console.log('  folder <folderPath>              Convert an entire folder');
  console.log('');
  console.log('Examples:');
  console.log('  node convert-cli.js file ./myScript.java ./converted.java');
  console.log('  node convert-cli.js folder ./myProject');
  process.exit(0);
}

// Get command
const command = args[0];

// Execute command
switch (command) {
  case 'file':
    convertFile(args[1], args[2]);
    break;
  case 'folder':
    convertFolder(args[1]);
    break;
  default:
    console.error(`Unknown command: ${command}`);
    console.log('Run "node convert-cli.js --help" for usage information');
    process.exit(1);
}

/**
 * Convert a single file
 * @param {string} inputPath - Path to the input file
 * @param {string} outputPath - Path to the output file (optional)
 */
function convertFile(inputPath, outputPath) {
  // Validate input path
  if (!inputPath) {
    console.error('Input file path is required');
    process.exit(1);
  }

  // Set default output path if not provided
  if (!outputPath) {
    const parsedPath = path.parse(inputPath);
    outputPath = path.join(parsedPath.dir, `converted_${parsedPath.base}`);
  }

  try {
    // Convert the file
    console.log(`Converting file: ${inputPath}`);
    console.log(`Output file: ${outputPath}`);
    
    const success = converterService.convertFile(inputPath, outputPath);
    
    if (success) {
      console.log(`\nConversion successful! The converted file is available at: ${outputPath}`);
    } else {
      console.error('\nConversion failed.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

/**
 * Convert a folder
 * @param {string} folderPath - Path to the folder to convert
 */
function convertFolder(folderPath) {
  // Validate folder path
  if (!folderPath) {
    console.error('Folder path is required');
    process.exit(1);
  }

  try {
    // Convert the folder
    console.log(`Converting folder: ${folderPath}`);
    
    const outputPath = converterService.convertFolder(folderPath);
    
    console.log(`\nConversion successful! The converted files are available at: ${outputPath}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}