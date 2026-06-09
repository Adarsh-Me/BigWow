import { test } from "@playwright/test";

test("take screenshot of calculator page", async ({ page }) => {
  console.log("Navigating to /tools/calculator...");
  await page.goto("/tools/calculator");
  
  // Wait for fonts and content to fully render
  await page.waitForTimeout(2000);
  
  const screenshotPath = 'C:\\Users\\prabhat\\.gemini\\antigravity\\brain\\27d03a71-1680-4d2b-a6c4-15868f8b3614\\calculator_screenshot.png';
  console.log("Taking screenshot and saving to " + screenshotPath);
  await page.screenshot({ path: screenshotPath, fullPage: true });
});
