import type { CoverKind } from "../components/covers/Cover";

export type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  cover: CoverKind; // the animation on the project's card
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  inProgress?: boolean;
};

export const projects: Project[] = [
  {
    id: "1",
    title: "Payment Risk Platform",
    description: "A full-stack e-commerce solution with user authentication, payment processing, email integration and user/admin dashboard. Built with modern web technologies for optimal performance. Currently upgrading to include a fraud detection ML model, and migrating data persistently from JSON to PostgreSQL.",
    technologies: ["Next.js", "PyTorch", "FastAPI", "PostgreSQL", "Docker", "Stripe", "SendGrid"],
    inProgress: false,
    githubUrl: "https://github.com/sebcsiz/Payment-Risk-Platform",
    cover: "risk",
  },
  {
    id: "2",
    title: "Wine Tour Mobile App",
    description: "A mobile app for wine tours that allows users to browse and book wine tours.",
    technologies: ["Java", "Android Studio", "HCI Design Principles", "User-Centered Design"],
    githubUrl: "https://github.com/sebcsiz/COSC341-Project",
    cover: "phone",
  },
  {
    id: "3",
    title: "Data Analytics Project",
    description: "Created insightful visualizations based on a soccer dataset",
    technologies: ["Python", "Jupyter Notebook", "Understat API", "Matplotlib", "Plotly"],
    githubUrl: "https://github.com/sebcsiz/DATA301-Project",
    cover: "shots",
  },
  {
    id: "4",
    title: "Chatroom Web Application",
    description: "A chatroom web application that allows users to chat with each other. Built for chatting locally or online with others via IP address.",
    technologies: ["Java (JSP)", "WebSockets", "Apache Tomcat", "JDBC"],
    githubUrl: "https://github.com/sebcsiz/COSC318-Project",
    cover: "chat",
  },
  {
    id: "5",
    title: "Browser Fingerprint Spoofer",
    description: "A small chrome extension that allows users to spoof their browser fingerprint.",
    technologies: ["JavaScript", "Chrome Extension"],
    githubUrl: "https://github.com/sebcsiz/Browser-Fingerprint-Spoofer",
    cover: "fingerprint",
  },
  {
    id: "6",
    title: "Portfolio Website",
    description: "A portfolio website that showcases my projects and completed coursework.",
    technologies: ["TypeScript", "Vite", "Tailwind CSS", "React"],
    inProgress: false,
    githubUrl: "https://github.com/sebcsiz/portfolio",
    cover: "hub",
  },
  {
    id: "7",
    title: "Open xG Prediction Model",
    description: "An xG prediction model that uses machine learning to predict the likelihood of a goal being scored in a soccer match from a short video",
    technologies: ["Python", "OpenCV", "PyTorch", "Machine Learning", "FFmpeg"],
    inProgress: true,
    cover: "neural",
  },
  {
    id: "9",
    title: "Game of the Amazons AI agent",
    description: "A course project for Artificial Intelligence that implements an AI agent to play the Game of the Amazons using the minimax algorithm with alpha-beta pruning and heuristic evaluation functions.",
    technologies: ["Java", "Artificial Intelligence", "Minimax Algorithm", "Alpha-Beta Pruning"],
    inProgress: false,
    githubUrl: "https://github.com/JUICEM0N/Game-of-Amazons-Bot",
    cover: "tree",
  }
];