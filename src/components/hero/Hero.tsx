import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import AgeTicker from "./AgeTicker";

export default function Hero() {
  const [showSebastian, setShowSebastian] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const fullText = "Hi, my name is Sebastian, I build things that occasionally work.";
  const typingSpeed = 50;
  const sebastianFadeInDelay = 800;
  const typingStartDelay = 600;

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const sebastianTimer = setTimeout(() => {
      setShowSebastian(true);

      const typingTimer = setTimeout(() => {
        setShowTyping(true);
        setIsTyping(true);
        let currentIndex = 0;

        const typingInterval = setInterval(() => {
          if (currentIndex < fullText.length) {
            setDisplayedText(fullText.slice(0, currentIndex + 1));
            currentIndex++;
          } else {
            clearInterval(typingInterval);
            setIsTyping(false);
          }
        }, typingSpeed);

        return () => clearInterval(typingInterval);
      }, typingStartDelay);

      return () => clearTimeout(typingTimer);
    }, sebastianFadeInDelay);

    return () => {
      clearTimeout(sebastianTimer);
    };
  }, [fullText, typingSpeed, sebastianFadeInDelay, typingStartDelay]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen flex flex-col justify-center pt-32 pb-20 px-6"
      id="about"
    >
      <div className="space-y-6">
        <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-mono min-h-[4rem] md:min-h-[5rem] lg:min-h-[6rem] flex items-center">
          <AnimatePresence mode="wait">
            {!showTyping && showSebastian && (
              <motion.h1
                key="sebastian"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-white"
              >
                Sebastian Csizmazia
              </motion.h1>
            )}

            {showTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                {displayedText.split("").map((char, index) => {
                  const sebastianStart = fullText.indexOf("Sebastian");
                  const sebastianEnd = sebastianStart + "Sebastian".length;
                  const colorClass =
                    index >= sebastianStart && index < sebastianEnd
                      ? "text-white"
                      : "text-teal-400";

                  return (
                    <span key={index} className={colorClass}>
                      {char}
                    </span>
                  );
                })}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block w-1 h-8 md:h-10 lg:h-12 bg-teal-400 ml-2 align-middle"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg text-gray-400 max-w-4xl leading-relaxed mb-8"
        >
          4th year student at the University of British Columbia studying Computer Science and Data Science.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Currently<AgeTicker />years old.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex gap-4 mt-8"
        >
          <button
            onClick={() => scrollToId("projects")}
            className="px-6 py-3 bg-teal-400 text-[#0b0b0f] font-semibold rounded-lg hover:bg-teal-300 transition-colors duration-200"
          >
            View Projects
          </button>
          <button
            onClick={() => scrollToId("coursework")}
            className="px-6 py-3 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:border-teal-400 hover:text-teal-400 transition-colors duration-200"
          >
            View Coursework
          </button>
          <Link
            to="/about"
            className="px-6 py-3 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:border-teal-400 hover:text-teal-400 transition-colors duration-200"
          >
            About Me
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}