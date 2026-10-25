/* ==========================================================
   Cher Micole P. Lirio — Portfolio scripts
   ========================================================== */

/* ---------- Laundry system links ----------
   Paste the links here once they exist. Leave empty ('') to hide the button.
   A localhost link will NOT work for visitors, so use your online hosting link
   (for example from InfinityFree, like Sportzle).
*/
const LAUNDRY_LIVE_URL = '';   // e.g. 'https://your-laundry.infinityfreeapp.com/auth/login.php'
const LAUNDRY_CODE_URL = 'https://github.com/lcct-24-13152/laundry-system';

/* ---------- Laundry screenshots ----------
   Put images in assets/laundry/ with these names. Missing ones are skipped,
   and the whole gallery stays hidden until at least one exists.
*/
const LAUNDRY_SHOTS = [
  { name: 'login',       caption: 'Admin login' },
  { name: 'dashboard',   caption: 'Dashboard with sales and stock status' },
  { name: 'transaction', caption: 'Cashier screen for new transactions' },
  { name: 'receipt',     caption: 'Official receipt with tracking QR code' },
  { name: 'history',     caption: 'Transaction history and payment status' },
  { name: 'supplies',    caption: 'Supplies with low and critical stock alerts' },
  { name: 'types',       caption: 'Laundry types and pricing per load' },
  { name: 'loyalty',     caption: 'Loyalty discounts and customer points' }
].map(s => ({ ...s, file: `assets/laundry/${s.name}.jpg`, thumb: `assets/laundry/${s.name}-thumb.jpg` }));

/* ---------- Certificates ----------
   To add one, copy an entry and edit it.
   file:  the certificate (PDF, PNG or JPG) inside assets/certificates/
   thumb: a small preview image (optional)
   group: which heading it appears under
*/
const CERT_PATH = 'assets/certificates/';

const certificates = [
  { group: 'Cisco Networking Academy', title: 'HTML Essentials', issuer: 'DICT-ITU DTC Initiative through Cisco Networking Academy', date: 'Aug 11, 2026', file: 'html-essentials-certificate.pdf', thumb: 'html-essentials-certificate-thumb.jpg' },
  { group: 'Cisco Networking Academy', title: 'HTML Essentials, Statement of Achievement', issuer: 'Cisco Networking Academy and JS Institute', date: 'Aug 11, 2026', image: 'html-essentials-statement-of-achievement.jpg', thumb: 'html-essentials-statement-of-achievement-thumb.jpg' },
  { group: 'Cisco Networking Academy', title: 'Network Technician Career Path', issuer: 'Cisco Networking Academy', date: 'Apr 22, 2026', image: 'network-technician-career-path.jpg', thumb: 'network-technician-career-path-thumb.jpg' },
  { group: 'Cisco Networking Academy', title: 'Network Support and Security', issuer: 'Cisco Networking Academy', date: 'Apr 14, 2026', image: 'network-support-security.jpg', thumb: 'network-support-security-thumb.jpg' },
  { group: 'Cisco Networking Academy', title: 'Network Addressing and Basic Troubleshooting', issuer: 'Cisco Networking Academy', date: 'Apr 14, 2026', image: 'network-addressing-basic-troubleshooting.jpg', thumb: 'network-addressing-basic-troubleshooting-thumb.jpg' },
  { group: 'Cisco Networking Academy', title: 'Networking Devices and Initial Configuration', issuer: 'Cisco Networking Academy', date: 'Apr 8, 2026', image: 'networking-devices-initial-configuration.jpg', thumb: 'networking-devices-initial-configuration-thumb.jpg' },
  { group: 'Cisco Networking Academy', title: 'Networking Basics', issuer: 'Cisco Networking Academy', date: 'Apr 6, 2026', image: 'networking-basics.jpg', thumb: 'networking-basics-thumb.jpg' },
  { group: 'School and events', title: 'BSIT Educational Exposure Trip', issuer: 'Certificate of Participation, IT Week 2026, La Consolacion College of Tanauan', date: 'Mar 23, 2026', image: 'bsit-educational-exposure-trip.jpg', thumb: 'bsit-educational-exposure-trip-thumb.jpg' },
  { group: 'School and events', title: 'Bridging Business and Technology for the Next Generation', issuer: 'Certificate of Participation, IT Week 2026, La Consolacion College of Tanauan', date: 'Mar 21, 2026', image: 'bridging-business-technology-2026.jpg', thumb: 'bridging-business-technology-2026-thumb.jpg' },
  { group: 'School and events', title: 'Design, Build, Innovate: The Robotics Experience', issuer: 'Certificate of Participation, LCCT ICT Week 2026, First Eduspec Inc.', date: 'Mar 19, 2026', image: 'robotics-experience-2026.jpg', thumb: 'robotics-experience-2026-thumb.jpg' }
];

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function renderCertificates() {
  const list = document.getElementById('certList');
  if (!list) return;
  const groups = [...new Set(certificates.map(c => c.group))];

  list.innerHTML = groups.map(g => `
    <div class="cert-group" data-group="${escapeHtml(g)}">
      <h3>${escapeHtml(g)}</h3>
      <div class="cert-grid">${certificates.filter(c => c.group === g).map(c => `
        ${c.image
          ? `<button type="button" class="cert-card" data-cert="${certificates.indexOf(c)}">`
          : `<a class="cert-card" href="${CERT_PATH + c.file}" target="_blank" rel="noopener">`}
          <span class="cert-card__img"><img src="${CERT_PATH + c.thumb}" alt="" loading="lazy" onerror="this.remove()"><span class="cert-card__zoom">View</span></span>
          <span class="cert-card__body">
            <span class="cert-card__date">${escapeHtml(c.date)}</span>
            <span class="cert-card__title">${escapeHtml(c.title)}</span>
            <span class="cert-card__issuer">${escapeHtml(c.issuer)}</span>
          </span>
        ${c.image ? '</button>' : '</a>'}`).join('')}</div>
    </div>`).join('');

  document.getElementById('certCount').textContent = `${certificates.length} certificates from networking courses, IT Week seminars and school activities.`;
}

