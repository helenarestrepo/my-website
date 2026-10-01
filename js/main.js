/* =========================================================
   Helena Restrepo · Portfolio interactions
   Everything here is progressive: the site still works
   (and reads fine) without JavaScript.
   ========================================================= */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Footer year ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  const navToggle = $('.nav-toggle');
  const navLinks = $('#nav-links');
  if (navToggle && navLinks) {
    const setOpen = (open) => {
      navToggle.setAttribute('aria-expanded', String(open));
      navLinks.classList.toggle('open', open);
    };
    navToggle.addEventListener('click', () => setOpen(navToggle.getAttribute('aria-expanded') !== 'true'));
    navLinks.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  /* ---------- Scroll reveal + stat counters ---------- */
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const format = (n) => prefix + n.toFixed(decimals) + suffix;
    if (reduceMotion) { el.textContent = format(target); return; }
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('in');
        const num = el.querySelector('[data-count]');
        if (num) animateCount(num);
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach((el, i) => {
      // small stagger for siblings that appear together
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    $$('.reveal').forEach((el) => el.classList.add('in'));
  }

  /* ---------- Draggable hero stickers ---------- */
  const heroArt = $('#hero-art');
  const stickers = $$('.sticker');
  const secret = $('#sticker-secret');
  const photo = $('.hero-photo');

  const overlaps = (a, b) => !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  const checkSecret = () => {
    if (!secret || !photo) return;
    const p = photo.getBoundingClientRect();
    const allOff = stickers.every((s) => !overlaps(s.getBoundingClientRect(), p));
    if (allOff && !secret.classList.contains('show')) {
      secret.textContent = "okay, you've officially reviewed my portfolio ✓";
      secret.classList.add('show');
      confetti({ count: 80 });
    }
  };

  const setPos = (el, x, y) => {
    el.dataset.x = x; el.dataset.y = y;
    el.style.setProperty('--x', x + 'px');
    el.style.setProperty('--y', y + 'px');
  };

  let zTop = 10;
  stickers.forEach((el) => {
    let startX = 0, startY = 0, baseX = 0, baseY = 0, moved = false;

    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      el.setPointerCapture(e.pointerId);
      el.classList.add('dragging');
      el.style.zIndex = ++zTop;
      startX = e.clientX; startY = e.clientY;
      baseX = parseFloat(el.dataset.x || 0); baseY = parseFloat(el.dataset.y || 0);
      moved = false;
    });
    el.addEventListener('pointermove', (e) => {
      if (!el.classList.contains('dragging')) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      setPos(el, baseX + dx, baseY + dy);
    });
    const end = () => {
      if (!el.classList.contains('dragging')) return;
      el.classList.remove('dragging');
      if (moved) { el.dataset.dragged = '1'; checkSecret(); }
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    // a drag shouldn't count as a click (keeps the ADDY easter egg honest)
    el.addEventListener('click', (e) => { if (moved) { e.stopImmediatePropagation(); moved = false; } }, true);

    // keyboard: arrow keys move the sticker
    el.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 40 : 12;
      const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
      if (!moves[e.key]) return;
      e.preventDefault();
      const [mx, my] = moves[e.key];
      setPos(el, parseFloat(el.dataset.x || 0) + mx, parseFloat(el.dataset.y || 0) + my);
      checkSecret();
    });
  });

  /* ---------- Project card tilt ---------- */
  if (finePointer && !reduceMotion) {
    $$('.card-btn').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        const max = card.closest('.card-feature') ? 4 : 8;
        card.classList.add('tilting');
        card.style.setProperty('--ty', (px * max) + 'deg');
        card.style.setProperty('--tx', (-py * max) + 'deg');
      });
      card.addEventListener('pointerleave', () => {
        card.classList.remove('tilting');
        card.style.setProperty('--tx', '0deg');
        card.style.setProperty('--ty', '0deg');
      });
    });
  }

  /* ---------- Case study modal ---------- */
  const modal = $('#case-modal');
  const modalContent = $('#modal-content');
  let lastTrigger = null;
  if (modal && typeof modal.showModal === 'function') {
    $$('[data-case]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tpl = document.getElementById(btn.dataset.case);
        if (!tpl) return;
        lastTrigger = btn;
        modalContent.replaceChildren(tpl.content.cloneNode(true));
        modal.showModal();
        document.body.classList.add('modal-open');
        modal.scrollTop = 0;
      });
    });
    $('.modal-close', modal).addEventListener('click', () => modal.close());
    // click on the dark backdrop closes it
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
    modal.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
      if (lastTrigger) lastTrigger.focus();
    });
  } else {
    // very old browsers: hide the "open" affordance
    $$('.card-open').forEach((el) => el.remove());
  }

  /* ---------- Experience timeline accordion ---------- */
  $$('.tl-head').forEach((btn) => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
  });

  /* ---------- Confetti (tiny, dependency-free) ---------- */
  const canvas = $('#confetti');
  const ctx = canvas && canvas.getContext('2d');
  let pieces = [];
  let running = false;
  const PALETTE = ['#FF7BAC', '#FF8A3D', '#FFD447', '#6BB8FF', '#3FAE74'];

  function resizeCanvas() {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function confetti({ count = 120, colors = PALETTE, rain = false } = {}) {
    if (!ctx || reduceMotion) return;
    resizeCanvas();
    for (let i = 0; i < count; i++) {
      pieces.push({
        x: rain ? Math.random() * innerWidth : innerWidth / 2 + (Math.random() - 0.5) * 200,
        y: rain ? -20 - Math.random() * innerHeight * 0.6 : innerHeight * 0.55,
        vx: rain ? (Math.random() - 0.5) * 2 : (Math.random() - 0.5) * 14,
        vy: rain ? 2 + Math.random() * 3 : -8 - Math.random() * 10,
        w: 6 + Math.random() * 8, h: 4 + Math.random() * 6,
        rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
        color: colors[(Math.random() * colors.length) | 0],
        life: 0
      });
    }
    if (!running) { running = true; requestAnimationFrame(draw); }
  }
  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    pieces.forEach((p) => {
      p.life++; p.vy += 0.25; p.vx *= 0.99;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    pieces = pieces.filter((p) => p.y < innerHeight + 40 && p.life < 600);
    if (pieces.length) requestAnimationFrame(draw);
    else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }

  /* ---------- Easter eggs ---------- */
  // 1) Click the ADDY sticker three times
  const addy = $('#addy-sticker');
  let addyClicks = 0, addyTimer;
  if (addy) addy.addEventListener('click', () => {
    addyClicks++;
    clearTimeout(addyTimer);
    addyTimer = setTimeout(() => (addyClicks = 0), 900);
    if (addyClicks >= 3) { addyClicks = 0; confetti({ count: 140, colors: ['#FFD447', '#F5B800', '#FFE48A', '#1E1A33'] }); }
  });

  // 2) Type "canes" (orange & green rain) or the Konami code (everything)
  const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let keys = [];
  document.addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('input, textarea, [contenteditable]')) return;
    keys.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
    keys = keys.slice(-10);
    if (keys.slice(-5).join('') === 'canes') {
      confetti({ count: 200, rain: true, colors: ['#F47321', '#005030', '#FF8A3D', '#3FAE74'] });
      keys = [];
    } else if (keys.join(',') === konami.join(',')) {
      confetti({ count: 260, rain: true });
      keys = [];
    }
  });

  // 3) A hello for the curious folks who open dev tools
  console.log('%cHi, curious one! 👋', 'font: 800 20px sans-serif; color:#FF7BAC');
  console.log("If you're poking around in here, we'd probably get along. helena.restrepo03@gmail.com");

  /* ---------- Custom cursor ring (desktop only) ---------- */
  const ring = $('#cursor-ring');
  if (ring && finePointer && !reduceMotion) {
    document.documentElement.classList.add('has-cursor');
    const label = ring.querySelector('span');
    let tx = -100, ty = -100, cx = -100, cy = -100;
    document.addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
      const t = e.target;
      const sticker = t.closest && t.closest('.sticker');
      const card = t.closest && t.closest('.card-btn');
      const interactive = t.closest && t.closest('a, button');
      ring.classList.toggle('label', !!(sticker || card));
      ring.classList.toggle('hover', !!interactive && !sticker && !card);
      label.textContent = sticker ? 'drag me!' : card ? 'open ✎' : '';
    });
    document.addEventListener('pointerleave', () => ring.classList.add('hidden'));
    document.addEventListener('pointerenter', () => ring.classList.remove('hidden'));
    const loop = () => {
      cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
      ring.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  window.addEventListener('resize', () => { if (running) resizeCanvas(); });
})();
