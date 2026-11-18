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
