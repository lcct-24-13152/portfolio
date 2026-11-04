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

const CERT_PATH = 'assets/certificates/';

const certificates = [
  { group: 'Cisco Networking Academy', title: 'HTML Essentials', issuer: 'DICT-ITU DTC Initiative through Cisco Networking Academy', date: 'Aug 11, 2026', image: 'html-essentials-certificate.jpg', thumb: 'html-essentials-certificate-thumb.jpg' },
  { group: 'Cisco Networking Academy', title: 'HTML Essentials, Statement of Achievement', issuer: 'Cisco Networking Academy and JS Institute', date: 'Aug 11, 2026', image: 'html-essentials-statement-of-achievement.jpg', thumb: 'html-essentials-statement-of-achievement-thumb.jpg' },
  { group: 'Cisco Networking Academy', title: 'Network Technician Career Path', issuer: 'Cisco Networking Academy', date: 'Apr 22, 2026', image: 'network-technician-career-path.jpg', thumb: 'network-technician-career-path-thumb.jpg' },
  { group: 'Cisco Networking Academy', title: 'Network Support and Security', issuer: 'Cisco Networking Academy', date: 'Apr 14, 2026', image: 'network-support-security.jpg', thumb: 'network-support-security-thumb.jpg' },
  { group: 'Cisco Networking Academy', title: 'Network Addressing and Basic Troubleshooting', issuer: 'Cisco Networking Academy', date: 'Apr 14, 2026', image: 'network-addressing-basic-troubleshooting.jpg', thumb: 'network-addressing-basic-troubleshooting-thumb.jpg' },
  { group: 'Cisco Networking Academy', title: 'Networking Devices and Initial Configuration', issuer: 'Cisco Networking Academy', date: 'Apr 8, 2026', image: 'networking-devices-initial-configuration.jpg', thumb: 'networking-devices-initial-configuration-thumb.jpg' },
  { group: 'Cisco Networking Academy', title: 'Networking Basics', issuer: 'Cisco Networking Academy', date: 'Apr 6, 2026', image: 'networking-basics.jpg', thumb: 'networking-basics-thumb.jpg' },
  { group: 'School and events', title: 'BSIT Educational Exposure Trip', issuer: 'Certificate of Participation, IT Week 2026, La Consolacion College Tanauan', date: 'Mar 23, 2026', image: 'bsit-educational-exposure-trip.jpg', thumb: 'bsit-educational-exposure-trip-thumb.jpg' },
  { group: 'School and events', title: 'Bridging Business and Technology for the Next Generation', issuer: 'Certificate of Participation, IT Week 2026, La Consolacion College Tanauan', date: 'Mar 21, 2026', image: 'bridging-business-technology-2026.jpg', thumb: 'bridging-business-technology-2026-thumb.jpg' },
  { group: 'School and events', title: 'Design, Build, Innovate: The Robotics Experience', issuer: 'Certificate of Participation, LCCT ICT Week 2026, First Eduspec Inc.', date: 'Mar 19, 2026', image: 'robotics-experience-2026.jpg', thumb: 'robotics-experience-2026-thumb.jpg' }
];

/* ==========================================================
   MicoleOS — Cher Micole P. Lirio
   ========================================================== */
