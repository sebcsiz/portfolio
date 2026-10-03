import type { ReactNode } from "react";
import AgeTicker from "../components/AgeTicker";
import Experience from "../components/Experience";
import { hobbyIcons } from "../components/hobbyIcons";
import { skills } from "../data/profile";
import { projects } from "../data/projects";
import { coursework } from "../data/coursework";
import { experience } from "../data/experience";
import type { Theme } from "../data/themes";
import type { Go } from "../data/rooms";

const now = [
  ...experience.filter((j) => j.status === "Current").map((j) => ({ label: "Working", value: `${j.role} · ${j.company}` })),
  ...coursework.filter((c) => c.inProgress).map((c) => ({ label: "Taking", value: `${c.code} · ${c.title}` })),
  ...projects.filter((p) => p.inProgress).map((p) => ({ label: "Building", value: p.title })),
];

const campuses = [...new Set(coursework.map((c) => c.institution))]
  .map((name) => ({ name, count: coursework.filter((c) => c.institution === name).length }))
  .sort((a, b) => b.count - a.count);

const profile: [string, ReactNode][] = [
  ["Based in", "Kelowna, BC"],
  ["Age", <AgeTicker key="age" className="text-accent" />],
  ["Studying", "Computer Science, minor in Data Science"],
  ["School", "UBC Okanagan · 4th year"],
  ["Coursework", `${coursework.length} courses across ${campuses.length} campuses`],
];

const hobbies: { theme: Theme; title: string; body: string }[] = [
  { theme: "soccer", title: "Soccer", body: "Playing it, and lately modelling it: match data, xG, jersey numbers." },
  { theme: "snow", title: "Snowboarding", body: "Whenever I get the chance." },
  { theme: "game", title: "Gaming", body: "Playing video games, and poking at how their systems are put together." },
];

const sections = ["work", "hobbies", "toolbox", "campuses"];
const num = (key: string) => String(sections.indexOf(key) + 1).padStart(2, "0");

function SectionHead({ n, title, kicker }: { n: string; title: string; kicker?: string }) {
  return (
    <header className="mb-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-3 border-t border-line pt-8">
      <h3 className="text-4xl font-semibold leading-[0.9] tracking-[-0.04em] md:text-6xl">
        <span className="mb-3 block font-mono text-xs font-normal uppercase tracking-[0.2em] text-accent">({n})</span>
        {title}
      </h3>
      {kicker && <p className="max-w-sm font-serif text-2xl italic leading-tight text-muted md:text-3xl">{kicker}</p>}
    </header>
  );
}

type Props = { theme: Theme; onTheme: (t: Theme) => void; go: Go };

