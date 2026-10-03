import type { CoverKind } from "../components/covers/Cover";

export type Job = {
  role: string;
  company: string;
  location: string;
  status: string;
  team: string;
  headline: string; // the project, in a few words
  summary: string; // the whole thing, in plain language
  facts: [value: string, label: string][];
  sections: { title: string; body?: string; points?: string[]; note?: string }[];
  stack: string[];
  cover: CoverKind;
};

// Add entries here; the Work experience section on the About page picks them up.
export const experience: Job[] = [
  {
    role: "Junior Software Developer Intern",
    company: "ROSEN Technology Canada Ltd.",
    location: "Kelowna, BC",
    status: "Current",
    team: "Data Fusion · validation workflows",
    headline: "Automating Data Fusion validation",
    summary:
      "ROSEN's Data Fusion technology uses machine learning to combine complementary MFL-A and MFL-C pipeline inspection data into a unified representation of pipeline corrosion. Validating it means comparing Data Fusion results against laser scan data provided by the customer, a workflow full of repetitive manual steps. I'm spearheading the requirements engineering and solution design for a Python desktop application that automates as much of that workflow as possible, making validation more consistent and reproducible.",
    facts: [
      ["~18 people", "the team it was first built for"],
      ["Multiple teams", "planned distribution through ROSEN's internal Software Center"],
      ["Qwen3.5 8B", "self-hosted LLM agent, running on Kubernetes"],
      ["Python 3.12", "PySide6 Windows desktop application"],
    ],
    sections: [
      {
        title: "The problem",
        body: "Before Data Fusion output can be compared with a customer's laser scans, a lot has to happen by hand:",
        points: [
          "Customers and ROSEN can use different weld numbering systems for the same pipeline, so the laser scan data first has to be aligned to ROSEN's pipeline and weld references. The team calls this coarse alignment.",
          "The laser scan data needs cleaning and preparation before it can be used for validation.",
          "The relevant MFL-A and MFL-C inspection data has to be processed, and Data Fusion processing jobs generated and submitted.",
          "Only then can the Data Fusion output be compared against the laser scan data.",
        ],
      },
      {
        title: "What the app does",
        body: "One interface for the whole validation workflow, instead of engineers manually running numerous scripts, notebooks and processing steps. It:",
        points: [
          "Prepares and cleans customer laser scan data",
          "Performs coarse alignment between customer and ROSEN weld numbering",
          "Extracts metadata and structured information from laser scan CSV files",
          "Prepares MFL-A and MFL-C data for Data Fusion processing",
          "Submits processing work to existing Kubernetes-hosted ML services",
          "Handles the outputs needed for downstream validation",
        ],
        note: "It doesn't replace or recreate the Data Fusion model. It's an orchestration and automation layer around the existing validation and ML infrastructure, integrating existing scripts, notebooks, .NET services and Kubernetes services instead of rebuilding them.",
      },
      {
        title: "Agentic AI",
        body: "A big part of my internship has been experimenting with agentic AI to automate parts of laser scan data preparation. We run a self-hosted Qwen3.5 8B LLM inside a Kubernetes cluster, rather than calling an externally hosted LLM API, and combine it with RAG and custom tools. The agent reasons about what information it needs, invokes the right tools to retrieve and process data, and produces structured outputs the rest of the application can consume. My part:",
        points: [
          "Working on the agentic loop itself",
          "Designing and implementing the tools the agent can use, and integrating them into the workflow",
          "Building evaluations that test agent–tool interaction and the quality and correctness of extracted data",
          "Identifying failure cases and iterating on the agentic workflow and its tools",
        ],
        note: "The goal isn't to add a chatbot to the app. It's to have an LLM work with domain-specific tools to automate structured data-processing tasks that would otherwise take manual engineering effort.",
      },
      {
        title: "My role",
        points: [
          "Requirements engineering: talking with validation engineers and data engineers to understand existing workflows",
          "Identifying repetitive, manual processes to automate and translating domain workflows into software requirements",
          "Designing the application's modular architecture and its data-processing workflows",
          "Working out how existing scripts, notebooks, .NET services and Kubernetes services integrate with the new application",
          "Developing the agentic AI workflow, its tools and its evaluations",
          "Collaborating with stakeholders outside the immediate development team",
        ],
      },
      {
        title: "Engineering for other teams",
        body: "The workflows are designed to be modular and auditable, and to recover from interrupted or incomplete processing, with reliability and maintainability in mind, since the app is now meant for teams beyond the one it started with.",
      },
      {
        title: "From team tool to internal product",
        body: "The project began as a small productivity tool for my immediate Data Fusion/validation team of about 18 people. As validation has become a major part of ROSEN's upcoming deliverables, its scope has grown substantially: the plan is now to distribute the finished application through ROSEN's internal Software Center, where employees get approved software, so it's being designed for use across multiple teams rather than just ours.",
      },
    ],
    stack: [
      "Python 3.12",
      "PySide6",
      "NumPy",
      "Pandas / Polars",
      "SciPy",
      "OpenCV",
      "scikit-image",
      "h5py",
      "SQLite / SQLModel",
      "Jupyter",
      ".NET services",
      "Kubernetes",
      "Qwen3.5 8B",
      "RAG",
    ],
    cover: "validation",
  },
];
