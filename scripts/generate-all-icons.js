const playwright = require('playwright');
const fs = require('fs');
const path = require('path');

async function run() {
  console.log('Launching browser to render all icons from logo.png...');
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  
  const logoPath = path.join(process.cwd(), 'public', 'logo.png');
  if (!fs.existsSync(logoPath)) {
    throw new Error(`Logo file not found at ${logoPath}`);
  }
  
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');
  const logoDataUrl = `data:image/png;base64,${logoBase64}`;
  
  // Helper to render PNG buffer via browser screenshot
  async function renderPngBuffer(width, height, isTransparent, dataUrl, filter = '') {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: ${isTransparent ? 'transparent' : '#ffffff'};
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${width}px;
            height: ${height}px;
          }
          img {
            max-width: ${isTransparent ? '100%' : '85%'};
            max-height: ${isTransparent ? '100%' : '85%'};
            object-fit: contain;
            ${filter ? `filter: ${filter};` : ''}
          }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" />
      </body>
      </html>
    `;
    
    await page.setContent(htmlContent);
    await page.setViewportSize({ width, height });
    return await page.screenshot({
      omitBackground: isTransparent,
    });
  }

  // 1. Render 48x48 PNG (transparent background) for favicon-48x48.png
  console.log('Generating favicon-48x48.png...');
  const favicon48Buffer = await renderPngBuffer(48, 48, true, logoDataUrl);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon-48x48.png'), favicon48Buffer);
  
  // Also write to public/favicon.ico and src/app/favicon.ico
  console.log('Writing favicon.ico files...');
  fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon.ico'), favicon48Buffer);
  fs.writeFileSync(path.join(process.cwd(), 'src', 'app', 'favicon.ico'), favicon48Buffer);

  // 2. Render 180x180 PNG (Apple Touch Icon)
  console.log('Generating apple-touch-icon.png...');
  const appleBuffer = await renderPngBuffer(180, 180, false, logoDataUrl);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'apple-touch-icon.png'), appleBuffer);

  // 3. Render 512x512 PNG to embed in icon.svg and safari-pinned-tab.svg
  console.log('Generating transparent 512x512 PNG for SVGs...');
  const png512Buffer = await renderPngBuffer(512, 512, true, logoDataUrl);
  const base64_512 = png512Buffer.toString('base64');
  const embeddedDataUrl = `data:image/png;base64,${base64_512}`;
  
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image href="${embeddedDataUrl}" x="0" y="0" width="512" height="512"/>
</svg>
`;

  console.log('Writing public/icon.svg and public/safari-pinned-tab.svg...');
  fs.writeFileSync(path.join(process.cwd(), 'public', 'icon.svg'), svgContent);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'safari-pinned-tab.svg'), svgContent);

  // 4. Generate dark mode SVG (icon-dark.svg) from the light logo (logo-dark.png)
  const logoDarkPath = path.join(process.cwd(), 'public', 'logo-dark.png');
  let darkDataUrl = logoDataUrl;
  if (fs.existsSync(logoDarkPath)) {
    console.log('Found logo-dark.png, using it for icon-dark.svg...');
    const darkBase64 = fs.readFileSync(logoDarkPath).toString('base64');
    darkDataUrl = `data:image/png;base64,${darkBase64}`;
  }
  
  console.log('Generating transparent 512x512 PNG for dark mode SVG...');
  const png512DarkBuffer = await renderPngBuffer(512, 512, true, darkDataUrl);
  const base64_512_dark = png512DarkBuffer.toString('base64');
  const embeddedDarkDataUrl = `data:image/png;base64,${base64_512_dark}`;
  
  const svgDarkContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image href="${embeddedDarkDataUrl}" x="0" y="0" width="512" height="512"/>
</svg>
`;

  console.log('Writing public/icon-dark.svg...');
  fs.writeFileSync(path.join(process.cwd(), 'public', 'icon-dark.svg'), svgDarkContent);

  await browser.close();
  console.log('All icons and SVGs generated successfully!');
}

run().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
