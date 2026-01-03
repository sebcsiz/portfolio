import { motion } from "framer-motion";

export default function Section({ children }: { children: React.ReactNode }) {
    return (
        <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-32"
        >
        {children}
        </motion.section>
    );
}