/* Hover preview of the certificate image (desktop only) */
function setupCertPreview() {
  const box = document.getElementById('certPreview');
  const img = box.querySelector('img');
  if (!window.matchMedia('(hover: hover)').matches) return;

  let current = null;
  img.addEventListener('error', () => box.classList.remove('is-on'));

  document.querySelectorAll('.cert-row').forEach((row) => {
    row.addEventListener('mouseenter', () => {
      current = row;
      img.onload = () => { if (current === row) box.classList.add('is-on'); };
      img.src = row.dataset.thumb;
    });
    row.addEventListener('mousemove', (e) => {
      const x = Math.min(e.clientX + 24, window.innerWidth - 280);
      const y = Math.min(e.clientY - 80, window.innerHeight - 220);
      box.style.transform = `translate(${x}px, ${Math.max(80, y)}px)`;
    });
    row.addEventListener('mouseleave', () => {
      current = null;
      box.classList.remove('is-on');
    });
  });
}

/* ---------- Laundry links ---------- */
function setupLaundry() {
  const live = document.getElementById('laundryLive');
  const code = document.getElementById('laundryCode');
  const isPublic = (u) => u && !/localhost|127\.0\.0\.1/.test(u);

  if (isPublic(LAUNDRY_LIVE_URL)) { live.href = LAUNDRY_LIVE_URL; live.hidden = false; }
  if (LAUNDRY_CODE_URL) { code.href = LAUNDRY_CODE_URL; code.hidden = false; }
}

/* ---------- Theme ---------- */
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
  const close = () => { nav.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ---------- Header border on scroll ---------- */
function setupHeader() {
  const header = document.querySelector('.header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Copy email ---------- */
function setupCopy() {
  const btn = document.getElementById('copyEmail');
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('liriocher25@gmail.com');
      btn.textContent = 'Email copied';
    } catch (e) {
      window.location.href = 'mailto:liriocher25@gmail.com';
    }
    setTimeout(() => { btn.textContent = 'Copy email'; }, 2000);
  });
}


/* ---------- Certificate tabs ---------- */
function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      const f = tab.dataset.filter;
      document.querySelectorAll('.cert-group').forEach((grp) => {
        const hide = f !== 'all' && grp.dataset.group !== f;
        grp.classList.toggle('is-hidden', hide);
        if (!hide) grp.querySelectorAll('.cert-card').forEach((r, i) => {
          r.style.animation = 'none'; void r.offsetWidth;
          r.style.animation = ''; r.style.animationDelay = (i * 40) + 'ms';
        });
      });
    });
  });
}

/* ---------- Scroll: progress bar, active nav pill, back-to-top ---------- */
function setupScrollUI() {
  const bar = document.getElementById('progress');
  const top = document.getElementById('toTop');
  const pill = document.getElementById('navPill');
  const links = [...document.querySelectorAll('.nav a')];
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  const movePill = (link) => {
    if (!link || link.classList.contains('nav__cta')) { pill.style.opacity = 0; return; }
    pill.style.opacity = 1;
    pill.style.width = link.offsetWidth + 'px';
    pill.style.transform = `translateX(${link.offsetLeft}px)`;
  };

  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    top.classList.toggle('is-on', scrollY > innerHeight * 0.8);

    let current = null;
    sections.forEach(s => { if (scrollY + 140 >= s.offsetTop) current = s.id; });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) current = 'contact';
    let activeLink = null;
    links.forEach(a => {
      const on = a.getAttribute('href') === '#' + current;
      a.classList.toggle('is-active', on);
      if (on) activeLink = a;
    });
    movePill(activeLink);
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* ---------- Reveal big blocks as they scroll in ---------- */
function setupReveal() {
  const els = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(el => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => io.observe(el));
}

