// Diagnosis & Inquiry Scaffolding Engine (Section 7 of PLAN.md)
// Evaluates misconceptions (M1, M2), confounding variables, prediction failures, and manages the Support Ladder.
// STRICT PEDAGOGICAL RULE: Never reveals final answers prematurely to learners with misconceptions.

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.DiagnoseEngine = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  /**
   * Diagnoses learner trials, hypothesis, and returns detected flags and support state.
   */
  function diagnose(challengeId, trials = [], hypothesis = null, supportLevel = 0) {
    const numId = Number(challengeId);
    const flags = [];
    let isCorrect = false;
    let needsSupport = false;
    let harderFollowUp = null;

    // Check confounding (changed more than 1 variable between consecutive trials)
    if (trials.length >= 2) {
      const lastTrial = trials[trials.length - 1];
      if (lastTrial.changed && lastTrial.changed.length > 1) {
        flags.push('CONFOUNDED');
        needsSupport = true;
      }
    }

    if (numId === 1) {
      // Challenge 1: The Bullseye
      const hits = trials.filter((t) => Math.abs(t.R - 60) <= 2.0);
      const hitAngles = [];
      hits.forEach((t) => {
        if (!hitAngles.some((a) => Math.abs(a - t.theta) < 4)) {
          hitAngles.push(t.theta);
        }
      });

      if (hitAngles.length >= 2) {
        isCorrect = true;
        harderFollowUp = "Harder follow-up: If the target were moved to 70 m, could a 25 m/s launch ever hit it? (Hint: calculate max theoretical range at 45°: R_max = v²/g).";
      } else if (trials.length >= 3 && hitAngles.length < 2) {
        needsSupport = true;
        flags.push('FAILED_PREDICTION');
      }
    } else if (numId === 2) {
      // Challenge 2: Double Trouble (M2 speed doubling)
      const pred = hypothesis ? Number(hypothesis.prediction) : null;
      const trialAt30 = trials.find((t) => Math.abs(t.v - 30) <= 0.5);

      if (pred !== null && !isNaN(pred)) {
        // M2: within 10% of 2 * 22.6 = 45.2 m
        if (Math.abs(pred - 45.2) <= 5.0) {
          flags.push('M2');
          needsSupport = true;
        } else if (Math.abs(pred - 90.5) <= 10.0) {
          if (trialAt30) {
            isCorrect = true;
            harderFollowUp = "Harder follow-up: If you triple the speed (3×), by what numerical factor will the range increase? What if speed is halved (0.5×)?";
          }
        } else if (trialAt30 && Math.abs(pred - trialAt30.R) > 10.0) {
          flags.push('FAILED_PREDICTION');
          needsSupport = true;
        }
      }
    } else if (numId === 3) {
      // Challenge 3: The Cliff Shot (M1 45° rule)
      const selected = hypothesis ? hypothesis.selected : null;
      const trial45 = trials.find((t) => Math.abs(t.theta - 45) <= 1);
      const bestTrial = trials.reduce((best, t) => (!best || t.R > best.R ? t : best), null);

      if (selected === '45' || selected === '60') {
        flags.push('M1');
        needsSupport = true;
      }

      // Check if learner tested 45° and another trial beat it
      if (trial45 && bestTrial && bestTrial.R > trial45.R + 0.5) {
        flags.push('M1');
        needsSupport = true;
      }

      if (bestTrial && bestTrial.theta >= 20 && bestTrial.theta <= 28 && bestTrial.R >= 22.0) {
        // Learner has explored the true optimum zone
        isCorrect = true;
        harderFollowUp = "Harder follow-up: If the cliff height were reduced to just 5 m, would the optimal angle be closer to 45° or closer to 24°? Test it in Challenge 4!";
      }
    } else if (numId === 4) {
      const bestTrial = trials.reduce((best, t) => (!best || t.R > best.R ? t : best), null);
      if (bestTrial && bestTrial.theta >= 25 && bestTrial.theta <= 30 && trials.length >= 3) {
        isCorrect = true;
        harderFollowUp = "Olympiad Mastery: You have uncovered how boundary conditions reshape projectile mechanics!";
      }
    }

    return {
      challengeId: numId,
      flags,
      isCorrect,
      needsSupport: needsSupport && !isCorrect,
      supportLevel,
      harderFollowUp
    };
  }

  /**
   * Generates a controlled sweep across a single variable, holding all others constant.
   * Returns data points for the Range-vs-Variable curve without labeling the optimum answer.
   */
  function generateControlledSweep(challengeId, customVar) {
    const numId = Number(challengeId);
    let varName = customVar;
    let points = [];
    let fixedDesc = '';

    if (numId === 2) {
      // Sweep speed v from 10 to 35 m/s at theta=40, h=0
      varName = 'v';
      fixedDesc = 'Fixed: Launch Angle = 40°, Cliff Height = 0 m';
      const speeds = [10, 15, 20, 25, 30, 35];
      points = speeds.map((speed) => {
        const sim = Physics.simulate(40, speed, 0);
        return {
          xVal: speed,
          label: `${speed} m/s`,
          R: Number(sim.R.toFixed(1)),
          H: Number(sim.H.toFixed(1)),
          T: Number(sim.T.toFixed(2))
        };
      });
    } else if (numId === 3) {
      // Sweep angle theta from 15° to 60° at v=10 m/s, h=20 m
      varName = 'theta';
      fixedDesc = 'Fixed: Launch Speed = 10 m/s, Cliff Height = 20 m';
      const angles = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
      points = angles.map((ang) => {
        const sim = Physics.simulate(ang, 10, 20);
        return {
          xVal: ang,
          label: `${ang}°`,
          R: Number(sim.R.toFixed(1)),
          H: Number(sim.H.toFixed(1)),
          T: Number(sim.T.toFixed(2))
        };
      });
    } else {
      // Challenge 1 sweep: angle at v=25, h=0
      varName = 'theta';
      fixedDesc = 'Fixed: Launch Speed = 25 m/s, Cliff Height = 0 m';
      const angles = [25, 30, 35, 40, 45, 50, 55, 60, 65];
      points = angles.map((ang) => {
        const sim = Physics.simulate(ang, 25, 0);
        return {
          xVal: ang,
          label: `${ang}°`,
          R: Number(sim.R.toFixed(1)),
          H: Number(sim.H.toFixed(1)),
          T: Number(sim.T.toFixed(2))
        };
      });
    }

    return {
      challengeId: numId,
      variableName: varName,
      fixedDesc,
      points
    };
  }

  /**
   * Support Ladder Rung Content definitions
   */
  const LADDER_CONTENT = {
    1: {
      step1_name_the_gap: {
        title: 'Step 1: Inspect the Gap',
        prompt: 'Look closely at your trial data and ghost paths on the canvas. Is the target reached? Why does only one angle feel obvious at first?'
      },
      step2_socratic_question: {
        title: 'Step 2: Socratic Question',
        prompt: 'A ball thrown high spends more time in the air. A ball thrown low travels faster horizontally. Could a high arc and a flat drive cover the same horizontal ground?'
      },
      step3_sweep: {
        title: 'Step 3: Controlled Angle Sweep',
        prompt: 'Run the sweep below. Observe the symmetry around 45°.'
      },
      step4_revise: {
        title: 'Step 4: Revise Your Hypothesis',
        prompt: 'What mathematical relation connects the two launch angles that hit the 60 m target?'
      }
    },
    2: {
      step1_name_the_gap: {
        title: 'Step 1: Inspect the Prediction Gap',
        prompt: 'At 15 m/s, the ball reached 22.6 m. At 30 m/s (double speed), did the ball land near your predicted distance, or did it overshoot dramatically?'
      },
      step2_socratic_question: {
        title: 'Step 2: Think About Speed and Time',
        prompt: 'When you double launch speed, both the horizontal velocity (vx) AND the time of flight (T) increase simultaneously. What happens when you multiply two quantities that both grew?'
      },
      step3_sweep: {
        title: 'Step 3: Controlled Speed Sweep (10 m/s to 35 m/s)',
        prompt: 'Notice the curvature of the Range-vs-Speed graph below. Does the curve look like a straight diagonal line, or does it bend upward steeply?'
      },
      step4_revise: {
        title: 'Step 4: Revise Your Hypothesis',
        prompt: 'How does range actually change when speed increases? State your revised prediction rule.'
      }
    },
    3: {
      step1_name_the_gap: {
        title: 'Step 1: Challenge the 45° Assumption',
        prompt: 'You tested 45° from the 20 m cliff, but flatter angles went farther! Why does textbook physics say 45° is optimal?'
      },
      step2_socratic_question: {
        title: 'Step 2: What Did the Cliff Change?',
        prompt: 'On flat ground, you need a high angle to stay in the air. But from a 20 m cliff, gravity gives you plenty of free fall time. Why waste your launch speed pointing upwards?'
      },
      step3_sweep: {
        title: 'Step 3: Controlled Angle Sweep (Cliff h = 20 m)',
        prompt: 'Inspect the Range-vs-Angle curve below. Where is the highest peak located relative to 45°?'
      },
      step4_revise: {
        title: 'Step 4: Revise Your Hypothesis',
        prompt: 'Formulate a revised rule for how the best launch angle changes when launching from a height.'
      }
    }
  };

  return {
    diagnose,
    generateControlledSweep,
    LADDER_CONTENT
  };
});
