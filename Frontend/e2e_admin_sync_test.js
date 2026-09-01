const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // 1. Get initial count
    await page.goto("http://localhost:3000/admin");
    await page.waitForLoadState('networkidle');
    const initialText = await page.textContent('body');
    const match = initialText.match(/(\d+)\s*Active reports/);
    const initialValue = match ? parseInt(match[1]) : 0;
    console.log("-> Initial Active Reports on Admin: ", initialValue);

    // 2. Submit new complaint
    await page.goto("http://localhost:3000/report?mode=text");
    await page.waitForLoadState('networkidle');

    await page.fill('textarea', 'There is absolutely no water in the east block. Please restore it immediately!');
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(3000); 

    await page.click('button:has-text("Submit report")');
    await page.waitForTimeout(1000);

    // 3. Go back to Admin
    await page.goto("http://localhost:3000/admin");
    await page.waitForLoadState('networkidle');

    const finalText = await page.textContent('body');
    const match2 = finalText.match(/(\d+)\s*Active reports/);
    const finalValue = match2 ? parseInt(match2[1]) : 0;
    console.log("-> Final Active Reports on Admin: ", finalValue);

    if (finalValue <= initialValue) {
       throw new Error("Admin did NOT synchronize the new citizen complaint!");
    } else {
       console.log("-> DATA SYNCHRONIZATION PASSED.");
    }

  } catch (err) {
    console.error("TEST FAILED: ", err);
  } finally {
    await browser.close();
  }
})();
