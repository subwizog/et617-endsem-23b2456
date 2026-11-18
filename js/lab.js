// Virtual Laboratory Screen Controller
// Handles Canvas rendering, dynamic auto-scaling, trajectory animation, ghost paths, and C3 mobile controls.

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.LabController = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Active lab variable state
  let currentTheta = 45;
  let currentV = 20;
  let currentH = 0;
  let currentChallengeId = 1;

  // Animation state
  let isAnimating = false;
  let animProgress = 0; // 0 to 1
  let animTrajectory = null;
  let animStartTime = 0;

  // Canvas elements and contexts
  let canvas = null;
  let ctx = null;
  let dpr = 1;

  // Challenge configs for locks and targets (defined here so lab works immediately in Phase 2)
  const LAB_CHALLENGE_SETTINGS = {
    1: {
      name: 'The Bullseye',
      target: 60, // meters
      targetTol: 2.0,
      locked: {
        v: { val: 25, reason: 'Fixed at 25 m/s for target task' },
        h: { val: 0, reason: 'Flat ground (h = 0)' }
      },
      defaults: { theta: 45, v: 25, h: 0 }
    },
    2: {
      name: 'Double Trouble',
      target: null,
      locked: {
        theta: { val: 40, reason: 'Fixed at 40° for speed comparison' },
        h: { val: 0, reason: 'Flat ground (h = 0)' }
      },
      defaults: { theta: 40, v: 15, h: 0 }
    },
    3: {
      name: 'The Cliff Shot',
      target: null,
      locked: {
        v: { val: 10, reason: 'Fixed at 10 m/s' },
        h: { val: 20, reason: 'Cliff height 20 m' }
      },
      defaults: { theta: 45, v: 10, h: 20 }
    },
    4: {
      name: 'Olympiad Stretch',
      target: null,
      locked: {},
      defaults: { theta: 30, v: 15, h: 30 }
    }
  };

  /**
   * Initializes the Lab canvas and event bindings
   */
  function init() {
    canvas = document.getElementById('sim-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    dpr = window.devicePixelRatio || 1;

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    bindControls();
    loadChallenge(currentChallengeId);
    drawScene();
  }

  /**
   * Adjusts canvas backing resolution for sharp mobile rendering
   */
  function resizeCanvas() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 328;
    const height = Math.min(220, Math.max(180, width * 0.58));

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.height = `${height}px`;

    ctx.resetTransform?.();
    ctx.scale(dpr, dpr);
    drawScene();
  }

  /**
   * Loads a challenge's variable defaults and locked states
   */
  function loadChallenge(challengeId) {
    currentChallengeId = Number(challengeId) || 1;
    const settings = LAB_CHALLENGE_SETTINGS[currentChallengeId] || LAB_CHALLENGE_SETTINGS[1];

    // Apply defaults
    currentTheta = settings.defaults.theta;
    currentV = settings.defaults.v;
    currentH = settings.defaults.h;

    // Apply lock overrides
    if (settings.locked.theta) currentTheta = settings.locked.theta.val;
    if (settings.locked.v) currentV = settings.locked.v.val;
    if (settings.locked.h) currentH = settings.locked.h.val;

    // Update UI controls
    updateControlUI('theta', currentTheta, settings.locked.theta);
    updateControlUI('v', currentV, settings.locked.v);
    updateControlUI('h', currentH, settings.locked.h);

    // Update challenge title badge if available
    const headerEl = document.getElementById('lab-challenge-title');
    if (headerEl) {
      headerEl.textContent = `Challenge ${currentChallengeId}: ${settings.name}`;
    }

    // Reset readouts
    updateReadouts(null);
    drawScene();
  }

  /**
   * Updates stepper and slider UI state (including locked states)
   */
  function updateControlUI(variable, value, lockInfo) {
    const valueEl = document.getElementById(`val-${variable}`);
    const sliderEl = document.getElementById(`slider-${variable}`);
    const minusBtn = document.getElementById(`btn-minus-${variable}`);
    const plusBtn = document.getElementById(`btn-plus-${variable}`);
    const lockNote = document.getElementById(`lock-note-${variable}`);
    const container = document.getElementById(`control-group-${variable}`);

    const unit = CONFIG.LIMITS[variable].unit;

    if (valueEl) valueEl.textContent = `${Math.round(value)} ${unit}`;
    if (sliderEl) sliderEl.value = value;

    if (lockInfo) {
      if (minusBtn) minusBtn.disabled = true;
      if (plusBtn) plusBtn.disabled = true;
      if (sliderEl) sliderEl.disabled = true;
      if (lockNote) {
        lockNote.textContent = `🔒 ${lockInfo.reason}`;
        lockNote.style.display = 'block';
      }
      if (container) container.classList.add('locked-var');
    } else {
      if (minusBtn) minusBtn.disabled = false;
      if (plusBtn) plusBtn.disabled = false;
      if (sliderEl) sliderEl.disabled = false;
      if (lockNote) {
        lockNote.textContent = '';
        lockNote.style.display = 'none';
      }
      if (container) container.classList.remove('locked-var');
    }
  }

  /**
   * Connects DOM steppers, sliders, Launch and Reset buttons
   */
  function bindControls() {
    // Steppers and sliders
    ['theta', 'v', 'h'].forEach((varName) => {
      const config = CONFIG.LIMITS[varName];

      const minusBtn = document.getElementById(`btn-minus-${varName}`);
      const plusBtn = document.getElementById(`btn-plus-${varName}`);
      const slider = document.getElementById(`slider-${varName}`);

      if (minusBtn) {
        minusBtn.onclick = () => {
          changeVariable(varName, -config.step);
        };
      }
      if (plusBtn) {
        plusBtn.onclick = () => {
          changeVariable(varName, config.step);
        };
      }
      if (slider) {
        slider.oninput = (e) => {
          setVariable(varName, Number(e.target.value));
        };
      }
    });

    // Launch button
    const launchBtn = document.getElementById('btn-launch');
    if (launchBtn) {
      launchBtn.onclick = () => {
        if (!isAnimating) {
          launchProjectile();
        }
      };
    }

    // Reset trials button
    const resetBtn = document.getElementById('btn-reset-trials');
    if (resetBtn) {
      resetBtn.onclick = () => {
        if (confirm('Clear all trials for this challenge?')) {
          AppState.clearTrials(currentChallengeId);
          updateReadouts(null);
          drawScene();
          showNotification('Trials cleared');
        }
      };
    }
  }

  function changeVariable(varName, delta) {
    const limits = CONFIG.LIMITS[varName];
    let val = varName === 'theta' ? currentTheta : varName === 'v' ? currentV : currentH;
    val = Math.max(limits.min, Math.min(limits.max, val + delta));
    setVariable(varName, val);
  }

  function setVariable(varName, val) {
    if (varName === 'theta') currentTheta = val;
    else if (varName === 'v') currentV = val;
    else if (varName === 'h') currentH = val;

    const settings = LAB_CHALLENGE_SETTINGS[currentChallengeId];
    updateControlUI(varName, val, settings.locked[varName]);
    drawScene();
  }

  /**
   * Triggers the launch, animates trajectory, and records trial to AppState
   */
  function launchProjectile() {
    const sim = Physics.simulate(currentTheta, currentV, currentH, CONFIG.G, CONFIG.PATH_POINTS);
    animTrajectory = sim;
    isAnimating = true;
    animStartTime = performance.now();

    const duration = Math.min(2200, Math.max(800, sim.T * 400)); // Scaled animation duration

    function animate(currentTime) {
      const elapsed = currentTime - animStartTime;
      animProgress = Math.min(1, elapsed / duration);

      drawScene();

      if (animProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        isAnimating = false;
        onLaunchComplete(sim);
      }
    }

    requestAnimationFrame(animate);
  }

  /**
   * Handles post-launch updates: saves trial, updates readouts, evaluates target hit
   */
  function onLaunchComplete(sim) {
    const trial = AppState.addTrial({
      challengeId: currentChallengeId,
      theta: sim.theta,
      v: sim.v,
      h: sim.h,
      R: Number(sim.R.toFixed(2)),
      H: Number(sim.H.toFixed(2)),
      T: Number(sim.T.toFixed(2)),
      path: sim.path
    });

    updateReadouts(sim);
    drawScene();

    // Check target hit for Challenge 1
    const settings = LAB_CHALLENGE_SETTINGS[currentChallengeId];
    if (settings && settings.target) {
      const diff = Math.abs(sim.R - settings.target);
      if (diff <= settings.targetTol) {
        showNotification(`🎯 DIRECT HIT! Range: ${sim.R.toFixed(1)} m at ${sim.theta}°`, 'success');
      } else {
        showNotification(`Landed at ${sim.R.toFixed(1)} m (${diff > 0 ? (sim.R > settings.target ? 'overshot' : 'undershot') : ''} by ${diff.toFixed(1)} m)`, 'info');
      }
    }
  }

  /**
   * Updates range, max height, and time of flight readout elements
   */
  function updateReadouts(sim) {
    const rEl = document.getElementById('readout-range');
    const hEl = document.getElementById('readout-height');
    const tEl = document.getElementById('readout-time');

    if (sim) {
      if (rEl) rEl.textContent = `${sim.R.toFixed(1)} m`;
      if (hEl) hEl.textContent = `${sim.H.toFixed(1)} m`;
      if (tEl) tEl.textContent = `${sim.T.toFixed(2)} s`;
    } else {
      if (rEl) rEl.textContent = '-- m';
      if (hEl) hEl.textContent = '-- m';
      if (tEl) tEl.textContent = '-- s';
    }
  }

  /**
   * Displays temporary notification banner
   */
  function showNotification(msg, type = 'info') {
    const banner = document.getElementById('lab-notification');
    if (!banner) return;
    banner.textContent = msg;
    banner.className = `lab-toast visible ${type}`;
    setTimeout(() => {
      banner.className = 'lab-toast';
    }, 3500);
  }

  /**
   * Main rendering routine: draws ground, cliff, ghost paths, target, and active projectile
   */
  function drawScene() {
    if (!canvas || !ctx) return;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.clearRect(0, 0, w, h);

    // Sky background gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#eaf2fd');
    skyGrad.addColorStop(1, '#ffffff');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    const trials = AppState.getTrials(currentChallengeId);
    const settings = LAB_CHALLENGE_SETTINGS[currentChallengeId] || {};

    // 1. Calculate dynamic coordinate bounds (auto-scaling)
    let maxWorldX = 35; // minimum range view
    let maxWorldY = 15; // minimum height view

    if (settings.target) {
      maxWorldX = Math.max(maxWorldX, settings.target + 12);
    }

    trials.forEach((t) => {
      if (t.R) maxWorldX = Math.max(maxWorldX, t.R + 6);
      if (t.H) maxWorldY = Math.max(maxWorldY, t.H + 4);
    });

    // Check preview trajectory if not currently animating
    const previewSim = Physics.simulate(currentTheta, currentV, currentH, CONFIG.G, CONFIG.PATH_POINTS);
    maxWorldX = Math.max(maxWorldX, previewSim.R + 6);
    maxWorldY = Math.max(maxWorldY, previewSim.H + 4);

    const padLeft = 32;
    const padRight = 16;
    const padBottom = 26;
    const padTop = 18;

    const drawW = w - padLeft - padRight;
    const drawH = h - padBottom - padTop;

    function worldToScreen(wx, wy) {
      const sx = padLeft + (wx / maxWorldX) * drawW;
      const sy = h - padBottom - (wy / maxWorldY) * drawH;
      return { x: sx, y: sy };
    }

    // 2. Draw Ground
    const groundY = h - padBottom;
    ctx.strokeStyle = '#34a853';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(padLeft - 10, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();

    // Ground fill underneath
    ctx.fillStyle = '#f1f8e9';
    ctx.fillRect(0, groundY + 1.5, w, padBottom);

    // Distance markers on ground
    ctx.fillStyle = '#5f6368';
    ctx.font = '10px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    const xStep = maxWorldX > 70 ? 20 : 10;
    for (let wx = xStep; wx < maxWorldX; wx += xStep) {
      const p = worldToScreen(wx, 0);
      ctx.beginPath();
      ctx.moveTo(p.x, groundY);
      ctx.lineTo(p.x, groundY + 4);
      ctx.strokeStyle = '#9aa0a6';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillText(`${wx}m`, p.x, groundY + 14);
    }

    // 3. Draw Cliff if h > 0
    if (currentH > 0) {
      const cliffTop = worldToScreen(0, currentH);
      const cliffBottom = worldToScreen(0, 0);

      ctx.fillStyle = '#795548';
      ctx.fillRect(0, cliffTop.y, cliffTop.x, groundY - cliffTop.y);

      // Cliff edge border
      ctx.strokeStyle = '#4e342e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, cliffTop.y);
      ctx.lineTo(cliffTop.x, cliffTop.y);
      ctx.lineTo(cliffBottom.x, groundY);
      ctx.stroke();

      // Cliff height label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText(`${currentH}m`, cliffTop.x / 2, cliffTop.y + 14);
    }

    // 4. Draw Target Marker (if present)
    if (settings.target) {
      const tp = worldToScreen(settings.target, 0);
      const tolLeft = worldToScreen(settings.target - settings.targetTol, 0);
      const tolRight = worldToScreen(settings.target + settings.targetTol, 0);

      // Target hit zone zone
      ctx.fillStyle = 'rgba(234, 67, 53, 0.15)';
      ctx.fillRect(tolLeft.x, groundY - 6, tolRight.x - tolLeft.x, 6);

      // Flag pole
      ctx.strokeStyle = '#d93025';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tp.x, groundY);
      ctx.lineTo(tp.x, groundY - 26);
      ctx.stroke();

      // Flag banner
      ctx.fillStyle = '#ea4335';
      ctx.beginPath();
      ctx.moveTo(tp.x, groundY - 26);
      ctx.lineTo(tp.x + 14, groundY - 20);
      ctx.lineTo(tp.x, groundY - 14);
      ctx.fill();

      // Target text
      ctx.fillStyle = '#c5221f';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(`🎯 ${settings.target}m`, tp.x, groundY - 30);
    }

    // 5. Draw Ghost Paths of previous trials
    trials.forEach((trial, index) => {
      if (!trial.path || trial.path.length === 0) return;

      ctx.beginPath();
      const p0 = worldToScreen(trial.path[0].x, trial.path[0].y);
      ctx.moveTo(p0.x, p0.y);

      for (let i = 1; i < trial.path.length; i++) {
        const pt = worldToScreen(trial.path[i].x, trial.path[i].y);
        ctx.lineTo(pt.x, pt.y);
      }

      ctx.strokeStyle = 'rgba(26, 115, 232, 0.35)';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label trial ghost at peak or landing
      const lastPt = trial.path[trial.path.length - 1];
      const lp = worldToScreen(lastPt.x, lastPt.y);
      ctx.fillStyle = 'rgba(21, 87, 176, 0.6)';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText(`#${trial.challengeTrialIndex || index + 1} (${trial.theta}°)`, lp.x, lp.y - 6);
    });

    // 6. Draw Aiming Vector at launch point
    const origin = worldToScreen(0, currentH);
    const rad = (currentTheta * Math.PI) / 180;
    const aimLen = 22;
    const aimX = origin.x + aimLen * Math.cos(rad);
    const aimY = origin.y - aimLen * Math.sin(rad);

    ctx.strokeStyle = '#f2994a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(aimX, aimY);
    ctx.stroke();

    // Cannon pivot circle
    ctx.fillStyle = '#202124';
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, 4, 0, Math.PI * 2);
    ctx.fill();

    // 7. Draw Trajectory / Projectile (Active Launch)
    if (isAnimating && animTrajectory) {
      const pts = animTrajectory.path;
      const count = Math.floor(animProgress * pts.length);

      // Trajectory line so far
      ctx.beginPath();
      const first = worldToScreen(pts[0].x, pts[0].y);
      ctx.moveTo(first.x, first.y);

      for (let i = 1; i < count; i++) {
        const pt = worldToScreen(pts[i].x, pts[i].y);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = '#1a73e8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Current projectile ball
      if (count > 0 && count < pts.length) {
        const curr = worldToScreen(pts[count].x, pts[count].y);
        ctx.fillStyle = '#d93025';
        ctx.beginPath();
        ctx.arc(curr.x, curr.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    } else {
      // Idle preview (dotted light guideline)
      ctx.beginPath();
      const p0 = worldToScreen(previewSim.path[0].x, previewSim.path[0].y);
      ctx.moveTo(p0.x, p0.y);
      for (let i = 1; i < previewSim.path.length; i++) {
        const pt = worldToScreen(previewSim.path[i].x, previewSim.path[i].y);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = 'rgba(26, 115, 232, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  return {
    init,
    loadChallenge,
    launchProjectile,
    resizeCanvas,
    getVariables: () => ({ theta: currentTheta, v: currentV, h: currentH })
  };
});
