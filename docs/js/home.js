/* ==========================================================
   home.js — the 3D CML device, portal transitions, section windows, deep links and the contact form
   ========================================================== */

/* ---------- Home: the CML device (drag to spin 360°) ---------- */
const Rig = { build() {} };
function setupRig() {
  const stage = $('#stage'), rig = $('#rig'), read = $('#padRead span'), out = $('#padReadOut');
  const fit = () => {
    const phone = innerWidth <= 600, mid = innerWidth <= 1000;
    const s = Math.min(stage.clientWidth / (phone ? 690 : mid ? 920 : innerWidth <= 1280 ? 900 : 770), stage.clientHeight / (phone ? 520 : mid ? 640 : 500), 1.5);
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
  const HOME_TITLE = document.title;

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
    document.title = v.dataset.title + ' | Cher Micole P. Lirio';
    $('.vtab.is-on', v)?.scrollIntoView({ block: 'nearest', inline: 'center' });
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
    document.title = HOME_TITLE;
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
    document.title = HOME_TITLE;
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
  $$('[data-next]').forEach(b => b.addEventListener('click', (e) => { if (current && current.id === 'view-' + b.dataset.next) return; Sound.select(); go(b.dataset.next, { x: e.clientX || innerWidth / 2, y: e.clientY || innerHeight / 2 }); }));
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
// Fill these in to send the designed email template through EmailJS (falls back to Web3Forms)
const EMAILJS = { service: 'service_pgjuzqr', template: 'template_u70o1a5', publicKey: 'NM4W1DD9vhp62mRKb' };
const WEB3FORMS_KEY = 'b148b811-9d19-457f-bf53-dd725301fbbb';
async function sendMail(m) {
  const subject = 'Portfolio message: ' + m.topic + ' from ' + m.name;
  if (EMAILJS.service && EMAILJS.template && EMAILJS.publicKey) { // designed HTML email
    try {
      const r = await fetch('https://api.emailjs.com/api/v1.0/email/send', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_id: EMAILJS.service, template_id: EMAILJS.template, user_id: EMAILJS.publicKey,
          template_params: { from_name: m.name, reply_to: m.email, topic: m.topic, message: m.message,
            sent_at: new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Manila' }).format(new Date()) + ' (PH time)' } }) });
      if (r.ok) return; console.warn('EmailJS:', r.status, await r.text());
    } catch (e) { console.warn('EmailJS blocked:', e.message); }
  }
  if (WEB3FORMS_KEY) {
    const r = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: '📬 New ' + m.topic + ' message from ' + m.name,
        from_name: "Micole's Portfolio",
        replyto: m.email,
        '👤 Name': m.name,
        '📧 Email': m.email,
        '🏷️ Topic': m.topic,
        '💬 Message': m.message,
        '🕒 Sent': new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Manila' }).format(new Date()) + ' (PH time)',
        '↩️ How to reply': 'Just press Reply. It goes straight to ' + m.email,
      }) });
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
