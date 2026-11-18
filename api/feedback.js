// Vercel Serverless Function: AI Socratic Feedback via Google Gemini REST API
// Enforces 6s timeout, response schema validation, and answer-leak prevention with offline fallback.

const { validateAIResponse } = require('../js/validator.js');

// Pre-written offline fallback Socratic prompts per challenge and tag
const OFFLINE_FALLBACKS = {
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

function getOfflineFallback(challengeId, tag = 'NONE') {
  const challengeFallbacks = OFFLINE_FALLBACKS[Number(challengeId)] || OFFLINE_FALLBACKS[1];
  const question = challengeFallbacks[tag] || challengeFallbacks['NONE'] || 'What variable would you test next to verify your hypothesis?';
  return {
    fallback: true,
    tag: tag || 'NONE',
    question,
    source: 'offline_rule_engine'
  };
}

module.exports = async function handler(req, res) {
  // CORS & headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  const { challengeId = 1, hypothesis = '', trials = [], supportLevel = 1 } = body || {};

  // 1. Check for API key in environment
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    // Graceful offline fallback when key is not configured
    const tag = (challengeId === 2) ? 'M2' : (challengeId === 3 ? 'M1' : 'NONE');
    const fallback = getOfflineFallback(challengeId, tag);
    fallback.reason = 'LLM_API_KEY environment variable not configured.';
    return res.status(200).json(fallback);
  }

  const model = process.env.LLM_MODEL || 'gemini-1.5-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const systemInstruction = `You are a physics lab guide for a Class 11 Olympiad student. The student is exploring projectile motion (no air resistance, g = 9.8 m/s²).
Rules:
1. Never state the final answer (no optimal angle, no target range, no "4 times").
2. Reply with ONE short Socratic question (max 25 words) that points at the variable or the experiment design.
3. Tag the likely misconception: "M1" (45° is always best), "M2" (range is linear in speed), "CONFOUNDED" (changed two variables), or "NONE".
4. Use simple, friendly language. Short sentences.
Return ONLY JSON: {"tag": "...", "question": "..."}`;

  const userPrompt = `Challenge ID: ${challengeId}
Student Hypothesis: "${typeof hypothesis === 'object' ? JSON.stringify(hypothesis) : hypothesis}"
Recent Experimental Trials: ${JSON.stringify(trials.slice(-3))}
Current Support Level: ${supportLevel}

Provide your Socratic guidance JSON:`;

  // 2. Execute call with 6-second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const geminiPayload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
        maxOutputTokens: 120
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`Gemini API returned status ${response.status}:`, errText);
      const fallback = getOfflineFallback(challengeId, challengeId === 2 ? 'M2' : 'NONE');
      fallback.reason = `Gemini upstream error (status ${response.status})`;
      return res.status(200).json(fallback);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      const fallback = getOfflineFallback(challengeId);
      fallback.reason = 'Empty response from Gemini';
      return res.status(200).json(fallback);
    }

    // 3. Parse JSON from model
    let parsed = null;
    try {
      parsed = JSON.parse(candidateText);
    } catch (parseErr) {
      // Try extracting JSON with regex if markdown backticks are wrapped
      const match = candidateText.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      }
    }

    if (!parsed) {
      const fallback = getOfflineFallback(challengeId);
      fallback.reason = 'Invalid JSON generated by model';
      return res.status(200).json(fallback);
    }

    // 4. Validate schema and check for answer leaks
    const validation = validateAIResponse(parsed, challengeId);
    if (!validation.valid) {
      console.warn('AI Output rejected by safety validator:', validation.error);
      const fallback = getOfflineFallback(challengeId, parsed.tag || 'NONE');
      fallback.reason = `Validator rejected model response: ${validation.error}`;
      return res.status(200).json(fallback);
    }

    // 5. Successful validated response
    return res.status(200).json({
      fallback: false,
      tag: parsed.tag,
      question: parsed.question,
      source: 'gemini_api'
    });

  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('Error during Gemini API call:', err.message);
    const fallback = getOfflineFallback(challengeId, challengeId === 2 ? 'M2' : 'NONE');
    fallback.reason = err.name === 'AbortError' ? 'Call timed out (> 6s)' : err.message;
    return res.status(200).json(fallback);
  }
};
