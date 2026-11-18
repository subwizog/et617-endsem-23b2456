# PLAN.md - Build plan for Antigravity IDE (ET 617 End-Sem, roll no. 23B2456)

> **Read first:** `PS.md` (problem statement) and `DESIGN.md` (my design). This plan turns `DESIGN.md` into working code. If this plan and `DESIGN.md` disagree, **follow DESIGN.md and tell me**.

## 0. Ground rules (apply to every phase)
- **Card:** P5 Inquiry-based virtual lab · T10 Projectile motion (angle and speed vs range, Class 11) · L6 Olympiad learner (Ananya, 16) · C3 Mobile-first, one-handed, 360 px.
- **Stack:** plain HTML + CSS + vanilla JS + `<canvas>`. No framework, no build step. One Vercel serverless function for AI. No external libraries unless I approve (if one is used it must be named in the report).
- **Identity token `23B2456`** must appear in the footer of **every screen** and on the About screen.
- **Never** commit API keys. Keys live in Vercel env vars only. Add `.env*` to `.gitignore`.
- **Commit after every phase** (small commits, message format below). I commit and push; you tell me when to. Commits must be at least every 30 minutes.
- **Work one phase at a time.** At the end of each phase: list what you did, give me the manual test steps, and wait for my "next".
- **Keep code easy to modify live** (I will get a live change request in a viva). So: all numbers and ranges in one `CONFIG` object, all learner-facing text in `js/content.js`, physics in `js/physics.js`, no logic hidden in HTML.
- **Language:** learner-facing text is plain, short, conversational English ("Let's test it", "What do you think will happen?"). Short sentences, active voice, key words in **bold**.
- **Physics model (state it on the About screen):** no air resistance, g = 9.8 m/s², flat ground, launch from height h above the ground. All ranges are measured horizontally from the launch point.
- Do not copy code from any previous project of mine.

## 1. File structure
```
/
├─ index.html            # single page, screens are <section> elements
├─ css/style.css
├─ js/
│  ├─ config.js          # CONFIG: variable limits, step sizes, tolerances, g
│  ├─ physics.js         # pure functions, no DOM
│  ├─ content.js         # challenges, questions, feedback text, hints, fallback feedback
│  ├─ state.js           # app state + localStorage save/resume
│  ├─ lab.js             # canvas drawing + controls
│  ├─ diagnose.js        # misconception + confounding detection, support ladder logic
│  ├─ ai.js              # calls /api/feedback, validates, falls back
│  └─ app.js             # router + screen rendering
├─ api/feedback.js       # Vercel serverless function (Node) - calls the LLM
├─ tests/physics.test.js # runs with `node tests/physics.test.js`
├─ DESIGN.md, PLAN.md, PS.md, README.md
└─ .gitignore
```

## 2. Physics (`js/physics.js`) - exact formulas
Inputs: `theta` (degrees), `v` (m/s), `h` (m), `g = 9.8`.
- `vx = v·cosθ`, `vy = v·sinθ`
- Time of flight: `t = (vy + sqrt(vy² + 2·g·h)) / g`
- Range: `R = vx · t`
- Max height above ground: `H = h + vy² / (2g)`
- Position at time `s`: `x = vx·s`, `y = h + vy·s − 0.5·g·s²`
- Best angle for launch height h: `θ* = atan( v / sqrt(v² + 2·g·h) )` (in degrees). **Used only for checking answers. Never display it to the learner before they have earned it.**
- Export: `simulate(theta, v, h)` → `{R, H, T, path[]}` with ~60 path points; `bestAngle(v, h)`.

**`tests/physics.test.js` must pass** (tolerance 0.1):
- `simulate(45, 20, 0).R ≈ 40.82`
- `simulate(30, 20, 0).R ≈ simulate(60, 20, 0).R` (complementary angles)
- `simulate(40, 30, 0).R ≈ 4 × simulate(40, 15, 0).R`
- `bestAngle(10, 20) ≈ 24.3`, and `simulate(bestAngle(10,20), 10, 20).R > simulate(45, 10, 20).R`
- `bestAngle(v, 0) = 45` for any v.

