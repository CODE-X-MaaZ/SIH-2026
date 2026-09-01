const { chromium } = require('playwright');
const fs = require('fs');

const ROUTES = [
  '/',
  '/report?mode=text',
  '/report/review',
  '/report/success',
  '/track',
  '/admin',
  '/admin/incidents',
  '/admin/incidents/INC-WATER-001',
  '/admin/complaints',
  '/admin/hotspots',
  '/admin/resolution',
  '/admin/analytics'
];

const VIEWPORTS = [
  { width: 320, height: 800 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 }
];

(async () => {
  const browser = await chromium.launch();
  let logData = "=== NAGRIK RADAR RESPONSIVE & RUNTIME AUDIT ===\n\n";

  for (const vp of VIEWPORTS) {
    logData += `\n--- VIEWPORT ${vp.width}x${vp.height} ---\n`;
    const context = await browser.newContext({ viewport: vp });
    
    for (const route of ROUTES) {
      const page = await context.newPage();
      
      let routeLog = [];
      page.on('console', msg => {
        if (msg.type() === 'error' || msg.type() === 'warning') {
            routeLog.push(`  [${msg.type().toUpperCase()}] ${msg.text()}`);
        }
      });
      page.on('pageerror', err => {
         routeLog.push(`  [RUNTIME ERROR] ${err.message}`);
      });
      
      try {
        await page.goto(`http://localhost:3000${route}`, { waitUntil: 'load', timeout: 5000 });
        await page.waitForTimeout(1000);
        
        const metrics = await page.evaluate(() => {
          return {
            scrollW: document.documentElement.scrollWidth,
            clientW: document.documentElement.clientWidth
          };
        });
        
        if (metrics.scrollW > metrics.clientW) {
          routeLog.push(`  [OVERFLOW] Width: ${metrics.scrollW} > Client: ${metrics.clientW}`);
        }
        
      } catch(e) {
        routeLog.push(`  [LOAD FAILED] ${e.message}`);
      }
      
      if (routeLog.length > 0) {
        logData += `URL: ${route}\n${routeLog.join('\n')}\n`;
      }
      
      await page.close();
    }
    await context.close();
  }
  
  await browser.close();
  fs.writeFileSync('audit_results.txt', logData);
  console.log('Audit complete.');
})();
