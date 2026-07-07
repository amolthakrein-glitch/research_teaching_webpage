document.addEventListener('DOMContentLoaded', () => {
    // Standard year update
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Contact Obfuscation Protection (Enhanced)
    const data = {
        e_u: "amolthakre.in",
        e_d: "gmail.com",
        p_c: "+91",
        p_m: "9591233320"
    };

    // Multiple Check Validation (Surity Check)
    function verifyContact() {
        const emailValid = data.e_u.includes(".") && data.e_d.includes(".");
        const phoneValid = data.p_m.length === 10;
        return emailValid && phoneValid;
    }

    const emlLink = document.getElementById('eml-link');
    const phnText = document.getElementById('phn-text');

    if (emlLink && phnText && verifyContact()) {
        const fullE = `${data.e_u}@${data.e_d}`;
        const fullP = `${data.p_c}-${data.p_m}`;

        // Initial Masked State
        emlLink.textContent = `a...e@${data.e_d.split('.')[0]}...m`;
        phnText.textContent = `${data.p_c}-9...20`;

        // Ensure email works on mobile (no hover): set mailto immediately, reveal on intent.
        emlLink.href = `mailto:${fullE}`;

        const revealEmail = () => {
            emlLink.textContent = fullE;
        };
        emlLink.addEventListener('mouseenter', revealEmail);
        emlLink.addEventListener('focus', revealEmail);
        emlLink.addEventListener('click', revealEmail);
        emlLink.addEventListener('touchstart', revealEmail, { passive: true });

        phnText.style.cursor = 'pointer';
        phnText.tabIndex = 0;
        phnText.setAttribute('role', 'button');
        phnText.setAttribute('aria-label', 'Reveal phone number');

        const revealPhone = () => {
            phnText.textContent = fullP;
        };
        phnText.addEventListener('click', revealPhone);
        phnText.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                revealPhone();
            }
        });

        // Fail-safe check
        if (!verifyContact()) {
            console.error("Contact data integrity check failed.");
            emlLink.textContent = "Contact Admin (Security Check Required)";
        }
    }

    // Visit Logging Tracking
    async function logVisit() {
        try {
            await fetch('/api/log_visit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    page: window.location.pathname,
                    referrer: document.referrer
                })
            });
        } catch (e) {
            // Silently fail if server is not reachable
        }
    }
    logVisit();

    // Section tabs
    const tabs = document.querySelectorAll('.tab');
    const sections = {
        research: document.getElementById('section-research'),
        teaching: document.getElementById('section-teaching')
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            Object.entries(sections).forEach(([key, el]) => {
                if (el) el.classList.toggle('active', key === tab.dataset.section);
            });
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

        function start() { if (rafId === null) rafId = requestAnimationFrame(step); }
        function stop() { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } }

        resize();
        start();
        window.addEventListener('resize', resize);
        document.addEventListener('visibilitychange', () => {
            document.hidden ? stop() : start();
        });
    }
});