const LAUNDRY_LIVE_URL = '';   // paste the hosted link when it's online
const LAUNDRY_CODE_URL = 'https://github.com/lcct-24-13152/laundry-system';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const isPhone = () => matchMedia('(max-width: 760px)').matches;
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function escapeHtml(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

/* ---------- Clock ---------- */
function setupClock() {
  const el = $('#clock');
  const tick = () => {
    const d = new Date();
    el.textContent = d.toLocaleDateString('en-US', { weekday: 'short' }) + ' ' +
      d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    el.dateTime = d.toISOString();
  };
  tick(); setInterval(tick, 15000);
}

/* ---------- Boot screen ---------- */
function boot(done) {
  const el = $('#boot');
  let seen = false;
  try { seen = sessionStorage.getItem('micoleos-booted') === '1'; } catch (e) {}
  if (seen || reduceMotion()) { el.remove(); done(); return; }

  const log = $('#bootLog'), bar = $('#bootBar');
  const lines = [
    'Loading profile: Cher Micole P. Lirio',
    'Mounting ~/projects (4 systems)',
    'Verifying certificates (10)',
    'Preparing resume.pdf',
    'Starting desktop'
  ];
  let i = 0, finished = false;
  const finish = () => {
    if (finished) return; finished = true;
    try { sessionStorage.setItem('micoleos-booted', '1'); } catch (e) {}
    el.classList.add('is-done');
    setTimeout(() => el.remove(), 550);
    done();
  };
  const step = () => {
    if (finished) return;
    if (i < lines.length) {
      log.innerHTML += `<b>[ OK ]</b> ${escapeHtml(lines[i])}\n`;
      i++; bar.style.width = (i / lines.length * 100) + '%';
      setTimeout(step, 330);
    } else setTimeout(finish, 350);
  };
  el.addEventListener('click', finish);
  window.addEventListener('keydown', finish, { once: true });
  setTimeout(step, 300);
}

/* ==========================================================
   Window manager
   ========================================================== */
const SIZES = {
  about:        { w: 780,  h: 600 },
  projects:     { w: 1040, h: 680 },
  certificates: { w: 960,  h: 640 },
  resume:       { w: 880,  h: 760 },
  terminal:     { w: 720,  h: 470 },
  contact:      { w: 820,  h: 560 }
};
const WM = { z: 100, opened: 0, hooks: {} };

function placeWindow(win) {
  const app = win.dataset.app, s = SIZES[app] || { w: 760, h: 560 };
  const vw = innerWidth, vh = innerHeight, top0 = 32, bottom = 92;
  // free area between the desktop icons (left) and the profile widget (right)
  let x0 = 130, x1 = vw - 384;
  if (x1 - x0 < Math.min(s.w, 720)) { x0 = 12; x1 = vw - 12; }
  const w = Math.min(s.w, x1 - x0 - 16), h = Math.min(s.h, vh - top0 - bottom - 16);
  const off = (WM.opened % 5) * 26 - 26;
  const left = Math.max(12, Math.min(vw - w - 12, x0 + (x1 - x0 - w) / 2 + off));
  const top = Math.max(top0 + 8, Math.min(vh - bottom - h, top0 + (vh - top0 - bottom - h) / 2 + off));
  Object.assign(win.style, { width: w + 'px', height: h + 'px', left: left + 'px', top: top + 'px' });
  win.dataset.placed = '1';
  WM.opened++;
}

function focusWin(win) {
  win.style.zIndex = ++WM.z;
  $$('.win').forEach(w => w.classList.toggle('is-active', w === win));
  $('#activeApp').textContent = win.dataset.title;
}

function topWindow() {
  return $$('.win:not([hidden])').filter(w => !w.classList.contains('is-closing') && !w.classList.contains('is-minimizing'))
    .sort((a, b) => (+b.style.zIndex || 0) - (+a.style.zIndex || 0))[0];
}

function setHash(id) {
  try { history.replaceState(null, '', id ? '#' + id : location.pathname + location.search); } catch (e) {}
}

function openApp(id, from) {
  const win = $('#win-' + id);
  if (!win) return;
  if (win.hidden) {
    if (!win.dataset.placed && !isPhone()) placeWindow(win);
    win.hidden = false;
    if (from && !isPhone()) {
      const r = from.getBoundingClientRect(), wr = win.getBoundingClientRect();
      win.style.setProperty('--ox', (r.left + r.width / 2 - wr.left) + 'px');
      win.style.setProperty('--oy', (r.top + r.height / 2 - wr.top) + 'px');
    } else { win.style.setProperty('--ox', '50%'); win.style.setProperty('--oy', '50%'); }
    win.classList.remove('is-closing', 'is-minimizing');
    win.classList.add('is-opening');
    const onIn = (e) => { if (e.target !== win) return; win.classList.remove('is-opening'); win.removeEventListener('animationend', onIn); };
    win.addEventListener('animationend', onIn);
  }
  focusWin(win);
  $$(`[data-dock="${id}"]`).forEach(b => b.classList.add('is-running'));
  if (isPhone()) document.body.classList.add('app-open');
  setHash(id);
  (WM.hooks[id] || []).forEach(fn => fn());
}

function closeWin(win, minimize) {
  const id = win.dataset.app;
  if (minimize && !isPhone()) {
    const dockBtn = $(`.dock [data-dock="${id}"]`), wr = win.getBoundingClientRect();
    if (dockBtn) {
      const r = dockBtn.getBoundingClientRect();
      win.style.setProperty('--mx', (r.left + r.width / 2 - (wr.left + wr.width / 2)) + 'px');
      win.style.setProperty('--my', (r.top - (wr.top + wr.height / 2)) + 'px');
    }
    win.classList.add('is-minimizing');
  } else {
    win.classList.add('is-closing');
    $$(`[data-dock="${id}"]`).forEach(b => b.classList.remove('is-running'));
  }
  const end = () => {
    win.hidden = true;
    win.classList.remove('is-closing', 'is-minimizing', 'is-active');
    const next = topWindow();
    if (next) { focusWin(next); setHash(next.dataset.app); }
    else { $('#activeApp').textContent = 'Desktop'; setHash(''); document.body.classList.remove('app-open'); }
  };
  const onEnd = (e) => { if (e.target !== win) return; win.removeEventListener('animationend', onEnd); end(); };
  if (reduceMotion()) end(); else { win.addEventListener('animationend', onEnd); setTimeout(() => { if (!win.hidden && (win.classList.contains('is-closing') || win.classList.contains('is-minimizing'))) { win.removeEventListener('animationend', onEnd); end(); } }, 600); }
}

function setupWindows() {
  // openers
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) { e.preventDefault(); openApp(opener.dataset.open, opener); }
  });

  $$('.win').forEach((win) => {
    win.addEventListener('pointerdown', () => { if (!win.classList.contains('is-active')) focusWin(win); });
    $$('[data-act]', win).forEach(btn => btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const act = btn.dataset.act;
      if (act === 'close') closeWin(win, false);
      if (act === 'min') closeWin(win, true);
      if (act === 'max') { win.classList.toggle('is-max'); WM.hooks._resize?.(); }
    }));

    // drag by the title bar
    const bar = $('.win__bar', win);
    let drag = null;
    bar.addEventListener('pointerdown', (e) => {
      if (isPhone() || e.button !== 0 || e.target.closest('button') || win.classList.contains('is-max')) return;
      drag = { x: e.clientX, y: e.clientY, l: win.offsetLeft, t: win.offsetTop };
      bar.setPointerCapture(e.pointerId);
      win.classList.add('is-dragging');
    });
    bar.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const l = Math.max(-win.offsetWidth + 140, Math.min(innerWidth - 140, drag.l + e.clientX - drag.x));
      const t = Math.max(32, Math.min(innerHeight - 60, drag.t + e.clientY - drag.y));
      win.style.left = l + 'px'; win.style.top = t + 'px';
    });
    const stop = () => { drag = null; win.classList.remove('is-dragging'); };
    bar.addEventListener('pointerup', stop);
    bar.addEventListener('pointercancel', stop);
    bar.addEventListener('dblclick', (e) => { if (!e.target.closest('button') && !isPhone()) win.classList.toggle('is-max'); });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!$('#certModal').hidden || !$('#lightbox').hidden) return;
    const w = topWindow();
    if (w) closeWin(w, false);
  });
}

