const playwright = require('playwright');
const fs = require('fs');
const path = require('path');

async function run() {
  console.log('Launching browser to render icons from logo.png...');
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  
  const logoPath = path.join(process.cwd(), 'public', 'logo.png');
  if (!fs.existsSync(logoPath)) {
    throw new Error(`Logo file not found at ${logoPath}`);
  }
  
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');
  const logoDataUrl = `data:image/png;base64,${logoBase64}`;
  
  // Render 48x48 PNG (transparent background)
  const faviconHtmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
        }
        img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
      </style>
    </head>
    <body>
      <img src="${logoDataUrl}" />
    </body>
    </html>
  `;
  
  await page.setContent(faviconHtmlContent);
  await page.setViewportSize({ width: 48, height: 48 });
  await page.screenshot({
    path: path.join(process.cwd(), 'public', 'favicon-48x48.png'),
    omitBackground: true,
  });
  console.log('Successfully generated public/favicon-48x48.png');
  
  // Render 180x180 PNG (Apple Touch Icon - white background for contrast)
  const appleHtmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 180px;
          height: 180px;
        }
        img {
          max-width: 85%;
          max-height: 85%;
          object-fit: contain;
        }
      </style>
    </head>
    <body>
      <img src="${logoDataUrl}" />
    </body>
    </html>
  `;
  
  await page.setContent(appleHtmlContent);
  await page.setViewportSize({ width: 180, height: 180 });
  await page.screenshot({
    path: path.join(process.cwd(), 'public', 'apple-touch-icon.png'),
    omitBackground: false,
  });
  console.log('Successfully generated public/apple-touch-icon.png');
  
  await browser.close();
  console.log('Icons generation from logo.png completed successfully!');
}

run().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
