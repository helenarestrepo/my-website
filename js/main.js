/* =========================================================
   Helena Restrepo · Portfolio
   Small, progressive enhancements. Every page works
   without JavaScript.
   ========================================================= */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Mobile menu ---------- */
  const toggle = $('.nav-toggle');
  const links = $('#nav-links');
  if (toggle && links) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      links.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 820) setOpen(false); });
  }

  /* ---------- Scroll reveal + number counters ---------- */
  const countUp = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const format = (n) => prefix + n.toFixed(decimals) + suffix;
    if (reduceMotion) return (el.textContent = format(target));
    const start = performance.now();
    const duration = 1400;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = format(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        $$('[data-count]', entry.target).forEach(countUp);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach((el) => io.observe(el));
  } else {
    $$('.reveal').forEach((el) => el.classList.add('in'));
  }

  /* ---------- Photography lightbox ---------- */
  const lightbox = $('#lightbox');
  if (lightbox && typeof lightbox.showModal === 'function') {
    const buttons = $$('.photo-btn');
    const lbImg = $('img', lightbox);
    const lbPh = $('.ph', lightbox);
    const lbCap = $('figcaption', lightbox);
    let index = 0;

    const show = (i) => {
      index = (i + buttons.length) % buttons.length;
      const img = $('img', buttons[index]);
      const cap = buttons[index].closest('figure').querySelector('figcaption');
      lbImg.classList.remove('missing');
      lbImg.src = img.getAttribute('src');
      lbImg.alt = img.alt;
      lbPh.dataset.label = buttons[index].querySelector('.ph').dataset.label;
      lbCap.textContent = cap ? cap.textContent : '';
    };

    buttons.forEach((btn, i) => btn.addEventListener('click', () => {
      show(i);
      lightbox.showModal();
    }));
    $('.lb-close', lightbox).addEventListener('click', () => lightbox.close());
    $('.lb-prev', lightbox).addEventListener('click', () => show(index - 1));
    $('.lb-next', lightbox).addEventListener('click', () => show(index + 1));
    lightbox.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });
    lightbox.addEventListener('close', () => buttons[index] && buttons[index].focus());
  }
})();
