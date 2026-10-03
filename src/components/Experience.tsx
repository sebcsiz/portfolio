import Cover from "./covers/Cover";
import { experience } from "../data/experience";

// Work experience cards for the About page
export default function Experience() {
  return (
    <div className="space-y-8">
      {experience.map((job) => (
        <article key={`${job.company}${job.role}`} className="overflow-hidden rounded-2xl border border-line bg-panel">
          <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <Cover kind={job.cover} className="border-b border-line lg:aspect-auto lg:min-h-full lg:border-b-0 lg:border-r" />
            <div className="flex flex-col gap-5 p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em]">
                <span className="rounded bg-accent px-2 py-1 text-bg">
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-bg align-middle" />
                  {job.status}
                </span>
                <span className="rounded border border-line px-2 py-1 text-muted">{job.team}</span>
              </div>
              <div>
                <h4 className="text-2xl font-medium leading-tight tracking-tight md:text-3xl">{job.role}</h4>
                <p className="mt-1 text-ink/80">
                  {job.company} · {job.location}
                </p>
              </div>
              <p className="font-serif text-2xl italic leading-tight text-accent md:text-3xl">{job.headline}</p>
              <p className="leading-relaxed text-ink/80">{job.summary}</p>
              <dl className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
                {job.facts.map(([value, label]) => (
                  <div key={label} className="bg-panel px-4 py-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{label}</dt>
                    <dd className="mt-1 text-lg font-medium tracking-tight text-accent md:text-xl">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="grid gap-x-12 gap-y-10 border-t border-line p-6 md:grid-cols-2 md:p-8">
            {job.sections.map((s) => (
              <section key={s.title}>
                <h5 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">{s.title}</h5>
                {s.body && <p className="leading-relaxed text-ink/80">{s.body}</p>}
                {s.points && (
                  <ul className="mt-3 space-y-2">
                    {s.points.map((point) => (
                      <li key={point} className="flex gap-3 leading-relaxed text-ink/80">
                        <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
                {s.note && <p className="mt-4 border-l-2 border-accent pl-4 text-sm leading-relaxed text-ink/70">{s.note}</p>}
              </section>
            ))}
          </div>

          <div className="border-t border-line px-6 py-5 md:px-8">
            <h5 className="sr-only">Technologies</h5>
            <ul className="flex flex-wrap gap-1.5">
              {job.stack.map((t) => (
                <li key={t} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-muted">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}
