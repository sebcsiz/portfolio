import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, type MotionStyle } from "framer-motion";
import Frame, { stage } from "../components/Frame";
import Name from "../components/Name";
import { spots, type Go, type RoomId, type Spot } from "../data/rooms";

type Orientation = "land" | "port";

// scenery in % of the stage (the svg stretches to fit), one version per screen orientation
const ridge = {
  land: "M0 100 L0 72 C7 66 13 62 19 63 L29 54 C35 48 39 46 43 42 L51 32 C55 26 60 19 64 14 C66 11.5 68 11.5 70 14 L78 25 C82 30 86 34 90 40 L100 49 L100 100 Z",
  port: "M0 100 L0 63 C9 59 17 54 23 51 L35 44 L45 38 C51 34 55 31 58 29 C60 27.5 62 27.5 64 29 L75 38 C83 44 91 48 100 52 L100 100 Z",
};
const range = {
  land: "M0 62 L8 52 L15 56 L26 40 L35 50 L42 46 L49 52 L57 45 L64 60 L100 60 L100 100 L0 100 Z",
  port: "M0 52 L12 43 L20 47 L33 35 L44 44 L52 40 L60 47 L70 60 L100 60 L100 100 L0 100 Z",
};
const snowcap = {
  land: "M57 24 L64 14 C66 11.5 68 11.5 70 14 L77 24 L73.5 22 L71 25.5 L68 22 L65 25.5 L62 22.5 Z",
  port: "M53 33 L58 29 C60 27.5 62 27.5 64 29 L69 33 L66.5 32 L64.5 34.5 L62 32.3 L59.5 34.5 L57 32.3 Z",
};
const runs = {
  land: ["M67 15 C63 28 73 36 69 48 S58 64 63 78 S70 92 67 100", "M65 16 C57 26 49 38 46 50 S38 66 42 80 S46 94 44 100"],
  port: ["M61 30 C57 40 69 48 65 58 S53 74 59 86 S63 96 61 100"],
};
const stars = [[20, 4], [31, 9], [44, 5], [52, 12], [58, 4], [76, 7], [83, 13], [90, 5], [95, 18], [88, 27], [8, 18], [70, 2]];
const trees = {
  land: [[3, 91], [6, 95], [9, 89], [21, 96], [48, 95], [57, 92], [60, 97], [91, 76], [94, 81], [97, 73], [89, 88], [77, 95]],
  port: [[5, 95], [11, 91], [17, 97], [41, 94], [47, 98], [88, 80], [93, 85], [7, 73], [13, 69]],
};

// the chairlift runs from Lift Control (the base) up to the Chairlift spot
const station = (id: Spot["id"], o: Orientation) => spots.find((r) => r.id === id)!.snow[o];
const cable = (o: Orientation) => {
  const [x1, y1] = station("terminal", o);
  const [x2, y2] = station("courses", o);
  return { x1, y1, x2, y2, d: `M${x1} ${y1} L${x2} ${y2}` };
};

const icons: Record<Spot["id"], ReactNode> = {
  research: <path d="M3.5 11.6 13 6.3l1.6 2.9-9.5 5.3zM14.6 6.2l2-1.1.9 1.6-2 1.1M9 12.8 6.5 17.5M10.3 12.1l2.3 5.4" />,
  projects: <path d="M2.5 15.5h15M4.5 15.5c5 0 9-2.5 10.5-9v9" />,
  courses: <path d="M2 4.5 18 3M10 3.8V9M6.5 9h7v2.5a1.5 1.5 0 0 1-1.5 1.5H8a1.5 1.5 0 0 1-1.5-1.5zM7.5 13v3M12.5 13v3" />,
  terminal: (
    <>
      <rect x="3" y="4.5" width="14" height="10" rx="1.5" />
      <path d="M6.5 8l2 1.8-2 1.8M10.5 11.6h3M7 17.5h6" />
    </>
  ),
  contact: <path d="M8 3.5h4V8h4.5v4H12v4.5H8V12H3.5V8H8z" />,
};

// the moon (in % of itself): craters, and where the rocket touches down (radians, just left of the top)
const craters = [[22, 30, 16], [58, 18, 10], [62, 58, 20], [30, 66, 9], [44, 44, 7]];
const LANDING = -1.9;
const leaf =
  "M0 -3.8L.7 -2.4 1.6 -2.8 1.3 -1 2.8 -1.9 2.4 -.5 3.6 -.1 1.4 1.3 1.7 2.2 .3 1.9 .3 3.6-.3 3.6-.3 1.9-1.7 2.2-1.4 1.3-3.6-.1-2.4-.5-2.8-1.9-1.3-1-1.6-2.8-.7-2.4Z";

