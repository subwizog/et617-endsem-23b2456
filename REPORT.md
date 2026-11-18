# ET 617 End-Semester Examination Report

---

## Identity Card

| Field | Detail |
|---|---|
| **Candidate Roll Number** | **23B2456** |
| **Problem Statement (P)** | **P5 – Inquiry-based virtual laboratory** |
| **Topic (T)** | **T10 – Projectile motion: angle and speed vs range (Class 11)** |
| **Learner Context (L)** | **L6 – High-achieving Olympiad learner (Ananya Iyer, 16, Class 11)** |
| **Design Constraint (C)** | **C3 – Mobile-first, one-handed (360 px width viewport)** |
| **Live Deployed App URL** | [https://et617-23b2456.vercel.app](https://et617-23b2456.vercel.app) |
| **GitHub Repository** | [https://github.com/subwizog/et617-endsem-23b2456](https://github.com/subwizog/et617-endsem-23b2456) |

---

## D1: Educational Problem

### 1. Problem Description
Class 11 physics students routinely treat the horizontal projectile range formula $R = \frac{v^2 \sin 2\theta}{g}$ as an abstract plug-and-chug equation rather than an emergent consequence of orthogonal velocity components and time of flight. This textbook-drill conditioning leaves two persistent misconceptions intact: the belief that **45° is universally optimal regardless of launch height**, and that **doubling launch speed merely doubles horizontal range**. For high-achieving Olympiad aspirants who are bored by repetitive formula substitution, standard practice fails to develop genuine experimental intuition. They require a rigorous, challenge-based inquiry laboratory where they must formulate hypotheses, conduct controlled single-variable experiments, observe trajectory ghosts, and resolve cognitive conflicts when their predictions fail under non-trivial boundary conditions.

### 2. Measurable Learning Outcomes
By completing this virtual laboratory inquiry sequence, the learner will be able to:
1. **Predict** the change in horizontal projectile range resulting from doubling launch speed at a fixed angle, and **verify** through experimental trials that range scales quadratically ($R \propto v^2$) rather than linearly.
2. **Compare** trajectories of complementary launch angles ($\theta$ and $90^\circ - \theta$) on level ground, and **explain** using mathematical symmetry why both angles achieve the identical horizontal range.
3. **Design** a controlled, single-variable experiment and **justify** analytically why launching from an elevated cliff ($h > 0$) causes the range-maximizing angle to drop below 45° ($\theta^* < 45^\circ$).

### 3. Context of Use
- **Setting:** Evening study, at home or during bus transit in Pune.
- **Device:** Personal Android smartphone (360 px width screen), operated primarily with one thumb while resting or commuting.
- **Session Duration:** 10–15 minute focused problem-solving bursts between competitive Olympiad mock sets.
- **Assumptions:** Flat landing surface, uniform downward gravitational field ($g = 9.8\text{ m/s}^2$), negligible air resistance (explicitly stated on the About screen).

---

## D2: Learner Persona

```
+------------------------------------------------------------------------+
| PERSONA: Ananya Iyer                                                   |
| Age: 16 | Grade: Class 11 CBSE (Science Stream) | Location: Pune, India|
+------------------------------------------------------------------------+
| Target Exam: Indian National Physics Olympiad (INPhO)                  |
| Device: Android Smartphone (360 px viewport width, one-handed use)     |
| Language: English medium                                               |
| Study Habit: 10-15 minute quick problem bursts between homework sets   |
+------------------------------------------------------------------------+
| PRIOR KNOWLEDGE:                                                       |
| • Kinematics equations of motion (SUVAT)                               |
| • Vector resolution into orthogonal components (v_x, v_y)              |
| • Basic trigonometric identities: sin(2θ) = 2 sinθ cosθ               |
| • Can derive range on flat ground on paper, but lacks visceral model   |
+------------------------------------------------------------------------+
| COGNITIVE MISCONCEPTIONS:                                              |
| • Misconception M1 (Universal 45°): Believes 45° ALWAYS maximizes      |
|   range, failing to account for initial height (h > 0).                |
| • Misconception M2 (Linear Speed Scaling): Intuition says "double the  |
|   speed, double the distance", overlooking quadratic v² dependency.    |
+------------------------------------------------------------------------+
| AFFECTIVE MOTIVATION & PAIN POINTS:                                    |
| • Despises routine textbook drills that require mindless calculation.  |
| • Highly motivated by Olympiad-style counterintuitive paradoxes.       |
| • High self-efficacy; needs guided Socratic inquiry rather than        |
|   paternalistic answer giveaways when an experiment fails.             |
+------------------------------------------------------------------------+
```

---

## D3: Educational Content

### 1. Conceptual Framework & Physics Model
The horizontal range $R$ of a projectile launched at angle $\theta$ with speed $v$ from height $h$ above a flat surface is governed by the independent decomposition of horizontal and vertical motions:
$$v_x = v \cos\theta, \quad v_y = v \sin\theta$$
Vertical displacement is:
$$y(t) = h + v_y t - \frac{1}{2}gt^2$$
Setting $y(T) = 0$ yields the total time of flight $T$:
$$T = \frac{v_y + \sqrt{v_y^2 + 2gh}}{g}$$
Horizontal range is:
$$R = v_x T = \frac{v \cos\theta \left(v \sin\theta + \sqrt{v^2\sin^2\theta + 2gh}\right)}{g}$$

- **Case 1: Level Ground ($h = 0$):**
  $$R = \frac{v^2 (2 \sin\theta \cos\theta)}{g} = \frac{v^2 \sin 2\theta}{g}$$
  Since $\sin(2(90^\circ - \theta)) = \sin(180^\circ - 2\theta) = \sin 2\theta$, complementary launch angles yield identical ranges. Doubling $v$ multiplies range by $2^2 = 4$.
- **Case 2: Elevated Cliff ($h > 0$):**
  Differentiating $R$ with respect to $\theta$ and setting $\frac{dR}{d\theta} = 0$ yields the optimal angle:
  $$\theta^* = \arctan\left(\frac{v}{\sqrt{v^2 + 2gh}}\right)$$
  Because $\sqrt{v^2 + 2gh} > v$ for all $h > 0$, the ratio is strictly $< 1$, proving $\theta^* < 45^\circ$. As $h \to \infty$, $\theta^* \to 0^\circ$ (pure horizontal launch).

---

### 2. Multi-Format Tasks & Assessment Items (5 Tasks across 4 Formats)

#### Task 1: The Bullseye (MCQ Hypothesis Format)
- **Prompt:** "A target sits 60 m away on flat ground. Launch speed is fixed at 25 m/s ($h = 0$). How many different launch angles can hit this target?"
- **Options:**
  - (a) Only one unique angle
  - (b) Exactly two different angles *(Correct)*
  - (c) Many different angles
- **Model Answer:** Option (b).
- **Correct Feedback:** "Two hits: 35° and 55°. Notice that $35^\circ + 55^\circ = 90^\circ$. Range depends on $\sin 2\theta$, which is mathematically identical for $\theta$ and $90^\circ - \theta$."
- **Misconception Feedback (if learner picks Option a):** "You found one angle. Now launch on the opposite side of 45°. Can a high lob reach the same distance as a low drive?"

#### Task 2: Double Trouble (Numeric Prediction Format)
- **Prompt:** "Baseline launch at $\theta = 40^\circ, v = 15\text{ m/s}$ ($h = 0$) achieves a range of 22.6 m. If you double launch speed to 30 m/s, what will the range be?"
- **Format:** Numeric input entry (meters).
- **Model Answer:** $\approx 90.5\text{ m}$ ($4 \times 22.6\text{ m}$).
- **Correct Feedback:** "Spot-on deduction! Range scales with $v^2$. When speed doubles, range expands by $2^2 = 4$ times ($4 \times 22.6\text{ m} \approx 90.4\text{ m}$)."
- **Misconception M2 Feedback (if learner predicts $\approx 45\text{ m}$):** "You predicted 45 m, but the measured range is 90.5 m! Notice that the projectile went much farther than double. Enter the Support Ladder to investigate why."

#### Task 3: The Cliff Shot (Interactive Experimentation Format)
- **Prompt:** "Launch from a 20 m cliff at 10 m/s. Does 45° still yield the maximum horizontal range? Manipulate $\theta$ to find the optimal angle."
- **Format:** Virtual lab parameter tuning ($\theta \in [0^\circ, 90^\circ]$) with animated trajectory.
- **Model Answer:** $\theta^* \approx 24.3^\circ$ (Range $\approx 22.6\text{ m}$), whereas $45^\circ$ yields only $20.3\text{ m}$.
- **Correct Feedback:** "Discovery made! The best angle is $\approx 24^\circ$ ($22.6\text{ m}$), outperforming $45^\circ$ by over 2.3 m. Free-fall time from the cliff allows shifting initial velocity into horizontal speed."
- **Misconception M1 Feedback (if learner tests only $45^\circ$ or asserts $45^\circ$ is best):** "Your 45° shot went 20.3 m, but another angle flew farther! 45° is optimal ONLY when landing at launch height. What did the cliff change?"

#### Task 4: Spot the Flaw (Controlled Experimentation MCQ Format)
- **Prompt:** "A student runs two trials: Trial 1 ($\theta = 30^\circ, v = 15\text{ m/s} \to R = 20.0\text{ m}$) and Trial 2 ($\theta = 45^\circ, v = 25\text{ m/s} \to R = 63.8\text{ m}$). Can the student conclude that the 45° angle caused the increased range?"
- **Options:**
  - (a) Yes, 45° is always better.
  - (b) No, both angle AND speed were changed simultaneously (confounding variables). *(Correct)*
  - (c) Neither, range only depends on height.
- **Model Answer:** Option (b).
- **Pedagogical Explanation:** In scientific inquiry, causation requires holding all extraneous variables constant while altering exactly one factor at a time.

#### Task 5: Olympiad Stretch (Analytical Justification Text Format)
- **Prompt:** "For $h = 30\text{ m}$ and $v = 15\text{ m/s}$, find the optimal angle. Explain in 1–2 sentences why increasing cliff height forces the optimal angle toward 0°."
- **Format:** Free-text written explanation evaluated by the AI Socratic Guide.
- **Model Answer:** $\theta^* = \arctan\left(\frac{15}{\sqrt{15^2 + 2(9.8)(30)}}\right) = \arctan(0.526) \approx 27.7^\circ$. As $h \to \infty$, the vertical time provided by gravity grows arbitrarily large, making any upward launch velocity redundant; maximum range is achieved by directing 100% of initial velocity horizontally.

---

## D4: Working Application

- **Live Application URL:** [https://et617-23b2456.vercel.app](https://et617-23b2456.vercel.app)
- **Identity Token Enforcement:** `23B2456 · ET 617 End-Sem` is permanently fixed in `#app-footer` across all screens and listed on `#screen-about`.

### Screen Architecture & Navigation Map

```
                  ┌──────────────┐
                  │   #/home     │
                  │   Roadmap    │
                  └──────┬───────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
  ┌──────────────┐┌──────────────┐┌──────────────┐
  │ #/predict/:id││   #/about    ││  #/summary   │
  │  Hypothesis  ││  Token & C3  ││  Portfolio   │
  └──────┬───────┘└──────────────┘└──────────────┘
         ▼
  ┌──────────────┐
  │   #/lab/:id  │◄────────────────┐
  │  Canvas Lab  │                 │
  └──────┬───────┘                 │
         ▼                         │ Retest
  ┌──────────────┐                 │
  │ #/results/:id│                 │
  │   Analysis   │                 │
  └──────┬───────┘                 │
         │ (if misconception)      │
         ▼                         │
  ┌──────────────┐                 │
  │#/support/:id ├─────────────────┘
  │4-Step Ladder │
  └──────────────┘
```

| Route | View Name | User Inputs | System Outputs | Transitions |
|---|---|---|---|---|
| `#/home` | **Roadmap** | Card click, Resume button tap | Status badges (Active, Completed, Locked), trial count chips | &rarr; `#/predict/:id` |
| `#/predict/:id` | **Hypothesis** | MCQ radio tile selection, numeric prediction entry, written rationale | Dynamic validation prompt, baseline comparisons | &rarr; `#/lab/:id` |
| `#/lab/:id` | **Virtual Lab** | Stepper taps ($\pm 1^\circ, \pm 1\text{ m/s}$), continuous sliders, Launch button | HTML5 `<canvas>` tracer animation, ghost paths (#1, #2), readouts ($R, H, T$), target hit toast | &rarr; `#/results/:id` |
| `#/results/:id` | **Results** | "Enter Support" tap, "Spot the Flaw" interactive quiz | Prediction vs result card, trial table, range bar chart, harder follow-up (if correct) | &rarr; `#/support/:id` or `#/summary` |
| `#/support/:id` | **Support Ladder** | Step progression buttons, sweep button, hypothesis revision input | Rung 1 gap comparison, Rung 2 Socratic prompt, Rung 3 clean SVG sweep curve, Rung 4 revision | &rarr; `#/lab/:id` (re-test) |
| `#/summary` | **Summary** | Return button tap | Unlocked principle cards (1–4), locked placeholders for unearned items, launch statistics | &rarr; `#/home` |
| `#/about` | **About** | Reset all progress button tap | Identity token `23B2456`, physics model rules, C3 mobile specs, AI disclosure | &rarr; `#/home` |

### Constraint C3 (Mobile-First, One-Handed) Visible Implementation
1. **Viewport Geometry:** Constrained strictly to 360 px width with zero horizontal overflow (`touch-action: manipulation`).
2. **Thumb Zone Ergonomics:** All primary interactive elements (Launch button, Steppers, Bottom Navigation Bar) are positioned in the bottom 40% of the screen.
3. **Touch Target Sizing:** Steppers measure $54 \times 48\text{ px}$ and the Launch button is $52\text{ px}$ tall, comfortably exceeding the $48\text{ px}$ minimum accessibility threshold.
4. **Zero Hover-Only Actions:** Every control is fully operable via direct single taps without requiring drag-and-drop or hover tooltips.

---

## D5: Two Contrasting Learner Scenarios

### Scenario A: Correct Learner Path (Deductive Master)
1. **Predict:** In Challenge 2, the learner recognizes that $R = \frac{v^2 \sin 2\theta}{g}$. Given the baseline of $22.6\text{ m}$ at $15\text{ m/s}$, she calculates $(2)^2 \times 22.6 = 90.4\text{ m}$ and inputs `90.5`.
2. **Experiment:** In the Lab, she sets $v = 30\text{ m/s}$ and taps **Launch Projectile**. The projectile lands at $90.5\text{ m}$.
3. **System Response:** Navigating to Results, the system recognizes an exact match. It **skips the Support Ladder entirely**, marks Challenge 2 completed, unlocks Challenge 3, and presents the **Olympiad Extension Harder Follow-Up**:
   > *"If you triple the launch speed (3×), by what numerical factor will the range increase? What happens if speed is halved (0.5×)?"*

### Scenario B: Misconception Learner Path (M2 Speed Doubling & Support Ladder)
1. **Predict:** In Challenge 2, the learner assumes linear proportionality and enters `45.2` m ($2 \times 22.6\text{ m}$).
2. **Experiment:** In the Lab, she launches at $30\text{ m/s}$ and observes the ball traveling to $90.5\text{ m}$.
3. **System Response (Pedagogical Safeguard):** The Results screen flags `M2`. **Crucially, it does NOT disclose $v^2$ or mention that the range quadrupled.** Instead, it states:
   > *"Prediction Mismatch: You predicted 45.2 m, but the ball reached 90.5 m. The relationship between speed and range is not simply proportional. Enter the Support Ladder to investigate."*
4. **Scaffolding Ladder Navigation:**
   - **Rung 1 (Name the Gap):** Side-by-side comparison of the $45.2\text{ m}$ prediction versus the $90.5\text{ m}$ result with ghost trajectories.
   - **Rung 2 (Socratic Reflection):** Receives the AI Socratic prompt: *"When speed doubled, did both horizontal speed and time of flight increase?"*
   - **Rung 3 (Controlled Sweep):** Taps **Run Controlled Speed Sweep**. The system generates trials across $v \in [10, 35]\text{ m/s}$ and renders a clean Range-vs-Speed SVG curve. The learner observes the upward parabolic curvature without numeric peak giveaways.
   - **Rung 4 (Revise):** The learner writes: *"Range grows much faster than speed because both horizontal speed and time in the air increase together."*
5. **Re-test & Resolution:** Returning to the Lab, she runs a confirmatory trial. The system verifies cognitive resolution, marks the challenge complete, and unlocks the quadratic principle on the Summary screen.

---

## D6: AI Functionality Specification

### 1. Architectural Overview
The AI capability functions exclusively as a **Socratic lab guide**, formulated to generate targeted inquiry prompts without revealing numerical solutions or physical laws prematurely.

```
[Client (js/ai.js)]
       │
       ▼ POST (with 6000 ms timeout)
[/api/feedback (Vercel Serverless Function)]
       │
       ├── Check LLM_API_KEY
       │     └── If missing ──► Return Offline Rule-Based Fallback
       │
       ├── Call Google Gemini REST API (gemini-1.5-flash)
       │     └── System Prompt + Context JSON
       │
       ▼
[js/validator.js (Safety Filter)]
       ├── Valid JSON with {"tag", "question"}?
       ├── Tag in ['M1', 'M2', 'CONFOUNDED', 'NONE']?
       ├── Word count <= 25 words?
       ├── Ends with '?'?
       └── Answer Leak Regex Check (no "24°", "quadruple", "v²", "less than 45")
             ├── FAIL ──► Return Safe Offline Fallback (Labelled "Offline feedback")
             └── PASS ──► Return Live Socratic Guidance (Labelled "AI Socratic Guide")
```

### 2. Exact Prompts & Model Calls
- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.LLM_API_KEY}`
- **System Prompt (Verbatim):**
```text
You are a physics lab guide for a Class 11 Olympiad student. The student is exploring projectile motion (no air resistance, g = 9.8 m/s²).
Rules:
1. Never state the final answer (no optimal angle, no target range, no "4 times").
2. Reply with ONE short Socratic question (max 25 words) that points at the variable or the experiment design.
3. Tag the likely misconception: "M1" (45° is always best), "M2" (range is linear in speed), "CONFOUNDED" (changed two variables), or "NONE".
4. Use simple, friendly language. Short sentences.
Return ONLY JSON: {"tag": "...", "question": "..."}
```
- **User Prompt Payload:**
```json
{
  "challengeId": 3,
  "hypothesis": "45 degrees always gives max range",
  "trials": [
    { "theta": 45, "v": 10, "h": 20, "R": 20.3 },
    { "theta": 30, "v": 10, "h": 20, "R": 22.1 }
  ],
  "supportLevel": 2
}
```

### 3. Safety Validation Pipeline & Answer Leak Checks
Before the response is delivered to the learner, `js/validator.js` enforces:
1. **Schema Check:** Strict JSON structure containing `tag` and `question`.
2. **Length Constraint:** $\le 25$ words; must terminate with a question mark (`?`).
3. **Forbidden Pattern Regex:**
   - *Challenge 2:* `/4\s*(x|×|times)/i`, `/quadruple/i`, `/v²|v\^2/i`, `/90(\.5)?\s*m/i`.
   - *Challenge 3:* `/2[2-6]\s*(°|deg|degrees)/i`, `/24(\.3)?/`, `/less than 45/i`, `/optimal angle/i`.

### 4. Deterministic Offline Fallback
If the network times out (> 6s), the API key is unconfigured, or the model violates safety rules, the system defaults to pre-scripted pedagogical questions labelled as `"Offline feedback"`:
- *Challenge 2 Fallback:* `"When speed doubled, did both horizontal speed and time of flight increase?"`
- *Challenge 3 Fallback:* `"From a 20 m cliff, what happens if you direct more of your launch speed horizontally?"`

---

## D7: Pedagogical Rationale

### 1. Constructivist Inquiry & Cognitive Conflict
In accordance with constructivist learning theory, misconceptions cannot be extinguished by passive lecture; learners must experience **cognitive conflict** when their internal mental models fail to predict real-world experimental observations. In Challenge 2, experiencing the ball overshoot 45 m to land at 90.5 m forces the learner to confront the limitation of linear thinking.

### 2. Resolution to Problem 5 Design Challenge
> **Design Challenge:** *How will the system support learning from an unsuccessful experiment without simply revealing the correct answer?*

The application implements a strict **Four-Step Support Ladder**:
1. **Name the Gap:** Explicitly visualizes the prediction versus reality using ghost paths, avoiding evaluative praise or condemnation.
2. **Socratic Questioning:** Prompts inquiry into underlying physical mechanisms (e.g. asking how time of flight behaves).
3. **Controlled Variable Replay:** Provides single-variable parameter sweeps that generate non-linear graphs. Crucially, **the application never places peak markers or numerical optimal badges on the graph**, compelling the learner to extract qualitative meaning from the curve.
4. **Hypothesis Revision:** Requires the learner to articulate their revised mental model before returning to the lab to re-test.

### 3. Alignment with Constraint C3 & Learner Context L6
- **C3 Ergonomics:** An Olympiad student studying during transit cannot manage fiddly desktop-style canvas controls. Providing $54\times 48\text{ px}$ $+$ and $-$ steppers allows rapid, single-thumb parameter adjustment without precision micro-dragging.
- **L6 Differentiation:** Strong learners resent being forced into patronizing tutorials. The system differentiates automatically: correct predictions bypass scaffolding and unlock advanced follow-up problems, maintaining cognitive momentum.

---

## D8: Evaluation Plan

### 1. Assessment Rubric Mapped to D1 Outcomes

| Learning Outcome | Developing (1) | Proficient (2) | Exemplary (3) |
|---|---|---|---|
| **LO1: Predict & verify speed scaling ($R \propto v^2$)** | Predicts linear doubling (45 m); fails to revise belief after 30 m/s launch. | Identifies discrepancy in Lab; revises hypothesis using the Support Ladder sweep graph. | Immediately predicts $\approx 90\text{ m}$ based on $v^2$ SUVAT derivation; solves 3× harder follow-up. |
| **LO2: Compare complementary angles ($90^\circ - \theta$)** | Finds only one launch angle; cannot hit 60 m target with a second angle. | Finds both 35° and 55° through trial-and-error; recognizes they sum to 90°. | Explains the symmetry analytically using $\sin(2\theta) = \sin(180^\circ - 2\theta)$. |
| **LO3: Justify cliff optimum shift ($\theta^* < 45^\circ$)** | Insists 45° must be optimal despite experimental data showing 24° flies farther. | Discovers $\approx 24^\circ$ via the angle sweep; explains that cliff provides extra air time. | Derives that as $h \to \infty$, optimal angle approaches $0^\circ$ because vertical launch velocity is redundant. |

### 2. Telemetry Log Data Collected
The application logs timestamped interaction events in `AppState`:
- `trial`: `[id, challengeId, theta, v, h, R, H, T, timestamp]`
- `changed`: Tracks array of altered variables between consecutive trials to detect confounding.
- `hypotheses`: Stores initial predictions, revisions, and written explanations.
- `supportLevel`: Tracks depth of scaffolding required per challenge.

### 3. Quantitative Criteria for Success
A student cohort achieves successful mastery if:
- $\ge 85\%$ of learners identify both complementary angles in Challenge 1 within 6 trials.
- $\ge 80\%$ of learners with initial misconception M2 successfully identify $v^2$ scaling after completing the Support Ladder.
- $\ge 75\%$ of learners explain why optimal cliff launch angle drops below 45° in Challenge 4.

---

## AI-Use Log and Reflection

### 1. Log of AI Prompts and Outputs

| Group | Goal / Prompt | AI Actions & Deliverables Produced |
|---|---|---|
| **Group 1** | Phase 1: Repo skeleton, physics engine, unit tests, shell router | Created `.gitignore`, `config.js`, `physics.js`, `tests/physics.test.js` (5/5 passed), `index.html`, `style.css`, and hash router. |
| **Group 2** | Phase 2: Virtual lab screen, canvas physics, steppers, ghost paths | Built `state.js`, `lab.js` with auto-scaling coordinate mapping, projectile animation, ghost paths, and C3 mobile steppers. |
| **Group 3** | Phase 3: Challenges 1–3 content, predict & results screens, target logic | Built `content.js`, MCQ and numeric prediction cards, trial history tables, and interactive "Spot the Flaw" task. |
| **Group 4** | Phase 4: Diagnosis engine, 4-step support ladder, sweep curves, summary | Built `diagnose.js` (M1, M2, Confounded, Failed Prediction), Support Ladder screen, and Challenge 4 Stretch. Implemented strict pedagogical safeguards preventing premature answer exposure. |
| **Group 5** | Phase 6: AI Socratic guide, Gemini REST API, answer-leak regexes | Built `validator.js`, `api/feedback.js`, `ai.js`, `tests/ai_validator.test.js` (7/7 passed), with offline fallback and locked summary placeholders. |
| **Group 6** | Phase 7: Polish, README, About screen, C3 verification, final checklist | Updated `README.md` with viva cheat sheet, finalized `#screen-about` with reset button, verified all 9 checklist items. |

### 2. Critical Reflection on AI Use
Using generative AI as an architectural co-pilot significantly accelerated the generation of repetitive mathematical coordinate transforms and unit test assertions. However, strict critical human oversight was essential in two key instructional areas:
1. **Preventing Premature Answer Leakage:** Early AI draft implementations tended to immediately explain *why* an answer was wrong (e.g. explicitly blurting out *"Range quadruples because of $v^2$!"*). Human intervention was necessary to install the regex-based safety validator and ensure that students with misconceptions enter the Support Ladder without having the discovery ruined.
2. **Domain-Specific Scaffolding:** Ensuring that Rung 3 sweep graphs omitted peak markers and optimal badges required explicit design constraints to protect the student's authentic inquiry experience.

### 3. AI Chat Export File
A complete transcript of all AI conversation prompts and model responses is committed in the repository root as [Chat_History.txt](file:///c:/Users/prajw/et617_endsem/et617-endsem-23b2456/Chat_History.txt) in compliance with Section 6 of the exam instructions.