/* ---------- Hash links (QR code opens #screens) ---------- */
function openFromHash() {
  const h = location.hash.replace('#', '');
  const alias = { work: 'projects', skills: 'about', certs: 'certificates' };
  if (h === 'screens') { openApp('projects'); selectProject('laundry'); setTimeout(jumpToScreens, 350); return true; }
  const id = alias[h] || h;
  if (id && $('#win-' + id)) { openApp(id); return true; }
  return false;
}

/* ---------- Profile widget: rotating role ---------- */
function setupRole() {
  const el = $('#roleText');
  if (!el || reduceMotion()) return;
  const roles = ['Web Developer', 'System Developer', 'Database Designer', 'UI/UX Enthusiast', 'Future IT Professional'];
  let r = 0, i = roles[0].length, del = true;
  const tick = () => {
    if (del) {
      i--; el.textContent = roles[r].slice(0, i);
      if (i === 0) { del = false; r = (r + 1) % roles.length; }
      setTimeout(tick, 45);
    } else {
      i++; el.textContent = roles[r].slice(0, i);
      if (i === roles[r].length) { del = true; setTimeout(tick, 1900); return; }
      setTimeout(tick, 85);
    }
  };
  setTimeout(tick, 2400);
}

/* ==========================================================
   Projects
   ========================================================== */
