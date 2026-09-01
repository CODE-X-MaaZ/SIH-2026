const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log("-> Open /");
    await page.goto("http://localhost:3000/");
    
    console.log("-> Click Speak to us (or equivalent)");
    // Try to navigate to /report 
    await page.goto("http://localhost:3000/report?mode=text");
    await page.waitForLoadState('networkidle');

    console.log("-> Enter water report");
    await page.fill('textarea', 'There is no water in my building for 3 days. We need help immediately.');
    
    console.log("-> Click Use Text (simulate submit)");
    // We can just click the primary button (assuming it's submit)
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(3000); 

    // We should be on /report/review
    const url = page.url();
    console.log("-> Current URL: ", url);
    if (!url.includes('/report/review')) {
       throw new Error("Failed to reach review page");
    }

    console.log("-> Click Submit report on review page");
    await page.click('button:has-text("Submit report")');
    await page.waitForTimeout(1000);

    const newUrl = page.url();
    console.log("-> Current URL: ", newUrl);
    if (!newUrl.includes('/report/success')) {
       throw new Error("Failed to reach success page");
    }
    
    const text = await page.textContent('body');
    if (!text.includes('NR-')) {
       throw new Error("Tracking ID not found on success page");
    }
    
    console.log("-> TEST PASSED.");
  } catch (err) {
    console.error("TEST FAILED: ", err);
  } finally {
    await browser.close();
  }
})();