// planting the flag sticks for the rest of the browser session
const flagPlanted = () => {
  try {
    return sessionStorage.getItem("moonFlag") === "1";
  } catch {
    return false;
  }
};

// a little Canada flag, planted on the moon's rim and standing straight out from it
function Flag({ animate }: { animate: boolean }) {
  return (
    <span className="absolute w-0 h-0" style={{ left: "78.7%", top: "9%" }}>
      <motion.svg
        viewBox="0 0 22 22"
        className="absolute bottom-0 left-0 w-[22px] h-[22px] overflow-visible"
        style={{ rotate: 35, originX: 0, originY: 1 }}
        initial={animate ? { scaleY: 0 } : false}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <line x1="1" y1="22" x2="1" y2="1.5" stroke="#d9d6c9" strokeWidth="1.2" />
        <motion.g
          initial={animate ? { scaleX: 0 } : false}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.35, ease: "easeOut" }}
          style={{ originX: 0 }}
        >
          <rect x="1.6" y="2" width="18" height="9" fill="#ffffff" />
          <rect x="1.6" y="2" width="4.5" height="9" fill="#d52b1e" />
          <rect x="15.1" y="2" width="4.5" height="9" fill="#d52b1e" />
          <path transform="translate(10.6 6.5) scale(0.85)" d={leaf} fill="#d52b1e" />
        </motion.g>
      </motion.svg>
    </span>
  );
}

const DWELL = 650; // ms the rider has to stop on a spot before dropping in
const REACH = 34; // px from a spot's center that counts as "on it"

