import { projects } from "./projects";
import { coursework } from "./coursework";
import type { Theme } from "./themes";

const campuses = new Set(coursework.map((c) => c.institution)).size;

// About lives in the top bar rather than on the hub
export const about = {
  id: "about",
  label: "About",
  kicker: "Code, math, music, and the occasional rabbit hole.",
} as const;

// Everything on the hub shows up in each hobby skin under a different guise.
// land/port: position as % of the stage, [x, y], on landscape and portrait screens.
export const spots = [
  {
    id: "projects",
    label: "Projects",
    kicker: "From web apps to models that watch soccer.",
    soccer: { no: projects.length, pos: "ST", caption: `${projects.length} things I've built`, land: [86, 62], port: [70, 9] },
    snow: { spot: "Terrain Park", caption: `${projects.length} features to hit`, land: [85, 58], port: [74, 63] },
    game: { input: "right", caption: `${projects.length} quests complete` },
  },
  {
    id: "courses",
    label: "Coursework",
    kicker: `Five years across ${campuses} campuses.`,
    soccer: { no: coursework.length, pos: "DEF", caption: `${coursework.length} courses, ${campuses} campuses`, land: [22, 20], port: [24, 74] },
    snow: { spot: "Chairlift", caption: `${coursework.length} courses up the hill`, land: [52, 38], port: [28, 52] },
    game: { input: "down", caption: `${coursework.length} levels cleared` },
  },
  {
    id: "research",
    label: "Research",
    kicker: "Questions I can't stop poking at.",
    soccer: { no: 6, pos: "DM", caption: "reading the game", land: [38, 84], port: [72, 77] },
    snow: { spot: "Observatory", caption: "deep dives", land: [70, 25], port: [64, 37] },
    game: { input: "up", caption: "lore & side quests" },
  },
  {
    id: "terminal",
    label: "Terminal",
    kicker: "Everything on this site, reachable by typing.",
    soccer: { no: 10, pos: "CAM", caption: "for keyboard people", land: [64, 16], port: [26, 22] },
    snow: { spot: "Lift Control", caption: "for keyboard people", land: [34, 86], port: [26, 80] },
    game: { input: "start", caption: "cheat codes" },
  },
  {
    id: "contact",
    label: "Contact",
    kicker: "Internships, projects, or a soccer debate.",
    soccer: { no: 1, pos: "GK", caption: "the inbox is open", land: [6, 50], port: [50, 93] },
    snow: { spot: "Ski Patrol", caption: "the inbox is open", land: [13, 76], port: [72, 90] },
    game: { input: "left", caption: "player 2, press start" },
  },
] as const;

export const rooms = [about, ...spots] as const;

export type Spot = (typeof spots)[number];
export type Room = (typeof rooms)[number];
export type RoomId = Room["id"];
export type Input = Spot["game"]["input"];
export type Go = (room: RoomId | null, from?: { x: number; y: number }) => void;

export const glyphs: Record<Input, string> = { up: "↑", right: "→", down: "↓", left: "←", start: "Start" };

const aboutTags: Record<Theme, string> = { soccer: "Player profile", snow: "Rider profile", game: "Player 1" };

// the little label above a room's title, in the current hobby's language
export const tagFor = (theme: Theme, r: Room) => {
  if (!("soccer" in r)) return aboutTags[theme];
  if (theme === "soccer") return `#${r.soccer.no} · ${r.soccer.pos}`;
  return theme === "snow" ? r.snow.spot : `Press ${glyphs[r.game.input]}`;
};
