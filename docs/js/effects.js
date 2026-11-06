/* ==========================================================
   effects.js — sound engine, tech ambience, light/dark theme, window dock, robot loader and the ID badge
   ========================================================== */

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
