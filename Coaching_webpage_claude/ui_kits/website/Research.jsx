// Research v2 — Premium bio with interactive CV timeline + publications grid.
(function () {
  const DS = window.ThakreAcademyDesignSystem_95c9b3;
  const { Badge, Card, Button } = DS;

  function ProfileHero() {
    return (
      <section style={{ background: 'var(--navy-900)', color: 'var(--text-on-ink)', paddingTop: 88, paddingBottom: 72 }}>
        <div className="ta-container" style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 56, alignItems: 'center' }}>
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-2xl)',
            overflow: 'hidden',
            aspectRatio: '4 / 5',
            background: 'linear-gradient(135deg, var(--navy-800), var(--navy-700))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--line-on-ink)',
            fontSize: 80,
            fontWeight: 700,
            color: 'var(--gold-400)',
          }}>
            👨‍🔬
          </div>
          
          <div>
            <div style={{ display: 'inline-flex', gap: 8, marginBottom: 16 }}>
              <Badge tone="gold" solid>PhD · Applied Physics</Badge>
              <Badge tone="navy" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-on-ink)' }}>
                Researcher & Mentor
              </Badge>
            </div>
            
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 4vw, 56px)',
              lineHeight: 1.1,
              margin: 0,
              color: 'var(--text-on-ink)',
            }}>
              Dr. Amol Kumar Thakre
            </h1>
            
            <p style={{
              fontSize: 18,
              color: 'var(--gold-300)',
              margin: '12px 0 24px',
              fontWeight: 500,
            }}>
              Applied Physics · Fluid Mechanics · Physics Education
            </p>
            
            <p style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: 'var(--text-on-ink-muted)',
              maxWidth: 520,
              marginBottom: 24,
            }}>
              A working physicist who teaches. Over a decade of research in fluid dynamics and thermodynamics, 
              now channeled into mentoring the next generation of problem-solvers. 
              Founder of K.A.K. Elite Mentorship in 2020.
            </p>
            
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold-400)', letterSpacing: '0.05em',
                  textTransform: 'uppercase', marginBottom: 4 }}>Years Teaching</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-on-ink)' }}>12+</div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold-400)', letterSpacing: '0.05em',
                  textTransform: 'uppercase', marginBottom: 4 }}>Publications</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-on-ink)' }}>[CV]</div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold-400)', letterSpacing: '0.05em',
                  textTransform: 'uppercase', marginBottom: 4 }}>Research Areas</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-on-ink)' }}>5+</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function MethodologyStatement() {
    return (
      <section style={{ background: 'var(--cream-50)', paddingTop: 72, paddingBottom: 72 }}>
        <div className="ta-container">
          <Card elevation="md" style={{
            padding: '48px 44px',
            background: 'linear-gradient(135deg, var(--navy-900) 0%, var(--navy-800) 100%)',
            border: '1px solid var(--navy-700)',
            color: 'var(--text-on-ink)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, alignItems: 'start' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, var(--gold-400), var(--gold-600))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <i data-lucide="quote" style={{ width: 32, height: 32, color: 'var(--navy-900)' }}></i>
              </div>
              
              <div>
                <h3 style={{ fontSize: 'var(--fs-2xl)', margin: '0 0 12px', color: 'var(--text-on-ink)' }}>
                  Why I teach the way I do
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: 'var(--text-on-ink-muted)',
                  maxWidth: 680,
                }}>
                  In the lab, you cannot bluff your way past a problem — nature checks your work. 
                  I bring that same honesty to the classroom. We start from the fundamental laws and build upward, 
                  so that when an unfamiliar problem appears in the exam hall, you are not searching your memory 
                  for a formula. <strong style={{ color: 'var(--gold-300)' }}>You are reasoning.</strong>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  function CVTimeline() {
    const timeline = [
      { year: '[CV]', event: 'PhD, Applied Physics / Engineering', org: '[Institution from CV]' },
      { year: '[CV]', event: 'M.Sc. / M.Tech Physics', org: '[Institution from CV]' },
      { year: '[CV]', event: 'Postdoctoral Research', org: '[Details from CV]' },
      { year: '2020', event: 'Founded K.A.K. Elite Mentorship', org: 'Nagpur, Maharashtra' },
      { year: 'Present', event: 'Director & Lead Mentor', org: 'Physics coaching for JEE, NEET, CET' },
    ];

    return (
      <section style={{ background: 'var(--navy-50)', paddingTop: 72, paddingBottom: 72 }}>
        <div className="ta-container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-9)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold-600)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              Career Arc
            </div>
            <h2 style={{ fontSize: 'var(--fs-4xl)', margin: 0, color: 'var(--text-strong)' }}>
              From lab to classroom
            </h2>
          </div>

          <div style={{ position: 'relative', maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
            {/* Timeline line */}
            <div style={{
              position: 'absolute',
              left: 27,
              top: 28,
              bottom: 0,
              width: 2,
              background: 'linear-gradient(180deg, var(--gold-500), transparent)',
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {timeline.map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, alignItems: 'start' }}>
                  <div style={{
                    position: 'relative',
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: i === timeline.length - 1 
                      ? 'linear-gradient(135deg, var(--gold-400), var(--gold-600))'
                      : 'var(--navy-900)',
                    border: '3px solid var(--cream-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    fontWeight: 700,
                    color: i === timeline.length - 1 ? 'var(--navy-900)' : 'var(--gold-500)',
                    zIndex: 1,
                  }}>
                    {i === timeline.length - 1 ? '✓' : String(i + 1).padStart(2, '0')}
                  </div>
                  
                  <Card elevation="sm" style={{
                    padding: '20px 24px',
                    border: i === timeline.length - 1 ? '2px solid var(--gold-500)' : '1px solid var(--line)',
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold-600)',
                      letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>
                      {item.year}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 4 }}>
                      {item.event}
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                      {item.org}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  function ResearchAreas() {
    const areas = [
      { icon: 'waves', title: 'Fluid Mechanics', desc: 'Flow dynamics, turbulence, transport phenomena' },
      { icon: 'atom', title: 'Condensed Matter', desc: 'Structure & behaviour at the micro-scale' },
      { icon: 'thermometer', title: 'Thermodynamics', desc: 'Bridging microscopic and macroscopic laws' },
      { icon: 'orbit', title: 'Molecular Dynamics', desc: 'Simulating particle systems' },
      { icon: 'zap', title: 'Computational Physics', desc: 'Numerical methods & simulation' },
      { icon: 'book-open', title: 'Science Education', desc: 'Teaching complex concepts simply' },
    ];

    return (
      <section style={{ background: 'var(--cream-50)', paddingTop: 72, paddingBottom: 72 }}>
        <div className="ta-container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-9)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold-600)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              Research
            </div>
            <h2 style={{ fontSize: 'var(--fs-4xl)', margin: 0, color: 'var(--text-strong)' }}>
              Areas of focus
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {areas.map(a => (
              <Card key={a.title} elevation="sm" interactive style={{
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                <span style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--gold-100)',
                  color: 'var(--gold-700)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <i data-lucide={a.icon} style={{ width: 22, height: 22 }}></i>
                </span>
                <h3 style={{ margin: '0 0 4px', fontSize: 'var(--fs-lg)', color: 'var(--text-strong)', fontWeight: 700 }}>
                  {a.title}
                </h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)' }}>
                  {a.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function Publications() {
    return (
      <section style={{ paddingTop: 72, paddingBottom: 72 }}>
        <div className="ta-container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-9)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold-600)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              Peer-Reviewed Work
            </div>
            <h2 style={{ fontSize: 'var(--fs-4xl)', margin: 0, color: 'var(--text-strong)' }}>
              Selected publications
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '12px auto 0', maxWidth: 500 }}>
              (Complete publication list will be added from CV)
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            {[1, 2, 3, 4].map(n => (
              <Card key={n} elevation="sm" style={{
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                  <i data-lucide="file-text" style={{ width: 24, height: 24, color: 'var(--gold-600)',
                    flexShrink: 0, marginTop: 2 }}></i>
                  <Badge tone="neutral" style={{ fontSize: 12 }}>[CV]</Badge>
                </div>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-strong)' }}>
                  Publication title #{n}
                </h4>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--text-muted)' }}>
                  Journal name · Year · Authors
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function ResearchPage({ onNav }) {
    return (
      <div>
        <ProfileHero />
        <MethodologyStatement />
        <CVTimeline />
        <ResearchAreas />
        <Publications />
      </div>
    );
  }

  window.ResearchPage = ResearchPage;
})();
