import { chromium } from 'playwright-core';

async function verifyLiveAuth() {
  const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to https://sih-red-zeta.vercel.app/login ...');
  await page.goto('https://sih-red-zeta.vercel.app/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  const demoCount = await page.locator('text=1-Click Demo Accounts').count();
  const googleBtnCount = await page.locator('button:has-text("Continue with Google")').count();
  console.log('✓ Live Login -> 1-Click Demo Section count:', demoCount, '| Google Btn count:', googleBtnCount);

  if (demoCount === 0 || googleBtnCount === 0) {
    throw new Error('Live Login missing Demo Section or Google Button!');
  }

  console.log('Navigating to https://sih-red-zeta.vercel.app/signup ...');
  await page.goto('https://sih-red-zeta.vercel.app/signup', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  const signupGoogleCount = await page.locator('button:has-text("Sign Up with Google")').count();
  const signupDemoCount = await page.locator('text=1-Click Demo Accounts').count();
  console.log('✓ Live Signup -> Google Sign-Up Btn count:', signupGoogleCount, '| Demo Section count:', signupDemoCount);

  if (signupGoogleCount === 0 || signupDemoCount === 0) {
    throw new Error('Live Signup missing Google Sign-Up button or Demo Section!');
  }

  await browser.close();
  console.log('\n🎉 ALL LIVE VERCEL AUTH & DEMO ACCOUNT VERIFICATIONS PASSED 100%!');
}

verifyLiveAuth().catch((err) => {
  console.error('Live Auth verification failed:', err);
  process.exit(1);
});
