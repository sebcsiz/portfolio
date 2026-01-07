import { motion, AnimatePresence, easeOut } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { projects, type Project } from "../../data/projects";
import Section from "../layout/Section";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
};

function ProjectCard({ project }: { project: Project }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (descriptionRef.current) {
      const element = descriptionRef.current;
      setIsTruncated(element.scrollHeight > element.clientHeight);
    }
  }, [project.description]);

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="relative bg-panel border border-zinc-800 rounded-lg p-6 hover:border-teal-400/50 transition-all duration-300 group"
    >
      {project.featured && (
        <div className="absolute -top-3 -right-3 bg-teal-400 text-[#0b0b0f] px-3 py-1 rounded-full text-xs font-semibold z-10">
          Featured
        </div>
      )}
      {project.inProgress && (
        <div className="absolute -top-3 -right-3 bg-yellow-500 text-[#0b0b0f] px-3 py-1 rounded-full text-xs font-semibold z-10">
          In Progress
        </div>
      )}
      
      <div className="relative mb-4">
        {project.imageUrl ? (
          <img 
            src={project.imageUrl} 
            alt={project.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-teal-400/20 to-blue-500/20 rounded-lg flex items-center justify-center">
            <span className="text-4xl">🚀</span>
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors">
        {project.title}
      </h3>
      
      <div className="relative mb-4">
        <p
          ref={descriptionRef}
          className="text-gray-400 text-sm line-clamp-3"
          onMouseEnter={() => {
            if (isTruncated) {
              setShowTooltip(true);
            }
          }}
          onMouseLeave={() => {
            setShowTooltip(false);
          }}
        >
          {project.description}
        </p>
        
        <AnimatePresence>
          {showTooltip && isTruncated && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 p-3 bg-panel border border-teal-400/50 rounded-lg shadow-lg z-50"
              style={{ pointerEvents: "none" }}
            >
              <p className="text-sm text-gray-300 leading-relaxed">
                {project.description}
              </p>
              <div className="absolute -top-1 left-6 w-2 h-2 bg-panel border-l border-t border-teal-400/50 rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="px-2 py-1 bg-zinc-800 text-gray-300 text-xs rounded"
          >
            {tech}
          </span>
        ))}
      </div>
      
      <div className="flex gap-4">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 text-sm font-mono flex items-center gap-2"
          >
            <span>GitHub</span>
            <span>→</span>
          </a>
        )}
        {/* {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 text-sm font-mono flex items-center gap-2"
          >
            <span>Live Demo</span>
            <span>→</span>
          </a>
        )} */}
      </div>
    </motion.div>
  );
}

export default function ProjectsGrid() {
  const inProgressProjects = projects.filter((project) => project.inProgress);
  const completedProjects = projects.filter((project) => !project.inProgress);

  return (
    <Section>
      <div id="projects" className="scroll-mt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            <span className="text-teal-400 font-mono text-2xl">02.</span> Projects
          </h2>
          <p className="text-gray-400 text-lg">
            A collection of projects I've built, ranging from web applications to
            data visualization tools.
          </p>
        </motion.div>

        {/* In Progress Section */}
        {inProgressProjects.length > 0 && (
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h3 className="text-2xl font-bold text-white mb-2">
                In Progress
              </h3>
              <p className="text-gray-400">
                Projects I'm currently working on
              </p>
            </motion.div>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {inProgressProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </motion.div>
          </div>
        )}

        {/* Completed Projects Section */}
        {completedProjects.length > 0 && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h3 className="text-2xl font-bold text-white mb-2">
                Completed
              </h3>
              <p className="text-gray-400">
                Finished projects and applications
              </p>
            </motion.div>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {completedProjects.map((project) => (
                <ProjectCard key={project.id} project={project}/>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </Section>
  );
}
