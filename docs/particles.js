/* ==========================================================
   Interactive particle field
   Dots can form any text, a globe or a moving wave.
   ========================================================== */
import * as THREE from 'three';

const FONT = '700 160px "Space Grotesk", Arial, sans-serif';

function textPoints(lines, count, maxW, maxH) {
  const c = document.createElement('canvas');
  const W = 1600, H = 900; c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#000';
  // fit every line to the canvas width
  g.font = FONT;
  const widest = Math.max(...lines.map(l => g.measureText(l).width), 1);
  const lineH = 175;
  const scale = Math.min(1, (W * .94) / widest, (H * .92) / (lines.length * lineH));
  g.font = FONT.replace('160px', Math.floor(160 * scale) + 'px');
  const lh = lineH * scale, y0 = H / 2 - (lines.length - 1) * lh / 2;
  lines.forEach((l, i) => g.fillText(l, W / 2, y0 + i * lh));
  const d = g.getImageData(0, 0, W, H).data, pts = [];
  let minX = W, maxX = 0, minY = H, maxY = 0;
  for (let y = 0; y < H; y += 3) for (let x = 0; x < W; x += 3) if (d[(y * W + x) * 4 + 3] > 128) {
    pts.push([x, y]); if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  const out = new Float32Array(count * 3);
  if (!pts.length) return out;
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  const s = Math.min(maxW / Math.max(1, maxX - minX), maxH / Math.max(1, maxY - minY));
  for (let i = 0; i < count; i++) {
    const p = pts[Math.floor(Math.random() * pts.length)];
    out[i * 3] = (p[0] - cx) * s;
    out[i * 3 + 1] = -(p[1] - cy) * s;
    out[i * 3 + 2] = (Math.random() - .5) * .25;
  }
  return out;
}
function spherePoints(count, r) {
  const out = new Float32Array(count * 3), g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2, rad = Math.sqrt(1 - y * y), t = g * i;
    out[i * 3] = Math.cos(t) * rad * r; out[i * 3 + 1] = y * r; out[i * 3 + 2] = Math.sin(t) * rad * r;
  }
  return out;
}
function gridPoints(count, w, d) {
  const out = new Float32Array(count * 3), side = Math.ceil(Math.sqrt(count));
  for (let i = 0; i < count; i++) {
    out[i * 3] = ((i % side) / side - .5) * w; out[i * 3 + 1] = 0; out[i * 3 + 2] = (Math.floor(i / side) / side - .5) * d;
  }
  return out;
}

