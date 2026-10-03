import { useEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Frame, { stage } from "../components/Frame";
import Name from "../components/Name";
import { glyphs, spots, type Go, type Input } from "../data/rooms";

type Button = Input | "select" | "a" | "b";

const keys: Record<string, Input> = {
  ArrowUp: "up",
  w: "up",
  ArrowRight: "right",
  d: "right",
  ArrowDown: "down",
  s: "down",
  ArrowLeft: "left",
  a: "left",
  Enter: "start",
};
// while a code is being entered, b and a are the face buttons (so WASD steps aside for the arrows)
const codeKeys: Record<string, Button> = { ArrowUp: "up", ArrowRight: "right", ArrowDown: "down", ArrowLeft: "left", b: "b", a: "a", Enter: "start" };
// standard gamepad layout: d-pad is 12-15, A is 0, B is 1, Select is 8, Start is 9
const padButtons: Record<number, Button> = { 12: "up", 15: "right", 13: "down", 14: "left", 0: "a", 1: "b", 8: "select", 9: "start" };

// easter egg: press SELECT, then enter the Konami Code
const KONAMI: Button[] = ["up", "up", "down", "down", "left", "right", "left", "right", "b", "a"];
const labels: Record<Button, string> = { ...glyphs, select: "Select", a: "A", b: "B" };

// Peppy Hare from Star Fox 64, 11×11
const peppy = ["..X.....X..", ".XX.....XX.", ".XX.....XX.", ".XX.....XX.", "..XX...XX..", "..XXXXXXX..", ".XXXXXXXXX.", ".XX.XXX.XX.", ".XXXXXXXXX.", "..XXX.XXX..", "...XXXXX..."];

// a little square-wave arpeggio, scheduled from inside the key or click handler so browsers allow the audio
const chime = (delay: number) => {
  try {
    const ctx = new AudioContext();
    [523.25, 659.25, 783.99, 1046.5].forEach((hz, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + delay + i * 0.09;
      osc.type = "square";
      osc.frequency.value = hz;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.035, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.15);
    });
    setTimeout(() => ctx.close(), (delay + 1) * 1000);
  } catch {
    /* no Web Audio: the egg just plays silently */
  }
};

const roomFor = (input: Input) => spots.find((r) => r.game.input === input)!;
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// controller drawing, viewBox 0 0 400 240
const arms: { input: Input; x: number; y: number; w: number; h: number; arrow: string }[] = [
  { input: "up", x: 83, y: 66, w: 34, h: 38, arrow: "100,74 106,84 94,84" },
  { input: "right", x: 117, y: 103, w: 38, h: 34, arrow: "147,120 137,114 137,126" },
  { input: "down", x: 83, y: 136, w: 34, h: 38, arrow: "100,166 106,156 94,156" },
  { input: "left", x: 45, y: 103, w: 38, h: 34, arrow: "53,120 63,114 63,126" },
];
const faceButtons = [
  ["Y", 300, 84],
  ["X", 264, 120],
  ["B", 336, 120],
  ["A", 300, 156],
] as const;

type ControllerProps = {
  svg: RefObject<SVGSVGElement | null>;
  lit: (button: Button) => boolean;
  down: Button | null;
  onPress: (button: Button) => void;
  onHover: (input: Input | null) => void;
};

