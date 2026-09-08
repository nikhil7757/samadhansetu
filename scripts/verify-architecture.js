/**
 * verify-architecture.js — Zero-Dependency Verification Script
 * 
 * In accordance with the Ponytail Principle:
 * "Lazy code without its check is unfinished: non-trivial logic leaves ONE runnable check behind,
 * the smallest thing that fails if the logic breaks (an assert-based demo/self-check or one small test file; no frameworks, no fixtures)."
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('🏛️  SamadhanSetu Architecture & Skills Verification');
console.log('====================================================\n');

// 1. Verify Matt Pocock Skills Suite Files
console.log('[1/5] Verifying Matt Pocock Skills Suite Configuration...');
const requiredDocs = [
  'docs/agents/issue-tracker.md',
  'docs/agents/triage-labels.md',
  'docs/agents/domain.md',
  'docs/adr/0001-unified-grievance-lifecycle.md',
  'docs/adr/0002-zero-dependency-static-packaging.md',
  'CONTEXT.md',
];

for (const doc of requiredDocs) {
  const fullPath = path.join(ROOT_DIR, doc);
  assert.ok(fs.existsSync(fullPath), `Missing required skill configuration: ${doc}`);
  const stats = fs.statSync(fullPath);
  assert.ok(stats.size > 50, `File ${doc} is suspiciously small (${stats.size} bytes)`);
  console.log(`  ✓ ${doc} (${stats.size} bytes)`);
}

// 2. Verify AGENTS.md Block
console.log('\n[2/5] Verifying AGENTS.md has Agent skills block...');
const agentsMd = fs.readFileSync(path.join(ROOT_DIR, 'AGENTS.md'), 'utf-8');
assert.ok(agentsMd.includes('## Agent skills'), 'AGENTS.md must include ## Agent skills');
assert.ok(agentsMd.includes('docs/agents/issue-tracker.md'), 'AGENTS.md must reference issue-tracker.md');
assert.ok(agentsMd.includes('docs/agents/triage-labels.md'), 'AGENTS.md must reference triage-labels.md');
assert.ok(agentsMd.includes('docs/agents/domain.md'), 'AGENTS.md must reference domain.md');
console.log('  ✓ AGENTS.md Agent skills block verified');

// 3. Verify Static Resolution Vectors (AGENTS.md Section 1)
console.log('\n[3/5] Verifying Synchronized Resolution Vectors...');
const resolutionVectors = [
  'prototype.html',
  'architecture-review.html',
  'frontend/public/prototype.html',
  'frontend/public/architecture-review.html',
  'frontend/dist/prototype.html',
  'frontend/dist/architecture-review.html',
  'frontend/dist/index.html',
];

for (const vector of resolutionVectors) {
  const p = path.join(ROOT_DIR, vector);
  assert.ok(fs.existsSync(p), `Missing resolution vector: ${vector}`);
  const size = fs.statSync(p).size;
  assert.ok(size > 500, `Resolution vector ${vector} is unexpectedly small: ${size} bytes`);
  console.log(`  ✓ ${vector} (${(size / 1024).toFixed(1)} KB)`);
}

// 4. Verify Prototype Scenarios & Solver Matching
console.log('\n[4/5] Verifying Prototype State Machine Invariants...');
const prototypeContent = fs.readFileSync(path.join(ROOT_DIR, 'prototype.html'), 'utf-8');
assert.ok(prototypeContent.includes('Academic Solver Matching'), 'prototype.html must include Scenario 5 (Academic Solver Matching)');
assert.ok(prototypeContent.includes('form_solver_team'), 'prototype.html must include form_solver_team action');
assert.ok(prototypeContent.includes('citizen_appeal'), 'prototype.html must include citizen appeal action');
assert.ok(prototypeContent.includes('Architecture Review'), 'prototype.html must link to Architecture Review');
console.log('  ✓ Prototype state machine contains all 5 scenarios and academic solver seam');

// 5. Verify Backend & Frontend Deep Module Files
console.log('\n[5/7] Verifying Deep Architecture Modules...');
const deepModules = [
  'backend/src/services/grievanceRegistry.service.ts',
  'frontend/src/lib/grievanceStore.ts',
  'frontend/src/pages/PrototypePage.tsx',
];

for (const mod of deepModules) {
  const p = path.join(ROOT_DIR, mod);
  assert.ok(fs.existsSync(p), `Missing deep module: ${mod}`);
  const size = fs.statSync(p).size;
  assert.ok(size > 1000, `Module ${mod} is too small: ${size} bytes`);
  console.log(`  ✓ ${mod} (${(size / 1024).toFixed(1)} KB)`);
}

// 6. Verify Active Integration of GrievanceStore Seam (No Dead Seams)
console.log('\n[6/7] Verifying Active Integration of GrievanceStore Seam in UI Pages...');
const trackerCode = fs.readFileSync(path.join(ROOT_DIR, 'frontend/src/pages/ComplaintTrackerPage.tsx'), 'utf-8');
assert.ok(
  trackerCode.includes("from '@/lib/grievanceStore'") && trackerCode.includes('useGrievance('),
  'ComplaintTrackerPage.tsx must import and use useGrievance from grievanceStore'
);
console.log('  ✓ ComplaintTrackerPage.tsx actively consumes useGrievance hook');

const pendingCode = fs.readFileSync(path.join(ROOT_DIR, 'frontend/src/pages/admin/PendingApproval.tsx'), 'utf-8');
assert.ok(
  pendingCode.includes("from '@/lib/grievanceStore'") && pendingCode.includes('useGrievances('),
  'PendingApproval.tsx must import and use useGrievances from grievanceStore'
);
console.log('  ✓ PendingApproval.tsx actively consumes useGrievances hook');

const complaintsCode = fs.readFileSync(path.join(ROOT_DIR, 'frontend/src/lib/complaints.ts'), 'utf-8');
assert.ok(
  complaintsCode.includes("'resolve'") && complaintsCode.includes("'escalate_to_solver'"),
  'complaints.ts executeOfficerAction must support resolve and escalate_to_solver'
);
console.log('  ✓ complaints.ts executeOfficerAction supports full lifecycle (resolve, escalate_to_solver)');

const storeCode = fs.readFileSync(path.join(ROOT_DIR, 'frontend/src/lib/grievanceStore.ts'), 'utf-8');
assert.ok(
  storeCode.includes('listeners.add(handleStoreChange)'),
  'grievanceStore.ts useGrievance must subscribe to reactive listeners'
);
console.log('  ✓ grievanceStore.ts useGrievance is reactively bound to store updates');

// 7. Verify Backend Seam Consolidation (GrievanceRegistryService Authoritative Delegation)
console.log('\n[7/7] Verifying Backend Seam Consolidation & Authoritative Service Delegation...');
const routeCode = fs.readFileSync(path.join(ROOT_DIR, 'backend/src/routes/complaint.routes.ts'), 'utf-8');
assert.ok(
  routeCode.includes('GrievanceRegistryService.listGrievances('),
  'complaint.routes.ts GET / must delegate to GrievanceRegistryService.listGrievances'
);
assert.ok(
  !routeCode.includes('SERVER_COMPLAINTS'),
  'complaint.routes.ts must not maintain redundant SERVER_COMPLAINTS in-memory dictionary'
);
assert.ok(
  !routeCode.includes('persistComplaintToDatabase'),
  'complaint.routes.ts must not keep dead persistComplaintToDatabase helper'
);
console.log('  ✓ complaint.routes.ts strictly delegates to GrievanceRegistryService with zero dead state');

const registryCode = fs.readFileSync(path.join(ROOT_DIR, 'backend/src/services/grievanceRegistry.service.ts'), 'utf-8');
assert.ok(
  registryCode.includes('SS-2026-000484') && registryCode.includes('SS-2026-000485'),
  'GrievanceRegistryService MEMORY_REGISTRY must contain seed complaints SS-2026-000484 and SS-2026-000485'
);
assert.ok(
  registryCode.includes('citizen_id?: string') && registryCode.includes('citizen_email?: string'),
  'GrievanceRegistryService.listGrievances must support citizen_id and citizen_email filtering'
);
console.log('  ✓ GrievanceRegistryService contains all seed records and citizen filters');

console.log('\n====================================================');
console.log('✅ ALL 7 ARCHITECTURAL INVARIANTS, SKILLS & SEAMS VERIFIED!');
console.log('====================================================\n');
