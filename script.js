/* ── Preloader (Mr. Three) ─────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 1500);
});

/* ── Theme Toggle (Sahil Bhatane) ──────────────────────────── */
const root       = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', savedTheme);

document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
});

/* ── Tile Grid Cursor (Sahil Bhatane style) ─────────────────── */
const tileCanvas    = document.getElementById('tileCanvas');
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

if (isTouchDevice) {
  // Disable canvas effect on touch/mobile — pointer:coarse means no precise cursor
  tileCanvas.style.display = 'none';
} else {
  const tileCtx  = tileCanvas.getContext('2d');
  const TILE     = 44;
  const MAX_ALPHA = 0.18;
  const FADE     = 0.016;
  const tiles    = new Map();

  function resizeTileCanvas() {
    tileCanvas.width  = window.innerWidth;
    tileCanvas.height = window.innerHeight;
  }
  resizeTileCanvas();
  window.addEventListener('resize', resizeTileCanvas, { passive: true });

  const NEIGHBORS = [
    [ 0,  0, 1.00],
    [-1,  0, 0.50], [ 1,  0, 0.50],
    [ 0, -1, 0.50], [ 0,  1, 0.50],
    [-1, -1, 0.25], [ 1, -1, 0.25],
    [-1,  1, 0.25], [ 1,  1, 0.25],
  ];

  document.addEventListener('mousemove', e => {
    const col = Math.floor(e.clientX / TILE);
    const row = Math.floor(e.clientY / TILE);
    NEIGHBORS.forEach(([dc, dr, strength]) => {
      const key = `${col + dc},${row + dr}`;
      tiles.set(key, Math.max(tiles.get(key) || 0, strength));
    });
  }, { passive: true });

  (function drawTiles() {
    tileCtx.clearRect(0, 0, tileCanvas.width, tileCanvas.height);
    for (const [key, val] of tiles) {
      const [c, r] = key.split(',').map(Number);
      tileCtx.fillStyle = `rgba(100,255,218,${(val * MAX_ALPHA).toFixed(4)})`;
      tileCtx.fillRect(c * TILE + 1, r * TILE + 1, TILE - 2, TILE - 2);
      const next = val - FADE;
      if (next <= 0) tiles.delete(key);
      else           tiles.set(key, next);
    }
    requestAnimationFrame(drawTiles);
  })();
}

/* ── Live Clock — PST (eHarshit) ───────────────────────────── */
const clockEl = document.getElementById('clockTime');

function updateClock() {
  const pst = new Intl.DateTimeFormat('en-US', {
    timeZone:  'America/Los_Angeles',
    hour:      '2-digit',
    minute:    '2-digit',
    second:    '2-digit',
    hour12:    true,
  }).format(new Date());
  if (clockEl) clockEl.textContent = pst + ' PST';
}

updateClock();
setInterval(updateClock, 1000);

/* ── Project Filters (Yamin Hossain) ───────────────────────── */
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      if (filter === 'all') {
        card.classList.remove('hidden');
      } else {
        const cats = (card.dataset.category || '').split(' ');
        card.classList.toggle('hidden', !cats.includes(filter));
      }
    });
  });
});

/* ── Konami Code Easter Egg (Brittany Chiang) ──────────────── */
const KONAMI = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a',
];
let konamiIdx = 0;

document.addEventListener('keydown', e => {
  if (e.key === KONAMI[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === KONAMI.length) {
      document.getElementById('easterEgg').classList.add('active');
      konamiIdx = 0;
    }
  } else {
    konamiIdx = e.key === KONAMI[0] ? 1 : 0;
  }
});

/* ── Typed text animation ──────────────────────────────────── */
const phrases = [
  'AI/ML Engineer',
  'Data Scientist',
  'Cloud Builder',
];

let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
const typedEl = document.getElementById('typedText');

function type() {
  const current = phrases[phraseIdx];
  typedEl.textContent = deleting
    ? current.slice(0, charIdx--)
    : current.slice(0, charIdx++);

  let delay = deleting ? 55 : 95;

  if (!deleting && charIdx > current.length) {
    delay    = 1900;
    deleting = true;
  } else if (deleting && charIdx < 0) {
    deleting  = false;
    charIdx   = 0;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    delay     = 400;
  }

  setTimeout(type, delay);
}

if (typedEl) type();

/* ── Sticky nav: add class on scroll ──────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNav();
}, { passive: true });

/* ── Active nav link highlight ────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNav() {
  const scrollY = window.scrollY + 80;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (!link) return;

    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

/* ── Mobile nav toggle ─────────────────────────────────────── */
const navToggle  = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
});

navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinksEl.classList.remove('open'));
});

/* ── Scroll-reveal (IntersectionObserver) ──────────────────── */
document.querySelectorAll(
  '.skill-card, .project-card, .timeline-item, .contact-item, ' +
  '.about-grid, .section-title, .section-subtitle, .section-label, ' +
  '.contact-form, .github-graph, .project-filters, .marquee-strip'
).forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Staggered reveal for grid children ────────────────────── */
document.querySelectorAll('.skills-grid, .projects-grid').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 80}ms`;
  });
});

/* ── Contact form (demo handler) ───────────────────────────── */
const contactForm = document.getElementById('contactForm');

if (contactForm) contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const btn      = contactForm.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = 'Sending…';
  btn.disabled    = true;

  setTimeout(() => {
    btn.textContent = '✓ Message Sent!';
    btn.style.background = '#22c55e';
    btn.style.color      = '#fff';
    contactForm.reset();

    setTimeout(() => {
      btn.textContent      = original;
      btn.style.background = '';
      btn.style.color      = '';
      btn.disabled         = false;
    }, 3000);
  }, 1200);
});

/* ── Smooth-scroll for all anchor links ────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
