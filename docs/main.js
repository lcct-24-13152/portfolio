/* git log portfolio — Cher Micole P. Lirio */
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

/* ---------- Links like #screens (QR code) and #resume ---------- */
function openFromHash() {
  const h = location.hash.slice(1);
  if (h === 'screens') openProject('laundry', true);
  else if (['sportzle', 'laundry', 'salrc', 'helpdesk'].includes(h)) openProject(h);
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

/* ---------- Mini resume preview in the Resume section ---------- */
function setupMiniSheet() {
  const holder = $('#miniSheet'), sheet = $('#resumeSheet');
  const copy = sheet.cloneNode(true);
  copy.removeAttribute('id'); copy.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
  copy.setAttribute('aria-hidden', 'true');
  holder.appendChild(copy);
  const fit = () => { copy.style.transform = `scale(${holder.clientWidth / 793.7})`; };
  new ResizeObserver(fit).observe(holder); fit();
}

/* ---------- Reveal on scroll ---------- */
function setupReveal() {
  const els = $$('.rv');
  if (reduceMotion() || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: .15 });
  els.forEach(e => io.observe(e));
}



/* ---------- Home: the CML device (drag to spin 360°) ---------- */
const Rig = { build() {} };
function setupRig() {
  const stage = $('#stage'), rig = $('#rig'), read = $('#padRead span'), out = $('#padReadOut');
  const fit = () => {
    const phone = innerWidth <= 600, mid = innerWidth <= 1000;
    const s = Math.min(stage.clientWidth / (phone ? 600 : mid ? 1000 : 860), stage.clientHeight / (phone ? 470 : 560), 1.3);
    rig.style.setProperty('--s', Math.max(.36, s).toFixed(3));
  };
  new ResizeObserver(fit).observe(stage); fit();

  const build = () => {
    rig.classList.remove('is-built', 'is-ready');
    void rig.offsetWidth;
    requestAnimationFrame(() => rig.classList.add('is-built'));
    setTimeout(() => rig.classList.add('is-ready'), reduceMotion() ? 0 : 2500);
  };
  Rig.build = build;
  setTimeout(build, 150);

  // rotation state: rz spins freely, rx tilts within limits so the bottom never shows
  let rz = -38, rx = 56, vz = 0, vx = 0, dragging = false, moved = 0, lastX = 0, lastY = 0, lastT = 0, idleAt = performance.now() + 4000;
  const apply = () => { rig.style.setProperty('--rz', rz.toFixed(2) + 'deg'); rig.style.setProperty('--rx', rx.toFixed(2) + 'deg'); };
  const clampX = (v) => Math.max(18, Math.min(82, v));
  stage.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY; lastT = performance.now(); vz = vx = 0;
  });
  addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY, now = performance.now(), dt = Math.max(1, now - lastT);
    moved += Math.abs(dx) + Math.abs(dy);
    if (moved > 6 && !stage.classList.contains('is-dragging')) { stage.classList.add('is-dragging'); try { stage.setPointerCapture(e.pointerId); } catch (_) {} }
    if (moved <= 6) return;
    rz -= dx * .45; rx = clampX(rx - dy * .3);
    vz = -dx * .45 / dt * 16; vx = -dy * .3 / dt * 16;
    lastX = e.clientX; lastY = e.clientY; lastT = now; apply();
  });
  const end = () => {
    if (!dragging) return;
    dragging = false; idleAt = performance.now() + 3500;
    if (stage.classList.contains('is-dragging')) {
      stage.classList.remove('is-dragging');
      stage._dragged = true; setTimeout(() => { stage._dragged = false; }, 0);
    }
  };
  addEventListener('pointerup', end); addEventListener('pointercancel', end);
  // a click that ends a drag must not open a module
  stage.addEventListener('click', (e) => { if (stage._dragged) { e.stopPropagation(); e.preventDefault(); } }, true);

  const loop = (t) => {
    if (!dragging) {
      if (Math.abs(vz) > .01 || Math.abs(vx) > .01) { rz += vz; rx = clampX(rx + vx); vz *= .94; vx *= .94; apply(); }
      else if (t > idleAt && !reduceMotion() && !document.body.classList.contains('in-view')) { // slow idle sway
        rz += .06; rx += (56 + Math.sin(t / 2400) * 4 - rx) * .02; apply();
      }
    }
    requestAnimationFrame(loop);
  };
  apply(); requestAnimationFrame(loop);
  window.__spin = (z, x) => { rz = z; if (x) rx = x; vz = vx = 0; idleAt = Infinity; apply(); };

  // hover: light up the wire of a module
  const wires = $$('.wires path');
  const wireFor = { '#work': 0, '#certificates': 1, '#about': 2, resume: 3, '#contact': 4 };
  $$('.node[data-go]').forEach((n) => {
    const go = n.dataset.go;
    n.addEventListener('pointerenter', () => wires[wireFor[go]]?.classList.add('is-hot'));
    n.addEventListener('pointerleave', () => wires.forEach(w => w.classList.remove('is-hot')));
    n.addEventListener('click', (e) => {
      if (go === 'replay') { build(); return; }
      const r = n.getBoundingClientRect();
      const pt = e.clientX || e.clientY ? { x: e.clientX, y: e.clientY } : { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      Views.go(go === 'resume' ? 'resume' : go.slice(1).replace('work', 'projects'), pt);
    });
  });

  // skills keypad
  let outT;
  $$('.key').forEach(k => k.addEventListener('click', () => {
    const msg = '> ' + k.querySelector('small').textContent + ': ' + k.dataset.info;
    read.textContent = msg; out.textContent = msg; out.classList.add('is-on');
    clearTimeout(outT); outT = setTimeout(() => out.classList.remove('is-on'), 2600);
    k.classList.add('is-down'); setTimeout(() => k.classList.remove('is-down'), 160);
  }));
}

