// Arqli: "Mekânını tasarla". The visitor picks a style, a wall detail, a floor, a light and the room
// size; the room from js/room.js is rebuilt in 3D with those choices. Drag (or arrow keys on the
// focused view) turns it; day / evening switches the light. The result goes to Instagram as a message.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { build, STYLES, FLOORS, FEATURES, LAMPS } from './room.js?v=1';

const form = document.getElementById('des-form');
const view = document.getElementById('view');
const canvas = document.getElementById('s3d');
const spec = document.getElementById('des-spec');
const mood = document.getElementById('mood');
const oW = document.getElementById('o-w'), oD = document.getElementById('o-d');

function readCfg() {
  const f = new FormData(form);
  return {
    style: f.get('style'), feature: f.get('feature'), floor: f.get('floor'), lamp: f.get('lamp'),
    kelvin: +f.get('kelvin'), W: +f.get('W') / 100, D: +f.get('D') / 100,
  };
}

// the numbers and the message work without WebGL too
function summary(c) {
  const P = STYLES[c.style];
  oW.textContent = `${Math.round(c.W * 100)} cm`; oD.textContent = `${Math.round(c.D * 100)} cm`;
  const rows = [
    ['Alan', `${(c.W * c.D).toFixed(1).replace('.', ',')} m²`],
    ['Stil', P.name],
    ['Duvar', FEATURES[c.feature]],
    ['Zemin', FLOORS[c.floor]],
    ['Aydınlatma', LAMPS[c.lamp]],
    ['Işık rengi', `${c.kelvin} K`],
  ];
  spec.replaceChildren(...rows.map(([k, v]) => { const d = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = k; dd.textContent = v; d.append(dt, dd); return d; }));
  mood.replaceChildren(...[P.wall, P.wood, P.fabric, P.accent, P.stone, P.metal].map(col => { const li = document.createElement('li'); li.style.background = col; li.title = col; return li; }));
  return ['Merhaba Arqli, sitenizdeki tasarım aracında bir salon kurdum:',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    `Ölçü: ${Math.round(c.W * 100)} × ${Math.round(c.D * 100)} cm`,
    'Bu yönde bir proje için görüşmek isterim.'].join('\n');
}
let cfg = readCfg(), message = summary(cfg);
document.getElementById('des-send').addEventListener('click', () => window.Arqli?.copyAndOpen(message));

// ---------- 3D, set up when the section comes near ----------
let three = null;
const near = new IntersectionObserver(es => {
  if (es.some(e => e.isIntersecting)) { near.disconnect(); setup(); }
}, { rootMargin: '700px 0px' });
near.observe(view);