export function initParticles(canvas, layout) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    if (!renderer.getContext()) throw 0;
  } catch (e) { return null; }

  const small = () => canvas.clientWidth < 700;
  const COUNT = innerWidth < 700 ? 4500 : 9000;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, .1, 100);
  camera.position.set(0, 0, 12);

  const pos = new Float32Array(COUNT * 3), seeds = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - .5) * 30; pos[i * 3 + 1] = (Math.random() - .5) * 18; pos[i * 3 + 2] = (Math.random() - .5) * 10;
    seeds[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('seed', new THREE.BufferAttribute(seeds, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uSize: { value: 2.4 * renderer.getPixelRatio() }, uA: { value: new THREE.Color('#141a33') }, uB: { value: new THREE.Color('#3355ff') } },
    vertexShader: `attribute float seed; uniform float uSize; varying float vSeed;
      void main(){ vSeed = seed; vec4 mv = modelViewMatrix * vec4(position,1.0);
        gl_PointSize = uSize * (12.0 / -mv.z) * (0.7 + seed * 0.6); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uA; uniform vec3 uB; varying float vSeed;
      void main(){ vec2 c = gl_PointCoord - 0.5; if (dot(c,c) > 0.25) discard;
        gl_FragColor = vec4(mix(uA, uB, step(0.82, vSeed)), 0.92); }`
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // the visible area at z=0, in world units
  const view = () => { const h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z; return { w: h * camera.aspect, h }; };

  let shape = new Float32Array(COUNT * 3), mode = 'text', lastText = null;
  const box = () => { // where the text should sit, from the page layout (fractions of the canvas)
    const v = view(), b = layout();
    return { w: v.w * b.w, h: v.h * b.h, x: (b.cx - .5) * v.w, y: -(b.cy - .5) * v.h };
  };
  const setText = (lines) => {
    lastText = lines; mode = 'text';
    const b = box();
    shape = textPoints(lines, COUNT, b.w, b.h);
    for (let i = 0; i < COUNT; i++) { shape[i * 3] += b.x; shape[i * 3 + 1] += b.y; }
  };
  const setGlobe = () => { mode = 'globe'; const b = box(); shape = spherePoints(COUNT, Math.min(b.h * .62, b.w * .4)); for (let i = 0; i < COUNT; i++) { shape[i * 3] += b.x; shape[i * 3 + 1] += b.y; } };
  const setWave = () => { mode = 'wave'; const b = box(); shape = gridPoints(COUNT, b.w * 1.1, b.h * 1.4); for (let i = 0; i < COUNT; i++) { shape[i * 3] += b.x; shape[i * 3 + 1] += b.y - b.h * .1; } };
  const scatter = () => { for (let i = 0; i < COUNT * 3; i++) geo.attributes.position.array[i] += (Math.random() - .5) * 6; };

  // pointer in world space
  const mouse = new THREE.Vector3(999, 999, 0), ndc = new THREE.Vector2(), ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera); ray.ray.intersectPlane(plane, mouse);
  });
  canvas.addEventListener('pointerleave', () => mouse.set(999, 999, 0));
  canvas.addEventListener('click', () => scatter());

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    if (mode === 'text' && lastText) setText(lastText); else if (mode === 'globe') setGlobe(); else if (mode === 'wave') setWave();
  };
  new ResizeObserver(resize).observe(canvas);

  let running = true;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clock = new THREE.Clock(), tgt = [0, 0, 0];
  const tick = () => {
    if (!running) return;
    requestAnimationFrame(tick);
    const t = clock.getElapsedTime(), p = geo.attributes.position.array, b = box();
    const lerp = reduce ? 1 : .08, cos = Math.cos(t * .35), sin = Math.sin(t * .35);
    for (let i = 0; i < COUNT; i++) {
      const j = i * 3;
      tgt[0] = shape[j]; tgt[1] = shape[j + 1]; tgt[2] = shape[j + 2];
      if (mode === 'globe' && !reduce) { // spin around the globe's own center
        const lx = tgt[0] - b.x, lz = tgt[2];
        tgt[0] = b.x + lx * cos - lz * sin; tgt[2] = lx * sin + lz * cos;
      }
      if (mode === 'wave') {
        const lx = tgt[0] - b.x, lz = tgt[2];
        tgt[1] += Math.sin(lx * .9 + t * 1.6) * Math.cos(lz * .9 + t * 1.2) * .5;
        tgt[1] += lz * .35; tgt[2] = lz * .6; // tilt toward the viewer
      }
      if (!reduce) tgt[2] += Math.sin(t * .8 + seeds[i] * 6.28) * .04;
      const dx = p[j] - mouse.x, dy = p[j + 1] - mouse.y, dd = dx * dx + dy * dy;
      if (dd < 1.6) { const f = (1.6 - dd) * .35; tgt[0] += dx * f; tgt[1] += dy * f; }
      p[j] += (tgt[0] - p[j]) * lerp; p[j + 1] += (tgt[1] - p[j + 1]) * lerp; p[j + 2] += (tgt[2] - p[j + 2]) * lerp;
    }
    geo.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  };
  resize(); tick();

  return { setText, setGlobe, setWave, scatter,
    pause() { running = false; }, resume() { if (!running) { running = true; tick(); } } };
}