/* ---------- Views: open only from the device, with a portal transition ---------- */
const Views = (() => {
  const portal = $('#portal'), cmd = $('#portalCmd');
  const CMDS = { projects: 'cd ~/projects && ls', certificates: 'open ~/certificates', about: 'cat ~/about.md', contact: 'ping cher.lirio', resume: 'print ~/resume.pdf' };
  let current = null, busy = false;

  const wait = (ms) => new Promise(r => setTimeout(r, reduceMotion() ? 0 : ms));
  const type = async (text) => {
    cmd.innerHTML = '<b>micole@portfolio</b>:~$ ';
    const span = document.createElement('span'); cmd.appendChild(span);
    if (reduceMotion()) { span.textContent = text; return; }
    for (const ch of text) { span.textContent += ch; await wait(22); }
  };
  const runPortal = async (name, pt) => {
    portal.style.setProperty('--px', (pt ? pt.x : innerWidth / 2) + 'px');
    portal.style.setProperty('--py', (pt ? pt.y : innerHeight / 2) + 'px');
    portal.classList.remove('is-fade', 'is-open'); void portal.offsetWidth;
    portal.classList.add('is-open');
    type(CMDS[name] || name);
    await wait(1150);
  };
  const fadePortal = async () => {
    portal.classList.add('is-fade');
    await wait(450);
    portal.classList.remove('is-open', 'is-fade');
  };
  const show = (name) => {
    const v = $('#view-' + name); if (!v) return;
    v.hidden = false; v.classList.remove('is-out'); void v.offsetWidth; v.classList.add('is-in');
    $('.view__body', v).scrollTop = 0;
    document.body.classList.add('in-view'); $('#home').setAttribute('aria-hidden', 'true');
    current = v; $('[data-back]', v).focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent('viewopen', { detail: name }));
  };

  const go = async (name, pt, quick) => {
    if (busy) return; busy = true;
    if (!quick) await runPortal(name, pt);
    if (current && current.id !== 'view-' + name) { current.hidden = true; current.classList.remove('is-in'); }
    show(name);
    history.replaceState(null, '', '#' + name);
    if (!quick) await fadePortal();
    busy = false;
  };
  const back = async () => {
    if (!current || busy) return; busy = true;
    const v = current; current = null;
    v.classList.remove('is-in'); v.classList.add('is-out');
    await wait(340);
    v.hidden = true; v.classList.remove('is-out');
    document.body.classList.remove('in-view'); $('#home').removeAttribute('aria-hidden');
    history.replaceState(null, '', location.pathname + location.search);
    busy = false;
  };
  $$('[data-back]').forEach(b => b.addEventListener('click', back));
  // Esc closes the open view, but only when no modal is on top
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && current && !Modal.top()) back(); }, true);
  return { go, back, get current() { return current; } };
})();

