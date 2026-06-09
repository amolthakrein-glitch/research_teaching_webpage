// Coaching v2 — Premium overhauled design with visual hierarchy and methodology focus.
(function () {
  const DS = window.ThakreAcademyDesignSystem_95c9b3;
  const { Button, Badge, Card } = DS;

  const COURSES = [
    {
      id: 'foundation',
      title: 'Foundation',
      subtitle: 'Class 9 & 10',
      badge: 'Build fundamentals',
      description: 'Establish first-principles thinking before high-stakes exams.',
      duration: '2 years',
      batch: '25–30 students',
      color: 'var(--navy-900)',
      highlights: [
        'Concept-first approach',
        'NCERT + deeper exploration',
        'Weekly problem sessions',
        'Monthly mock tests',
        'Board + Olympiad prep',
      ],
      structure: [
        { phase: 'Phase 1: Mechanics (6 mo)', topics: 'Motion, forces, energy from first principles.' },
        { phase: 'Phase 2: Thermo & Waves (6 mo)', topics: 'Heat, entropy, sound, light fundamentals.' },
        { phase: 'Phase 3: Consolidation (6 mo)', topics: 'Year 1 integration. Board exam patterns.' },
        { phase: 'Phase 4: Olympiad (6 mo)', topics: 'Deep dives. National/state Olympiad prep.' },
      ],
    },
    {
      id: 'twoyear',
      title: 'Two-Year',
      subtitle: 'Class 11 & 12',
      badge: 'Most comprehensive',
      description: 'Full journey from fundamentals to exam readiness. JEE/NEET focused.',
      duration: '2 years',
      batch: '20–25 students',
      color: 'var(--gold-600)',
      highlights: [
        'Class 11 + 12 full syllabus',
        'Bi-weekly full-length mocks',
        'Weekly doubt-clearing',
        'Exam-pattern mastery',
        'One-on-one tracking',
      ],
      structure: [
        { phase: 'Months 1–6 (Yr 1)', topics: 'Class 11 core: Mechanics & thermodynamics foundation.' },
        { phase: 'Months 7–12 (Yr 1)', topics: 'Oscillations, waves. Class 12 intro.' },
        { phase: 'Months 1–6 (Yr 2)', topics: 'Class 12 core: Electromagnetism integration.' },
        { phase: 'Months 7–12 (Yr 2)', topics: 'Final push: Optics, modern physics, mocks, strategy.' },
      ],
    },
    {
      id: 'oneyear',
      title: 'One-Year',
      subtitle: 'Droppers / Fast-track',
      badge: 'Accelerated mastery',
      description: 'High intensity, high focus. Next 12 months to exam readiness.',
      duration: '1 year',
      batch: '12–16 students',
      color: 'var(--navy-800)',
      highlights: [
        'Rapid syllabus review',
        'Intensive problem drills',
        'Weekly full-length mocks',
        'Daily doubt sessions',
        'Mental conditioning',
      ],
      structure: [
        { phase: 'Months 1–4', topics: 'Accelerated concept review. Class 11 + 12 in 4 months.' },
        { phase: 'Months 5–8', topics: 'Exam-pattern drills. Complex integrations.' },
        { phase: 'Months 9–10', topics: 'Weekly mocks. Detailed performance review.' },
        { phase: 'Months 11–12', topics: 'Final revision. Exam-day strategy & conditioning.' },
      ],
    },
  ];

  function CourseCatalog({ onSelectCourse }) {
    return (
      <div>
        <section style={{ background: 'var(--navy-900)', color: 'var(--text-on-ink)', paddingTop: 88, paddingBottom: 72 }}>
          <div className="ta-container">
            <div style={{ maxWidth: 700 }}>
              <Badge tone="gold" solid style={{ marginBottom: 16 }}>Three pathways</Badge>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(36px, 4vw, 56px)',
                lineHeight: 1.1,
                margin: 0,
                color: 'var(--text-on-ink)',
              }}>
                Choose your learning path
              </h1>
              <p style={{
                fontSize: 18,
                lineHeight: 1.7,
                color: 'var(--text-on-ink-muted)',
                margin: '16px 0 0',
              }}>
                Same methodology. Different pace & scope. All taught from first principles.
              </p>
            </div>
          </div>
        </section>

        <div style={{ background: 'var(--cream-50)', paddingTop: 72, paddingBottom: 72 }}>
          <div className="ta-container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
              {COURSES.map(course => (
                <Card key={course.id} elevation="lg" interactive 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0,
                    overflow: 'hidden',
                    borderLeft: `6px solid ${course.color}`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-12px)';
                    e.currentTarget.style.boxShadow = '0 24px 48px rgba(15,42,74,0.16)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }}>
                  <div style={{ padding: '28px 24px 20px', background: 'linear-gradient(135deg, rgba(200,162,74,0.05), transparent)', borderBottom: '1px solid var(--line)' }}>
                    <Badge tone="gold" solid style={{ marginBottom: 12 }}>{course.badge}</Badge>
                    <h3 style={{ fontSize: 'var(--fs-3xl)', margin: '0 0 4px', color: 'var(--text-strong)', fontWeight: 700 }}>
                      {course.title}
                    </h3>
                    <p style={{ fontSize: 15, color: course.color, margin: '0 0 12px', fontWeight: 600 }}>
                      {course.subtitle}
                    </p>
                    <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-muted)', margin: 0 }}>
                      {course.description}
                    </p>
                  </div>

                  <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Duration</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-strong)' }}>{course.duration}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Batch size</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-strong)' }}>{course.batch}</div>
                    </div>
                  </div>

                  <div style={{ padding: '0 24px 24px' }}>
                    <Button variant="gold" size="lg" style={{ width: '100%' }}
                      onClick={() => onSelectCourse(course.id)}>
                      View details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function CourseDetail({ courseId, onBack, onNav }) {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return null;

    return (
      <div>
        <section style={{ background: 'var(--navy-900)', color: 'var(--text-on-ink)', paddingTop: 88, paddingBottom: 72 }}>
          <div className="ta-container">
            <Button variant="on-ink" size="sm" onClick={onBack} style={{ marginBottom: 20 }}
              iconLeft={<i data-lucide="arrow-left" style={{ width: 18, height: 18 }}></i>}>
              Back to courses
            </Button>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 4vw, 56px)',
              lineHeight: 1.1,
              margin: '18px 0 0',
              color: 'var(--text-on-ink)',
            }}>
              {course.title} Course
            </h1>
            <p style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: 'var(--text-on-ink-muted)',
              margin: '16px 0 0',
              maxWidth: 600,
            }}>
              {course.description}
            </p>
          </div>
        </section>

        <section style={{ background: 'var(--cream-50)', paddingTop: 72, paddingBottom: 72 }}>
          <div className="ta-container">
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-9)' }}>
              <h2 style={{ fontSize: 'var(--fs-4xl)', margin: 0, color: 'var(--text-strong)' }}>
                What's included
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {course.highlights.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <i data-lucide="check" style={{ width: 20, height: 20, color: course.color, flexShrink: 0, marginTop: 2 }}></i>
                  <span style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-body)' }}>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ paddingTop: 72, paddingBottom: 72 }}>
          <div className="ta-container">
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-9)' }}>
              <h2 style={{ fontSize: 'var(--fs-4xl)', margin: 0, color: 'var(--text-strong)' }}>
                Learning arc
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {course.structure.map((s, i) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 24,
                  padding: '24px 0',
                  borderBottom: i === course.structure.length - 1 ? 'none' : '1px solid var(--line)',
                  alignItems: 'start',
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: course.color, minWidth: 140 }}>
                    {s.phase}
                  </div>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: 'var(--text-body)' }}>
                    {s.topics}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: course.color, paddingTop: 64, paddingBottom: 64 }}>
          <div className="ta-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 'var(--fs-3xl)', color: 'white' }}>
                Ready to start?
              </h2>
              <p style={{ margin: '12px 0 0', fontSize: 17, color: 'rgba(255,255,255,0.85)', maxWidth: 480 }}>
                Get in touch and we'll map out the right program for your goals.
              </p>
            </div>
            <Button variant="primary" size="lg" onClick={() => onNav('register')}
              iconRight={<i data-lucide="arrow-right" style={{ width: 20, height: 20 }}></i>}>
              Get in touch
            </Button>
          </div>
        </section>
      </div>
    );
  }

  function CoachingPage({ onNav }) {
    const [selectedCourse, setSelectedCourse] = React.useState(null);

    if (selectedCourse) {
      return <CourseDetail courseId={selectedCourse} onNav={onNav} onBack={() => setSelectedCourse(null)} />;
    }

    return <CourseCatalog onSelectCourse={setSelectedCourse} />;
  }

  window.CoachingPage = CoachingPage;
})();
