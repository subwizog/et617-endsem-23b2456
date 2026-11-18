# **ET 617-2026**

# **End-Semester Examination**

**Date & Time:** 18 Nov, 6-9 PM

## **1\. Examination instructions**

In 2 hours, design, build and deploy a working educational application for the combination on your personal exam card. The application must be live on Vercel (or an equivalent host) when you submit.

* **Format:** individual, computer-based, open internet. Generative AI tools, existing apps, datasets, Figma, Canva and any other resources are allowed.  
* **Your task is personal.** Every student should select an exam card (Section 2). You must build for your card's problem, topic, learner context and design constraint. A submission built for a different card receives a score of zero for the mismatched components.  
* **Design is assessed, not polish.** Marks go to how well the problem, learner, content and design fit together, and to your judgement in using AI. Visual polish carries few marks.  
* **You will be asked to explain and modify your app live** in a short viva immediately after the exam

### **Timeline**

| Time | What you do | Checkpoint |
| :---- | :---- | :---- |
| 0:00–1:30 | Define the problem, learning outcomes and persona. Plan the learning activity and content.Complete both learner scenarios, feedback and your card's design constraint. | DESIGN.md committed to your repo by 0:30Commits at least every 30 minutes |
| 1:35–1:55 | Write the report: rationale, evaluation, AI specification and AI-use reflection. | Final deployment |
| 1:55–2:00 | Submit on Moodle (Section 6). | Moodle submission time |
| 2:00–3:00 | Viva at your scheduled slot (Section 7). | Submitted app and repo frozen; viva changes go on a separate viva branch |

## **2\. Your exam card**

You should select options for each card field from the below table and disclose this card within the first 10 mins of the exam via excel sheet shared in Moodle.

| Card field | What it fixes | Source |
| :---- | :---- | :---- |
| **P** –Problem statement | Which of the six problems you solve | Section 3 |
| **T** – Topic | The subject content your learning activity teaches. Each problem has its own topic bank | Section 4.1 |
| **L** – Learner context | The seed for your learner persona. You must expand it into a full persona | Section 4.2 |
| **C** – Design constraint | A constraint your working app must visibly satisfy | Section 4.3 |
| **ID** – Identity token | Your roll number e.g. 23B1234 |  |

With 6 problems × 10 topics × 8 learner contexts × 6 constraints there are **2,880 possible cards**. So having same system by two students is possible but less probable. 

### **Identity rules**

* Show your identity token in the footer of every screen and on an About screen.  
* Deploy at et617-\<rollno\>.vercel.app (or other similar hosting service).  
* Name your GitHub repository et617-endsem-\<rollno\> and create it after the exam starts.

### **Example cards**

| Roll no. | P | T | L | C |
| :---- | :---- | :---- | :---- | :---- |
| 23B1234 | P5 Virtual lab | P5-T3 Factors affecting the rate of photosynthesis | L5 Anxious repeat learner | C4 10-minute sessions |
| 23B1235 | P  literacy | P2-T3 Tamil ல / ள / ழ | L8 | C6 Voice-first |

## **3\. Problem statements**

Select one problem from below and solve. Each problem ends with a design challenge that your pedagogical rationale must answer explicitly.

### **P1 – Context-aware visual learning application**

*Image processing · Computer vision · Situated learning · Generative AI*

Design an application that lets learners explore your card's topic through images captured from their immediate surroundings. The application uses image processing or computer vision to identify objects, patterns or phenomena and turns these observations into learning activities: explanations, annotations, questions or short instructional content. It must help learners connect classroom knowledge with real-world observation, not simply identify objects.

**Design challenge:** How will AI-generated interpretations of a learner's photo be kept accurate, pedagogically relevant and appropriate for your learner's context? Show what happens when the AI misidentifies the image.

### **P2 – Contextual language and literacy application**

*NLP · Language learning · Localisation*