function setup() {
  if (!document.createElement('canvas').getContext('webgl2')) { view.classList.add('failed'); return; }
  const small = innerWidth <= 760;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = small ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
  const camera = new THREE.PerspectiveCamera(34, 16 / 11, .1, 80);
  const BG = { day: new THREE.Color('#d9d1c4'), eve: new THREE.Color('#1a1814') };
  scene.background = new THREE.Color();

  let room = null, ev = 1, evTarget = 1;
  // orbit: yaw around the room, kept on the open sides so a wall never blocks the view
  let yaw = .72, pitch = .42, yawT = yaw, pitchT = pitch, dist = 1;
  const look = new THREE.Vector3(-.3, 1.0, -.4);

  function dispose(obj) {
    obj.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { for (const k in m) if (m[k]?.isTexture && !m[k].userData?.shared) m[k].dispose?.(); m.dispose(); });
    });
  }
  function rebuild() {
    if (room) { scene.remove(room.group); dispose(room.group); }
    room = build(cfg);
    // finished room: hide the drawing outlines and dimensions
    room.parts.forEach(p => p.lines.forEach(l => { l.visible = false; }));
    room.dimGroup.visible = false;
    scene.add(room.group);
    dist = Math.max(cfg.W, cfg.D) * 1.62 + 1.6;
    look.set(-cfg.W * .06, 1, -cfg.D * .1);
    applyLight(); render();
  }
  function applyLight() {
    room.setEvening(ev);
    scene.environmentIntensity = 1 - .82 * ev;
    scene.background.copy(BG.day).lerp(BG.eve, ev);
  }
  function render() {
    const fit = camera.aspect < 1.2 ? 1 + (1.2 / camera.aspect - 1) * .6 : 1;
    const d = dist * fit;
    camera.position.set(look.x + Math.sin(yaw) * Math.cos(pitch) * d, look.y + Math.sin(pitch) * d, look.z + Math.cos(yaw) * Math.cos(pitch) * d);
    camera.lookAt(look);
    renderer.render(scene, camera);
  }
  function size() {
    const w = view.clientWidth, h = view.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); render();
  }

  // animate yaw / pitch / evening towards their targets
  let raf = 0;
  function tick() {
    yaw += (yawT - yaw) * .18; pitch += (pitchT - pitch) * .18; ev += (evTarget - ev) * .12;
    if (Math.abs(yawT - yaw) < 1e-4 && Math.abs(pitchT - pitch) < 1e-4 && Math.abs(evTarget - ev) < 1e-3) { yaw = yawT; pitch = pitchT; ev = evTarget; raf = 0; }
    else raf = requestAnimationFrame(tick);
    applyLight(); render();
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  const YAW = [-.2, 1.45], PITCH = [.12, .9];

  let drag = null;
  canvas.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, yaw: yawT, pitch: pitchT, id: e.pointerId, moved: false }; });
  addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.abs(dx) > 4 && Math.abs(dx) > Math.abs(dy)) { drag.moved = true; canvas.setPointerCapture?.(e.pointerId); view.classList.add('touched'); }
    if (!drag.moved) return;
    yawT = THREE.MathUtils.clamp(drag.yaw - dx * .006, ...YAW);
    if (e.pointerType === 'mouse') pitchT = THREE.MathUtils.clamp(drag.pitch + dy * .004, ...PITCH);
    kick();
  });
  addEventListener('pointerup', () => { drag = null; });
  addEventListener('pointercancel', () => { drag = null; });
  canvas.addEventListener('keydown', e => {
    const k = { ArrowLeft: [-.12, 0], ArrowRight: [.12, 0], ArrowUp: [0, .08], ArrowDown: [0, -.08] }[e.key];
    if (!k) return; e.preventDefault(); view.classList.add('touched');
    yawT = THREE.MathUtils.clamp(yawT + k[0], ...YAW); pitchT = THREE.MathUtils.clamp(pitchT + k[1], ...PITCH); kick();
  });
  view.querySelectorAll('.daynight button').forEach(b => b.addEventListener('click', () => {
    evTarget = +b.dataset.ev;
    view.querySelectorAll('.daynight button').forEach(o => o.setAttribute('aria-pressed', o === b));
    kick();
  }));
  addEventListener('resize', size);
  THREE.DefaultLoadingManager.onLoad = (prev => () => { prev?.(); render(); })(THREE.DefaultLoadingManager.onLoad);

  three = { rebuild };
  size(); rebuild();
  renderer.compileAsync(scene, camera).catch(() => {}).then(() => { render(); view.classList.add('ready'); });
  // a slow sway until the visitor touches the view (not with reduced motion)
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let t0 = performance.now();
    const sway = new IntersectionObserver(es => { swayOn = es[0].isIntersecting; if (swayOn) requestAnimationFrame(loop); }, { threshold: .2 });
    let swayOn = false;
    function loop(now) {
      if (!swayOn || view.classList.contains('touched')) return;
      yawT = .72 + Math.sin((now - t0) / 4200) * .32; kick();
      requestAnimationFrame(loop);
    }
    sway.observe(view);
  }
}

form.addEventListener('input', () => {
  const next = readCfg();
  const changed = JSON.stringify(next) !== JSON.stringify(cfg);
  cfg = next; message = summary(cfg);
  if (changed && three) {
    // sliders rebuild at most once a frame
    cancelAnimationFrame(form._r); form._r = requestAnimationFrame(() => three.rebuild());
  }
});
form.addEventListener('submit', e => e.preventDefault());
