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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-6 font-mono text-gray-400 text-lg"
    >
      Age:{" "}
      <motion.span
        key={age.toFixed(9)}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
        className="text-teal-400 font-semibold"
      >
        {age.toFixed(9)}
      </motion.span>
    </motion.div>
  );
}