function Controller({ svg, lit, down, onPress, onHover }: ControllerProps) {
  const control = (input: Button) => ({
    "data-input": input,
    onClick: () => onPress(input),
    onPointerEnter: () => onHover(input === "select" || input === "a" || input === "b" ? null : input),
    onPointerLeave: () => onHover(null),
    className: "cursor-pointer",
    style: { transform: down === input ? "translateY(2px)" : undefined, transition: "transform 80ms" },
  });

  return (
    <svg ref={svg} viewBox="0 0 400 240" aria-hidden className="w-full overflow-visible">
      <rect x="44" y="18" width="96" height="26" rx="13" className="fill-panel stroke-ink/20" strokeWidth="3" />
      <rect x="260" y="18" width="96" height="26" rx="13" className="fill-panel stroke-ink/20" strokeWidth="3" />
      <rect x="4" y="30" width="392" height="196" rx="98" className="fill-panel stroke-ink/25" strokeWidth="3" />
      <text x="200" y="98" textAnchor="middle" className="fill-ink/25 font-pixel text-[10px] tracking-[0.3em]">SEB-OS</text>

      {arms.map((a) => (
        <g key={a.input} {...control(a.input)}>
          <rect x={a.x} y={a.y} width={a.w} height={a.h} className={`transition-colors ${lit(a.input) ? "fill-accent" : "fill-line"}`} />
          <polygon points={a.arrow} className={lit(a.input) ? "fill-bg" : "fill-ink/60"} />
        </g>
      ))}
      <rect x="83" y="103" width="34" height="34" className="fill-line" />
      <path d="M83 66h34v37h38v34h-38v37h-34v-37h-38v-34h38z" fill="none" className="stroke-ink/40" strokeWidth="2" strokeLinejoin="round" />

      <g {...control("select")}>
        <rect
          x="160"
          y="146"
          width="32"
          height="11"
          rx="5.5"
          className={`transition-colors ${lit("select") ? "fill-accent stroke-accent" : "fill-line stroke-ink/40"}`}
          strokeWidth="2"
        />
      </g>
      <g {...control("start")}>
        <rect
          x="208"
          y="146"
          width="32"
          height="11"
          rx="5.5"
          className={`transition-colors ${lit("start") ? "fill-accent stroke-accent" : "fill-line stroke-ink/40"}`}
          strokeWidth="2"
        />
      </g>
      <text x="176" y="176" textAnchor="middle" className={`font-pixel text-[9px] ${lit("select") ? "fill-accent" : "fill-muted"}`}>SELECT</text>
      <text x="224" y="176" textAnchor="middle" className={`font-pixel text-[9px] ${lit("start") ? "fill-accent" : "fill-muted"}`}>START</text>

      {faceButtons.map(([label, cx, cy]) => {
        const button = label === "A" ? "a" : label === "B" ? "b" : null;
        const on = button !== null && lit(button);
        return (
          <g key={label} {...(button ? control(button) : { className: "cursor-pointer transition-transform active:translate-y-[2px]" })}>
            <circle cx={cx} cy={cy} r="17" className={`transition-colors ${on ? "fill-accent stroke-accent" : "fill-line stroke-ink/40"}`} strokeWidth="2" />
            <text x={cx} y={cy + 4} textAnchor="middle" className={`font-pixel text-[11px] ${on ? "fill-bg" : "fill-ink/70"}`}>
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Video game skin: a controller is the menu. The d-pad and START open sections; keyboard and gamepads both work.
export default function Arcade({ go, paused }: { go: Go; paused: boolean }) {
  const svg = useRef<SVGSVGElement>(null);
  const busy = useRef(false);
  const entered = useRef<Button[] | null>(null); // null until SELECT arms code entry
  const [hover, setHover] = useState<Input | null>(null);
  const [down, setDown] = useState<Button | null>(null);
  const [code, setCode] = useState<Button[] | null>(null);
  const [wrong, setWrong] = useState(false);
  const [egg, setEgg] = useState<"comms" | "roll" | "unlocked" | null>(null);
  const [gamepad, setGamepad] = useState(() => navigator.getGamepads?.().some(Boolean) ?? false);

  const tap = (button: Button) => {
    setDown(button);
    setTimeout(() => setDown((d) => (d === button ? null : d)), 120);
  };

  const setEntry = (next: Button[] | null) => {
    entered.current = next;
    setCode(next);
  };

  // Star Fox 64: Peppy calls in, the screen does a barrel roll, then the achievement pops
  const celebrate = () => {
    chime(1.7);
    setEgg("comms");
    setTimeout(() => setEgg("roll"), 600);
    setTimeout(() => setEgg("unlocked"), 1700);
    setTimeout(() => setEgg(null), 5200);
  };

  const press = (button: Button) => {
    if (busy.current || egg) return;
    const sofar = entered.current;

    if (button === "select") {
      tap(button);
      setEntry(sofar ? null : []);
      return;
    }

    // entering a code: inputs are captured instead of navigating
    if (sofar) {
      tap(button);
      const next = [...sofar, button];
      if (KONAMI[next.length - 1] !== button) {
        setEntry(null);
        setWrong(true);
        setTimeout(() => setWrong(false), 900);
      } else if (next.length === KONAMI.length) {
        setEntry(null);
        celebrate();
      } else {
        setEntry(next);
      }
      return;
    }

    if (button === "b") return tap(button);
    const input: Input = button === "a" ? "start" : button; // A confirms, like START

    // show the button going down, then open its section from where it sits on the controller
    busy.current = true;
    setDown(input);
    const part = svg.current?.querySelector(`[data-input="${input}"]`)?.getBoundingClientRect();
    const from = part?.width ? { x: part.left + part.width / 2, y: part.top + part.height / 2 } : undefined;
    setTimeout(() => {
      busy.current = false;
      setDown(null);
      go(roomFor(input).id, from);
    }, reduced() ? 0 : 160);
  };

  const live = useRef({ press, go, paused, setEntry });
  useEffect(() => {
    live.current = { press, go, paused, setEntry };
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (live.current.paused || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const coding = entered.current !== null;
      if (e.key === "Escape" && coding) return live.current.setEntry(null);
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const button = key === "Shift" ? "select" : coding ? codeKeys[key] : keys[key];
      if (!button) return;
      // Enter on a focused button should click that button, not press START
      if (button === "start" && (e.target as Element).closest("button, a, input, textarea")) return;
      e.preventDefault();
      live.current.press(button);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    let raf = 0;
    const held: Record<number, boolean> = {};
    const poll = () => {
      raf = requestAnimationFrame(poll);
      const pad = navigator.getGamepads().find(Boolean);
      if (!pad) return;
      for (const [index, button] of Object.entries(padButtons)) {
        const i = Number(index);
        const pressed = !!pad.buttons[i]?.pressed;
        if (pressed && !held[i]) {
          const { paused, go, press } = live.current;
          if (!paused) press(button);
          else if (button === "b") go(null); // B backs out of a room
        }
        held[i] = pressed;
      }
    };
    const connect = () => {
      setGamepad(true);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(poll);
    };
    const disconnect = () => {
      if (navigator.getGamepads().some(Boolean)) return;
      setGamepad(false);
      cancelAnimationFrame(raf);
    };
    if (navigator.getGamepads?.().some(Boolean)) raf = requestAnimationFrame(poll);
    addEventListener("gamepadconnected", connect);
    addEventListener("gamepaddisconnected", disconnect);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("gamepadconnected", connect);
      removeEventListener("gamepaddisconnected", disconnect);
    };
  }, []);

  const lit = (button: Button) => hover === button || down === button || (button === "select" && code !== null);

  const item = (input: Input) => {
    const r = roomFor(input);
    return (
      <li key={input}>
        <button
          data-player={r.id}
          onClick={() => press(input)}
          onPointerEnter={() => setHover(input)}
          onPointerLeave={() => setHover(null)}
          onFocus={() => setHover(input)}
          onBlur={() => setHover(null)}
          aria-label={`${r.label}: ${r.game.caption}`}
          className="group flex items-center gap-3 text-left focus-visible:outline-none"
        >
          <kbd
            data-ring
            className={`grid h-10 md:h-11 min-w-10 md:min-w-11 place-items-center rounded-md border-2 px-2 font-pixel text-xs md:text-sm transition-colors ${
              lit(input) ? "border-accent bg-accent text-bg" : "border-line text-accent"
            }`}
          >
            {glyphs[input]}
          </kbd>
          <span>
            <span className={`block font-pixel text-sm md:text-xl uppercase leading-none transition-colors ${lit(input) ? "text-accent" : ""}`}>
              {r.label}
            </span>
            <span className="mt-1 block font-mono text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-muted">{r.game.caption}</span>
          </span>
        </button>
      </li>
    );
  };

  return (
    <Frame
      paused={paused}
      hint={{ pointer: "Arrow keys or WASD to pick · Enter is Start · Shift is Select · gamepads work too", touch: "Tap a button to play" }}
      status={<span className={gamepad ? "text-accent" : ""}>P1 · {gamepad ? "gamepad" : matchMedia("(hover: none)").matches ? "touch" : "keyboard"}</span>}
    >
      <div className={`${stage} crt overflow-hidden rounded-[28px] border border-line ${egg === "roll" ? "barrel" : ""}`}>
        <div className="relative h-full flex flex-col items-center justify-center gap-[3.5vh] px-5 py-6 text-center">
          <Name
            pixel
            paused={paused}
            size="text-[length:clamp(1.6rem,min(6vw,8.5vh),5rem)] portrait:text-[length:min(9.5vw,4.5vh)]"
          />
          {code ? (
            <p role="status" className="px-4 py-3 font-pixel text-[10px] md:text-sm uppercase tracking-[0.3em] text-accent short:hidden">
              Code ▸ {code.map((b) => labels[b]).join(" ")}
              <span className="blink">_</span>
            </p>
          ) : wrong ? (
            <p role="status" className="shake px-4 py-3 font-pixel text-[10px] md:text-sm uppercase tracking-[0.3em] text-[#ff5d5d] short:hidden">
              ✕ Wrong code
            </p>
          ) : (
            <button onClick={() => press("start")} className="blink px-4 py-3 font-pixel text-[10px] md:text-sm uppercase tracking-[0.3em] text-accent short:hidden">
              ▶ Press start
            </button>
          )}
          <div className="w-full max-w-5xl grid items-center gap-6 lg:gap-10 lg:grid-cols-[1fr_minmax(0,420px)_1fr]">
            <ul className="order-2 lg:order-1 grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-3 justify-self-center lg:justify-self-end">
              {(["up", "right", "down", "left"] as const).map(item)}
            </ul>
            <div className="order-1 lg:order-2 w-full max-w-[300px] lg:max-w-none mx-auto short:hidden">
              <Controller svg={svg} lit={lit} down={down} onPress={press} onHover={setHover} />
            </div>
            <ul className="order-3 grid gap-3 justify-self-center lg:justify-self-start">
              {item("start")}
              <li className="hidden lg:flex items-center gap-3 text-left">
                <kbd className="grid h-11 min-w-11 place-items-center rounded-md border-2 border-line px-2 font-pixel text-sm text-muted">B</kbd>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                  back out of a room
                  <br />
                  or press Esc
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {(egg === "comms" || egg === "roll") && (
          <motion.div
            key="comms"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            style={{ x: "-50%" }}
            className="absolute bottom-16 left-1/2 z-30 flex items-center gap-3 rounded-lg border-2 border-accent bg-bg/95 p-2 pr-5 md:bottom-20"
          >
            <svg viewBox="0 0 11 11" aria-hidden className="h-12 w-12 rounded border border-line bg-panel p-1" shapeRendering="crispEdges">
              {peppy.flatMap((row, y) => [...row].map((c, x) => (c === "X" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className="fill-ink" /> : null)))}
            </svg>
            <span className="text-left">
              <span className="block font-pixel text-[9px] uppercase tracking-widest text-muted">Peppy</span>
              <span className="block font-pixel text-sm text-ink md:text-base">Do a barrel roll!</span>
            </span>
          </motion.div>
        )}
        {egg === "unlocked" && (
          <motion.div
            key="achievement"
            role="status"
            initial={{ opacity: 0, y: -16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            style={{ x: "-50%" }}
            className="absolute left-1/2 top-16 z-30 flex items-center gap-3 rounded-full border border-line bg-[#141512] py-2 pl-2 pr-6 shadow-2xl"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-bg">
              <svg viewBox="0 0 16 16" aria-hidden className="h-5 w-5" fill="currentColor">
                <path d="M4 1.5h8v1.5h2.5v1.5A3.5 3.5 0 0 1 11.6 8 4 4 0 0 1 9 10.3V12h2.5v2.5h-7V12H7v-1.7A4 4 0 0 1 4.4 8 3.5 3.5 0 0 1 1.5 4.5V3H4zM2.9 4.4a2.1 2.1 0 0 0 1.2 1.9V4.4zm10.2 0h-1.2v1.9a2.1 2.1 0 0 0 1.2-1.9z" />
              </svg>
            </span>
            <span className="whitespace-nowrap text-left">
              <span className="block text-xs text-muted">Achievement unlocked</span>
              <span className="block text-sm font-medium text-ink">30G · Konami Code</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </Frame>
  );
}
