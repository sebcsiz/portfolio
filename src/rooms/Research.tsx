import Cover from "../components/covers/Cover";
import { research } from "../data/research";
import type { Go } from "../data/rooms";

export default function Research({ go }: { go: Go }) {
  if (!research.length) {
    return (
      <div className="grid items-end gap-10 border-t border-line pt-12 lg:grid-cols-12">
        <p className="font-serif text-4xl italic leading-[1.05] md:text-6xl lg:col-span-7">Lab notes, coming soon.</p>
        <div className="space-y-6 text-lg leading-relaxed text-ink/75 lg:col-span-5">
          <p>Papers, experiments and deep dives will land here as they take shape.</p>
          <button onClick={() => go("projects")} className="font-mono text-sm text-muted transition-colors hover:text-accent">
            Meanwhile, see the projects →
          </button>
        </div>
      </div>
    );
  }

  return (
    <ol className="space-y-8 md:space-y-12">
      {research.map((r) => (
        <li key={r.title} className="grid overflow-hidden rounded-2xl border border-line bg-panel lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <Cover kind={r.cover} className="border-b border-line lg:aspect-auto lg:min-h-full lg:border-b-0 lg:border-r" />
          <article className="flex flex-col gap-5 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em]">
              <span className="rounded bg-accent px-2 py-1 text-bg">{r.kind}</span>
              <span className="rounded border border-line px-2 py-1 text-ink/80">{r.role}</span>
              <span className="rounded border border-line px-2 py-1 text-muted">{r.status}</span>
              <span className="text-muted">{r.date}</span>
            </div>
            <div>
              <h3 className="text-2xl font-medium leading-tight tracking-tight md:text-3xl">{r.title}</h3>
              <p className="mt-2 font-mono text-xs text-muted">{r.context}</p>
            </div>
            <p className="leading-relaxed text-ink/80">{r.summary}</p>
            <dl className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
              {r.findings.map(([value, label]) => (
                <div key={label} className="bg-panel px-4 py-3 sm:[&:last-child:nth-child(odd)]:col-span-2">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{label}</dt>
                  <dd className="mt-1 text-lg font-medium tracking-tight text-accent md:text-xl">{value}</dd>
                </div>
              ))}
            </dl>
            <ul className="flex flex-wrap gap-1.5">
              {r.tags.map((t) => (
                <li key={t} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-muted">
                  {t}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-x-6">
              {r.links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="-my-2 py-2 font-mono text-sm text-accent hover:underline">
                  {l.label} ↗
                </a>
              ))}
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
