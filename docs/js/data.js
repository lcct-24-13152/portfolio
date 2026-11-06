/* ==========================================================
   data.js — content data (projects, certificates) and shared UI helpers: modal, lightbox, project details, certificates, resume printing
   ========================================================== */
/* Cher Micole P. Lirio — page logic */
const LAUNDRY_SHOTS = [
  { name: 'login',       caption: 'Admin login' },
  { name: 'dashboard',   caption: 'Dashboard with sales and stock status' },
  { name: 'transaction', caption: 'Cashier screen for new transactions' },
  { name: 'receipt',     caption: 'Official receipt with tracking QR code' },
  { name: 'history',     caption: 'Transaction history and payment status' },
  { name: 'supplies',    caption: 'Supplies with low and critical stock alerts' },
  { name: 'types',       caption: 'Laundry types and pricing per load' },
  { name: 'loyalty',     caption: 'Loyalty discounts and customer points' }
].map(s => ({ ...s, file: `images/laundry/${s.name}.jpg`, thumb: `images/laundry/${s.name}-thumb.jpg` }));

const CERT_PATH = 'images/certificates/';

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

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const isPhone = () => matchMedia('(max-width: 600px)').matches;
function escapeHtml(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

/* ---------- Modal helper (one place for open/close/focus/Esc) ---------- */
const Modal = (() => {
  const stack = [];
  const open = (el) => {
    el._last = document.activeElement;
    el.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => el.classList.add('is-open'));
    stack.push(el);
    ($('[data-close]', el) || el).focus?.();
  };
  const close = (el) => {
    el.classList.remove('is-open');
    const i = stack.indexOf(el); if (i > -1) stack.splice(i, 1);
    setTimeout(() => { el.hidden = true; if (!stack.length) document.body.style.overflow = ''; el.onclose?.(); }, 250);
    el._last?.focus?.();
  };
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && stack.length) close(stack[stack.length - 1]); });
  document.addEventListener('click', (e) => {
    const m = e.target.closest('.modal, .lightbox');
    if (!m) return;
    if (e.target === m || e.target.closest('[data-close]')) close(m);
  });
  return { open, close, top: () => stack[stack.length - 1] };
})();

function swipe(el, fn) {
  let x0 = null;
  el.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) fn(dx < 0 ? 1 : -1);
  });
}

/* ---------- Projects ---------- */
function openProject(key, toScreens) {
  const tpl = $('#tpl-' + key);
  if (!tpl) return;
  const modal = $('#projModal'), body = $('#projBody');
  body.innerHTML = '';
  body.appendChild(tpl.content.cloneNode(true));
  body.scrollTop = 0;
  const box = $('[data-shots]', body);
  if (box) {
    LAUNDRY_SHOTS.forEach((s, i) => {
      const b = document.createElement('button');
      b.className = 'shot'; b.type = 'button';
      b.setAttribute('aria-label', 'View screenshot: ' + s.caption);
      b.innerHTML = `<img src="${s.thumb}" alt="" loading="lazy">`;
      b.addEventListener('click', () => Lightbox.open(i));
      box.appendChild(b);
    });
  }
  $$('[data-jump-screens]', body).forEach(a => a.addEventListener('click', (e) => { e.preventDefault(); scrollToScreens(); }));
  Modal.open(modal);
  if (toScreens) setTimeout(scrollToScreens, 350);
}
function scrollToScreens() {
  const body = $('#projBody'), t = $('#screens', body);
  if (t) body.scrollTo({ top: t.offsetTop - 10, behavior: reduceMotion() ? 'auto' : 'smooth' });
}
function setupProjects() {
  $$('[data-project-open]').forEach(t => t.addEventListener('click', () => openProject(t.dataset.projectOpen)));
}

