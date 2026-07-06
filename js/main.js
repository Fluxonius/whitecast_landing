/* ============================================================
   WHITECAST — INTERACTIONS
   1. Hero particle energy field (wordmark attraction + mouse)
   2. Reveal-on-scroll (IntersectionObserver)
   3. Nav background on scroll
   4. 3D tilt cards (Why Whitecast)
   5. Agentic Layer scrollytelling
   ============================================================ */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  /* ============================================================
     1. HERO PARTICLES
     Particles are seeded from pixel-sampling the "WHITECAST"
     wordmark drawn on an offscreen canvas; each particle is
     attracted to its home point and repelled by the cursor.
     ============================================================ */
  const heroCanvas = document.getElementById('hero-canvas');

  if (heroCanvas && !prefersReducedMotion && !isMobile) {
    const ctx = heroCanvas.getContext('2d');
    let particles = [];
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    const MOUSE_RADIUS = 110;

    function sampleWordmark() {
      // Draw wordmark on an offscreen canvas and sample lit pixels
      const off = document.createElement('canvas');
      off.width = width;
      off.height = height;
      const octx = off.getContext('2d');

      const fontSize = Math.min(width * 0.105, 150);
      octx.font = `500 ${fontSize}px Nippo, sans-serif`;
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.fillStyle = '#fff';
      // Place the wordmark in the upper area, above the hero headline
      octx.fillText('WHITECAST', width / 2, height * 0.15);

      const data = octx.getImageData(0, 0, width, height).data;
      const gap = Math.max(3, Math.round(width / 340));
      const points = [];

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          if (data[(y * width + x) * 4 + 3] > 128) {
            points.push({ x, y });
          }
        }
      }
      return points;
    }

    function createParticles() {
      const targets = sampleWordmark();
      // Ambient particles drift freely; wordmark particles seek home
      const ambientCount = Math.round((width * height) / 9000);
      particles = [];

      for (const t of targets) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          hx: t.x,
          hy: t.y,
          vx: 0,
          vy: 0,
          size: Math.random() * 1.3 + 0.5,
          ambient: false,
          hue: Math.random() < 0.22 ? 'violet' : 'white',
        });
      }

      for (let i = 0; i < ambientCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          size: Math.random() * 1.1 + 0.3,
          ambient: true,
          hue: Math.random() < 0.3 ? 'violet' : 'white',
        });
      }
    }

    function resize() {
      const rect = heroCanvas.getBoundingClientRect();
      width = Math.round(rect.width);
      height = Math.round(rect.height);
      heroCanvas.width = width * dpr;
      heroCanvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles();
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        if (p.ambient) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        } else {
          // Spring toward home point on the wordmark
          p.vx += (p.hx - p.x) * 0.012;
          p.vy += (p.hy - p.y) * 0.012;
          p.vx *= 0.86;
          p.vy *= 0.86;
          p.x += p.vx;
          p.y += p.vy;
        }

        // Cursor repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_RADIUS && dist > 0.01) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          p.x += (dx / dist) * force * 6;
          p.y += (dy / dist) * force * 6;
        }

        const alpha = p.ambient ? 0.35 : 0.85;
        ctx.fillStyle =
          p.hue === 'violet'
            ? `rgba(168, 85, 247, ${alpha})`
            : `rgba(245, 245, 244, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(tick);
    }

    heroCanvas.parentElement.addEventListener('pointermove', (e) => {
      const rect = heroCanvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroCanvas.parentElement.addEventListener('pointerleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });

    // Wait for Nippo so the sampled wordmark uses the right glyphs
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        resize();
        tick();
      });
    } else {
      resize();
      tick();
    }
  }

  /* ============================================================
     2. REVEAL ON SCROLL
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('in-view'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ============================================================
     3. NAV BACKGROUND ON SCROLL
     ============================================================ */
  const nav = document.getElementById('nav');
  const onScrollNav = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ============================================================
     4. 3D TILT CARDS
     ============================================================ */
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      const MAX_TILT = 9;

      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;

        const rx = (0.5 - py) * MAX_TILT;
        const ry = (px - 0.5) * MAX_TILT;

        card.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
        card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ============================================================
     5. AGENTIC LAYER SCROLLYTELLING
     Highlights features + console lines as they scroll through
     the viewport, and drives the progress bar.
     ============================================================ */
  const features = Array.from(document.querySelectorAll('.agentic-feature'));
  const consoleLines = Array.from(document.querySelectorAll('.agent-line'));
  const progressFill = document.getElementById('agentic-progress-fill');
  const featureList = document.getElementById('agentic-features');

  function setActiveStep(step) {
    features.forEach((f) => f.classList.toggle('active', Number(f.dataset.step) === step));
    consoleLines.forEach((l) => l.classList.toggle('active', Number(l.dataset.step) <= step));
  }

  if (features.length && featureList) {
    if (prefersReducedMotion) {
      setActiveStep(features.length - 1);
      if (progressFill) progressFill.style.height = '100%';
    } else {
      const stepObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActiveStep(Number(entry.target.dataset.step));
            }
          }
        },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
      );
      features.forEach((f) => stepObserver.observe(f));

      const onScrollProgress = () => {
        if (!progressFill) return;
        const rect = featureList.getBoundingClientRect();
        const viewH = window.innerHeight;
        const total = rect.height + viewH * 0.2;
        const passed = Math.min(Math.max(viewH * 0.6 - rect.top, 0), total);
        progressFill.style.height = `${((passed / total) * 100).toFixed(1)}%`;
      };
      window.addEventListener('scroll', onScrollProgress, { passive: true });
      onScrollProgress();

      setActiveStep(0);
    }
  }
})();
