/* ============================================================
   WHITE PREDICT — INTERACTIONS
   (Hero network field lives in js/hero-network.js)
   1. Reveal-on-scroll (IntersectionObserver)
   2. Nav background on scroll
   3. 3D tilt cards
   4. Agentic Layer scrollytelling
   ============================================================ */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     1. REVEAL ON SCROLL
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
     2. NAV BACKGROUND ON SCROLL
     ============================================================ */
  const nav = document.getElementById('nav');
  const onScrollNav = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ============================================================
     3. 3D TILT CARDS
     ============================================================ */
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      const MAX_TILT = 8;
      const LIFT = -4;
      const EASE = 0.1;
      const target = { rx: 0, ry: 0, lift: 0 };
      const current = { rx: 0, ry: 0, lift: 0 };
      let rafId = null;
      let hovering = false;

      const animate = () => {
        current.rx += (target.rx - current.rx) * EASE;
        current.ry += (target.ry - current.ry) * EASE;
        current.lift += (target.lift - current.lift) * EASE;

        const settled =
          Math.abs(target.rx - current.rx) < 0.04 &&
          Math.abs(target.ry - current.ry) < 0.04 &&
          Math.abs(target.lift - current.lift) < 0.04;

        if (settled && !hovering) {
          card.style.transform = '';
          rafId = null;
          return;
        }

        card.style.transform =
          `rotateX(${current.rx.toFixed(2)}deg) rotateY(${current.ry.toFixed(2)}deg) translateY(${current.lift.toFixed(2)}px)`;
        rafId = requestAnimationFrame(animate);
      };

      const start = () => {
        if (!rafId) rafId = requestAnimationFrame(animate);
      };

      card.addEventListener('pointerenter', () => {
        hovering = true;
        start();
      });

      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        target.rx = (0.5 - py) * MAX_TILT;
        target.ry = (px - 0.5) * MAX_TILT;
        target.lift = LIFT;
        start();
      });

      card.addEventListener('pointerleave', () => {
        hovering = false;
        target.rx = 0;
        target.ry = 0;
        target.lift = 0;
        start();
      });
    });
  }

  /* ============================================================
     4. AGENTIC LAYER SCROLLYTELLING
     Pick the feature whose center is closest to a fixed viewport
     marker so steps never skip while scrolling.
     ============================================================ */
  const features = Array.from(document.querySelectorAll('.agentic-feature'));
  const panels = Array.from(document.querySelectorAll('.agent-panel'));
  const modalTitle = document.getElementById('agent-modal-title');
  const inputAttach = document.getElementById('agent-input-attach');
  const progressFill = document.getElementById('agentic-progress-fill');
  const featureList = document.getElementById('agentic-features');

  function setActiveStep(step) {
    features.forEach((f) => f.classList.toggle('active', Number(f.dataset.step) === step));
    panels.forEach((p) => {
      const isActive = Number(p.dataset.step) === step;
      p.classList.toggle('active', isActive);
      p.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    const activePanel = panels.find((p) => Number(p.dataset.step) === step);
    if (activePanel && modalTitle) {
      modalTitle.textContent = activePanel.dataset.title || 'New White Predict chat';
    }
    if (inputAttach) {
      inputAttach.hidden = step !== 5;
    }
  }

  if (features.length && featureList) {
    if (prefersReducedMotion) {
      setActiveStep(features.length - 1);
      if (progressFill) progressFill.style.height = '100%';
    } else {
      const marker = () => window.innerHeight * 0.42;

      const updateActiveStep = () => {
        let activeStep = 0;
        let bestDistance = Infinity;

        for (const feature of features) {
          const rect = feature.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const distance = Math.abs(center - marker());
          if (distance < bestDistance) {
            bestDistance = distance;
            activeStep = Number(feature.dataset.step);
          }
        }

        setActiveStep(activeStep);
      };

      const onScrollProgress = () => {
        updateActiveStep();
        if (!progressFill) return;
        const rect = featureList.getBoundingClientRect();
        const viewH = window.innerHeight;
        const total = rect.height + viewH * 0.2;
        const passed = Math.min(Math.max(viewH * 0.6 - rect.top, 0), total);
        progressFill.style.height = `${((passed / total) * 100).toFixed(1)}%`;
      };

      window.addEventListener('scroll', onScrollProgress, { passive: true });
      window.addEventListener('resize', onScrollProgress, { passive: true });
      onScrollProgress();
    }
  }
})();