## 3. Screens and routes (hash router, 7 screens)
| Route | Screen | What the learner does | Leads to |
|---|---|---|---|
| `#/home` | Home | Sees 4 challenge cards (locked/unlocked), "Resume" button, link to About | Predict |
| `#/predict/:id` | Predict | Picks or writes a hypothesis and enters a prediction | Lab |
| `#/lab/:id` | Lab | Changes θ, v, h; presses **Launch**; sees path, ghost paths, readouts | Results |
| `#/results/:id` | Results | Sees the trial table, prediction vs result, range-vs-variable plot | Support or Summary |
| `#/support/:id` | Support / Revise | Gets the next rung of the support ladder; rewrites hypothesis; re-tests | Lab |
| `#/summary` | Summary | Sees what they found per challenge, unlocks the next challenge | Home |
| `#/about` | About | Reads the identity token, assumptions, AI-use note | Home |

Rules for all screens:
- Footer on every screen: `23B2456 · ET 617 End-Sem` (and nothing hidden behind scroll on a 360 px screen if avoidable).
- Persistent **bottom nav** (Home · Lab · Results · About).

## 4. C3 constraint: mobile-first, one-handed (must be visible and checkable)
- Design at **360 px** width first. No horizontal scrolling. Use `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- All primary actions sit in the **bottom 40%** of the screen: **Launch**, **Next**, **Reset**, steppers. Bottom nav is fixed.
- Variables are set with **big − / + steppers** (θ ±1°, v ±1 m/s, h ±1 m; long-press repeat is optional) and a slider as a secondary control. Steppers are the main control.
- Tap targets are at least **48×48 px**. **No hover-only behaviour. No drag-and-drop.**
- Canvas fills the width and sits at the top; the controls are in a bottom sheet.
- Add a visible "**One-hand mode**" note on the About screen explaining what was done for C3.
- Test at 360×740 in the browser device toolbar and report the result.

## 5. Lab screen (`js/lab.js`)
- Canvas: ground line, launch point (raised on a cliff when h > 0), target marker if the challenge has one, the current trajectory (animated on Launch), and **ghost paths** of earlier trials (faded, labelled #1, #2...).
- Readouts under the canvas: Range, Max height, Time of flight.
- Controls (bottom sheet): θ, v, h steppers. A variable that the challenge fixes is shown **locked** with a lock icon and a short reason ("fixed for this challenge").
- Buttons: **Launch** (big, bottom), **Reset trials**.
- Every Launch is stored as a trial: `{id, theta, v, h, R, H, T, changed: [list of variables that differ from the previous trial]}`.
- Auto-scale the canvas so the whole path always fits.

## 6. Challenges and content (`js/content.js`) - use exactly these
All numbers below are checked against `physics.js`; if a test or computed value disagrees, tell me. Compute expected answers **in code**, do not hardcode.

### Challenge 1 - The Bullseye (level ground)
- Fixed: v = 25 m/s, h = 0. Free: θ. Target at **60 m** (counts as a hit within ±2 m).
- Task: "Hit the target using **two different angles**."
- Predict screen (MCQ): "How many different angles can hit a target on flat ground?" Options: **one** / **two** / **many**.
- Expected: about **35°** and **55°** (complementary angles).
- Correct feedback: "Two hits, 35° and 55°. They add up to 90°. **Why?** Range depends on sin 2θ, and sin 2θ is the same for θ and 90° − θ. Nice."
- If the learner finds only one angle after 4 launches: "You've hit it once. Try an angle on the **other side** of 45°. What do you notice?"

### Challenge 2 - Double Trouble (targets misconception M2)
- Fixed: θ = 40°, h = 0. Free: v. Baseline launch at v = 15 m/s is given (R ≈ 22.6 m).
- Predict screen: number entry: "If we **double** the speed to 30 m/s, what will the range be?" (m)
- Check: correct if within 10% of 4 × baseline (≈ 90 m). If within 10% of 2 × baseline (≈ 45 m) → flag **M2**.
- M2 feedback: "You predicted about 45 m. Let's test that. **Launch at 30 m/s** and compare your prediction with the result."
- After the test, support ladder step 2: "Now try 10, 20 and 30 m/s. **Write the three ranges.** What happens each time speed doubles?"
- Correct feedback: "Yes, **about 4 times**. Range grows with **v²**. Double the speed, and the range is 2² = 4 times."

### Challenge 3 - The Cliff Shot (targets misconception M1)
- Fixed: v = 10 m/s, h = 20 m. Free: θ. No target. Goal: "Find the angle that gives the **longest range**."
- Predict screen (MCQ): "Which angle gives the longest range from a 20 m cliff?" Options: **30°** / **45°** / **60°** / **Less than 45°** / **I'm not sure**. Flag **M1** if the learner picks 45° (or 60°).
- Expected: best angle ≈ **24°**, range ≈ **22.6 m**; 45° gives ≈ **20.3 m**.
- M1 feedback after the learner's 45° shot is beaten: "Your 45° shot went 20.3 m, but another angle went further. 45° is the best only when you **land at the height you launched from**. What changed here?"
- Correct feedback: "Best angle is about 24°, **less than 45°**. From a cliff the ball spends extra time falling, so a **flatter** launch gives more horizontal speed for that time."

### Challenge 4 - Stretch (unlocks after 3)
- Free: θ, v, h. Task: "h = 30 m and v = 15 m/s. Find the best angle. Then **explain in one or two sentences** how the best angle changes as the cliff gets higher."
- Accepted: within 2° of `bestAngle(15, 30)` (≈ 27.7°). Written explanation goes to the AI feedback.

### Question formats (need at least 2; the above has 4)
MCQ hypothesis, numeric prediction, "hit the target" experiment, written explanation, plus **one "Spot the flaw" task** after Challenge 2: show two trials where **both θ and v changed** and ask "Can we tell which change caused the bigger range?" (Answer: No. Change **one thing at a time**.)

## 7. Diagnosis and support ladder (`js/diagnose.js`) - the design challenge
**Flags (all rule-based, no AI needed):**
- `M2`: prediction in Challenge 2 within 10% of 2×baseline.
- `M1`: Challenge 3 MCQ answer is 45°/60°, **or** the best trial so far is within 2° of 45° and its range is at least 5% below the optimum.
- `CONFOUNDED`: two consecutive trials differ in more than one variable (where more than one is free).
- `FAILED_PREDICTION`: result differs from the prediction by more than the tolerance.

**Support ladder (per challenge, level 0-3). It must NEVER state the final answer:**
1. **Name the gap:** show prediction vs result with ghost paths side by side. Message: "Your prediction and your result don't match. Let's look at why."
2. **Question:** "Between trial N-1 and N you changed [θ and v]. Which one caused the difference?"
3. **Controlled replay:** a button "**Sweep one variable**": locks the others and launches 5-6 trials across the free variable, then draws a **range-vs-variable plot** for the learner to interpret. The app does not label the peak.
4. **Revise:** the learner rewrites their hypothesis (text box + "Test it again" button back to the Lab).
Only after **two more failed predictions** at level 3 may a **worked-example hint** appear (a different example, not the answer to the current one).

Different responses for correct vs misconception learners (needed for D5): a correct learner skips support and gets a **harder follow-up** ("Now try it from a 5 m cliff. What do you expect?"); a misconception learner enters the ladder.

## 8. AI feature (`api/feedback.js`, `js/ai.js`)
**What it does:** reads the learner's written hypothesis or explanation plus their trial log and returns a **Socratic question** and a **misconception tag**. It does not grade and does not give the answer.

**Provider:** `<<PROVIDER>>` (decided with me before this phase). Read the key from `process.env.LLM_API_KEY`. Model name goes in `CONFIG`/env.

**Request (client → `/api/feedback`):**
```json
{ "challengeId": 3, "hypothesis": "45 degrees is always best", "trials": [{"theta":45,"v":10,"h":20,"R":20.3},{"theta":30,"v":10,"h":20,"R":22.1}], "supportLevel": 2 }
```

**System prompt (use as written):**
```
You are a physics lab guide for a Class 11 Olympiad student. The student is exploring projectile motion (no air resistance, g = 9.8 m/s²).
Rules:
1. Never state the final answer (no optimal angle, no target range, no "4 times").
2. Reply with ONE short Socratic question (max 25 words) that points at the variable or the experiment design.
3. Tag the likely misconception: "M1" (45° is always best), "M2" (range is linear in speed), "CONFOUNDED" (changed two variables), or "NONE".
4. Use simple, friendly language. Short sentences.
Return ONLY JSON: {"tag": "...", "question": "..."}
```

**Validation before the learner sees it (all must pass, else fallback):**
- Valid JSON with exactly `tag` and `question`; `tag` is in the allowed list.
- `question` is non-empty, 25 words or fewer, and ends with "?".
- **Answer-leak check:** each challenge in `content.js` has a `forbidden` list of regex patterns (e.g. Challenge 3: the optimal angle ±2° such as `/\b2[2-6]\s*(°|degrees)/`, and phrases like "less than 45"; Challenge 2: `/4\s*(x|×|times)/`, `/quadruple/`, "v²"). If any matches, reject.
- Timeout 6 s.

**Fallback (offline):** pre-written Socratic questions per tag and per challenge in `content.js`. Show a small label: "**Offline feedback**" so it is obvious. The app must be fully usable with the AI turned off.

## 9. State and resume (`js/state.js`)
Save to `localStorage`: current challenge, trials per challenge, flags, support level, hypotheses, unlocked challenges. "Resume" on Home restores the last screen. A "Reset all" button on About.

## 10. Phases, acceptance checks and commits
| Phase | Build | Acceptance check (I will test) | Commit message |
|---|---|---|---|
| 1 | Repo skeleton, `config.js`, `physics.js`, tests, `index.html` shell with router and footer on all 7 screens | `node tests/physics.test.js` passes; footer `23B2456` on every route | `feat: skeleton, physics, tests` |
| 2 | Lab screen (canvas, steppers, Launch, ghost paths, readouts, trial log) at 360 px | Launch works; ghost paths accumulate; steppers reachable with one thumb | `feat: lab screen` |
| 3 | Home, Predict, Results screens + Challenges 1-3 content + target logic | Challenge 1 can be solved with two angles; prediction vs result is shown | `feat: challenges and screens` |
| 4 | `diagnose.js` + Support screen (ladder, controlled sweep, revise) + Summary + Challenge 4 | M2 path (predict 45 m) and M1 path (pick 45°) both trigger the ladder; correct path skips it and gets a harder follow-up | `feat: diagnosis and support ladder` |
| 5 | **First Vercel deploy** (do this as early as phase 3 if possible; target live by 1:00 into the exam) | URL loads on my phone | `chore: deploy config` |
| 6 | AI route, `ai.js`, validation, offline fallback | With the key: Socratic question appears. With the key removed: "Offline feedback" appears. A forced bad response is rejected | `feat: AI feedback with fallback` |
| 7 | About screen, README, polish, C3 verification at 360 px, accessibility basics (labels, contrast) | Checklist in section 11 passes | `docs: about, readme, c3 check` |

## 11. Final verification checklist (run at the end and report each item)
- [ ] 7 screens connected; every transition works with no dead ends
- [ ] Footer `23B2456` visible on every screen, plus About
- [ ] C3: 360 px, no horizontal scroll, thumb-zone actions, 48 px targets, no hover-only
- [ ] Correct path (D5a) and M1 path and M2 path (D5b) behave differently
- [ ] Unsuccessful experiment → support ladder never reveals the answer
- [ ] AI works; AI off → labelled offline fallback; answer-leak check rejects a bad response
- [ ] No API keys in the repo (`git log -p` search for "key" and "sk-")
- [ ] `node tests/physics.test.js` passes
- [ ] README has run and deploy instructions

## 12. Viva readiness (a change will be requested live)
Make these changes **one-line edits**: add a new free variable (e.g. a gravity selector for Moon or Mars), change a tolerance, change a challenge's fixed values, change the target distance, add a new MCQ option, change feedback text, change language of a screen's labels. Keep a short "**Where to change what**" table in `README.md`.

## 13. Report support (for me)
Keep a running `AI_LOG.md` in the repo listing each prompt group you were given and what you produced. I will also export my chats. Also give me, at the end, **a list of the exact prompts in the AI feature** (section 8) for D6, and the screens/routes table for D4.
