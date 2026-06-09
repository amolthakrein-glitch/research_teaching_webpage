// SiteChrome — header, footer, section + photo-placeholder helpers.
(function () {
const { Button: TAButton, Badge: TABadge } = window.ThakreAcademyDesignSystem_95c9b3;

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'research', label: 'Bio & Research' },
  { id: 'coaching', label: 'Courses' },
  { id: 'register', label: 'Register' },
];

function Logo({ onClick, light = false }) {
  const ink = light ? '#f3f6fb' : 'var(--navy-700)';
  const sub = light ? 'var(--gold-400)' : 'var(--gold-600)';
  return (
    <button onClick={onClick} aria-label="Dr. A. K. Thakre Academy — home"
      style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 0,
               cursor: 'pointer', padding: 0, flexShrink: 0 }}>
      <svg width="42" height="42" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="58" fill="#0f2a4a" />
        <circle cx="60" cy="60" r="52.5" fill="none" stroke="#c8a24a" strokeWidth="2" />
        <text x="60" y="69" textAnchor="middle" fontFamily="var(--font-display)" fontSize="40" fontWeight="700" fill="#e6cd8c">AKT</text>
      </svg>
      <span style={{ textAlign: 'left', lineHeight: 1.05, whiteSpace: 'nowrap' }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700,
                       fontSize: 19, letterSpacing: '-0.01em', color: ink }}>Dr. A. K. Thakre</span>
        <span style={{ display: 'block', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 9.5,
                       letterSpacing: '0.28em', color: sub, marginTop: 2 }}>ACADEMY</span>
      </span>
    </button>
  );
}

function Header({ page, onNav }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const root = document.querySelector('#scroll-root') || window;
    const el = root === window ? document.documentElement : root;
    const onScroll = () => setScrolled((root === window ? window.scrollY : root.scrollTop) > 8);
    root.addEventListener('scroll', onScroll); onScroll();
    return () => root.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'rgba(251,248,241,0.85)' : 'rgba(251,248,241,0)',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
      transition: 'all var(--dur-med) var(--ease-out)',
    }}>
      <div className="ta-container" style={{ display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', height: 76 }}>
        <Logo onClick={() => onNav('home')} />
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => onNav(n.id)}
              style={{
                background: 'none', border: 0, cursor: 'pointer', padding: '8px 14px',
                fontFamily: 'var(--font-ui)', fontSize: 15, whiteSpace: 'nowrap',
                fontWeight: page === n.id ? 700 : 500,
                color: page === n.id ? 'var(--navy-700)' : 'var(--text-muted)',
                borderRadius: 'var(--radius-md)', position: 'relative',
              }}>
              {n.label}
              {page === n.id && <span style={{ position: 'absolute', left: 14, right: 14, bottom: 2,
                height: 2, background: 'var(--gold-500)', borderRadius: 2 }} />}
            </button>
          ))}
          <TAButton variant="gold" size="sm" style={{ marginLeft: 10 }}
            onClick={() => onNav('register')}>Enrol now</TAButton>
        </nav>
      </div>
    </header>
  );
}

function Footer({ onNav }) {
  return (
    <footer style={{ background: 'var(--navy-900)', color: 'var(--text-on-ink-muted)',
                     paddingTop: 'var(--space-9)', paddingBottom: 'var(--space-6)' }}>
      <div className="ta-container" style={{ display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr', gap: 40, alignItems: 'start' }}>
        <div>
          <Logo light />
          <p style={{ marginTop: 16, maxWidth: 320, fontSize: 14, lineHeight: 1.6 }}>
            Research-grade rigor for JEE, NEET &amp; CET. Physics-led mentoring that turns
            fundamentals into intuition.
          </p>
        </div>
        <div>
          <div style={{ color: 'var(--gold-400)', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em',
                        textTransform: 'uppercase', marginBottom: 14 }}>Explore</div>
          {NAV.map(n => (
            <button key={n.id} onClick={() => onNav(n.id)} style={{ display: 'block', background: 'none',
              border: 0, color: 'var(--text-on-ink-muted)', cursor: 'pointer', padding: '5px 0',
              fontSize: 14, fontFamily: 'var(--font-ui)' }}>{n.label}</button>
          ))}
        </div>
        <div>
          <div style={{ color: 'var(--gold-400)', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em',
                        textTransform: 'uppercase', marginBottom: 14 }}>Contact</div>
          <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            Nagpur, Maharashtra<br />
            +91 ·····  ·····<br />
            hello@thakreacademy.in
          </p>
        </div>
      </div>
      <div className="ta-container" style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-5)',
            borderTop: '1px solid var(--line-on-ink)', display: 'flex', justifyContent: 'space-between',
            fontSize: 12.5, color: 'var(--text-on-ink-muted)' }}>
        <span>© 2026 Dr. A. K. Thakre Academy</span>
        <span>Built on first principles.</span>
      </div>
    </footer>
  );
}

// Section wrapper with eyebrow + title + gold rule
function Section({ id, eyebrow, title, intro, dark = false, narrow = false, children, style = {} }) {
  return (
    <section id={id} style={{
      background: dark ? 'var(--navy-900)' : 'transparent',
      color: dark ? 'var(--text-on-ink)' : 'inherit',
      paddingTop: 'var(--section-pad-y)', paddingBottom: 'var(--section-pad-y)', ...style,
    }}>
      <div className="ta-container">
        {(eyebrow || title) && (
          <div style={{ maxWidth: narrow ? 680 : 880, marginBottom: 'var(--space-8)' }}>
            {eyebrow && <div className="overline" style={{ color: 'var(--gold-500)' }}>{eyebrow}</div>}
            <hr className="ta-rule-gold" style={{ marginTop: 12, marginBottom: 18 }} />
            {title && <h2 style={{ fontSize: 'var(--fs-3xl)', margin: 0,
              color: dark ? 'var(--text-on-ink)' : 'var(--text-strong)' }}>{title}</h2>}
            {intro && <p className="lead" style={{ marginTop: 16, marginBottom: 0,
              color: dark ? 'var(--text-on-ink-muted)' : 'var(--text-muted)' }}>{intro}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

// Photo placeholder — drop real photography here later.
function PhotoSlot({ label = 'Photograph', icon = 'image', ratio = '4 / 5', style = {} }) {
  return (
    <div style={{
      aspectRatio: ratio, width: '100%', borderRadius: 'var(--radius-xl)',
      background: 'var(--navy-800)',
      backgroundImage: 'linear-gradient(var(--line-on-ink) 1px, transparent 1px), linear-gradient(90deg, var(--line-on-ink) 1px, transparent 1px)',
      backgroundSize: '26px 26px',
      border: '1px solid var(--line-on-ink)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 10, color: 'var(--text-on-ink-muted)', ...style,
    }}>
      <i data-lucide={icon} style={{ width: 30, height: 30, opacity: 0.7 }}></i>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, fontWeight: 600,
        letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

Object.assign(window, { Header, Footer, Section, PhotoSlot, Logo, NAV });
})();
