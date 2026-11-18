// Unit tests for Projectile Motion Virtual Lab Physics Engine
// Run with: node tests/physics.test.js

const assert = require('assert');
const Physics = require('../js/physics.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  [FAIL] ${name}: ${err.message}`);
    failed++;
  }
}

function approxEqual(actual, expected, tolerance = 0.1, message = '') {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    throw new Error(
      `${message} Expected ~${expected}, got ${actual} (diff: ${diff.toFixed(4)} > tol: ${tolerance})`
    );
  }
}

console.log('Running Physics Engine Tests (PLAN.md Acceptance Checks)...');

// Test 1: Level ground standard launch (45°, 20 m/s, h=0) -> R ≈ 40.82
test('simulate(45, 20, 0).R ≈ 40.82', () => {
  const res = Physics.simulate(45, 20, 0);
  approxEqual(res.R, 40.82, 0.1, 'Standard range at 45°');
});

// Test 2: Complementary angles give matching range (30° and 60° at 20 m/s, h=0)
test('simulate(30, 20, 0).R ≈ simulate(60, 20, 0).R (complementary angles)', () => {
  const res30 = Physics.simulate(30, 20, 0);
  const res60 = Physics.simulate(60, 20, 0);
  approxEqual(res30.R, res60.R, 0.1, 'Complementary angle ranges');
  // Also check theoretical value: 20^2 * sin(60) / 9.8 = 400 * 0.866025 / 9.8 = 35.348
  approxEqual(res30.R, 35.35, 0.1, '30° range value');
});

// Test 3: Doubling speed quadruples range (v^2 dependence)
test('simulate(40, 30, 0).R ≈ 4 * simulate(40, 15, 0).R (quadratic scaling)', () => {
  const res15 = Physics.simulate(40, 15, 0);
  const res30 = Physics.simulate(40, 30, 0);
  const ratio = res30.R / res15.R;
  approxEqual(ratio, 4.0, 0.1, 'Range ratio when doubling speed');
  approxEqual(res30.R, 4 * res15.R, 0.1, 'Direct 4x range comparison');
});

// Test 4: Cliff launch (v=10, h=20) -> bestAngle ≈ 24.3° and outperforms 45°
test('bestAngle(10, 20) ≈ 24.3 and outperforms 45°', () => {
  const angleOpt = Physics.bestAngle(10, 20);
  approxEqual(angleOpt, 24.3, 0.1, 'Optimal cliff launch angle');

  const resOpt = Physics.simulate(angleOpt, 10, 20);
  const res45 = Physics.simulate(45, 10, 20);

  if (resOpt.R <= res45.R) {
    throw new Error(`Expected optimal angle range (${resOpt.R.toFixed(2)}m) > 45° range (${res45.R.toFixed(2)}m)`);
  }
  // resOpt.R should be ~22.6m, res45.R should be ~20.3m
  approxEqual(resOpt.R, 22.6, 0.2, 'Optimal cliff range');
  approxEqual(res45.R, 20.3, 0.2, '45° cliff range');
});

// Test 5: Level ground optimal angle is always 45° for any speed
test('bestAngle(v, 0) = 45 for any speed v', () => {
  [5, 10, 20, 35, 40].forEach((v) => {
    const angle = Physics.bestAngle(v, 0);
    approxEqual(angle, 45, 0.001, `Optimal angle at h=0 with v=${v}`);
  });
});

console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
