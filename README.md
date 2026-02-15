# Momentum Habit Tracker

A lightweight habit tracker designed around behavioral science principles to improve productivity.

## Methodology used in this app

This app is intentionally built around five evidence-backed ideas:

1. **Start tiny (minimum viable habit):** reducing activation energy improves consistency.
2. **Implementation intentions (If-Then plans):** concrete cues (`If X, then I do Y`) increase follow-through.
3. **Consistency tracking:** objective completion logs are more reliable than motivation tracking.
4. **Weekly review loop:** reflection and adjustment prevent all-or-nothing dropout.
5. **Identity-based reinforcement:** each completion is framed as evidence of the person you want to become.

## Features

- Create habits with name, purpose, frequency, difficulty, and If-Then plan.
- Mark habits complete each day.
- Automatic streak calculation.
- Weekly completion rate dashboard (last 7 days).
- Local persistence via `localStorage`.

## Run locally

Because this is a static app, you can open `index.html` directly or serve it:

```bash
python3 -m http.server 4173
```

Then visit:

`http://localhost:4173`
