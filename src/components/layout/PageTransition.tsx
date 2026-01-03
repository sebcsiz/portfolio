import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      rotateY: 90,
      scale: 0.9,
      z: -200,
    },
    animate: {
      opacity: 1,
      rotateY: 0,
      scale: 1,
      z: 0,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      rotateY: -90,
      scale: 0.9,
      z: -200,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
      className="min-h-screen overflow-hidden"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

