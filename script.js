document.addEventListener('DOMContentLoaded', () => {
    // Section tabs
    const tabs = document.querySelectorAll('.tab');
    const sections = {
        research: document.getElementById('section-research'),
        teaching: document.getElementById('section-teaching')
    };

    let activeSection = 'research';
    const reducedMotionForTabs = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const key = tab.dataset.section;
            if (key === activeSection) return;
            activeSection = key;

            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            const incoming = sections[key];
            const outgoing = Object.entries(sections).find(([k]) => k !== key)?.[1];

            if (reducedMotionForTabs || !incoming) {
                Object.entries(sections).forEach(([k, el]) => {
                    if (el) el.classList.toggle('active', k === key);
                });
                return;
            }

            if (outgoing && outgoing.classList.contains('active')) {
                outgoing.classList.add('section-leaving');
                outgoing.classList.remove('active');
                window.setTimeout(() => outgoing.classList.remove('section-leaving'), 280);
            }
            incoming.classList.add('active');
        });
    });

    // Hero CTA: jump to the teaching tab
    const ctaMentorship = document.getElementById('cta-mentorship');
    if (ctaMentorship) {
        ctaMentorship.addEventListener('click', () => {
            const teachingTab = document.querySelector('.tab[data-section="teaching"]');
            if (teachingTab) {
                teachingTab.click();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Hero stat count-up (one-shot, skipped under reduced motion)
    if (!reducedMotion) {
        document.querySelectorAll('.hero-stats [data-count]').forEach(el => {
            const target = parseInt(el.dataset.count, 10);
            if (!Number.isFinite(target)) return;
            const t0 = performance.now();
            const dur = 1100;
            const tick = (now) => {
                const k = Math.min((now - t0) / dur, 1);
                el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
                if (k < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
    }

    // Scroll-reveal fallback for engines without animation-timeline (Safari/Firefox)
    if (!reducedMotion && !CSS.supports('animation-timeline: view()') && 'IntersectionObserver' in window) {
        document.body.classList.add('reveal-fallback');
        const cards = document.querySelectorAll(
            '.bento-grid > .bento-item, .pillars-grid > .bento-item, .courses-grid > .bento-item, .books-grid > .book-card'
        );
        cards.forEach((el, i) => {
            el.classList.add('reveal');
            el.style.setProperty('--i', i % 3);
        });
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px' });
        cards.forEach(el => io.observe(el));
    }

    // Hero flow-field: particles advected through a static vector field (CFD streamlines)
    const canvas = document.getElementById('flow-field');
    if (canvas && !reducedMotion) {
        const ctx = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let w = 0, h = 0, particles = [], rafId = null;

        function field(x, y, t) {
            // Smooth pseudo-noise angle field; gentle horizontal drift
            return Math.sin(x * 0.004 + t * 0.00012) * 1.1
                 + Math.cos(y * 0.006 - t * 0.00009) * 0.9;
        }

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            w = rect.width; h = rect.height;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const count = Math.min(220, Math.floor(w * h / 6500));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                life: Math.random() * 220,
                gold: Math.random() < 0.18
            }));
            ctx.clearRect(0, 0, w, h);
        }

        function step(t) {
            ctx.fillStyle = 'rgba(2, 6, 23, 0.06)'; // fade trails into the page bg
            ctx.fillRect(0, 0, w, h);
            ctx.lineWidth = 1;
            for (const p of particles) {
                const a = field(p.x, p.y, t);
                const nx = p.x + Math.cos(a) * 0.9 + 0.35; // slight rightward current
                const ny = p.y + Math.sin(a) * 0.9;
                ctx.strokeStyle = p.gold ? 'rgba(245, 158, 11, 0.20)' : 'rgba(34, 211, 238, 0.22)';
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(nx, ny);
                ctx.stroke();
                p.x = nx; p.y = ny;
                if (--p.life < 0 || p.x < -5 || p.x > w + 5 || p.y < -5 || p.y > h + 5) {
                    p.x = Math.random() * w;
                    p.y = Math.random() * h;
                    p.life = 150 + Math.random() * 200;
                }
            }
            rafId = requestAnimationFrame(step);
        }

        function start() { if (rafId === null && !window.__hero3d) rafId = requestAnimationFrame(step); }
        function stop() { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } }

        function syncVisibility() {
            const teachingActive = document.getElementById('section-teaching')?.classList.contains('active');
            (document.hidden || teachingActive) ? stop() : start();
        }

        resize();
        start();
        window.addEventListener('resize', resize);
        document.addEventListener('visibilitychange', syncVisibility);
        tabs.forEach(tab => tab.addEventListener('click', syncVisibility));

        // WebGL hero takes over: stop the 2D canvas for good.
        document.addEventListener('hero3d:active', stop);
        canvas.addEventListener('hero3d:active', stop);
    }

    // ── Bento tilt-on-hover (skipped under reduced motion / coarse pointer) ──
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!reducedMotion && finePointer) {
        document.querySelectorAll('.bento-item').forEach(card => {
            let rafTilt = null;
            const applyTilt = (rx, ry) => {
                card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
            };
            card.addEventListener('pointermove', (e) => {
                const rect = card.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width - 0.5;
                const py = (e.clientY - rect.top) / rect.height - 0.5;
                const rx = (-py * 6).toFixed(2);
                const ry = (px * 6).toFixed(2);
                if (rafTilt) cancelAnimationFrame(rafTilt);
                rafTilt = requestAnimationFrame(() => applyTilt(rx, ry));
            });
            card.addEventListener('pointerleave', () => {
                if (rafTilt) cancelAnimationFrame(rafTilt);
                card.style.transform = '';
            });
        });

        // ── Magnetic CTA buttons ──
        document.querySelectorAll('.btn-gold, .btn-cyan, .btn-ghost').forEach(btn => {
            btn.addEventListener('pointermove', (e) => {
                const rect = btn.getBoundingClientRect();
                const mx = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
                const my = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
                btn.style.transform = `translate(${mx.toFixed(2)}px, ${my.toFixed(2)}px)`;
            });
            btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
        });
    }
});
