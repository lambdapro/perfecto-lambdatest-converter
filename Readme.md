# Perfecto to Appium Converter CLI

A command-line tool for converting Perfecto Mobile code to Appium code. This tool allows you to convert single files or entire project folders with a simple command.

## Features

- Convert individual files from Perfecto to Appium
- Process entire directories while maintaining folder structure
- User-friendly command-line interface
- Uses the same conversion rules as the web server
- No need to run a web server for quick conversions

## Installation

1. Ensure you have the required files in your project:
   - `conversion-rules.js`
   - `converter-service.js`
   - `convert-cli.js`

2. Make sure you have Node.js installed (version 12 or higher recommended)

3. Install dependencies:
   ```bash
   npm install
   ```

4. (Optional) Make the CLI tool executable (Unix-based systems only):
   ```bash
   chmod +x convert-cli.js
   ```

## Usage

### Basic Usage

```bash
node convert-cli.js <command> [options]
```

### Available Commands

- `file`: Convert a single file
- `folder`: Convert an entire folder/project

### Examples

**Converting a single file:**
```bash
node convert-cli.js file /path/to/your/PerfectoScript.java
```

This will create a converted file at `/path/to/your/converted_PerfectoScript.java`

**Specifying output location for a file:**
```bash
node convert-cli.js file /path/to/your/PerfectoScript.java /path/to/output/AppiumScript.java
```

**Converting an entire folder/project:**
```bash
node convert-cli.js folder /path/to/your/project
```

This will create a new folder at `/path/to/converted_project` with all files converted

### Getting Help

```bash
node convert-cli.js --help
```
or
```bash
node convert-cli.js -h
```

## Supported File Types

The converter automatically processes these file types:
- `.java`: Java source files
- `.js`: JavaScript files
- `.ts`: TypeScript files
- `.txt`: Text files containing code
- `.py`: Python files
- `.html`: HTML files
- `.xml`: XML files
- `.json`: JSON files
- `.cs`: C# files
- `.kt`: Kotlin files

Other file types are copied as-is without modification.

## Conversion Examples

### Perfecto to Appium Conversion Examples

| Perfecto Code | Appium Code |
|---------------|-------------|
| `driver.findElement(PerfectoMobileBy.text("Login")).click()` | `driver.findElement(By.xpath("//*[@text='Login']")).click()` |
| `driver.executeScript("mobile:touch:swipe", {"start": {"x": 100, "y": 300}, "end": {"x": 500, "y": 300}})` | `new TouchAction(driver).press({x: 100, y: 300}).moveTo({x: 500, y: 300}).release().perform()` |
| `driver.executeScript("mobile:application:open", {"name": "com.example.app"})` | `driver.activateApp("com.example.app")` |

## Advanced Usage

### Adding to Your PATH (Unix-based systems)

To call the CLI tool from anywhere, you can:

1. Make it executable:
   ```bash
   chmod +x /path/to/convert-cli.js
   ```

2. Create a symbolic link in a directory that's in your PATH:
   ```bash
   ln -s /path/to/convert-cli.js /usr/local/bin/perfecto2appium
   ```

3. Then use it anywhere with:
   ```bash
   perfecto2appium file myScript.java
   ```

### Using in Scripts

You can call the CLI tool from shell scripts to batch process multiple files or folders:

```bash
#!/bin/bash
# Example batch processing script

# Convert multiple files
node /path/to/convert-cli.js file file1.java
node /path/to/convert-cli.js file file2.java

# Convert multiple projects
node /path/to/convert-cli.js folder project1
node /path/to/convert-cli.js folder project2
```

## Troubleshooting

### Common Issues

1. **"Module not found" error**:
   - Make sure all required JavaScript files are in the same directory
   - Check that your current working directory is correct

2. **"Cannot read property of undefined" errors**:
   - Usually indicates a circular dependency issue
   - Make sure you're using the fixed versions of all the modules

3. **Permission denied when running the tool**:
   - If you've made the file executable with `chmod +x`, make sure to run it with `./convert-cli.js`
   - Otherwise, use `node convert-cli.js`

4. **No files processed**:
   - Double-check the path to your files or folder
   - Ensure the files have the supported extensions listed above

### Getting More Information

For more detailed logs, you can set the NODE_DEBUG environment variable:

```bash
NODE_DEBUG=* node convert-cli.js file yourScript.java
```

## License

MIT