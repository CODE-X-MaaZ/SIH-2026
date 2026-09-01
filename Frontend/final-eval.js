const { chromium } = require('playwright');
const fs = require('fs');

const ROUTES = [
  '/',
  '/report?mode=text',
  '/report/review',
  '/track',
  '/admin',
  '/admin/incidents',
  '/admin/hotspots',
  '/admin/resolution'
];

const VIEWPORTS = [
  { width: 320, height: 800 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 }
];

(async () => {
  const browser = await chromium.launch();
  let results = {
    tests: 0,
    passed: 0,
    failed: 0,
    consoleErrors: 0,
    consoleWarnings: 0,
    pageErrors: 0,
    failedRequests: 0,
    logs: []
  };

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: vp });
    
    for (const route of ROUTES) {
      results.tests++;
      const page = await context.newPage();
      
      page.on('console', msg => {
        if (msg.type() === 'error') results.consoleErrors++;
        if (msg.type() === 'warning') results.consoleWarnings++;
      });
      page.on('pageerror', err => {
         results.pageErrors++;
      });
      page.on('requestfailed', request => {
         results.failedRequests++;
         results.logs.push(`Failed Request: ${request.url()}`);
      });
      
      try {
        await page.goto(`http://localhost:3000${route}`, { waitUntil: 'load', timeout: 5000 });
        
        const metrics = await page.evaluate(() => {
          return {
            scrollW: document.documentElement.scrollWidth,
            clientW: document.documentElement.clientWidth
          };
        });
        
        if (metrics.scrollW > metrics.clientW) {
             throw new Error("Responsive Breakage");
        }
        results.passed++;
      } catch(e) {
        results.failed++;
        results.logs.push(`[${vp.width}x${vp.height}] ${route}: ${e.message}`);
      }
      
      await page.close();
    }
    await context.close();
  }
  
  await browser.close();
  fs.writeFileSync('final_results.json', JSON.stringify(results, null, 2));
  console.log('Final Eval Complete');
})();
