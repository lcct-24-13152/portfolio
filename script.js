/* ==========================================================
   Cher Micole P. Lirio — Portfolio scripts
   ========================================================== */

/* ---------- Certificates ----------
   To add a new certificate, copy one object and edit it.
   file:  the full certificate (PDF, PNG or JPG) in assets/certificates/
   thumb: a small preview image (optional — a placeholder shows if missing)
   group: "cisco", "web" or "academic" (used by the filter buttons)
*/
const CERT_PATH = 'assets/certificates/';

const certificates = [
  {
    title: 'HTML Essentials',
    issuer: 'DICT-ITU DTC Initiative · Cisco Networking Academy',
    date: 'August 11, 2026',
    file: 'html-essentials-certificate.pdf',
    thumb: 'html-essentials-certificate-thumb.jpg',
    group: 'web'
  },
  {
    title: 'HTML Essentials — Statement of Achievement',
    issuer: 'Cisco Networking Academy · JS Institute',
    date: 'August 11, 2026',
    file: 'html-essentials-statement-of-achievement.pdf',
    thumb: 'html-essentials-statement-of-achievement-thumb.jpg',
    group: 'web'
  },
  {
    title: 'Network Technician Career Path Exam',
    issuer: 'Cisco Networking Academy',
    date: 'April 22, 2026',
    file: 'network-technician-career-path.pdf',
    thumb: 'network-technician-career-path-thumb.jpg',
    group: 'cisco'
  },
  {
    title: 'Network Support and Security',
    issuer: 'Cisco Networking Academy',
    date: 'April 14, 2026',
    file: 'network-support-security.pdf',
    thumb: 'network-support-security-thumb.jpg',
    group: 'cisco'
  },
  {
    title: 'Network Addressing and Basic Troubleshooting',
    issuer: 'Cisco Networking Academy',
    date: 'April 14, 2026',
    file: 'network-addressing-basic-troubleshooting.pdf',
    thumb: 'network-addressing-basic-troubleshooting-thumb.jpg',
    group: 'cisco'
  },
  {
    title: 'Networking Devices and Initial Configuration',
    issuer: 'Cisco Networking Academy',
    date: 'April 8, 2026',
    file: 'networking-devices-initial-configuration.pdf',
    thumb: 'networking-devices-initial-configuration-thumb.jpg',
    group: 'cisco'
  },
  {
    title: 'Networking Basics',
    issuer: 'Cisco Networking Academy',
    date: 'April 6, 2026',
    file: 'networking-basics.pdf',
    thumb: 'networking-basics-thumb.jpg',
    group: 'cisco'
  },
  {
    title: 'BSIT Educational Exposure Trip — Certificate of Participation',
    issuer: 'La Consolacion College of Tanauan · IT Week 2026',
    date: 'March 23, 2026',
    file: 'bsit-educational-exposure-trip.png',
    thumb: 'bsit-educational-exposure-trip-thumb.jpg',
    group: 'academic'
  },
  {
    // NEW — upload the certificate as assets/certificates/robotics-experience.jpg
    // (and optionally robotics-experience-thumb.jpg). Rename here if you use another name.
    title: 'Design, Build, Innovate: The Robotics Experience',
    issuer: 'Certificate of Participation',
    date: 'Robotics seminar',
    file: 'robotics-experience.jpg',
    thumb: 'robotics-experience-thumb.jpg',
    group: 'academic'
  }
];

function renderCertificates() {
  const grid = document.getElementById('certGrid');
  if (!grid) return;

  grid.innerHTML = certificates.map((c) => {
    const isPdf = c.file.toLowerCase().endsWith('.pdf');
    const initials = c.title.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('');
    return `
      <a class="cert reveal" data-group="${c.group}" href="${CERT_PATH + c.file}" target="_blank" rel="noopener">
        <div class="cert__thumb">
          <span class="cert__fallback" aria-hidden="true">${initials}</span>
          <img src="${CERT_PATH + c.thumb}" alt="${c.title} certificate" loading="lazy"
               onerror="this.remove()">
        </div>
        <div class="cert__body">
          <p class="cert__issuer">${c.issuer}</p>
          <h3 class="cert__title">${c.title}</h3>
          <p class="cert__date">${c.date}</p>
          <span class="cert__link">View ${isPdf ? 'certificate (PDF)' : 'certificate'} ↗</span>
        </div>
      </a>`;
  }).join('');
}

