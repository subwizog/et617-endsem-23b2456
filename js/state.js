// Application State & LocalStorage Persistence Manager
// Manages challenge progress, trial logs, hypotheses, and flags across sessions.

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.AppState = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const STORAGE_KEY = (typeof CONFIG !== 'undefined' && CONFIG.STORAGE_KEY) || 'et617_23b2456_lab_state';

  const defaultState = {
    currentChallengeId: 1,
    unlockedChallenges: [1],
    completedChallenges: [],
    trials: [], // [{ id, challengeId, theta, v, h, R, H, T, changed: [], timestamp }]
    hypotheses: {}, // { [challengeId]: { text, prediction, format } }
    supportLevel: {}, // { [challengeId]: 0 }
    lastActiveRoute: '#/home'
  };

  let state = { ...defaultState };

  function loadState() {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          state = Object.assign({}, defaultState, JSON.parse(saved));
        }
      }
    } catch (e) {
      console.warn('Could not load saved state from localStorage:', e);
      state = { ...defaultState };
    }
    return state;
  }

  function saveState() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch (e) {
      console.warn('Could not save state to localStorage:', e);
    }
  }

  function getState() {
    return state;
  }

  function setCurrentChallenge(id) {
    state.currentChallengeId = Number(id);
    saveState();
  }

  function unlockChallenge(id) {
    const numId = Number(id);
    if (!state.unlockedChallenges.includes(numId)) {
      state.unlockedChallenges.push(numId);
      saveState();
    }
  }

  function markCompleted(id) {
    const numId = Number(id);
    if (!state.completedChallenges.includes(numId)) {
      state.completedChallenges.push(numId);
      saveState();
    }
  }

  function addTrial(trialData) {
    const challengeTrials = getTrials(trialData.challengeId);
    const lastTrial = challengeTrials[challengeTrials.length - 1];

    const changed = [];
    if (lastTrial) {
      if (Math.abs(lastTrial.theta - trialData.theta) > 0.01) changed.push('theta');
      if (Math.abs(lastTrial.v - trialData.v) > 0.01) changed.push('v');
      if (Math.abs(lastTrial.h - trialData.h) > 0.01) changed.push('h');
    }

    const trial = {
      id: state.trials.length + 1,
      challengeTrialIndex: challengeTrials.length + 1,
      timestamp: Date.now(),
      changed,
      ...trialData
    };

    state.trials.push(trial);
    saveState();
    return trial;
  }

  function getTrials(challengeId) {
    if (challengeId === undefined || challengeId === null) {
      return state.trials;
    }
    return state.trials.filter((t) => t.challengeId === Number(challengeId));
  }

  function clearTrials(challengeId) {
    if (challengeId === undefined || challengeId === null) {
      state.trials = [];
    } else {
      state.trials = state.trials.filter((t) => t.challengeId !== Number(challengeId));
    }
    saveState();
  }

  function setHypothesis(challengeId, hypothesisObj) {
    state.hypotheses[challengeId] = {
      ...state.hypotheses[challengeId],
      ...hypothesisObj
    };
    saveState();
  }

  function getHypothesis(challengeId) {
    return state.hypotheses[challengeId] || null;
  }

  function setSupportLevel(challengeId, level) {
    state.supportLevel[challengeId] = level;
    saveState();
  }

  function getSupportLevel(challengeId) {
    return state.supportLevel[challengeId] || 0;
  }

  function resetAll() {
    state = JSON.parse(JSON.stringify(defaultState));
    saveState();
    return state;
  }

  // Initial load
  loadState();

  return {
    getState,
    loadState,
    saveState,
    setCurrentChallenge,
    unlockChallenge,
    markCompleted,
    addTrial,
    getTrials,
    clearTrials,
    setHypothesis,
    getHypothesis,
    setSupportLevel,
    getSupportLevel,
    resetAll
  };
});
