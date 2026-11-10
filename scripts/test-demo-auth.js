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
  console.log(`Test SPA Server running at http://localhost:${PORT}`);

  try {
    const browser = await chromium.launch({
      executablePath: EDGE_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });

    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    // 1. Test Login Page Demo Accounts UI
    console.log('\n--- 1. Testing Login Page Demo Accounts UI ---');
    await page.goto(`http://localhost:${PORT}/login`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(600);

    const demoCards = page.locator('text=1-Click Demo Accounts');
    const hasDemoSection = await demoCards.count();
    console.log(`✓ 1-Click Demo Accounts section present: ${hasDemoSection > 0}`);
    if (!hasDemoSection) throw new Error('Demo accounts section missing on Login page!');

    const roles = [
      'Department Officer',
      'Startup Founder',
      'MSInS Super Admin',
      'Expert Evaluator',
      'Independent Validator',
      'Citizen Reporter',
    ];

    for (const r of roles) {
      const el = page.locator(`text=${r}`);
      const count = await el.count();
      console.log(`  - Role Persona [${r}]: rendered (${count > 0})`);
      if (count === 0) throw new Error(`Role persona ${r} missing from Demo picker!`);
    }

    // Verify Google Sign-In button on Login
    const googleBtn = page.locator('button:has-text("Continue with Google")');
    const hasGoogleBtn = await googleBtn.count();
    console.log(`✓ Google Sign-In button rendered: ${hasGoogleBtn > 0}`);
    if (!hasGoogleBtn) throw new Error('Google Sign-In button missing!');

    // 2. Test Signup Page Google Sign-Up and Demo Picker
    console.log('\n--- 2. Testing Signup Page Google Sign-Up & Demo UI ---');
    await page.goto(`http://localhost:${PORT}/signup`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(600);

    const signupGoogleBtn = page.locator('button:has-text("Sign Up with Google")');
    const hasSignupGoogleBtn = await signupGoogleBtn.count();
    console.log(`✓ Google Sign-Up button rendered on Signup page: ${hasSignupGoogleBtn > 0}`);
    if (!hasSignupGoogleBtn) throw new Error('Google Sign-Up button missing on Signup page!');

    const signupDemoPicker = page.locator('text=1-Click Demo Accounts');
    const hasSignupDemo = await signupDemoPicker.count();
    console.log(`✓ 1-Click Demo Accounts rendered on Signup page: ${hasSignupDemo > 0}`);

    // Capture screenshots of Login and Signup with Demo Accounts
    const screenshotDir = path.join(__dirname, '..', 'docs', 'screenshots');
    fs.mkdirSync(screenshotDir, { recursive: true });
    await page.screenshot({ path: path.join(screenshotDir, 'login-with-demo-accounts.png') });
    console.log('✓ Captured screenshot: docs/screenshots/login-with-demo-accounts.png');

    await page.goto(`http://localhost:${PORT}/login`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, 'signup-with-demo-accounts.png') });
    console.log('✓ Captured screenshot: docs/screenshots/signup-with-demo-accounts.png');

    await browser.close();
    server.close();

    console.log('\n============================================================');
    console.log('🎉 ALL DEMO ACCOUNTS & GOOGLE SIGNUP UI ASSERTIONS PASSED!');
    console.log('============================================================');
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    server.close();
    process.exit(1);
  }
});