function selectProject(key) {
  $$('.finder__item').forEach(b => { const on = b.dataset.proj === key; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on); });
  $$('.proj').forEach(p => p.classList.toggle('is-active', p.dataset.proj === key));
  $('#finderMain').scrollTop = 0;
}
function jumpToScreens() {
  const main = $('#finderMain'), target = $('#screens');
  main.scrollTo({ top: target.offsetTop - 12, behavior: reduceMotion() ? 'auto' : 'smooth' });
}
function setupProjects() {
  $$('.finder__item').forEach(b => b.addEventListener('click', () => selectProject(b.dataset.proj)));
  $$('[data-jump="screens"]').forEach(a => a.addEventListener('click', (e) => { e.preventDefault(); jumpToScreens(); }));
  const live = $('#laundryLive'), code = $('#laundryCode');
  if (LAUNDRY_LIVE_URL && !/localhost|127\.0\.0\.1/.test(LAUNDRY_LIVE_URL)) { live.href = LAUNDRY_LIVE_URL; live.hidden = false; }
  if (LAUNDRY_CODE_URL) { code.href = LAUNDRY_CODE_URL; code.hidden = false; }
}

/* ---------- Screenshot gallery + lightbox ---------- */
function setupShots() {
  const box = $('#laundryShots'), lb = $('#lightbox'), img = $('#lightboxImg');
  let current = 0, last = null;
  LAUNDRY_SHOTS.forEach((s, i) => {
    const b = document.createElement('button');
    b.className = 'shot';
    b.setAttribute('aria-label', 'View screenshot: ' + s.caption);
    b.innerHTML = `<img src="${s.thumb}" alt="" loading="lazy"><span>${escapeHtml(s.caption)}</span>`;
    b.addEventListener('click', () => open(i));
    box.appendChild(b);
  });
  const show = (i) => {
    current = (i + LAUNDRY_SHOTS.length) % LAUNDRY_SHOTS.length;
    const s = LAUNDRY_SHOTS[current];
    img.classList.remove('is-ready'); img.onload = () => img.classList.add('is-ready');
    img.src = s.file; img.alt = s.caption;
    $('#lightboxCap').textContent = s.caption;
    $('#lightboxCount').textContent = `${current + 1} of ${LAUNDRY_SHOTS.length}`;
  };
  const open = (i) => { last = document.activeElement; show(i); lb.hidden = false; requestAnimationFrame(() => lb.classList.add('is-open')); $('#lightboxClose').focus(); };
  const close = () => { lb.classList.remove('is-open'); setTimeout(() => { lb.hidden = true; }, 250); last?.focus(); };
  $('#lightboxClose').addEventListener('click', close);
  $('#lightboxPrev').addEventListener('click', () => show(current - 1));
  $('#lightboxNext').addEventListener('click', () => show(current + 1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  swipe(lb, d => show(current + d));
}

function swipe(el, fn) {
  let x0 = null;
  el.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) fn(dx < 0 ? 1 : -1);
  });
}