/* ---------- Laundry ticket: status moves Received -> Ready ---------- */
function setupTicket() {
  const steps = [...document.querySelectorAll('#ticketSteps span')];
  const label = document.getElementById('ticketStatus');
  if (!steps.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let i = 2;
  setInterval(() => {
    i = (i + 1) % steps.length;
    steps.forEach((s, n) => {
      s.classList.toggle('done', n < i);
      s.classList.toggle('now', n === i);
    });
    label.textContent = 'Status: ' + steps[i].textContent;
  }, 1800);
}

/* ---------- Screenshot gallery + lightbox ---------- */
function setupShots() {
  const gallery = document.getElementById('screens');
  const box = document.getElementById('laundryShots');
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCap = document.getElementById('lightboxCap');
  const lbCount = document.getElementById('lightboxCount');
  const shots = [];
  let items = shots, current = 0, lastFocus = null;

  const show = (i) => {
    current = (i + items.length) % items.length;
    const s = items[current];
    lbImg.classList.remove('is-ready');
    lbImg.onload = () => lbImg.classList.add('is-ready');
    lbImg.src = s.file; lbImg.alt = s.caption;
    lbCap.textContent = s.caption;
    lbCount.textContent = (s.sub ? s.sub + '  ·  ' : '') + `${current + 1} of ${items.length}`;
  };
  const open = (i, list) => {
    items = list || shots;
    lastFocus = document.activeElement;
    show(i);
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    document.getElementById('lightboxClose').focus();
  };
  const close = () => {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { lb.hidden = true; }, 250);
    if (lastFocus) lastFocus.focus();
  };

  // Build in list order; skip any image that doesn't exist
  Promise.all(LAUNDRY_SHOTS.map(s => new Promise(res => {
    const img = new Image();
    img.onload = () => res(s); img.onerror = () => res(null);
    img.src = s.thumb;
  }))).then(found => {
    found.filter(Boolean).forEach((s) => {
      const i = shots.push(s) - 1;
      const btn = document.createElement('button');
      btn.className = 'shot';
      btn.style.setProperty('--d', (i * 60) + 'ms');
      btn.setAttribute('aria-label', 'View screenshot: ' + s.caption);
      btn.innerHTML = `<img src="${s.thumb}" alt="" loading="lazy"><span>${escapeHtml(s.caption)}</span>`;
      btn.addEventListener('click', () => open(i));
      box.appendChild(btn);
    });
    if (shots.length) {
      gallery.hidden = false;
      // Opened from the QR code: jump to the screenshots once they exist
      if (location.hash === '#screens') {
        gallery.classList.add('is-in');
        setTimeout(() => gallery.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
      }
    }
  });

  window.openLightbox = open;

  document.getElementById('lightboxClose').addEventListener('click', close);
  document.getElementById('lightboxPrev').addEventListener('click', () => show(current - 1));
  document.getElementById('lightboxNext').addEventListener('click', () => show(current + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  // swipe on phones
  let x0 = null;
  lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
  });
}

/* ---------- Resume: certificates list, preview, modal, print ---------- */
function renderResumeCerts() {
  const ul = document.getElementById('resumeCerts');
  if (!ul) return;
  ul.innerHTML = certificates.map(c => {
    const issuer = c.group === 'Cisco Networking Academy' ? c.issuer : c.issuer.replace(/^Certificate of Participation,\s*/, 'Participation, ');
    return `<li><span><b>${escapeHtml(c.title)}</b><small>${escapeHtml(issuer)}</small></span><time>${escapeHtml(c.date)}</time></li>`;
  }).join('');
}

function setupResume() {
  const modal = document.getElementById('resumeModal');
  const sheet = document.getElementById('resumeSheet');
  const scroller = modal.querySelector('.resume-modal__scroll');
  const thumb = document.getElementById('resumeThumb');
  let lastFocus = null;

  // Small live preview: a scaled copy of the real sheet
  const copy = sheet.cloneNode(true);
  copy.removeAttribute('id');
  copy.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
  copy.setAttribute('aria-hidden', 'true');
  thumb.appendChild(copy);
  const A4_PX = 793.7; // 210mm at 96dpi
  const fitThumb = () => { copy.style.transform = `scale(${thumb.clientWidth / A4_PX})`; };

  // Fit the sheet to small screens inside the modal
  const fitSheet = () => {
    const avail = scroller.clientWidth - 16;
    const z = Math.min(1, avail / 794);
    sheet.style.zoom = z < 1 ? z : '';
  };

  const open = () => {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    fitSheet();
    requestAnimationFrame(() => modal.classList.add('is-open'));
    document.getElementById('resumeClose').focus();
  };
  const close = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { modal.hidden = true; }, 250);
    if (lastFocus) lastFocus.focus();
  };
  const print = () => {
    document.documentElement.classList.add('print-resume');
    sheet.style.zoom = '';
    window.print();
  };

  document.querySelectorAll('[data-open-resume]').forEach(b => b.addEventListener('click', open));
  document.querySelectorAll('[data-print-resume]').forEach(b => b.addEventListener('click', print));
  document.getElementById('resumeClose').addEventListener('click', close);
  document.getElementById('resumeCancel').addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal || e.target === scroller) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });

  // Ctrl+P / browser print also prints the resume
  window.addEventListener('beforeprint', () => { document.documentElement.classList.add('print-resume'); sheet.style.zoom = ''; });
  window.addEventListener('afterprint', () => { document.documentElement.classList.remove('print-resume'); if (!modal.hidden) fitSheet(); });

  window.addEventListener('resize', () => { fitThumb(); if (!modal.hidden) fitSheet(); });
  fitThumb();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitThumb);
}

