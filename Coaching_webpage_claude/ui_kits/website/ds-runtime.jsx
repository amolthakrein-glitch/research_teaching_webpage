// AUTO-GENERATED local runtime mirror of the Thakre Academy design-system
// components, built from the component .jsx sources. Lets the website UI kit
// render as a standalone file (the official _ds_bundle.js only serves inside
// the Design System tab). Regenerate if components change.
(function () {
  const React = window.React;

// ===== components/core/Card.jsx =====

/**
 * Card — elevated surface container. Use for course cards, info panels,
 * testimonials. Elevation: flat | sm | md | lg. Optional gold top accent.
 */
function Card({
  children, elevation = 'sm', padded = true, accent = false,
  interactive = false, style = {}, ...rest
}) {
  const shadows = {
    flat: 'none', sm: 'var(--shadow-sm)', md: 'var(--shadow-md)', lg: 'var(--shadow-lg)',
  };
  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--surface-card)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: shadows[elevation] ?? shadows.sm,
        padding: padded ? 'var(--space-6)' : 0,
        overflow: 'hidden',
        transition: 'transform var(--dur-med) var(--ease-out), box-shadow var(--dur-med) var(--ease-out)',
        ...style,
      }}
      onMouseEnter={interactive ? (e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      } : undefined}
      onMouseLeave={interactive ? (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = shadows[elevation] ?? shadows.sm;
      } : undefined}
      {...rest}
    >
      {accent && (
        <span style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: 'var(--gold-500)',
        }} />
      )}
      {children}
    </div>
  );
}


// ===== components/core/Badge.jsx =====

/**
 * Badge — small status / category label. Tones: gold, navy, success,
 * neutral. Optionally soft (tinted bg) or solid.
 */
function Badge({ children, tone = 'navy', solid = false, style = {}, ...rest }) {
  const tones = {
    gold:    { soft: ['var(--gold-100)', 'var(--gold-700)'], solid: ['var(--gold-500)', 'var(--navy-900)'] },
    navy:    { soft: ['var(--navy-50)', 'var(--navy-700)'], solid: ['var(--navy-700)', 'var(--text-on-ink)'] },
    success: { soft: ['var(--success-100)', 'var(--success-600)'], solid: ['var(--success-500)', '#fff'] },
    neutral: { soft: ['var(--ink-100)', 'var(--ink-700)'], solid: ['var(--ink-700)', '#fff'] },
  };
  const pair = (tones[tone] || tones.navy)[solid ? 'solid' : 'soft'];
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontFamily: 'var(--font-ui)', fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-bold)',
        letterSpacing: '0.04em', textTransform: 'uppercase',
        padding: '4px 10px', borderRadius: 'var(--radius-pill)',
        background: pair[0], color: pair[1], whiteSpace: 'nowrap', ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}


// ===== components/core/Button.jsx =====

/**
 * Button — primary call-to-action and general-purpose button.
 * Variants: primary (navy), gold (premium CTA), secondary (outline),
 * ghost (text), on-ink (for dark sections). Sizes: sm, md, lg.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  disabled = false,
  as = 'button',
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { fontSize: 'var(--fs-sm)', padding: '8px 16px', gap: '7px', radius: 'var(--radius-md)' },
    md: { fontSize: 'var(--fs-md)', padding: '12px 22px', gap: '9px', radius: 'var(--radius-md)' },
    lg: { fontSize: 'var(--fs-lg)', padding: '16px 30px', gap: '11px', radius: 'var(--radius-md)' },
  };
  const variants = {
    primary: {
      background: 'var(--navy-700)', color: 'var(--text-on-ink)',
      border: '1.5px solid var(--navy-700)', boxShadow: 'var(--shadow-sm)',
    },
    gold: {
      background: 'var(--gold-500)', color: 'var(--navy-900)',
      border: '1.5px solid var(--gold-500)', boxShadow: 'var(--shadow-sm)',
      fontWeight: 'var(--fw-bold)',
    },
    secondary: {
      background: 'transparent', color: 'var(--navy-700)',
      border: '1.5px solid var(--navy-200)',
    },
    ghost: {
      background: 'transparent', color: 'var(--navy-700)',
      border: '1.5px solid transparent',
    },
    'on-ink': {
      background: 'rgba(255,255,255,0.08)', color: 'var(--text-on-ink)',
      border: '1.5px solid var(--line-on-ink)',
    },
  };
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;
  const Tag = as;

  return (
    <Tag
      disabled={Tag === 'button' ? disabled : undefined}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: s.gap, fontFamily: 'var(--font-ui)', fontWeight: v.fontWeight || 'var(--fw-semibold)',
        fontSize: s.fontSize, lineHeight: 1, letterSpacing: '0.01em',
        padding: s.padding, borderRadius: s.radius, cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto', whiteSpace: 'nowrap', textDecoration: 'none',
        transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-med) var(--ease-out), background var(--dur-fast) var(--ease-out)',
        opacity: disabled ? 0.5 : 1, ...v, ...style,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.98)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </Tag>
  );
}


// ===== components/core/Avatar.jsx =====

/**
 * Avatar — circular portrait with image or initials fallback, optional
 * gold ring (used for the educator / faculty). Sizes sm|md|lg|xl.
 */
