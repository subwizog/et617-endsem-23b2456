# Projectile Motion Inquiry Virtual Lab (ET 617 End-Sem)

**Roll Number / Identity Token:** `23B2456`  
**Card Selection:**
- **Problem (P5):** Inquiry-based virtual laboratory
- **Topic (T10):** Projectile motion (angle and speed vs range, Class 11)
- **Learner (L6):** Olympiad learner (Ananya Iyer, 16, Class 11)
- **Design Constraint (C3):** Mobile-first, one-handed (360 px width)

---

## 1. Local Development & Testing

This project uses standard vanilla HTML/CSS/JavaScript with zero external runtime dependencies.

### Running Physics Tests
```bash
node tests/physics.test.js
```

### Running Locally
Open `index.html` in any web browser, or serve it with any local static server:
```bash
npx serve .
# or
python -m http.server 3000
```

---

## 2. Where to Change What (Viva Quick Reference)

| Item to Change | File Location | Line / Object |
|---|---|---|
| Gravity `g`, Variable bounds, Default steps | `js/config.js` | `CONFIG.G`, `CONFIG.LIMITS` |
| Physics equations & trajectory point sampling | `js/physics.js` | `simulate()`, `bestAngle()` |
| Challenge definitions, targets, texts | `js/content.js` | `CHALLENGES` array |
| Misconception flags & support ladder | `js/diagnose.js` | `diagnoseTrial()`, `SUPPORT_LADDER` |
| AI Prompt, LLM settings, fallback questions | `api/feedback.js`, `js/ai.js` | Serverless handler / fallback table |
| UI styles, 360 px layout, colors | `css/style.css` | CSS variables & thumb-zone rules |
| Screen templates & markup | `index.html` | `<section id="screen-...">` |