/* ---------- Certificates open in the lightbox ---------- */
function setupCertViewer() {
  const list = document.getElementById('certList');
  list.addEventListener('click', (e) => {
    const row = e.target.closest('button.cert-card');
    if (!row) return;
    const visible = [...list.querySelectorAll('.cert-group:not(.is-hidden) button.cert-card')];
    const slides = visible.map(r => {
      const c = certificates[+r.dataset.cert];
      return { file: CERT_PATH + c.image, caption: c.title, sub: c.date };
    });
    window.openLightbox(visible.indexOf(row), slides);
  });
}

/* ---------- Hero light that follows the pointer ---------- */
function setupHeroGlow() {
  const hero = document.getElementById('home');
  const glow = document.getElementById('heroGlow');
  if (!hero || !glow || !matchMedia('(hover: hover)').matches) return;
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    glow.style.setProperty('--x', (e.clientX - r.left) + 'px');
    glow.style.setProperty('--y', (e.clientY - r.top) + 'px');
    glow.classList.add('is-on');
  });
  hero.addEventListener('pointerleave', () => glow.classList.remove('is-on'));
}

/* ---------- Terminal that types when it scrolls into view ---------- */
function setupTerminal() {
  const term = document.getElementById('term');
  const body = document.getElementById('termBody');
  if (!term) return;
  const script = [
    ['cmd', 'whoami'],
    ['out', 'Cher Micole P. Lirio, BS Information Technology student'],
    ['cmd', 'skills --list'],
    ['out', 'HTML  CSS  JavaScript  PHP  MySQL  UI/UX  Database management'],
    ['cmd', 'ls projects/'],
    ['out', 'intel-sportzle/  cml-laundry-system/  portfolio/'],
    ['cmd', 'cat status.txt'],
    ['ok',  'Open to OJT and internships. Let\'s talk!']
  ];
  const render = (lines, partial) => {
    body.innerHTML = lines.map(([t, s]) => t === 'cmd'
      ? `<span class="t-p">$</span> <span class="t-c">${escapeHtml(s)}</span>`
      : `<span class="t-${t === 'ok' ? 'ok' : 'o'}">${escapeHtml(s)}</span>`).join('\n')
      + (partial !== undefined ? (lines.length ? '\n' : '') + `<span class="t-p">$</span> <span class="t-c">${escapeHtml(partial)}</span>` : '')
      + '<span class="t-cursor"></span>';
  };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) { render(script); return; }
  render([]);
  const run = async () => {
    const done = [];
    const wait = ms => new Promise(r => setTimeout(r, ms));
    for (const [t, s] of script) {
      if (t === 'cmd') {
        for (let i = 1; i <= s.length; i++) { render(done, s.slice(0, i)); await wait(45 + Math.random() * 40); }
        await wait(250);
      } else { await wait(200); }
      done.push([t, s]); render(done);
    }
  };
  const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { io.disconnect(); run(); } }, { threshold: .4 });
  io.observe(term);
}

document.addEventListener('DOMContentLoaded', () => {
  renderCertificates();
  renderResumeCerts();
  setupResume();
  setupCertPreview();
  setupLaundry();
  setupTheme();
  setupMenu();
  setupHeader();
  setupCopy();
  setupTabs();
  setupScrollUI();
  setupReveal();
  setupShots();
  setupCertViewer();
  setupHeroGlow();
  setupTerminal();
  document.getElementById('year').textContent = new Date().getFullYear();
});