function setupFilters() {
  const buttons = document.querySelectorAll('.filter');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.cert').forEach((card) => {
        card.classList.toggle('is-hidden', f !== 'all' && card.dataset.group !== f);
      });
    });
  });
}

/* ---------- Theme toggle ---------- */
function setupTheme() {
  const btn = document.getElementById('themeToggle');
  const root = document.documentElement;
  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
}

/* ---------- Mobile menu ---------- */
function setupMenu() {
  const btn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  const close = () => {
    nav.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  };
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ---------- Header border + active link ---------- */
function setupScroll() {
  const header = document.querySelector('.header');
  const links = document.querySelectorAll('.nav a');
  const sections = [...links].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
    let current = null;
    sections.forEach(s => { if (window.scrollY + 120 >= s.offsetTop) current = s.id; });
    links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + current));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Reveal on scroll ---------- */
function setupReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => io.observe(el));
}

/* ---------- Contact form (opens the visitor's email app) ---------- */
function setupForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach((field) => {
      const valid = field.value.trim() !== '' && field.checkValidity();
      field.classList.toggle('is-invalid', !valid);
      if (!valid) ok = false;
    });
    if (!ok) {
      note.textContent = 'Please complete all fields with a valid email.';
      return;
    }
    const d = Object.fromEntries(new FormData(form));
    const body = `${d.message}\n\n— ${d.name} (${d.email})`;
    window.location.href =
      `mailto:liriocher25@gmail.com?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(body)}`;
    note.textContent = 'Opening your email app… Thank you for reaching out!';
    form.reset();
  });
}

