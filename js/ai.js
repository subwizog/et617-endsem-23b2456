// Client-Side AI Orchestrator & Graceful Fallback Manager (Section 8 of PLAN.md)
// Connects to /api/feedback serverless function, enforces client-side validation, and falls back gracefully.

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.AIClient = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Client-side offline fallback library
  const CLIENT_FALLBACKS = {
    1: {
      NONE: 'Could another angle on the other side of 45° hit the exact same target?',
      FAILED_PREDICTION: 'What happens if you test an angle symmetrically above or below 45°?'
    },
    2: {
      M2: 'When speed doubled, did both horizontal speed and time of flight increase?',
      NONE: 'How does doubling speed affect horizontal reach compared to single speed?',
      CONFOUNDED: 'Between trials you changed both angle and speed; which one caused the range change?'
    },
    3: {
      M1: 'From a 20 m cliff, what happens if you direct more of your launch speed horizontally?',
      NONE: 'Does the extra falling time from the cliff reward a steeper or flatter launch angle?',
      CONFOUNDED: 'Did you change more than one variable at a time between your launches?'
    },
    4: {
      NONE: 'As cliff height increases, does the optimal launch angle get steeper or flatter?'
    }
  };

  /**
   * Fetches Socratic feedback from the serverless API with client validation and fallback.
   *
   * @param {number} challengeId
   * @param {string|object} hypothesis
   * @param {Array} trials
   * @param {number} supportLevel
   * @returns {Promise<{ isFallback: boolean, tag: string, question: string, reason?: string }>}
   */
  async function getFeedback(challengeId, hypothesis, trials = [], supportLevel = 1) {
    const numId = Number(challengeId) || 1;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: numId,
          hypothesis,
          trials: trials.slice(-4),
          supportLevel
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`API responded with status ${res.status}`);
      }

      const data = await res.json();

      // Check if server returned a fallback
      if (data.fallback) {
        return {
          isFallback: true,
          tag: data.tag || 'NONE',
          question: data.question,
          reason: data.reason || 'Server indicated fallback'
        };
      }

      // Secondary client-side safety validation
      if (typeof AIValidator !== 'undefined') {
        const val = AIValidator.validateAIResponse(data, numId);
        if (!val.valid) {
          console.warn('Client safety validator rejected response:', val.error);
          return getLocalFallback(numId, data.tag, 'Rejected by client safety validator');
        }
      }

      return {
        isFallback: false,
        tag: data.tag,
        question: data.question,
        source: 'gemini_api'
      };

    } catch (err) {
      console.info('Using offline Socratic fallback:', err.message);
      return getLocalFallback(numId, numId === 2 ? 'M2' : (numId === 3 ? 'M1' : 'NONE'), err.message);
    }
  }

  function getLocalFallback(challengeId, tag = 'NONE', reason = 'Offline mode') {
    const list = CLIENT_FALLBACKS[Number(challengeId)] || CLIENT_FALLBACKS[1];
    const question = list[tag] || list['NONE'] || 'What variable would you test next to verify your hypothesis?';
    return {
      isFallback: true,
      tag: tag || 'NONE',
      question,
      reason
    };
  }

  return {
    getFeedback,
    getLocalFallback
  };
});
