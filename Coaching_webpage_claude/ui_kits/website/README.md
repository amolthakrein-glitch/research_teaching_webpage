# Website UI kit — Dr. A. K. Thakre Academy

Interactive, high-fidelity recreation of the marketing site. Built entirely from the
design-system components and tokens.

## Run
Open `index.html`. Loads `../../styles.css` and `../../_ds_bundle.js`, React + Babel +
Lucide from CDN, then the screen files.

## Screens (client-side nav via the header)
- **Home** (`Home.jsx`) — hero, trust strip, research-led method, featured courses,
  published-book highlight, results wall, conversion band.
- **Bio & Research** (`Research.jsx`) — profile hero, personal letter, research areas,
  credentials timeline, publications. CV-dependent fields are marked `[CV]`.
- **Coaching** (`Coaching.jsx`) — filterable program catalog (JEE/NEET/CET/Foundation),
  the 4-step method, what's-included grid.
- **Register** (`Register.jsx`) — enrolment form with success state + "what happens next".

## Shared chrome (`SiteChrome.jsx`)
`Header`, `Footer`, `Section` (eyebrow + gold-rule + title wrapper), `PhotoSlot`
(placeholder for real photography — swap for `<image-slot>` or `<img>`), `Logo`.
Each file exports to `window` so the Babel scripts can share scope.

## Components used
Button, Badge, Card, Stat, Avatar, Pill, Input, Select, CourseCard, ResultCard —
all from `window.ThakreAcademyDesignSystem_95c9b3`.

## To make it real
- Drop in photography where `PhotoSlot` appears (portrait, book cover, classroom).
- Fill `[CV]` placeholders from the CV PDF.
- Confirm the book title/cover (link wired to `amazon.in/dp/B0H469W264`).
- Replace sample ranks/fees/contact with verified figures.
