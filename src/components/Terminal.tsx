import { useEffect, useRef, useState } from "react";
import { projects } from "../data/projects";
import { coursework } from "../data/coursework";
import { experience } from "../data/experience";
import { getAge, skills } from "../data/profile";
import { rooms, type Go } from "../data/rooms";
import { themes, type Theme } from "../data/themes";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const roomIds = rooms.map((r) => r.id).join("|");

const commands: Record<string, () => string> = {
  help: () => `cd <${roomIds}>  cd ..  theme <${themes.map((t) => t.label.toLowerCase()).join("|")}>  ls  now  skills  courses  interests  goal  age  github  clear`,
  whoami: () => "Sebastian Csizmazia — Computer Science major, Data Science minor @ UBC Okanagan",
  ls: () => projects.map((p) => `${p.inProgress ? "*" : " "} ${slug(p.title)}/`).join("\n") + "\n\n* = still building",
  skills: () => skills.map((s) => `${s.category.toLowerCase()}: ${s.items.join(", ")}`).join("\n"),
  courses: () => {
    const by = (cat: string) => coursework.filter((c) => c.category === cat).length;
    return `${coursework.length} courses — ${by("Computer Science")} CS, ${by("Mathematics")} math, ${by("Data Science & Statistics")} data/stats, ${by("Other")} other`;
  },
  now: () =>
    [...experience.filter((j) => j.status === "Current").map((j) => `working  ${j.role} @ ${j.company}`),
     ...coursework.filter((c) => c.inProgress).map((c) => `taking   ${c.code} ${c.title}`),
     ...projects.filter((p) => p.inProgress).map((p) => `building ${p.title}`)].join("\n"),
  interests: () => "Machine Learning, Operating Systems, Security",
  goal: () => "Building software to solve complex problems",
  age: () => `${getAge().toFixed(9)} years`,
  github: () => {
    window.open("https://github.com/sebcsiz", "_blank", "noopener");
    return "opening github.com/sebcsiz ...";
  },
  sudo: () => "nice try.",
  "rm -rf /": () => "absolutely not.",
};

type Line = { cmd?: string; out: string };

export default function Terminal({ go, onTheme, tall = false }: { go: Go; onTheme?: (t: Theme) => void; tall?: boolean }) {
  const [lines, setLines] = useState<Line[]>([
    { cmd: "whoami", out: commands.whoami() },
    { out: "type 'help' to look around, or tap a command below." },
  ]);
  const [input, setInput] = useState("");
  const history = useRef<string[]>([]);
  const body = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight });
  }, [lines]);

  // cd/open move between rooms; everything else is a lookup in `commands`
  const navigate = (arg = "") => {
    const target = arg.replace(/\/$/, "").replace("coursework", "courses");
    if (["", "..", "~", "pitch"].includes(target)) {
      go(null);
      return "back to the pitch";
    }
    const room = rooms.find((r) => r.id === target);
    if (!room) return `no such room: ${arg}. try one of: ${rooms.map((r) => r.id).join(", ")}`;
    go(room.id);
    return `passing to ${room.label.toLowerCase()} ...`;
  };

  // theme pitch|mountain|arcade flips the hub behind this room
  const retheme = (arg = "") => {
    const t = themes.find((x) => x.label.toLowerCase() === arg || x.id === arg);
    if (!t || !onTheme) return `usage: theme <${themes.map((x) => x.label.toLowerCase()).join("|")}>`;
    onTheme(t.id);
    return `flipped the home page to ${t.label.toLowerCase()}`;
  };

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    history.current.push(cmd);
    const [name, arg] = cmd.toLowerCase().split(/\s+/);
    if (name === "clear") return setLines([]);
    const actions: Record<string, () => string> = {
      theme: () => retheme(arg),
      hobby: () => retheme(arg),
      cd: () => navigate(arg),
      open: () => navigate(arg),
      exit: () => navigate(".."),
      contact: () => navigate("contact"),
    };
    const out = actions[name]?.() ?? commands[cmd.toLowerCase()]?.() ?? `command not found: ${cmd}. try 'help'`;
    setLines((l) => [...l, { cmd, out }]);
  };

  return (
    <div className="rounded-2xl border border-line focus-within:border-accent/50 transition-colors bg-panel overflow-hidden shadow-[0_30px_80px_-30px_rgb(var(--accent)/0.15)]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-line">
        <span className="w-2.5 h-2.5 rounded-full bg-line" />
        <span className="w-2.5 h-2.5 rounded-full bg-line" />
        <span className="w-2.5 h-2.5 rounded-full bg-accent" />
        <span className="ml-3 font-mono text-xs text-muted">seb@kelowna ~ </span>
      </div>

      <div
        ref={body}
        onClick={() => field.current?.focus({ preventScroll: true })}
        className={`${tall ? "h-[55vh] min-h-72" : "h-72"} overflow-y-auto p-5 font-mono text-[13px] leading-relaxed cursor-text`}
      >
        {lines.map((l, i) => (
          <div key={i} className="mb-3">
            {l.cmd && (
              <div>
                <span className="text-accent">$</span> {l.cmd}
              </div>
            )}
            <div className="text-muted whitespace-pre-wrap">{l.out}</div>
          </div>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(input);
            setInput("");
          }}
          className="flex gap-2"
        >
          <span className="text-accent">$</span>
          <input
            ref={field}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" && history.current.length) {
                e.preventDefault();
                setInput(history.current[history.current.length - 1]);
              }
            }}
            aria-label="Terminal command"
            autoFocus={tall && matchMedia("(hover: hover)").matches}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="flex-1 bg-transparent py-1.5 text-base caret-accent focus-visible:outline-none [@media(hover:hover)]:py-0 [@media(hover:hover)]:text-[13px]"
          />
        </form>
      </div>

      <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-line">
        {["help", "ls", "now", "cd projects", "cd .."].map((c) => (
          <button
            key={c}
            onClick={() => run(c)}
            className="font-mono text-xs h-9 px-3 rounded-md border border-line text-muted hover:text-bg hover:bg-accent hover:border-accent active:scale-95 transition"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