Design an application that supports literacy or language learning for the Indian language and sociocultural context in your card's topic. It must use at least one NLP capability: speech recognition, text simplification, spelling feedback, contextual sentence generation or conversational practice.

**Design challenge:** How will the application distinguish a learner's language errors from acceptable dialect or pronunciation variations? Show one example of each in your app.

### **P3 – Multi-agent collaborative learning environment**

*AI agents · Collaborative learning · Scaffolding*

Design an application where at least three AI agents perform distinct educational roles for your card's topic (for example, one explains, one challenges the learner's reasoning, one evaluates evidence and gives feedback). The agents must exchange information with each other to support the learner's progress.

**Design challenge:** How will the system prevent conflicting agent advice from confusing learners while keeping learner agency? Show one moment where two agents disagree and how the learner experiences it.

### **P4 – Adaptive tutor with automatic question generation**

*Adaptive learning · Assessment · Generative AI*

Design a tutor for your card's topic that generates questions based on the learner's performance, misconceptions and previous responses. It must go beyond multiple-choice: support at least three question formats, evaluate learner explanations, diagnose misconceptions and adjust the difficulty or nature of the next task.

**Design challenge:** How does the tutor decide whether the learner needs a harder question, an alternative explanation or prerequisite instruction? State the decision rule and show each of the three outcomes.

### **P5 – Inquiry-based virtual laboratory**

*Simulation · Inquiry learning · Experimental reasoning*

Design a virtual laboratory for your card's topic where learners manipulate variables, form hypotheses, run experiments and interpret results. The application must respond to the learner's experimental choices and support revising hypotheses.

**Design challenge:** How will the system support learning from an unsuccessful experiment without simply revealing the correct answer? Show one unsuccessful experiment and the support that follows.

### **P6 – Collaborative problem-solving application**

*CSCL · Group learning · Shared representations*

Design an application that helps two or more learners solve your card's problem together. It must support a shared artefact, explanation of decisions, peer feedback and resolution of disagreements.

**Design challenge:** How will the application tell meaningful collaboration apart from one student doing all the work? Name the signals you use and show the response when collaboration is one-sided.

## **4\. Option banks**

Your can pick one entry from each bank. Topics are listed per problem so that each one suits its problem's technology: photographable things for P1, a specific Indian language for P2, variables you can manipulate for P5, and so on.

### **4.1 Topic bank (T), by problem**

