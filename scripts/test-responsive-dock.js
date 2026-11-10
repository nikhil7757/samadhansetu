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

const PORT = 4175;
server.listen(PORT, async () => {
  console.log(`Responsive Test Server running at http://localhost:${PORT}`);

  try {
    const browser = await chromium.launch({
      executablePath: EDGE_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });

    const devicesToTest = [
      { name: 'Mobile Portrait (iPhone 14 / 390x844)', width: 390, height: 844 },
      { name: 'Small Mobile (iPhone SE / 375x667)', width: 375, height: 667 },
      { name: 'Tablet Portrait (iPad Air / 820x1180)', width: 820, height: 1180 },
      { name: 'Tablet Landscape (1180x820)', width: 1180, height: 820 },
      { name: 'Desktop Standard (1440x900)', width: 1440, height: 900 },
      { name: 'Ultrawide HD (1920x1080)', width: 1920, height: 1080 },
    ];

    for (const dev of devicesToTest) {
      console.log(`\n======================================================`);
      console.log(`📱 Testing Device Viewport: ${dev.name}`);
      console.log(`======================================================`);

      const context = await browser.newContext({
        viewport: { width: dev.width, height: dev.height },
      });
      const page = await context.newPage();

      // Test Home Page
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(600);

      // 1. Verify Top Navigation Bar
      const header = page.locator('header.sticky.top-0');
      const isHeaderVisible = await header.isVisible();
      console.log(`  ✓ Upper header mounted & visible: ${isHeaderVisible}`);
      if (!isHeaderVisible) throw new Error(`Upper bar not visible on ${dev.name}`);

      const headerBoxInitial = await header.boundingBox();
      console.log(`  ✓ Upper bar initial Y: ${headerBoxInitial.y.toFixed(1)}px (pinned at top)`);

      // 2. Verify Streamlined Bottom Dock
      const dock = page.locator('nav.ios-bottom-dock');
      const isDockVisible = await dock.isVisible();
      console.log(`  ✓ Bottom dock visible: ${isDockVisible}`);
      if (!isDockVisible) throw new Error(`Bottom dock not visible on ${dev.name}`);

      const dockBoxInitial = await dock.boundingBox();
      console.log(`  ✓ Bottom dock dimensions: w=${dockBoxInitial.width.toFixed(1)}px, h=${dockBoxInitial.height.toFixed(1)}px, y=${dockBoxInitial.y.toFixed(1)}px`);
      
      // Bottom dock width verification: should fit comfortably on screen without horizontal overflow
      if (dockBoxInitial.width > dev.width) {
        throw new Error(`Bottom dock width (${dockBoxInitial.width}px) overflows screen width (${dev.width}px)!`);
      }
      console.log(`  ✓ Dock fits screen: ${dockBoxInitial.width.toFixed(1)}px < ${dev.width}px`);

      // Verify bottom dock items count: exactly 4 items (Home, Market, Post, Track)
      const dockLinks = dock.locator('> a');
      const dockCount = await dockLinks.count();
      console.log(`  ✓ Dock action items count: ${dockCount} (expected 4: Home, Market, Post, Track)`);
      if (dockCount !== 4) {
        throw new Error(`Expected 4 streamlined items in bottom dock, found ${dockCount}`);
      }

      // Check containment of all dock children
      for (let i = 0; i < dockCount; i++) {
        const item = dockLinks.nth(i);
        const itemBox = await item.boundingBox();
        const itemText = (await item.innerText()).replace(/\n/g, ' ').trim();
        const isContained =
          itemBox.x >= dockBoxInitial.x - 2 &&
          itemBox.x + itemBox.width <= dockBoxInitial.x + dockBoxInitial.width + 2 &&
          itemBox.y >= dockBoxInitial.y - 2 &&
          itemBox.y + itemBox.height <= dockBoxInitial.y + dockBoxInitial.height + 2;
        console.log(`    - Item #${i + 1} "${itemText}": contained within dock bounds = ${isContained}`);
        if (!isContained) {
          throw new Error(`Item "${itemText}" protrudes outside bottom dock boundary!`);
        }
      }

      // 3. Test Scroll Pinning: Scroll down 1200px
      console.log(`  --> Scrolling down 1200px to test pinning under scroll...`);
      await page.evaluate(() => window.scrollBy(0, 1200));
      await page.waitForTimeout(400);

      // Verify Upper Bar remains pinned at top (y <= 0)
      const headerBoxScrolled = await header.boundingBox();
      console.log(`  ✓ Upper bar Y after scroll: ${headerBoxScrolled.y.toFixed(1)}px (PINNED AT TOP)`);
      if (headerBoxScrolled.y > 5 || headerBoxScrolled.y < -1) {
        throw new Error(`Upper bar unpinned after scroll! Y=${headerBoxScrolled.y}`);
      }

      // Verify Bottom Dock remains pinned at bottom
      const dockBoxScrolled = await dock.boundingBox();
      const distanceFromBottom = dev.height - (dockBoxScrolled.y + dockBoxScrolled.height);
      console.log(`  ✓ Bottom dock Y after scroll: ${dockBoxScrolled.y.toFixed(1)}px (distance from bottom = ${distanceFromBottom.toFixed(1)}px) (PINNED AT BOTTOM)`);
      if (distanceFromBottom < 0 || distanceFromBottom > 50) {
        throw new Error(`Bottom dock unpinned or drifted after scroll! distance=${distanceFromBottom}`);
      }

      await context.close();
    }

    // Verify subpages
    console.log(`\n======================================================`);
    console.log(`🌐 Testing Subpages Bottom Dock & Top Nav Visibility`);
    console.log(`======================================================`);

    const subpages = ['/problems', '/report', '/track', '/templates', '/dashboard/analytics'];
    const testContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const subPage = await testContext.newPage();

    for (const path of subpages) {
      await subPage.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await subPage.waitForTimeout(500);

      const topNav = subPage.locator('header.sticky.top-0');
      const bottomDock = subPage.locator('nav.ios-bottom-dock');

      const isTopVisible = await topNav.isVisible();
      const isBottomVisible = await bottomDock.isVisible();

      console.log(`  ✓ Subpage [${path}]: TopNav=${isTopVisible}, BottomDock=${isBottomVisible}`);
      if (!isTopVisible || !isBottomVisible) {
        throw new Error(`Navigation element missing on subpage: ${path}`);
      }
    }

    await browser.close();
    server.close();
    console.log(`\n🎉 ALL RESPONSIVE & PINNING CHECKS PASSED FLAWLESSLY!`);
    process.exit(0);
  } catch (err) {
    console.error(`\n❌ Responsive test failed:`, err);
    server.close();
    process.exit(1);
  }
});
