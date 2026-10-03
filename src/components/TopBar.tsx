import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AgeTicker from "./AgeTicker";
import { hobbyIcons } from "./hobbyIcons";
import { themes, type Theme } from "../data/themes";
import type { Go } from "../data/rooms";

const kelownaTime = () =>
  new Date().toLocaleTimeString("en-CA", { timeZone: "America/Vancouver", hour: "2-digit", minute: "2-digit" });

type Props = { theme: Theme; onTheme: (t: Theme) => void; go: Go; hidden: boolean };

// Global bar above every hub skin: the live clock, the hobby switch (which reskins the hub), and About me.
export default function TopBar({ theme, onTheme, go, hidden }: Props) {
  const [time, setTime] = useState(kelownaTime);

  useEffect(() => {
    const id = setInterval(() => setTime(kelownaTime()), 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      inert={hidden}
      className="fixed top-0 inset-x-0 z-20 h-14 px-4 md:px-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3 font-mono text-[11px] md:text-xs text-muted"
    >
      <span className="hidden lg:flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        LIVE from Kelowna, BC · {time}
      </span>

      <div
        role="group"
        aria-label="My hobbies. Each one reskins the page."
        className="col-start-2 flex items-center gap-0.5 rounded-full border border-line bg-bg/80 p-1 backdrop-blur-md"
      >
        <span className="pl-2 pr-1.5 text-muted">
          <span className="sm:hidden">hobbies</span>
          <span className="hidden sm:inline">my hobbies:</span>
        </span>
        {themes.map((t) => {
          const on = t.id === theme;
          return (
            <button
              key={t.id}
              onClick={() => onTheme(t.id)}
              aria-pressed={on}
              aria-label={t.label}
              title={t.label}
              className={`relative flex h-8 items-center gap-1.5 rounded-full px-2.5 md:px-3 transition-colors active:scale-95 ${
                on ? "text-bg" : "text-muted hover:text-ink"
              }`}
            >
              {on && (
                <motion.span
                  layoutId="hobby"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative w-3.5 h-3.5">{hobbyIcons[t.id]}</span>
              <span className="relative hidden md:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="col-start-3 flex items-center justify-end gap-4">
        <span className="hidden lg:inline">
          age <AgeTicker className="text-accent" />
        </span>
        <button
          data-player="about"
          onClick={(e) => {
            const r = e.currentTarget.querySelector("[data-ring]")!.getBoundingClientRect();
            go("about", { x: r.left + r.width / 2, y: r.top + r.height / 2 });
          }}
          className="group flex h-10 items-center gap-2 rounded-full border border-line bg-bg/80 pl-1 pr-3 backdrop-blur-md transition-colors hover:border-accent active:scale-95"
        >
          <span data-ring className="grid h-8 w-8 place-items-center rounded-full bg-accent font-sans text-xs font-semibold text-bg">
            SC
          </span>
          <span className="font-sans text-sm font-medium text-ink">
            About<span className="hidden sm:inline"> me</span>
          </span>
        </button>
      </div>
    </header>
  );
}
