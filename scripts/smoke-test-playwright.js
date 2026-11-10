/**
 * smoke-test-playwright.js
 * End-to-End Playwright Smoke Test & Visual Screenshot Suite
 * SamadhanSetu — Maharashtra State Innovation Society (SIH 26136)
 */

import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const screenshotsDir = path.join(rootDir, 'docs', 'screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = process.env.BASE_URL || 'https://sih-red-zeta.vercel.app';

const ROUTES_TO_TEST = [
  { name: 'Landing', path: '/' },
  { name: 'Login', path: '/login' },
  { name: 'Signup', path: '/signup' },
  { name: 'Marketplace', path: '/problems' },
  { name: 'ChallengeDetail', path: '/problems/SS-2026-001042' },
  { name: 'PostChallengeWizard', path: '/report' },
  { name: 'DossierTracker', path: '/track' },
  { name: 'PilotDossierDetail', path: '/track/SS-2026-001042' },
  { name: 'StandardTemplates', path: '/templates' },
  { name: 'AnalyticsDashboard', path: '/dashboard/analytics' },
  { name: 'About', path: '/about' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Contact', path: '/contact' },
  { name: 'NotFound404', path: '/non-existent-page-404-test' },
];

async function run() {
  console.log('=================================================================');
  console.log('🚀 Launching Playwright Smoke & Visual Verification Suite');
  console.log(`🌐 Target URL: ${BASE_URL}`);
  console.log(`🖥️  Browser: Edge (Chromium Engine at ${EDGE_PATH})`);
  console.log('=================================================================\n');

  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  let totalTests = 0;
  let passedTests = 0;
  let consoleErrors = [];

  // VIEWPORT 1: Desktop (1440x900)
  console.log('--- [1/2] Testing Desktop Viewport (1440x900) ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
  });

  const desktopPage = await desktopContext.newPage();
  desktopPage.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[Desktop Console Error] ${msg.text()}`);
    }
  });

  for (const route of ROUTES_TO_TEST) {
    totalTests++;
    try {
      const url = `${BASE_URL}${route.path}`;
      const res = await desktopPage.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      const status = res?.status() || 200;

      // Assert status
      if (status < 400 || route.path.includes('404')) {
        console.log(`  ✓ Desktop [${route.name}] (${route.path}) -> HTTP ${status}`);
        passedTests++;
      } else {
        console.error(`  ✗ Desktop [${route.name}] returned error status HTTP ${status}`);
      }

      // Capture desktop screenshot
      const shotPath = path.join(screenshotsDir, `desktop-${route.name.toLowerCase()}.png`);
      await desktopPage.screenshot({ path: shotPath, fullPage: false });

      // Dark Mode Test for key pages
      if (['Landing', 'DossierTracker', 'StandardTemplates', 'NotFound404'].includes(route.name)) {
        await desktopPage.evaluate(() => document.documentElement.classList.add('dark'));
        const darkShotPath = path.join(screenshotsDir, `desktop-${route.name.toLowerCase()}-dark.png`);
        await desktopPage.screenshot({ path: darkShotPath, fullPage: false });
        await desktopPage.evaluate(() => document.documentElement.classList.remove('dark'));
      }
    } catch (err) {
      console.error(`  ✗ Error testing ${route.name}:`, err.message);
    }
  }

  await desktopContext.close();

  // VIEWPORT 2: Mobile (390x844 iPhone 14 / modern Android)
  console.log('\n--- [2/2] Testing Mobile Viewport (390x844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });

  const mobilePage = await mobileContext.newPage();
  mobilePage.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[Mobile Console Error] ${msg.text()}`);
    }
  });

  for (const route of ROUTES_TO_TEST) {
    totalTests++;
    try {
      const url = `${BASE_URL}${route.path}`;
      const res = await mobilePage.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      const status = res?.status() || 200;

      if (status < 400 || route.path.includes('404')) {
        console.log(`  ✓ Mobile [${route.name}] (${route.path}) -> HTTP ${status}`);
        passedTests++;
      } else {
        console.error(`  ✗ Mobile [${route.name}] returned error status HTTP ${status}`);
      }

      // Capture mobile screenshot
      const shotPath = path.join(screenshotsDir, `mobile-${route.name.toLowerCase()}.png`);
      await mobilePage.screenshot({ path: shotPath, fullPage: false });
    } catch (err) {
      console.error(`  ✗ Mobile error testing ${route.name}:`, err.message);
    }
  }

  await mobileContext.close();
  await browser.close();

  console.log('\n=================================================================');
  console.log(`📊 Smoke Test Summary: ${passedTests}/${totalTests} routes rendered cleanly.`);
  console.log(`📸 Screenshots saved to: ${screenshotsDir}`);
  if (consoleErrors.length > 0) {
    console.log(`⚠️  Console errors logged during test: ${consoleErrors.length}`);
    consoleErrors.slice(0, 5).forEach((e) => console.log('    ', e));
  } else {
    console.log('✨ Zero console errors encountered during test!');
  }
  console.log('=================================================================');

  if (passedTests < totalTests) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Smoke test suite failed:', err);
  process.exit(1);
});
