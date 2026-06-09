// Register — enrolment / counselling form.
(function () {
  const DS = window.ThakreAcademyDesignSystem_95c9b3;
  const { Button, Input, Select, Card, Badge } = DS;

  function SidePanel() {
    const points = [
      { icon: 'phone-call', t: 'Free counselling call', d: 'We discuss your target, current level and the right program.' },
      { icon: 'clipboard-list', t: 'Diagnostic assessment', d: 'A short test to baseline your strengths and gaps.' },
      { icon: 'calendar-check', t: 'Seat confirmation', d: 'Reserve your place in the batch — limited to keep it small.' },
    ];
    return (
      <div style={{ background: 'var(--navy-900)', color: 'var(--text-on-ink)', borderRadius: 'var(--radius-xl)',
        padding: '38px 34px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.5,
          backgroundImage: 'linear-gradient(var(--line-on-ink) 1px, transparent 1px), linear-gradient(90deg, var(--line-on-ink) 1px, transparent 1px)',
          backgroundSize: '34px 34px', maskImage: 'radial-gradient(400px 300px at 90% 0%, #000, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(400px 300px at 90% 0%, #000, transparent 70%)' }} />
        <div style={{ position: 'relative' }}>
          <div className="overline" style={{ color: 'var(--gold-500)' }}>What happens next</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-2xl)', margin: '14px 0 26px',
            color: 'var(--text-on-ink)' }}>Three simple steps</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {points.map((p, i) => (
              <div key={p.t} style={{ display: 'flex', gap: 14 }}>
                <span style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 'var(--radius-md)',
                  background: 'rgba(200,162,74,0.16)', color: 'var(--gold-300)', display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center' }}>
                  <i data-lucide={p.icon} style={{ width: 21, height: 21 }}></i>
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{p.t}</div>
                  <div style={{ color: 'var(--text-on-ink-muted)', fontSize: 14, lineHeight: 1.5, marginTop: 2 }}>{p.d}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 30, paddingTop: 22, borderTop: '1px solid var(--line-on-ink)',
            display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-on-ink-muted)', fontSize: 14.5 }}>
            <i data-lucide="phone" style={{ width: 18, height: 18, color: 'var(--gold-400)' }}></i>
            Prefer to talk? Call +91 ·····  ·····
          </div>
        </div>
      </div>
    );
  }

  function RegForm() {
    const [done, setDone] = React.useState(false);
    if (done) {
      return (
        <Card elevation="md" style={{ textAlign: 'center', padding: '56px 40px' }}>
          <span style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--success-100)',
            color: 'var(--success-600)', display: 'inline-flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 20px' }}>
            <i data-lucide="check" style={{ width: 32, height: 32 }}></i>
          </span>
          <h3 style={{ fontSize: 'var(--fs-2xl)', margin: '0 0 8px' }}>Thank you</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 380, margin: '0 auto 24px' }}>
            We'll reach out to discuss the methodology and find the right fit for your learning goals.
          </p>
          <Button variant="secondary" onClick={() => setDone(false)}>Send another inquiry</Button>
        </Card>
      );
    }
    return (
      <Card elevation="md" accent style={{ padding: 'var(--space-7)' }}>
        <h3 style={{ fontSize: 'var(--fs-2xl)', margin: '0 0 4px' }}>Get in touch</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, margin: '0 0 26px' }}>
          Interested in learning the methodology? Share your details and we'll be in touch.
        </p>
        <form onSubmit={(e) => { e.preventDefault(); setDone(true); }}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Your name" placeholder="e.g. Aarav Kulkarni" required
            leadingIcon={<i data-lucide="user" style={{ width: 18, height: 18 }}></i>} />
          <Input label="Email" type="email" placeholder="you@example.com" required
            leadingIcon={<i data-lucide="mail" style={{ width: 18, height: 18 }}></i>} />
          <Input label="Mobile number" type="tel" placeholder="+91 ·········" required
            leadingIcon={<i data-lucide="phone" style={{ width: 18, height: 18 }}></i>} />
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-strong)',
              marginBottom: 8 }}>What interests you?</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['JEE coaching', 'NEET coaching', 'Foundation (Class 9–10)', 'Just curious'].map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                  fontSize: 15, color: 'var(--text-body)' }}>
                  <input type="checkbox" style={{ width: 18, height: 18, cursor: 'pointer' }} />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <Input label="Questions or notes (optional)" placeholder="Anything else we should know?" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6, flexWrap: 'wrap' }}>
            <Button type="submit" variant="gold" size="lg"
              iconRight={<i data-lucide="arrow-right" style={{ width: 18, height: 18 }}></i>}>
              Send inquiry
            </Button>
            <span style={{ fontSize: 13, color: 'var(--text-faint)' }}>
              No commitment needed
            </span>
          </div>
        </form>
      </Card>
    );
  }

  function Register({ onNav }) {
    return (
      <div>
        <section style={{ background: 'var(--navy-900)', color: 'var(--text-on-ink)' }}>
          <div className="ta-container" style={{ paddingTop: 72, paddingBottom: 56, maxWidth: 760 }}>
            <Badge tone="gold" solid>Learn differently</Badge>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4vw,50px)',
              lineHeight: 1.14, margin: '18px 0 0', color: 'var(--text-on-ink)' }}>
              Get in touch
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--text-on-ink-muted)', marginTop: 14 }}>
              Curious about the first-principles methodology? Share your background and we'll 
              discuss how it fits your learning goals.
            </p>
          </div>
        </section>
        <div className="ta-container" style={{ paddingTop: 'var(--space-9)', paddingBottom: 'var(--space-12)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.85fr', gap: 32, alignItems: 'start' }}>
            <RegForm />
            <SidePanel />
          </div>
        </div>
      </div>
    );
  }

  window.RegisterPage = Register;
})();
