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
