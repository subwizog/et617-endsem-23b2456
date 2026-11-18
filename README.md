# Projectile Motion Inquiry Virtual Lab (ET 617 End-Sem)

**Candidate Roll Number / Identity Token:** `23B2456`  
**Live Application URL:** [https://et617-23b2456.vercel.app](https://et617-23b2456.vercel.app)  
**Repository:** `et617-endsem-23b2456`

---

## 1. Exam Card Selection

| Field | Selected Option | Description |
|---|---|---|
| **P – Problem Statement** | **P5 Virtual Lab** | Inquiry-based virtual laboratory where learners manipulate variables, form hypotheses, test trajectories, and revise beliefs without answer giveaways. |
| **T – Topic** | **T10 Projectile Motion** | Angle and speed versus range, Class 11 physics (SUVAT kinematics, quadratic $v^2$ scaling, complementary angles, elevated launches). |
| **L – Learner Context** | **L6 Olympiad Learner** | Ananya Iyer (16, Class 11, Pune); preparing for INPhO. Needs puzzle-driven inquiry that shatters textbook drill beliefs. |
| **C – Design Constraint** | **C3 Mobile-First, One-Handed** | Designed for 360 px width screen. Steppers $\ge 48\text{ px}$, bottom thumb-zone controls, zero hover-only dependencies. |

---

## 2. Local Setup & Verification

### Running Automated Test Suites
```bash
# 1. Physics Engine Tests (5/5 checks: range, complementary angles, quadratic scaling, cliff optimum)
node tests/physics.test.js

# 2. AI Safety & Leak Prevention Validator Tests (7/7 checks)
node tests/ai_validator.test.js
```

### Running the App Locally
Open `index.html` directly in any web browser, or launch a static server:
```bash
npx serve .
# or
python -m http.server 3000
```

### Vercel Deployment & Environment Variables
The application deploys automatically on push to GitHub.
- For AI Socratic guidance: Add `LLM_API_KEY` (Google Gemini API Key) in Vercel Project Settings &rarr; Environment Variables.
- Optional Model Config: `LLM_MODEL` (defaults to `gemini-1.5-flash`).
- **Offline Resilience:** If no API key is configured or the network times out (> 6s), the app automatically falls back to domain-grounded offline feedback without crashing.

---

## 3. Screen Map & Routes (Deliverable D4)

| Route | Screen Name | Learner Actions | Leads To |
|---|---|---|---|
| `#/home` | **Roadmap** | Overview of Challenges 1–4, unlocked/completed status, trial counters. | `#/predict/:id` |
| `#/predict/:id` | **Hypothesis & Prediction** | Selects or writes hypothesis (MCQ, numeric prediction, written explanation) before testing. | `#/lab/:id` |
| `#/lab/:id` | **Virtual Lab** | Manipulates $\theta, v, h$ via $54\times 48\text{ px}$ steppers; launches animated projectile; observes ghost paths & readouts ($R, H, T$). | `#/results/:id` |
| `#/results/:id` | **Results & Analysis** | Inspects Prediction vs Result comparison, full trial log table, range bar chart, and spot-the-flaw quiz. | `#/support/:id` or `#/summary` |
| `#/support/:id` | **Support Ladder** | 4-step inquiry scaffolding: (1) Name Gap &rarr; (2) Socratic Reflection &rarr; (3) Controlled Sweep Graph &rarr; (4) Revise Hypothesis. | `#/lab/:id` |
| `#/summary` | **Summary** | Portfolio of discovered physical principles (progressively unlocked upon completing each challenge). | `#/home` |
| `#/about` | **About** | Candidate token `23B2456`, physics model assumptions, C3 specifications, AI disclosure, and reset button. | `#/home` |

*Identity Token `23B2456 · ET 617 End-Sem` is anchored and permanently visible in the footer across all 7 screens.*

---

## 4. AI Functionality Specification (Deliverable D6)

- **Provider:** Google Gemini REST API (`generateContent`) called via Vercel serverless function (`/api/feedback`).
- **System Prompt:**
  ```text
  You are a physics lab guide for a Class 11 Olympiad student. The student is exploring projectile motion (no air resistance, g = 9.8 m/s²).
  Rules:
  1. Never state the final answer (no optimal angle, no target range, no "4 times").
  2. Reply with ONE short Socratic question (max 25 words) that points at the variable or the experiment design.
  3. Tag the likely misconception: "M1" (45° is always best), "M2" (range is linear in speed), "CONFOUNDED" (changed two variables), or "NONE".
  4. Use simple, friendly language. Short sentences.
  Return ONLY JSON: {"tag": "...", "question": "..."}
  ```
- **Validation Pipeline:**
  - JSON schema verification (`tag` and `question`).
  - Allowed misconception tags: `M1`, `M2`, `CONFOUNDED`, `NONE`.
  - Word count limit: Maximum 25 words.
  - Punctuation: Must end with a question mark (`?`).
  - Answer-Leak Prevention: Regex checks reject responses mentioning forbidden terms (e.g. `24°`, `quadruple`, `v²`, `less than 45`).
  - Timeout: 6000 ms.
- **Offline Fallback:** If key is missing, network fails, or validation rejects the output, the serverless handler and client fallback return pre-scripted Socratic prompts labelled as `"Offline feedback"`.

---

## 5. Contrasting Learner Scenarios (Deliverable D5)

1. **Misconception Path (M2 - Speed Doubling):**
   - Learner predicts `45 m` in Challenge 2 (assuming double speed doubles range).
   - In Lab, sets $v = 30\text{ m/s}$ &rarr; projectile flies to $90.5\text{ m}$.
   - Results screen notes the discrepancy **without revealing the $v^2$ formula**.
   - Learner enters the Support Ladder &rarr; runs controlled speed sweep (10–35 m/s) &rarr; observes upward quadratic curvature &rarr; revises hypothesis &rarr; unlocks completion.
2. **Misconception Path (M1 - 45° Rule from Cliff):**
   - Learner selects `45°` in Challenge 3 ($h = 20\text{ m}$).
   - Launches at $45^\circ$ ($20.3\text{ m}$), then tests flatter angles ($22.1\text{ m}$).
   - Results screen highlights that $45^\circ$ was beaten **without revealing the $24^\circ$ optimum**.
   - Enters Support Ladder &rarr; inspects angle sweep curve &rarr; discovers that extra falling time shifts the optimum angle lower ($\approx 24^\circ$).
3. **Correct Path:**
   - Learner predicts $90.5\text{ m}$ in Challenge 2 or discovers $24^\circ$ in Challenge 3.
   - Results screen confirms mastery and provides an **Olympiad Harder Follow-Up** puzzle (e.g. 3× speed scaling, 5 m cliff launch comparison).

---

## 6. Viva Readiness ("Where to Change What")

| Viva Modification Request | Target File | Line / Location | How to Modify |
|---|---|---|---|
| Change gravity $g$ (e.g., Moon $1.62$, Mars $3.71$) | `js/config.js` | `CONFIG.G` | Change `9.8` to new value |
| Add gravity selector | `js/config.js`, `index.html` | `CONFIG.G`, `#screen-lab` | Add dropdown/stepper for planet selection |
| Change variable bounds / steps | `js/config.js` | `CONFIG.LIMITS` | Update `min`, `max`, or `step` |
| Change target distance in Challenge 1 | `js/content.js` | `CHALLENGES[0].target` | Change `60` to e.g. `70` or `50` |
| Change hit tolerance | `js/config.js`, `js/content.js` | `TOLERANCE.hit` | Change `2.0` to new value |
| Change fixed challenge parameters | `js/content.js` | `CHALLENGES[i].fixed` | Modify `v`, `h`, or `theta` defaults |
| Modify feedback text or hints | `js/content.js` | `CHALLENGES[i].evaluateTrials` | Edit string literals |
| Switch AI model | `api/feedback.js` | `model` variable / env | Change default model name |
| Adjust mobile target sizing | `css/style.css` | `--btn-stepper` | Adjust height / font-size |
