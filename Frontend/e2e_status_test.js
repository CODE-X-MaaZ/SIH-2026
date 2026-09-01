const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log("-> Open /admin/incidents/INC-WATER-001");
    await page.goto("http://localhost:3000/admin/incidents/INC-WATER-001");
    await page.waitForLoadState('networkidle');

    let text = await page.textContent('body');
    if (!text.includes('EMERGING')) {
       console.log("Not in emerging initially, maybe already updated.");
    }
    
    console.log("-> Click Mark Investigating");
    let btn = await page.locator('button:has-text("Mark Investigating")');
    if (await btn.count() > 0) {
      await btn.click();
      await page.waitForTimeout(1000);
    }
    
    text = await page.textContent('body');
    if (!text.includes('INVESTIGATING')) {
       throw new Error("Failed to transition to INVESTIGATING");
    }
    
    console.log("-> Refreshing page");
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    text = await page.textContent('body');
    if (!text.includes('INVESTIGATING')) {
       throw new Error("Failed to persist INVESTIGATING state!");
    }

    console.log("-> Click Mark Resolved");
    btn = await page.locator('button:has-text("Mark Resolved")');
    if (await btn.count() > 0) {
      // confirm dialog bypass
      page.on('dialog', dialog => dialog.accept());
      await btn.click();
      await page.waitForTimeout(1000);
    }
    
    await page.reload();
    await page.waitForLoadState('networkidle');

    text = await page.textContent('body');
    if (!text.includes('RESOLVED')) {
       throw new Error("Failed to persist RESOLVED state!");
    }
    
    console.log("-> STATUS PERSISTENCE PASSED.");

  } catch (err) {
    console.error("TEST FAILED: ", err);
  } finally {
    await browser.close();
  }
})();