function Avatar({ src, name = '', size = 'md', ring = false, style = {}, ...rest }) {
  const dims = { sm: 36, md: 48, lg: 72, xl: 112 };
  const d = dims[size] || dims.md;
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return (
    <div
      style={{
        width: d, height: d, borderRadius: '50%', flexShrink: 0,
        background: 'var(--navy-700)', color: 'var(--gold-300)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-bold)',
        fontSize: d * 0.38, overflow: 'hidden',
        boxShadow: ring ? '0 0 0 3px var(--cream-50), 0 0 0 5px var(--gold-500)' : 'none',
        ...style,
      }}
      {...rest}
    >
      {src
        ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span>{initials}</span>}
    </div>
  );
}


// ===== components/core/Stat.jsx =====

/**
 * Stat — a large proof number with label, the brand's "numbers are the hero"
 * device for the success track record. Optional prefix/suffix and icon.
 */
function Stat({
  value, label, prefix = '', suffix = '', icon = null,
  align = 'left', onInk = false, style = {}, ...rest
}) {
  const big = onInk ? 'var(--gold-400)' : 'var(--navy-700)';
  const small = onInk ? 'var(--text-on-ink-muted)' : 'var(--text-muted)';
  return (
    <div style={{ textAlign: align, ...style }} {...rest}>
      {icon && <div style={{ color: 'var(--gold-500)', marginBottom: '6px' }}>{icon}</div>}
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-bold)',
        fontSize: 'var(--fs-4xl)', lineHeight: 1, color: big, letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {prefix}{value}<span style={{ color: 'var(--gold-500)' }}>{suffix}</span>
      </div>
      <div style={{
        marginTop: '8px', fontFamily: 'var(--font-ui)', fontSize: 'var(--fs-sm)',
        fontWeight: 'var(--fw-medium)', color: small, letterSpacing: '0.01em',
      }}>
        {label}
      </div>
    </div>
  );
}


// ===== components/core/Pill.jsx =====

/**
 * Pill — rounded chip for filters, tags, feature lists. Optional Lucide
 * icon slot and selected state. Lighter weight than Badge (sentence case).
 */
function Pill({ children, icon = null, selected = false, onInk = false, style = {}, ...rest }) {
  const base = onInk
    ? { bg: 'rgba(255,255,255,0.07)', fg: 'var(--text-on-ink)', bd: 'var(--line-on-ink)' }
    : { bg: 'var(--white)', fg: 'var(--text-body)', bd: 'var(--line)' };
  const sel = { bg: 'var(--navy-700)', fg: 'var(--text-on-ink)', bd: 'var(--navy-700)' };
  const c = selected ? sel : base;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '7px',
        fontFamily: 'var(--font-ui)', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)',
        padding: '7px 14px', borderRadius: 'var(--radius-pill)',
        background: c.bg, color: c.fg, border: `1px solid ${c.bd}`,
        cursor: rest.onClick ? 'pointer' : 'default', whiteSpace: 'nowrap',
        transition: 'all var(--dur-fast) var(--ease-out)', ...style,
      }}
      {...rest}
    >
      {icon && <span style={{ color: selected ? 'var(--gold-400)' : 'var(--gold-600)', display: 'inline-flex' }}>{icon}</span>}
      {children}
    </span>
  );
}


// ===== components/forms/Input.jsx =====

/**
 * Input — text field with label, optional hint/error and leading icon.
 * Used across the registration / enquiry forms.
 */
