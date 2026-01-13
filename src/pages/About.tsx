import { motion, easeOut } from "framer-motion";
import { Link } from "react-router-dom";
import AgeTicker from "../components/hero/AgeTicker";

export default function About() {
  const skills = [
    { category: "Languages", items: ["Java", "Python", "R", "PHP", "Swift", "Visual Basic", "C++", "JavaScript"] },
    { category: "Libraries & Frameworks", items: ["Node.js", ".NET", "FastAPI", "Pandas", "NumPy", "Scikit-learn"] },
    { category: "Database", items: ["Oracle SQL Developer", "MySQL", "SQLite", "Firebase"] },
    { category: "Tools", items: ["Linux", "Apache", "Git", "Docker", "CI/CD"] },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };

  return (
    <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            About <span className="text-teal-400">Me</span>
          </h1>
          <div className="w-24 h-1 bg-teal-400 mx-auto mb-6"></div>
        </motion.div>

        <motion.section variants={itemVariants} className="space-y-6">
          <h2 className="text-3xl font-bold text-white mb-4">
            <span className="text-teal-400 font-mono text-xl">01.</span> Introduction
          </h2>
          <div className="bg-panel border border-zinc-800 rounded-lg p-8">
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              I am a Computer Science major with a minor in Data Science at the University of British Columbia Okanagan, 
              with a strong foundation in mathematics, statistics, and software development. Through coursework and projects, 
              I have built and deployed full-stack applications, designed relational databases, and analyzed datasets using 
              statistical and machine-learning techniques to extract actionable insights.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              My project experience includes developing data-driven models, implementing backend systems that handle user 
              authentication and transactions, and creating visualizations to communicate results effectively. I focus on 
              writing clear, maintainable code, validating results with quantitative reasoning, and iterating based on 
              measurable outcomes such as model accuracy, performance, and system reliability.
            </p>
            <p className="text-gray-300 leading-relaxed">
              I am currently
              <AgeTicker />
              years old living in Kelowna, Canada. Outside of school I enjoy
              playing soccer, snowboarding, and video games.
            </p>

            {/* <div className="mt-6">
              <AgeTicker />
            </div> */}
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="space-y-6">
          <h2 className="text-3xl font-bold text-white mb-4">
            <span className="text-teal-400 font-mono text-xl">02.</span> Skills & Technologies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.category}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-panel border border-zinc-800 rounded-lg p-6 hover:border-teal-400/50 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  {skill.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 bg-zinc-800 text-gray-300 text-sm rounded hover:bg-teal-400/20 hover:text-teal-400 transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="space-y-6">
          <h2 className="text-3xl font-bold text-white mb-4">
            <span className="text-teal-400 font-mono text-xl">03.</span> Interests
          </h2>
          <div className="bg-panel border border-zinc-800 rounded-lg p-8">
            <p className="text-gray-300 text-lg leading-relaxed">
              When I'm not coding, I enjoy playing video games and soccer, snowboarding whenever I get the chance,
              and diving into niche math and history. I'll probably forget most of what I learn shortly after, but 
              I genuinly enjoy going down random rabbit holes and learning about things I'll likely never encounter 
              again, purely for the curiosity of it. I like exploring how complex systems, whether in games, sports, 
              or historical patterns, are structured and how small details have a big impact.
            </p>
          </div>
        </motion.section>

        <motion.div
          variants={itemVariants}
          className="flex justify-center pt-8"
        >
          <Link
            to="/"
            className="px-8 py-3 bg-teal-400 text-[#0b0b0f] font-semibold rounded-lg hover:bg-teal-300 transition-colors duration-200 flex items-center gap-2"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}