/* ---------- Snake game ---------- */
function setupSnake() {
  const canvas = document.getElementById('snake');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('gScore');
  const bestEl = document.getElementById('gBest');
  const overlay = document.getElementById('gOverlay');
  const msg = document.getElementById('gMsg');
  const startBtn = document.getElementById('gStart');
  const restartBtn = document.getElementById('gRestart');

  const CELLS = 20;
  const SIZE = canvas.width / CELLS;
  const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

  let snake, dir, nextDir, food, score, timer, state = 'idle'; // idle | running | paused | over
  let ignoreScrollUntil = 0;
  let best = 0;
  try { best = Number(localStorage.getItem('snakeBest')) || 0; } catch (e) {}
  bestEl.textContent = best;

  const color = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  function reset() {
    snake = [[9, 10], [8, 10], [7, 10]];
    dir = nextDir = 'right';
    score = 0;
    scoreEl.textContent = 0;
    placeFood();
  }

  function placeFood() {
    do {
      food = [Math.floor(Math.random() * CELLS), Math.floor(Math.random() * CELLS)];
    } while (snake.some(([x, y]) => x === food[0] && y === food[1]));
  }

  function speed() { return Math.max(60, 130 - score * 3); }

  function showOverlay(text) { msg.textContent = text; overlay.classList.remove('is-hidden'); }
  function hideOverlay() { overlay.classList.add('is-hidden'); }

  function start() {
    if (state === 'running') { pause(); return; }
    if (state === 'idle' || state === 'over') reset();
    state = 'running';
    hideOverlay();
    startBtn.textContent = 'Pause';
    clearInterval(timer);
    timer = setInterval(step, speed());
    canvas.focus({ preventScroll: true });
    // Bring the board on screen (mainly for phones, where it sits below the buttons)
    const r = canvas.getBoundingClientRect();
    if (r.top < 70 || r.bottom > window.innerHeight) {
      ignoreScrollUntil = Date.now() + 1200;
      canvas.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function pause() {
    state = 'paused';
    clearInterval(timer);
    startBtn.textContent = 'Resume';
    showOverlay('Paused');
  }

  function gameOver() {
    state = 'over';
    clearInterval(timer);
    startBtn.textContent = 'Play again';
    if (score > best) {
      best = score;
      bestEl.textContent = best;
      try { localStorage.setItem('snakeBest', best); } catch (e) {}
      showOverlay(`New best: ${score}!`);
    } else {
      showOverlay(`Game over · Score ${score}`);
    }
  }

  function step() {
    dir = nextDir;
    const [dx, dy] = DIRS[dir];
    const head = [snake[0][0] + dx, snake[0][1] + dy];
    const hitsWall = head[0] < 0 || head[1] < 0 || head[0] >= CELLS || head[1] >= CELLS;
    const hitsSelf = snake.some(([x, y]) => x === head[0] && y === head[1]);
    if (hitsWall || hitsSelf) { gameOver(); draw(); return; }

    snake.unshift(head);
    if (head[0] === food[0] && head[1] === food[1]) {
      score++;
      scoreEl.textContent = score;
      placeFood();
      clearInterval(timer);
      timer = setInterval(step, speed());
    } else {
      snake.pop();
    }
    draw();
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.fill();
  }

  function draw() {
    ctx.fillStyle = color('--surface');
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // subtle dot grid
    ctx.fillStyle = color('--line');
    for (let x = 0; x < CELLS; x++) {
      for (let y = 0; y < CELLS; y++) {
        ctx.fillRect(x * SIZE + SIZE / 2 - 1, y * SIZE + SIZE / 2 - 1, 2, 2);
      }
    }

    // food
    ctx.fillStyle = color('--accent');
    ctx.beginPath();
    ctx.arc(food[0] * SIZE + SIZE / 2, food[1] * SIZE + SIZE / 2, SIZE / 3, 0, Math.PI * 2);
    ctx.fill();

    // snake
    snake.forEach(([x, y], i) => {
      ctx.fillStyle = i === 0 ? color('--accent') : color('--text');
      ctx.globalAlpha = i === 0 ? 1 : Math.max(0.35, 0.9 - i * 0.02);
      roundRect(x * SIZE + 2, y * SIZE + 2, SIZE - 4, SIZE - 4, 5);
    });
    ctx.globalAlpha = 1;
  }

  function turn(newDir) {
    const opposite = { up: 'down', down: 'up', left: 'right', right: 'left' };
    if (state !== 'running') return;
    if (newDir !== opposite[dir]) nextDir = newDir;
  }

  // Keyboard: only captured while the game is running, so normal page scrolling still works
  const KEYS = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right'
  };
  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    if (e.key === ' ' && (state === 'running' || state === 'paused' || document.activeElement === canvas)) {
      e.preventDefault();
      start();
      return;
    }
    if (state === 'running' && KEYS[e.key]) {
      e.preventDefault();
      turn(KEYS[e.key]);
    }
  });

  // Touch: swipe on the board
  let touchStart = null;
  canvas.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    touchStart = [t.clientX, t.clientY];
  }, { passive: true });
  canvas.addEventListener('touchend', (e) => {
    if (!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart[0];
    const dy = t.clientY - touchStart[1];
    touchStart = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) {
      if (state !== 'running') start();
      return;
    }
    turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  });

  // On-screen buttons
  document.querySelectorAll('.dpad button').forEach((b) => {
    b.addEventListener('click', () => {
      if (state !== 'running') start();
      turn(b.dataset.dir);
    });
  });

  startBtn.addEventListener('click', start);
  restartBtn.addEventListener('click', () => { state = 'idle'; start(); });
  overlay.addEventListener('click', () => { if (state !== 'running') start(); });

  // Pause automatically when the game scrolls out of view or the tab is hidden
  document.addEventListener('visibilitychange', () => { if (document.hidden && state === 'running') pause(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && state === 'running' && Date.now() > ignoreScrollUntil) pause();
    }, { threshold: 0.1 }).observe(canvas);
  }

  // Redraw when the theme changes so colors match light/dark mode
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  reset();
  draw();
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderCertificates();
  setupFilters();
  setupTheme();
  setupMenu();
  setupScroll();
  setupReveal();
  setupForm();
  setupSnake();
  document.getElementById('year').textContent = new Date().getFullYear();
});
