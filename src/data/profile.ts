export const birthDate = new Date("2003-07-09T11:11:00");

export const getAge = () => (Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.2422);

export const skills = [
  { category: "Languages", items: ["Java", "Python", "C", "Swift", "R", "PHP", "JavaScript"] },
  { category: "Libraries & Frameworks", items: ["Node.js", ".NET (Visual Basic)", "FastAPI", "Pandas", "NumPy", "PyTorch"] },
  { category: "Database", items: ["Oracle SQL Developer", "MySQL", "PostgreSQL", "SQLite", "Firebase"] },
  { category: "Tools", items: ["Linux", "Apache Server", "Git", "Docker", "CI/CD", "LaTeX"] },
];
