// Main Router and Application Orchestration Shell
// Handles hash navigation, screen rendering, dynamic challenge content, and results evaluation.

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
  // RESULTS SCREEN RENDERER
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

    let predParam = null;
    if (challenge.predict.type === 'mcq') predParam = hypothesis.selected;
    else if (challenge.predict.type === 'numeric') predParam = hypothesis.prediction;
    else if (challenge.predict.type === 'text') predParam = hypothesis.text;

    // Evaluate trials using domain rules
    const evaluation = challenge.evaluateTrials(trials, predParam);

    if (evaluation.isComplete) {
      window.AppState.markCompleted(challenge.id);
      window.AppState.unlockChallenge(Number(challenge.id) + 1);
    }

    let html = '';

    // 1. Prediction vs Result Evaluation Card
    html += `
      <div class="card" style="background: ${evaluation.isComplete ? '#e6f4ea' : '#f8f9fa'}; border-left: 4px solid ${evaluation.isComplete ? 'var(--success)' : 'var(--primary)'}; text-align: left;">
        <div class="card-title" style="color: ${evaluation.isComplete ? '#0d652d' : 'var(--primary-dark)'};">
          <span>${evaluation.isComplete ? '✓ Challenge Objective Achieved' : 'Inquiry in Progress'}</span>
          <span class="badge-status ${evaluation.isComplete ? 'completed' : ''}">${trials.length} Launches</span>
        </div>
        <div style="font-size: 13.5px; line-height: 1.55; margin-top: 6px; white-space: pre-line;">
          ${evaluation.feedback}
        </div>
      </div>
    `;

    // 2. Mini Bar Chart of Launches
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

      // 3. Full Trial History Table
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

    // 4. Spot the Flaw Task (Interactive Component for Challenge 2)
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
