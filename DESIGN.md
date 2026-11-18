# DESIGN.md - ET 617 End-Sem

**Identity:** 23B2456  |  **Card:** P5 Virtual lab · T10 Projectile motion · L6 Olympiad learner · C3 Mobile-first, one-handed

## 1. Educational problem
Class 11 learners meet R = v² sin2θ / g as a formula to plug numbers into, so they never see *why* range depends on angle and speed the way it does. Two beliefs survive routine practice: "45° is always the best angle" and "twice the speed gives twice the range". Olympiad problems break both (launch from a height, changing speed), and a strong learner who only drills formula questions is bored and still wrong. This app is a short, challenge-driven virtual lab where the learner predicts, experiments, and revises their hypothesis, so the formula becomes something they discover and can defend.

**Context of use:** Evening, on their own Android phone (360 px wide), one thumb, in short 10-15 minute bursts between problem sets. Level ground and a launch-from-height variant. No air resistance (stated clearly in the app).

## 2. Learning outcomes (measurable)
1. **Predict** how the range changes when launch speed is doubled at a fixed angle, and check the prediction with a controlled experiment.
2. **Compare** the ranges of complementary angles (e.g. 30° and 60°) and **explain** why they match using the idea that range depends on sin2θ.
3. **Design** a one-variable-at-a-time experiment and **justify** why the best angle drops below 45° when launching from a height.

## 3. Persona (expanded from L6)
- **Name / age:** Ananya Iyer, 16, Class 11, Pune
- **Goal:** Qualify for the INPhO stage; wants problems that feel like Olympiad puzzles, not textbook drills
- **Prior knowledge:** Kinematics equations (SUVAT), resolving vectors, basic trig identities, can derive range on level ground on paper
- **Device / time / language:** Own Android phone, 360 px width, mostly one-handed (on the bus or lying in bed), 10-15 min at a time, English medium
- **Misconception M1:** "45° always gives the maximum range" (true only when launch and landing heights are equal)
- **Misconception M2:** "Double the speed, double the range" (range scales with v², so it quadruples)
- **Why she gets bored:** Repeating the same plug-in questions; she wants to be challenged and to test her own ideas

## 4. Learning activity and content plan
**Lab variables:** launch angle θ (0-90°), launch speed v (5-40 m/s), launch height h (0-30 m). g fixed at 9.8 m/s², no drag.
**Outputs:** animated trajectory, range, max height, time of flight, faded "ghost" paths of earlier trials, trial table.

**Challenges (puzzle-style, not drills):**
1. *The Bullseye:* Hit a target 60 m away on level ground using **two different angles**. (Leads to complementary angles.)
2. *Double Trouble:* Predict the range if the speed is doubled, then test. (Targets M2.)
3. *The Cliff Shot:* Launch from a 20 m cliff. Find the angle for the longest range. (Targets M1.)
4. *Stretch:* Find the angle that maximises range for h = 30 m and justify it. (Open-ended; unlocks after challenge 3.)

**Task formats (min. 5 tasks, 2+ formats):** prediction with a number entry, "drag the slider to hit the target" experiment tasks, multiple-choice hypothesis selection, short written explanation, and a "spot the flaw in this experiment" task.

**Feedback design:**
- Correct path: confirm the reasoning (not just the number), then raise the difficulty with a harder variant.
- M2 path (doubling): show the prediction versus the result as ghost paths side by side, then ask "Which variable did you change? What happens to range at 10, 20, 40 m/s?" and let the learner re-run at three speeds before revising.
- M1 path (45° rule): after the learner's 45° cliff shot is beaten by a lower angle, ask them to sweep θ in steps and look at the range-vs-angle plot, then ask where the peak sits and why it moved.

## 5. Design challenge: learning from an unsuccessful experiment
When a prediction fails or the learner changes two variables at once, the app **never states the correct answer**. Support ladder:
1. **Name the gap:** show prediction vs result and the ghost paths.
2. **Question:** "Between trial 3 and 4 you changed θ and v. Which one caused this?"
3. **Controlled replay:** a button that locks all but one variable and lets the learner sweep it, producing a range-vs-variable plot they must interpret.
4. **Revise:** the learner rewrites their hypothesis and re-tests. Only after two further failures does a worked-example hint appear.

## 6. Screens (>= 5, connected)
1. **Home:** choose a challenge, resume where you left off, link to About (roll no. in footer on every screen)
2. **Predict:** write or select a hypothesis and enter a predicted number
3. **Lab:** sliders (bottom sheet), Launch button, animated trajectory, ghost paths
4. **Results:** trial table plus range-vs-variable plot; prediction vs result
5. **Support / Revise:** ladder from section 5, revise the hypothesis
6. **Summary:** what you found, next challenge
7. **About:** identity token, model assumptions (no drag), AI use

## 7. C3 constraint: mobile-first, one-handed
- Designed at 360 px width; no horizontal scroll
- All primary actions (Launch, Next, Reset, sliders) in the **bottom thumb zone**; bottom navigation bar
- Sliders as bottom sheet with large steppers (+/- 1° and +/- 1 m/s) so precise input needs no tiny drags
- Tap targets >= 48 px; **no hover-only interactions**; no drag-and-drop required

## 8. AI features (details go in D6)
- **Hypothesis feedback:** the learner's written hypothesis plus their trial log goes to an LLM through a Vercel serverless function (API key in env vars). It returns JSON: `{misconception_tag, socratic_question, hint_level}`. Output is validated against the schema, and a check rejects any response that states the final numeric answer.
- **Fallback:** if the call fails or fails validation, rule-based feedback is shown using the pre-written M1 and M2 responses (clearly labelled "offline feedback").

## 9. Build plan and checkpoints
- 0:30 this file committed
- 1:00 first deploy live (Lab screen working with canvas physics)
- 1:30 all screens, AI route and fallback done
- Commit every 30 minutes; never commit API keys
- Stack: Plain HTML/JS with canvas, hosted on Vercel
