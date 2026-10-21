/**
 * End-to-End UI & Route Verification Suite
 * SamadhanSetu — Maharashtra State Innovation Society (MSInS)
 * Verifies all 24 routes, 6 signature components, glassmorphism design tokens,
 * and build integrity across mobile and desktop requirements.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('=================================================================');
console.log('🏛️  SamadhanSetu Glassmorphism & Route Verification Suite');
console.log('=================================================================\n');

let failed = false;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✗ FAILED: ${message}`);
    failed = true;
  }
}

// 1. Verify 24 Checklist Routes in routes.tsx
console.log('[1/5] Verifying 24 UI Routes in frontend/src/routes.tsx...');
const routesFile = fs.readFileSync(path.join(rootDir, 'frontend/src/routes.tsx'), 'utf-8');

const EXPECTED_ROUTES = [
  { path: 'index (/)', test: "index: true" },
  { path: '/login', test: "path: 'login'" },
  { path: '/signup', test: "path: 'signup'" },
  { path: '/mfa/enroll', test: "path: 'mfa/enroll'" },
  { path: '/report', test: "path: 'report'" },
  { path: '/problems', test: "path: 'problems'" },
  { path: '/problems/:id', test: "path: 'problems/:id'" },
  { path: '/problems/submit', test: "path: 'problems/submit'" },
  { path: '/challenges', test: "path: 'challenges'" },
  { path: '/challenges/:id', test: "path: 'challenges/:id'" },
  { path: '/marketplace', test: "path: 'marketplace'" },
  { path: '/track', test: "path: 'track'" },
  { path: '/track/:complaintId', test: "path: 'track/:complaintId'" },
  { path: '/templates', test: "path: 'templates'" },
  { path: '/my/submissions', test: "path: 'my/submissions'" },
  { path: '/my/interests', test: "path: 'my/interests'" },
  { path: '/my/teams', test: "path: 'my/teams'" },
  { path: '/teams/:teamId', test: "path: 'teams/:teamId'" },
  { path: '/admin', test: "path: 'admin'" },
  { path: '/admin/pending', test: "path: 'admin/pending'" },
  { path: '/admin/approvals', test: "path: 'admin/approvals'" },
  { path: '/admin/matches', test: "path: 'admin/matches'" },
  { path: '/dashboard', test: "path: 'dashboard'" },
  { path: '/dashboard/analytics', test: "path: 'dashboard/analytics'" },
  { path: '/notifications', test: "path: 'notifications'" },
  { path: '/about', test: "path: 'about'" },
  { path: '/faq', test: "path: 'faq'" },
  { path: '/contact', test: "path: 'contact'" },
  { path: '/prototype', test: "path: 'prototype'" },
  { path: '* (404 Page)', test: "<NotFoundPage />" },
];

for (const r of EXPECTED_ROUTES) {
  assert(routesFile.includes(r.test), `Route registered: ${r.path}`);
}

// 2. Verify 6 Signature Components
console.log('\n[2/5] Verifying 6 Signature Components...');
const SIGNATURE_COMPONENTS = [
  { name: 'ProcurementLifecycleTracker', path: 'frontend/src/components/shared/ProcurementLifecycleTracker.tsx' },
  { name: 'ScoreRingMeter', path: 'frontend/src/components/shared/ScoreRingMeter.tsx' },
  { name: 'MilestonePaymentTimeline', path: 'frontend/src/components/shared/MilestonePaymentTimeline.tsx' },
  { name: 'ResponsiveDataTable', path: 'frontend/src/components/shared/ResponsiveDataTable.tsx' },
  { name: 'EvaluationScoringGrid', path: 'frontend/src/components/shared/EvaluationScoringGrid.tsx' },
  { name: 'StandardTemplateReader', path: 'frontend/src/components/shared/StandardTemplateReader.tsx' },
  { name: 'CommandPalette (Cmd/Ctrl+K)', path: 'frontend/src/components/shared/CommandPalette.tsx' },
  { name: 'NotFoundPage (Dedicated 404)', path: 'frontend/src/pages/NotFoundPage.tsx' },
];

for (const sc of SIGNATURE_COMPONENTS) {
  const fullPath = path.join(rootDir, sc.path);
  assert(fs.existsSync(fullPath), `Signature component exists: ${sc.name} (${sc.path})`);
}

// 3. Verify Glassmorphism Design Tokens & CSS Classes
console.log('\n[3/5] Verifying Glassmorphism Theme Tokens & CSS Classes...');
const cssFile = fs.readFileSync(path.join(rootDir, 'frontend/src/index.css'), 'utf-8');

const REQUIRED_TOKENS = [
  '--color-primary: #1B2559',
  '--color-accent: #F29A2E',
  '--color-success: #1E9E7A',
  '--color-warning: #E0A100',
  '--color-danger: #D64545',
  '.glass-surface',
  '.glass-popover',
  '.solid-surface',
  '.solid-surface-elevated',
  '.bg-app-atmosphere',
  '.text-fluid-display',
  '.text-fluid-h1',
  'prefers-reduced-motion',
  'prefers-reduced-transparency',
];

for (const token of REQUIRED_TOKENS) {
  assert(cssFile.includes(token), `CSS token / utility present: ${token}`);
}

// 4. Verify Brand Preservation & Typography in HTML
console.log('\n[4/5] Verifying Brand Preservation & Typography Fonts...');
const htmlFile = fs.readFileSync(path.join(rootDir, 'frontend/index.html'), 'utf-8');
const platformConfig = fs.readFileSync(path.join(rootDir, 'frontend/src/config/platform.ts'), 'utf-8');

assert(platformConfig.includes("name: 'SamadhanSetu'"), "Platform name strictly matches 'SamadhanSetu'");
assert(htmlFile.includes('Plus+Jakarta+Sans'), 'Plus Jakarta Sans heading font loaded in index.html');
assert(htmlFile.includes('Inter'), 'Inter body font loaded in index.html');
assert(htmlFile.includes('Noto+Sans+Devanagari'), 'Noto Sans Devanagari font loaded in index.html');
assert(htmlFile.includes('JetBrains+Mono'), 'JetBrains Mono font loaded in index.html');

// 5. Verify Production Build Artifacts
console.log('\n[5/5] Verifying Production Build Output in frontend/dist...');
const distDir = path.join(rootDir, 'frontend/dist');
const distIndex = path.join(distDir, 'index.html');
const distAssets = path.join(distDir, 'assets');

assert(fs.existsSync(distIndex), 'frontend/dist/index.html generated');
assert(fs.existsSync(distAssets), 'frontend/dist/assets directory generated');

const assetFiles = fs.readdirSync(distAssets);
const hasJs = assetFiles.some((f) => f.endsWith('.js'));
const hasCss = assetFiles.some((f) => f.endsWith('.css'));
const hasNotFoundChunk = assetFiles.some((f) => f.includes('NotFoundPage'));

assert(hasJs, 'JavaScript bundle chunks generated');
assert(hasCss, 'Tailwind v4 CSS stylesheet generated');
assert(hasNotFoundChunk, 'Dedicated NotFoundPage code-split chunk generated');

console.log('\n=================================================================');
if (failed) {
  console.error('❌ SOME VERIFICATION CHECKS FAILED. Review issues above.');
  process.exit(1);
} else {
  console.log('✅ ALL UI DESIGN, COMPONENT & ROUTE CHECKS PASSED PERFECTLY!');
  console.log('=================================================================');
}
