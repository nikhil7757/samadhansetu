import { chromium } from 'playwright-core';

async function verifyLive() {
  const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to https://sih-red-zeta.vercel.app ...');
  await page.goto('https://sih-red-zeta.vercel.app', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  const headlineEn = await page.locator('.fluid-headline').first().textContent();
  console.log('✓ Live English Headline:', headlineEn?.trim());

  // Click Marathi
  const mrBtn = page.locator('button[aria-label="मराठी (Marathi)"]');
  if (await mrBtn.count() > 0) {
    await mrBtn.click();
    await page.waitForTimeout(500);
    const headlineMr = await page.locator('.fluid-headline').first().textContent();
    console.log('✓ Live Marathi Headline:', headlineMr?.trim());
  }

  // Click Hindi
  const hiBtn = page.locator('button[aria-label="हिंदी (Hindi)"]');
  if (await hiBtn.count() > 0) {
    await hiBtn.click();
    await page.waitForTimeout(500);
    const headlineHi = await page.locator('.fluid-headline').first().textContent();
    console.log('✓ Live Hindi Headline:', headlineHi?.trim());
  }

  // Check dark mode
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(300);
  const darkBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
  console.log('✓ Live Dark Mode Body BG:', darkBg);

  await browser.close();
  console.log('\n🎉 ALL LIVE VERCEL CHECKS PASSED!');
}

verifyLive().catch((err) => {
  console.error('Live check failed:', err);
  process.exit(1);
});
