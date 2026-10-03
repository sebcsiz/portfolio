import { useForm, ValidationError } from "@formspree/react";

const field =
  "w-full bg-transparent border-b border-line py-4 text-xl md:text-2xl placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors";

export default function Contact() {
  const [state, handleSubmit] = useForm("mrebnbkg");

  if (state.succeeded) {
    return (
      <p className="text-4xl md:text-6xl font-medium tracking-tight max-w-3xl leading-tight">
        Message received. <span className="font-serif italic font-normal text-accent">I'll get back to you soon.</span>
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-10 gap-y-2 max-w-5xl">
      <label htmlFor="name" className="sr-only">Name</label>
      <input id="name" type="text" name="name" required placeholder="Your name" autoComplete="name" className={field} />
      <label htmlFor="email" className="sr-only">Email</label>
      <input id="email" type="email" name="email" required placeholder="you@email.com" autoComplete="email" className={field} />
      <label htmlFor="message" className="sr-only">Message</label>
      <textarea id="message" name="message" required rows={4} placeholder="What's on your mind?" className={`${field} md:col-span-2 resize-none`} />
      <ValidationError prefix="Email" field="email" errors={state.errors} className="md:col-span-2 font-mono text-sm text-[#ff8a5b]" />

      <div className="md:col-span-2 mt-10 flex flex-wrap items-center justify-between gap-6">
        <a
          href="https://github.com/sebcsiz"
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 font-mono text-sm text-muted hover:text-accent transition-colors"
        >
          or find me on github.com/sebcsiz ↗
        </a>
        <button
          type="submit"
          disabled={state.submitting}
          className="group inline-flex items-center gap-3 rounded-full bg-accent text-bg px-8 py-4 text-lg font-semibold transition hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60"
        >
          {state.submitting ? "Sending…" : "Send message"}
          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>
    </form>
  );
}
