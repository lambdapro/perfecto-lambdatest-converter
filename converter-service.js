// converter-service.js
// This file contains the file processing and conversion service

const fs = require('fs');
const path = require('path');
const conversionRules = require('./conversion-rules');

/**
 * Main function to convert a folder of Perfecto files to Appium
 * @param {string} inputFolderPath - The path to the input folder
 * @param {Object} options - Conversion options
 * @returns {string} - Path to the output folder
 */
function convertFolder(inputFolderPath, options = {}) {
  // Validate input folder exists
  if (!fs.existsSync(inputFolderPath)) {
    throw new Error(`Input folder does not exist: ${inputFolderPath}`);
  }

  // Get folder information
  const folderStats = fs.statSync(inputFolderPath);
  if (!folderStats.isDirectory()) {
    throw new Error(`Input path is not a directory: ${inputFolderPath}`);
  }

  // Create output folder name
  const folderName = path.basename(inputFolderPath);
  const parentDir = path.dirname(inputFolderPath);
  const outputFolderPath = path.join(parentDir, `converted_${folderName}`);

  // Create output folder
  if (fs.existsSync(outputFolderPath)) {
    console.log(`Output folder already exists: ${outputFolderPath}`);
    console.log('Cleaning existing output folder...');
    cleanDirectory(outputFolderPath);
  } else {
    fs.mkdirSync(outputFolderPath, { recursive: true });
  }

  // Process all files in the folder
  console.log(`Converting files from ${inputFolderPath} to ${outputFolderPath}...`);
  processFolder(inputFolderPath, outputFolderPath);
  
  console.log('Conversion completed!');
  console.log(`Output folder: ${outputFolderPath}`);
  
  return outputFolderPath;
}

/**
 * Recursively process all files in a folder
 * @param {string} inputFolderPath - Path to input folder
 * @param {string} outputFolderPath - Path to output folder
 */
function processFolder(inputFolderPath, outputFolderPath) {
  // Read all items in the current directory
  const items = fs.readdirSync(inputFolderPath);
  let filesProcessed = 0;
  let foldersProcessed = 0;
  
  // Process each item
  items.forEach(item => {
    const inputItemPath = path.join(inputFolderPath, item);
    const outputItemPath = path.join(outputFolderPath, item);
    const stats = fs.statSync(inputItemPath);
    
    if (stats.isDirectory()) {
      // Create the same directory structure in the output
      fs.mkdirSync(outputItemPath, { recursive: true });
      // Recursively process subdirectory
      processFolder(inputItemPath, outputItemPath);
      foldersProcessed++;
    } else {
      // Process file if it's a text file (potential code file)
      processFile(inputItemPath, outputItemPath);
      filesProcessed++;
    }
  });
  
  console.log(`Processed ${filesProcessed} files and ${foldersProcessed} folders in ${path.basename(inputFolderPath)}`);
}

/**
 * Process a single file for conversion
 * @param {string} inputFilePath - Path to input file
 * @param {string} outputFilePath - Path to output file
 */
function processFile(inputFilePath, outputFilePath) {
  const extension = path.extname(inputFilePath).toLowerCase();
  
  // Only process text-based files that might contain code
  const codeExtensions = ['.java', '.js', '.ts', '.txt', '.py', '.html', '.xml', '.json', '.cs', '.kt'];
  
  if (codeExtensions.includes(extension)) {
    try {
      // Read file content
      const content = fs.readFileSync(inputFilePath, 'utf8');
      
      // Convert Perfecto to Appium
      const convertedContent = conversionRules.convertPerfectoToAppium(content);
      
      // Write the converted content
      fs.writeFileSync(outputFilePath, convertedContent);
      console.log(`Converted: ${inputFilePath}`);
    } catch (error) {
      console.error(`Error converting file ${inputFilePath}:`, error);
      // For files that cannot be processed, just copy them as-is
      fs.copyFileSync(inputFilePath, outputFilePath);
    }
  } else {
    // For non-code files, just copy them as-is
    fs.copyFileSync(inputFilePath, outputFilePath);
    console.log(`Copied: ${inputFilePath} (not a code file)`);
  }
}

/**
 * Convert a single file from Perfecto to Appium
 * @param {string} inputFilePath - Path to the input file
 * @param {string} outputFilePath - Path to the output file
 * @returns {boolean} - True if conversion succeeded
 */
function convertFile(inputFilePath, outputFilePath) {
  try {
    // Validate input file exists
    if (!fs.existsSync(inputFilePath)) {
      throw new Error(`Input file does not exist: ${inputFilePath}`);
    }
    
    // Read file content
    const content = fs.readFileSync(inputFilePath, 'utf8');
    
    // Convert content
    const convertedContent = conversionRules.convertPerfectoToAppium(content);
    
    // Write converted content to output file
    fs.writeFileSync(outputFilePath, convertedContent);
    
    return true;
  } catch (error) {
    console.error(`Error converting file ${inputFilePath}:`, error);
    return false;
  }
}

/**
 * Clean a directory by removing all its contents
 * @param {string} dirPath - Directory to clean
 */
function cleanDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }
  
  const items = fs.readdirSync(dirPath);
  
  items.forEach(item => {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      cleanDirectory(itemPath);
      fs.rmdirSync(itemPath);
    } else {
      fs.unlinkSync(itemPath);
    }
  });
}

module.exports = {
  convertFolder,
  processFolder,
  processFile,
  convertFile,
  cleanDirectory
};