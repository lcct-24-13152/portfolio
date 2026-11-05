/* ==========================================================
   Particle hero: dots form the name, then a globe, then a wave
   ========================================================== */
import * as THREE from 'three';

function textPoints(lines, count) {
  const c = document.createElement('canvas');
  const W = 1200, H = 520; c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#000'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '800 190px "Space Grotesk", Arial, sans-serif';
  g.fillText(lines[0], W / 2, H * 0.3);
  g.fillText(lines[1], W / 2, H * 0.72);
  const data = g.getImageData(0, 0, W, H).data, pts = [];
  for (let y = 0; y < H; y += 3) for (let x = 0; x < W; x += 3) if (data[(y * W + x) * 4 + 3] > 128) pts.push([x, y]);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const p = pts[Math.floor(Math.random() * pts.length)] || [W / 2, H / 2];
    out[i * 3] = (p[0] - W / 2) / 110;
    out[i * 3 + 1] = -(p[1] - H / 2) / 110;
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
function gridPoints(count) {
  const out = new Float32Array(count * 3), side = Math.ceil(Math.sqrt(count));
  for (let i = 0; i < count; i++) {
    const gx = i % side, gz = Math.floor(i / side);
    out[i * 3] = (gx / side - .5) * 11; out[i * 3 + 1] = 0; out[i * 3 + 2] = (gz / side - .5) * 7;
  }
  return out;
}

export function initParticles(canvas, opts = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    if (!renderer.getContext()) throw 0;
  } catch (e) { return null; }

  const small = innerWidth < 700;
  const COUNT = small ? 4200 : 9000;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, .1, 100);
  camera.position.set(0, 0, small ? 15 : 11);

  const nameLines = opts.name || ['MICOLE', 'LIRIO'];
  const shapes = [textPoints(nameLines, COUNT), spherePoints(COUNT, 3.2), gridPoints(COUNT)];
  if (small) for (let i = 0; i < COUNT * 3; i++) shapes[0][i] *= .62;

  const pos = new Float32Array(COUNT * 3);
  const seeds = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - .5) * 30; pos[i * 3 + 1] = (Math.random() - .5) * 18; pos[i * 3 + 2] = (Math.random() - .5) * 10;
    seeds[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('seed', new THREE.BufferAttribute(seeds, 1));

  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uSize: { value: (small ? 2.6 : 2.4) * renderer.getPixelRatio() }, uA: { value: new THREE.Color('#141a33') }, uB: { value: new THREE.Color('#3355ff') } },
    vertexShader: `attribute float seed; uniform float uSize; varying float vSeed; varying float vDepth;
      void main(){ vSeed = seed; vec4 mv = modelViewMatrix * vec4(position,1.0); vDepth = -mv.z;
        gl_PointSize = uSize * (12.0 / -mv.z) * (0.7 + seed * 0.6); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uA; uniform vec3 uB; varying float vSeed; varying float vDepth;
      void main(){ vec2 c = gl_PointCoord - 0.5; if (dot(c,c) > 0.25) discard;
        vec3 col = mix(uA, uB, step(0.82, vSeed)); gl_FragColor = vec4(col, 0.9); }`
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // pointer in world space (z=0 plane)
  const mouse = new THREE.Vector3(999, 999, 0), ndc = new THREE.Vector2(), ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    if (e.clientY < r.top || e.clientY > r.bottom) { mouse.set(999, 999, 0); return; }
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera); ray.ray.intersectPlane(plane, mouse);
  }, { passive: true });
  canvas.addEventListener('pointerleave', () => mouse.set(999, 999, 0));

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(canvas); resize();

  let progress = 0, running = true;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const target = new Float32Array(3);
  const clock = new THREE.Clock();

  const tick = () => {
    if (!running) return;
    requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    // progress 0..1 -> stage 0 (name) .. 1 (globe) .. 2 (wave)
    const s = Math.min(1.999, progress * 2), a = Math.floor(s), k = ease(s - a);
    const A = shapes[a], B = shapes[a + 1];
    const p = geo.attributes.position.array;
    const lerp = reduce ? 1 : 0.075;
    for (let i = 0; i < COUNT; i++) {
      const j = i * 3;
      for (let d = 0; d < 3; d++) target[d] = A[j + d] + (B[j + d] - A[j + d]) * k;
      if (a + k > 1.02) { // wave stage
        const w = Math.min(1, a + k - 1);
        target[1] += Math.sin(target[0] * .9 + t * 1.6) * Math.cos(target[2] * .9 + t * 1.2) * .55 * w - 1.1 * w;
      }
      if (!reduce) target[2] += Math.sin(t * .8 + seeds[i] * 6.28) * .04;
      // pointer repulsion
      const dx = p[j] - mouse.x, dy = p[j + 1] - mouse.y, dd = dx * dx + dy * dy;
      if (dd < 1.6) { const f = (1.6 - dd) * .35; target[0] += dx * f; target[1] += dy * f; }
      p[j] += (target[0] - p[j]) * lerp; p[j + 1] += (target[1] - p[j + 1]) * lerp; p[j + 2] += (target[2] - p[j + 2]) * lerp;
    }
    geo.attributes.position.needsUpdate = true;
    // globe spins, wave tilts
    const globe = Math.max(0, 1 - Math.abs(s - 1));
    points.rotation.y = reduce ? 0 : t * .25 * globe;
    points.rotation.x = (s > 1 ? (s - 1) * .55 : 0);
    points.position.x = small ? 0 : Math.min(1, s) * 2.6;
    points.position.y = small ? Math.min(1, s) * 1.2 : 0;
    renderer.render(scene, camera);
  };
  tick();

  return {
    setProgress(v) { progress = Math.max(0, Math.min(1, v)); },
    pause() { running = false; },
    resume() { if (!running) { running = true; tick(); } }
  };
}
