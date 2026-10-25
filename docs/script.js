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
  { file: 'assets/laundry/login.png',       caption: 'Admin login' },
  { file: 'assets/laundry/dashboard.png',   caption: 'Dashboard' },
  { file: 'assets/laundry/transaction.png', caption: 'Adding a transaction' },
  { file: 'assets/laundry/receipt.png',     caption: 'Receipt with QR code' },
  { file: 'assets/laundry/tracking.png',    caption: 'Customer tracking page' },
  { file: 'assets/laundry/inventory.png',   caption: 'Inventory and stock alerts' }
];

/* ---------- Certificates ----------
   To add one, copy an entry and edit it.
   file:  the certificate (PDF, PNG or JPG) inside assets/certificates/
   thumb: a small preview image (optional)
   group: which heading it appears under
*/
const CERT_PATH = 'assets/certificates/';

const certificates = [
  { group: 'Cisco Networking Academy', title: 'HTML Essentials', issuer: 'DICT-ITU DTC Initiative through Cisco Networking Academy', date: 'Aug 11, 2026', file: 'html-essentials-certificate.pdf', thumb: 'html-essentials-certificate-thumb.jpg' },
  { group: 'Cisco Networking Academy', title: 'HTML Essentials, Statement of Achievement', issuer: 'Cisco Networking Academy and JS Institute', date: 'Aug 11, 2026', file: 'html-essentials-statement-of-achievement.pdf', thumb: 'html-essentials-statement-of-achievement-thumb.jpg' },
  { group: 'Cisco Networking Academy', title: 'Network Technician Career Path Exam', issuer: 'Cisco Networking Academy', date: 'Apr 22, 2026', file: 'network-technician-career-path.pdf', thumb: 'network-technician-career-path-thumb.jpg' },
  { group: 'Cisco Networking Academy', title: 'Network Support and Security', issuer: 'Cisco Networking Academy', date: 'Apr 14, 2026', file: 'network-support-security.pdf', thumb: 'network-support-security-thumb.jpg' },
  { group: 'Cisco Networking Academy', title: 'Network Addressing and Basic Troubleshooting', issuer: 'Cisco Networking Academy', date: 'Apr 14, 2026', file: 'network-addressing-basic-troubleshooting.pdf', thumb: 'network-addressing-basic-troubleshooting-thumb.jpg' },
  { group: 'Cisco Networking Academy', title: 'Networking Devices and Initial Configuration', issuer: 'Cisco Networking Academy', date: 'Apr 8, 2026', file: 'networking-devices-initial-configuration.pdf', thumb: 'networking-devices-initial-configuration-thumb.jpg' },
  { group: 'Cisco Networking Academy', title: 'Networking Basics', issuer: 'Cisco Networking Academy', date: 'Apr 6, 2026', file: 'networking-basics.pdf', thumb: 'networking-basics-thumb.jpg' },
  { group: 'School and events', title: 'BSIT Educational Exposure Trip', issuer: 'Certificate of Participation, IT Week 2026, La Consolacion College of Tanauan', date: 'Mar 23, 2026', file: 'bsit-educational-exposure-trip.png', thumb: 'bsit-educational-exposure-trip-thumb.jpg' },
  { group: 'School and events', title: 'Bridging Business and Technology for the Next Generation', issuer: 'Certificate of Participation, IT Week 2026, La Consolacion College of Tanauan', date: 'Mar 21, 2026', file: 'bridging-business-technology-2026.svg', thumb: 'bridging-business-technology-2026.svg' },
  { group: 'School and events', title: 'Design, Build, Innovate: The Robotics Experience', issuer: 'Certificate of Participation, LCCT ICT Week 2026, First Edusped Inc.', date: 'Mar 19, 2026', file: 'robotics-experience-2026.jpg', thumb: 'robotics-experience-2026.jpg' }
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
      ${certificates.filter(c => c.group === g).map(c => `
        <a class="cert-row" href="${CERT_PATH + c.file}" target="_blank" rel="noopener"
           data-thumb="${CERT_PATH + c.thumb}">
          <span>
            <span class="cert-row__title">${escapeHtml(c.title)}</span><br>
            <span class="cert-row__issuer">${escapeHtml(c.issuer)}</span>
          </span>
          <span class="cert-row__date">${escapeHtml(c.date)}</span>
          <span class="cert-row__view">View</span>
        </a>`).join('')}
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
        if (!hide) grp.querySelectorAll('.cert-row').forEach((r, i) => {
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
  const box = document.getElementById('laundryShots');
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCap = document.getElementById('lightboxCap');
  let shown = 0;

  LAUNDRY_SHOTS.forEach((s) => {
    const img = new Image();
    img.onload = () => {
      const btn = document.createElement('button');
      btn.className = 'shot';
      btn.setAttribute('aria-label', 'View screenshot: ' + s.caption);
      btn.innerHTML = `<img src="${s.file}" alt="${escapeHtml(s.caption)}" loading="lazy"><span>${escapeHtml(s.caption)}</span>`;
      btn.addEventListener('click', () => {
        lbImg.src = s.file; lbImg.alt = s.caption; lbCap.textContent = s.caption;
        lb.hidden = false; requestAnimationFrame(() => lb.classList.add('is-open'));
        document.getElementById('lightboxClose').focus();
      });
      box.appendChild(btn);
      shown++; box.hidden = false;
    };
    img.src = s.file;
  });

  const close = () => { lb.classList.remove('is-open'); setTimeout(() => { lb.hidden = true; }, 250); };
  document.getElementById('lightboxClose').addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) close(); });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCertificates();
  setupCertPreview();
  setupLaundry();
  setupTheme();
  setupMenu();
  setupHeader();
  setupCopy();
  setupTabs();
  setupScrollUI();
  setupReveal();
  setupTicket();
  setupShots();
  document.getElementById('year').textContent = new Date().getFullYear();
});
