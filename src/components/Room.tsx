import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedLogo from "./AnimatedLogo";
import Terminal from "./Terminal";
import About from "../rooms/About";
import Projects from "../rooms/Projects";
import Courses from "../rooms/Courses";
import Contact from "../rooms/Contact";
import Research from "../rooms/Research";
import { rooms, tagFor, type Go, type RoomId } from "../data/rooms";
import type { Theme } from "../data/themes";

const wipe = [0.65, 0, 0.35, 1] as const;
const settle = [0.22, 1, 0.36, 1] as const;

type Ctx = { go: Go; theme: Theme; onTheme: (t: Theme) => void };

const views: Record<RoomId, (ctx: Ctx) => ReactNode> = {
  about: (ctx) => <About {...ctx} />,
  projects: () => <Projects />,
  courses: () => <Courses />,
  research: ({ go }) => <Research go={go} />,
  terminal: ({ go, onTheme }) => <Terminal go={go} onTheme={onTheme} tall />,
  contact: () => <Contact />,
};

type Props = Ctx & { room: RoomId | null; origin: { x: number; y: number } };

// Full-screen panel that bursts out of whatever opened it on the hub.
export default function Room({ theme, onTheme, room, origin, go }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const meta = rooms.find((r) => r.id === room);
  const at = `${origin.x}px ${origin.y}px`;

  useEffect(() => {
    if (!room) return;
    const el = panel.current;
    el?.scrollTo({ top: 0 });
    if (el && !el.contains(document.activeElement)) el.focus({ preventScroll: true });
    el?.querySelector('[aria-current="page"]')?.scrollIntoView({ inline: "center", block: "nearest" });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && go(null);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [room, go]);

  return (
    <AnimatePresence>
      {meta && (
        <motion.div
          key="wipe"
          aria-hidden
          className="fixed inset-0 z-30 bg-accent"
          initial={{ clipPath: `circle(0% at ${at})` }}
          animate={{ clipPath: `circle(150% at ${at})`, transition: { duration: 0.5, ease: wipe } }}
          exit={{ clipPath: `circle(0% at ${at})`, transition: { duration: 0.45, ease: wipe, delay: 0.1 } }}
        />
      )}
      {meta && (
        <motion.div
          key="room"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label={meta.label}
          tabIndex={-1}
          className="fixed inset-0 z-40 bg-bg overflow-y-auto outline-none"
          initial={{ clipPath: `circle(0% at ${at})` }}
          animate={{ clipPath: `circle(150% at ${at})`, transition: { duration: 0.55, ease: wipe, delay: 0.12 } }}
          exit={{ clipPath: `circle(0% at ${at})`, transition: { duration: 0.45, ease: wipe } }}
        >
          <header className="sticky top-0 z-10 bg-bg/80 backdrop-blur-md border-b border-line">
            <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between gap-4">
              <button onClick={() => go(null)} aria-label="Back to the hub" className="group flex items-center gap-3 shrink-0">
                <span className="grid place-items-center w-11 h-11 md:w-9 md:h-9 rounded-full border border-line transition group-hover:border-accent group-hover:text-accent group-active:scale-90">
                  ←
                </span>
                <span className="hidden md:block">
                  <AnimatedLogo />
                </span>
              </button>
              <nav
                aria-label="Sections"
                className="-mr-5 flex min-w-0 gap-1 overflow-x-auto pr-5 font-mono text-xs [scrollbar-width:none] max-md:[mask-image:linear-gradient(to_right,transparent,black_12px,black_85%,transparent)] md:mr-0 md:pr-0"
              >
                {rooms.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => go(r.id)}
                    aria-current={r.id === meta.id ? "page" : undefined}
                    className={`shrink-0 h-11 md:h-9 px-3 rounded-full transition-colors duration-300 ${
                      r.id === meta.id ? "bg-accent text-bg" : "text-muted hover:text-ink"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </nav>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.main
              key={meta.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: settle, delay: 0.2 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="max-w-7xl mx-auto px-5 md:px-10 pt-10 md:pt-14 pb-24"
            >
              <div className="mb-10 md:mb-14 flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
                <h2 className="text-[length:clamp(2.75rem,7vw,6rem)] font-semibold leading-[0.85] tracking-[-0.045em]">
                  <span className="font-mono text-sm font-normal tracking-normal text-accent align-top mr-3">
                    {tagFor(theme, meta)}
                  </span>
                  {meta.label}
                </h2>
                <p className="font-serif italic text-2xl md:text-3xl text-muted max-w-sm leading-tight">{meta.kicker}</p>
              </div>
              {views[meta.id]({ go, theme, onTheme })}
            </motion.main>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
