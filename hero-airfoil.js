(function() {
  'use strict';

  /* ────────────────────────────────────────────────────────────────────
     Joukowski airfoil: analytic potential flow, conformal mapping.
     Textbook 2D incompressible irrotational flow over a cambered airfoil.
     Physical solution, closed-form, no grid, no solver.

     Limits: potential flow has no boundary layer, no wake feedback (d'Alembert),
     inviscid/unstalled, α capped at 8° per parameter spec.
     ──────────────────────────────────────────────────────────────────── */

  // ══════════════════════ Geometry constants ══════════════════════
  const B    = 1.0;
  const E    = 0.100;
  const F    = 0.075;
  const Z0x  = -E;
  const Z0y  = F;
  const R    = Math.sqrt((B + E) ** 2 + F ** 2);     // ≈ 1.102554
  const BETA = Math.asin(F / R);                     // ≈ 0.068085 rad

  // ══════════════════════ Parameters ══════════════════════
  const U              = 1.0;
  const SPEED_SCALE    = 8.5;           // ~2.4x faster (was 3.6) per explicit request
  const ALPHA_MEAN     = 0.08727;       // 5° in radians
  const ALPHA_AMP      = 0.05236;       // 3° in radians
  const ALPHA_PERIOD   = 20;            // seconds
  const VMAX           = 2.6 * U;
  const DEN_FLOOR      = 1e-4;
  // Tighter, zoomed-in window (was -5..5, width 10) and shifted downstream
  // so the wake has visible room to develop past the trailing edge. Slightly
  // wider than the first zoom pass so the stagnation-point streamline
  // convergence has room to fan out instead of jamming into a solid mass.
  const X_MIN          = -3.9;
  const X_MAX          = 4.7;
  const Y_MAX          = (X_MAX - X_MIN) / 1.4 / 2;  // preserves the 1.4:1 box aspect
  const Y_MIN          = -Y_MAX;
  const LIFE_MIN       = 4.0;
  const LIFE_MAX       = 7.5;
  const SLOW_SPEED_Q     = 0.10;  // below this fraction of U, treat as "stagnant"
  const SLOW_AGE_PENALTY = 2.2;   // extra age/sec applied while stagnant -> fast eviction
  const DRAW_MIN_Q       = 0.09;  // don't ink particles slower than this (avoids stagnation smear)
  const DT_MAX         = 1 / 30;
  const BODY_PTS       = 240;
  const STREAMLINES_STATIC = 17;

  // ══════════════════════ State ══════════════════════
  let alpha    = ALPHA_MEAN;
  let cosA     = Math.cos(alpha);
  let sinA     = Math.sin(alpha);
  let GAMMA    = 4 * Math.PI * U * R * Math.sin(alpha + BETA);
  let k        = GAMMA / (2 * Math.PI);

  let canvas   = null;
  let ctx      = null;
  let container = null;
  let dpr      = 1;
  let scale    = 1;
  let Wcss     = 560;
  let Hcss     = 400;

  let visible      = true;
  let hidden       = false;
  let sectionActive = true;
  let reducedMotion = false;
  let running      = false;
  let last         = 0;

  let N              = 900;
  let FADE           = 0.14;
  let LINEW          = 1.15;
  let DPR_CAP        = 2;

  let particles      = null;  // Float32Array: px, py, ppx, ppy, age, life
  let N_ALLOC        = 900;
  let bodyOutline    = [];

  let palette = {
    slate: [148, 163, 184],
    cyan:  [34, 211, 238],
    text:  [248, 250, 252],  // --text token; blended in for lighter, brighter streamlines
    blue:  [59, 130, 246]    // documented site accent blue (CLAUDE.md), distinct mid-speed hue
  };

  let colorLUT = [];

  // ══════════════════════ Complex math ══════════════════════
  function cmul(ax, ay, bx, by, out) {
    const rx = ax * bx - ay * by;
    const ry = ax * by + ay * bx;
    if (out) { out.x = rx; out.y = ry; }
    return { x: rx, y: ry };
  }

  function cdiv(ax, ay, bx, by, out) {
    const denom = Math.max(bx * bx + by * by, 1e-12);
    const rx = (ax * bx + ay * by) / denom;
    const ry = (ay * bx - ax * by) / denom;
    if (out) { out.x = rx; out.y = ry; }
    return { x: rx, y: ry };
  }

  function csqrt(wx, wy, out) {
    const m  = Math.hypot(wx, wy);
    const sr = Math.sqrt(Math.max(0, (m + wx) / 2));
    const si = Math.sqrt(Math.max(0, (m - wx) / 2)) * (wy < 0 ? -1 : 1);
    if (out) { out.x = sr; out.y = si; }
    return { x: sr, y: si };
  }

  // ══════════════════════ Physics ══════════════════════

  function setAlpha(a) {
    alpha = a;
    cosA = Math.cos(alpha);
    sinA = Math.sin(alpha);
    GAMMA = 4 * Math.PI * U * R * Math.sin(alpha + BETA);
    k = GAMMA / (2 * Math.PI);
  }

  function fwdMap(p, q, out) {
    const r2 = p * p + q * q;
    const rx = p + B * B * p / r2;
    const ry = q - B * B * q / r2;
    if (out) { out.x = rx; out.y = ry; }
    return { x: rx, y: ry };
  }

  function invMap(zx, zy, out) {
    // ζ² − zζ + B² = 0 => ζ = (z ± sqrt(z²−4B²))/2
    // discriminant: z² − 4B²
    const disc_x = zx * zx - zy * zy - 4 * B * B;
    const disc_y = 2 * zx * zy;

    const sq = csqrt(disc_x, disc_y);

    // ζ+ = (z + sqrt)/2, ζ- = (z - sqrt)/2
    const zp_x = (zx + sq.x) / 2;
    const zp_y = (zy + sq.y) / 2;
    const zm_x = (zx - sq.x) / 2;
    const zm_y = (zy - sq.y) / 2;

    // Pick the root with larger modulus
    const mp2 = zp_x * zp_x + zp_y * zp_y;
    const mm2 = zm_x * zm_x + zm_y * zm_y;

    if (mp2 >= mm2) {
      if (out) { out.x = zp_x; out.y = zp_y; }
      return { x: zp_x, y: zp_y };
    } else {
      if (out) { out.x = zm_x; out.y = zm_y; }
      return { x: zm_x, y: zm_y };
    }
  }

  function dWdZeta(px, py, out) {
    // ζ' = ζ − Z0
    const ppx = px - Z0x;
    const ppy = py - Z0y;
    const rr = ppx * ppx + ppy * ppy;

    if (rr < 1e-12) {
      if (out) { out.x = U; out.y = 0; }
      return { x: U, y: 0 };
    }

    // inv1 = 1/ζ'
    const inv1_x = ppx / rr;
    const inv1_y = -ppy / rr;

    // ζ'²
    const zeta2_x = ppx * ppx - ppy * ppy;
    const zeta2_y = 2 * ppx * ppy;

    // inv2 = 1/ζ'²
    const inv2 = cdiv(1, 0, zeta2_x, zeta2_y);

    // term1 = U * exp(−iα)
    const term1_x = U * cosA;
    const term1_y = -U * sinA;

    // term2 = −U*R² * cmul(exp(−iα), 1/ζ'²)
    const temp2 = cmul(cosA, sinA, inv2.x, inv2.y);
    const term2_x = -U * R * R * temp2.x;
    const term2_y = -U * R * R * temp2.y;

    // term3 = i*k / ζ'
    const term3 = cmul(0, k, inv1_x, inv1_y);

    const rx = term1_x + term2_x + term3.x;
    const ry = term1_y + term2_y + term3.y;

    if (out) { out.x = rx; out.y = ry; }
    return { x: rx, y: ry };
  }

  function velocityAtScreen(Zx, Zy, out) {
    // Screen → physical: rotate by −α
    const z_x = Zx * cosA - Zy * sinA;
    const z_y = Zx * sinA + Zy * cosA;

    // Physical → circle plane
    const zeta = invMap(z_x, z_y);

    // dW/dζ
    const dWdz = dWdZeta(zeta.x, zeta.y);

    // dz/dζ
    const p = zeta.x;
    const q = zeta.y;
    const s = p * p + q * q;
    const s2 = s * s;

    const D_x = 1 - B * B * (p * p - q * q) / s2;
    const D_y = B * B * (2 * p * q) / s2;

    // W = dW/dζ / (dz/dζ)
    const den = D_x * D_x + D_y * D_y;
    const den_safe = Math.max(den, DEN_FLOOR);

    let u = (dWdz.x * D_x + dWdz.y * D_y) / den_safe;
    let v = (dWdz.y * D_x - dWdz.x * D_y) / den_safe;

    // v is conjugate of dW/dz => velocity has −v
    v = -v;

    // Clamp speed
    const sp = Math.hypot(u, v);
    if (sp > VMAX) {
      const scale = VMAX / sp;
      u *= scale;
      v *= scale;
    }

    // Fallback on NaN/Inf
    if (!isFinite(u) || !isFinite(v)) {
      u = U;
      v = 0;
    }

    // Velocity → screen: rotate by α
    const Us = u * cosA + v * sinA;
    const Vs = -u * sinA + v * cosA;

    if (out) {
      out.x = Us;
      out.y = Vs;
      out.speed = Math.hypot(Us, Vs);
    }
    return { x: Us, y: Vs, speed: Math.hypot(Us, Vs) };
  }

  function isInsideScreen(Zx, Zy) {
    // Screen → physical
    const z_x = Zx * cosA - Zy * sinA;
    const z_y = Zx * sinA + Zy * cosA;

    // Physical → circle
    const zeta = invMap(z_x, z_y);

    // Inside body?
    const dx = zeta.x - Z0x;
    const dy = zeta.y - Z0y;
    return dx * dx + dy * dy < R * R * 0.999;
  }

  // ══════════════════════ Geometry ══════════════════════

  function buildBodyOutline() {
    bodyOutline = [];
    for (let i = 0; i < BODY_PTS; i++) {
      const theta = (2 * Math.PI * i) / BODY_PTS;
      const px = Z0x + R * Math.cos(theta);
      const py = Z0y + R * Math.sin(theta);
      const z = fwdMap(px, py);
      bodyOutline.push({ x: z.x, y: z.y });
    }
  }

  function bodyPathScreen(ctx) {
    if (bodyOutline.length === 0) return;

    // Rotate outline by −α and convert to screen pixels
    const pts = [];
    for (let i = 0; i < bodyOutline.length; i++) {
      const z = bodyOutline[i];
      const Zx = z.x * cosA + z.y * sinA;
      const Zy = -z.x * sinA + z.y * cosA;

      const px = (Zx - X_MIN) * scale;
      const py = (Y_MAX - Zy) * scale;
      pts.push({ px, py });
    }

    ctx.beginPath();
    ctx.moveTo(pts[0].px, pts[0].py);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].px, pts[i].py);
    }
    ctx.closePath();
  }

  // ══════════════════════ Particles ══════════════════════

  function initParticles(n) {
    N_ALLOC = n;
    particles = new Float32Array(n * 6);  // px, py, ppx, ppy, age, life

    // Scatter across the whole domain (not all at the inlet) with a randomized
    // starting age, so the sim opens already "pre-warmed" instead of every
    // particle launching from the inlet in lockstep — that synchronized
    // wavefront read as a solid wall/curtain until it destaggered ~life
    // seconds in.
    for (let i = 0; i < n; i++) {
      seedParticle(i, false);
      const idx = i * 6;
      particles[idx + 4] = Math.random() * particles[idx + 5];
    }
  }

  function seedParticle(i, atInlet) {
    const idx = i * 6;
    let px, py;

    if (atInlet) {
      px = X_MIN - 0.05;
      const band = i % N;
      const t = (band + 0.5) / N;
      py = Y_MIN + (Y_MAX - Y_MIN) * t;
      py += (Math.random() - 0.5) * 0.4;
    } else {
      px = X_MIN + Math.random() * (X_MAX - X_MIN);
      py = Y_MIN + Math.random() * (Y_MAX - Y_MIN);
    }

    // Reject if inside body
    let attempts = 0;
    while (isInsideScreen(px, py) && attempts < 5) {
      px += 0.1;
      attempts++;
    }

    particles[idx + 0] = px;
    particles[idx + 1] = py;
    particles[idx + 2] = px;      // ppx
    particles[idx + 3] = py;      // ppy
    particles[idx + 4] = 0;       // age
    particles[idx + 5] = LIFE_MIN + Math.random() * (LIFE_MAX - LIFE_MIN);
  }

  function stepParticles(h, dtSec) {
    const vbuf = { x: 0, y: 0, speed: 0 };

    for (let i = 0; i < N; i++) {
      const idx = i * 6;
      const px0 = particles[idx + 0];
      const py0 = particles[idx + 1];
      let age = particles[idx + 4];
      const life = particles[idx + 5];

      // RK2 midpoint
      velocityAtScreen(px0, py0, vbuf);
      const k1x = vbuf.x;
      const k1y = vbuf.y;

      const zm_x = px0 + 0.5 * h * k1x;
      const zm_y = py0 + 0.5 * h * k1y;

      velocityAtScreen(zm_x, zm_y, vbuf);
      const k2x = vbuf.x;
      const k2y = vbuf.y;
      const sp = vbuf.speed;

      const px = px0 + h * k2x;
      const py = py0 + h * k2y;

      // Age & recycle logic
      age += dtSec;

      // Recycle conditions
      let recycle = false;
      if (px > X_MAX + 0.1) recycle = true;
      if (py > Y_MAX + 0.2 || py < Y_MIN - 0.2) recycle = true;
      if (age > life) recycle = true;
      if (sp < SLOW_SPEED_Q * U) age += SLOW_AGE_PENALTY * dtSec;
      if (isInsideScreen(px, py)) recycle = true;
      if (!isFinite(px) || !isFinite(py)) recycle = true;

      if (recycle) {
        seedParticle(i, true);
      } else {
        // Previous position = where the particle was BEFORE this step, so the
        // segment drawn this frame is exactly one timestep long and chains
        // continuously with the segment drawn last frame (px0 === last px).
        particles[idx + 2] = px0;
        particles[idx + 3] = py0;
        particles[idx + 0] = px;
        particles[idx + 1] = py;
        particles[idx + 4] = age;
      }
    }
  }

  // ══════════════════════ Rendering ══════════════════════

  function buildColorLUT() {
    colorLUT = [];
    const steps = 64;

    // Lighter baseline: blend --slate 70% toward --text so even the dim
    // free-stream tier reads bright against the dark hero, not muddy.
    const base = [
      palette.slate[0] + 0.30 * (palette.text[0] - palette.slate[0]),
      palette.slate[1] + 0.30 * (palette.text[1] - palette.slate[1]),
      palette.slate[2] + 0.30 * (palette.text[2] - palette.slate[2])
    ];
    // Lighter peak: blend --cyan toward --text instead of a raw hardcoded
    // "bright cyan" literal, so the highlight is still token-derived.
    const peak = [
      palette.cyan[0] + 0.55 * (palette.text[0] - palette.cyan[0]),
      palette.cyan[1] + 0.55 * (palette.text[1] - palette.cyan[1]),
      palette.cyan[2] + 0.55 * (palette.text[2] - palette.cyan[2])
    ];

    for (let i = 0; i < steps; i++) {
      const q = (i / (steps - 1)) * 2.6;
      let r, g, b, alpha;

      // Multi-hue velocity ramp (distinct hues per band, not one hue shaded):
      // dim slate (near-stagnant) -> blue (decelerated/pressure side) ->
      // cyan (near free-stream) -> bright cyan-white (suction-peak/fastest).
      // No gold anywhere (brand rule reserves gold for 3 CTA spots elsewhere).
      if (q <= 0.55) {
        const t = Math.max(0, Math.min(1, q / 0.55));
        r = base[0] + t * (palette.blue[0] - base[0]);
        g = base[1] + t * (palette.blue[1] - base[1]);
        b = base[2] + t * (palette.blue[2] - base[2]);
      } else if (q <= 1.10) {
        const t = (q - 0.55) / 0.55;
        r = palette.blue[0] + t * (palette.cyan[0] - palette.blue[0]);
        g = palette.blue[1] + t * (palette.cyan[1] - palette.blue[1]);
        b = palette.blue[2] + t * (palette.cyan[2] - palette.blue[2]);
      } else {
        // Graded across the full remaining range (up to q=2.6, near VMAX) so
        // the highest-speed suction-peak flow keeps getting visibly brighter
        // instead of saturating early — a stronger near-vs-far gradient.
        const t = Math.min((q - 1.10) / 1.50, 1);
        r = palette.cyan[0] + t * (peak[0] - palette.cyan[0]);
        g = palette.cyan[1] + t * (peak[1] - palette.cyan[1]);
        b = palette.cyan[2] + t * (peak[2] - palette.cyan[2]);
      }

      // Wide alpha range: near-stagnant/far-field flow reads faint, fast
      // near-body flow reads strong — a real velocity/pressure gradient, not
      // a flat wash.
      alpha = Math.max(0.14, Math.min(0.95, 0.14 + 0.81 * Math.max(0, Math.min(1, (q - 0.15) / 1.55))));
      colorLUT.push(`rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha.toFixed(3)})`);
    }
  }

  function speedColor(q) {
    const idx = Math.min(63, Math.floor(Math.max(0, q) / 2.6 * 64));
    return colorLUT[idx] || 'rgba(148,163,184,51)';
  }

  function fadeTrails(ctx) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = `rgba(0, 0, 0, ${FADE})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawParticles(ctx) {
    // Batch by color to minimize strokeStyle churn
    const buckets = {};
    for (let i = 0; i < 64; i++) buckets[i] = [];

    for (let i = 0; i < N; i++) {
      const idx = i * 6;
      const px = particles[idx + 0];
      const py = particles[idx + 1];
      const ppx = particles[idx + 2];
      const ppy = particles[idx + 3];

      const vbuf = { x: 0, y: 0, speed: 0 };
      velocityAtScreen(px, py, vbuf);
      const q = vbuf.speed / U;

      // Don't ink near-stagnant particles: they linger near the stagnation
      // point/dead zones and would otherwise redraw the same short segment
      // for many consecutive frames, saturating into a solid smear.
      if (q < DRAW_MIN_Q) continue;

      const bucket = Math.min(63, Math.floor(Math.max(0, q) / 2.6 * 64));
      const x1 = (ppx - X_MIN) * scale;
      const y1 = (Y_MAX - ppy) * scale;
      const x2 = (px - X_MIN) * scale;
      const y2 = (Y_MAX - py) * scale;

      buckets[bucket].push({ x1, y1, x2, y2 });
    }

    for (let b = 0; b < 64; b++) {
      if (buckets[b].length === 0) continue;
      ctx.strokeStyle = colorLUT[b];
      ctx.lineWidth = LINEW;

      for (let seg of buckets[b]) {
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
        ctx.stroke();
      }
    }
  }

  function drawBody(ctx) {
    bodyPathScreen(ctx);

    // Fill
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.fill();

    // Stroke
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Chordwise sheen
    ctx.save();
    const z_TE = 2 * B;
    const z_LE = bodyOutline[BODY_PTS / 2];
    const te_screen_x = (z_TE - X_MIN) * scale;
    const le_screen_x = ((z_LE ? z_LE.x : 0) - X_MIN) * scale;

    const gradient = ctx.createLinearGradient(le_screen_x, 0, te_screen_x, 0);
    gradient.addColorStop(0, 'rgba(34, 211, 238, 0.10)');
    gradient.addColorStop(0.6, 'rgba(34, 211, 238, 0)');

    ctx.fillStyle = gradient;
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fill();
    ctx.restore();

    // Shadow
    ctx.shadowColor = 'rgba(2, 6, 23, 0.6)';
    ctx.shadowBlur = 12;
    bodyPathScreen(ctx);
    ctx.stroke();
    ctx.shadowColor = 'transparent';
  }

  function drawStaticStreamlines(ctx) {
    const h = 0.02;
    const max_steps = 900;

    for (let i = 0; i < STREAMLINES_STATIC; i++) {
      const t = (i + 0.5) / STREAMLINES_STATIC;
      const y0 = Y_MIN + 0.15 * (Y_MAX - Y_MIN) + t * 0.70 * (Y_MAX - Y_MIN);
      const x0 = X_MIN;

      let px = x0;
      let py = y0;

      const pts = [];
      pts.push({ x: (px - X_MIN) * scale, y: (Y_MAX - py) * scale });

      const vbuf = { x: 0, y: 0, speed: 0 };

      for (let step = 0; step < max_steps; step++) {
        // RK4
        velocityAtScreen(px, py, vbuf);
        const k1x = vbuf.x, k1y = vbuf.y;

        velocityAtScreen(px + 0.5 * h * k1x, py + 0.5 * h * k1y, vbuf);
        const k2x = vbuf.x, k2y = vbuf.y;

        velocityAtScreen(px + 0.5 * h * k2x, py + 0.5 * h * k2y, vbuf);
        const k3x = vbuf.x, k3y = vbuf.y;

        velocityAtScreen(px + h * k3x, py + h * k3y, vbuf);
        const k4x = vbuf.x, k4y = vbuf.y;

        px += (h / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
        py += (h / 6) * (k1y + 2 * k2y + 2 * k3y + k4y);

        // Stop on domain exit or inside body
        if (px > X_MAX || py < Y_MIN || py > Y_MAX || isInsideScreen(px, py)) break;

        pts.push({ x: (px - X_MIN) * scale, y: (Y_MAX - py) * scale });
      }

      ctx.strokeStyle = colorLUT[32];  // mid-range color
      ctx.lineWidth = 1.1;
      ctx.globalAlpha = 0.9;

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let j = 1; j < pts.length; j++) {
        ctx.lineTo(pts[j].x, pts[j].y);
      }
      ctx.stroke();

      ctx.globalAlpha = 1;
    }

    drawBody(ctx);
  }

  // ══════════════════════ Lifecycle ══════════════════════

  function resize() {
    if (!container) return;

    const rect = container.getBoundingClientRect();
    Wcss = rect.width;
    Hcss = rect.height;

    // Re-evaluate tier first, then size the canvas off the resolved DPR_CAP
    if (window.matchMedia('(max-width: 900px)').matches) {
      N = 320;
      FADE = 0.44;
      LINEW = 1.0;
      DPR_CAP = 1.5;
    } else {
      N = 650;
      FADE = 0.40;
      LINEW = 1.1;
      DPR_CAP = 2;
    }

    // Hardware concurrency
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
      N = Math.floor(N * 0.6);
    }

    dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    canvas.width = Math.round(Wcss * dpr);
    canvas.height = Math.round(Hcss * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    scale = Wcss / (X_MAX - X_MIN);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!particles || particles.length < N * 6) {
      initParticles(N);
    }
  }

  function frame(now) {
    if (!shouldRun()) {
      stop();
      return;
    }

    if (!running) return;

    const dt = Math.min((now - last) / 1000, DT_MAX);
    last = now;

    const t = now / 1000;
    setAlpha(ALPHA_MEAN + ALPHA_AMP * Math.sin(2 * Math.PI * t / ALPHA_PERIOD));

    fadeTrails(ctx);
    stepParticles(dt * SPEED_SCALE, dt);
    drawParticles(ctx);
    drawBody(ctx);

    requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    last = 0;
    requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    last = 0;
  }

  function shouldRun() {
    return visible && !hidden && sectionActive && !reducedMotion;
  }

  function updateRunState() {
    if (shouldRun()) {
      start();
    } else {
      stop();
    }
  }

  function init() {
    canvas = document.getElementById('hero-airfoil-canvas');
    if (!canvas) return;

    container = canvas.closest('.flow-field');
    if (!container) return;

    ctx = canvas.getContext('2d', { alpha: true });

    // Read palette (tokens are hex, e.g. #22d3ee)
    const root = getComputedStyle(document.documentElement);
    const readColor = (name, fallback) => {
      const val = root.getPropertyValue(name).trim();
      const m = val.match(/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/);
      return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : fallback;
    };

    palette.slate = readColor('--slate', palette.slate);
    palette.cyan = readColor('--cyan', palette.cyan);
    palette.text = readColor('--text', palette.text);

    buildColorLUT();
    buildBodyOutline();
    resize();

    // Observers
    new IntersectionObserver(es => {
      visible = es[0].isIntersecting;
      updateRunState();
    }, { threshold: 0 }).observe(container);

    document.addEventListener('visibilitychange', () => {
      hidden = document.hidden;
      updateRunState();
    });

    const section = document.getElementById('section-research');
    if (section) {
      sectionActive = section.classList.contains('active');
      new MutationObserver(() => {
        sectionActive = section.classList.contains('active');
        updateRunState();
      }).observe(section, { attributes: true, attributeFilter: ['class'] });
    }

    new ResizeObserver(() => {
      resize();
    }).observe(container);

    // Reduced motion
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = mq.matches;
    mq.addEventListener('change', e => {
      reducedMotion = e.matches;
      if (reducedMotion) {
        stop();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawStaticStreamlines(ctx);
      } else {
        start();
      }
    });

    if (reducedMotion) {
      drawStaticStreamlines(ctx);
    } else {
      start();
    }
  }

  // ══════════════════════ Entry point ══════════════════════
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
