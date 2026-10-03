import { useEffect, useRef, type CSSProperties } from "react";
import { motion } from "framer-motion";

const words = ["Sebastian", "Csizmazia"];
const ease = [0.22, 1, 0.36, 1] as const;

type Props = { paused: boolean; size: string; className?: string; pixel?: boolean };

// The name, revealed letter by letter. Near the cursor, letters swell (display) or hop like coin blocks (pixel).
export default function Name({ paused, size, className = "", pixel = false }: Props) {
  const letters = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (paused || !matchMedia("(hover: hover)").matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        for (const el of letters.current) {
          if (!el) continue;
          const r = el.getBoundingClientRect();
          const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
          const f = Math.max(0, 1 - d / 280);
          if (pixel) {
            el.style.translate = `0 ${-Math.round(f * 3) * 0.08}em`;
          } else {
            el.style.fontVariationSettings = `"wght" ${Math.round(380 + f * 420)}`;
            el.style.color = f > 0.55 ? "rgb(var(--accent))" : "";
          }
        }
      });
    };
    addEventListener("pointermove", move);
    return () => {
      removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [paused, pixel]);

  return (
    <div className={className}>
      <h1
        aria-label="Sebastian Csizmazia"
        className={`${size} ${
          pixel
            ? "font-pixel font-bold uppercase leading-[1.05] [text-shadow:0.07em_0.07em_0_rgb(var(--accent))]"
            : "leading-[0.8] tracking-[-0.045em]"
        }`}
      >
        {words.map((word, w) => (
          <span key={word} aria-hidden className={`block ${pixel ? "" : "overflow-hidden pb-[0.08em]"}`}>
            {[...word].map((ch, j) => {
              const i = w * words[0].length + j;
              return (
                <motion.span
                  key={j}
                  ref={(el) => {
                    letters.current[i] = el;
                  }}
                  initial={pixel ? { opacity: 0 } : { y: "110%" }}
                  animate={pixel ? { opacity: 1 } : { y: 0 }}
                  transition={pixel ? { delay: 0.2 + i * 0.05, duration: 0 } : { delay: 0.15 + i * 0.035, duration: 1, ease }}
                  className={`${pixel ? "pixel-letter" : "name-letter"} inline-block`}
                  style={{ "--i": i } as CSSProperties}
                >
                  {ch}
                </motion.span>
              );
            })}
          </span>
        ))}
      </h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8, ease }}
        className={
          pixel
            ? "mt-4 font-pixel text-[10px] md:text-sm uppercase tracking-wider text-muted short:hidden"
            : "mt-4 md:mt-6 font-serif text-xl md:text-3xl short:hidden"
        }
      >
        I build things that <em className={pixel ? "not-italic text-accent" : "text-accent"}>occasionally</em> work.
      </motion.p>
    </div>
  );
}
