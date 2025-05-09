// conversion-rules.js
// This file contains all the conversion rules for transforming Perfecto commands to Appium commands

// Store the rules in a module variable
const conversionRules = [
    // Device initialization
    {
      pattern: /PerfectoMobileDriver\s*\(\s*\"([^\"]+)\"\s*,\s*\"([^\"]+)\"\s*\)/g,
      replacement: 'AppiumDriver(new URL("$1"), new DesiredCapabilities({\n  platformName: "$2",\n  automationName: "Appium"\n}))'
    },
    
    // Click operations
    {
      pattern: /driver\.findElement\(PerfectoMobileBy\.text\(\"([^\"]+)\"\)\)\.click\(\)/g,
      replacement: 'driver.findElement(By.xpath("//*[@text=\'$1\']")).click()'
    },
    {
      pattern: /driver\.findElement\(PerfectoMobileBy\.name\(\"([^\"]+)\"\)\)\.click\(\)/g,
      replacement: 'driver.findElement(By.name("$1")).click()'
    },
    {
      pattern: /driver\.findElement\(PerfectoMobileBy\.id\(\"([^\"]+)\"\)\)\.click\(\)/g,
      replacement: 'driver.findElement(By.id("$1")).click()'
    },
    {
      pattern: /driver\.findElement\(PerfectoMobileBy\.xpath\(\"([^\"]+)\"\)\)\.click\(\)/g,
      replacement: 'driver.findElement(By.xpath("$1")).click()'
    },
    
    // Send keys operations
    {
      pattern: /driver\.findElement\(PerfectoMobileBy\.name\(\"([^\"]+)\"\)\)\.sendKeys\(\"([^\"]+)\"\)/g,
      replacement: 'driver.findElement(By.name("$1")).sendKeys("$2")'
    },
    {
      pattern: /driver\.findElement\(PerfectoMobileBy\.id\(\"([^\"]+)\"\)\)\.sendKeys\(\"([^\"]+)\"\)/g,
      replacement: 'driver.findElement(By.id("$1")).sendKeys("$2")'
    },
    {
      pattern: /driver\.findElement\(PerfectoMobileBy\.xpath\(\"([^\"]+)\"\)\)\.sendKeys\(\"([^\"]+)\"\)/g,
      replacement: 'driver.findElement(By.xpath("$1")).sendKeys("$2")'
    },
    
    // Wait operations
    {
      pattern: /driver\.wait\(PerfectoMobileConditions\.textPresent\(\"([^\"]+)\"\),\s*(\d+)\)/g,
      replacement: 'driver.wait(until.elementLocated(By.xpath("//*[contains(@text,\'$1\')]")), $2)'
    },
    {
      pattern: /driver\.wait\(PerfectoMobileConditions\.elementDisplayed\(([^)]+)\),\s*(\d+)\)/g,
      replacement: 'driver.wait(until.elementIsVisible($1), $2)'
    },
    {
      pattern: /driver\.wait\(PerfectoMobileConditions\.elementEnabled\(([^)]+)\),\s*(\d+)\)/g,
      replacement: 'driver.wait(until.elementIsEnabled($1), $2)'
    },
    
    // Swipe operations
    {
      pattern: /driver\.executeScript\(\"mobile:touch:swipe\",\s*\{\s*\"start\":\s*\{\s*\"x\":\s*(\d+),\s*\"y\":\s*(\d+)\s*\},\s*\"end\":\s*\{\s*\"x\":\s*(\d+),\s*\"y\":\s*(\d+)\s*\}\s*\}\)/g,
      replacement: 'new TouchAction(driver)\n  .press({x: $1, y: $2})\n  .moveTo({x: $3, y: $4})\n  .release()\n  .perform()'
    },
    {
      pattern: /driver\.executeScript\(\"mobile:swipe\",\s*\{\s*\"direction\":\s*\"([^\"]+)\"\s*\}\)/g,
      replacement: 'driver.executeScript("mobile: swipe", {"direction": "$1"})'
    },
    
    // Scroll operations
    {
      pattern: /driver\.executeScript\(\"mobile:scroll\",\s*\{\s*\"direction\":\s*\"([^\"]+)\"\s*\}\)/g,
      replacement: 'driver.executeScript("mobile: scroll", {"direction": "$1"})'
    },
    
    // Touch operations
    {
      pattern: /driver\.executeScript\(\"mobile:touch:tap\",\s*\{\s*\"x\":\s*(\d+),\s*\"y\":\s*(\d+)\s*\}\)/g,
      replacement: 'new TouchAction(driver)\n  .tap({x: $1, y: $2})\n  .perform()'
    },
    {
      pattern: /driver\.executeScript\(\"mobile:touch:longPress\",\s*\{\s*\"x\":\s*(\d+),\s*\"y\":\s*(\d+),\s*\"duration\":\s*(\d+)\s*\}\)/g,
      replacement: 'new TouchAction(driver)\n  .longPress({x: $1, y: $2, duration: $3})\n  .release()\n  .perform()'
    },
    {
      pattern: /driver\.executeScript\(\"mobile:touch:doubleTap\",\s*\{\s*\"x\":\s*(\d+),\s*\"y\":\s*(\d+)\s*\}\)/g,
      replacement: 'new TouchAction(driver)\n  .tap({x: $1, y: $2})\n  .wait(100)\n  .tap({x: $1, y: $2})\n  .perform()'
    },
    
    // Pinch and zoom
    {
      pattern: /driver\.executeScript\(\"mobile:pinch\",\s*\{\s*\"scale\":\s*([^,]+),\s*\"velocity\":\s*([^}]+)\s*\}\)/g,
      replacement: 'driver.executeScript("mobile: pinch", {"scale": $1, "velocity": $2})'
    },
    
    // Application management
    {
      pattern: /driver\.executeScript\(\"mobile:application:open\",\s*\{\s*\"name\":\s*\"([^\"]+)\"\s*\}\)/g,
      replacement: 'driver.activateApp("$1")'
    },
    {
      pattern: /driver\.executeScript\(\"mobile:application:close\",\s*\{\s*\"name\":\s*\"([^\"]+)\"\s*\}\)/g,
      replacement: 'driver.terminateApp("$1")'
    },
    {
      pattern: /driver\.executeScript\(\"mobile:application:install\",\s*\{\s*\"file\":\s*\"([^\"]+)\"\s*\}\)/g,
      replacement: 'driver.installApp("$1")'
    },
    {
      pattern: /driver\.executeScript\(\"mobile:application:uninstall\",\s*\{\s*\"name\":\s*\"([^\"]+)\"\s*\}\)/g,
      replacement: 'driver.removeApp("$1")'
    },
    {
      pattern: /driver\.executeScript\(\"mobile:application:reset\",\s*\{\s*\"name\":\s*\"([^\"]+)\"\s*\}\)/g,
      replacement: 'driver.resetApp()'
    },
    {
      pattern: /driver\.executeScript\(\"mobile:application:background\",\s*\{\s*\"seconds\":\s*(\d+)\s*\}\)/g,
      replacement: 'driver.runAppInBackground(Duration.ofSeconds($1))'
    },
    
    // Device commands
    {
      pattern: /driver\.executeScript\(\"mobile:handset:ready\"\)/g,
      replacement: 'driver.unlockDevice()'
    },
    {
      pattern: /driver\.executeScript\(\"mobile:pressKey\",\s*\{\s*\"key\":\s*\"([^\"]+)\"\s*\}\)/g,
      replacement: 'driver.pressKey(new KeyEvent($1))'
    },
    {
      pattern: /driver\.executeScript\(\"mobile:handset:lock\",\s*\{\s*\"seconds\":\s*(\d+)\s*\}\)/g,
      replacement: 'driver.lockDevice(Duration.ofSeconds($1))'
    },
    {
      pattern: /driver\.executeScript\(\"mobile:handset:reboot\"\)/g,
      replacement: 'driver.executeScript("mobile: shell", {"command": "reboot"})'
    },
    
    // Location operations
    {
      pattern: /driver\.executeScript\(\"mobile:location:set\",\s*\{\s*\"latitude\":\s*([^,]+),\s*\"longitude\":\s*([^,]+),\s*\"altitude\":\s*([^}]+)\s*\}\)/g,
      replacement: 'driver.setLocation(new Location($1, $2, $3))'
    },
    
    // Browser operations
    {
      pattern: /driver\.executeScript\(\"mobile:browser:open\",\s*\{\s*\"url\":\s*\"([^\"]+)\"\s*\}\)/g,
      replacement: 'driver.get("$1")'
    },
    
    // Screenshot
    {
      pattern: /driver\.executeScript\(\"mobile:screen:image\"\)/g,
      replacement: 'driver.getScreenshotAs(OutputType.FILE)'
    },
    
    // Visual operations
    {
      pattern: /driver\.executeScript\(\"mobile:image:find\",\s*\{\s*\"content\":\s*\"([^\"]+)\"\s*\}\)/g,
      replacement: 'driver.findElement(By.image("$1"))'
    },
    {
      pattern: /driver\.executeScript\(\"mobile:image:click\",\s*\{\s*\"content\":\s*\"([^\"]+)\"\s*\}\)/g,
      replacement: 'driver.findElement(By.image("$1")).click()'
    },
    {
      pattern: /driver\.executeScript\(\"mobile:text:find\",\s*\{\s*\"content\":\s*\"([^\"]+)\"\s*\}\)/g,
      replacement: 'driver.findElement(By.xpath("//*[contains(@text,\'$1\')]"))'
    },
    
    // Biometrics simulation
    {
      pattern: /driver\.executeScript\(\"mobile:fingerprint\",\s*\{\s*\"operation\":\s*\"([^\"]+)\"\s*\}\)/g,
      replacement: 'driver.executeScript("mobile: performBiometric", {"type": "$1"})'
    },
    
    // Network operations
    {
      pattern: /driver\.executeScript\(\"mobile:network:settings\",\s*\{\s*\"wifi\":\s*\"([^\"]+)\"\s*\}\)/g,
      replacement: 'driver.toggleWifi()'
    },
    
    // File operations
    {
      pattern: /driver\.executeScript\(\"mobile:file:download\",\s*\{\s*\"source\":\s*\"([^\"]+)\",\s*\"target\":\s*\"([^\"]+)\"\s*\}\)/g,
      replacement: 'driver.pullFile("$1")'
    },
    {
      pattern: /driver\.executeScript\(\"mobile:file:upload\",\s*\{\s*\"source\":\s*\"([^\"]+)\",\s*\"target\":\s*\"([^\"]+)\"\s*\}\)/g,
      replacement: 'driver.pushFile("$2", "$1")'
    },
    
    // Timer operations
    {
      pattern: /driver\.executeScript\(\"mobile:timer:start\",\s*\{\s*\"timerId\":\s*\"([^\"]+)\"\s*\}\)/g,
      replacement: '// Timer operations are not directly supported in Appium\n// Use JavaScript custom implementation instead\ndriver.executeScript("window.perfecto_timer_$1 = new Date().getTime();")'
    },
    {
      pattern: /driver\.executeScript\(\"mobile:timer:stop\",\s*\{\s*\"timerId\":\s*\"([^\"]+)\"\s*\}\)/g,
      replacement: '// Timer operations are not directly supported in Appium\n// Use JavaScript custom implementation instead\ndriver.executeScript("window.perfecto_timer_$1_end = new Date().getTime();")'
    },
    
    // Notifications
    {
      pattern: /driver\.executeScript\(\"mobile:notifications:open\"\)/g,
      replacement: 'driver.openNotifications()'
    },
    
    // Element verification
    {
      pattern: /driver\.findElement\(PerfectoMobileBy\.id\(\"([^\"]+)\"\)\)\.isDisplayed\(\)/g,
      replacement: 'driver.findElement(By.id("$1")).isDisplayed()'
    },
    {
      pattern: /driver\.findElement\(PerfectoMobileBy\.name\(\"([^\"]+)\"\)\)\.isDisplayed\(\)/g,
      replacement: 'driver.findElement(By.name("$1")).isDisplayed()'
    },
    {
      pattern: /driver\.findElement\(PerfectoMobileBy\.xpath\(\"([^\"]+)\"\)\)\.isDisplayed\(\)/g,
      replacement: 'driver.findElement(By.xpath("$1")).isDisplayed()'
    },
    
    // Element interaction extensions
    {
      pattern: /driver\.findElement\(PerfectoMobileBy\.text\(\"([^\"]+)\"\)\)\.getValue\(\)/g,
      replacement: 'driver.findElement(By.xpath("//*[@text=\'$1\']")).getText()'
    },
    {
      pattern: /driver\.findElement\(PerfectoMobileBy\.id\(\"([^\"]+)\"\)\)\.getValue\(\)/g,
      replacement: 'driver.findElement(By.id("$1")).getText()'
    },
    
    // General imports replacement
    {
      pattern: /import\s+com\.perfectomobile\..+;/g, 
      replacement: 'import io.appium.java_client.AppiumDriver;\n' +
      'import io.appium.java_client.TouchAction;\n' +
      'import io.appium.java_client.touch.WaitOptions;\n' +
      'import io.appium.java_client.touch.offset.PointOption;\n' +
      'import org.openqa.selenium.By;\n' +
      'import org.openqa.selenium.support.ui.WebDriverWait;\n' +
      'import org.openqa.selenium.support.ui.ExpectedConditions as until;\n' +
      'import org.openqa.selenium.remote.DesiredCapabilities;\n' +
      'import java.time.Duration;\n' +
      'import org.openqa.selenium.OutputType;'
    }
  ];
  
  /**
   * Get all conversion rules
   * @returns {Array} Array of conversion rule objects
   */
  function getConversionRules() {
    return conversionRules;
  }
  
  /**
   * Add a new conversion rule
   * @param {Object} rule - The rule to add with pattern and replacement properties
   * @returns {Array} - The updated rules array
   */
  function addConversionRule(rule) {
    if (!rule || !rule.pattern || !rule.replacement) {
      throw new Error('Invalid rule format. Rule must have pattern and replacement properties.');
    }
    
    // Add the new rule
    conversionRules.push(rule);
    
    return conversionRules;
  }
  
  /**
   * Convert Perfecto code to Appium code using the conversion rules
   * @param {string} content - The content with Perfecto commands
   * @returns {string} - The content with Appium commands
   */
  function convertPerfectoToAppium(content) {
    let convertedContent = content;
    
    // Apply all conversions
    conversionRules.forEach(rule => {
      convertedContent = convertedContent.replace(rule.pattern, rule.replacement);
    });
    
    return convertedContent;
  }
  
  module.exports = {
    getConversionRules,
    addConversionRule,
    convertPerfectoToAppium
  };