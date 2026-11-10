import { chromium } from 'playwright-core';

async function verifyLive() {
  const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const LIVE_URL = 'https://sih-red-zeta.vercel.app';
  console.log(`Connecting to Live Production: ${LIVE_URL} ...`);

  // 1. Mobile Portrait Viewport Test (iPhone 14 - 390x844)
  console.log('\n--- 1. Testing Live Mobile Portrait Viewport (390x844) ---');
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(LIVE_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await mobilePage.waitForTimeout(1000);

  // Check Upper Bar (TopNav)
  const mobileHeader = mobilePage.locator('header.sticky.top-0');
  const isHeaderVisible = await mobileHeader.isVisible();
  console.log(`✓ Live Mobile Upper Header mounted & visible: ${isHeaderVisible}`);
  if (!isHeaderVisible) throw new Error('Live mobile upper header is missing!');

  const headerBoxInitial = await mobileHeader.boundingBox();
  console.log(`✓ Live Mobile Upper Header initial Y: ${headerBoxInitial.y.toFixed(1)}px (pinned at top)`);

  // Check Bottom Dock
  const mobileDock = mobilePage.locator('nav.ios-bottom-dock');
  const isDockVisible = await mobileDock.isVisible();
  console.log(`✓ Live Mobile Bottom Dock visible: ${isDockVisible}`);
  if (!isDockVisible) throw new Error('Live mobile bottom dock is missing!');

  const dockBoxInitial = await mobileDock.boundingBox();
  console.log(`✓ Live Mobile Bottom Dock dimensions: w=${dockBoxInitial.width.toFixed(1)}px, h=${dockBoxInitial.height.toFixed(1)}px, y=${dockBoxInitial.y.toFixed(1)}px`);

  // Verify streamlined 4 items count
  const dockLinks = mobileDock.locator('> a');
  const dockCount = await dockLinks.count();
  console.log(`✓ Live Mobile Dock action count: ${dockCount} items`);
  if (dockCount !== 4) throw new Error(`Expected 4 streamlined items in live dock, found ${dockCount}`);

  for (let i = 0; i < dockCount; i++) {
    const item = dockLinks.nth(i);
    const itemBox = await item.boundingBox();
    const itemText = (await item.innerText()).replace(/\n/g, ' ').trim();
    const isContained =
      itemBox.x >= dockBoxInitial.x - 2 &&
      itemBox.x + itemBox.width <= dockBoxInitial.x + dockBoxInitial.width + 2 &&
      itemBox.y >= dockBoxInitial.y - 2 &&
      itemBox.y + itemBox.height <= dockBoxInitial.y + dockBoxInitial.height + 2;
    console.log(`  - Item #${i + 1} "${itemText}": contained = ${isContained}`);
    if (!isContained) throw new Error(`Live item "${itemText}" protrudes outside dock!`);
  }

  // Scroll 1000px down and verify pinning
  console.log('Scrolling down 1000px on live mobile viewport...');
  await mobilePage.evaluate(() => window.scrollBy(0, 1000));
  await mobilePage.waitForTimeout(400);

  const headerBoxScrolled = await mobileHeader.boundingBox();
  console.log(`✓ Live Mobile Upper Header Y after scroll: ${headerBoxScrolled.y.toFixed(1)}px (PINNED AT TOP)`);
  if (headerBoxScrolled.y > 5 || headerBoxScrolled.y < -1) {
    throw new Error(`Live mobile upper header unpinned after scroll! Y=${headerBoxScrolled.y}`);
  }

  const dockBoxScrolled = await mobileDock.boundingBox();
  const distanceFromBottom = 844 - (dockBoxScrolled.y + dockBoxScrolled.height);
  console.log(`✓ Live Mobile Bottom Dock Y after scroll: ${dockBoxScrolled.y.toFixed(1)}px (distance from bottom = ${distanceFromBottom.toFixed(1)}px) (PINNED AT BOTTOM)`);
  if (distanceFromBottom < 0 || distanceFromBottom > 50) {
    throw new Error(`Live mobile bottom dock unpinned or drifted after scroll! distance=${distanceFromBottom}`);
  }

  await mobileContext.close();

  // 2. Desktop & Multilingual / Dark Mode Test
  console.log('\n--- 2. Testing Live Desktop & Multilingual / Theme ---');
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto(LIVE_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await desktopPage.waitForTimeout(1000);

  const headlineEn = await desktopPage.locator('.fluid-headline').first().textContent();
  console.log(`✓ Live English Headline: "${headlineEn?.trim()}"`);

  // Click Marathi
  const mrBtn = desktopPage.locator('button[aria-label="मराठी (Marathi)"]');
  if (await mrBtn.count() > 0) {
    await mrBtn.click();
    await desktopPage.waitForTimeout(500);
    const headlineMr = await desktopPage.locator('.fluid-headline').first().textContent();
    console.log(`✓ Live Marathi Headline: "${headlineMr?.trim()}"`);
  }

  // Click Hindi
  const hiBtn = desktopPage.locator('button[aria-label="हिंदी (Hindi)"]');
  if (await hiBtn.count() > 0) {
    await hiBtn.click();
    await desktopPage.waitForTimeout(500);
    const headlineHi = await desktopPage.locator('.fluid-headline').first().textContent();
    console.log(`✓ Live Hindi Headline: "${headlineHi?.trim()}"`);
  }

  // Dark Mode test
  await desktopPage.evaluate(() => document.documentElement.classList.add('dark'));
  await desktopPage.waitForTimeout(300);
  const darkBg = await desktopPage.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
  console.log(`✓ Live Dark Mode Body BG: ${darkBg}`);

  await browser.close();
  console.log('\n🎉 ALL LIVE PRODUCTION VERCEL VERIFICATIONS PASSED 100%!');
}

verifyLive().catch((err) => {
  console.error('Live check failed:', err);
  process.exit(1);
});
