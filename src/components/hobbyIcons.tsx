import type { ReactNode } from "react";
import type { Theme } from "../data/themes";

// small line icons for each hobby, shared by the top bar and the About page
export const hobbyIcons: Record<Theme, ReactNode> = {
  soccer: (
    <svg viewBox="0 0 16 16" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 5.1l2.7 2-1 3.1H6.3l-1-3.1z" fill="currentColor" stroke="none" />
    </svg>
  ),
  snow: (
    <svg viewBox="0 0 16 16" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M1.5 13.5 6.2 4.5l3 5.2 1.7-2.6 3.6 6.4z" />
    </svg>
  ),
  game: (
    <svg viewBox="0 0 16 16" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="1.25" y="4.25" width="13.5" height="7.5" rx="3.75" />
      <path d="M4.3 8h2.6M5.6 6.7v2.6" />
      <circle cx="10.6" cy="7.1" r=".5" fill="currentColor" />
      <circle cx="11.9" cy="8.9" r=".5" fill="currentColor" />
    </svg>
  ),
};
