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

    // ── Solar system: click-for-info planet cards ──
    const solarSystem = document.querySelector('.solar-system');
    const heroElite = document.querySelector('.hero-elite');
    const planetCard = document.getElementById('planet-card');
    if (solarSystem && heroElite && planetCard) {
        const BODY_DATA = {
            sun: { name: 'The Sun', size: '109× Earth (1,392,700 km diameter)', year: '—', day: '~25–35 Earth days (rotates faster at equator)', fact: "The Sun holds 99.86% of the solar system's mass." },
            mercury: { name: 'Mercury', size: '0.38× Earth', year: '0.24 Earth years (88 days)', day: '58.6 Earth days', fact: 'A Mercury day is longer than its year.' },
            venus: { name: 'Venus', size: '0.95× Earth', year: '0.62 Earth years (225 days)', day: '243 Earth days (spins backwards)', fact: 'Venus rotates in the opposite direction to most planets.' },
            earth: { name: 'Earth', size: '1× (12,742 km)', year: '1 year (365.25 days)', day: '24 hours', fact: 'Earth is the only known planet with liquid water on its surface.' },
            mars: { name: 'Mars', size: '0.53× Earth', year: '1.88 Earth years (687 days)', day: '24.6 hours', fact: 'Mars hosts Olympus Mons — the tallest volcano in the solar system.' },
            jupiter: { name: 'Jupiter', size: '11.2× Earth', year: '11.86 Earth years', day: '9.9 hours (fastest spinner)', fact: "Jupiter's Great Red Spot is a storm bigger than Earth, raging for centuries." },
            saturn: { name: 'Saturn', size: '9.45× Earth', year: '29.45 Earth years', day: '10.7 hours', fact: 'Saturn is so light it would float in water.' }
        };

        const cardName = planetCard.querySelector('.planet-card-name');
        const cardSize = planetCard.querySelector('.planet-card-size');
        const cardYear = planetCard.querySelector('.planet-card-year');
        const cardDay = planetCard.querySelector('.planet-card-day');
        const cardFact = planetCard.querySelector('.planet-card-fact');
        const cardClose = planetCard.querySelector('.planet-card-close');

        const positionCard = (clientX, clientY) => {
            const heroRect = heroElite.getBoundingClientRect();
            const cardW = planetCard.offsetWidth || 220;
            const cardH = planetCard.offsetHeight || 100;
            let left = clientX - heroRect.left + 12;
            let top = clientY - heroRect.top + 12;
            left = Math.max(8, Math.min(left, heroRect.width - cardW - 8));
            top = Math.max(8, Math.min(top, heroRect.height - cardH - 8));
            planetCard.style.left = `${left}px`;
            planetCard.style.top = `${top}px`;
        };

        const openCard = (body, clientX, clientY) => {
            const data = BODY_DATA[body];
            if (!data) return;
            cardName.textContent = data.name;
            cardSize.textContent = data.size;
            cardYear.textContent = data.year;
            cardDay.textContent = data.day;
            cardFact.textContent = data.fact;
            planetCard.hidden = false;
            positionCard(clientX, clientY);
            solarSystem.classList.add('ss-paused');
        };

        const closeCard = () => {
            if (planetCard.hidden) return;
            planetCard.hidden = true;
            solarSystem.classList.remove('ss-paused');
        };

        document.querySelectorAll('.ss-planet, .ss-sun').forEach(body => {
            body.addEventListener('click', (e) => {
                e.stopPropagation();
                openCard(body.dataset.body, e.clientX, e.clientY);
            });
            body.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const rect = body.getBoundingClientRect();
                    openCard(body.dataset.body, rect.left + rect.width / 2, rect.top + rect.height / 2);
                }
            });
        });

        cardClose.addEventListener('click', closeCard);
        document.addEventListener('click', (e) => {
            if (!planetCard.hidden && !planetCard.contains(e.target)) closeCard();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeCard();
        });
    }
});
