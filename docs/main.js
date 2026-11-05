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
    const s = Math.min(stage.clientWidth / (phone ? 540 : mid ? 920 : 770), stage.clientHeight / (phone ? 430 : 500), 1.5);
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
  $$('.node[data-go]').forEach((n) => {
    const go = n.dataset.go;
    n.addEventListener('pointerenter', () => { wires[+n.dataset.wire]?.classList.add('is-hot'); Sound.tick(); });
    n.addEventListener('pointerleave', () => wires.forEach(w => w.classList.remove('is-hot')));
    n.addEventListener('click', (e) => {
      if (go === 'replay') { Sound.clang(); build(); return; }
      Sound.select();
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
    Sound.whoosh();
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
    v.hidden = false; v.classList.remove('is-out', 'is-min'); void v.offsetWidth; v.classList.add('is-in');
    Dock.remove(name);
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
  $$('[data-back]').forEach(b => b.addEventListener('click', () => { Sound.close(); back(); }));
  // minimize: shrink into the dock on the home screen
  const minimize = async () => {
    if (!current || busy) return; busy = true;
    const v = current, name = v.id.replace('view-', ''); current = null;
    Sound.min();
    v.classList.remove('is-in'); v.classList.add('is-min');
    await wait(450);
    v.hidden = true; v.classList.remove('is-min');
    document.body.classList.remove('in-view'); $('#home').removeAttribute('aria-hidden');
    history.replaceState(null, '', location.pathname + location.search);
    Dock.add(name, v.dataset.title);
    busy = false;
  };
  const restore = (name) => {
    if (busy) return;
    if (current) { current.hidden = true; current.classList.remove('is-in'); }
    Sound.max();
    show(name);
    const v = $('#view-' + name); v.classList.remove('is-in'); v.classList.add('is-restore');
    setTimeout(() => v.classList.remove('is-restore'), 460);
    history.replaceState(null, '', '#' + name);
  };
  $$('[data-min]').forEach(b => b.addEventListener('click', minimize));
  $$('[data-max]').forEach(b => b.addEventListener('click', () => {
    const on = !b.closest('.view').classList.contains('is-max');
    $$('.view').forEach(v => v.classList.toggle('is-max', on));
    b.setAttribute('aria-label', on ? 'Restore window size' : 'Maximize window');
    try { localStorage.setItem('cml-max', on ? '1' : '0'); } catch (e) {}
    Sound.max();
  }));
  try { if (localStorage.getItem('cml-max') === '1') $$('.view').forEach(v => v.classList.add('is-max')); } catch (e) {}
  // next section buttons
  $$('[data-next]').forEach(b => b.addEventListener('click', (e) => { Sound.select(); go(b.dataset.next, { x: e.clientX || innerWidth / 2, y: e.clientY || innerHeight / 2 }); }));
  // Esc closes the open view, but only when no modal is on top
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && current && !Modal.top()) back(); }, true);
  return { go, back, restore, get current() { return current; } };
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

/* ---------- Sending messages to Micole's inbox ----------
   1) Web3Forms when an access key is set (most reliable)
   2) FormSubmit AJAX
   3) FormSubmit classic POST through a hidden iframe (works even when AJAX is blocked) */
const MAIL_TO = 'liriocher25@gmail.com';
const WEB3FORMS_KEY = 'b148b811-9d19-457f-bf53-dd725301fbbb';
async function sendMail(m) {
  const subject = 'Portfolio message: ' + m.topic + ' from ' + m.name;
  if (WEB3FORMS_KEY) {
    const r = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject, from_name: m.name + ' (portfolio)', name: m.name, email: m.email, replyto: m.email, topic: m.topic, message: m.message }) });
    const d = await r.json().catch(() => ({}));
    if (d.success) return; console.warn('Web3Forms:', d.message);
  }
  try {
    const r = await fetch('https://formsubmit.co/ajax/' + MAIL_TO, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name: m.name, email: m.email, topic: m.topic, message: m.message, _subject: subject, _replyto: m.email, _template: 'table', _captcha: 'false' }) });
    const d = await r.json().catch(() => ({}));
    if (d.success === true || d.success === 'true') return;
    console.warn('FormSubmit AJAX:', r.status, d.message);
  } catch (e) { console.warn('FormSubmit AJAX blocked:', e.message); }
  await new Promise((resolve) => { // classic form post in a hidden frame
    const name = 'mailframe' + Date.now(), fr = document.createElement('iframe'), f = document.createElement('form');
    fr.name = name; fr.hidden = true; fr.setAttribute('aria-hidden', 'true'); document.body.appendChild(fr);
    f.action = 'https://formsubmit.co/' + MAIL_TO; f.method = 'POST'; f.target = name; f.hidden = true;
    const add = (k, v) => { const i = document.createElement('input'); i.type = 'hidden'; i.name = k; i.value = v; f.appendChild(i); };
    add('name', m.name); add('email', m.email); add('topic', m.topic); add('message', m.message);
    add('_subject', subject); add('_replyto', m.email); add('_template', 'table'); add('_captcha', 'false');
    document.body.appendChild(f);
    let done = false; const end = () => { if (done) return; done = true; resolve(); setTimeout(() => { fr.remove(); f.remove(); }, 4000); };
    fr.addEventListener('load', end); setTimeout(end, 5000);
    f.submit();
  });
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
      await sendMail({ name, email, topic, message: msg });
      Sound.chime();
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

