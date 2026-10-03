import Cover from "../components/covers/Cover";
import { projects } from "../data/projects";

const sorted = [...projects].sort((a, b) => Number(!!b.inProgress) - Number(!!a.inProgress));

export default function Projects() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {sorted.map((p) => (
        <li
          key={p.id}
          className="flex flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-colors duration-300 hover:border-accent/40"
        >
          <Cover kind={p.cover} className="border-b border-line" />
          <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-medium leading-tight tracking-tight md:text-2xl">{p.title}</h3>
              <span className="shrink-0 pt-1.5 font-mono text-[10px] uppercase tracking-widest">
                {p.inProgress ? (
                  <span className="text-accent">
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent align-middle" />
                    building
                  </span>
                ) : (
                  <span className="text-muted">done</span>
                )}
              </span>
            </div>
            <p className="flex-1 leading-relaxed text-ink/75">{p.description}</p>
            <ul className="flex flex-wrap gap-1.5">
              {p.technologies.map((t) => (
                <li key={t} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-muted">
                  {t}
                </li>
              ))}
            </ul>
            {p.githubUrl ? (
              <a
                href={p.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="-my-2 self-start py-2 font-mono text-sm text-accent hover:underline"
              >
                View on GitHub ↗
              </a>
            ) : (
              <span className="font-mono text-xs text-muted">Repo not public yet</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
