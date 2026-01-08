import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import AnimatedLogo from "./AnimatedLogo";

export default function Navbar() {
  const location = useLocation();

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 bg-[#0b0b0f]/80 backdrop-blur-md border-b border-zinc-800"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
      <button
          onClick={scrollToTop}
          className="p-0 m-0 cursor-pointer"
          aria-label="Go to top"
        >
          <AnimatedLogo />
        </button>
        <div className="flex gap-6 text-gray-400">
          {location.pathname === "/" && (
            <>
              <button
                onClick={() => scrollToId("projects")}
                className="hover:text-teal-400 transition-colors duration-200"
              >
                Projects
              </button>
              <button
                onClick={() => scrollToId("coursework")}
                className="hover:text-teal-400 transition-colors duration-200"
              >
                Coursework
              </button>
              <button
                onClick={() => scrollToId("contact")}
                className="hover:text-teal-400 transition-colors duration-200"
              >
                Contact
              </button>
            </>
          )}

          <Link
            to="/about"
            className={`hover:text-teal-400 transition-colors duration-200 ${
              location.pathname === "/about" ? "text-teal-400" : ""
            }`}
          >
            About
          </Link>

          {location.pathname === "/about" && (
            <Link
              to="/"
              className="hover:text-teal-400 transition-colors duration-200"
            >
              Home
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
