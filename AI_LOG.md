# AI Use Log and Reflection

**Candidate Identity:** 23B2456  
**Exam:** ET 617 End-Semester Examination  

---

## Prompt Group 1: Phase 1 Initialization & Core Setup
- **Prompt:** Read `PS.md`, `DESIGN.md`, and `PLAN.md`. Follow `PLAN.md` exactly, one phase at a time. Start with Phase 1 only. When done, list what you built, give manual test steps, and wait for "next". Do not commit API keys. Ask before deviating from the plan.
- **Actions taken:**
  1. Read exam card definitions from `DESIGN.md` and problem specifications from `PS.md` and `PLAN.md`.
  2. Created `.gitignore` protecting secrets (`.env*`) and build artifacts.
  3. Created `js/config.js` defining limits, step sizes, constants (`g = 9.8`, roll no `23B2456`).
  4. Implemented pure physics engine `js/physics.js` with `simulate()` and `bestAngle()`.
  5. Created test suite `tests/physics.test.js` covering all 5 acceptance criteria in Section 2 of `PLAN.md`.
  6. Built mobile-first responsive layout `css/style.css` constrained for 360 px width and one-handed thumb interaction (C3).
  7. Built `index.html` housing all 7 application screens as semantic sections.
  8. Created hash-based router `js/app.js` with active navigation handling and persistent `23B2456 · ET 617 End-Sem` footer.
  9. Verified physics tests with `node tests/physics.test.js` (5/5 passed).

## Prompt Group 2: Phase 2 Virtual Lab Screen Implementation
- **Prompt:** "next" (Proceed to Phase 2 per PLAN.md)
- **Actions taken:**
  1. Built `js/state.js` implementing state persistence with `localStorage` (trials, hypotheses, unlocked challenges, changed-variable detection).
  2. Built `js/lab.js` virtual lab controller:
     - HTML5 `<canvas>` rendering with DPR high-resolution auto-scaling.
     - Dynamic coordinate projection (`worldToScreen`), ground line, cliff rendering when $h > 0$, target marker when active.
     - Projectile launch animation with trajectory tracer ball and landing detection.
     - Faded ghost paths representing earlier trials with trial tags (`#1`, `#2`) and trial angle.
     - Real-time readouts for Range ($R$), Max Height ($H$), and Time of Flight ($T$).
     - Variable lock logic (locks $v$ and $h$ for Challenge 1, locks $\theta$ and $h$ for Challenge 2, etc.).
  3. Built mobile-first C3 one-handed controls in `css/style.css`:
     - Large steppers ($\ge 48\times 48\text{ px}$) for angle, speed, and cliff height.
     - Continuous sliders as secondary controls.
     - 52 px thumb-accessible **Launch** button in the lower screen zone.
     - Direct hit / landing range toast notifications.
  4. Updated `index.html` and `js/app.js` to initialize the Lab canvas on route activation.
  5. Verified all acceptance criteria for Phase 2.

## Prompt Group 3: Phase 3 Home, Predict & Results Screens, Challenges 1–3 Content & Target Logic
- **Prompt:** "next" (Proceed to Phase 3 per PLAN.md)
- **Actions taken:**
  1. Built `js/content.js` housing complete curriculum for Challenges 1–4, evaluation logic, question definitions, and the "Spot the Flaw" controlled experiment task.
  2. Implemented Home Screen (`renderHomeScreen`) displaying active challenge progress, unlocked states, and trial counters.
  3. Implemented Predict Screen (`renderPredictScreen`):
     - Challenge 1: MCQ hypothesis on complementary angles ("How many different launch angles can hit a target on flat ground?").
     - Challenge 2: Numeric prediction with baseline trial ($v=15\text{ m/s} \to R=22.6\text{ m}$) asking for range at $v=30\text{ m/s}$.
     - Challenge 3: MCQ hypothesis on cliff launch ("Which angle gives the longest horizontal range from a 20 m cliff?").
     - Challenge 4: Olympiad stretch written hypothesis.
  4. Implemented Results Screen (`renderResultsScreen`):
     - Displays dynamic Prediction vs Result analysis.
     - Trial history log table with hit highlighting.
     - Interactive horizontal bar chart for visual trajectory comparisons.
     - Interactive "Spot the Flaw in the Experiment" task.
  5. Verified all acceptance criteria for Phase 3 via Node.js script.

