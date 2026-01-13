
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const birthDate = new Date("2003-07-09T11:11:00");

function getAge() {
  return (
    (Date.now() - birthDate.getTime()) /
    (1000 * 60 * 60 * 24 * 365.2422)
  );
}

export default function AgeTicker() {
  const [age, setAge] = useState(getAge());

  useEffect(() => {
    const id = setInterval(() => setAge(getAge()), 50);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="
        font-mono
        text-teal-400
        font-semibold
        mx-1
        inline-block
        tabular-nums
        text-sm
        sm:text-base
      "
    >
      {age.toFixed(9)}
    </motion.span>
  );
}