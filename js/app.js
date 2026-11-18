// Main Router and Application Orchestration Shell
// Handles hash navigation, screen rendering, dynamic challenge content, results evaluation, support ladder, and summary.

(function () {
  'use strict';

  const ROUTES = {
    'home': { screenId: 'screen-home', navId: 'nav-home', title: 'Challenge Roadmap' },
    'predict': { screenId: 'screen-predict', navId: 'nav-home', title: 'Hypothesis & Prediction' },
    'lab': { screenId: 'screen-lab', navId: 'nav-lab', title: 'Virtual Lab' },
    'results': { screenId: 'screen-results', navId: 'nav-results', title: 'Trial Results' },
    'support': { screenId: 'screen-support', navId: 'nav-results', title: 'Inquiry Support' },
    'summary': { screenId: 'screen-summary', navId: 'nav-home', title: 'Journey Summary' },
    'about': { screenId: 'screen-about', navId: 'nav-about', title: 'About & Card Token' }
  };

  function parseHash() {
    const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
    if (!rawHash) {
      return { name: 'home', id: '1' };
    }
    const parts = rawHash.split('/');
    const name = parts[0] ? parts[0].toLowerCase() : 'home';
    const id = parts[1] || '1';
    return { name, id };
  }

  function handleRoute() {
    const { name, id } = parseHash();
    const routeConfig = ROUTES[name] || ROUTES['home'];

    // 1. Hide all screen sections
    const screens = document.querySelectorAll('.screen');
    screens.forEach((section) => {
      section.classList.remove('active');
    });

    // 2. Activate target screen
    const targetSection = document.getElementById(routeConfig.screenId);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // 3. Update bottom navigation item active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item) => item.classList.remove('active'));
    if (routeConfig.navId) {
      const activeNav = document.getElementById(routeConfig.navId);
      if (activeNav) {
        activeNav.classList.add('active');
      }
    }

    // 4. Update dynamic links and labels
    updateChallengeContext(name, id);

    // 5. Screen specific renderers
    if (name === 'home') {
      renderHomeScreen();
    } else if (name === 'predict') {
      renderPredictScreen(id);
    } else if (name === 'lab') {
      if (window.LabController) {
        window.LabController.loadChallenge(id);
        setTimeout(() => {
          window.LabController.resizeCanvas();
        }, 30);
      }
    } else if (name === 'results') {
      renderResultsScreen(id);
    } else if (name === 'support') {
      renderSupportScreen(id);
    } else if (name === 'summary') {
      renderSummaryScreen();
    }

    // 6. Ensure scroll resets to top of view
    window.scrollTo(0, 0);
  }

  function updateChallengeContext(routeName, challengeId) {
    const navLab = document.getElementById('nav-lab');
    if (navLab) navLab.href = `#/lab/${challengeId}`;

    const navResults = document.getElementById('nav-results');
    if (navResults) navResults.href = `#/results/${challengeId}`;

    const labResults = document.getElementById('lab-results-btn');
    if (labResults) labResults.href = `#/results/${challengeId}`;

    const resultsSupport = document.getElementById('results-support-btn');
    if (resultsSupport) resultsSupport.href = `#/support/${challengeId}`;

    const supportRetest = document.getElementById('support-retest-btn');
    if (supportRetest) supportRetest.href = `#/lab/${challengeId}`;
  }

  // ==========================================
  // HOME SCREEN RENDERER
  // ==========================================
  function renderHomeScreen() {
    const container = document.getElementById('home-challenge-list');
    if (!container || !window.AppContent || !window.AppState) return;

    const challenges = window.AppContent.CHALLENGES;
    const state = window.AppState.getState();

    let html = '';
    challenges.forEach((ch) => {
      const isUnlocked = state.unlockedChallenges.includes(ch.id);
      const isCompleted = state.completedChallenges.includes(ch.id);

      const statusBadge = isCompleted
        ? `<span class="badge-status completed">✓ Completed</span>`
        : isUnlocked
        ? `<span class="badge-status unlocked">Active</span>`
        : `<span class="badge-status">🔒 Locked</span>`;

      const trialsCount = window.AppState.getTrials(ch.id).length;
      const trialBadge = trialsCount > 0 ? `<span style="font-size:11px; color:var(--text-muted);">(${trialsCount} trials)</span>` : '';

      const btnHtml = isUnlocked
        ? `<div class="btn-row">
            <a href="#/predict/${ch.id}" class="btn btn-secondary" style="font-size: 13px;">Hypothesis</a>
            <a href="#/lab/${ch.id}" class="btn btn-primary" style="font-size: 13px;">Virtual Lab</a>
           </div>`
        : `<button class="btn btn-secondary" disabled style="opacity: 0.5;">Complete Previous Challenge</button>`;

      html += `
        <div class="card" id="card-ch${ch.id}">
          <div class="card-title">
            <span>${ch.badge}: ${ch.name} ${trialBadge}</span>
            ${statusBadge}
          </div>
          <div class="card-desc">${ch.description}</div>
          ${btnHtml}
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // ==========================================
  // PREDICT SCREEN RENDERER
  // ==========================================
  function renderPredictScreen(challengeId) {
    const challenge = window.AppContent.getChallenge(challengeId);
    const container = document.getElementById('predict-container');
    const titleEl = document.getElementById('predict-challenge-title');
    const descEl = document.getElementById('predict-challenge-desc');
    const proceedBtn = document.getElementById('predict-proceed-btn');

    if (titleEl) titleEl.textContent = `${challenge.badge}: ${challenge.name}`;
    if (descEl) descEl.textContent = challenge.subtitle;
    if (proceedBtn) proceedBtn.href = `#/lab/${challenge.id}`;

    const savedHypothesis = window.AppState.getHypothesis(challenge.id) || {};
    let formHtml = '';

    if (challenge.predict.type === 'mcq') {
      formHtml = `
        <div style="text-align: left;">
          <p style="font-weight: 600; font-size: 14.5px; color: var(--text-main); margin-bottom: 8px;">
            ${challenge.predict.question}
          </p>
          <div class="mcq-option-list">
      `;

      challenge.predict.options.forEach((opt) => {
        const isSelected = savedHypothesis.selected === opt.id;
        formHtml += `
          <label class="mcq-option ${isSelected ? 'selected' : ''}" data-opt-id="${opt.id}">
            <input type="radio" name="predict-opt" value="${opt.id}" ${isSelected ? 'checked' : ''}>
            <span>${opt.label}</span>
          </label>
        `;
      });

      formHtml += `
          </div>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 6px;">
            💡 <em>Hint: ${challenge.predict.hint}</em>
          </div>
        </div>
      `;
    } else if (challenge.predict.type === 'numeric') {
      const currentVal = savedHypothesis.prediction !== undefined ? savedHypothesis.prediction : '';
      formHtml = `
        <div style="text-align: left;">
          <div class="baseline-box">
            <strong>Baseline Test:</strong> At speed $v = 15\\text{ m/s}$ ($\\theta = 40^\\circ$), the measured range was <strong>22.6 m</strong>.
          </div>
          <p style="font-weight: 600; font-size: 14.5px; color: var(--text-main); margin-bottom: 8px;">
            ${challenge.predict.question}
          </p>
          <div class="numeric-input-group">
            <input type="number" step="0.5" class="num-input" id="predict-num-input" placeholder="e.g. 45 or 90" value="${currentVal}">
            <span class="unit-addon">meters</span>
          </div>
          <div style="font-size: 12px; color: var(--text-muted);">
            💡 <em>${challenge.predict.hint}</em>
          </div>
        </div>
      `;
    } else if (challenge.predict.type === 'text') {
      const currentVal = savedHypothesis.text || '';
      formHtml = `
        <div style="text-align: left;">
          <p style="font-weight: 600; font-size: 14.5px; color: var(--text-main); margin-bottom: 8px;">
            ${challenge.predict.question}
          </p>
          <textarea id="predict-text-input" rows="4" style="width: 100%; border: 1.5px solid var(--border); border-radius: 8px; padding: 10px; font-size: 14px; font-family: inherit; margin: 8px 0;" placeholder="Write your hypothesis and physical justification...">${currentVal}</textarea>
          <div style="font-size: 12px; color: var(--text-muted);">
            💡 <em>${challenge.predict.hint}</em>
          </div>
        </div>
      `;
    }

    container.innerHTML = formHtml;

    // Attach event listeners for real-time saving
    if (challenge.predict.type === 'mcq') {
      const options = container.querySelectorAll('.mcq-option');
      options.forEach((opt) => {
        opt.onclick = () => {
          options.forEach((o) => o.classList.remove('selected'));
          opt.classList.add('selected');
          const radio = opt.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;
          const optId = opt.getAttribute('data-opt-id');
          const selectedObj = challenge.predict.options.find((o) => o.id === optId);
          window.AppState.setHypothesis(challenge.id, {
            selected: optId,
            text: selectedObj ? selectedObj.label : ''
          });
        };
      });
    } else if (challenge.predict.type === 'numeric') {
      const numInput = document.getElementById('predict-num-input');
      if (numInput) {
        numInput.oninput = (e) => {
          window.AppState.setHypothesis(challenge.id, {
            prediction: Number(e.target.value)
          });
        };
      }
    } else if (challenge.predict.type === 'text') {
      const txtInput = document.getElementById('predict-text-input');
      if (txtInput) {
        txtInput.oninput = (e) => {
          window.AppState.setHypothesis(challenge.id, {
            text: e.target.value
          });
        };
      }
    }
  }

  // ==========================================
  // RESULTS SCREEN RENDERER (WITH STRICT PEDAGOGICAL FIX)
  // ==========================================
  function renderResultsScreen(challengeId) {
    const challenge = window.AppContent.getChallenge(challengeId);
    const container = document.getElementById('results-container');
    const titleEl = document.getElementById('results-title');
    const supportBtn = document.getElementById('results-support-btn');

    if (titleEl) titleEl.textContent = `${challenge.badge}: Results & Analysis`;
    if (supportBtn) supportBtn.href = `#/support/${challenge.id}`;

    const trials = window.AppState.getTrials(challenge.id);
    const hypothesis = window.AppState.getHypothesis(challenge.id) || {};
    const state = window.AppState.getState();
    const hasCompletedSupport = Boolean(state.supportLevel && state.supportLevel[challenge.id] >= 4);

    let predParam = null;
    if (challenge.predict.type === 'mcq') predParam = hypothesis.selected;
    else if (challenge.predict.type === 'numeric') predParam = hypothesis.prediction;
    else if (challenge.predict.type === 'text') predParam = hypothesis.text;

    // Run diagnosis
    const diagnosis = window.DiagnoseEngine.diagnose(challenge.id, trials, hypothesis, state.supportLevel[challenge.id] || 0);

    // Evaluate trials respecting the pedagogical fix
    const evaluation = challenge.evaluateTrials(trials, predParam, hasCompletedSupport);

    if (evaluation.isComplete) {
      window.AppState.markCompleted(challenge.id);
      window.AppState.unlockChallenge(Number(challenge.id) + 1);
    }

    let html = '';

    // 1. Prediction vs Result Evaluation Card
    html += `
      <div class="card" style="background: ${evaluation.isComplete ? '#e6f4ea' : '#f8f9fa'}; border-left: 4px solid ${evaluation.isComplete ? 'var(--success)' : (diagnosis.needsSupport ? 'var(--warning)' : 'var(--primary)')}; text-align: left;">
        <div class="card-title" style="color: ${evaluation.isComplete ? '#0d652d' : (diagnosis.needsSupport ? '#b06000' : 'var(--primary-dark)')};">
          <span>${evaluation.isComplete ? '✓ Objective Completed' : (diagnosis.needsSupport ? '⚠️ Inquiry Gap Identified' : 'Inquiry in Progress')}</span>
          <span class="badge-status ${evaluation.isComplete ? 'completed' : ''}">${trials.length} Launches</span>
        </div>
        <div style="font-size: 13.5px; line-height: 1.55; margin-top: 6px; white-space: pre-line;">
          ${evaluation.feedback}
        </div>
      </div>
    `;

    // 2. Misconception / Confounding Support Gateway Card
    if (diagnosis.needsSupport && !evaluation.isComplete) {
      html += `
        <div class="card" style="background: #fff8e1; border: 1.5px solid #ffe082; text-align: left;">
          <div class="card-title" style="color: #b06000;">
            <span>🪜 Inquiry Support Recommended</span>
            <span class="badge-tag" style="background:#ffe082; color:#5d4037;">Step-by-Step</span>
          </div>
          <p style="font-size: 13px; color: #5d4037; margin: 4px 0 10px;">
            ${diagnosis.flags.includes('M2') ? 'Speed doubling did not follow a simple linear path. Discover the relationship through a controlled speed sweep.' : (diagnosis.flags.includes('M1') ? 'The 45° textbook rule was outperformed from the cliff. Run a controlled angle sweep to locate the true optimum.' : (diagnosis.flags.includes('CONFOUNDED') ? 'Multiple variables changed at once between your trials. Use the support ladder to isolate one variable at a time.' : 'Your prediction and result do not match. Inspect the support ladder to uncover why.'))}
          </p>
          <a href="#/support/${challenge.id}" class="btn btn-accent" style="font-size: 14px;">Enter Support Ladder &rarr;</a>
        </div>
      `;
    }

    // 3. Harder Follow-Up for Correct Learners
    if (evaluation.isComplete && diagnosis.harderFollowUp) {
      html += `
        <div class="harder-followup-card">
          <div class="harder-followup-title">⚡ Olympiad Extension: Harder Follow-Up</div>
          <div class="harder-followup-text">${diagnosis.harderFollowUp}</div>
        </div>
      `;
    }

    // 4. Mini Bar Chart of Launches
    if (trials.length > 0) {
      const maxR = Math.max(...trials.map((t) => t.R), 40);
      html += `
        <div class="card" style="text-align: left;">
          <div class="card-title">
            <span>Range Visual Comparison</span>
            <span style="font-size: 11px; color: var(--text-muted);">Max: ${maxR.toFixed(1)} m</span>
          </div>
          <div class="mini-chart">
      `;

      trials.forEach((t) => {
        const pct = Math.min(100, Math.max(8, (t.R / maxR) * 100));
        const isHit = challenge.target && Math.abs(t.R - challenge.target) <= challenge.targetTol;
        html += `
          <div class="chart-bar-row">
            <span class="chart-label">#${t.challengeTrialIndex || t.id} (${t.theta}°)</span>
            <div class="chart-bar-bg">
              <div class="chart-bar-fill ${isHit ? 'hit' : ''}" style="width: ${pct}%;"></div>
            </div>
            <span class="chart-val">${t.R.toFixed(1)}m</span>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;

      // 5. Full Trial History Table
      html += `
        <div class="card" style="text-align: left;">
          <div class="card-title">
            <span>Trial Log</span>
            <span style="font-size: 11px; color: var(--text-muted);">${trials.length} records</span>
          </div>
          <div class="table-responsive">
            <table class="trial-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>θ</th>
                  <th>v</th>
                  <th>h</th>
                  <th>Range (R)</th>
                  <th>Flight (T)</th>
                </tr>
              </thead>
              <tbody>
      `;

      trials.forEach((t) => {
        const isHit = challenge.target && Math.abs(t.R - challenge.target) <= challenge.targetTol;
        html += `
          <tr class="${isHit ? 'highlight-hit' : ''}">
            <td><strong>#${t.challengeTrialIndex || t.id}</strong></td>
            <td>${t.theta}°</td>
            <td>${t.v} m/s</td>
            <td>${t.h} m</td>
            <td><strong>${t.R.toFixed(1)} m</strong> ${isHit ? '🎯' : ''}</td>
            <td>${t.T.toFixed(2)} s</td>
          </tr>
        `;
      });

      html += `
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="route-placeholder" style="margin-bottom: 12px;">
          <p>No trials recorded for this challenge yet. Head to the Virtual Lab and launch your first shot!</p>
        </div>
      `;
    }

    // 6. Spot the Flaw Task (Interactive Component for Challenge 2)
    if (Number(challengeId) === 2) {
      const task = window.AppContent.SPOT_THE_FLAW_TASK;
      html += `
        <div class="card spot-flaw-card" style="text-align: left; margin-top: 10px;">
          <div class="card-title" style="color: #b06000;">
            <span>🔬 ${task.title}</span>
            <span class="badge-tag" style="background:#ffe082; color:#5d4037;">Inquiry Skill</span>
          </div>
          <div style="font-size: 13px; line-height: 1.5; white-space: pre-line; margin: 6px 0;">
            ${task.scenario}
          </div>
          <p style="font-weight: 600; font-size: 13.5px; margin-top: 8px;">${task.question}</p>
          <div class="mcq-option-list" id="spot-flaw-options">
      `;

      task.options.forEach((opt) => {
        html += `
          <button type="button" class="mcq-option btn-spot-flaw" data-correct="${opt.isCorrect}" style="text-align: left; font-size: 13px; width: 100%;">
            ${opt.label}
          </button>
        `;
      });

      html += `
          </div>
          <div id="spot-flaw-feedback" style="display: none; font-size: 12.5px; padding: 8px; border-radius: 6px; margin-top: 6px;"></div>
        </div>
      `;
    }

    container.innerHTML = html;

    // Attach Spot the flaw handler
    if (Number(challengeId) === 2) {
      const flawBtns = container.querySelectorAll('.btn-spot-flaw');
      const feedbackBox = document.getElementById('spot-flaw-feedback');
      flawBtns.forEach((btn) => {
        btn.onclick = () => {
          const isCorrect = btn.getAttribute('data-correct') === 'true';
          flawBtns.forEach((b) => (b.style.pointerEvents = 'none'));
          if (feedbackBox) {
            feedbackBox.style.display = 'block';
            if (isCorrect) {
              btn.style.borderColor = 'var(--success)';
              btn.style.backgroundColor = '#e6f4ea';
              feedbackBox.style.background = '#e6f4ea';
              feedbackBox.style.color = '#0d652d';
              feedbackBox.innerHTML = `<strong>Correct!</strong> ${window.AppContent.SPOT_THE_FLAW_TASK.explanation}`;
            } else {
              btn.style.borderColor = 'var(--danger)';
              btn.style.backgroundColor = '#fce8e6';
              feedbackBox.style.background = '#fce8e6';
              feedbackBox.style.color = '#c5221f';
              feedbackBox.innerHTML = `<strong>Not quite.</strong> ${window.AppContent.SPOT_THE_FLAW_TASK.explanation}`;
            }
          }
        };
      });
    }
  }

  // ==========================================
  // SUPPORT SCREEN RENDERER (4-STEP LADDER & GRAPH)
  // ==========================================
  let currentLadderStep = 1;

  function renderSupportScreen(challengeId) {
    const numId = Number(challengeId) || 1;
    const challenge = window.AppContent.getChallenge(numId);
    const container = document.getElementById('support-container');
    const titleEl = document.getElementById('support-title');
    const ladderContent = window.DiagnoseEngine.LADDER_CONTENT[numId] || window.DiagnoseEngine.LADDER_CONTENT[1];

    if (titleEl) titleEl.textContent = `Support Ladder: ${challenge.name}`;

    const trials = window.AppState.getTrials(numId);
    const hypothesis = window.AppState.getHypothesis(numId) || {};

    let stepHtml = '';

    // Stepper Navigation Indicator
    stepHtml += `
      <div class="ladder-stepper-nav">
        <div class="ladder-step-indicator ${currentLadderStep === 1 ? 'active' : (currentLadderStep > 1 ? 'done' : '')}">
          <span class="ladder-step-circle">1</span> Gap
        </div>
        <div class="ladder-step-indicator ${currentLadderStep === 2 ? 'active' : (currentLadderStep > 2 ? 'done' : '')}">
          <span class="ladder-step-circle">2</span> Think
        </div>
        <div class="ladder-step-indicator ${currentLadderStep === 3 ? 'active' : (currentLadderStep > 3 ? 'done' : '')}">
          <span class="ladder-step-circle">3</span> Sweep
        </div>
        <div class="ladder-step-indicator ${currentLadderStep === 4 ? 'active' : ''}">
          <span class="ladder-step-circle">4</span> Revise
        </div>
      </div>
    `;

    // Step 1: Name the gap
    if (currentLadderStep === 1) {
      stepHtml += `
        <div class="card" style="text-align: left;">
          <div class="card-title">
            <span>${ladderContent.step1_name_the_gap.title}</span>
            <span class="badge-tag">Rung 1</span>
          </div>
          <p style="font-size: 13.5px; line-height: 1.5; color: var(--text-main); margin: 8px 0;">
            ${ladderContent.step1_name_the_gap.prompt}
          </p>
          <div class="baseline-box" style="margin-top: 10px;">
            <strong>Your hypothesis/prediction:</strong> ${hypothesis.prediction || hypothesis.selected || hypothesis.text || 'Not entered yet'}<br>
            <strong>Launches recorded:</strong> ${trials.length}
          </div>
          <button type="button" class="btn btn-primary" id="btn-ladder-next-2" style="margin-top: 14px;">
            Next Step: Socratic Reflection &rarr;
          </button>
        </div>
      `;
    }

    // Step 2: Socratic Question
    else if (currentLadderStep === 2) {
      stepHtml += `
        <div class="card" style="text-align: left;">
          <div class="card-title">
            <span>${ladderContent.step2_socratic_question.title}</span>
            <span class="badge-tag">Rung 2</span>
          </div>
          <div class="socratic-box">
            <strong>🤔 Socratic Inquiry:</strong><br>
            ${ladderContent.step2_socratic_question.prompt}
          </div>
          <button type="button" class="btn btn-primary" id="btn-ladder-next-3" style="margin-top: 12px;">
            Next Step: Run Controlled Variable Sweep &rarr;
          </button>
        </div>
      `;
    }

    // Step 3: Controlled Variable Sweep & Graph
    else if (currentLadderStep === 3) {
      const sweepData = window.DiagnoseEngine.generateControlledSweep(numId);
      stepHtml += `
        <div class="card" style="text-align: left;">
          <div class="card-title">
            <span>${ladderContent.step3_sweep.title}</span>
            <span class="badge-tag">Rung 3</span>
          </div>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 6px;">
            ${sweepData.fixedDesc}
          </p>
          <p style="font-size: 13.5px; line-height: 1.5; color: var(--text-main);">
            ${ladderContent.step3_sweep.prompt}
          </p>

          <!-- Range-vs-Variable Graph -->
          <div class="sweep-graph-container">
            <svg class="sweep-svg" viewBox="0 0 320 160" preserveAspectRatio="none">
              <!-- Grid lines -->
              <line x1="30" y1="130" x2="310" y2="130" stroke="#dadce0" stroke-width="1.5" />
              <line x1="30" y1="20" x2="30" y2="130" stroke="#dadce0" stroke-width="1.5" />
      `;

      // Plot sweep curve
      const maxVal = Math.max(...sweepData.points.map((p) => p.R), 40);
      const pointsSvg = sweepData.points
        .map((p, idx) => {
          const x = 35 + (idx / (sweepData.points.length - 1)) * 265;
          const y = 130 - (p.R / maxVal) * 105;
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(' ');

      stepHtml += `
              <polyline fill="none" stroke="#1a73e8" stroke-width="2.5" points="${pointsSvg}" />
      `;

      // Draw scatter dots and labels
      sweepData.points.forEach((p, idx) => {
        const x = 35 + (idx / (sweepData.points.length - 1)) * 265;
        const y = 130 - (p.R / maxVal) * 105;
        stepHtml += `
          <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" fill="#1557b0" />
          <text x="${x.toFixed(1)}" y="145" font-size="9" text-anchor="middle" fill="#5f6368">${p.label}</text>
        `;
      });

      stepHtml += `
            </svg>
            <div class="sweep-legend">
              <span>Variable Sweep (${sweepData.variableName})</span>
              <span>Horizontal Range (R)</span>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="btn-ladder-next-4" style="margin-top: 10px;">
            Next Step: Revise Hypothesis &rarr;
          </button>
        </div>
      `;
    }

    // Step 4: Revise Hypothesis
    else if (currentLadderStep === 4) {
      stepHtml += `
        <div class="card" style="text-align: left;">
          <div class="card-title">
            <span>${ladderContent.step4_revise.title}</span>
            <span class="badge-tag">Rung 4</span>
          </div>
          <p style="font-size: 13.5px; line-height: 1.5; color: var(--text-main); margin-bottom: 8px;">
            ${ladderContent.step4_revise.prompt}
          </p>
          <textarea id="revise-text-input" rows="3" style="width: 100%; border: 1.5px solid var(--border); border-radius: 8px; padding: 10px; font-size: 13.5px; font-family: inherit; margin: 6px 0;" placeholder="Write your revised hypothesis based on the curve..."></textarea>
          <button type="button" class="btn btn-primary" id="btn-save-revision" style="margin-top: 10px;">
            Save Revision &amp; Retest in Lab &rarr;
          </button>
        </div>
      `;
    }

    container.innerHTML = stepHtml;

    // Attach step transition listeners
    const btn2 = document.getElementById('btn-ladder-next-2');
    if (btn2) btn2.onclick = () => { currentLadderStep = 2; renderSupportScreen(numId); };

    const btn3 = document.getElementById('btn-ladder-next-3');
    if (btn3) btn3.onclick = () => { currentLadderStep = 3; renderSupportScreen(numId); };

    const btn4 = document.getElementById('btn-ladder-next-4');
    if (btn4) btn4.onclick = () => { currentLadderStep = 4; renderSupportScreen(numId); };

    const btnSaveRev = document.getElementById('btn-save-revision');
    if (btnSaveRev) {
      btnSaveRev.onclick = () => {
        const revVal = document.getElementById('revise-text-input')?.value || 'Revised via Support Ladder';
        window.AppState.setSupportLevel(numId, 4);
        window.AppState.setHypothesis(numId, { revised: revVal });
        currentLadderStep = 1;
        window.location.hash = `#/lab/${numId}`;
      };
    }
  }

  // ==========================================
  // SUMMARY SCREEN RENDERER
  // ==========================================
  function renderSummaryScreen() {
    const container = document.getElementById('summary-container');
    if (!container || !window.AppState) return;

    const state = window.AppState.getState();
    const totalTrials = state.trials.length;
    const completedCount = state.completedChallenges.length;

    let html = `
      <div class="card" style="text-align: left; background: #e8f0fe; border-left: 4px solid var(--primary);">
        <div class="card-title" style="color: var(--primary-dark);">
          <span>Your Inquiry Portfolio</span>
          <span class="badge-status completed">${completedCount} / 4 Solved</span>
        </div>
        <p style="font-size: 13px; color: var(--text-main); margin-top: 4px;">
          Total experimental launches recorded: <strong>${totalTrials}</strong>
        </p>
      </div>

      <div class="card" style="text-align: left;">
        <div class="card-title">
          <span>Physical Principles Discovered</span>
        </div>
        
        <div class="principle-item">
          <div class="principle-icon">🎯</div>
          <div class="principle-content">
            <h4>1. Complementary Angle Symmetry</h4>
            <p>On flat ground, $\\theta$ and $90° - \\theta$ produce identical horizontal range because range depends on $\\sin(2\\theta)$.</p>
          </div>
        </div>

        <div class="principle-item">
          <div class="principle-icon">🚀</div>
          <div class="principle-content">
            <h4>2. Non-Linear Speed Scaling (v²)</h4>
            <p>Doubling launch speed quadruples range ($2^2 = 4$). Range scales quadratically with initial speed, not linearly.</p>
          </div>
        </div>

        <div class="principle-item">
          <div class="principle-icon">⛰️</div>
          <div class="principle-content">
            <h4>3. Cliff Peak Shift (θ* &lt; 45°)</h4>
            <p>From an elevated cliff ($h &gt; 0$), free-fall time allows more initial velocity to be directed horizontally. The optimal angle shifts flatter ($\\approx 24°$).</p>
          </div>
        </div>

        <div class="principle-item">
          <div class="principle-icon">🔬</div>
          <div class="principle-content">
            <h4>4. Controlled Experimentation</h4>
            <p>Changing more than one variable simultaneously confounds experimental evidence. Isolating one variable at a time is the cornerstone of scientific deduction.</p>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  // Router init
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('DOMContentLoaded', () => {
    if (window.LabController) {
      window.LabController.init();
    }
    if (!window.location.hash) {
      window.location.hash = '#/home';
    } else {
      handleRoute();
    }
  });
})();