| \# | P1 Visual (photograph it) | P2 Language & literacy | P3 Multi-agent | P4 Adaptive tutor | P5 Virtual lab | P6 Collaborative |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| T1 | Leaf types and venation (Cl. 6\) | Marathi: barakhadi / matra recognition for early readers | Why do seasons occur? Tilt vs distance (Cl. 6–9) | Integers: operations with negative numbers (Cl. 7\) | Simple pendulum: length, mass, amplitude vs period (Cl. 9–11) | Plan a school rainwater harvesting system: roof area, rainfall, tank size |
| T2 | Waste segregation: wet, dry, hazardous, e-waste (Cl. 6–8) | Hindi: gender agreement (ling) in verbs and adjectives | Does a heavier object fall faster? (Cl. 9\) | Decimal place value and comparison (Cl. 5–6) | Floating and sinking: density (Cl. 6–8) | Design a balanced weekly mid-day meal menu within a budget |
| T3 | Simple machines in household objects (Cl. 6–9) | Tamil: ல / ள / ழ in spelling and pronunciation | Series vs parallel circuits (Cl. 10\) | Linear equations in one variable (Cl. 8\) | Factors affecting the rate of photosynthesis (Cl. 10\) | Plan a village school bus route that minimises travel time |
| T4 | Symmetry in everyday objects (Cl. 6–7) | Bengali: conjunct consonants (juktakkhor) in reading | Food chains: effect of removing a species (Cl. 7\) | Acids, bases and indicators (Cl. 7–10) | Electrical resistance: length, area, material of a wire (Cl. 10\) | Trace the source of a local water-borne disease outbreak from clues |
| T5 | 3D shapes and nets in packaging (Cl. 8\) | Telugu: short vs long vowels in spelling | Causes of the 1857 revolt: weighing sources (Cl. 8\) | Ratio and proportion in recipes and maps (Cl. 6–7) | Rate of evaporation: area, temperature, wind, humidity (Cl. 9\) | Budget a class trip within a fixed rupee limit |
| T6 | Reading nutrition labels (Cl. 7–8) | Kannada: conversational phrases for a market or ration shop | Probability: is a “lucky streak” real? (Cl. 9–10) | Newton's laws: force and motion (Cl. 9\) | Seed germination conditions (Cl. 6\) | Waste management plan for a housing society |
| T7 | Soil types and signs of erosion (Cl. 7\) | Gujarati: reading bus timetables and signboards | How the monsoon forms (Cl. 9\) | English tenses: simple past vs present perfect (ESL) | Rate of reaction: concentration, temperature, particle size (Cl. 10–11) | Draft a classroom constitution with rights and duties |
| T8 | Road signs and traffic safety | Odia: phonemic awareness, initial sounds and rhyme | Fundamental rights vs duties: case analysis (Cl. 8\) | Human digestive system (Cl. 7–10) | Refraction and image formation by lenses (Cl. 10\) | Reconstruct a historical event timeline from primary sources |
| T9 | Rusting: conditions for corrosion (Cl. 7–8) | Malayalam: chillu letters in spelling | Where does a plant's mass come from? (Cl. 7–10) | Percentages: discount, profit and loss (Cl. 8\) | Heat conduction in different materials (Cl. 7\) | Size a solar lighting setup for a home: load, panel, battery |
| T10 | Angles in local structures: stairs, ramps, roofs (Cl. 7\) | Hindi for Bhojpuri-speaking learners: श / स and ड़ | Supply and demand: onion price spikes (Cl. 9\) | Loops in block or Python programming (Cl. 8–11) | Projectile motion: angle and speed vs range (Cl. 11\) | Use match statistics to pick a balanced school sports team |

### **4.2 Learner-context bank (L)**

Each entry is a seed. Expand it into a full persona, name, age, prior knowledge for your topic, two likely misconceptions, device, time, language and motivation.

| \# | Learner context |
| :---- | :---- |
| L1 | Class 6–8 student in a rural government school, regional-language medium, uses a parent's Android phone for about 30 minutes in the evening |
| L2 | First-generation learner in an urban low-income settlement, attends an NGO after-school centre with shared tablets |
| L3 | Adult learner (25–45) in a self-help group or literacy program, low print literacy, comfortable with WhatsApp voice notes |
| L4 | Learner with low vision who uses screen magnification or a screen reader |
| L5 | Learner repeating the topic after failing it once, high anxiety and low self-efficacy |
| L6 | High-achieving learner preparing for an Olympiad, bored by routine practice |
| L7 | Multi-grade classroom: one teacher, Classes 3–5 together, one projector and a few shared devices |
| L8 | Learner whose home language differs from the school medium (e.g. Bhojpuri at home, Marathi at school) |

### **4.3 Design-constraint bank (C)**

Your working app must satisfy the constraint visibly. Explain in the report how it shaped your design.

| \# | Constraint | What must be visible in the app |
| :---- | :---- | :---- |
| C1 | Low bandwidth | Core activity works on a slow connection; no media over 1 MB; a clear fallback when an AI call fails |
| C2 | Learner's own language | All learner-facing text and feedback in the persona's language; English toggle optional |
| C3 | Mobile-first, one-handed | Designed for 360 px width; key actions within thumb reach; no hover-only interactions |
| C4 | 10-minute sessions | One complete learning sequence fits in 10 minutes; the learner can stop and resume where they left off |
| C5 | Teacher-in-the-loop | A teacher view that shows learner progress and lets the teacher approve or override AI feedback |
| C6 | Voice-first | At least one full interaction where both input and output are spoken |

