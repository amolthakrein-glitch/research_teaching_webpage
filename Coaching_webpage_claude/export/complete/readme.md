# Thakre Academy — Design System

> Personal academic + coaching brand for **Dr. Amol Kumar Thakre** — researcher in
> Applied Physics / Engineering and mentor for JEE / NEET / CET aspirants.
> This system powers a striking, content-rich website that builds trust through
> research credibility and converts visitors into enrolled students.

---

## 1. Context

**Who:** Dr. Amol Kumar Thakre — Applied Physics / Engineering.
**Research:** Fluid Mechanics, Condensed Matter Physics, Statistical Thermodynamics,
Molecular Dynamics.
**Mission:** Bring research-grade rigor to entrance-exam coaching. The brand sits at the
intersection of *scholar* and *mentor* — academic authority that still feels human and
encouraging to a 16-year-old aspirant and their parents.

**Audience (dual):**
- **Students** — Class 9–12 aspirants for JEE (engineering), NEET (medical), and state CET exams.
- **Parents** — the decision-makers who need to trust the track record and credentials.

**Surfaces covered by this system:**
- Landing / Home
- Bio & Research (full academic profile)
- Coaching & Courses (JEE / NEET / CET / Foundation, with extensive detail)
- Registration / Enrollment
- Published-book highlight (NEET title — see *External links* below)

### Sources & materials
- **CV:** referenced by the user at a local path (`/Users/amol/.../CVs/CV_Recent2026`) —
  **NOT yet provided to this project.** Bio, publications, institutions and dates in the
  UI kit are **placeholders marked `[CV]`** until the PDF is attached. Re-attach via the
  Import menu to have these auto-filled.
- **Published NEET book (Amazon.in):** ASIN `B0H469W264`
  `https://www.amazon.in/dp/B0H469W264` — title/cover are placeholders pending confirmation.
- No prior site code, logo, or photography was provided. Logo is a typographic wordmark
  built in-system; photos use drop-in `<image-slot>` placeholders.

---

## 2. Content fundamentals (voice & tone)

**Personality:** Authoritative but warm. A researcher who genuinely enjoys teaching.
Confidence comes from *evidence* (ranks, research, years), never hype.

- **Person:** Address the student/parent as **"you"**; refer to the educator as
  **"Dr. Thakre"** or **"Sir"** in testimonial contexts. First person ("I believe…")
  is reserved for the bio/letter sections to add a personal touch.
- **Casing:** Sentence case for headings and buttons (`Explore the programs`, not
  `Explore The Programs`). UPPERCASE only for short overline eyebrows (`RESEARCH-LED COACHING`).
- **Tone words:** rigorous, clear, mentored, proven, fundamentals-first, structured.
- **Avoid:** exam-mill clichés ("100% guaranteed selection!!", excessive exclamation,
  ALL-CAPS shouting), emoji, and unverifiable superlatives.
- **Numbers are the hero.** Lead with concrete proof: *"12+ years"*, *"AIR 47"*,
  *"500+ students mentored"*. Always tabular, always specific.
- **Vibe:** the calm authority of a top professor's office — wood, brass, paper — not a
  neon edtech app.

**Examples**
- Hero: *"Research-grade rigor for the exam that decides your future."*
- Sub: *"Physics-led coaching for JEE, NEET & CET — built on first principles, not rote."*
- CTA: *"Book a free counselling call"* / *"Reserve your seat"*
- Eyebrow: `FROM THE LAB TO THE CLASSROOM`
- Proof: *"Mentored aspirants into AIIMS, IITs and NITs since 2013."*

---

## 3. Visual foundations

**Palette — "Scholar's Study":** deep **navy** (authority, ink), **gold** (prestige,
achievement, brass accents), warm **cream** paper (approachable, not clinical white),
cool ink neutrals for text. Restrained semantic green for "success/results".
- Navy carries dark hero/footer sections and primary buttons.
- Gold is a *precious* accent — thin rules, underlines, medallions, key stats, hover.
  Never large gold fills for big areas; it's a garnish.
- Cream is the default page; pure white is reserved for elevated cards.

**Type:** **Spectral** (serif) for display & headings — scholarly, editorial gravitas.
**Hanken Grotesk** (sans) for body & UI — clean, friendly, highly legible. Big editorial
hero sizes (up to ~76px) paired with comfortable 16–18px body. Overlines are uppercase
sans with wide `0.16em` tracking.

