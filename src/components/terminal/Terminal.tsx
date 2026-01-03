import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Section from "../layout/Section";

const commands = [
  { command: "whoami", output: "Sebastian Csizmazia - Computer Science Student" },
  { command: "ls skills", output: "Java, Python, SQL, R, PHP, Swift" },
  { command: "cat interests.txt", output: "Machine Learning, Operating Systems, Security" },
  { command: "echo $GOAL", output: "Building software to solve complex problems" },
];

export default function Terminal() {
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentCommand = commands[currentCommandIndex];
    let charIndex = 0;
    setIsTyping(true);
    setDisplayedText("");

    const typingInterval = setInterval(() => {
      if (charIndex < currentCommand.command.length) {
        setDisplayedText(currentCommand.command.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setIsTyping(false);
          setTimeout(() => {
            setCurrentCommandIndex((prev) => (prev + 1) % commands.length);
          }, 2000);
        }, 500);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [currentCommandIndex]);

  const currentCommand = commands[currentCommandIndex];

  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-panel border border-zinc-800 rounded-lg overflow-hidden"
      >
        <div className="bg-zinc-900 px-4 py-3 flex items-center gap-2 border-b border-zinc-800">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-4 text-gray-400 text-sm font-mono">terminal</span>
        </div>
        
        <div className="p-6 font-mono text-sm min-h-[120px]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-teal-400">$</span>
            <span className="text-white">
              {displayedText}
              {isTyping && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-teal-400 ml-1"
                />
              )}
            </span>
          </div>
          
          <div className="min-h-[40px]">
            {!isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-gray-400 mt-2"
              >
                {currentCommand.output}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

