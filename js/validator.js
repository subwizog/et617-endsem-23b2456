// AI Response Validator & Leak Prevention Engine (Section 8 of PLAN.md)
// Enforces JSON schema, allowed tags, length constraints, punctuation, and challenge-specific forbidden regexes.

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.AIValidator = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const ALLOWED_TAGS = ['M1', 'M2', 'CONFOUNDED', 'NONE'];

  // Challenge-specific answer-leak patterns: strictly forbidden in Socratic AI questions
  const FORBIDDEN_PATTERNS = {
    1: [
      /\b(35|55)\s*(°|deg|degrees)\b/i,
      /\bcomplementary\b/i,
      /\bsin\s*2\s*θ\b/i
    ],
    2: [
      /4\s*(x|×|times)\b/i,
      /quadruple/i,
      /\bv²|\bv\^2\b/i,
      /\b90(\.5)?\s*(m|meters)\b/i,
      /\bfour times\b/i
    ],
    3: [
      /\b2[2-6]\s*(°|deg|degrees)\b/i,
      /\b24(\.3)?\b/i,
      /\bless than 45\b/i,
      /\boptimal (angle|is)\b/i
    ],
    4: [
      /\b27(\.7)?\s*(°|deg|degrees)\b/i,
      /\barctan\b/i
    ]
  };

  /**
   * Validates parsed AI response object against pedagogical safety rules.
   *
   * @param {object} obj - { tag: string, question: string }
   * @param {number} challengeId - 1, 2, 3, or 4
   * @returns {{ valid: boolean, error?: string }}
   */
  function validateAIResponse(obj, challengeId) {
    if (!obj || typeof obj !== 'object') {
      return { valid: false, error: 'Response is not a valid JSON object' };
    }

    // 1. Tag validation
    if (!obj.tag || typeof obj.tag !== 'string' || !ALLOWED_TAGS.includes(obj.tag)) {
      return { valid: false, error: `Invalid or missing tag: "${obj.tag}". Allowed: ${ALLOWED_TAGS.join(', ')}` };
    }

    // 2. Question validation
    if (!obj.question || typeof obj.question !== 'string') {
      return { valid: false, error: 'Missing or non-string question field' };
    }

    const trimmedQuestion = obj.question.trim();
    if (trimmedQuestion.length === 0) {
      return { valid: false, error: 'Question is empty' };
    }

    // 3. Question mark punctuation check
    if (!/\?\s*$/.test(trimmedQuestion)) {
      return { valid: false, error: 'Question must end with a question mark (?)' };
    }

    // 4. Word count check (max 25 words)
    const words = trimmedQuestion.split(/\s+/).filter(Boolean);
    if (words.length > 25) {
      return { valid: false, error: `Question exceeds 25 words (${words.length} words)` };
    }

    // 5. Answer-leak check
    const forbidden = FORBIDDEN_PATTERNS[Number(challengeId)] || [];
    for (const pattern of forbidden) {
      if (pattern.test(trimmedQuestion)) {
        return {
          valid: false,
          error: `Answer leak detected! Matched forbidden pattern: ${pattern}`
        };
      }
    }

    return { valid: true };
  }

  return {
    ALLOWED_TAGS,
    FORBIDDEN_PATTERNS,
    validateAIResponse
  };
});
