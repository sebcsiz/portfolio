import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const misspellings = [
  "Cizmazia",
  "Csizamzia",
  "Czismazia",
  "Csizmaziya",
  "Csizmasia",
  "Cszimazia",
  "Csizmzia",
  "Csizamazia",
  "Csizmaazia",
  "Csizmaszia",
  "Czizamazia",
  "Czimazia",
  "Csizamzia",
  "Csizamazya",
  "Csizmaziaa",
  "Csizmazija",
  "Csizmazya",
  "Cszizamazia",
  "Csizmazai",
  "Csizamazija",
];

export default function AnimatedLogo() {
  const [displayedText, setDisplayedText] = useState("Sebastian");
  const [isTyping, setIsTyping] = useState(false);
  const [isBackspacing, setIsBackspacing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const typingSpeed = 100;
  const backspaceSpeed = 50;
  const pauseAfterTyping = 2000;
  const pauseAfterBackspace = 500;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;
    let currentMisspellingIndex = 0;

    const startTypingMisspelling = () => {
      const misspelling = misspellings[currentMisspellingIndex];
      setIsTyping(true);
      setIsBackspacing(false);
      let charIndex = 0;

      intervalId = setInterval(() => {
        if (charIndex < misspelling.length) {
          setDisplayedText(`Sebastian ${misspelling.slice(0, charIndex + 1)}`);
          charIndex++;
        } else {
          clearInterval(intervalId);
          setIsTyping(false);
          
          timeoutId = setTimeout(() => {
            startBackspacing(misspelling);
          }, pauseAfterTyping);
        }
      }, typingSpeed);
    };

    const startBackspacing = (fullMisspelling: string) => {
      setIsBackspacing(true);
      setIsTyping(false);
      const fullText = `Sebastian ${fullMisspelling}`;
      let charIndex = fullText.length;

      intervalId = setInterval(() => {
        if (charIndex > "Sebastian".length) {
          charIndex--;
          setDisplayedText(fullText.slice(0, charIndex));
        } else {
          clearInterval(intervalId);
          setIsBackspacing(false);
          setDisplayedText("Sebastian");
          
          currentMisspellingIndex = (currentMisspellingIndex + 1) % misspellings.length;
          timeoutId = setTimeout(() => {
            startTypingMisspelling();
          }, pauseAfterBackspace);
        }
      }, backspaceSpeed);
    };

    timeoutId = setTimeout(() => {
      startTypingMisspelling();
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  const letters = displayedText.split("");

  const sebastianLength = "Sebastian".length;
  const hasLastName = displayedText.length > sebastianLength;
  const lastNameStartIndex = sebastianLength + 1;

  return (
    <Link to="/" className="relative flex items-center gap-1 cursor-pointer">
      <div className="flex items-center font-semibold text-lg">
        {letters.map((letter, index) => {
          const isSebastianPart = index < sebastianLength;
          const isSpace = letter === " ";
          const isLastNamePart = index >= lastNameStartIndex; // Everything after "Sebastian " (including space)
          
          return (
            <span
              key={`${displayedText}-${index}-${letter}`}
              className={`${
                isLastNamePart && !isSpace
                  ? "text-teal-400" 
                  : "text-white"
              }`}
              style={{
                textShadow: isSebastianPart ? "0 0 10px rgba(94, 234, 212, 0.3)" : undefined,
              }}
              onMouseEnter={() => {
                if (isLastNamePart && !isSpace) {
                  setShowTooltip(true);
                }
              }}
              onMouseLeave={() => {
                if (isLastNamePart && !isSpace) {
                  setShowTooltip(false);
                }
              }}
            >
              {isSpace ? "\u00A0" : letter}
            </span>
          );
        })}
        
        {}
        {(isTyping || isBackspacing) && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-teal-400 ml-1 font-mono text-lg"
          >
            ▋
          </motion.span>
        )}
      </div>
      
      {}
      {hasLastName && showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 mt-2 px-3 py-2 bg-panel border border-teal-400/50 rounded-lg shadow-lg z-50 whitespace-nowrap"
          style={{ pointerEvents: "none" }}
        >
          <p className="text-sm text-gray-300">
            The proper spelling is <span className="text-teal-400 font-semibold">Csizmazia</span>
          </p>
          {}
          <div className="absolute -top-1 left-8 w-2 h-2 bg-panel border-l border-t border-teal-400/50 rotate-45"></div>
        </motion.div>
      )}
    </Link>
  );
}
