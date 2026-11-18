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
