import { useEffect, useState } from "react";
import { getAge } from "../data/profile";

export default function AgeTicker({ className = "font-mono text-accent mx-1" }: { className?: string }) {
  const [age, setAge] = useState(getAge());

  useEffect(() => {
    const id = setInterval(() => setAge(getAge()), 50);
    return () => clearInterval(id);
  }, []);

  return <span className={`inline-block tabular-nums ${className}`}>{age.toFixed(9)}</span>;
}
