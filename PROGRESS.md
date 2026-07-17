# PROGRESS

Branch: `feat/portal-and-elevation` (not pushed)
Plan: /Users/amol/.claude2/plans/lovely-gathering-hinton.md

## Done (2026-07-17)
- P1 cleanup (2a42e65): deleted styles.css, index_elite.html, uploads/, dead script.js blocks (year/eml/logVisit), copy_index footer link; ARIA tablist/tab/tabpanel added.
- CV refresh: assets/docs/CV_Amol_Thakre.pdf = Scientist_Educator version, 358,809 bytes (byte-verified vs ~/Desktop/CV_Final_2026/05_Academic_Educator/).
- P2 portal: portal-login.html, portal.html, portal.js, portal.css, portal/setup.sql + teaching-tab entry banner. Supabase URL/anon key still placeholders (portal.js:7-8).
- P3 visuals: hero3d.js (Three.js CDN, gated: reduced-motion/pointer:fine/width≥900/WebGL, silent 2D fallback), bento 3D tilt, magnetic CTAs, tab crossfade, gradient-ink headline, gold stat numerals. 2D flow-field now pauses on teaching tab (bug fix).
- P4 Opus gate: PASS-WITH-FIXES, zero blockers. Applied a11y nit (tab ids + aria-labelledby). Skipped: hidden-panel toggle (crossfade interaction), --danger token (matches existing convention), RLS inactive-common (by design).
- P5: portal/SETUP.md handoff doc.

## Ledger
- FACT: hosting = GitHub Pages static (amolthakrein-glitch.github.io/research_teaching_webpage), remote origin github.com/amolthakrein-glitch/research_teaching_webpage.git — no backend possible; auth = Supabase client-side + RLS.
- FACT: registration_server.py = local-only dev tool; its /admin has NO auth — never expose.
- FACT: index.html canonical; index_elite.css is the live stylesheet; support.js/Portfolio.dc.html = separate AI-builder artifact, untouched.
- DECISION: material gating by class+track enum: foundation-10, class11-neet, class11-jee, class12-neet, class12-jee (+ common/) — mirrors Course Pathways.
- DECISION: signups disabled in Supabase; enrollment = dashboard invite + students-row insert (SETUP.md §6).

## Pending
- User: Supabase project setup per portal/SETUP.md (steps 1-6), then fill portal.js:7-8.
- Visual QA in a real browser (WebGL hero untested headless).
- E2E portal verification (SETUP.md §7) once project exists.
- Push/PR only on explicit "ship".

NEXT: user runs portal/SETUP.md; then browser QA of index.html hero + portal login flow.
