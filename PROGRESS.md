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

## Round 2 (2026-07-17, later)
- Fable review fixes (prev commit): popup-safe downloads ({download:true} + anchor click), skip login when session exists.
- 8714f44 (Sonnet, Opus gate PASS): OPEN_ACCESS=true interim mode (portal.js:10 — flip false + drop "interim open access read" anon policy to restore auth); portrait fix (.portrait-ring max 340px, aspect-ratio 1/1 cover); CSS-only solar system in hero (hidden <900px + reduced-motion).
- Gate NITs accepted: hero overflow:hidden clips portrait hover-glow at edges; login→portal redundant hop when unconfigured.

## Round 3 (2026-07-18) — publish pipeline Upload→materials
Branch: main. Uncommitted: publish_materials.py (new), portal.js (+listTracks, trackLabel prettify fallback), portal.html (dropdown from manifest keys). Untracked junk not mine: .thumbnail, APP_SPEC.md, graphify-out/, support.js.
- FACT: publish_materials.py — sync ~/home/Academics_Education/resources/Upload → materials/<track>/ (root files→common), rebuild manifest from disk, commit `chore: publish materials`, push, ls-remote verify. --dry-run supported.
- VERIFIED: `python3 -m py_compile publish_materials.py` OK; `node --check portal.js` OK; `python3 publish_materials.py --dry-run` with 2 test PDFs → "synced: 2 new, 0 updated" exact paths correct.
- E2E DONE: b132511 (feat, code) → ee82ea1 (publish 2 test PDFs) → live verified (curl https://amolthakrein-glitch.github.io/.../materials/class11-math/test_notes.pdf = 200, 193 B exact) → fd839b0 (cleanup, test files removed everywhere, Upload empty). Rerun → "nothing to publish". All pushed, ls-remote verified.
- FACT: manifest track keys persist once created even when dir emptied (union with existing keys) — to retire a track, delete its key from manifest.json by hand + rm dir.
- Workflow now: drop file in Upload/<track>/ (or root → common) → `python3 publish_materials.py` → live in ~1 min.
NEXT: none — pipeline complete.

## Pending
- User: Supabase project setup per portal/SETUP.md (steps 1-6), then fill portal.js:7-8.
- E2E portal verification (SETUP.md §7) once project exists.
- Push/PR only on explicit "ship".

## Round 4 (2026-07-27) — design pass: color rebalance, hero motif, grid asymmetry
Branch: main. Uncommitted: index.html, index_elite.css, script.js (not yet committed).
- DECISION (user-confirmed via AskUserQuestion): cyan = sole dominant accent site-wide; gold restricted to 3 spots only (Two-Year "Enroll Now" CTA, NEET published book, Industry-Experience bento card). Solar-system hero motif (interactive planets, ss-* CSS, script.js click handlers) fully removed — replaced with ambient flow-field SVG (4 animated dashed streamline paths, .flow-field class) tying to fluid-dynamics bio. Bento/course/book grids get margin-top stagger (min-width:901px only) to break row-aligned symmetry. Hero h1 shimmer keyframe dropped (kept static gradient) — was double-animating with heroReveal.
- Testimonials/social-proof section explicitly skipped (no real data yet, user declined placeholders).
- VERIFIED: `node --check script.js` OK, CSS/JS brace balance OK, grep confirms zero leftover ss-*/solar-system/planet-card refs across html/css/js.
- False alarm resolved: mobile full-page (`--full-page`) screenshot artifact from Playwright's scroll-stitching desyncing the `animation-timeline: view()` reveal — not a real bug. Fixed-tall-viewport capture confirmed mobile renders correctly.
- REAL BUG FOUND + FIXED (pre-existing, predates this session): `.courses-grid` and `.pillars-grid` never had `display: grid` set anywhere in index_elite.css — they were laying out as plain stacked `<div>`s (block, full-width) instead of 3-column grids, on ALL viewport widths including desktop. Also fixed a `minmax(min(100%, 280px), 1fr)` pattern (should just be `minmax(280px, 1fr)`) that was contributing to the collapse. Added `display: grid;` to both selectors (index_elite.css:581-588). Verified via computed-style + rendered width: course-card went from 1300px (1-col) to 420px (3-col) at 1440 viewport; mobile still correctly stacks to 366px (1-col) at 390 viewport.
- VERIFIED (Playwright/Chromium screenshots, both tabs, desktop 1440 + mobile 390): hero flow-field renders (4 animated dashed streamlines, cyan+sparse-gold), cyan-dominant palette confirmed throughout, gold confirmed scarce (Enroll Now CTA x2, NEET book, Industry-Experience card only), bento-grid stagger visible, courses-grid now real 3-column with featured card lift, books-grid 2-up with offset.

## Round 5 (2026-07-27, later) — site-wide brand unification (in progress)
Branch: main. Uncommitted (this round, on top of Round 4): registration.html (full re-skin), index_elite.css (+.detail-hero/.detail-card/.logo-overlay shared classes, +.art-math/.art-ai new SVG patterns), edu_detail.html (reference re-skin, Unsplash removed), summer_school.html (agent re-skin, done), campaign.html (agent re-skin, done).
- FINDING: site ran 4 unrelated visual languages depending which link you click (dark elite index_elite.css vs campaign.css light theme vs registration.html's own inline Manrope/blue-red theme vs summer_school.css bespoke theme) — worst at the exact conversion moment (Enroll Now → campaign → registration all looked unrelated). User confirmed (AskUserQuestion): full re-skin of all 3 onto elite dark system + replace Unsplash stock photos with abstract SVG art site-wide.
- DECISION: registration.html — did directly (Opus, conversion-critical + custom JS). Removed dead `fetch('/api/register')` call (no backend exists, GitHub Pages static-only per Round 3 FACT) and the misleading "obfuscation" comment (contact info is meant to be public). All WhatsApp/call/email link-generation JS preserved exactly. VERIFIED: node --check pass, div-balance match, 0 `/api/register` refs, Playwright render clean, wa/call hrefs correct, 0 console errors.
- DECISION: campaign.html, summer_school.html, and 5 remaining detail pages (exp/phil/tech/lab/impact_detail.html) delegated to 3 parallel Haiku agents with prescriptive specs (exact class names, exact art-* mappings, "preserve all hrefs/copy/scripts exactly").
- campaign.html agent: DONE. Self-reported: 0 unsplash refs, 0 campaign.css refs, node --check pass. Art mapping: Digital Twin→art-lab, Concept-to-Competition→art-phil, Analytics→art-tech, Peer Group→art-industry, Industrial Logic→art-industry, Seats-Left→bento-gold stat card (no art). NOT YET independently re-verified by me (only agent's self-report so far).
- summer_school.html agent: DONE + independently verified by me: 0 unsplash, 0 summer_school.css refs, elite-body/elite-container present, div-balance 28/28 match.
- 5-detail-pages agent (exp/phil/tech/lab/impact_detail.html): STILL RUNNING as of this checkpoint. Partial grep snapshot mid-run: exp_detail=0, phil_detail=0 unsplash already; tech_detail=6, lab_detail=4, impact_detail=4 unsplash still present (not yet done touching those 3).
- index_elite.css new shared classes added: .detail-hero/.detail-hero h1/.detail-section/.detail-card/.detail-card h3/.detail-card p/.detail-card-media img/.logo-overlay (dedupes what was a copy-pasted inline <style> block per detail page), .art-math (vedic-math number-grid motif), .art-ai (neural-network node motif) — both new art classes added after .art-impact.
- VERIFIED SO FAR (this round): node --check script.js PASS; index_elite.css brace balance 259/259 MATCH; div-balance MATCH on registration.html(5/5)/summer_school.html(28/28)/edu_detail.html(11/11); 0 `/api/register` refs; 0 unsplash refs in registration/summer_school/edu_detail.

- All 3 agents completed. Independently re-verified (did NOT trust self-reports): grep unsplash=0 across all 9 touched files, div-balance MATCH on all, campaign.css ref=0.
- BUG FOUND + FIXED (introduced by exp_detail.html agent): its 3 photo+text cards used inline `style="grid-template-columns: 1.2fr 1fr;"` but dropped `display:grid` (copy-paste miss from the edu_detail.html reference pattern) — rendered as block, logos escaped their box at native pixel size since the agent also invented an undefined `.logo-box` class with no img size constraint. Fixed: added `display:grid` back to the 3 inline styles (exp_detail.html), added `.logo-box`/`.logo-box img` component to index_elite.css (60x60 default, object-fit:contain, overflow:hidden).
- BUG FOUND + FIXED (pre-existing in the design, not agent-caused): detail-card 2-column layouts (edu_detail + exp_detail) had no mobile breakpoint — inline grid-template-columns doesn't collapse to 1-col on small screens, and absolutely-positioned .logo-box badges then overlapped stacked text. Fixed with two mobile-only (`max-width:640px`) rules in index_elite.css: `.detail-card[style*="grid-template-columns"] { grid-template-columns:1fr !important }` and `.detail-card .logo-box { position:static !important; margin:16px 0 !important }`. Verified via Playwright screenshot at 390px — clean, no overlap.
- NOTED, not fixed (out of scope, no replacement asset): lab_detail.html's two `<video>` tags point at assets/videos/*.mp4 which don't exist (dir deleted in an earlier "remove orphaned files" commit, video tags never updated) — pre-existing, confirmed via git diff my agent didn't touch video src. Renders as empty black player, not a regression from this round.
- FINAL VERIFICATION (all real, just run): 0 `images.unsplash.com` refs across all 9 touched files (campaign/summer_school/registration/edu/exp/phil/tech/lab/impact_detail.html); index_elite.css brace balance 263/263 MATCH; `node --check script.js` PASS; Playwright screenshots taken + reviewed for every re-skinned page at desktop widths, plus mobile for exp_detail/edu_detail (the 2 with the grid-collapse fix) — all render correctly, no console errors, no overlap.

NEXT: Round 5 complete and verified. Ask user before committing — repo has unrelated uncommitted files (publish pipeline, .thumbnail, APP_SPEC.md, graphify-out/, support.js); scope any commit to: registration.html, campaign.html, summer_school.html, edu_detail.html, exp_detail.html, phil_detail.html, tech_detail.html, lab_detail.html, impact_detail.html, index_elite.css, PROGRESS.md. campaign.css and summer_school.css are now orphaned (unreferenced) but left on disk per instruction not to delete files.
