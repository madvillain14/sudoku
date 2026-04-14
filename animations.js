// Background: Chapter 39 — "FlowingPattern" (loosely inspired by way-of-code-data/chapters/39/artifact.tsx).
// Grid points drift along a noise-driven flow field. Pink strokes, looping forever.

function fitCanvas(canvas) {
  const dpr = 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

const ALPHA_BUCKETS = 12;
const STROKE_CACHE = new Array(ALPHA_BUCKETS);
const FILL_CACHE = new Array(ALPHA_BUCKETS);
for (let i = 0; i < ALPHA_BUCKETS; i++) {
  const a = (i + 1) / ALPHA_BUCKETS * 0.6;
  STROKE_CACHE[i] = `rgba(198, 84, 126, ${a.toFixed(3)})`;
  FILL_CACHE[i] = `rgba(168, 56, 102, ${(a * 0.5).toFixed(3)})`;
}

function flowingPattern(canvas) {
  let { ctx, w, h } = fitCanvas(canvas);
  const gridSize = 22;
  let points = [];
  let initialCount = 0;
  function rebuild() {
    points = [];
    for (let x = gridSize / 2; x < w; x += gridSize) {
      for (let y = gridSize / 2; y < h; y += gridSize) {
        points.push({ x, y, vx: 0, vy: 0 });
      }
    }
    initialCount = points.length;
  }
  rebuild();

  let resizeTimer = null;
  function resize() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ({ ctx, w, h } = fitCanvas(canvas));
      rebuild();
    }, 150);
  }
  window.addEventListener('resize', resize);

  function noise(x, y, t) {
    const s1 = Math.sin(x * 0.01 + t);
    const s2 = Math.sin(y * 0.01 + t * 0.8);
    const s3 = Math.sin((x + y) * 0.005 + t * 1.2);
    return (s1 + s2 + s3) / 3;
  }

  let t = 0;
  let raf = null;
  let running = false;
  let celebrateUntil = 0;

  function frame() {
    const now = performance.now();
    const boosting = now < celebrateUntil;
    const boost = boosting ? 1 + (celebrateUntil - now) / 2500 : 1;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(0, 0, w, h);

    t += 0.005 * boost;

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const n = noise(p.x, p.y, t);
      const angle = n * Math.PI * 4;
      p.vx = (p.vx + Math.cos(angle) * 0.1 * boost) * 0.95;
      p.vy = (p.vy + Math.sin(angle) * 0.1 * boost) * 0.95;

      const nx = p.x + p.vx;
      const ny = p.y + p.vy;
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      let bucket = Math.floor(speed * 5 * ALPHA_BUCKETS / 0.6);
      if (bucket < 0) bucket = 0;
      else if (bucket >= ALPHA_BUCKETS) bucket = ALPHA_BUCKETS - 1;

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = STROKE_CACHE[bucket];
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(p.x, p.y, 0.6, 0, Math.PI * 2);
      ctx.fillStyle = FILL_CACHE[bucket];
      ctx.fill();

      p.x = nx; p.y = ny;
      if (p.x < 0) p.x = w;
      else if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      else if (p.y > h) p.y = 0;

      const modX = p.x % gridSize;
      const modY = p.y % gridSize;
      p.x += (gridSize / 2 - modX) * 0.01;
      p.y += (gridSize / 2 - modY) * 0.01;
    }

    raf = requestAnimationFrame(frame);
  }

  let spawnTimer = null;
  function scheduleSpawn() {
    const delay = 3500 + Math.random() * 3500;
    spawnTimer = setTimeout(() => {
      const cx = Math.random() * w;
      const cy = Math.random() * h;
      const cols = 6 + Math.floor(Math.random() * 5);
      const rows = 6 + Math.floor(Math.random() * 5);
      const startX = cx - (cols * gridSize) / 2;
      const startY = cy - (rows * gridSize) / 2;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = startX + (i + 0.5) * gridSize;
          const y = startY + (j + 0.5) * gridSize;
          if (x < 0 || x > w || y < 0 || y > h) continue;
          points.push({ x, y, vx: 0, vy: 0 });
        }
      }
      const maxPoints = Math.ceil(initialCount * 1.4);
      if (points.length > maxPoints) {
        points.splice(initialCount, points.length - maxPoints);
      }
      scheduleSpawn();
    }, delay);
  }

  function start() {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(frame);
    scheduleSpawn();
  }
  function stop() {
    running = false;
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    if (spawnTimer) { clearTimeout(spawnTimer); spawnTimer = null; }
  }

  start();

  function onVisibility() {
    if (document.hidden) stop();
    else start();
  }
  document.addEventListener('visibilitychange', onVisibility);

  function celebrate() {
    celebrateUntil = performance.now() + 2500;
    const burstCount = 3;
    for (let b = 0; b < burstCount; b++) {
      const cx = Math.random() * w;
      const cy = Math.random() * h;
      const cols = 7 + Math.floor(Math.random() * 4);
      const rows = 7 + Math.floor(Math.random() * 4);
      const startX = cx - (cols * gridSize) / 2;
      const startY = cy - (rows * gridSize) / 2;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = startX + (i + 0.5) * gridSize;
          const y = startY + (j + 0.5) * gridSize;
          if (x < 0 || x > w || y < 0 || y > h) continue;
          const ang = Math.random() * Math.PI * 2;
          points.push({ x, y, vx: Math.cos(ang) * 0.8, vy: Math.sin(ang) * 0.8 });
        }
      }
    }
    const maxPoints = Math.ceil(initialCount * 1.4);
    if (points.length > maxPoints) {
      points.splice(initialCount, points.length - maxPoints);
    }
  }

  return {
    stop: () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    },
    celebrate,
  };
}

export function startRandomBackground(canvas) {
  const handle = flowingPattern(canvas);
  return { n: 39, stop: handle.stop, celebrate: handle.celebrate };
}
