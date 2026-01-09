export type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  inProgress?: boolean;
};

export const projects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with user authentication, payment processing, email integration and user/admin dashboard. Built with modern web technologies for optimal performance.",
    technologies: ["Next.js", "JavaScript", "FastAPI", "Docker", "Stripe", "SendGrid"],
    githubUrl: "https://github.com/sebcsiz/Amazon-Clone",
    imageUrl: "project-covers/ecommerce-platform.svg",
  },
  {
    id: "2",
    title: "Wine Tour Mobile App",
    description: "A mobile app for wine tours that allows users to browse and book wine tours.",
    technologies: ["Java", "Android Studio", "HCI Design Principles", "User-Centered Design"],
    githubUrl: "https://github.com/sebcsiz/COSC341-Project",
    imageUrl: "project-covers/wine-tour-app.svg",
  },
  {
    id: "3",
    title: "Data Analytics Project",
    description: "Created insightful visualizations based on a soccer dataset",
    technologies: ["Python", "Jupyter Notebook", "Understat API", "Matplotlib", "Plotly"],
    githubUrl: "https://github.com/sebcsiz/DATA301-Project",
    imageUrl: "project-covers/data-analytics.svg",
  },
  {
    id: "4",
    title: "Chatroom Web Application",
    description: "A chatroom web application that allows users to chat with each other. Built for chatting locally or online with others via IP address.",
    technologies: ["Java (JSP)", "WebSockets", "Apache Tomcat", "JDBC"],
    githubUrl: "https://github.com/sebcsiz/COSC318-Project",
    imageUrl: "project-covers/chatroom-app.svg",
  },
  {
    id: "5",
    title: "Browser Fingerprint Spoofer",
    description: "A small chrome extension that allows users to spoof their browser fingerprint.",
    technologies: ["JavaScript", "Chrome Extension"],
    githubUrl: "https://github.com/sebcsiz/Browser-Fingerprint-Spoofer",
    imageUrl: "project-covers/browser-spoofer.svg",
  },
  {
    id: "6",
    title: "Portfolio Website",
    description: "A portfolio website that showcases my projects and completed coursework.",
    technologies: ["TypeScript", "Vite", "Tailwind CSS", "React"],
    inProgress: true,
    imageUrl: "project-covers/portfolio-website.svg",
  },
  {
    id: "7",
    title: "Open xG Prediction Model",
    description: "An xG prediction model that uses machine learning to predict the likelihood of a goal being scored in a soccer match from a short video",
    technologies: ["Python", "OpenCV", "Scikit-learn", "Machine Learning", "FFmpeg"],
    inProgress: true,
    imageUrl: "project-covers/xg-prediction.svg",
  }
];