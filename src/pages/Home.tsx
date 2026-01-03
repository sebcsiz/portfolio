import Hero from "../components/hero/Hero";
import Terminal from "../components/terminal/Terminal";
import ProjectsGrid from "../components/projects/ProjectsGrid";
import CourseworkFilter from "../components/coursework/CourseworkFilter";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-6">
      <Hero />
      <Terminal />
      <ProjectsGrid />
      <CourseworkFilter />
    </main>
  );
}