## **5\. Required deliverables**

You submit a working hosted app plus a report with eight parts. Every part must be specific to your card. Placeholder text such as “AI generates a question” earns no marks: show the actual content and the actual feedback.

| \# | Deliverable | Minimum expectation |
| :---- | :---- | :---- |
| D1 | Educational problem | The problem for your topic and learner, in 3–5 sentences. Three measurable learning outcomes using action verbs (explain, predict, compare…). The context of use: where, when, on what device |
| D2 | Learner persona | Expanded from your L seed: name, age, prior knowledge of the topic's prerequisites, two likely misconceptions, device, time, language, motivation |
| D3 | Educational content | One complete learning activity: the concept explanation; at least 5 tasks or questions in at least 2 formats; model answers; feedback for a correct response and for each of the 2 misconceptions in D2 |
| D4 | Working application | Hosted at et617-\<rollno\>.vercel.app. At least 5 connected screens or states with learner inputs, system outputs and transitions. Your C constraint visibly implemented. Identity token on every screen |
| D5 | Two contrasting learner scenarios | Run on the live app: (a) a learner who responds correctly, (b) a learner who shows one of your D2 misconceptions. The system must respond differently. Include screenshots of both paths in the report |
| D6 | AI functionality specification | For every AI feature: what the AI does, what input it receives (show the actual prompt or model call), what it outputs, how the output is checked before the learner sees it, and the fallback when it fails or is wrong |
| D7 | Pedagogical rationale | How the design supports learning; how feedback and scaffolding are provided; your answer to your problem's design challenge; how the C constraint and the learner context shaped your choices |
| D8 | Evaluation plan | How you would assess whether learners achieved each outcome in D1: assessment items or rubric, the log data you would collect, and what result would count as success |

### **AI-use log and reflection (part of the report)**

* Share links or exports of every AI chat you used; in the order you used them.

### **Report template**

Use these headings in order: Identity card · D1 · D2 · D3 · D4 (URL, screen map) · D5 · D6 · D7 · D8 · AI-use log and reflection.

## **6\. Process evidence and submission**

How you built the app counts as evidence alongside the app itself. Only work committed and deployed before Moodle closes is graded.

### **Process evidence**

* Create your repository **after** the exam starts. GitHub and Vercel timestamps are checked.  
* Commit DESIGN.md (problem, outcomes, persona, content plan) by 0:30.  
* First deployment live by 1:00.  
* Commit at least every 30 minutes. A single large commit of a finished app will be reviewed.  
* No code may be reused from your course project. A starter template or UI library is fine if you name it in the report.

### **API keys**

* Never commit API keys. Store them as Vercel environment variables.  
* If an AI service fails during the exam, a clearly labelled fallback using recorded sample outputs is acceptable. Your D6 specification must still describe the real AI behaviour.

### **Moodle submission checklist**

* ☐ Live app URL: et617-\<rollno\>.vercel.app  
* ☐ GitHub repository link (public, or shared with the course account)  
* ☐ Report as a single PDF using the template in Section 5  
* ☐ AI chat share links or exports  
* ☐ Screenshot of your exam card

## **7\. Viva and live change request**

Last one hour is reserved for Viva.  Viva will include three tasks.

| Part | What happens |
| :---- | :---- |
| Walkthrough | Show the correct path and the misconception path on the live app |
| Live change request | The examiner gives one change from the list below. Make it with any tools you like, AI included, while the examiner watches |
| Why question | Explain one design decision tied to your persona or constraint |

## **9\. Academic integrity and AI use**

AI tools are allowed; another person's work is not. The rules:

