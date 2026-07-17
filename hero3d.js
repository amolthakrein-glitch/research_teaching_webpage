// hero3d.js — WebGL particle-streamline hero (progressive enhancement over the 2D flow-field canvas)
// Self-contained ES module. Silently no-ops on any failure, leaving script.js's 2D fallback running.
(async () => {
    try {
        const reduceOK = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
        const pointerOK = window.matchMedia('(pointer: fine)').matches;
        const wideOK = window.innerWidth >= 900;
        if (!reduceOK || !pointerOK || !wideOK) return;

        // WebGL availability probe
        const probe = document.createElement('canvas');
        const gl = probe.getContext('webgl2') || probe.getContext('webgl');
        if (!gl) return;

        const hero = document.querySelector('.hero-elite');
        const oldCanvas = document.getElementById('flow-field');
        if (!hero) return;

        const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');

        const canvas = document.createElement('canvas');
        canvas.id = 'hero3d';
        canvas.setAttribute('aria-hidden', 'true');
        canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;';
        hero.insertBefore(canvas, hero.firstChild);

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        renderer.setPixelRatio(dpr);

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x020617, 0.045);

        const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
        camera.position.set(0, 0, 22);

        const COUNT = 8000;
        const positions = new Float32Array(COUNT * 3);
        const colors = new Float32Array(COUNT * 3);
        const velocities = new Float32Array(COUNT * 3);

        const cyan = new THREE.Color(0x22d3ee);
        const gold = new THREE.Color(0xf59e0b);
        const SPAN = 24;

        function seed(i) {
            positions[i * 3] = (Math.random() - 0.5) * SPAN;
            positions[i * 3 + 1] = (Math.random() - 0.5) * SPAN * 0.6;
            positions[i * 3 + 2] = (Math.random() - 0.5) * SPAN * 0.6;
        }
        for (let i = 0; i < COUNT; i++) {
            seed(i);
            const c = cyan.clone().lerp(gold, Math.random() * 0.35);
            colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // Curl-noise-ish pseudo vector field (no external noise lib; cheap trig lattice)
        function fieldVel(x, y, z, t, out) {
            const s = 0.09;
            out.x = Math.sin(y * s + t) * Math.cos(z * s - t * 0.7) + 0.15;
            out.y = Math.sin(z * s - t * 0.8) * Math.cos(x * s + t * 0.5);
            out.z = Math.sin(x * s + t * 0.6) * Math.cos(y * s - t * 0.4);
        }

        function resize() {
            const rect = hero.getBoundingClientRect();
            const w = Math.max(1, rect.width);
            const h = Math.max(1, rect.height);
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
        resize();
        window.addEventListener('resize', resize);

        // Pause conditions: tab hidden, hero off-screen, teaching tab active
        let heroVisible = true;
        let researchActive = true;
        let running = true;

        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => { heroVisible = e.isIntersecting; });
        }, { threshold: 0.05 });
        io.observe(hero);

        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                researchActive = tab.dataset.section === 'research';
            });
        });

        document.addEventListener('visibilitychange', () => {
            running = !document.hidden;
        });

        // Pointer parallax (lerped, subtle)
        let targetX = 0, targetY = 0, curX = 0, curY = 0;
        window.addEventListener('pointermove', (e) => {
            const rect = hero.getBoundingClientRect();
            targetX = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
            targetY = ((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1;
        });

        // Signal success + stop the 2D fallback
        window.__hero3d = true;
        if (oldCanvas) {
            oldCanvas.style.display = 'none';
            oldCanvas.dispatchEvent(new Event('hero3d:active'));
        }
        document.dispatchEvent(new CustomEvent('hero3d:active'));

        const tmp = { x: 0, y: 0, z: 0 };
        let rafId = null;
        const clock = new THREE.Clock();

        function tick() {
            rafId = requestAnimationFrame(tick);
            if (!running || !heroVisible || !researchActive) return;

            const t = clock.getElapsedTime() * 0.35;
            const pos = geometry.attributes.position.array;
            for (let i = 0; i < COUNT; i++) {
                const ix = i * 3, iy = ix + 1, iz = ix + 2;
                fieldVel(pos[ix], pos[iy], pos[iz], t, tmp);
                velocities[ix] += (tmp.x * 0.006 - velocities[ix]) * 0.08;
                velocities[iy] += (tmp.y * 0.006 - velocities[iy]) * 0.08;
                velocities[iz] += (tmp.z * 0.006 - velocities[iz]) * 0.08;
                pos[ix] += velocities[ix];
                pos[iy] += velocities[iy];
                pos[iz] += velocities[iz];

                if (Math.abs(pos[ix]) > SPAN / 2 || Math.abs(pos[iy]) > SPAN * 0.3 || Math.abs(pos[iz]) > SPAN * 0.3) {
                    seed(i);
                }
            }
            geometry.attributes.position.needsUpdate = true;

            // Camera parallax, max ~2deg, lerped
            curX += (targetX - curX) * 0.04;
            curY += (targetY - curY) * 0.04;
            const maxRad = (2 * Math.PI) / 180;
            camera.position.x = Math.sin(curX * maxRad) * 22;
            camera.position.y = Math.sin(-curY * maxRad) * 22 + 0.001;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        }
        tick();

        window.addEventListener('beforeunload', () => {
            if (rafId !== null) cancelAnimationFrame(rafId);
        });
    } catch (err) {
        // CDN unreachable, WebGL context creation failed, or any other error:
        // leave the 2D flow-field canvas as-is and bail silently.
        return;
    }
})();
