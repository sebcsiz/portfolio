import { useEffect, useRef, useState, type RefObject } from "react";

// true while the element is on screen, unless the visitor prefers reduced motion
export function useLive(ref: RefObject<Element | null>) {
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([entry]) => setLive(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return live;
}

// calls tick every `ms` while live; tick always sees the latest render's state
export function useTicker(live: boolean, ms: number, tick: () => void) {
  const latest = useRef(tick);
  useEffect(() => {
    latest.current = tick;
  });
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => latest.current(), ms);
    return () => clearInterval(id);
  }, [live, ms]);
}

// small deterministic RNG, so each cover's still frame looks the same on every load
export const seeded = (seed: number) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