/* ==========================================================
   Certificates
   ========================================================== */
function setupCertificates() {
  const list = $('#certList');
  const groups = [...new Set(certificates.map(c => c.group))];
  list.innerHTML = groups.map(g => `
    <div class="cert-group" data-group="${escapeHtml(g)}">
      <h3># ${escapeHtml(g.toLowerCase())}</h3>
      <div class="cert-grid">${certificates.filter(c => c.group === g).map(c => `
        <button type="button" class="cert-card" data-cert="${certificates.indexOf(c)}">
          <span class="cert-card__img"><img src="${CERT_PATH + c.thumb}" alt="" loading="lazy"></span>
          <span class="cert-card__body">
            <span class="cert-card__date">${escapeHtml(c.date)}</span>
            <span class="cert-card__title">${escapeHtml(c.title)}</span>
          </span>
        </button>`).join('')}</div>
    </div>`).join('');
  $('#certCount').textContent = `${certificates.length} certificates from networking courses, IT Week seminars and school activities.`;

  $$('.tab').forEach(tab => tab.addEventListener('click', () => {
    $$('.tab').forEach(t => { t.classList.toggle('is-active', t === tab); t.setAttribute('aria-selected', t === tab); });
    const f = tab.dataset.filter;
    $$('.cert-group').forEach(g => g.classList.toggle('is-hidden', f !== 'all' && g.dataset.group !== f));
  }));

  // viewer
  const modal = $('#certModal'), img = $('#certModalImg');
  let items = [], current = 0, last = null;
  const show = (i) => {
    current = (i + items.length) % items.length;
    const c = items[current];
    img.classList.remove('is-ready'); img.onload = () => img.classList.add('is-ready');
    img.src = CERT_PATH + c.image; img.alt = c.title + ' certificate';
    $('#certModalTitle').textContent = c.title;
    $('#certModalMeta').textContent = c.issuer + (c.date ? '  |  ' + c.date : '');
    $('#certModalCount').textContent = `${current + 1} / ${items.length}`;
    $('#certModalOpen').href = CERT_PATH + c.image;
  };
  const open = (i) => { last = document.activeElement; show(i); modal.hidden = false; requestAnimationFrame(() => modal.classList.add('is-open')); $('#certModalClose').focus(); };
  const close = () => { modal.classList.remove('is-open'); setTimeout(() => { modal.hidden = true; }, 250); last?.focus(); };
  list.addEventListener('click', (e) => {
    const card = e.target.closest('.cert-card');
    if (!card) return;
    const visible = $$('.cert-group:not(.is-hidden) .cert-card', list);
    items = visible.map(el => certificates[+el.dataset.cert]);
    open(visible.indexOf(card));
  });
  $('#certModalClose').addEventListener('click', close);
  $('#certModalPrev').addEventListener('click', () => show(current - 1));
  $('#certModalNext').addEventListener('click', () => show(current + 1));
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  swipe(modal, d => show(current + d));
}

/* ==========================================================
   Resume (PDF viewer + print)
   ========================================================== */
function setupResume() {
  const sheet = $('#resumeSheet'), view = $('#pdfView'), printArea = $('#printArea');
  const ul = $('#resumeCerts');
  if (ul) ul.innerHTML = certificates.map(c => {
    const issuer = c.group === 'Cisco Networking Academy' ? c.issuer : c.issuer.replace(/^Certificate of Participation,\s*/, 'Participation, ');
    return `<li><span><b>${escapeHtml(c.title)}</b><small>${escapeHtml(issuer)}</small></span><time>${escapeHtml(c.date)}</time></li>`;
  }).join('');

  const A4 = 793.7;
  const fit = () => {
    if (!view.clientWidth) return;
    const pad = isPhone() ? 20 : 44;
    const z = Math.min(1, (view.clientWidth - pad) / A4);
    sheet.style.zoom = z < 1 ? z : '';
  };
  WM.hooks.resume = [() => requestAnimationFrame(fit)];
  WM.hooks._resize = () => requestAnimationFrame(fit);
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(view);
  window.addEventListener('resize', fit);

  const fillPrint = () => {
    printArea.innerHTML = '';
    const copy = sheet.cloneNode(true);
    copy.removeAttribute('id'); copy.style.zoom = '';
    copy.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    printArea.appendChild(copy);
  };
  fillPrint();
  window.addEventListener('beforeprint', fillPrint);
  $('#printResume').addEventListener('click', () => { fillPrint(); window.print(); });
}