/* ================= v5: sound, music, theme, dock, boot robot, ID badge ================= */
const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

/* ---------- Sound engine (Web Audio, no files) ---------- */
const Sound = (() => {
  let ctx = null, master, sfx, music, echo, muted = store.get('cml-muted') === '1', musicOn = store.get('cml-music') !== '0';
  let timer = null;
  const unlock = () => {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = muted ? 0 : 1; master.connect(ctx.destination);
      sfx = ctx.createGain(); sfx.gain.value = .55; sfx.connect(master);
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400; lp.connect(master);
      music = ctx.createGain(); music.gain.value = 0; music.connect(lp);
      echo = ctx.createDelay(1); echo.delayTime.value = .32; const fb = ctx.createGain(); fb.gain.value = .32;
      echo.connect(fb); fb.connect(echo); echo.connect(lp);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };
  const live = () => ctx && !muted && ctx.state === 'running';
  const tone = (f, d, o = {}) => {
    if (!live()) return;
    const t = ctx.currentTime + (o.at || 0), osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(f, t);
    if (o.glide) osc.frequency.exponentialRampToValueAtTime(o.glide, t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(o.v || .15, t + (o.attack || .006)); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    osc.connect(g); g.connect(o.bus || sfx); osc.start(t); osc.stop(t + d + .05);
  };
  let nbuf = null;
  const noise = (d, o = {}) => {
    if (!live()) return;
    if (!nbuf) { nbuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); const ch = nbuf.getChannelData(0); for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1; }
    const t = ctx.currentTime + (o.at || 0), src = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = nbuf; fl.type = o.type || 'bandpass'; fl.frequency.setValueAtTime(o.f || 1200, t); fl.Q.value = o.q || 1;
    if (o.sweep) fl.frequency.exponentialRampToValueAtTime(o.sweep, t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(o.v || .2, t + (o.attack || .01)); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    src.connect(fl); fl.connect(g); g.connect(sfx); src.start(t); src.stop(t + d + .05);
  };
  const fx = {
    tick: () => tone(1900, .03, { type: 'square', v: .025 }),
    key: () => tone(780 + Math.random() * 400, .05, { type: 'square', v: .05 }),
    select: () => { tone(660, .07, { type: 'square', v: .05 }); tone(990, .12, { type: 'square', v: .05, at: .06 }); },
    whoosh: () => { noise(.75, { f: 300, sweep: 4200, v: .22, q: .8, attack: .2 }); tone(220, .6, { glide: 880, v: .05, type: 'sine' }); },
    close: () => tone(520, .14, { glide: 260, type: 'triangle', v: .12 }),
    min: () => tone(760, .28, { glide: 180, v: .1 }),
    max: () => tone(300, .22, { glide: 820, v: .1 }),
    flip: () => noise(.25, { f: 900, sweep: 2600, v: .12, q: 1.5 }),
    servo: () => { tone(160, .32, { type: 'sawtooth', glide: 460, v: .045 }); noise(.3, { f: 1800, q: 6, v: .04 }); },
    clang: () => { noise(.14, { f: 3200, q: 4, v: .3 }); tone(240, .18, { type: 'square', v: .06 }); tone(1480, .25, { type: 'sine', v: .05 }); },
    beep: () => tone(1250, .09, { type: 'square', v: .06 }),
    chime: () => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, .7, { v: .1, at: i * .09 })),
  };
  // ---- tech ambience (no melody): machine hum, data blips, scan sweeps, a soft pulse
  let drone = null, nextBlip = 0, nextPulse = 0, nextScan = 0;
  const HI = [1318.5, 1567.98, 1760, 2093, 2349.3, 2637, 3135.96];
  const mtone = (f, t, d, v, type = 'sine', toEcho = false) => {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g); g.connect(music); if (toEcho) g.connect(echo); o.start(t); o.stop(t + d + .05);
  };
  const schedule = () => {
    const now = ctx.currentTime;
    while (nextBlip < now + .25) { // data chirps, sometimes in quick bursts
      const n = Math.random() < .3 ? 3 : 1;
      for (let i = 0; i < n; i++) mtone(HI[Math.floor(Math.random() * HI.length)], nextBlip + i * .07, .06, .02, Math.random() < .5 ? 'square' : 'sine', true);
      nextBlip += .35 + Math.random() * 1.1;
    }
    while (nextPulse < now + .25) { // low machine pulse
      const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(70, nextPulse); o.frequency.exponentialRampToValueAtTime(42, nextPulse + .25);
      g.gain.setValueAtTime(0.0001, nextPulse); g.gain.linearRampToValueAtTime(.09, nextPulse + .01); g.gain.exponentialRampToValueAtTime(.0001, nextPulse + .35);
      o.connect(g); g.connect(music); o.start(nextPulse); o.stop(nextPulse + .4);
      nextPulse += 1.6;
    }
    while (nextScan < now + .25) { // slow scanner sweep
      if (!nbuf) { nbuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); const ch = nbuf.getChannelData(0); for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1; }
      const src = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain(), t = nextScan;
      src.buffer = nbuf; src.loop = true; fl.type = 'bandpass'; fl.Q.value = 6; fl.frequency.setValueAtTime(500, t); fl.frequency.exponentialRampToValueAtTime(3800, t + 2.4);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(.035, t + 1.2); g.gain.linearRampToValueAtTime(.0001, t + 2.4);
      src.connect(fl); fl.connect(g); g.connect(music); src.start(t); src.stop(t + 2.5);
      nextScan += 9 + Math.random() * 5;
    }
  };
  const startDrone = () => {
    const t = ctx.currentTime, out = ctx.createGain(); out.gain.value = .055;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 240; lp.Q.value = 4;
    const lfo = ctx.createOscillator(), lfoG = ctx.createGain(); lfo.frequency.value = .07; lfoG.gain.value = 140; lfo.connect(lfoG); lfoG.connect(lp.frequency);
    const oscs = [55, 55.35, 110.2].map((f, i) => { const o = ctx.createOscillator(); o.type = i === 2 ? 'triangle' : 'sawtooth'; o.frequency.value = f; o.connect(lp); o.start(t); return o; });
    lp.connect(out); out.connect(music); lfo.start(t);
    drone = { stop: () => { const e = ctx.currentTime + 1; oscs.forEach(o => o.stop(e)); lfo.stop(e); } };
  };
  const startMusic = () => {
    if (!ctx || timer) return;
    const t = ctx.currentTime; nextBlip = t + .6; nextPulse = t + .2; nextScan = t + 3;
    if (!drone) startDrone();
    timer = setInterval(schedule, 90); schedule();
    music.gain.cancelScheduledValues(t); music.gain.setTargetAtTime(.9, t, 1);
  };
  const stopMusic = () => {
    if (!ctx || !timer) return;
    music.gain.cancelScheduledValues(ctx.currentTime); music.gain.setTargetAtTime(0, ctx.currentTime, .3);
    clearInterval(timer); timer = null;
    const d = drone; drone = null; setTimeout(() => d && d.stop(), 1200);
  };
  const ui = () => {
    $$('[data-mute]').forEach(b => { b.setAttribute('aria-pressed', muted); b.title = muted ? 'Unmute sound' : 'Mute sound'; });
    $$('[data-music]').forEach(b => { b.setAttribute('aria-pressed', musicOn && !muted); b.title = musicOn ? 'Stop music' : 'Play music'; });
  };
  document.addEventListener('visibilitychange', () => { if (!ctx) return; document.hidden ? ctx.suspend() : ctx.resume(); });
  return {
    ...fx, unlock, ui,
    get muted() { return muted; },
    setMuted(m) { muted = m; store.set('cml-muted', m ? '1' : '0'); if (ctx) master.gain.setTargetAtTime(m ? 0 : 1, ctx.currentTime, .05); if (!m && musicOn) { unlock(); startMusic(); } ui(); },
    setMusic(on) { musicOn = on; store.set('cml-music', on ? '1' : '0'); if (on) { unlock(); if (muted) this.setMuted(false); startMusic(); } else stopMusic(); ui(); },
    begin() { unlock(); if (musicOn && !muted) startMusic(); ui(); },
  };
})();