* **Plagiarism.** Identical or near-identical educational content, persona, feedback text or source code (excluding framework boilerplate and named templates) across submissions is treated as plagiarism. A similar app structure that arises from using the same AI tool is not a problem, as long as the content and design are your own.  
* **Your card only.** Building for a different card, or sharing your card's work with another student, is misconduct for both students. \- 0 Marks in the End Sem for all the parties involved.  
* **Disclose AI use.** Undisclosed AI chats or AI-generated content found later will be treated as a breach.  
* **Checks.** Submissions are compared with code-similarity tools, a text comparison of deployed content, repository history and AI chat logs.

***Let's build interesting Educational Apps***

|  CRITERIA | SCALE |  |  |
| ----- | ----- | :---- | :---- |
|  | **POTENTIAL TO IMPROVE** | **VALUABLE** | **EXEMPLARY** |
| **Language comprehensibility  C3. Is the language appropriate for the intended learners?**    *What does ‘language appropriate for intended learners’ mean?  It means the language used is comprehensible by the target group of learners. For example: it is age appropriate,vocabulary/accent familiar to intended learners is used, accent is clear to the target learners.*   | The Language used is difficult to understand and follow by the intended learners. The vocabulary/accent maybe unfamiliar, and/or sentences are complex and hard to follow (difficult phrasing) | The Language used can be understood by the intended learners with some effort. The vocabulary/accent/sentence phrasing might be difficult to follow.  . | The language used is easily understandable by the intended learners. The vocabulary and the accent used is familiar to the learners. Also, the sentences spoken or those appearing on-screen are short and simple to follow. Learners do not need to spend extra time to comprehend the language used. |
| **P2. Addressing learning gaps/alternate conceptions  Does the content in the learning unit effectively address common learner alternate conceptions/learning gaps?** *To evaluate this question:* Consider the content in a learning unit i.e. content \+ learning activities \+ assessments included in the learning unit. *Example of ‘alternate conceptions/learning gaps’ from Maths:* When teaching measurement of length, the learning unit should show/ test learners on measurement of different objects – small as well as large, horizontal as well as vertical as well as at an angle, measuring breadth/height of rectangular objects as well as diameter of circular objects. Also measurement with a broken scale. *How to score this question?* It is useful to have an idea of common learning gaps or alternate conceptions that learners have in a given topic, so that one can judge whether the content of the product addresses them.  | \- The content neither provides opportunities to the learner to identify the common learning gaps or alternate conception, nor does it present an effective resolution, addressing them. | \- The content provides opportunities to the learner to identify the common learning gaps or alternate conception. But it does not present an effective resolution, addressing them. | The content provides opportunities to the learner to identify their alternate conception/ learning gaps themselves followed by their effective addressal. |
| **P5. Cognitive engagement  Does the content presentation style and the graphics have the potential to engage learners effectively in the learning process?**  *What does ‘content presentation style’ mean?* This question evaluates the potential of the content presentation in building cognitive engagement of the learners with the content.This question does NOT refer to the aesthetics or attractiveness of the UI.To evaluate this question, check if learning unit uses: i) *Conversational style rather than a formal speech.* Usage of active voice and words such as ‘us’ and ‘we’ is preferred to passive voice. For example: “Let us now see what happens…” is preferred to “It can be seen that…”  ii) V*isual and verbal cues that highlight the organization of the essential points on-screen.* Examples of visual cues are circling, bulleting points, using contrasting colors, or boxing. Like boxing the part of the onion whose cross-sectional view is being shown under the microscope.  Examples of verbal cues are giving stresses in the voice-over on the important points or using indicator words like first, second, third. | The learning unit does not attempt to enhance cognitive engagement.  The content presentation style is not personalized nor does it use highlighting, when required.  | There has been an attempt to make the  content presentation style conversational and uses highlights, wherever required.  But either the presentation style or graphics is inadequate and does not seem to contribute to cognitive engagement.   | The content presentation style is conversational and the important points in the content explanation is highlighted for the learners to enhance their cognitive engagement with the content.  |
| Adaptivity (for Content adaptive PAL) **P13\_CP. Is the product adaptive?**   *What does the question mean?*  Does the content  provided to a learner adapt based on the learner’s profile, performance & interaction pattern?    *How can adaptivity be checked?* Check for adaptivity based on 3 points-  **1\. Learner’s profile:** An initial set of questions are asked to learners to determine the level of their prior knowledge in the subject (Diagnostic assessment). This helps the system decide at what level it needs to start providing the content.  **2**. **Learner’s performance:** This includes adaptation based on learners response to assessment questions. For ex. If a learner gives 3 wrong answers in a row, Or, based on the answer option selected by the learner in a MCQ, the learner is redirected to the content resources needed to build their understanding of the concept.    **3\. Learners interaction:** Adaptation is done based on the log of learner actions and behaviors such as time spent on content, skipping content, requesting hints/help for answering, number of times content resource accessed, average number of clicks etc.  \[Note \- This information cannot be obtained from front-end\] | The product does not adapt dynamically to the needs of the learner based on  any of the 3 points: learner’s profile, performance or, interaction  | The product adapts dynamically to the needs of the learner but only partially. Adaptation is based on at least 1 of the 3 points: learner’s profile, performance and interaction   | The product is dynamically adaptive to the needs of the learners considering learners profile, interaction and performance (at least 2 of 3). This dynamic adaptivity is likely to enhance the learners’ understanding of the content.   |
| **Interface design : Enable intuitive use T1: Does the interface clearly convey how to perform an action?**  *What does this question mean?* This question evaluates if the interface of the product follows principles of interaction design:   1\) Visibility: Are all the visual elements and functions needed for doing a given task, clearly visible and logically placed together without extraneous distractions allowing the learners to know what to do next? 2\) Affordance: Does the interface contain appropriate cues to help the learner(s) know how to use it ? Examples of cues can be outlined around the button, indicating it can be pressed or the pause/play button with the universally understood symbol on them to cue the learner that they can perform those actions. 3\) Consistency: Does the interface allow similar operations and use similar elements for achieving similar tasks?  4\) Mapping: Mapping is the relationship between control and effect. Eg.vertical scroll bar when scrolled, the content on page moves vertically.  These principles are guidelines based on Norman's main idea that devices, things, computers, and interfaces should be functional, easy to use, and intuitive. If you find functions are "out of sight," which makes them more difficult to find and know how to use, then the interface is at ‘Potential to improve’ stage on this criterion.  *How to score this question?* Cannot be scored by looking at a single learning unit. An overall score to be given by checking multiple such composites across multiple grades, in a grade range. | The product interface does not enable intuitive use. i.e.  The functions are out-of-sight or  inconsistent or inappropriately mapped and there's NO guidance for learners on how to use the interface. Such a design makes it difficult to use. | The product interface enables intuitive use. However, SOME functions are out-of-sight, inconsistent, inappropriately mapped or there's NO guidance for learners on how to use the interface. | The product interface adheres to user-centered design principles to facilitate the learning process:   1\. The learner can easily find the visual elements and functions required to do the given task. It is also clear what the functionality of the visual element is.  2.The interface contains sufficient and clear cues informing learners about how to use elements of the interface to achieve a desired functionality. 3\. The interface is consistent i.e. it follows rules allowing similar operations and using similar elements for achieving similar tasks. There are no exceptions to a rule. (For example, a consistent operation is using the same input action to highlight any graphical object on the interface, such as always clicking the left mouse button.) 4\. The interface exploits natural mappings. The controls to something closely resemble what they affect   |
| Tools to support Problem solving  **T6. Does the product include topic-specific teaching-learning tools needed for problem-solving?** Examples of such tools can be scale, compass, protractor, trigonometric tables, log tables, symbol manipulation (able to support mathematical symbols as input) etc. | The product does not provide such tools. | The product provides some tools like pencil, eraser etc. but they are not sufficient for problem solving in certain topics | The product provides tools that learners or teachers would need to solve the given problem, thus contributing to the learning process. These tools are beyond the generic tools like pencil, eraser etc.  |

