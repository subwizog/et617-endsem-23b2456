// Main Router and Application Orchestration Shell
// Handles hash navigation across the 7 screens, active state updates, and footer persistence.

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

  /**
   * Parses the current window hash into route name and optional parameter.
   * e.g. "#/predict/1" -> { name: 'predict', id: '1' }
   */
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

  /**
   * Router handler: switches visible screen, updates nav states, and sets titles.
   */
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

    // 4. Update dynamic links and labels if challenge ID is provided
    updateChallengeContext(name, id);

    // 5. Ensure scroll resets to top of view
    window.scrollTo(0, 0);
  }

  function updateChallengeContext(routeName, challengeId) {
    // Sync buttons on Predict screen
    const predictProceed = document.getElementById('predict-proceed-btn');
    if (predictProceed) {
      predictProceed.href = `#/lab/${challengeId}`;
    }

    // Sync buttons on Lab screen
    const labResults = document.getElementById('lab-results-btn');
    if (labResults) {
      labResults.href = `#/results/${challengeId}`;
    }

    // Sync buttons on Results screen
    const resultsSupport = document.getElementById('results-support-btn');
    if (resultsSupport) {
      resultsSupport.href = `#/support/${challengeId}`;
    }

    // Sync buttons on Support screen
    const supportRetest = document.getElementById('support-retest-btn');
    if (supportRetest) {
      supportRetest.href = `#/lab/${challengeId}`;
    }
  }

  // Initialize router
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('DOMContentLoaded', () => {
    if (!window.location.hash) {
      window.location.hash = '#/home';
    } else {
      handleRoute();
    }
  });
})();
