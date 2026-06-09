// Home v2 — Premium overhauled design with interactive methodology showcase.
(function () {
  const DS = window.ThakreAcademyDesignSystem_95c9b3;
  const { Button, Badge, Card } = DS;

  function HeroSection({ onNav }) {
    return (
      <section style={{ 
        position: 'relative', 
        background: 'var(--navy-900)', 
        overflow: 'hidden',
        paddingTop: 120,
        paddingBottom: 120,
      }}>
        {/* Animated gradient background */}
        <div style={{ 
          position: 'absolute', 
          inset: 0,
          background: 'radial-gradient(800px 600px at 70% 10%, rgba(200,162,74,0.12), transparent 70%)',
        }} />

        <div className="ta-container" style={{ 
          position: 'relative', 
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr', 
          gap: 56, 
          alignItems: 'center',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <Badge tone="gold" solid>Science-backed coaching</Badge>
              <span style={{ fontSize: 13, color: 'var(--gold-400)', fontWeight: 600 }}>Established 2020</span>
            </div>
            
            <h1 style={{ 
              fontFamily: 'var(--font-display)', 
              fontWeight: 700, 
              color: 'var(--text-on-ink)',
              fontSize: 'clamp(42px, 5.2vw, 72px)', 
              lineHeight: 1.1, 
              letterSpacing: '-0.02em', 
              margin: 0,
            }}>
              Learn like a <span style={{ color: 'var(--gold-300)' }}>researcher.</span>
            </h1>
            
            <p style={{ 
              marginTop: 24, 
              fontSize: 'clamp(16px, 2vw, 20px)', 
              lineHeight: 1.7, 
              color: 'var(--text-on-ink-muted)',
              maxWidth: 520,
            }}>
              Most exam coaching teaches you what to memorize. We teach you <strong style={{ color: 'var(--gold-300)' }}>how to think.</strong> 
              First principles. Problem-solving. The exact reasoning used in physics research — now applied to your exam.
            </p>
            
            <div style={{ display: 'flex', gap: 14, marginTop: 32, flexWrap: 'wrap' }}>
              <Button variant="gold" size="lg" onClick={() => onNav('research')}
                iconRight={<i data-lucide="arrow-right" style={{ width: 20, height: 20 }}></i>}>
                Explore the method
              </Button>
              <Button variant="on-ink" size="lg" onClick={() => onNav('register')}>
                Get in touch
              </Button>
            </div>
          </div>

          <div style={{ 
            position: 'relative', 
            textAlign: 'center',
            animation: 'float 4s ease-in-out infinite',
          }}>
            <div style={{ 
              position: 'relative',
              width: '100%',
              maxWidth: 340,
              marginLeft: 'auto',
            }}>
              <img src="../../assets/logo.png" alt="K.A.K. Elite Mentorship" 
                style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }} />
            </div>
          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 1.2; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
          }
        `}</style>
      </section>
    );
  }

  function MethodologyPillars() {
    const pillars = [
      {
        num: '01',
        icon: 'atom',
        title: 'First Principles',
        desc: 'Every concept traced back to fundamental laws. Why before what.',
      },
      {
        num: '02',
        icon: 'brain',
        title: 'Deep Understanding',
        desc: 'Your brain builds neural patterns for reasoning, not regurgitation.',
      },
      {
        num: '03',
        icon: 'zap',
        title: 'Exam Precision',
        desc: 'Once you understand, exam technique becomes natural.',
      },
    ];

    return (
      <section style={{ 
        background: 'var(--navy-50)',
        paddingTop: 'var(--section-pad-y)',
        paddingBottom: 'var(--section-pad-y)',
      }}>
        <div className="ta-container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-9)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold-600)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              The Method
            </div>
            <h2 style={{ 
              fontSize: 'var(--fs-4xl)', 
              margin: 0, 
              color: 'var(--text-strong)',
              maxWidth: 600,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              Three pillars of research-grade learning
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {pillars.map(p => (
              <div key={p.num} style={{
                position: 'relative',
                padding: '28px 24px',
                borderRadius: 'var(--radius-xl)',
                background: 'white',
                border: '1px solid var(--line)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 16px 32px rgba(15,42,74,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{
                  position: 'absolute',
                  top: -16,
                  left: 24,
                  width: 56,
                  height: 56,
                  borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, var(--gold-400), var(--gold-600))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'var(--navy-900)',
                  boxShadow: '0 8px 16px rgba(200,162,74,0.24)',
                }}>
                  {p.num}
                </div>
                
                <div style={{ paddingTop: 32, marginBottom: 16 }}>
                  <span style={{
                    display: 'inline-flex',
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--gold-100)',
                    color: 'var(--gold-700)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <i data-lucide={p.icon} style={{ width: 22, height: 22 }}></i>
                  </span>
                </div>
                
                <h3 style={{ 
                  fontSize: 'var(--fs-xl)', 
                  margin: '0 0 8px', 
                  color: 'var(--text-strong)' 
                }}>
                  {p.title}
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: 'var(--text-muted)',
                }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function TestimonialsPillar() {
    const testimonials = [
      {
        quote: 'For the first time, physics wasn\'t about formulas — it was about reasoning.',
        name: 'Aarav K.',
        role: 'JEE aspirant',
        icon: '✨',
      },
      {
        quote: 'The first-principles approach made difficult concepts suddenly click.',
        name: 'Riya S.',
        role: 'NEET student',
        icon: '💡',
      },
      {
        quote: 'I stopped memorizing and started understanding. Everything changed.',
        name: 'Ishaan P.',
        role: 'Class 12',
        icon: '🎯',
      },
    ];

    return (
      <section style={{ 
        background: 'var(--navy-900)',
        color: 'var(--text-on-ink)',
        paddingTop: 'var(--section-pad-y)',
        paddingBottom: 'var(--section-pad-y)',
      }}>
        <div className="ta-container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-9)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold-400)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              Student Voice
            </div>
            <h2 style={{ 
              fontSize: 'var(--fs-4xl)', 
              margin: '0 0 8px', 
              color: 'var(--text-on-ink)',
            }}>
              What learners say
            </h2>
            <p style={{
              fontSize: 16,
              color: 'var(--text-on-ink-muted)',
              maxWidth: 500,
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 8,
            }}>
              (No rank claims. Just real feedback on how the method changes thinking.)
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {testimonials.map((t, i) => (
              <Card key={i} elevation="sm" interactive style={{
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--line-on-ink)',
              }}>
                <div style={{ fontSize: 28 }}>{t.icon}</div>
                <blockquote style={{
                  margin: 0,
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: 'var(--text-on-ink)',
                  fontStyle: 'italic',
                }}>
                  "{t.quote}"
                </blockquote>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  paddingTop: 12,
                  borderTop: '1px solid var(--line-on-ink)',
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--gold-400), var(--gold-600))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--navy-900)',
                    fontSize: 20,
                    fontWeight: 700,
                  }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-on-ink)' }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-on-ink-muted)' }}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function BookSection({ onNav }) {
    return (
      <section style={{ 
        background: 'var(--cream-50)',
        paddingTop: 'var(--section-pad-y)',
        paddingBottom: 'var(--section-pad-y)',
      }}>
        <div className="ta-container">
          <Card padded={false} elevation="lg" style={{
            display: 'grid',
            gridTemplateColumns: '320px 1fr',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, var(--navy-900) 0%, var(--navy-800) 100%)',
            border: '1px solid var(--navy-700)',
          }}>
            <div style={{
              position: 'relative',
              minHeight: 420,
              background: 'var(--navy-800)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <embed src="../../assets/book-cover.pdf" type="application/pdf"
                style={{ width: '100%', height: '100%' }} />
            </div>
            
            <div style={{
              padding: '48px 44px',
              color: 'var(--text-on-ink)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <Badge tone="gold" solid style={{ alignSelf: 'flex-start', marginBottom: 16 }}>
                Published 2024
              </Badge>
              <h2 style={{
                fontSize: 'var(--fs-3xl)',
                margin: '0 0 8px',
                color: 'var(--text-on-ink)',
              }}>
                NEET Preparation Companion
              </h2>
              <p style={{
                fontSize: 15,
                color: 'var(--text-on-ink-muted)',
                margin: '0 0 24px',
                lineHeight: 1.7,
              }}>
                Dr. Thakre's latest book distills years of classroom insight into a structured,
                concept-first guide for NEET aspirants. Available now on Amazon.
              </p>
              <Button as="a" variant="gold" size="lg" target="_blank" rel="noopener"
                href="https://www.amazon.in/dp/B0H469W264"
                iconRight={<i data-lucide="external-link" style={{ width: 18, height: 18 }}></i>}>
                View on Amazon
              </Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  function CTASection({ onNav }) {
    return (
      <section style={{
        background: 'linear-gradient(135deg, var(--gold-500) 0%, var(--gold-600) 100%)',
        paddingTop: 64,
        paddingBottom: 64,
      }}>
        <div className="ta-container" style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 40,
          alignItems: 'center',
          maxWidth: 1000,
        }}>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: 'var(--fs-3xl)',
              color: 'var(--navy-900)',
            }}>
              Ready to think differently?
            </h2>
            <p style={{
              margin: '12px 0 0',
              fontSize: 18,
              color: 'var(--navy-800)',
              maxWidth: 480,
            }}>
              Explore the courses, dive into the methodology, or get in touch with questions.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="primary" size="lg" onClick={() => onNav('coaching')}
              iconRight={<i data-lucide="book-open" style={{ width: 18, height: 18 }}></i>}>
              View courses
            </Button>
            <Button variant="on-gold" size="lg" onClick={() => onNav('register')}
              iconRight={<i data-lucide="arrow-right" style={{ width: 18, height: 18 }}></i>}>
              Contact us
            </Button>
          </div>
        </div>
      </section>
    );
  }

  function Home({ onNav }) {
    return (
      <div>
        <HeroSection onNav={onNav} />
        <MethodologyPillars />
        <TestimonialsPillar />
        <BookSection onNav={onNav} />
        <CTASection onNav={onNav} />
      </div>
    );
  }

  window.Home = Home;
})();
