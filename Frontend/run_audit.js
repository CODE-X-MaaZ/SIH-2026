const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  const routes = [
    '/',
    '/report',
    '/report/review',
    '/report/success',
    '/track',
    '/track/CMP-W-001',
    '/admin',
    '/admin/incidents',
    '/admin/incidents/INC-WATER-001',
    '/admin/complaints',
    '/admin/hotspots',
    '/admin/resolution',
    '/admin/analytics'
  ];

  console.log("Starting Route Audit...");
  
  for (const route of routes) {
    const page = await context.newPage();
    const url = `http://localhost:3000${route}`;
    let status = 0;
    const errors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(`Console error: ${msg.text()}`);
      }
    });
    
    page.on('pageerror', err => {
      errors.push(`Page error: ${err.message}`);
    });

    try {
      const response = await page.goto(url, { waitUntil: 'load', timeout: 15000 });
      status = response ? response.status() : 0;
    } catch (e) {
      errors.push(`Navigate error: ${e.message}`);
    }
    
    console.log(`\nRoute: ${route}`);
    console.log(`Status: ${status}`);
    const text = await page.textContent('body');
    if (text) {
        console.log(`Page contains: ${text.substring(0, 100).replace(/\s+/g, ' ')}...`);
    } else {
        console.log("Page is conceptually blank/empty");
    }
    
    if (errors.length > 0) {
      console.log(`Errors: `);
      console.log(errors);
    }
    
    await page.close();
  }

  await browser.close();
})();