const ringCenter = (spot: HTMLElement) => {
  const r = spot.querySelector("[data-ring]")!.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

// Snowboarding skin: steer a rider around the mountain with the mouse; stop on a spot to drop in.
export default function Mountain({ go, paused }: { go: Go; paused: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const rider = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const speed = useRef<HTMLSpanElement>(null);
  const autopilot = useRef<HTMLElement | null>(null);
  const live = useRef({ go, paused });
  const [phase, setPhase] = useState<"" | "liftoff" | "touchdown">("");
  const [plantedEarlier] = useState(flagPlanted);
  const [planted, setPlanted] = useState(plantedEarlier);

  useEffect(() => {
    live.current = { go, paused };
  });

  useEffect(() => {
    const scene = box.current!;
    const board = rider.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = { x: -1, y: 0, vx: 0, vy: 0, a: Math.PI / 2 };
    const target = { x: 0, y: 0 };
    const trail: { x: number; y: number; t: number; sky: boolean }[] = [];
    const flakes = Array.from({ length: still ? 0 : 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.5,
      v: 0.4 + Math.random() * 0.8,
      p: Math.random() * 6.3,
    }));
    let W = 0;
    let H = 0;
    let raf = 0;
    let last = performance.now();
    let frame = 0;
    let dwellId: string | null = null;
    let dwell = 0;
    let disarmed: string | null = null; // the spot we just came back from, ignored until we ride away
    let sky = false; // above the ridge line: rocket mode
    let ridgeLine: SVGPathElement | null = null;
    let moon: "idle" | "landing" | "planting" | "done" = flagPlanted() ? "done" : "idle";
    let moonAt = 0;

    const spots = () => [...scene.querySelectorAll<HTMLElement>("[data-player]")];
    const local = (spot: HTMLElement) => {
      const c = ringCenter(spot);
      const o = scene.getBoundingClientRect();
      return { x: c.x - o.left, y: c.y - o.top };
    };

    const moonGeo = () => {
      const r = scene.querySelector("[data-moon]")!.getBoundingClientRect();
      const o = scene.getBoundingClientRect();
      return { x: r.left + r.width / 2 - o.left, y: r.top + r.height / 2 - o.top, r: r.width / 2 };
    };

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      W = scene.clientWidth;
      H = scene.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const o = matchMedia("(orientation: portrait)").matches ? "port" : "land";
      ridgeLine = scene.querySelector<SVGPathElement>(`[data-ridge="${o}"]`);
      if (s.x < 0) {
        // start just below the summit
        s.x = target.x = W * (H > W ? 0.6 : 0.66);
        s.y = target.y = H * (H > W ? 0.45 : 0.42);
      }
      s.x = Math.min(s.x, W);
      s.y = Math.min(s.y, H);
    };

    const steer = (e: PointerEvent) => {
      if (autopilot.current && e.type === "pointermove") return;
      const o = scene.getBoundingClientRect();
      const x = e.clientX - o.left;
      const y = e.clientY - o.top;
      if (x < 0 || y < 0 || x > W || y > H) return;
      if (e.type === "pointerdown" && (e.target as Element).closest("[data-player]")) return;
      autopilot.current = null;
      target.x = x;
      target.y = y;
    };

    const enter = (spot: HTMLElement) => {
      const id = spot.dataset.player as RoomId;
      disarmed = id;
      dwellId = null;
      dwell = 0;
      autopilot.current = null;
      target.x = s.x;
      target.y = s.y;
      s.vx = s.vy = 0;
      live.current.go(id, ringCenter(spot));
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 50);
      last = now;
      if (live.current.paused) return;
      frame++;

      const pilot = autopilot.current;
      let v = 0;

      if (moon === "landing" || moon === "planting") {
        // easter egg: settle onto the moon nose-out, cut the engine, plant the flag, then blast off
        const m = moonGeo();
        const lx = m.x + Math.cos(LANDING) * (m.r + 8);
        const ly = m.y + Math.sin(LANDING) * (m.r + 8);
        s.x += (lx - s.x) * 0.12;
        s.y += (ly - s.y) * 0.12;
        s.vx = s.vy = 0;
        const turn = LANDING - s.a;
        s.a += Math.atan2(Math.sin(turn), Math.cos(turn)) * 0.15;
        if (moon === "landing" && Math.hypot(lx - s.x, ly - s.y) < 1.5) {
          moon = "planting";
          moonAt = now;
          board.dataset.landed = "";
          setPhase("touchdown");
          setPlanted(true);
          try {
            sessionStorage.setItem("moonFlag", "1");
          } catch {
            /* storage blocked; the flag just won't survive a reload */
          }
        } else if (moon === "planting" && now - moonAt > 1400) {
          moon = "done";
          delete board.dataset.landed;
          setPhase("liftoff");
          // a kick straight off the surface; normal steering then flies it back to the cursor
          s.vx = Math.cos(LANDING) * 7;
          s.vy = Math.sin(LANDING) * 7;
        }
      } else {
        // steering: ease the velocity toward the cursor (or a clicked spot), which carves smooth turns
        if (pilot) Object.assign(target, local(pilot));
        const dx = target.x - s.x;
        const dy = target.y - s.y;
        const max = pilot ? 12 : sky ? 11 : 8;
        let wx = dx * 0.08;
        let wy = dy * 0.08;
        const want = Math.hypot(wx, wy);
        if (want > max) {
          wx *= max / want;
          wy *= max / want;
        }
        s.vx += (wx - s.vx) * 0.1;
        s.vy += (wy - s.vy) * 0.1;
        s.x = Math.max(0, Math.min(W, s.x + s.vx));
        s.y = Math.max(0, Math.min(H, s.y + s.vy));
        v = Math.hypot(s.vx, s.vy);
        if (v > 0.4) {
          const turn = Math.atan2(s.vy, s.vx) - s.a;
          s.a += Math.atan2(Math.sin(turn), Math.cos(turn)) * 0.2;
        }

        // a rocket that touches the moon lands on it (once per session)
        if (moon === "idle" && sky && !pilot) {
          const m = moonGeo();
          if (Math.hypot(m.x - s.x, m.y - s.y) < m.r + 4) moon = "landing";
        }

        // drop in: arrive on autopilot, or hold still on a spot until its ring fills
        if (pilot && Math.hypot(dx, dy) < 10) {
          enter(pilot);
        } else {
          let near: HTMLElement | null = null;
          for (const spot of spots()) {
            const c = local(spot);
            const d = Math.hypot(c.x - s.x, c.y - s.y);
            if (spot.dataset.player === disarmed) {
              if (d > REACH * 2) disarmed = null;
            } else if (d < REACH) {
              near = spot;
            }
          }
          const id = pilot ? null : (near?.dataset.player ?? null);
          if (id !== dwellId) {
            dwellId = id;
            dwell = 0;
          }
          if (near && id) {
            dwell += dt;
            if (dwell >= DWELL) enter(near);
          }
          for (const spot of spots()) {
            spot.style.setProperty("--p", spot.dataset.player === dwellId ? String(Math.min(1, dwell / DWELL)) : "0");
          }
        }
      }

      // easter egg: leave the snow for the sky and the board becomes a rocket until you come back down
      const up = !!ridgeLine && !ridgeLine.isPointInFill(new DOMPoint((s.x / W) * 100, (s.y / H) * 100));
      if (up !== sky) {
        sky = up;
        board.dataset.mode = up ? "rocket" : "board";
        setPhase(up ? "liftoff" : "");
      }

      board.style.transform = `translate3d(${s.x - 17}px, ${s.y - 17}px, 0) rotate(${s.a}rad)`;
      if (frame % 6 === 0 && speed.current) speed.current.textContent = String(Math.round(v * (sky ? 120 : 6)));

      // carve marks behind the board (exhaust behind the rocket), and the snowfall
      if (v > 0.6) trail.push({ x: s.x, y: s.y, t: now, sky });
      while (trail.length && now - trail[0].t > 1800) trail.shift();
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = "round";
      for (let i = 1; i < trail.length; i++) {
        const q = trail[i];
        const fade = 1 - (now - q.t) / 1800;
        ctx.strokeStyle = q.sky ? `rgba(255,138,91,${0.75 * fade})` : `rgba(236,235,228,${0.4 * fade})`;
        ctx.lineWidth = q.sky ? 3 : 2;
        ctx.setLineDash(q.sky ? [1, 7] : []);
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(236,235,228,0.55)";
      for (const f of flakes) {
        f.y += f.v * 0.0011 * (dt / 16);
        f.x += Math.sin(now * 0.001 + f.p) * 0.0004;
        if (f.y > 1) {
          f.y = 0;
          f.x = Math.random();
        }
        ctx.beginPath();
        ctx.arc(f.x * W, f.y * H, f.r, 0, 7);
        ctx.fill();
      }
    };

    resize();
    raf = requestAnimationFrame(tick);
    addEventListener("pointermove", steer);
    addEventListener("pointerdown", steer);
    addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", steer);
      removeEventListener("pointerdown", steer);
      removeEventListener("resize", resize);
    };
  }, []);

  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <Frame
      paused={paused}
      hint={{ pointer: "Steer with your mouse · stop on a spot to drop in", touch: "Drag to ride · tap a spot to drop in" }}
      status={
        <span className="tabular-nums">
          {phase && <span className="text-accent">{phase} · </span>}
          <span ref={speed} className="text-ink">0</span> km/h
        </span>
      }
    >
      <div
        ref={box}
        className={`${stage} moonlit overflow-hidden border border-ink/10`}
      >
        <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <defs>
            {/* moonlight from the upper right catches the right-hand ridge and snowcap */}
            <linearGradient id="moonrim" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ecebe4" stopOpacity="0.14" />
              <stop offset="1" stopColor="#f4f1e2" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id="capshade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ecebe4" stopOpacity="0.12" />
              <stop offset="1" stopColor="#f4f1e2" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {stars.map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="0.25" height="0.4" fill="#ecebe4" opacity="0.7" className={i % 3 ? "" : "twinkle"} />
          ))}
          {(["land", "port"] as const).map((o) => {
            const c = cable(o);
            return (
              <g key={o} className={o === "port" ? "landscape:hidden" : "portrait:hidden"}>
                <path d={range[o]} fill="#11120f" stroke="rgba(236,235,228,0.08)" vectorEffect="non-scaling-stroke" />
                <path data-ridge={o} d={ridge[o]} fill="#151612" stroke="url(#moonrim)" vectorEffect="non-scaling-stroke" />
                <path d={snowcap[o]} fill="url(#capshade)" />
                {runs[o].map((d) => (
                  <path key={d} d={d} fill="none" className="stroke-accent" strokeOpacity="0.35" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
                ))}
                <path d={c.d} stroke="rgba(236,235,228,0.4)" vectorEffect="non-scaling-stroke" />
                {[0.25, 0.5, 0.75].map((t) => (
                  <line
                    key={t}
                    x1={c.x1 + (c.x2 - c.x1) * t}
                    y1={c.y1 + (c.y2 - c.y1) * t}
                    x2={c.x1 + (c.x2 - c.x1) * t}
                    y2={c.y1 + (c.y2 - c.y1) * t + 5}
                    stroke="rgba(236,235,228,0.3)"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                {!still &&
                  [0, 1, 2, 3].map((n) => (
                    <rect key={n} x="-0.6" y="0" width="1.2" height="1.6" className="fill-accent" opacity="0.8">
                      <animateMotion dur="16s" begin={`${-n * 4}s`} repeatCount="indefinite" path={c.d} />
                    </rect>
                  ))}
              </g>
            );
          })}
        </svg>

        {(["land", "port"] as const).map((o) =>
          trees[o].map(([x, y]) => (
            <svg
              key={`${o}${x}${y}`}
              aria-hidden
              viewBox="0 0 12 16"
              className={`absolute w-3 h-4 md:w-4 md:h-5 -translate-x-1/2 -translate-y-full ${o === "port" ? "landscape:hidden" : "portrait:hidden"}`}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <path d="M6 0 11 9H8.5L12 14H0L3.5 9H1z" fill="#1d2a22" />
            </svg>
          ))
        )}

        <div
          data-moon
          aria-hidden
          className="moon placed absolute w-[clamp(56px,11vmin,104px)] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{ "--x": "87%", "--y": "17%", "--px": "84%", "--py": "27%" } as CSSProperties}
        >
          {craters.map(([x, y, d]) => (
            <span key={`${x}${y}`} className="crater absolute rounded-full" style={{ left: `${x}%`, top: `${y}%`, width: `${d}%`, height: `${d}%` }} />
          ))}
          {planted && <Flag animate={!plantedEarlier} />}
        </div>

        <canvas ref={canvas} aria-hidden className="absolute inset-0 w-full h-full pointer-events-none" />

        <Name
          paused={paused}
          className="absolute left-[5%] top-[7%] portrait:left-0 portrait:right-0 portrait:top-[3%] portrait:text-center pointer-events-none"
          size="text-[length:clamp(2.5rem,min(7.5vw,12vh),7.5rem)] portrait:text-[length:min(13vw,6.5vh)]"
        />

        {spots.map((r, i) => (
          <motion.button
            key={r.id}
            data-player={r.id}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + i * 0.08, type: "spring", stiffness: 260, damping: 18 }}
            onClick={(e) => {
              if (still) go(r.id, ringCenter(e.currentTarget));
              else autopilot.current = e.currentTarget;
            }}
            aria-label={`${r.label}: ${r.snow.spot}, ${r.snow.caption}`}
            className="placed group absolute z-10 flex flex-col items-center gap-1.5 md:gap-2 focus-visible:outline-none"
            style={
              {
                x: "-50%",
                y: "-50%",
                "--x": `${r.snow.land[0]}%`,
                "--y": `${r.snow.land[1]}%`,
                "--px": `${r.snow.port[0]}%`,
                "--py": `${r.snow.port[1]}%`,
              } as MotionStyle
            }
          >
            <span data-ring className="spot-ring relative grid place-items-center w-11 h-11 md:w-14 md:h-14 rounded-full transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110">
              <span className="absolute inset-[2px] grid place-items-center rounded-full bg-bg text-accent transition-colors group-hover:bg-accent group-hover:text-bg group-focus-visible:bg-accent group-focus-visible:text-bg">
                <svg viewBox="0 0 20 20" className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {icons[r.id]}
                </svg>
              </span>
            </span>
            <span className="text-base md:text-2xl font-medium tracking-tight leading-none whitespace-nowrap transition-colors group-hover:text-accent [text-shadow:0_0_8px_#0e0e0c,0_0_2px_#0e0e0c]">
              {r.label}
            </span>
            <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-muted whitespace-nowrap short:hidden [text-shadow:0_0_8px_#0e0e0c,0_0_2px_#0e0e0c]">
              {r.snow.spot}
              <span className="hidden md:inline"> · {r.snow.caption}</span>
            </span>
          </motion.button>
        ))}

        <div
          ref={rider}
          data-mode="board"
          aria-hidden
          className="rider absolute left-0 top-0 z-20 w-[34px] h-[34px] pointer-events-none drop-shadow-[0_0_10px_rgb(var(--accent)/0.6)]"
        >
          <svg viewBox="-17 -17 34 34" className="w-full h-full overflow-visible">
            <g className="board-shape">
              <rect x="-15" y="-4.5" width="30" height="9" rx="4.5" className="fill-accent" />
              <ellipse cx="0" cy="0" rx="7" ry="3.6" fill="#ecebe4" />
              <circle cx="0" cy="0" r="2.6" fill="#0e0e0c" />
            </g>
            <g className="rocket-shape">
              <path className="flame" d="M-8 -3 L-18 0 L-8 3 Z" fill="#ff8a5b" />
              <path d="M-5 -4.5 L-11 -10 L-7.5 -2.5 Z M-5 4.5 L-11 10 L-7.5 2.5 Z" className="fill-accent" />
              <path d="M14 0 C10 -5.5 2 -6.5 -8 -5 L-8 5 C2 6.5 10 5.5 14 0 Z" fill="#ecebe4" />
              <circle cx="3.5" cy="0" r="2.2" className="fill-accent" />
            </g>
          </svg>
        </div>
      </div>
    </Frame>
  );
}
