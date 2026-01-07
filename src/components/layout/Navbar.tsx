import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import AnimatedLogo from "./AnimatedLogo";

export default function Navbar() {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 bg-[#0b0b0f]/80 backdrop-blur-md border-b border-zinc-800"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <AnimatedLogo />
        <div className="flex gap-6 text-gray-400">
          {location.pathname === "/" && (
            <>
              <a
                href="#projects"
                className="hover:text-teal-400 transition-colors duration-200"
              >
                Projects
              </a>
              <a
                href="#coursework"
                className="hover:text-teal-400 transition-colors duration-200"
              >
                Coursework
              </a>
              <a
                href="#contact"
                className="hover:text-teal-400 transition-colors duration-200"
              >
                Contact
              </a>
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
