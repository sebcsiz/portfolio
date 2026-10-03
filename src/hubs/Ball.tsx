import { useEffect, useRef, type RefObject } from "react";

export type Pass = { el: HTMLElement; done: () => void } | null;
export type Team = "a" | "b";

type Props = {
  box: RefObject<HTMLDivElement | null>;
  aim: HTMLElement | null;
  pass: Pass;
  paused: boolean;
  onGoal: (team: Team) => void;
};

const R = 9; // ball radius, px
const REACH = R + 16; // how close the cursor has to get to touch it
const MOUTH = [0.42, 0.58]; // goal mouth, as a fraction of the pitch's short side

// A kickable ball: the cursor (or a finger) knocks it around, the touchlines bounce it,
// the goals count it. Clicking a player passes it to them.
export default function Ball({ box, aim, pass, paused, onGoal }: Props) {
  const ball = useRef<HTMLDivElement>(null);
  const line = useRef<SVGLineElement>(null);
  const props = useRef({ aim, pass, paused, onGoal });

  useEffect(() => {
    props.current = { aim, pass, paused, onGoal };
  });

  useEffect(() => {
    const pitch = box.current!;
    const el = ball.current!;
    const lane = line.current!;
    let W = pitch.clientWidth;
    let H = pitch.clientHeight;
    const s = { x: W / 2, y: H / 2, vx: 0, vy: 0, spin: 0 };
    const p = { x: -999, y: -999, vx: 0, vy: 0 };
    let sent: Pass = null;
    let current: Pass = null;
    let from = { x: 0, y: 0 };
    let resetAt = 0;
    let raf = 0;

    const local = (target: HTMLElement) => {
      const r = target.getBoundingClientRect();
      const o = pitch.getBoundingClientRect();
      return { x: r.left + r.width / 2 - o.left, y: r.top + r.height / 2 - o.top };
    };

    const track = (e: PointerEvent) => {
      const o = pitch.getBoundingClientRect();
      const x = e.clientX - o.left;
      const y = e.clientY - o.top;
      const fresh = e.type === "pointerdown" || p.x === -999;
      p.vx = fresh ? 0 : Math.max(-40, Math.min(40, x - p.x));
      p.vy = fresh ? 0 : Math.max(-40, Math.min(40, y - p.y));
      p.x = x;
      p.y = y;
    };
    const lift = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") p.x = p.y = -999;
    };
    const leave = () => (p.x = p.y = -999);
    const resize = () => {
      W = pitch.clientWidth;
      H = pitch.clientHeight;
      s.x = Math.min(s.x, W - R);
      s.y = Math.min(s.y, H - R);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const { aim, pass, paused, onGoal } = props.current;
      if (paused) return;

      if (pass && pass !== sent) {
        // pass: ease to the receiver's feet (the side the ball came from), then hand over
        if (pass !== current) {
          current = pass;
          from = { x: s.x, y: s.y };
        }
        const c = local(pass.el);
        const len = Math.hypot(from.x - c.x, from.y - c.y) || 1;
        const stop = pass.el.offsetWidth / 2 + R + 4;
        const tx = c.x + ((from.x - c.x) / len) * stop;
        const ty = c.y + ((from.y - c.y) / len) * stop;
        s.x += (tx - s.x) * 0.3;
        s.y += (ty - s.y) * 0.3;
        if (Math.hypot(tx - s.x, ty - s.y) < 14) {
          sent = pass;
          s.vx = s.vy = 0;
          pass.done();
        }
      } else if (now > resetAt) {
        if (resetAt) {
          resetAt = 0;
          s.x = W / 2;
          s.y = H / 2;
        }

        // cursor contact: push the ball out and add the cursor's momentum
        const dx = s.x - p.x;
        const dy = s.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < REACH) {
          const nx = d ? dx / d : 1;
          const ny = d ? dy / d : 0;
          s.x = p.x + nx * REACH;
          s.y = p.y + ny * REACH;
          const dot = s.vx * nx + s.vy * ny;
          if (dot < 0) {
            s.vx -= 2 * dot * nx;
            s.vy -= 2 * dot * ny;
          }
          s.vx += p.vx * 0.7 + nx;
          s.vy += p.vy * 0.7 + ny;
        }
        p.vx *= 0.6;
        p.vy *= 0.6;

        const speed = Math.hypot(s.vx, s.vy);
        if (speed > 30) {
          s.vx *= 30 / speed;
          s.vy *= 30 / speed;
        }
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.975;
        s.vy *= 0.975;
        s.spin += speed / R;

        // goals sit on the short ends of the pitch; everywhere else bounces
        const land = W >= H;
        const mouth = land
          ? s.y > H * MOUTH[0] && s.y < H * MOUTH[1]
          : s.x > W * MOUTH[0] && s.x < W * MOUTH[1];
        if (!(land && mouth)) {
          if (s.x < R) {
            s.x = R;
            s.vx = Math.abs(s.vx) * 0.8;
          }
          if (s.x > W - R) {
            s.x = W - R;
            s.vx = -Math.abs(s.vx) * 0.8;
          }
        }
        if (!(!land && mouth)) {
          if (s.y < R) {
            s.y = R;
            s.vy = Math.abs(s.vy) * 0.8;
          }
          if (s.y > H - R) {
            s.y = H - R;
            s.vy = -Math.abs(s.vy) * 0.8;
          }
        }
        if (s.x < -R || s.x > W + R || s.y < -R || s.y > H + R) {
          // A's net is on the right (top on portrait screens), B's on the left (bottom)
          const team: Team = s.x > W + R || s.y < -R ? "a" : "b";
          s.vx = s.vy = 0;
          resetAt = now + 1400; // leave it in the net while the crowd goes wild
          onGoal(team);
        }
      }

      el.style.transform = `translate3d(${s.x - R}px, ${s.y - R}px, 0) rotate(${s.spin}rad)`;

      // dashed passing lane toward whoever is hovered
      if (aim && !(pass && pass !== sent)) {
        const t = local(aim);
        lane.setAttribute("x1", String(s.x));
        lane.setAttribute("y1", String(s.y));
        lane.setAttribute("x2", String(t.x));
        lane.setAttribute("y2", String(t.y));
        lane.style.opacity = "1";
      } else {
        lane.style.opacity = "0";
      }
    };

    raf = requestAnimationFrame(tick);
    addEventListener("pointermove", track);
    addEventListener("pointerdown", track);
    addEventListener("pointerup", lift);
    addEventListener("pointercancel", lift);
    document.documentElement.addEventListener("mouseleave", leave);
    addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", track);
      removeEventListener("pointerdown", track);
      removeEventListener("pointerup", lift);
      removeEventListener("pointercancel", lift);
      document.documentElement.removeEventListener("mouseleave", leave);
      removeEventListener("resize", resize);
    };
  }, [box]);

  return (
    <>
      <svg aria-hidden className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
        <line
          ref={line}
          className="pass-line stroke-accent transition-opacity duration-200"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          opacity="0"
        />
      </svg>
      <div
        ref={ball}
        aria-hidden
        className="absolute left-0 top-0 z-20 w-[18px] h-[18px] rounded-full bg-ink shadow-[0_0_24px_rgb(var(--accent)/0.5)] pointer-events-none"
      >
        <svg viewBox="0 0 18 18" className="w-full h-full">
          <polygon points="9,5.4 12.4,7.9 11.1,11.9 6.9,11.9 5.6,7.9" fill="#0e0e0c" />
        </svg>
      </div>
    </>
  );
}