/* ---------- Screenshot lightbox ---------- */
const Lightbox = (() => {
  let cur = 0;
  const lb = () => $('#lightbox');
  const show = (i) => {
    cur = (i + LAUNDRY_SHOTS.length) % LAUNDRY_SHOTS.length;
    const s = LAUNDRY_SHOTS[cur];
    $('#lbImg').src = s.file; $('#lbImg').alt = s.caption;
    $('#lbCap').textContent = `${s.caption}  (${cur + 1} of ${LAUNDRY_SHOTS.length})`;
  };
  const init = () => {
    $('#lbClose').setAttribute('data-close', '');
    $('#lbPrev').addEventListener('click', () => show(cur - 1));
    $('#lbNext').addEventListener('click', () => show(cur + 1));
    document.addEventListener('keydown', (e) => {
      if (Modal.top() !== lb()) return;
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
    swipe(lb(), d => show(cur + d));
  };
  return { init, open: (i) => { show(i); Modal.open(lb()); } };
})();

/* ---------- Resume: preview modal + print ---------- */
function setupResume() {
  const sheet = $('#resumeSheet'), view = $('#pdfView'), modal = $('#resumeModal'), printArea = $('#printArea');
  const ul = $('#resumeCerts');
  if (ul) ul.innerHTML = certificates.map(c => {
    const issuer = c.group === 'Cisco Networking Academy' ? c.issuer : c.issuer.replace(/^Certificate of Participation,\s*/, 'Participation, ');
    return `<li><span><b>${escapeHtml(c.title)}</b><small>${escapeHtml(issuer)}</small></span><time>${escapeHtml(c.date)}</time></li>`;
  }).join('');
  const fit = () => {
    if (!view.clientWidth) return;
    const z = Math.min(1, (view.clientWidth - (isPhone() ? 20 : 44)) / 793.7);
    sheet.style.zoom = z < 1 ? z : '';
  };
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(view);
  const fillPrint = () => {
    printArea.innerHTML = '';
    const copy = sheet.cloneNode(true);
    copy.removeAttribute('id'); copy.style.zoom = '';
    copy.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    printArea.appendChild(copy);
  };
  fillPrint();
  window.addEventListener('beforeprint', fillPrint);
  $$('[data-open-resume]').forEach(b => b.addEventListener('click', () => { Modal.open(modal); requestAnimationFrame(fit); }));
  $('#printResume').addEventListener('click', () => { fillPrint(); window.print(); });
}

/* ---------- Contact ---------- */
function setupContact() {
  const btn = $('#copyEmail');
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('liriocher25@gmail.com'); btn.textContent = 'Email copied'; }
    catch (e) { location.href = 'mailto:liriocher25@gmail.com'; }
    setTimeout(() => { btn.textContent = 'Copy email'; }, 2000);
  });
}



/* ---------- Certificates grid + viewer ---------- */
function setupCertificates() {
  const grid = $('#certStrip');
  $('#certTotal').textContent = certificates.length;
  let filter = 'all';
  const render = () => {
    const list = certificates.filter(c => filter === 'all' || c.group === filter);
    grid.innerHTML = list.map((c, i) => `
      <button type="button" class="cert" data-cert="${certificates.indexOf(c)}" style="animation-delay:${i * 45}ms">
        <span class="cert__img"><img src="${CERT_PATH + c.thumb}" alt="" loading="lazy"></span>
        <span class="cert__body"><span class="cert__date">${escapeHtml(c.date)}</span><span class="cert__title">${escapeHtml(c.title)}</span><span class="cert__issuer">${escapeHtml(c.issuer)}</span><span class="cert__tag${c.group === 'School and events' ? ' cert__tag--school' : ''}">${c.group === 'School and events' ? 'School event' : 'Cisco'}</span></span>
      </button>`).join('');
  };
  render();
  $$('.tab').forEach(tab => tab.addEventListener('click', () => {
    $$('.tab').forEach(t => { t.classList.toggle('is-active', t === tab); t.setAttribute('aria-selected', t === tab); });
    filter = tab.dataset.filter; render();
  }));
  const modal = $('#certModal'), img = $('#certImg');
  let items = [], cur = 0;
  const show = (i) => {
    cur = (i + items.length) % items.length;
    const c = items[cur];
    img.classList.remove('is-ready'); img.onload = () => img.classList.add('is-ready');
    img.src = CERT_PATH + c.image; img.alt = c.title + ' certificate';
    $('#certTitle').textContent = c.title;
    $('#certMeta').textContent = c.issuer + (c.date ? ', ' + c.date : '');
    $('#certCount').textContent = `${cur + 1} of ${items.length}`;
  };
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.cert'); if (!card) return;
    const cards = $$('.cert', grid);
    items = cards.map(el => certificates[+el.dataset.cert]);
    show(cards.indexOf(card)); Modal.open(modal);
  });
  $('#certPrev').addEventListener('click', () => show(cur - 1));
  $('#certNext').addEventListener('click', () => show(cur + 1));
  document.addEventListener('keydown', (e) => {
    if (Modal.top() !== modal) return;
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });
  swipe(modal, d => show(cur + d));
}




