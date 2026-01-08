import { useForm, ValidationError } from "@formspree/react";
import { motion } from "framer-motion";

export default function Contact() {
  const [state, handleSubmit] = useForm("mrebnbkg");

  if (state.succeeded) {
    return (
      <section className="py-32 text-center">
        <h2 className="text-3xl font-bold text-teal-400">Message sent!</h2>
        <p className="text-gray-400 mt-4">
          I’ll get back to you as soon as possible.
        </p>
      </section>
    );
  }

  return (
    <section id="contact" className="py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-white mb-4">
          <span className="text-teal-400 font-mono text-2xl">03.</span> Contact
        </h2>

        <p className="text-gray-400 mb-10">
          Feel free to send me a message and I will respond as soon as I can!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            required
            placeholder="Your name"
            className="w-full bg-panel border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-400"
          />

          <input
            type="email"
            name="email"
            required
            placeholder="Your email"
            className="w-full bg-panel border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-400"
          />

          <textarea
            name="message"
            required
            rows={5}
            placeholder="Your message"
            className="w-full bg-panel border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-400 resize-none"
          />

          <ValidationError prefix="Email" field="email" errors={state.errors} />

          <button
            type="submit"
            disabled={state.submitting}
            className="w-full bg-teal-400 text-[#0b0b0f] font-semibold py-3 rounded-lg hover:bg-teal-300 transition"
          >
            {state.submitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
