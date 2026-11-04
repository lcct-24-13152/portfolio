/* ==========================================================
   Micole's Desk — 3D room (Three.js)
   ========================================================== */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const CODE = [
  ['c', '<?php'],
  ['m', '// micole.php'],
  ['t', '$micole = ['],
  ['t', "  'name'   => 'Cher Micole P. Lirio',"],
  ['t', "  'course' => 'BS Information Technology',"],
  ['t', "  'school' => 'La Consolacion College Tanauan',"],
  ['t', "  'stack'  => ['PHP', 'MySQL', 'JavaScript'],"],
  ['t', "  'status' => 'open to OJT',"],
  ['t', '];'],
  ['t', ''],
  ['k', "echo build($micole['stack']);"],
  ['g', '// > systems: sportzle, laundry, salrc, helpdesk']
];

export function initDesk({ canvas, onProgress, onReady, onPick, onHover }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    if (!renderer.getContext()) throw new Error('no context');
  } catch (e) { return null; }

  const coarse = matchMedia('(pointer: coarse)').matches;
  renderer.setPixelRatio(Math.min(devicePixelRatio, coarse ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.45;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0f1220');
  scene.fog = new THREE.Fog('#0f1220', 10, 20);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
  camera.position.set(2.9, 2.35, 4.4);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(-0.35, 1.35, -0.9);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.rotateSpeed = 0.45;
  controls.minAzimuthAngle = -0.25;
  controls.maxAzimuthAngle = 1.05;
  controls.minPolarAngle = 0.95;
  controls.maxPolarAngle = 1.5;
  if (coarse) { controls.enabled = false; canvas.style.touchAction = 'pan-y'; }

  const manager = new THREE.LoadingManager();
  const loader = new THREE.TextureLoader(manager);
  manager.onProgress = (_u, done, total) => onProgress?.(Math.round(done / total * 100));
  const tex = (url) => { const t = loader.load(url); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };

  const std = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.05, ...extra });
  const box = (w, h, d, mat, x, y, z, parent = scene) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
  };
  const hotspots = [];
  const hot = (obj, target, label) => { obj.traverse(o => { if (o.isMesh) { o.userData.target = target; o.userData.label = label; hotspots.push(o); } }); };

  /* ---------- Canvas textures ---------- */
  const woodTex = (() => {
    const c = document.createElement('canvas'); c.width = 512; c.height = 512; const g = c.getContext('2d');
    g.fillStyle = '#2b1f1b'; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 8; i++) {
      g.fillStyle = i % 2 ? '#30231e' : '#271c18'; g.fillRect(0, i * 64, 512, 62);
      g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, i * 64 + 62, 512, 2);
      for (let k = 0; k < 30; k++) { g.fillStyle = 'rgba(255,255,255,.025)'; g.fillRect(Math.random() * 512, i * 64 + Math.random() * 60, 60 + Math.random() * 120, 1); }
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3); return t;
  })();

  // dusk sky + city for the window
  const skyCanvas = document.createElement('canvas'); skyCanvas.width = 1024; skyCanvas.height = 600;
  const sky = skyCanvas.getContext('2d');
  const buildings = [];
  for (let x = 0; x < 1024;) { const w = 40 + Math.random() * 70, h = 120 + Math.random() * 260; buildings.push({ x, w, h }); x += w + 4; }
  const drawSky = () => {
    const g = sky.createLinearGradient(0, 0, 0, 600);
    g.addColorStop(0, '#1b1440'); g.addColorStop(.45, '#5b3fa8'); g.addColorStop(.75, '#e2708a'); g.addColorStop(1, '#ffb86b');
    sky.fillStyle = g; sky.fillRect(0, 0, 1024, 600);
    for (let i = 0; i < 60; i++) { sky.fillStyle = `rgba(255,255,255,${Math.random() * .6})`; sky.fillRect(Math.random() * 1024, Math.random() * 220, 2, 2); }
    sky.fillStyle = 'rgba(255,230,200,.9)'; sky.beginPath(); sky.arc(780, 150, 34, 0, Math.PI * 2); sky.fill();
    buildings.forEach(b => {
      sky.fillStyle = '#120d24'; sky.fillRect(b.x, 600 - b.h, b.w, b.h);
      for (let wy = 600 - b.h + 12; wy < 590; wy += 18) for (let wx = b.x + 8; wx < b.x + b.w - 8; wx += 14)
        if (Math.random() > .55) { sky.fillStyle = Math.random() > .2 ? '#ffd27a' : '#9fd4ff'; sky.fillRect(wx, wy, 6, 8); }
    });
  };
  drawSky();
  const skyTex = new THREE.CanvasTexture(skyCanvas); skyTex.colorSpace = THREE.SRGBColorSpace;

  // monitor screen with typing PHP
  const scr = document.createElement('canvas'); scr.width = 1024; scr.height = 620;
  const sg = scr.getContext('2d');
  const colors = { c: '#c4b2ff', m: '#6b6480', t: '#e9e6f5', k: '#ffc94a', g: '#3ddc97' };
  let typed = 0; const total = CODE.reduce((a, [, s]) => a + s.length + 1, 0);
  const drawScreen = () => {
    sg.fillStyle = '#0d0b18'; sg.fillRect(0, 0, 1024, 620);
    sg.fillStyle = '#17132a'; sg.fillRect(0, 0, 1024, 46);
    ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { sg.fillStyle = c; sg.beginPath(); sg.arc(26 + i * 24, 23, 7, 0, 7); sg.fill(); });
    sg.fillStyle = '#8f8aa8'; sg.font = '22px monospace'; sg.fillText('micole.php', 120, 31);
    sg.font = 'bold 30px monospace';
    let left = typed, y = 92;
    CODE.forEach(([k, s], i) => {
      sg.fillStyle = '#4a4560'; sg.fillText(String(i + 1).padStart(2, ' '), 18, y);
      const part = s.slice(0, Math.max(0, left)); left -= s.length + 1;
      sg.fillStyle = colors[k]; sg.fillText(part, 70, y);
      if (left < 0 && left > -s.length - 2) { const w = sg.measureText(part).width; if (Math.floor(performance.now() / 500) % 2) { sg.fillStyle = '#3ddc97'; sg.fillRect(72 + w, y - 22, 13, 28); } }
      y += 44;
    });
  };
  drawScreen();
  const scrTex = new THREE.CanvasTexture(scr); scrTex.colorSpace = THREE.SRGBColorSpace;

  /* ---------- Room ---------- */
  const wallMat = std('#1b1e36', { roughness: .95 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), std('#ffffff', { map: woodTex, roughness: .7 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  box(7, 3.6, .1, wallMat, 0.6, 1.8, -2.3);            // back wall
  box(.1, 3.6, 6, wallMat, -2.7, 1.8, 0.6);            // left wall
  box(7, .1, .14, std('#141629'), 0.6, .05, -2.22);    // baseboard

  // window
  const win = new THREE.Group(); win.position.set(0.25, 2.35, -2.24); scene.add(win);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.3), new THREE.MeshBasicMaterial({ map: skyTex, toneMapped: false }));
  win.add(glass);
  const frameMat = std('#0b0c18', { roughness: .5 });
  box(2.45, .08, .08, frameMat, 0, .69, .02, win); box(2.45, .08, .08, frameMat, 0, -.69, .02, win);
  box(.08, 1.45, .08, frameMat, -1.2, 0, .02, win); box(.08, 1.45, .08, frameMat, 1.2, 0, .02, win);
  box(.05, 1.3, .06, frameMat, 0, 0, .02, win);
  box(2.6, .06, .26, std('#2a2340'), 0, -.74, .1, win); // sill

  /* ---------- Desk ---------- */
  const deskMat = std('#4a3428', { roughness: .55 });
  box(2.6, .08, 1.0, deskMat, 0.15, 1.0, -1.55);
  [[-1.05, -1.95], [1.35, -1.95], [-1.05, -1.15], [1.35, -1.15]].forEach(([x, z]) => box(.07, 1.0, .07, std('#1a1626', { metalness: .6, roughness: .4 }), x, .5, z));

  // monitor
  const monitor = new THREE.Group(); monitor.position.set(0.1, 1.04, -1.75); scene.add(monitor);
  box(1.36, .84, .05, std('#0b0a12', { roughness: .4 }), 0, .62, 0, monitor);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.28, .76), new THREE.MeshBasicMaterial({ map: scrTex, toneMapped: false }));
  screen.position.set(0, .62, .028); monitor.add(screen);
  box(.08, .3, .06, std('#16131f', { metalness: .5 }), 0, .17, -.02, monitor);
  box(.42, .03, .26, std('#16131f', { metalness: .5 }), 0, .02, 0, monitor);
  hot(monitor, 'projects', 'Projects');
  const screenGlow = new THREE.PointLight('#8c7cff', 1.2, 2.2); screenGlow.position.set(0.1, 1.6, -1.35); scene.add(screenGlow);

  // keyboard + mouse
  box(.8, .03, .26, std('#211c33'), 0.1, 1.055, -1.25);
  box(.1, .03, .16, std('#211c33'), 0.75, 1.055, -1.25);

  // mug
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(.06, .055, .13, 24), std('#a58bf5', { roughness: .4 }));
  mug.position.set(-0.55, 1.105, -1.25); mug.castShadow = true; scene.add(mug);

  // photo frame with her picture
  const photo = new THREE.Group(); photo.position.set(-0.78, 1.04, -1.85); photo.rotation.y = 0.35; scene.add(photo);
  box(.3, .36, .03, std('#f4f1ea', { roughness: .6 }), 0, .2, 0, photo);
  const pic = new THREE.Mesh(new THREE.PlaneGeometry(.24, .28), new THREE.MeshBasicMaterial({ map: tex('profile-photo.jpg'), color: '#e6e1f2' }));
  pic.position.set(0, .2, .017); photo.add(pic);
  box(.04, .3, .04, std('#cfc8b8'), 0, .12, -.06, photo).rotation.x = -.35;
  hot(photo, 'photo', 'View my photo');

  // plant
  const plant = new THREE.Group(); plant.position.set(1.15, 1.04, -1.8); scene.add(plant);
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(.11, .085, .2, 20), std('#e7dccb', { roughness: .7 })); pot.position.y = .1; pot.castShadow = true; plant.add(pot);
  const leafMat = std('#3ddc97', { roughness: .6 });
  const leaves = new THREE.Group(); leaves.position.y = .2; plant.add(leaves);
  for (let i = 0; i < 9; i++) {
    const l = new THREE.Mesh(new THREE.SphereGeometry(.07, 10, 8), leafMat);
    l.scale.set(.6, 1.9, .3); const a = i / 9 * Math.PI * 2;
    l.position.set(Math.cos(a) * .07, .14 + (i % 3) * .05, Math.sin(a) * .07);
    l.rotation.set(Math.sin(a) * .5, a, Math.cos(a) * .5); l.castShadow = true; leaves.add(l);
  }

  // desk lamp (click to toggle)
  const lamp = new THREE.Group(); lamp.position.set(-1.0, 1.04, -1.6); scene.add(lamp);
  const lampMat = std('#ffc94a', { roughness: .35, metalness: .3 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(.12, .14, .04, 24), lampMat); base.position.y = .02; lamp.add(base);
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, .62, 10), lampMat); arm.position.set(.08, .32, 0); arm.rotation.z = -.28; lamp.add(arm);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(.13, .18, 24, 1, true), new THREE.MeshStandardMaterial({ color: '#ffc94a', side: THREE.DoubleSide, roughness: .4 }));
  shade.position.set(.2, .62, .05); shade.rotation.z = .9; lamp.add(shade);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(.04, 12, 10), new THREE.MeshBasicMaterial({ color: '#fff3d0' }));
  bulb.position.set(.26, .58, .05); lamp.add(bulb);
  const lampLight = new THREE.SpotLight('#ffbf6b', 9, 4.5, .9, .5, 1.4);
  lampLight.position.set(-0.7, 1.62, -1.5); lampLight.target.position.set(-0.2, 1.0, -1.3);
  lampLight.castShadow = true; lampLight.shadow.mapSize.set(1024, 1024); lampLight.shadow.bias = -0.002;
  scene.add(lampLight, lampLight.target);
  hot(lamp, 'lamp', 'Toggle lamp');

  // chair
  const chair = new THREE.Group(); chair.position.set(0.25, 0, -0.45); chair.rotation.y = -0.25; scene.add(chair);
  const chairMat = std('#2c2546', { roughness: .7 });
  box(.6, .08, .58, chairMat, 0, .55, 0, chair);
  box(.6, .7, .07, chairMat, 0, 1.0, .29, chair);
  box(.05, .48, .05, std('#151221', { metalness: .6 }), 0, .3, 0, chair);
  [0, 1, 2, 3, 4].forEach(i => { const a = i / 5 * Math.PI * 2; const leg = box(.32, .04, .05, std('#151221', { metalness: .6 }), Math.cos(a) * .16, .05, Math.sin(a) * .16, chair); leg.rotation.y = -a; });

  // bookshelf
  const shelf = new THREE.Group(); shelf.position.set(-2.42, 0, -0.75); scene.add(shelf);
  const shelfMat = std('#3a2a22', { roughness: .6 });
  box(.42, 2.1, .06, shelfMat, 0, 1.05, -.6, shelf); box(.42, 2.1, .06, shelfMat, 0, 1.05, .6, shelf);
  box(.06, 2.1, 1.26, shelfMat, -.18, 1.05, 0, shelf);
  const bookColors = ['#a58bf5', '#ffc94a', '#3ddc97', '#5fa8ff', '#ff8a8a', '#c4b2ff', '#f5b83d'];
  [0.05, 0.6, 1.15, 1.7].forEach((y, row) => {
    box(.42, .04, 1.2, shelfMat, 0, y, 0, shelf);
    let z = -.52;
    while (z < .5) {
      const w = .05 + Math.random() * .05, h = .32 + Math.random() * .16;
      if (Math.random() > .12) box(.26, h, w, std(bookColors[Math.floor(Math.random() * bookColors.length)], { roughness: .7 }), .02, y + .02 + h / 2, z + w / 2, shelf);
      z += w + .012;
    }
  });
  hot(shelf, 'about', 'About me');

  // certificates on the wall
  const certs = new THREE.Group(); scene.add(certs);
  [['assets/certificates/network-technician-career-path-thumb.jpg', 1.95, 2.55], ['assets/certificates/html-essentials-statement-of-achievement-thumb.jpg', 2.75, 2.55], ['assets/certificates/bsit-educational-exposure-trip-thumb.jpg', 2.35, 1.85]].forEach(([url, x, y]) => {
    const g = new THREE.Group(); g.position.set(x, y, -2.22); certs.add(g);
    box(.66, .5, .03, std('#0b0a12', { roughness: .4 }), 0, 0, 0, g);
    const p = new THREE.Mesh(new THREE.PlaneGeometry(.58, .42), new THREE.MeshBasicMaterial({ map: tex(url), color: '#d9d4ea' }));
    p.position.z = .017; g.add(p);
  });
  hot(certs, 'certificates', 'Certificates');

  // neon "CML" sign on the left wall
  const nc = document.createElement('canvas'); nc.width = 512; nc.height = 256; const ng = nc.getContext('2d');
  ng.font = '800 150px sans-serif'; ng.textAlign = 'center'; ng.textBaseline = 'middle';
  ng.shadowColor = '#a58bf5'; ng.shadowBlur = 40; ng.fillStyle = '#e9e1ff';
  ng.fillText('CML', 256, 130); ng.shadowBlur = 18; ng.fillText('CML', 256, 130);
  ng.shadowColor = '#ffc94a'; ng.fillStyle = '#ffc94a'; ng.beginPath(); ng.arc(440, 50, 16, 0, 7); ng.fill();
  const neonTex = new THREE.CanvasTexture(nc); neonTex.colorSpace = THREE.SRGBColorSpace;
  const neon = new THREE.Mesh(new THREE.PlaneGeometry(1.0, .5), new THREE.MeshBasicMaterial({ map: neonTex, transparent: true, toneMapped: false }));
  neon.position.set(-2.64, 2.55, -0.75); neon.rotation.y = Math.PI / 2; scene.add(neon);
  const neonLight = new THREE.PointLight('#8f6cff', 3, 3); neonLight.position.set(-2.3, 2.55, -0.75); scene.add(neonLight);

  // rug
  const rug = new THREE.Mesh(new THREE.CircleGeometry(1.4, 48), std('#251d3d', { roughness: 1 }));
  rug.rotation.x = -Math.PI / 2; rug.position.set(0.3, .005, -0.4); rug.receiveShadow = true; scene.add(rug);

  /* ---------- Lights ---------- */
  scene.add(new THREE.HemisphereLight('#8b7ae6', '#2a1830', 1.1));
  scene.add(new THREE.AmbientLight('#3a3266', .6));
  const dusk = new THREE.DirectionalLight('#ffb3c7', 1.1);
  dusk.position.set(1.2, 3.4, -4); dusk.target.position.set(0, 1, 0);
  dusk.castShadow = true; dusk.shadow.mapSize.set(1024, 1024);
  Object.assign(dusk.shadow.camera, { left: -4, right: 4, top: 4, bottom: -2 });
  scene.add(dusk, dusk.target);
  const fill = new THREE.PointLight('#7d8cff', 2.2, 10); fill.position.set(3, 2.8, 2.5); scene.add(fill);

  /* ---------- Picking ---------- */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let hovered = null, downAt = null;
  const pick = (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(hotspots, false)[0];
    return hit ? hit.object : null;
  };
  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    const o = pick(e);
    const label = o ? o.userData.label : null;
    if (label !== hovered) { hovered = label; canvas.style.cursor = label ? 'pointer' : 'grab'; onHover?.(label, e); }
    else if (label) onHover?.(label, e);
  });
  canvas.addEventListener('pointerleave', () => { hovered = null; onHover?.(null); });
  canvas.addEventListener('pointerdown', (e) => { downAt = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener('pointerup', (e) => {
    if (!downAt || Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 6) { downAt = null; return; }
    downAt = null;
    const o = pick(e);
    if (!o) return;
    if (o.userData.target === 'lamp') { lampLight.visible = !lampLight.visible; bulb.material.color.set(lampLight.visible ? '#fff3d0' : '#4a4030'); return; }
    onPick?.(o.userData.target);
  });

  /* ---------- Size + loop ---------- */
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 0.9 ? 58 : 40;   // phones need a wider view
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(canvas);
  resize();

  let running = true, lastScreen = 0, lastSky = 0, readyFired = false;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clock = new THREE.Clock();
  const tick = () => {
    if (!running) return;
    requestAnimationFrame(tick);
    const t = clock.getElapsedTime(), now = performance.now();
    if (!reduce) {
      leaves.rotation.z = Math.sin(t * 1.3) * .04;
      neonLight.intensity = 2.2 + Math.sin(t * 7) * .15 + (Math.random() > .985 ? -1.2 : 0);
      if (coarse) { // gentle sway on phones instead of dragging
        const a = .45 + Math.sin(t * .25) * .3;
        camera.position.set(controls.target.x + Math.sin(a) * 6.3, 2.45, controls.target.z + Math.cos(a) * 6.3);
        camera.lookAt(controls.target);
      }
    }
    if (now - lastScreen > 90) { typed = (typed + 1) % (total + 40); drawScreen(); scrTex.needsUpdate = true; lastScreen = now; }
    if (now - lastSky > 2500) { drawSky(); skyTex.needsUpdate = true; lastSky = now; }
    if (!coarse) controls.update();
    renderer.render(scene, camera);
    if (!readyFired) { readyFired = true; }
  };
  manager.onLoad = () => { onProgress?.(100); setTimeout(() => onReady?.(), 200); };
  tick();

  return {
    pause() { running = false; },
    resume() { if (!running) { running = true; clock.getDelta(); tick(); } }
  };
}
