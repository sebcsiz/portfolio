import { useState } from "react";
import { coursework, type Course } from "../data/coursework";

type Category = Course["category"];

const colors: Record<Category, string> = {
  "Computer Science": "#2bd46a",
  Mathematics: "#ff8a5b",
  "Data Science & Statistics": "#7cc4ff",
  Other: "#a8a59a",
};
const categories = Object.keys(colors) as Category[];
const seasons: Record<string, number> = { Spring: 0, Summer: 1, Fall: 2 };

const firstTerm = (semester: string) => semester.split(" & ")[0];
const termOrder = (term: string) => {
  const [season, year] = term.split(" ");
  return +year * 3 + seasons[season];
};
const shortTerm = (term: string) => {
  const [season, year] = term.split(" ");
  return `${season.slice(0, 2)} '${year.slice(2)}`;
};
const courseNumber = (code: string) => parseInt(code.match(/\d+/)?.[0] ?? "0", 10);

// one column per term, oldest to newest
const terms = [...new Set(coursework.map((c) => firstTerm(c.semester)))]
  .sort((a, b) => termOrder(a) - termOrder(b))
  .map((term) => ({
    term,
    courses: coursework
      .filter((c) => firstTerm(c.semester) === term)
      .sort((a, b) => courseNumber(a.code) - courseNumber(b.code)),
  }));

const stats = [
  [coursework.length, "courses"],
  [new Set(coursework.map((c) => c.institution)).size, "institutions"],
  [terms.length, "terms"],
  [coursework.filter((c) => c.inProgress).length, "in progress"],
] as const;

const first = coursework.find((c) => c.inProgress) ?? terms[terms.length - 1].courses[0];
const hoverable = matchMedia("(hover: hover)").matches;

function Detail({ c }: { c: Course }) {
  return (
    <article className="rounded-2xl border border-line bg-panel p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span className="font-mono text-sm px-2 py-1 rounded text-bg" style={{ background: colors[c.category] }}>
          {c.code}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{c.category}</span>
        {c.inProgress && <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-accent">● in progress</span>}
      </div>
      <h3 className="text-2xl md:text-4xl font-medium tracking-tight leading-[1.05] mb-2">{c.title}</h3>
      <p className="font-mono text-xs text-muted mb-5">
        {c.institution} · {c.semester}
      </p>
      <p className="text-ink/80 leading-relaxed mb-6">{c.description}</p>
      <ul className="flex flex-wrap gap-2">
        {c.topics.map((t) => (
          <li key={t} className="font-mono text-xs px-2.5 py-1 rounded-md border border-line text-muted">
            {t}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function Courses() {
  const [selected, setSelected] = useState(first.id);
  const [category, setCategory] = useState<Category | null>(null);
  const course = coursework.find((c) => c.id === selected)!;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <dl className="flex flex-wrap gap-x-8 gap-y-4 md:gap-x-12">
          {stats.map(([value, label]) => (
            <div key={label} className="flex flex-col-reverse">
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{label}</dt>
              <dd className="text-4xl md:text-5xl font-semibold tracking-[-0.04em] tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(category === c ? null : c)}
              aria-pressed={category === c}
              className={`inline-flex h-9 items-center gap-2 font-mono text-xs px-3 rounded-full border transition active:scale-95 ${
                category === c ? "bg-ink text-bg border-ink" : "border-line text-muted hover:text-ink hover:border-muted"
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: colors[c] }} />
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-10 xl:grid-cols-[auto_minmax(0,1fr)] items-start">
        {/* periodic table of coursework: a column per term on desktop, a row per term (newest first) on mobile */}
        <div className="min-w-0 flex flex-col-reverse xl:flex-row xl:items-end gap-2 xl:gap-1.5">
          {terms.map(({ term, courses }) => (
            <div key={term}>
              <div className="flex xl:flex-col-reverse items-center gap-1.5">
                <span className="w-12 xl:w-auto shrink-0 font-mono text-[10px] text-muted xl:pt-1">{shortTerm(term)}</span>
                {courses.map((c) => {
                  const [dept, num] = c.code.split(" ");
                  const on = c.id === selected;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c.id)}
                      onPointerEnter={hoverable ? () => setSelected(c.id) : undefined}
                      aria-pressed={on}
                      aria-label={`${c.code} ${c.title}, ${c.semester}`}
                      className={`relative w-12 min-w-0 aspect-square xl:w-14 xl:h-12 xl:aspect-auto xl:shrink-0 overflow-hidden rounded-md p-1 xl:p-1.5 flex flex-col justify-between text-left text-bg transition duration-200 ${
                        on ? "z-10 scale-110 ring-2 ring-ink ring-offset-2 ring-offset-bg" : "hover:scale-105"
                      } ${category && c.category !== category ? "opacity-15" : ""}`}
                      style={{ background: colors[c.category] }}
                    >
                      <span className="font-mono text-[8px] leading-none opacity-70">{dept}</span>
                      <span className="font-mono text-[13px] xl:text-sm font-medium leading-none">{num}</span>
                      {c.inProgress && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-bg animate-pulse" />}
                    </button>
                  );
                })}
              </div>
              {courses.includes(course) && (
                <div className="xl:hidden mt-3 mb-4">
                  <Detail c={course} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden xl:block sticky top-24">
          <Detail c={course} />
        </div>
      </div>
    </div>
  );
}
