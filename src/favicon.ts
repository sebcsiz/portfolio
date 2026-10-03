// Animated tab icon: a tile that spins like a coin between a soccer ball, a snowboarder doing a
// method grab, and a space invader. Browsers won't animate SVG favicons, so each frame is drawn
// on a canvas and swapped in as a PNG.

const SIZE = 64;
const HOLD = 1500; // ms each icon faces forward
const SPIN = 600; // ms for the half-turn to the next icon
const TAU = Math.PI * 2;

type Draw = (ctx: CanvasRenderingContext2D) => void;

const line = (ctx: CanvasRenderingContext2D, width: number, ...pts: number[][]) => {
  ctx.lineWidth = width;
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();
};

const ball: Draw = (ctx) => {
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.arc(32, 32, 21, 0, TAU);
  ctx.stroke();
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = -Math.PI / 2 + (i * TAU) / 5;
    return [32 + Math.cos(a) * 8.5, 32 + Math.sin(a) * 8.5];
  });
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fill();
  for (const [x, y] of pts) line(ctx, 3.5, [x, y], [32 + (x - 32) * 2.35, 32 + (y - 32) * 2.35]);
};

// side-on grab: legs tucked into a "<", board underneath, front hand down on the edge, back arm up behind
const rider: Draw = (ctx) => {
  line(ctx, 6.5, [11, 50], [45, 43.5]); // board, nose tipped up
  line(ctx, 6.5, [38, 19], [29, 32]); // torso leaning into the trick
  line(ctx, 5.5, [29, 32], [42, 34], [36, 45.5]); // front leg
  line(ctx, 5.5, [29, 32], [33, 40], [22, 48]); // back leg
  line(ctx, 4, [36, 22], [45, 29], [41, 44]); // grab
  line(ctx, 4, [35, 21], [24, 15], [17, 9]); // style arm
  ctx.beginPath();
  ctx.arc(42, 12, 5.5, 0, TAU);
  ctx.fill();
};

// the classic 11×8 invader
const sprite = ["..X.....X..", "...X...X...", "..XXXXXXX..", ".XX.XXX.XX.", "XXXXXXXXXXX", "X.XXXXXXX.X", "X.X.....X.X", "...XX.XX..."];
const invader: Draw = (ctx) => {
  const px = 5;
  const ox = (SIZE - 11 * px) / 2;
  const oy = (SIZE - 8 * px) / 2;
  sprite.forEach((row, y) => [...row].forEach((cell, x) => cell === "X" && ctx.fillRect(ox + x * px, oy + y * px, px, px)));
};

const icons = [ball, rider, invader];

export function startFavicon() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.append(link);
  }
  link.type = "image/png";
  const spin = !matchMedia("(prefers-reduced-motion: reduce)").matches;
  let last = "";

  const frame = () => {
    const now = performance.now();
    const k = Math.floor(now / (HOLD + SPIN)) % icons.length;
    const t = now % (HOLD + SPIN);
    let icon = k;
    let scale = 1;
    if (t > HOLD && spin) {
      const f = (t - HOLD) / SPIN; // 0 → 1 across the half-turn
      scale = Math.max(0.04, Math.abs(Math.cos(f * Math.PI)));
      icon = f < 0.5 ? k : (k + 1) % icons.length;
    }
    // follow the current theme's accent colour
    const accent = `rgb(${getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "43 212 106"})`;
    const key = `${icon}${scale.toFixed(2)}${accent}`;
    if (key === last) return;
    last = key;

    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.save();
    ctx.translate(SIZE / 2, 0);
    ctx.scale(scale, 1);
    ctx.translate(-SIZE / 2, 0);
    ctx.fillStyle = "#0e0e0c";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(0, 0, SIZE, SIZE, 14);
    else ctx.rect(0, 0, SIZE, SIZE); // browsers from before 2023
    ctx.fill();
    ctx.fillStyle = ctx.strokeStyle = accent;
    ctx.lineCap = ctx.lineJoin = "round";
    icons[icon](ctx);
    ctx.restore();
    link.href = canvas.toDataURL("image/png");
  };

  frame();
  setInterval(frame, 60);
}
