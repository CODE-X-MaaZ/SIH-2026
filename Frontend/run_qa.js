const { chromium } = require('playwright');
const fs = require('fs');

const ROUTES = [
  '/',
  '/report?mode=text',
  '/report/review',
  '/report/success',
  '/track',
  '/track/ABC',
  '/admin',
  '/admin/incidents',
  '/admin/incidents/INC-WATER-001',
  '/admin/complaints',
  '/admin/hotspots',
  '/admin/resolution',
  '/admin/analytics'
];

const VIEWPORTS = [
  { width: 360, height: 800 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 }
];

(async () => {
  const browser = await chromium.launch();
  
  let totalErrors = 0;
  let allConsoleMsg = [];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: vp });
    
    for (const route of ROUTES) {
      const page = await context.newPage();
      
      page.on('console', msg => {
        if (msg.type() === 'error' || msg.type() === 'warning') {
            allConsoleMsg.push(`[${vp.width}x${vp.height}] ${route} -> ${msg.type()}: ${msg.text()}`);
        }
      });
      
      page.on('pageerror', error => {
         allConsoleMsg.push(`[${vp.width}x${vp.height}] ${route} -> Runtime Error: ${error.message}`);
         totalErrors++;
      });
      
      try {
        await page.goto(`http://localhost:3000${route}`, { waitUntil: 'load', timeout: 5000 });
        
        // Wait briefly for hydration
        await page.waitForTimeout(500);

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        
        if (overflow) {
          allConsoleMsg.push(`[${vp.width}x${vp.height}] ${route} -> OVERFLOW DETECTED`);
        }
      } catch (err) {
        allConsoleMsg.push(`[${vp.width}x${vp.height}] ${route} -> Failed to load: ${err.message}`);
      }
      
      await page.close();
    }
    
    await context.close();
  }
  
  await browser.close();
  
  fs.writeFileSync('qa_report.txt', allConsoleMsg.join('\n'));
  console.log("QA audit done. Results in qa_report.txt. Total critical errors:", totalErrors);
})();
