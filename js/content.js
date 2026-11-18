// Content Repository & Challenge Curriculum
// All challenge specifications, prompt questions, hypothesis definitions, feedback texts, and validation logic.
// STRICT PEDAGOGICAL DESIGN: Never reveals final answers prematurely to learners with misconceptions.

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.AppContent = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const CHALLENGES = [
    {
      id: 1,
      name: 'The Bullseye',
      subtitle: 'Flat Ground · Target Distance 60 m',
      badge: 'Challenge 1',
      description: 'Hit the target at 60 m using two different launch angles on level ground.',
      target: 60,
      targetTol: 2.0,
      fixed: { v: 25, h: 0 },
      free: ['theta'],
      defaults: { theta: 45, v: 25, h: 0 },
      predict: {
        type: 'mcq',
        question: 'How many different launch angles can hit a target on flat ground with fixed speed?',
        options: [
          { id: 'one', label: 'Only one unique angle' },
          { id: 'two', label: 'Exactly two different angles', isCorrect: true },
          { id: 'many', label: 'Many different angles' }
        ],
        hint: 'Think about projectile trajectories: can a high arc and a low drive land at the same spot?'
      },
      evaluateTrials: (trials) => {
        const hits = trials.filter((t) => Math.abs(t.R - 60) <= 2.0);
        const hitAngles = [];
        hits.forEach((t) => {
          if (!hitAngles.some((a) => Math.abs(a - t.theta) < 4)) {
            hitAngles.push(t.theta);
          }
        });

        const isComplete = hitAngles.length >= 2;
        let feedback = '';

        if (hitAngles.length >= 2) {
          const a1 = Math.min(...hitAngles);
          const a2 = Math.max(...hitAngles);
          const sum = a1 + a2;
          feedback = `🎉 **Outstanding!** You found two hitting angles: **${a1}°** and **${a2}°** (sum = ${sum}°).\n\n**Why does this happen?** Horizontal range on level ground depends on **sin(2θ)**. Because $\\sin(2\\theta) = \\sin(180° - 2\\theta) = \\sin(2(90° - \\theta))$, complementary angles that add up to **90°** produce the exact same horizontal range!`;
        } else if (hitAngles.length === 1) {
          feedback = `🎯 You found one hitting angle at **${hitAngles[0]}°**. But can another angle reach 60 m?\n\n**Inquiry clue:** Look at the other side of **45°** (${hitAngles[0] < 45 ? 'try an angle higher than 45°' : 'try an angle lower than 45°'}). What do you notice?`;
        } else if (trials.length >= 4) {
          feedback = `No hits yet. Try angles on both sides of 45° (for instance, around 35° or 55°) with launch speed 25 m/s.`;
        } else {
          feedback = `Launch your first shot and observe where the ball lands relative to the 60 m flag.`;
        }

        return { isComplete, hitAngles, feedback };
      }
    },
    {
      id: 2,
      name: 'Double Trouble',
      subtitle: 'Speed Scaling & v² Dependence',
      badge: 'Challenge 2',
      description: 'Predict what happens to the range when launch speed doubles from 15 m/s to 30 m/s.',
      target: null,
      fixed: { theta: 40, h: 0 },
      free: ['v'],
      defaults: { theta: 40, v: 15, h: 0 },
      predict: {
        type: 'numeric',
        baseline: { theta: 40, v: 15, h: 0, R: 22.6 },
        question: 'Baseline trial at 15 m/s gave a range of 22.6 m. If we double the launch speed to 30 m/s, what will the range be?',
        unit: 'm',
        expected: 90.5, // 22.6 * 4
        m2Value: 45.2,  // 22.6 * 2 (linear misconception)
        hint: 'Does range depend linearly on speed, or something stronger?'
      },
      evaluateTrials: (trials, predictionVal, hasCompletedSupport = false) => {
        const trialsAt30 = trials.filter((t) => Math.abs(t.v - 30) <= 0.5);
        const hasTested30 = trialsAt30.length > 0;
        const pred = Number(predictionVal);
        const isM2 = pred && Math.abs(pred - 45.2) <= 5.0;

        let isComplete = false;
        let feedback = '';

        if (hasTested30) {
          const latestAt30 = trialsAt30[trialsAt30.length - 1];

          if (isM2 && !hasCompletedSupport) {
            // STRICT PEDAGOGICAL FIX: Do NOT reveal v² or quadrupling!
            isComplete = false;
            feedback = `⚠️ **Prediction Mismatch:** You predicted **${pred} m** (doubling the range), but the actual range measured at 30 m/s is **${latestAt30.R.toFixed(1)} m**!\n\nNotice that the ball went far beyond double distance. The relationship between speed and range is NOT simply proportional. Explore the **Support Ladder** below to discover the true relationship.`;
          } else if (pred && Math.abs(pred - 90.5) <= 10.0) {
            // Correct prediction path
            isComplete = true;
            feedback = `🎉 **Spot-on Olympiad deduction!** You predicted **${pred} m** and the measured range is **${latestAt30.R.toFixed(1)} m**.\n\nRange is proportional to **v²**. When speed is multiplied by 2, range is multiplied by $2^2 = 4$!`;
          } else if (hasCompletedSupport) {
            // Completed support path
            isComplete = true;
            feedback = `🎉 **Inquiry Complete!** Through your controlled speed sweeps, you discovered that range grows with **v²**. Doubling the speed quadruples the range from 22.6 m to **${latestAt30.R.toFixed(1)} m**!`;
          } else {
            isComplete = false;
            feedback = `At 30 m/s the projectile reached **${latestAt30.R.toFixed(1)} m** (compared to 22.6 m at 15 m/s). Investigate the Support Ladder to uncover the governing formula.`;
          }
        } else {
          feedback = `You predicted **${pred || '--'} m**. Now switch to the Lab, set speed to **30 m/s**, and hit Launch to test your prediction!`;
        }

        return { isComplete, isM2, hasTested30, feedback };
      }
    },
    {
      id: 3,
      name: 'The Cliff Shot',
      subtitle: 'Height Advantage · Cliff h = 20 m',
      badge: 'Challenge 3',
      description: 'Launch from a 20 m cliff at 10 m/s. Does 45° still give the maximum range?',
      target: null,
      fixed: { v: 10, h: 20 },
      free: ['theta'],
      defaults: { theta: 45, v: 10, h: 20 },
      predict: {
        type: 'mcq',
        question: 'Which angle gives the longest horizontal range when launching from a 20 m cliff?',
        options: [
          { id: '30', label: '30°' },
          { id: '45', label: '45° (The textbook rule)', isM1: true },
          { id: '60', label: '60°', isM1: true },
          { id: 'less45', label: 'An angle noticeably less than 45° (around 24°)', isCorrect: true },
          { id: 'unsure', label: "I'm not sure yet" }
        ],
        hint: 'From a cliff, gravity has more time to pull the projectile down. Do you need as much vertical launch speed?'
      },
      evaluateTrials: (trials, predictionId, hasCompletedSupport = false) => {
        const trial45 = trials.find((t) => Math.abs(t.theta - 45) <= 1);
        let bestTrial = null;
        trials.forEach((t) => {
          if (!bestTrial || t.R > bestTrial.R) bestTrial = t;
        });

        const isM1 = predictionId === '45' || predictionId === '60';
        let isComplete = false;
        let feedback = '';

        // True optimal angle for cliff launch (10 m/s, 20 m) is 24.3° with R ≈ 22.6m
        const isOptimalFound = bestTrial && Math.abs(bestTrial.theta - 24.3) <= 2.5 && bestTrial.R >= 22.4;

        if (isOptimalFound) {
          // Learner found the true optimal angle
          isComplete = true;
          feedback = `🎉 **Discovery Made!** Your best range was **${bestTrial.R.toFixed(1)} m** at **${bestTrial.theta}°**.\n\nNotice that **45° only gave ~20.3 m**. When launching from a height $h > 0$, the projectile already gets extra flight time from falling. Directing more initial velocity horizontally (flatter launch $\\approx 24°$) yields a significantly longer range!`;
        } else if (trial45 && bestTrial && bestTrial.R > trial45.R + 0.3) {
          // STRICT PEDAGOGICAL FIX: Do NOT reveal 24° optimal angle!
          isComplete = false;
          feedback = `⚠️ **Observation:** Your 45° shot went **${trial45.R.toFixed(1)} m**, but trial #${bestTrial.challengeTrialIndex || ''} (${bestTrial.theta}°) went **${bestTrial.R.toFixed(1)} m**—farther than 45°!\n\n45° is optimal ONLY when landing at the launch level. From a 20 m cliff, what changed? Enter the Support Ladder to sweep angles and locate the true peak.`;
        } else if (trial45 && !hasCompletedSupport) {
          isComplete = false;
          feedback = `At 45° your range is **${trial45.R.toFixed(1)} m**. Is 45° truly the maximum from an elevated cliff? Try testing flatter angles in the Lab or check the Support Ladder!`;
        } else if (hasCompletedSupport) {
          isComplete = true;
          feedback = `🎉 **Inquiry Complete!** Through your angle sweep, you proved that launching from a cliff shifts the peak range below 45°.`;
        } else {
          feedback = `Launch from the 20 m cliff in the Lab to compare angles!`;
        }

        return { isComplete, isM1, bestTrial, feedback };
      }
    },
    {
      id: 4,
      name: 'Olympiad Stretch',
      subtitle: 'Open Exploration & Analytical Justification',
      badge: 'Challenge 4',
      description: 'Explore h = 30 m cliff at v = 15 m/s. Find the optimal angle and justify why it drops as cliff height rises.',
      target: null,
      fixed: {},
      free: ['theta', 'v', 'h'],
      defaults: { theta: 30, v: 15, h: 30 },
      predict: {
        type: 'text',
        question: 'For h = 30 m and v = 15 m/s, what launch angle maximizes range? Explain in 1–2 sentences why increasing cliff height lowers the optimal angle below 45°.',
        hint: 'Use the formula θ* = arctan( v / sqrt(v² + 2gh) ) or physical reasoning about flight time.'
      },
      evaluateTrials: (trials) => {
        let bestTrial = null;
        trials.forEach((t) => {
          if (!bestTrial || t.R > bestTrial.R) bestTrial = t;
        });
        const isComplete = Boolean(bestTrial && bestTrial.theta >= 25 && bestTrial.theta <= 30 && trials.length >= 3);
        let feedback = '';
        if (isComplete) {
          feedback = `🏆 **Olympiad Level Achievement!** You found optimal angle **${bestTrial.theta}°** (Range: **${bestTrial.R.toFixed(1)} m**).\n\n**Analytical Proof:** The exact formula is $\\theta^* = \\arctan\\left(\\frac{v}{\\sqrt{v^2 + 2gh}}\\right)$. As cliff height $h \\to \\infty$, the denominator grows, driving $\\theta^* \\to 0°$ (pure horizontal launch). Excellent physical reasoning!`;
        } else {
          feedback = `Test multiple angles between 20° and 35° at $h = 30\\text{ m}, v = 15\\text{ m/s}$ to locate the optimal peak, then enter your written explanation.`;
        }
        return { isComplete, bestTrial, feedback };
      }
    }
  ];

  const SPOT_THE_FLAW_TASK = {
    title: 'Spot the Flaw in the Experiment',
    scenario: 'A student ran two trials to see what makes a projectile travel farther:\n• Trial 1: Angle = 30°, Speed = 15 m/s (Range = 20.0 m)\n• Trial 2: Angle = 45°, Speed = 25 m/s (Range = 63.8 m)',
    question: 'Can the student conclude that a 45° angle caused the increase in range?',
    options: [
      { id: 'yes', label: 'Yes, 45° is always better', isCorrect: false },
      { id: 'no', label: 'No, both angle AND speed were changed at once (Confounding variables)', isCorrect: true },
      { id: 'neither', label: 'Range only depends on height', isCorrect: false }
    ],
    explanation: 'To isolate causation in physics, you must change **one variable at a time** (controlled experiment). Changing both θ and v simultaneously confounds the result!'
  };

  return {
    CHALLENGES,
    SPOT_THE_FLAW_TASK,
    getChallenge: (id) => CHALLENGES.find((c) => c.id === Number(id)) || CHALLENGES[0]
  };
});
