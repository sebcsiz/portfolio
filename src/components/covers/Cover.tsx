import { useRef, type ReactNode } from "react";
import { useLive } from "./useLive";
import Neural from "./Neural";
import Jersey from "./Jersey";
import Bootstrap from "./Bootstrap";
import Risk from "./Risk";
import Phone from "./Phone";
import Shots from "./Shots";
import Chat from "./Chat";
import Fingerprint from "./Fingerprint";
import MiniHub from "./MiniHub";
import GameTree from "./GameTree";
import Validation from "./Validation";

export type CoverKind = "neural" | "jersey" | "bootstrap" | "risk" | "phone" | "shots" | "chat" | "fingerprint" | "hub" | "tree" | "validation";

const views: Record<CoverKind, (live: boolean) => ReactNode> = {
  neural: (live) => <Neural live={live} />,
  jersey: (live) => <Jersey live={live} />,
  bootstrap: (live) => <Bootstrap live={live} />,
  risk: (live) => <Risk live={live} />,
  phone: () => <Phone />,
  shots: (live) => <Shots live={live} />,
  chat: (live) => <Chat live={live} />,
  fingerprint: (live) => <Fingerprint live={live} />,
  hub: () => <MiniHub />,
  tree: (live) => <GameTree live={live} />,
  validation: (live) => <Validation live={live} />,
};

// An animated cover for a project or paper, drawn on a 320×200 canvas.
// Animations only run while the cover is on screen (CSS ones pause via [data-live]).
export default function Cover({ kind, className = "" }: { kind: CoverKind; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const live = useLive(ref);
  return (
    <div ref={ref} data-live={live ? "" : undefined} className={`cover relative aspect-[8/5] overflow-hidden ${className}`}>
      <svg viewBox="0 0 320 200" aria-hidden className="absolute inset-0 h-full w-full">
        {views[kind](live)}
      </svg>
    </div>
  );
}
