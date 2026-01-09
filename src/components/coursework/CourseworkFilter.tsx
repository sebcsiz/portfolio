import { motion, AnimatePresence, easeOut } from "framer-motion";
import { useState } from "react";
import { coursework, type Course } from "../../data/coursework";
import Section from "../layout/Section";

const categories = ["All", "Computer Science", "Mathematics", "Data Science & Statistics", "Other"];

const yearLevels = ["All", "1", "2", "3", "4"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: easeOut,
    },
  },
};

const getCourseNumber = (code: string): number => {
  const match = code.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

function CourseCard({ course }: { course: Course }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ x: 8, transition: { duration: 0.2 } }}
      className="relative bg-panel border border-zinc-800 rounded-lg p-6 hover:border-teal-400/50 transition-all duration-300"
    >
      {course.inProgress && (
        <div className="absolute -top-3 -right-3 bg-yellow-500 text-[#0b0b0f] px-3 py-1 rounded-full text-xs font-semibold z-10">
          In Progress
        </div>
      )}

      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">
            {course.title}
          </h3>
          <p className="text-teal-400 font-mono text-sm">{course.code}</p>
        </div>

        {course.grade && (
          <span className="px-3 py-1 bg-teal-400/20 text-teal-400 rounded-full text-sm font-semibold">
            {course.grade}
          </span>
        )}
      </div>

      <p className="text-gray-400 text-sm mb-2">
        {course.institution} • {course.semester}
      </p>

      <p className="text-gray-300 mb-4">{course.description}</p>

      <div className="flex flex-wrap gap-2">
        {course.topics.map((topic) => (
          <span
            key={topic}
            className="px-2 py-1 bg-zinc-800 text-gray-300 text-xs rounded"
          >
            {topic}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function CourseworkFilter() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedYearLevel, setSelectedYearLevel] = useState("All");

  const inProgressCourses = coursework
    .filter((course) => course.inProgress)
    .sort(
      (a, b) => getCourseNumber(a.code) - getCourseNumber(b.code)
    );

  const completedCourses = coursework
    .filter((course) => !course.inProgress)
    .filter((course) => {
      const matchesCategory =
        selectedCategory === "All" ||
        course.category === selectedCategory;

      const matchesYearLevel =
        selectedYearLevel === "All" ||
        course.yearLevel.toString() === selectedYearLevel;

      return matchesCategory && matchesYearLevel;
    })
    .sort(
      (a, b) => getCourseNumber(a.code) - getCourseNumber(b.code)
    );

  return (
    <Section>
      <div id="coursework" className="scroll-mt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            <span className="text-teal-400 font-mono text-2xl">03.</span>{" "}
            Coursework
          </h2>
          <p className="text-gray-400 text-lg">
            Courses completed and currently in progress throughout my academic
            journey.
          </p>
        </motion.div>

        <div className="mb-10 space-y-4">
          <div className="flex flex-wrap gap-3">
            <span className="text-gray-400 font-semibold mr-2">
              Category:
            </span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === category
                    ? "bg-teal-400 text-[#0b0b0f]"
                    : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="text-gray-400 font-semibold mr-2">
              Year Level:
            </span>
            {yearLevels.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYearLevel(year)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedYearLevel === year
                    ? "bg-teal-400 text-[#0b0b0f]"
                    : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                }`}
              >
                {year === "All" ? "All" : `Year ${year}`}
              </button>
            ))}
          </div>
        </div>

        {inProgressCourses.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-6">
              In Progress
            </h3>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {inProgressCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </motion.div>
          </div>
        )}

        <div>
          <h3 className="text-2xl font-bold text-white mb-6">
            Completed
          </h3>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${selectedYearLevel}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {completedCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}