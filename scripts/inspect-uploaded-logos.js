const playwright = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  
  const file1 = 'media__1781170644966.png';
  const file2 = 'media__1781170645021.png';
  const dir = 'C:\\Users\\prabhat\\.gemini\\antigravity-ide\\brain\\717bd18c-de3c-4657-a2b1-acf5db53a6d8';
  
  async function getBrightness(filename) {
    const filepath = path.join(dir, filename);
    const base64 = fs.readFileSync(filepath).toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;
    
    await page.setContent(`
      <html>
      <body>
        <canvas id="canvas"></canvas>
        <img id="img" src="${dataUrl}" />
      </body>
      </html>
    `);
    
    // wait for image to load
    await page.waitForFunction(() => {
      const img = document.getElementById('img');
      return img.complete && img.naturalWidth > 0;
    });
    
    const brightness = await page.evaluate(() => {
      const img = document.getElementById('img');
      const canvas = document.getElementById('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let totalR = 0, totalG = 0, totalB = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i+3];
        if (alpha > 50) { // only count non-transparent pixels
          totalR += data[i];
          totalG += data[i+1];
          totalB += data[i+2];
          count++;
        }
      }
      if (count === 0) return 0;
      return (totalR + totalG + totalB) / (3 * count); // average brightness (0-255)
    });
    
    return brightness;
  }
  
  const b1 = await getBrightness(file1);
  const b2 = await getBrightness(file2);
  console.log(`${file1} average brightness: ${b1}`);
  console.log(`${file2} average brightness: ${b2}`);
  
  if (b1 < b2) {
    console.log(`RESULT: ${file1} is the DARK logo (light theme).`);
    console.log(`RESULT: ${file2} is the LIGHT logo (dark theme).`);
  } else {
    console.log(`RESULT: ${file2} is the DARK logo (light theme).`);
    console.log(`RESULT: ${file1} is the LIGHT logo (dark theme).`);
  }
  
  await browser.close();
}

run().catch(err => console.error(err));
