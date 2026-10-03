import type { ReactNode } from "react";

// where each hub skin draws its scene, between the top and bottom bars
export const stage = "absolute inset-x-4 md:inset-x-8 top-14 bottom-12 md:bottom-14";

type Props = {
  paused: boolean;
  hint: { pointer: string; touch: string };
  status?: ReactNode;
  children: ReactNode;
};

// Chrome shared by every hub skin (the global top bar sits above it): a how-to hint and a status slot.
export default function Frame({ paused, hint, status, children }: Props) {
  return (
    <div inert={paused} className="fixed inset-0 overflow-hidden select-none touch-pinch-zoom">
      {children}

      <div className="absolute bottom-0 inset-x-0 h-12 md:h-14 px-5 md:px-8 flex items-center justify-between gap-4 font-mono text-[11px] md:text-xs text-muted">
        <span className="min-w-0 truncate">
          <span className="hidden [@media(hover:hover)]:inline">{hint.pointer}</span>
          <span className="[@media(hover:hover)]:hidden">{hint.touch}</span>
        </span>
        <span className="flex gap-5 shrink-0 whitespace-nowrap">
          <span className="hidden lg:inline">4th year · Computer Science + Data Science · UBC Okanagan</span>
          {status}
        </span>
      </div>
    </div>
  );
}
