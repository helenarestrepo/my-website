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
      toggle.textContent = open ? 'close' : 'menu';
      links.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 860) setOpen(false); });
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

  /* ---------- Card carousels (arrow buttons) ---------- */
  $$('.carousel').forEach((carousel) => {
    const track = $('.carousel-track', carousel);
    const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 14 : 300);
    const behavior = reduceMotion ? 'auto' : 'smooth';
    $$('[data-dir]', carousel).forEach((btn) => {
      btn.addEventListener('click', () => track.scrollBy({ left: step() * Number(btn.dataset.dir), behavior }));
    });
  });

  /* ---------- Photography lightbox (big polaroid) ---------- */
  const lightbox = $('#lightbox');
  if (lightbox && typeof lightbox.showModal === 'function') {
    const items = $$('.slides .slide');
    const lbImg = $('img', lightbox);
    const lbPh = $('.ph', lightbox);
    const lbCap = $('.cap', lightbox);
    let index = 0;

    const show = (i) => {
      index = (i + items.length) % items.length;
      const img = $('img', items[index]);
      lbImg.classList.remove('missing');
      lbImg.src = img.getAttribute('src');
      lbImg.alt = img.alt;
      lbPh.dataset.label = $('.ph', items[index]).dataset.label;
      lbCap.textContent = $('.cap', items[index]).textContent;
    };

    items.forEach((btn, i) => btn.addEventListener('click', () => { show(i); lightbox.showModal(); }));
    $('.lb-close', lightbox).addEventListener('click', () => lightbox.close());
    $('.lb-prev', lightbox).addEventListener('click', () => show(index - 1));
    $('.lb-next', lightbox).addEventListener('click', () => show(index + 1));
    lightbox.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });
    lightbox.addEventListener('close', () => items[index] && items[index].focus());
  }

  /* ---------- About: flip book ---------- */
  const book = $('#book');
  if (book) {
    const holder = $('.book-pages', book);
    const pages = $$('.page', holder);
    const status = $('.book-status', book);
    const wide = window.matchMedia('(min-width: 900px)');
    let mode = '';
    let current = 0;       // single mode: page index
    let flipped = 0;       // spread mode: number of turned leaves
    let leaves = [];
    // with an odd page count the last leaf has no back, so stop with the back cover on the right
    const maxFlip = () => (pages.length % 2 ? leaves.length - 1 : leaves.length);

    const visiblePages = () => {
      if (mode === 'single') return [pages[current]];
      return flipped === 0 ? [pages[0]] : [pages[2 * flipped - 1], pages[2 * flipped]].filter(Boolean);
    };

    const render = (direction) => {
      if (mode === 'spread') {
        leaves.forEach((leaf, k) => {
          leaf.classList.toggle('flipped', k < flipped);
          leaf.style.zIndex = k < flipped ? k + 1 : leaves.length * 2 - k;
        });
        book.classList.toggle('closed', flipped === 0);
        book.classList.toggle('finished', flipped === leaves.length && pages.length % 2 === 0);
      } else {
        pages.forEach((pg, i) => {
          pg.classList.toggle('current', i === current);
          pg.classList.toggle('turning-back', i === current && direction < 0);
        });
      }
      const shown = visiblePages();
      pages.forEach((pg) => {
        const on = shown.includes(pg);
        pg.inert = !on;
        pg.setAttribute('aria-hidden', String(!on));
      });
      status.textContent = shown.map((pg) => pg.dataset.title).join(' · ');
      $('[data-book="prev"]', book).disabled = mode === 'spread' ? flipped === 0 : current === 0;
      $('[data-book="next"]', book).disabled = mode === 'spread' ? flipped >= maxFlip() : current === pages.length - 1;
    };

    const go = (dir) => {
      if (mode === 'spread') flipped = Math.max(0, Math.min(maxFlip(), flipped + dir));
      else current = Math.max(0, Math.min(pages.length - 1, current + dir));
      render(dir);
    };

    const goToPage = (i) => {
      if (mode === 'spread') flipped = Math.min(maxFlip(), i % 2 === 0 ? i / 2 : (i + 1) / 2);
      else current = i;
      render(1);
    };

    const setup = () => {
      const next = wide.matches ? 'spread' : 'single';
      if (next === mode) return;
      // remember roughly where the reader was
      const at = mode === 'spread' ? Math.max(0, 2 * flipped - 1) : current;
      // flatten back to the original page list
      pages.forEach((pg) => holder.appendChild(pg));
      leaves.forEach((leaf) => leaf.remove());
      leaves = [];
      book.classList.remove('spread', 'single', 'closed', 'finished');
      mode = next;
      book.classList.add(mode);
      if (mode === 'spread') {
        for (let k = 0; k < Math.ceil(pages.length / 2); k++) {
          const leaf = document.createElement('div');
          leaf.className = 'leaf';
          leaf.appendChild(pages[2 * k]);
          if (pages[2 * k + 1]) leaf.appendChild(pages[2 * k + 1]);
          holder.appendChild(leaf);
          leaves.push(leaf);
        }
      }
      goToPage(at);
    };

    $('[data-book="prev"]', book).addEventListener('click', () => go(-1));
    $('[data-book="next"]', book).addEventListener('click', () => go(1));
    $$('[data-goto]', book).forEach((btn) => btn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToPage(Number(btn.dataset.goto));
    }));

    // Click a page to turn it (right page = forward, left page = back)
    let swiped = false;
    holder.addEventListener('click', (e) => {
      if (swiped) { swiped = false; return; }
      if (e.target.closest('a, button')) return;
      const pg = e.target.closest('.page');
      if (!pg) return;
      if (mode === 'spread') go(pg === pages[2 * flipped] ? 1 : -1);
      else go(e.clientX > pg.getBoundingClientRect().left + pg.offsetWidth / 3 ? 1 : -1);
    });

    // Keyboard + swipe
    book.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    let startX = null;
    holder.addEventListener('pointerdown', (e) => { startX = e.clientX; });
    holder.addEventListener('pointerup', (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 50) { swiped = true; go(dx < 0 ? 1 : -1); }
    });

    wide.addEventListener('change', setup);
    setup();
  }

  /* ---------- Holographic cursor orb (desktop, motion allowed) ---------- */
  const orb = $('.cursor-orb');
  if (orb && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.documentElement.classList.add('has-orb');
    let tx = -100, ty = -100, x = -100, y = -100;
    document.addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
      orb.classList.toggle('hover', !!e.target.closest('a, button, .glass, .polaroid, summary'));
      orb.classList.remove('away');
    });
    document.addEventListener('pointerleave', () => orb.classList.add('away'));
    const follow = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      orb.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(follow);
    };
    follow();
  }

  /* ---------- Map: hold the plane mid-flight for reduced motion ---------- */
  if (reduceMotion) $$('svg.map').forEach((svg) => { if (svg.pauseAnimations) { svg.setCurrentTime(3.5); svg.pauseAnimations(); } });
})();
