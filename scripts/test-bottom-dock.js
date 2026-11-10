import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'frontend', 'dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  let filePath = path.join(distDir, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const indexPath = path.join(distDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(indexPath).pipe(res);
  }
});

const PORT = 4174;
server.listen(PORT, async () => {
  console.log(`Local SPA preview server running at http://localhost:${PORT}`);

  try {
    const browser = await chromium.launch({
      executablePath: EDGE_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });

    // 1. Desktop Test (1440x900)
    console.log('\n--- 1. Testing Desktop Viewport (1440x900) ---');
    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await desktopContext.newPage();

    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(600);

    const dock = page.locator('nav.ios-bottom-dock');
    const isDockVisible = await dock.isVisible();
    console.log(`✓ Dock visible on home page: ${isDockVisible}`);
    if (!isDockVisible) throw new Error('Dock is not visible on desktop home page!');

    const dockBox = await dock.boundingBox();
    console.log(`✓ Dock bounding box: x=${dockBox.x.toFixed(1)}, y=${dockBox.y.toFixed(1)}, width=${dockBox.width.toFixed(1)}, height=${dockBox.height.toFixed(1)}`);

    // Verify pinned position (should be near bottom of viewport: height=900, y should be around 840-860)
    const distanceToBottom = 900 - (dockBox.y + dockBox.height);
    console.log(`✓ Distance from viewport bottom: ${distanceToBottom.toFixed(1)}px (pinned)`);
    if (distanceToBottom < 0 || distanceToBottom > 40) {
      throw new Error(`Dock is not pinned to the viewport bottom properly! distance=${distanceToBottom}`);
    }

    // Verify containment: check that EVERY child inside the dock is strictly within dock bounds
    const children = dock.locator('> *');
    const childCount = await children.count();
    console.log(`✓ Dock has ${childCount} child action items`);

    for (let i = 0; i < childCount; i++) {
      const child = children.nth(i);
      const isVisible = await child.isVisible();
      if (!isVisible) continue;
      const childBox = await child.boundingBox();
      if (!childBox) continue;

      const tolerance = 2; // px
      const isContained =
        childBox.x >= dockBox.x - tolerance &&
        childBox.x + childBox.width <= dockBox.x + dockBox.width + tolerance &&
        childBox.y >= dockBox.y - tolerance &&
        childBox.y + childBox.height <= dockBox.y + dockBox.height + tolerance;

      const tag = await child.evaluate(el => el.textContent?.trim() || el.getAttribute('aria-label') || el.tagName);
      console.log(`  - Item [${tag}]: box=[${childBox.x.toFixed(1)}, ${childBox.y.toFixed(1)}, ${childBox.width.toFixed(1)}, ${childBox.height.toFixed(1)}] -> Contained: ${isContained}`);
      if (!isContained) {
        throw new Error(`Item ${tag} protrudes outside the dock boundary!`);
      }
    }

    // Scroll down 1200px and verify dock stays pinned to viewport bottom!
    console.log('\n--- Testing Persistent Pinning on Scroll ---');
    await page.evaluate(() => window.scrollBy(0, 1200));
    await page.waitForTimeout(300);

    const scrolledDockBox = await dock.boundingBox();
    console.log(`✓ Scrolled viewport Dock position: y=${scrolledDockBox.y.toFixed(1)} (Initial was ${dockBox.y.toFixed(1)})`);
    if (Math.abs(scrolledDockBox.y - dockBox.y) > 2) {
      throw new Error('Dock did not remain pinned to viewport upon scrolling!');
    }
    console.log('✓ Dock remained permanently pinned at the bottom of the screen while scrolling!');

    // Capture desktop screenshot with dock visible
    const screenshotDir = path.join(__dirname, '..', 'docs', 'screenshots');
    fs.mkdirSync(screenshotDir, { recursive: true });
    await page.screenshot({ path: path.join(screenshotDir, 'desktop-pinned-bottom-dock.png') });
    console.log('✓ Captured desktop screenshot: docs/screenshots/desktop-pinned-bottom-dock.png');

    // 2. Test Mobile Viewport (390x844 - iPhone 14)
    console.log('\n--- 2. Testing Mobile Viewport (390x844) ---');
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const mobilePage = await mobileContext.newPage();

    await mobilePage.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await mobilePage.waitForTimeout(600);

    const mobileDock = mobilePage.locator('nav.ios-bottom-dock');
    const isMobileDockVisible = await mobileDock.isVisible();
    console.log(`✓ Mobile Dock visible: ${isMobileDockVisible}`);
    if (!isMobileDockVisible) throw new Error('Mobile dock not visible!');

    const mobileDockBox = await mobileDock.boundingBox();
    console.log(`✓ Mobile Dock box: x=${mobileDockBox.x.toFixed(1)}, width=${mobileDockBox.width.toFixed(1)}, height=${mobileDockBox.height.toFixed(1)}`);
    if (mobileDockBox.width > 380) {
      throw new Error(`Mobile dock width (${mobileDockBox.width}px) is too wide for screen (390px)!`);
    }

    // Capture mobile screenshot
    await mobilePage.screenshot({ path: path.join(screenshotDir, 'mobile-pinned-bottom-dock.png') });
    console.log('✓ Captured mobile screenshot: docs/screenshots/mobile-pinned-bottom-dock.png');

    // 3. Test on other pages
    console.log('\n--- 3. Testing Presence Across Multiple Pages ---');
    const subpages = ['/problems', '/track', '/templates', '/dashboard/analytics'];
    for (const sub of subpages) {
      await page.goto(`http://localhost:${PORT}${sub}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(300);
      const subDockVisible = await page.locator('nav.ios-bottom-dock').isVisible();
      console.log(`✓ Subpage [${sub}] has dock visible: ${subDockVisible}`);
      if (!subDockVisible) throw new Error(`Dock missing on subpage ${sub}!`);
    }

    await browser.close();
    server.close();
    console.log('\n=============================================================');
    console.log('🎉 ALL TESTS PASSED: PINNED BOTTOM GLASS PILL DOCK FULLY VERIFIED!');
    console.log('=============================================================');
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    server.close();
    process.exit(1);
  }
});
