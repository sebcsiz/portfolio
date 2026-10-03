import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import TopBar from "./components/TopBar";
import Room from "./components/Room";
import Pitch from "./hubs/Pitch";
import Mountain from "./hubs/Mountain";
import Arcade from "./hubs/Arcade";
import { rooms, type Go, type RoomId } from "./data/rooms";
import { themes, type Theme } from "./data/themes";

// #projects, plus the old #/about and #coursework links
const roomFromHash = (): RoomId | null => {
  const id = location.hash.replace(/^#\/?/, "").replace("coursework", "courses");
  return rooms.find((r) => r.id === id)?.id ?? null;
};

const playerCenter = (id: RoomId | null) => {
  const ring = id && document.querySelector(`[data-player="${id}"] [data-ring]`);
  if (!ring) return { x: innerWidth / 2, y: innerHeight / 2 };
  const r = ring.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

const savedTheme = (): Theme => {
  try {
    const t = localStorage.getItem("theme");
    return themes.find((x) => x.id === t)?.id ?? "soccer";
  } catch {
    return "soccer";
  }
};

export default function App() {
  const [room, setRoom] = useState(roomFromHash);
  const [origin, setOrigin] = useState(() => playerCenter(null));
  const [theme, setTheme] = useState(savedTheme);

  // the accent colour follows the theme everywhere, rooms included
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* storage blocked; the theme resets next visit */
    }
  }, [theme]);

  // closing a room hands keyboard focus back to whatever opened it
  const last = useRef<RoomId | null>(null);
  useEffect(() => {
    if (room) last.current = room;
    else if (last.current) document.querySelector<HTMLElement>(`[data-player="${last.current}"]`)?.focus({ preventScroll: true });
  }, [room]);

  useEffect(() => {
    const sync = () => setRoom(roomFromHash());
    addEventListener("hashchange", sync);
    return () => removeEventListener("hashchange", sync);
  }, []);

  const go: Go = useCallback((next, from) => {
    if (next) {
      if (from) setOrigin(from);
      location.hash = next;
    } else {
      setOrigin(playerCenter(roomFromHash())); // shrink back into whatever opened it
      history.pushState(null, "", location.pathname + location.search);
      setRoom(null);
    }
  }, []);

  const paused = room !== null;

  return (
    <MotionConfig reducedMotion="user">
      {/* the hub flips over like a card when the theme changes */}
      <div className="fixed inset-0 [perspective:1800px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme}
            className="absolute inset-0 [backface-visibility:hidden]"
            initial={{ rotateY: -90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: 90 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {theme === "soccer" ? (
              <Pitch go={go} paused={paused} />
            ) : theme === "snow" ? (
              <Mountain go={go} paused={paused} />
            ) : (
              <Arcade go={go} paused={paused} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <TopBar theme={theme} onTheme={setTheme} go={go} hidden={paused} />
      <Room theme={theme} onTheme={setTheme} room={room} origin={origin} go={go} />
    </MotionConfig>
  );
}