export default function About({ theme, onTheme, go }: Props) {
  return (
    <div className="space-y-24 md:space-y-32">
      <section className="grid gap-14 lg:grid-cols-12">
        <div className="max-w-[62ch] space-y-5 text-lg leading-relaxed text-ink/75 lg:col-span-7">
          <p className="text-2xl font-medium leading-snug tracking-tight text-ink md:text-[2rem]">
            I'm a Computer Science major with a minor in Data Science at the{" "}
            <span className="font-serif font-normal italic text-accent">University of British Columbia Okanagan</span>, with a
            strong foundation in mathematics, statistics, and software development.
          </p>
          <p>
            Through coursework and projects, I have built and deployed full-stack applications, designed relational
            databases, and analyzed datasets using statistical and machine-learning techniques to extract actionable insights.
          </p>
          <p>
            My project experience includes developing data-driven models, implementing backend systems that handle user
            authentication and transactions, and creating visualizations to communicate results effectively. I focus on
            writing clear, maintainable code, validating results with quantitative reasoning, and iterating based on
            measurable outcomes such as model accuracy, performance, and system reliability.
          </p>
        </div>

        <aside className="space-y-10 lg:col-span-5">
          <dl className="divide-y divide-line rounded-2xl border border-line bg-panel">
            {profile.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[6.5rem_1fr] gap-4 px-5 py-3.5">
                <dt className="pt-0.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">Right now</h3>
            <ul className="divide-y divide-line border-y border-line">
              {now.map((n) => (
                <li key={n.value} className="flex gap-4 py-3">
                  <span className="w-16 shrink-0 pt-1 font-mono text-xs text-accent">{n.label}</span>
                  <span className="font-medium">{n.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section>
        <SectionHead n={num("work")} title="Work experience" kicker="What I'm building right now." />
        <Experience />
      </section>

      <section>
        <SectionHead n={num("hobbies")} title="Off the clock" kicker="Each one can reskin the home page." />
        <p className="mb-10 max-w-[65ch] text-lg leading-relaxed text-ink/75">
          When I'm not coding, I enjoy playing video games and soccer, snowboarding whenever I get the chance, and diving into
          niche math and history. I'll probably forget most of what I learn shortly after, but I genuinely enjoy going down
          random rabbit holes and learning about things I'll likely never encounter again, purely for the curiosity of it. I
          like exploring how complex systems, whether in games, sports, or historical patterns, are structured and how small
          details have a big impact.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {hobbies.map((h) => (
            <li key={h.theme} className="flex flex-col gap-4 rounded-2xl border border-line bg-panel p-6">
              <span className="h-6 w-6 text-accent">{hobbyIcons[h.theme]}</span>
              <h4 className="text-2xl font-medium tracking-tight">{h.title}</h4>
              <p className="flex-1 leading-relaxed text-ink/70">{h.body}</p>
              {theme === h.theme ? (
                <span className="font-mono text-xs text-accent">● the home page right now</span>
              ) : (
                <button
                  onClick={() => {
                    onTheme(h.theme);
                    go(null);
                  }}
                  className="-my-2 self-start py-2 font-mono text-xs text-muted transition-colors hover:text-accent"
                >
                  Make it the home page →
                </button>
              )}
            </li>
          ))}
          <li className="flex flex-col gap-4 rounded-2xl border border-line bg-panel p-6">
            <span className="font-serif text-2xl italic leading-none text-accent">♪</span>
            <h4 className="text-2xl font-medium tracking-tight">Music</h4>
            <p className="flex-1 leading-relaxed text-ink/70">I love it. Apple Music is pretty much always on.</p>
          </li>
          <li className="flex flex-col gap-4 rounded-2xl border border-line bg-panel p-6">
            <span className="font-serif text-2xl italic leading-none text-accent">∞</span>
            <h4 className="text-2xl font-medium tracking-tight">Rabbit holes</h4>
            <p className="flex-1 leading-relaxed text-ink/70">Niche math and history, purely for the curiosity of it.</p>
            <button onClick={() => go("research")} className="-my-2 self-start py-2 font-mono text-xs text-muted transition-colors hover:text-accent">
              Some end up in Research →
            </button>
          </li>
        </ul>
      </section>

      <section>
        <SectionHead n={num("toolbox")} title="Toolbox" />
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((s, i) => (
            <div key={s.category}>
              <h4 className="mb-4 font-serif text-2xl italic">
                <span className="mr-2 font-mono text-xs not-italic text-accent">0{i + 1}</span>
                {s.category}
              </h4>
              <ul className="flex flex-wrap gap-2">
                {s.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-line px-2.5 py-1 text-sm text-ink/80 transition hover:border-accent hover:text-accent"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHead n={num("campuses")} title="Where I've studied" kicker={`${coursework.length} courses so far.`} />
        <ul className="space-y-5">
          {campuses.map((c) => (
            <li key={c.name} className="grid items-center gap-x-6 gap-y-2 md:grid-cols-[22rem_1fr_6.5rem]">
              <span className="font-medium">{c.name}</span>
              <span className="h-2 overflow-hidden rounded-full bg-ink/10">
                <span className="block h-full rounded-full bg-accent" style={{ width: `${(c.count / campuses[0].count) * 100}%` }} />
              </span>
              <span className="font-mono text-sm tabular-nums text-muted md:text-right">{c.count} courses</span>
            </li>
          ))}
        </ul>
        <button onClick={() => go("courses")} className="mt-6 py-2 font-mono text-xs text-muted transition-colors hover:text-accent">
          See every course →
        </button>
      </section>
    </div>
  );
}
