// Unit tests for AI Response Validator & Answer Leak Prevention (Section 8 of PLAN.md)
// Run with: node tests/ai_validator.test.js

const assert = require('assert');
const { validateAIResponse } = require('../js/validator.js');

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

console.log('Running AI Validator Safety Tests...');

// Required Test 1: Challenge 3 response containing "24°" must be rejected
test('Challenge 3 response containing "24°" must be rejected (Answer Leak)', () => {
  const badResponse = {
    tag: 'M1',
    question: 'Why does 24° give a longer range from the cliff?'
  };
  const res = validateAIResponse(badResponse, 3);
  assert.strictEqual(res.valid, false, 'Expected validation to fail');
  assert.match(res.error, /Answer leak detected/i);
});

// Required Test 2: Challenge 2 response containing "quadruple" must be rejected
test('Challenge 2 response containing "quadruple" must be rejected (Answer Leak)', () => {
  const badResponse = {
    tag: 'M2',
    question: 'Did you notice that doubling the speed caused the range to quadruple?'
  };
  const res = validateAIResponse(badResponse, 2);
  assert.strictEqual(res.valid, false, 'Expected validation to fail');
  assert.match(res.error, /Answer leak detected/i);
});

// Test 3: Valid Socratic question in Challenge 2
test('Valid Socratic question in Challenge 2 passes', () => {
  const goodResponse = {
    tag: 'M2',
    question: 'When speed doubled, did both horizontal speed and air time increase?'
  };
  const res = validateAIResponse(goodResponse, 2);
  assert.strictEqual(res.valid, true, `Expected valid response, got error: ${res.error}`);
});

// Test 4: Valid Socratic question in Challenge 3
test('Valid Socratic question in Challenge 3 passes', () => {
  const goodResponse = {
    tag: 'M1',
    question: 'From an elevated cliff, what happens if you direct more velocity horizontally?'
  };
  const res = validateAIResponse(goodResponse, 3);
  assert.strictEqual(res.valid, true, `Expected valid response, got error: ${res.error}`);
});

// Test 5: Rejection of question exceeding 25 words
test('Question exceeding 25 words is rejected', () => {
  const longResponse = {
    tag: 'M2',
    question: 'Can you please explain to me very carefully why you think that when you launch a projectile at thirty meters per second it should land here?'
  };
  const res = validateAIResponse(longResponse, 2);
  assert.strictEqual(res.valid, false, 'Expected long question to be rejected');
  assert.match(res.error, /exceeds 25 words/i);
});

// Test 6: Rejection of question not ending with question mark
test('Question not ending with question mark is rejected', () => {
  const noPunc = {
    tag: 'CONFOUNDED',
    question: 'Think about which variable caused the change'
  };
  const res = validateAIResponse(noPunc, 2);
  assert.strictEqual(res.valid, false, 'Expected missing question mark to be rejected');
  assert.match(res.error, /question mark/i);
});

// Test 7: Rejection of invalid tag
test('Invalid tag is rejected', () => {
  const badTag = {
    tag: 'UNKNOWN_MISCONCEPTION',
    question: 'What do you notice about the path?'
  };
  const res = validateAIResponse(badTag, 1);
  assert.strictEqual(res.valid, false, 'Expected invalid tag to be rejected');
  assert.match(res.error, /Invalid or missing tag/i);
});

console.log(`\nAI Validator Tests Finished: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