function openFromHash2() {
  const h = location.hash.slice(1);
  if (!h) return;
  if (h === 'screens') { Views.go('projects', null, true).then(() => openProject('laundry', true)); return; }
  if (['sportzle', 'laundry', 'salrc', 'helpdesk'].includes(h)) { Views.go('projects', null, true).then(() => openProject(h)); return; }
  if (h === 'work') { Views.go('projects', null, true); return; }
  if (['projects', 'certificates', 'about', 'contact', 'resume'].includes(h)) Views.go(h, null, true);
}

/* ---------- About: count-up stats + a small terminal ---------- */
function setupAbout() {
  const out = $('#termOut'); if (!out) return;
  const CMD = {
    whoami: () => [['k', 'Cher Micole P. Lirio'], ['', 'BSIT student @ La Consolacion College Tanauan'], ['d', 'Balele, Tanauan City, Batangas']],
    stack: () => [['k', 'languages/'], ['', '  HTML  CSS  JavaScript  PHP  MySQL'], ['k', 'tools/'], ['', '  VS Code  Laragon  phpMyAdmin  Git  Figma  Canva']],
    projects: () => [['', 'intel-sportzle/     sports word game'], ['', 'cml-laundry/        laundry shop system'], ['', 'salrc/              learning resource center'], ['', 'academic-helpdesk/  student ticketing system'], ['d', '4 directories']],
    goal: () => [['k', 'Looking for an OJT or internship'], ['', 'where I can gain experience, improve my skills'], ['', 'and contribute to an organization.']],
  };
  const LABEL = { whoami: 'whoami', stack: 'ls stack/', projects: 'ls projects/', goal: 'cat goal.txt' };
  let busy = false;
  const line = (cls, text) => { const d = document.createElement('div'); if (cls) d.className = cls; d.textContent = text; out.appendChild(d); out.scrollTop = out.scrollHeight; return d; };
  const run = async (key) => {
    if (busy) return; busy = true;
    if (key === 'clear') { out.innerHTML = ''; prompt(); busy = false; return; }
    const cur = out.querySelector('.cur')?.parentElement; cur?.remove();
    const pl = line('', ''); pl.innerHTML = '<span class="p">micole@portfolio</span>:~$ <span class="t"></span>';
    const t = pl.querySelector('.t');
    for (const ch of LABEL[key]) { t.textContent += ch; if (!reduceMotion()) await new Promise(r => setTimeout(r, 28)); }
    for (const [c, txt] of CMD[key]()) { line(c, txt); if (!reduceMotion()) await new Promise(r => setTimeout(r, 70)); }
    line('', ''); prompt(); busy = false;
  };
  const prompt = () => { const d = line('', ''); d.innerHTML = '<span class="p">micole@portfolio</span>:~$ <span class="cur"></span>'; };
  $$('[data-cmd]').forEach(b => b.addEventListener('click', () => run(b.dataset.cmd)));
  prompt();

  let ran = false;
  document.addEventListener('viewopen', (e) => {
    if (e.detail !== 'about') return;
    $$('.stats [data-count]').forEach(el => {
      const end = +el.dataset.count, t0 = performance.now();
      const step = (t) => { const k = Math.min(1, (t - t0) / 1100); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
      reduceMotion() ? (el.textContent = end) : requestAnimationFrame(step);
    });
    if (!ran) { ran = true; setTimeout(() => run('whoami'), 500); }
  });
}

/* ---------- Spotlight on cards ---------- */
function setupSpot() {
  $$('.spot').forEach(g => g.addEventListener('pointermove', (e) => {
    const c = [...g.children].find(el => el.contains(e.target)); if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));
}

/* ---------- Certificates extras: counts + fanned preview ---------- */
function setupCertExtras() {
  $$('.tab [data-n]').forEach(b => { const g = b.dataset.n; b.textContent = certificates.filter(c => g === 'all' || c.group === g).length; });
  const fan = $('#certFan'); if (!fan) return;
  fan.innerHTML = certificates.slice(0, 3).reverse().map(c => `<img src="${CERT_PATH + c.thumb}" alt="" loading="lazy">`).join('');
  fan.addEventListener('click', () => { $('.tab[data-filter="all"]').click(); $('#certStrip .cert')?.click(); });
}

/* ---------- Resume view: the real sheet, print in a modal ---------- */
function setupResumeView() {
  const box = $('#resumePaper'), src = $('#resumeSheet'); if (!box || !src) return;
  const copy = src.cloneNode(true); copy.removeAttribute('id'); copy.style.zoom = '';
  copy.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
  box.appendChild(copy);
  const fit = () => { if (!box.clientWidth) return; const z = box.clientWidth / 793.7; copy.style.zoom = z.toFixed(4); };
  new ResizeObserver(fit).observe(box); fit();
}

/* ---------- Contact: live PH time + message composer ---------- */
function setupContactView() {
  const t = $('#phTime');
  const tick = () => { if (t) t.textContent = new Intl.DateTimeFormat('en-PH', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Manila' }).format(new Date()) + ' PHT'; };
  tick(); setInterval(tick, 20000);
  const f = $('#mailForm'); if (!f) return;
  const hint = $('#mailHint'), btn = $('.send', f), label = $('.send span', f);
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (f._honey.value) return; // bots fill the hidden field
    const name = f.name.value.trim(), email = f.email.value.trim(), msg = f.msg.value.trim(), topic = f.topic.value;
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    $$('.field', f).forEach(el => el.classList.remove('is-bad'));
    if (!name) f.name.closest('.field').classList.add('is-bad');
    if (!okEmail) f.email.closest('.field').classList.add('is-bad');
    if (!msg) f.msg.closest('.field').classList.add('is-bad');
    if (!name || !okEmail || !msg) { hint.textContent = 'Please add your name, a valid email and a message.'; return; }
    btn.disabled = true; btn.classList.add('is-flying'); label.textContent = 'Sending…'; hint.textContent = 'Sending your message…';
    try {
      const r = await fetch('https://formsubmit.co/ajax/liriocher25@gmail.com', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, topic, message: msg, _subject: 'Portfolio message: ' + topic + ' from ' + name, _replyto: email, _template: 'table', _captcha: 'false' })
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || data.success === false || data.success === 'false') throw new Error(data.message || 'failed');
      f.reset(); f.classList.add('is-sent'); label.textContent = 'Sent'; hint.textContent = 'Message sent! Thank you, ' + name.split(' ')[0] + '. I\'ll reply to ' + email + '.';
      setTimeout(() => { f.classList.remove('is-sent'); label.textContent = 'Send message'; }, 5000);
    } catch (err) {
      label.textContent = 'Send message';
      hint.innerHTML = 'Couldn\'t send right now. <a href="mailto:liriocher25@gmail.com?subject=' + encodeURIComponent(topic + ' from ' + name) + '&body=' + encodeURIComponent(msg) + '">Email me directly</a> instead.';
    } finally { btn.disabled = false; btn.classList.remove('is-flying'); }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupAbout();
  setupSpot();
  setupContactView();
  document.documentElement.classList.add('js');
  setupRig();
  setupProjects();
  Lightbox.init();
  setupCertificates();
  setupResume();
  setupResumeView();
  setupCertExtras();
  setupContact();
  $('#heroPhoto').addEventListener('click', () => Modal.open($('#photoModal')));
  openFromHash2();
});