**Spacing & layout:** 4px grid. Generous section rhythm (`--section-pad-y` ≈ 112px).
1200px max container. Roomy, uncluttered — whitespace signals premium. Asymmetric
editorial layouts (text column + offset image / stat rail) over rigid centered stacks.

**Backgrounds:** warm cream base; dark navy "feature" bands for contrast and rhythm
(hero, results, footer). A subtle **fine-grid / engineering-paper texture** and a faint
**radial navy glow** are acceptable on dark bands (evoking blueprints / lab notebooks).
No loud gradients, no purple. Imagery is warm-toned, real (headshots, classroom,
chalkboard equations) — dropped into `<image-slot>`s.

**Corners & cards:** cards use `--radius-lg` (16px) with a hairline `--line` border and
soft, warm-tinted shadow (`--shadow-md`). Buttons/inputs use `--radius-md` (10px). Pills
are fully round. Feature panels go to `--radius-xl` (24px). Cards sit on cream and rise
on white.

**Shadows:** soft and navy-tinted (never neutral grey), layered subtly. A special
`--shadow-gold` glow is used only on the primary gold CTA hover. `--shadow-inset` adds a
faint top highlight to give brass/paper materiality.

**Borders:** 1px hairlines in `--line`. A signature **3px gold rule** (`.ta-rule-gold`,
56px wide) sits under eyebrows/section titles as the brand's connective motif.

**Motion:** restrained and confident. `--ease-out` for entrances, 140–240ms.
Fade-and-rise on scroll (~12px), gentle. No bounces, no infinite loops.
Respect `prefers-reduced-motion`.

**Hover/press:**
- Buttons: hover darkens by one step (+ gold glow on primary); press scales to `0.98`.
- Links: navy → gold.
- Cards: lift (`--shadow-md` → `--shadow-lg`) + 2px rise; gold top-border reveal on
  course cards.

**Transparency & blur:** sparingly. The sticky header uses a translucent cream with
`backdrop-filter: blur` once scrolled. Gold/navy overlays on imagery use solid-color
alpha, not blur.

---

## 4. Iconography

- **System:** **Lucide** (https://lucide.dev), loaded from CDN
  (`lucide@latest`). Clean 1.75–2px stroke, rounded joins — matches the refined,
  non-childish tone. **This is a substitution** (no icon set was provided); swap if the
  brand later standardizes on another set.
- **Usage:** line icons only, `currentColor`, typically `--navy-600` or `--gold-600`
  inside gold/navy medallion chips. Sizes 18 / 20 / 24. Stroke width kept consistent at
  ~1.9.
- **No emoji.** No multicolor or filled icon styles. No hand-drawn SVG illustrations —
  use real photography in `<image-slot>`s or Lucide line icons.
- Achievement/credential marks (degrees, ranks) use a small gold **medallion** (circle +
  Lucide `award` / `graduation-cap` / `atom`) rather than badges with bright fills.

---

## 5. Index / manifest

**Root**
- `styles.css` — entry point (import list only). Consumers link this.
- `readme.md` — this file.
- `SKILL.md` — Agent-Skill wrapper for download/Claude Code use.

**Tokens** (`tokens/`)
- `fonts.css` · `colors.css` · `typography.css` · `spacing.css` · `base.css`

**Foundations specimen cards** (`guidelines/`) — populate the Design System tab
(Type, Colors, Spacing, Brand groups).

**Assets** (`assets/`)
- `logo/` — wordmark + monogram (typographic, in-system).
- `image-slot.js` — drop-in photo placeholder component.

**Components** (`components/`)
- `core/` — Button, Badge, Card, Stat, Avatar, Pill
- `forms/` — Input, Select
- `domain/` — CourseCard, ResultCard

**UI kit** (`ui_kits/website/`)
- `index.html` — interactive Home → Research → Coaching → Register click-through.
- `Home.jsx`, `Research.jsx`, `Coaching.jsx`, `Register.jsx`, `SiteChrome.jsx`.

---

## 6. Open items / to confirm
- **Attach the CV PDF** so `[CV]` placeholders (publications, exact institutions, years,
  awards) can be filled.
- Confirm the **book title & cover** for ASIN B0H469W264.
- Provide a **logo** (if one exists) and **photography** (headshot, classroom).
- Fonts are CDN-loaded (Google Fonts) — provide licensed files if self-hosting is required.