/* ==========================================================
   Terminal
   ========================================================== */
function setupTerminal() {
  const out = $('#termOut'), form = $('#termForm'), input = $('#termIn');
  const history = []; let hi = 0, introDone = false;
  const print = (html) => { out.insertAdjacentHTML('beforeend', html + '\n'); out.scrollTop = out.scrollHeight; };
  const promptLine = (cmd) => `<span class="t-user">micole@lcct</span>:<span class="t-dir">~</span>$ <span class="t-cmd">${escapeHtml(cmd)}</span>`;
  const link = (app, label) => `<a href="#${app}" data-open="${app}">${label}</a>`;

  const cmds = {
    help: () => `<span class="t-hi">Available commands</span>
  <span class="t-ok">whoami</span>      who I am
  <span class="t-ok">about</span>       short bio
  <span class="t-ok">skills</span>      what I work with
  <span class="t-ok">projects</span>    systems I've built
  <span class="t-ok">certs</span>       my certificates
  <span class="t-ok">resume</span>      open resume.pdf
  <span class="t-ok">contact</span>     how to reach me
  <span class="t-ok">open</span> &lt;app&gt;  about, projects, certificates, resume, contact
  <span class="t-ok">date</span>        today's date
  <span class="t-ok">clear</span>       clear the screen`,
    whoami: () => `<span class="t-out">Cher Micole P. Lirio</span>
<span class="t-dim">BS Information Technology student, La Consolacion College Tanauan</span>`,
    about: () => `<span class="t-out">Motivated and responsible IT student with knowledge in web development,
databases and system development. I communicate well, keep my tasks
organized and enjoy solving technical problems.</span>
<span class="t-dim">More:</span> ${link('about', 'open about-me.txt')}`,
    skills: () => `<span class="t-hi">technical</span>  HTML  CSS  JavaScript  PHP  MySQL  UI/UX  Database management
<span class="t-hi">tools</span>      VS Code  Laragon  phpMyAdmin  Git/GitHub  Figma  Canva
<span class="t-hi">soft</span>       communication  problem-solving  teamwork  time management`,
    projects: () => `<span class="t-out">drwxr-xr-x  intel-sportzle/      sports word game, solo and multiplayer
drwxr-xr-x  cml-laundry-system/  laundry shop system with QR tracking
drwxr-xr-x  salrc/               St. Augustine Learning Resource Center
drwxr-xr-x  academic-helpdesk/   academic ticketing system
drwxr-xr-x  portfolio/           this MicoleOS website</span>
<span class="t-dim">Browse them:</span> ${link('projects', 'open projects')}`,
    certs: () => certificates.map(c => `<span class="t-ok">✓</span> <span class="t-out">${escapeHtml(c.title)}</span> <span class="t-dim">${escapeHtml(c.date)}</span>`).join('\n') + `\n<span class="t-dim">View them:</span> ${link('certificates', 'open certificates')}`,
    resume: () => { setTimeout(() => openApp('resume'), 300); return `<span class="t-ok">Opening resume.pdf ...</span>`; },
    contact: () => `<span class="t-hi">email</span>   <a href="mailto:liriocher25@gmail.com">liriocher25@gmail.com</a>
<span class="t-hi">phone</span>   0976 433 2931
<span class="t-hi">github</span>  <a href="https://github.com/lcct-24-13152" target="_blank" rel="noopener">github.com/lcct-24-13152</a>`,
    date: () => `<span class="t-out">${new Date().toString()}</span>`,
    clear: () => { out.innerHTML = ''; return null; },
    ls: () => cmds.projects(),
    sudo: (args) => {
      if (args.join(' ') === 'hire micole') { setTimeout(() => openApp('contact'), 700); return `<span class="t-warn">[sudo] password for recruiter: ********</span>\n<span class="t-ok">Permission granted. Opening a message to Micole ...</span>`; }
      return `<span class="t-err">sudo: nice try. Try "sudo hire micole"</span>`;
    },
    open: (args) => {
      const app = (args[0] || '').toLowerCase();
      const map = { cert: 'certificates', certs: 'certificates', about: 'about', projects: 'projects', resume: 'resume', contact: 'contact', certificates: 'certificates', terminal: 'terminal' };
      if (map[app]) { setTimeout(() => openApp(map[app]), 200); return `<span class="t-ok">Opening ${map[app]} ...</span>`; }
      return `<span class="t-err">open: unknown app "${escapeHtml(app)}"</span>`;
    }
  };
  cmds.hire = () => cmds.sudo(['hire', 'micole']);

  const run = (raw) => {
    const line = raw.trim();
    print(promptLine(line));
    if (!line) return;
    history.push(line); hi = history.length;
    const [name, ...args] = line.split(/\s+/);
    const fn = cmds[name.toLowerCase()];
    const res = fn ? fn(args) : `<span class="t-err">command not found: ${escapeHtml(name)}</span>  <span class="t-dim">Type "help" to see commands.</span>`;
    if (res) print(res);
  };

  form.addEventListener('submit', (e) => { e.preventDefault(); run(input.value); input.value = ''; });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && history.length) { e.preventDefault(); hi = Math.max(0, hi - 1); input.value = history[hi]; }
    if (e.key === 'ArrowDown' && history.length) { e.preventDefault(); hi = Math.min(history.length, hi + 1); input.value = history[hi] || ''; }
  });
  $$('.term__chips [data-cmd]').forEach(b => b.addEventListener('click', () => { run(b.dataset.cmd); input.focus({ preventScroll: true }); }));
  $('#term').addEventListener('click', (e) => { if (!e.target.closest('a,button') && !getSelection().toString()) input.focus({ preventScroll: true }); });

  const intro = async () => {
    if (introDone) return; introDone = true;
    print(`<span class="t-dim">MicoleOS terminal. Type a command or tap one below.</span>\n`);
    if (reduceMotion()) { run('whoami'); run('help'); return; }
    for (const cmd of ['whoami', 'help']) {
      let typed = '';
      const holder = document.createElement('span');
      out.appendChild(holder);
      for (const ch of cmd) { typed += ch; holder.innerHTML = promptLine(typed); await new Promise(r => setTimeout(r, 70)); }
      holder.remove();
      run(cmd);
      await new Promise(r => setTimeout(r, 300));
    }
  };
  WM.hooks.terminal = [() => { intro(); if (!isPhone()) setTimeout(() => input.focus({ preventScroll: true }), 50); }];
}

/* ---------- Contact ---------- */
function setupContact() {
  const btn = $('#copyEmail');
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('liriocher25@gmail.com'); btn.textContent = 'Email copied'; }
    catch (e) { location.href = 'mailto:liriocher25@gmail.com'; }
    setTimeout(() => { btn.textContent = 'Copy email'; }, 2000);
  });
  $('#mailForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const body = `${d.message}\n\n${d.name}`;
    location.href = `mailto:liriocher25@gmail.com?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(body)}`;
    $('#mailNote').textContent = 'Opening your email app. Thank you!';
  });
}

/* ---------- Start ---------- */
document.addEventListener('DOMContentLoaded', () => {
  setupClock();
  setupWindows();
  setupProjects();
  setupShots();
  setupCertificates();
  setupResume();
  setupTerminal();
  setupContact();
  setupRole();
  boot(() => {
    if (!openFromHash() && !isPhone()) setTimeout(() => openApp('about'), 250);
  });
  window.addEventListener('hashchange', openFromHash);
});