/* ---------- Dock for minimized windows ---------- */
const Dock = {
  add(name, title) {
    const dock = $('#dock'); if (!dock || $(`[data-name="${name}"]`, dock)) return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'dock__item'; b.dataset.name = name;
    b.innerHTML = `<i></i>${escapeHtml(title || name)}`; b.setAttribute('aria-label', 'Restore ' + (title || name));
    b.addEventListener('click', () => Views.restore(name));
    dock.appendChild(b);
  },
  remove(name) { $(`#dock [data-name="${name}"]`)?.remove(); },
};

/* ---------- Header controls ---------- */
function setupControls() {
  const meta = $('meta[name="theme-color"]');
  const setTheme = (t) => { document.documentElement.dataset.theme = t; store.set('cml-theme', t); if (meta) meta.content = t === 'light' ? '#eef4fb' : '#0b1426'; };
  $$('[data-theme-toggle]').forEach(b => b.addEventListener('click', () => { Sound.unlock(); Sound.tick(); setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'); }));
  $$('[data-mute]').forEach(b => b.addEventListener('click', () => { Sound.unlock(); Sound.setMuted(!Sound.muted); if (!Sound.muted) Sound.beep(); }));
  $$('[data-music]').forEach(b => b.addEventListener('click', () => Sound.setMusic(b.getAttribute('aria-pressed') !== 'true')));
  $$('.key').forEach(k => k.addEventListener('click', () => Sound.key()));
  $$('.win__b, .tab, .pcard__open, .ccard__act, .topics span').forEach(el => el.addEventListener('pointerenter', () => Sound.tick()));
  Sound.ui();
}

/* ---------- Boot screen: a robot builds itself ---------- */
function setupBoot(done) {
  const boot = $('#boot'), robo = $('#robo'), log = $('#roboLog'), bar = $('#roboBar'), pct = $('#roboPct'), weld = $('.r-weld');
  let finished = false;
  const finish = () => {
    if (finished) return; finished = true;
    boot.classList.add('is-gone');
    Sound.begin();
    done();
    setTimeout(() => boot.remove(), 800);
  };
  if (location.hash.length > 1 || reduceMotion()) { boot.remove(); done(); return; }
  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  const spark = (el) => {
    const s = el.getBoundingClientRect(), st = $('.robo__stage').getBoundingClientRect(), k = st.width / 240;
    weld.style.left = (s.left - st.left + s.width / 2) / k + 'px'; weld.style.top = (s.top - st.top + s.height / 2) / k + 'px';
    weld.classList.remove('is-spark'); void weld.offsetWidth; weld.classList.add('is-spark');
  };
  const STEPS = [
    ['.r-leg.l, .r-leg.r', 'attaching legs'],
    ['.r-body', 'mounting core chassis'],
    ['.r-arm.l, .r-arm.r', 'connecting arms'],
    ['.r-neck', 'locking neck joint'],
    ['.r-head', 'installing head unit'],
    ['.r-ant', 'calibrating antenna'],
  ];
  const run = async () => {
    boot.classList.add('is-building');
    await wait(450);
    for (let i = 0; i < STEPS.length && !finished; i++) {
      const [sel, text] = STEPS[i];
      log.textContent = '> ' + text + '…';
      Sound.servo();
      const parts = $$(sel, robo);
      parts.forEach(p => p.classList.add('is-on'));
      await wait(380);
      Sound.clang(); spark(parts[0]);
      const v = Math.round((i + 1) / (STEPS.length + 1) * 100); bar.style.width = v + '%'; pct.textContent = v + '%';
      await wait(260);
    }
    if (finished) return;
    log.textContent = '> powering up CML core…';
    Sound.beep(); await wait(160); Sound.beep();
    robo.classList.add('is-alive'); bar.style.width = '100%'; pct.textContent = '100%';
    await wait(500);
    Sound.chime();
    log.textContent = "> hi! welcome to Micole's portfolio";
    await wait(1700);
    finish();
  };
  $('#bootSound').addEventListener('click', () => { Sound.unlock(); if (Sound.muted) Sound.setMuted(false); run(); });
  $('#bootMuted').addEventListener('click', () => { Sound.setMuted(true); run(); });
  $('#bootSkip').addEventListener('click', () => { Sound.unlock(); finish(); });
}

/* ---------- About: swinging ID badge ---------- */
function setupBadge() {
  const zone = $('#badgeZone'), sw = $('#swing'), badge = $('#badge'); if (!zone) return;
  let a = 0, v = 0, drag = false, moved = 0, lastA = 0;
  const pivot = () => { const r = zone.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top }; };
  const angleAt = (e) => { const p = pivot(); return Math.max(-70, Math.min(70, Math.atan2(p.x - e.clientX, e.clientY - p.y) * -180 / Math.PI)); };
  sw.addEventListener('pointerdown', (e) => { drag = true; moved = 0; lastA = a; sw.classList.add('is-drag'); try { sw.setPointerCapture(e.pointerId); } catch (_) {} });
  sw.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const t = angleAt(e); moved += Math.abs(t - a); v = (t - a) * .6; a = t; sw.style.setProperty('--a', a.toFixed(2) + 'deg');
  });
  const up = () => {
    if (!drag) return; drag = false; sw.classList.remove('is-drag');
    if (moved < 3) { badge.classList.toggle('is-flipped'); Sound.flip(); v += 3; }
  };
  sw.addEventListener('pointerup', up); sw.addEventListener('pointercancel', up);
  badge.addEventListener('click', (e) => { if (e.detail === 0) { badge.classList.toggle('is-flipped'); Sound.flip(); } });
  const loop = () => {
    if (!drag) { v += -a * .018; v *= .975; a += v; if (Math.abs(a) < .01 && Math.abs(v) < .01) { a = 0; v = 0; } sw.style.setProperty('--a', a.toFixed(2) + 'deg'); }
    requestAnimationFrame(loop);
  };
  loop();
  document.addEventListener('viewopen', (e) => { if (e.detail === 'about') { v = reduceMotion() ? 0 : 2.2; } });
}