## Prompt Group 4: Phase 4 Diagnosis, Support Ladder, Controlled Sweep & Pedagogical Safeguards
- **Prompt:** Proceed to Phase 4 of PLAN.md: implement diagnose.js (M1, M2, CONFOUNDED, FAILED_PREDICTION), Support/Revise screen with 4-step ladder, controlled variable sweep with 5-6 points and range-vs-variable graph, hypothesis revision and retesting, Summary screen, Challenge 4 Stretch, and strict pedagogical fix preventing premature disclosure of physical answers.
- **Actions taken:**
  1. Built `js/diagnose.js` evaluating:
     - `M1`: Assumes 45° is optimal for elevated launches ($h > 0$).
     - `M2`: Assumes linear scaling ($2\times \text{speed} \implies 2\times \text{range}$) instead of quadratic $v^2$ scaling.
     - `CONFOUNDED`: Changed multiple variables between consecutive trials.
     - `FAILED_PREDICTION`: Significant discrepancy between hypothesis and experimental results.
  2. Implemented 4-Step Support Ladder (`renderSupportScreen`):
     - **Rung 1 (Name the gap):** Side-by-side comparison of prediction vs experimental data without answers.
     - **Rung 2 (Socratic reflection):** Guided reasoning about orthogonal velocities and flight times.
     - **Rung 3 (Controlled sweep):** Generates 5–6 single-variable trials and renders an SVG Range-vs-Variable curve without labeling the optimum peak.
     - **Rung 4 (Revise hypothesis):** Learner records revised hypothesis and retests in the Virtual Lab.
  3. Implemented Pedagogical Safeguard:
     - In `js/content.js`, feedback for $M1$ and $M2$ learners explicitly hides the formulas ($v^2$, $24^\circ$) until the learner either explores the true optimum or completes the support ladder.
     - Correct learners immediately skip the support ladder and receive an Olympiad harder follow-up challenge.
  4. Built Summary Screen (`renderSummaryScreen`) synthesizing all 4 core physical principles, trials statistics, and unlocked achievements.
  5. Implemented Challenge 4: Stretch ($h=30\text{ m}, v=15\text{ m/s}$), analytical explanation, and unlocking mechanism.
  6. Verified all paths (M1, M2, Correct, Confounded) via automated test script.

## Prompt Group 5: Phase 6 AI Socratic Integration, Answer-Leak Validator & Summary/Sweep Corrections
- **Prompt:** Implement Summary Screen locked placeholders, verify Rung 3 sweep graphs have no peak labels/markers, proceed to Phase 6 of PLAN.md implementing Google Gemini REST in `api/feedback.js`, `validator.js`, `ai.js`, 6s timeout, schema validation, answer-leak regex checks, offline fallback, unit tests, and update AI_LOG.md.
- **Actions taken:**
  1. Updated Summary Screen (`renderSummaryScreen`):
     - Configured progressive revelation: Principles 1–4 are displayed ONLY after the learner completes the corresponding challenge.
     - Uncompleted challenges display locked placeholders (`🔒 Principle Locked`) with zero formulas, preventing premature exposure of $R \propto v^2$ or $\theta^*$ formulas.
  2. Verified Rung 3 Sweep Graph:
     - Verified that Range-vs-Variable SVG graph displays a clean trajectory curve with axis ticks only, without max markers, peak labels, optimal angle badges, or any answer-revealing cues.
  3. Built Serverless AI Handler (`api/feedback.js`):
     - Uses native fetch calling Google Gemini REST endpoint (`generateContent`).
     - Reads API key securely from `process.env.LLM_API_KEY` (never committed or exposed to client).
     - Model name configurable via `process.env.LLM_MODEL` (default: `gemini-1.5-flash`).
     - 6-second timeout via `AbortController`.
     - Strict schema parsing and error handling.
  4. Built Pedagogical Validator (`js/validator.js`):
     - Enforces JSON format with `tag` and `question`.
     - Checks `tag` against allowed set: `['M1', 'M2', 'CONFOUNDED', 'NONE']`.
     - Enforces $\le 25$ words and required ending question mark `?`.
     - Enforces challenge-specific answer-leak regexes: rejects mentions of "24°", "quadruple", "v²", "optimal angle", etc.
  5. Built Client-Side AI Orchestrator (`js/ai.js`):
     - Dispatches request to `/api/feedback`.
     - Dual-layer client validation against answer leaks.
     - Gracefully falls back to pre-written Socratic prompts labelled with `"Offline feedback"`.
  6. Created Unit Test Suite (`tests/ai_validator.test.js`):
     - Tested rejection of "24°" in Challenge 3.
     - Tested rejection of "quadruple" in Challenge 2.
     - Tested acceptance of valid Socratic questions.
     - Tested length and punctuation constraints (**7/7 tests passed**).

## Prompt Group 6: Phase 7 Final Verification, About Screen Polish & Comprehensive Documentation
- **Prompt:** "next" (Proceed to Phase 7 of PLAN.md: About screen, README, polish, C3 verification at 360 px, accessibility basics, final verification checklist).
- **Actions taken:**
  1. Updated About Screen (`#screen-about`) with:
     - Full card breakdown: Candidate Roll No `23B2456`, Problem P5, Topic T10, Learner L6 (Ananya, 16), Constraint C3.
     - Visible C3 One-Handed Mobile specifications card detailing the thumb-zone hierarchy and $\ge 48\text{ px}$ targets.
     - Ideal physics model assumptions ($g=9.8\text{ m/s}^2$, no drag, flat landing).
     - AI Socratic Guide disclosure detailing Google Gemini REST API and answer-leak validation.
     - "Reset All Progress & Data" button connected to `AppState.resetAll()`.
  2. Verified mobile responsiveness and accessibility:
     - 360 px viewport width with zero horizontal overflow.
     - High contrast accessible color palette.
     - Persistent footer `23B2456 · ET 617 End-Sem` visible across all 7 routes.
     - Complete ARIA labeling on steppers, sliders, and buttons.
  3. Built comprehensive `README.md` covering:
     - Live application URL placeholder.
     - Local development and test commands.
     - D4 screen and routes map.
     - D6 AI specifications and exact prompt definitions.
     - D5 contrasting learner scenarios.
     - Detailed "Where to change what" table for the viva live modification request.
  4. Executed all test suites:
     - `node tests/physics.test.js`: 5/5 passed.
     - `node tests/ai_validator.test.js`: 7/7 passed.