function Input({
  label, hint, error, id, leadingIcon = null, required = false,
  style = {}, ...rest
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
      {label && (
        <label htmlFor={inputId} style={{
          fontFamily: 'var(--font-ui)', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-strong)',
        }}>
          {label}{required && <span style={{ color: 'var(--gold-600)' }}> *</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {leadingIcon && (
          <span style={{ position: 'absolute', left: 12, display: 'inline-flex', color: 'var(--text-faint)' }}>
            {leadingIcon}
          </span>
        )}
        <input
          id={inputId}
          style={{
            width: '100%', boxSizing: 'border-box',
            fontFamily: 'var(--font-ui)', fontSize: 'var(--fs-md)', color: 'var(--text-strong)',
            padding: leadingIcon ? '11px 14px 11px 38px' : '11px 14px',
            background: 'var(--white)',
            border: `1.5px solid ${error ? 'var(--danger-500)' : 'var(--line)'}`,
            borderRadius: 'var(--radius-md)', outline: 'none',
            transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--gold-500)';
            e.target.style.boxShadow = '0 0 0 3px var(--gold-100)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? 'var(--danger-500)' : 'var(--line)';
            e.target.style.boxShadow = 'none';
          }}
          {...rest}
        />
      </div>
      {(hint || error) && (
        <span style={{
          fontSize: 'var(--fs-xs)', color: error ? 'var(--danger-600)' : 'var(--text-faint)',
        }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}


// ===== components/forms/Select.jsx =====

/**
 * Select — styled native dropdown with label, matching Input styling.
 */
function Select({ label, hint, id, options = [], required = false, style = {}, ...rest }) {
  const selId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
      {label && (
        <label htmlFor={selId} style={{
          fontFamily: 'var(--font-ui)', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-strong)',
        }}>
          {label}{required && <span style={{ color: 'var(--gold-600)' }}> *</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <select
          id={selId}
          style={{
            width: '100%', boxSizing: 'border-box', appearance: 'none',
            fontFamily: 'var(--font-ui)', fontSize: 'var(--fs-md)', color: 'var(--text-strong)',
            padding: '11px 38px 11px 14px', background: 'var(--white)',
            border: '1.5px solid var(--line)', borderRadius: 'var(--radius-md)',
            outline: 'none', cursor: 'pointer',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--gold-500)'; e.target.style.boxShadow = '0 0 0 3px var(--gold-100)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--line)'; e.target.style.boxShadow = 'none'; }}
          {...rest}
        >
          {options.map((o) => {
            const val = typeof o === 'string' ? o : o.value;
            const lab = typeof o === 'string' ? o : o.label;
            return <option key={val} value={val}>{lab}</option>;
          })}
        </select>
        <span style={{
          position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
          pointerEvents: 'none', color: 'var(--text-faint)', fontSize: 12,
        }}>▾</span>
      </div>
      {hint && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-faint)' }}>{hint}</span>}
    </div>
  );
}


// ===== components/domain/CourseCard.jsx =====

/**
 * CourseCard — a single coaching program. Exam tag, title, meta line,
 * feature list, fee, and enrol CTA. The brand's primary conversion unit.
 */
function CourseCard({
  exam = 'JEE', title, level, duration, seats, features = [], fee, featured = false,
  onEnrol, style = {},
}) {
  const examTone = { JEE: 'navy', NEET: 'success', CET: 'gold', Foundation: 'neutral' }[exam] || 'navy';
  return (
    <Card accent={featured} interactive elevation={featured ? 'md' : 'sm'} padded={false}
          style={{ display: 'flex', flexDirection: 'column', ...style }}>
      <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge tone={examTone} solid>{exam}</Badge>
          {featured && <Badge tone="gold">Most popular</Badge>}
        </div>

        <div>
          <h3 style={{ margin: '0 0 4px', fontSize: 'var(--fs-2xl)', lineHeight: 1.15 }}>{title}</h3>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
            {[level, duration, seats].filter(Boolean).join('  ·  ')}
          </div>
        </div>

        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
          {features.map((f, i) => (
            <li key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start',
                                 fontSize: 'var(--fs-sm)', color: 'var(--text-body)' }}>
              <span style={{ color: 'var(--gold-600)', flexShrink: 0, marginTop: 1 }} aria-hidden="true">
                <i data-lucide="check" style={{ width: 16, height: 16 }}></i>
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{
        borderTop: '1px solid var(--line-soft)', padding: 'var(--space-5) var(--space-6)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        background: 'var(--cream-50)',
      }}>
        <div>
          {fee && <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700,
                                fontSize: 'var(--fs-xl)', color: 'var(--navy-700)' }}>{fee}</div>}
          {fee && <div style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-faint)',
                                textTransform: 'uppercase', letterSpacing: '0.08em' }}>per year</div>}
        </div>
        <Button variant={featured ? 'gold' : 'primary'} size="sm" onClick={onEnrol}>
          Enrol now
        </Button>
      </div>
    </Card>
  );
}


// ===== components/domain/ResultCard.jsx =====

/**
 * ResultCard — a student success story / topper. Rank medallion, name,
 * exam + year, and an optional short quote. Powers the track-record wall.
 */
function ResultCard({ name, rank, exam, year, quote, src, style = {} }) {
  return (
    <Card elevation="sm" interactive style={{ display: 'flex', flexDirection: 'column', gap: 14, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar name={name} src={src} size="lg" ring />
        <div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-xl)',
            color: 'var(--gold-700)', lineHeight: 1, fontVariantNumeric: 'tabular-nums',
          }}>{rank}</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--fs-xs)',
                       textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-faint)',
                       marginTop: 4 }}>
            {exam}{year ? ` · ${year}` : ''}
          </div>
        </div>
      </div>

      {quote && (
        <p style={{ margin: 0, fontSize: 'var(--fs-sm)', lineHeight: 1.6, color: 'var(--text-body)',
                   fontStyle: 'italic' }}>
          “{quote}”
        </p>
      )}

      <div style={{ marginTop: 'auto', fontFamily: 'var(--font-ui)', fontWeight: 600,
                   fontSize: 'var(--fs-sm)', color: 'var(--text-strong)' }}>
        {name}
      </div>
    </Card>
  );
}


  window.ThakreAcademyDesignSystem_95c9b3 = Object.assign(
    window.ThakreAcademyDesignSystem_95c9b3 || {},
    { Card, Badge, Button, Avatar, Stat, Pill, Input, Select, CourseCard, ResultCard }
  );
})();