document.addEventListener('DOMContentLoaded', () => {
  setupControls();
  setupBadge();
  setupBoot(() => setTimeout(() => Rig.build(), 250));
});

/* ---------- About: skill inspector ---------- */
const P = { sportzle: 'Intel Sportzle', laundry: 'CML Laundry', salrc: 'SALRC', helpdesk: 'Academic Helpdesk', site: 'This portfolio' };
const ALL4 = ['sportzle', 'laundry', 'salrc', 'helpdesk'];
const SKILLS = [
  { g: 'Skills', items: [
    ['HTML', '</>', 'The structure of every page I build, written to be clean and readable.', [...ALL4, 'site']],
    ['CSS', '{ }', 'Layouts, animations and responsive design that work on phones and laptops.', [...ALL4, 'site']],
    ['JavaScript', 'JS', 'Interactions, modals, live updates and the 3D device on this site.', ['sportzle', 'salrc', 'helpdesk', 'site']],
    ['PHP', 'php', 'The backend of all four systems: logins, forms, reports and business rules.', ALL4],
    ['MySQL', 'DB', 'Databases for users, records and transactions behind every system.', ALL4],
    ['Web development', 'www', 'Planning, building and putting complete web systems online.', [...ALL4, 'site']],
    ['Database management', 'SQL', 'Designing tables, relationships and queries that keep data organized.', ALL4],
    ['System testing', '✓', 'Checking each feature and flow before people use it.', ALL4],
    ['UI/UX design', 'UX', 'Clean, easy-to-use screens, planned before I start coding.', [...ALL4, 'site']],
  ] },
  { g: 'Tools', items: [
    ['VS Code', 'VS', 'My main editor for every project.', [...ALL4, 'site']],
    ['Laragon', 'L', 'Local server for running and testing PHP projects.', ALL4],
    ['phpMyAdmin', 'pma', 'Managing MySQL databases, tables and data.', ALL4],
    ['Git and GitHub', 'git', 'Version control and hosting for my code and this portfolio.', ['laundry', 'site']],
    ['Figma', '✎', 'UI mockups and layouts before coding.', []],
    ['Canva', 'Cv', 'Visuals, graphics and presentation materials.', []],
  ] },
  { g: 'How I work', items: [
    ['Communication', '💬', 'I explain ideas clearly and keep the team updated.', []],
    ['Problem-solving', '?!', 'I break problems down and debug step by step until it works.', []],
    ['Teamwork', '⇄', 'I work well with others and share tasks fairly.', []],
    ['Time management', '⏱', 'I plan my tasks and finish them on time.', []],
    ['Adaptability', '↻', "I learn new tools and approaches quickly when they're needed.", []],
  ] },
];
function setupSkills() {
  const groups = $('#skillGroups'); if (!groups) return;
  let n = 0;
  groups.innerHTML = SKILLS.map((grp, gi) => `<div class="box"><p class="box__k"><span>0${gi + 1}</span> ${grp.g}<em>${grp.items.length}</em></p><ul class="chips chips--big sk-chips">${grp.items.map(([name, glyph]) => `<li><button type="button" class="sk" data-sk="${n}" style="--d:${n++}"><b>${escapeHtml(glyph)}</b>${escapeHtml(name)}</button></li>`).join('')}</ul></div>`).join('');
  const flat = SKILLS.flatMap((grp) => grp.items.map((it, i) => ({ g: grp.g, i: i + 1, name: it[0], glyph: it[1], desc: it[2], used: it[3] })));
  const box = $('#inspect'), timerBar = $('#insTimer');
  let cur = -1, auto = true, t = null;
  const show = (k, user) => {
    const s = flat[k]; if (!s) return;
    cur = k;
    $$('.sk', groups).forEach(b => b.classList.toggle('is-on', +b.dataset.sk === k));
    box.classList.remove('is-swap'); void box.offsetWidth; box.classList.add('is-swap');
    $('#insGlyph').textContent = s.glyph;
    $('#insGroup').textContent = s.g + ' · ' + String(s.i).padStart(2, '0');
    $('#insName').textContent = s.name;
    $('#insDesc').textContent = s.desc;
    const soft = s.g === 'How I work';
    $('#insK').textContent = soft ? 'Where it shows' : s.used.length ? 'Used in' : 'Used for';
    $('#insList').innerHTML = soft ? '<span class="ins-chip ins-chip--soft">Group projects, school work and every system I built</span>'
      : s.used.length ? s.used.map((u, i) => u === 'site' ? `<span class="ins-chip" style="--d:${i}">${P[u]}</span>` : `<button type="button" class="ins-chip" data-proj="${u}" style="--d:${i}">${P[u]} <span aria-hidden="true">↗</span></button>`).join('')
      : '<span class="ins-chip ins-chip--soft">Design and planning work</span>';
    if (user) { auto = false; box.classList.add('is-manual'); Sound.select(); }
    restart();
  };
  const restart = () => {
    clearTimeout(t);
    timerBar.style.transition = 'none'; timerBar.style.width = '0'; void timerBar.offsetWidth;
    if (!auto || reduceMotion()) return;
    timerBar.style.transition = 'width 3.6s linear'; timerBar.style.width = '100%';
    t = setTimeout(() => { if (auto && !$('#view-about').hidden) show((cur + 1) % flat.length); }, 3600);
  };
  groups.addEventListener('click', (e) => { const b = e.target.closest('.sk'); if (b) show(+b.dataset.sk, true); });
  groups.addEventListener('pointerover', (e) => { if (e.target.closest('.sk')) Sound.tick(); });
  $('#insList').addEventListener('click', (e) => { const b = e.target.closest('[data-proj]'); if (b) openProject(b.dataset.proj); });
  document.addEventListener('viewopen', (e) => {
    if (e.detail !== 'about') return;
    groups.classList.remove('is-in'); void groups.offsetWidth; groups.classList.add('is-in');
    if (auto) show(cur < 0 ? 3 : cur); else restart();
  });
  show(3);
}
document.addEventListener('DOMContentLoaded', setupSkills);
