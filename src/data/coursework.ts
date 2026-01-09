export type Course = {
  id: string;
  title: string;
  code: string;
  institution: string;
  semester: string;
  description: string;
  topics: string[];
  grade?: string;
  category: "Computer Science" | "Mathematics" | "Data Science & Statistics" | "Other";
  yearLevel: 1 | 2 | 3 | 4;
  inProgress?: boolean;
};

export const coursework: Course[] = [
  {
    id: "1",
    title: "Computer Programming I",
    code: "COSC 111",
    institution: "University of British Columbia - Okanagan",
    semester: "Fall 2021",
    description: `Introduction to the design, implementation, and understanding of computer programs. Topics include problem solving, algorithm design, and data and procedural abstraction, with emphasis on the development of working programs.`,
    topics: ["Programming Fundamentals", "Problem Solving", "Control Structures", "Functions", "Basic Data Structures"],
    category: "Computer Science",
    yearLevel: 1
  },
  {
    id: "2",
    title: "Computer Programming II",
    code: "COSC 121",
    institution: "University of British Columbia - Okanagan",
    semester: "Spring 2022",
    description: `Advanced programming in the application of software engineering techniques to the design and implementation of programs manipulating complex data structures.`,
    topics: ["Object-Oriented Programming", "Recursion", "File Input/Output", "Data Structures"],
    category: "Computer Science",
    yearLevel: 1
  },
  {
    id: "3",
    title: "Computer Fluency",
    code: "COSC 122",
    institution: "University of British Columbia - Okanagan",
    semester: "Fall 2021",
    description: `Introduction to computer skills (electronic communication, websites, Internet, document editing, programming, data analysis using spreadsheets/databases) and concepts (information representation, abstraction, algorithmic thinking). Course objectives are lifelong productivity and understanding of technology in society.`,
    topics: ["Web Development", "Microsoft Office", "Programming", "Data Analysis"],
    category: "Computer Science",
    yearLevel: 1
  },
  {
    id: "4",
    title: "Computer Creativity",
    code: "COSC 123",
    institution: "University of British Columbia - Okanagan",
    semester: "Spring 2022",
    description: `A hands-on introduction to programming and computer-based problem solving and creativity. Experience with application development including storytelling, graphics, games, and networking.`,
    topics: ["Game Development", "Processing via Java"],
    category: "Computer Science",
    yearLevel: 1
  },
  {
    id: "5",
    title: "Data Structures",
    code: "COSC 222",
    institution: "University of British Columbia - Okanagan",
    semester: "Summer 2024",
    description: `Introduction to the design, implementation and analysis of data structures. Topics will include lists, stacks, queues, trees, and graphs.`,
    topics: ["Sorting", "Time Complexity", "Recursion", "Data Structures"],
    category: "Computer Science",
    yearLevel: 2
  },
  {
    id: "6",
    title: "Software Engineering",
    code: "COSC 310",
    institution: "University of British Columbia - Okanagan",
    semester: "Fall 2025",
    description: `Techniques to construct large systems using fundamental activities of specification, design, implementation, testing, and maintenance. Various life cycle models, exposure to software development tools, modelling techniques, good development practices, and project management..`,
    topics: ["Software Design", "Requirements Engineering", "Testing", "Version Control", "Agile Development"],
    category: "Computer Science",
    yearLevel: 3
  },
  {
    id: "7",
    title: "Analysis of Algorithms",
    code: "COSC 320",
    institution: "University of British Columbia - Okanagan",
    semester: "Spring 2025",
    description: `Design and analysis of algorithms, illustrated from various problem areas. Models of computation, choice of data structures, space and time efficiency, computation complexity, algorithms for searching, sorting and graph-theoretic problems, NP-complete problems.`,
    topics: ["Models of Computation", "NP-completeness", "Space and Time efficiency"],
    category: "Computer Science",
    yearLevel: 3
  },
  {
    id: "8",
    title: "Human-Computer Interaction",
    code: "COSC 341",
    institution: "University of British Columbia - Okanagan",
    semester: "Fall 2025",
    description: `History of human-computer interaction. Basic design principles, user-centered design, user task analysis, interaction models, input and output devices, graphical interface design, prototyping, and evaluation.`,
    topics: ["Usability", "User-Centered Design", "Interface Design", "User Testing"],
    category: "Computer Science",
    yearLevel: 3
  },
  {
    id: "9",
    title: "Image Processing and Applications",
    code: "COSC 344",
    institution: "University of British Columbia - Okanagan",
    semester: "Fall 2025",
    description: `Fundamental theoretical and practical concepts for processing and analyzing real-world digital images and videos, image enhancement and filtering, frequency domain and other transform analysis, morphological image operations, image segmentation, and object recognition.`,
    topics: ["OpenCV", "Python", "Object Recognition", "Image Enhancement", "Image Segmentation"],
    category: "Computer Science",
    yearLevel: 3
  },
  {
    id: "10",
    title: "Making Predictions with Data",
    code: "DATA 101",
    institution: "University of British Columbia - Okanagan",
    semester: "Fall 2021",
    description: `Introduction to the techniques and software for handling real-world data. Topics include data cleaning, visualization, simulation, basic modelling, and prediction making.`,
    topics: ["R", "Data Analysis", "Data Visualization", "Statistics Basics", "Ethics in Data Science"],
    category: "Data Science & Statistics",
    yearLevel: 1
  },
  {
    id: "11",
    title: "Calculus I",
    code: "MATH 100",
    institution: "University of British Columbia - Okanagan",
    semester: "Fall 2021",
    description: `Differential calculus of functions of one variable including limits, derivatives, and applications.`,
    topics: ["Limits", "Derivatives", "Applications of Derivatives"],
    category: "Mathematics",
    yearLevel: 1
  },
  {
    id: "12",
    title: "Calculus II",
    code: "MATH 101",
    institution: "University of British Columbia - Okanagan",
    semester: "Spring 2022",
    description: `Integral calculus of functions of one variable including techniques of integration and applications.`,
    topics: ["Integration Techniques", "Applications of Integration", "Infinite Series"],
    category: "Mathematics",
    yearLevel: 1
  },
  {
    id: "13",
    title: "Calculus IV",
    code: "MATH 317",
    institution: "University of British Columbia - Okanagan",
    semester: "Spring 2025",
    description: `Parametrizations, inverse and implicit functions, integrals with respect to length and area; grad, div, and curl, and theorems of Green, Gauss, and Stokes.`,
    topics: ["Parametric Forms", "Nabla Operator", "Green’s Theorem", "Divergence Theorem", "Stokes’ Theorem"],
    category: "Mathematics",
    yearLevel: 3
  },
  {
    id: "14",
    title: "Intermediate Probability",
    code: "STAT 303",
    institution: "University of British Columbia - Okanagan",
    semester: "Fall 2025",
    description: `Multivariate probability distributions, moment and generating functions.`,
    topics: ["Multivariable Random Variables", "Moment Generating Functions", "Limiting Theorems"],
    category: "Data Science & Statistics",
    yearLevel: 3
  },
  {
    id: "15",
    title: "Network Security and Encryption",
    code: "CMPE 410",
    institution: "University of British Columbia - Okanagan",
    semester: "Fall 2025",
    description: `Computer networks, security and privacy, threats and vulnerabilities, intrusion detection, authentication, encryption, and cloud security and Internet of Things security.`,
    topics: ["Cryptography & Cryptanalysis", "Network security protocols", "Authentication", "Access Control", "Security Policies", "Threat Modelling", "Intrusion Detection", "Cloud/SDN/NFV security"],
    category: "Other",
    yearLevel: 4
  },
  {
    id: "16",
    title: "Software Construction",
    code: "CPSC 210",
    institution: "University of British Columbia - Vancouver",
    semester: "Fall 2022",
    description: `Design, development, and analysis of robust software components. Topics such as software design, computational models, data structures, debugging, and testing.`,
    topics: ["Software Design Principles", "Testing", "Debugging"],
    category: "Computer Science",
    yearLevel: 2
  },
  {
    id: "17",
    title: "Principles of Microeconomics",
    code: "ECON 102",
    institution: "University of British Columbia - Vancouver",
    semester: "Spring 2023",
    description: `Elements of theory and of Canadian policy and institutions concerning the economics of growth and business cycles, employment, national income accounting, interest and exchange rates, money and banking, the balance of trade.`,
    topics: ["Supply and Demand", "Market Structures", "Consumer Theory", "Producer Theory"],
    category: "Other",
    yearLevel: 1
  },
  {
    id: "18",
    title: "Approaches to Literature",
    code: "ENGL 111",
    institution: "University of British Columbia - Vancouver",
    semester: "Fall 2022",
    description: `Study of selected communication genres from a language-based perspective: examples may include non-fiction, science writing, business discourse, journalism, language of the internet, podcasts, and other media.`,
    topics: ["Literary Analysis", "Critical Reading", "Academic Writing"],
    category: "Other",
    yearLevel: 1
  },
  {
    id: "19",
    title: "World History",
    code: "HIST 103",
    institution: "University of British Columbia - Vancouver",
    semester: "Fall 2022 & Spring 2023",
    description: `International relations; changes in the nation-state system; the emergence and impact of major political ideologies; genocide; decolonization; the globalization of trade; and the dynamics of economic, social, cultural, and environmental change in a global context.`,
    topics: ["Global History", "Political History", "Cultural Change"],
    category: "Other",
    yearLevel: 1
  },
  {
    id: "20",
    title: "Calculus III",
    code: "MATH 200",
    institution: "University of British Columbia - Vancouver",
    semester: "Fall 2022",
    description: `Analytic geometry in 2 and 3 dimensions, partial and directional derivatives, chain rule, maxima and minima, second derivative test, Lagrange multipliers, multiple integrals with applications.`,
    topics: ["Partial Derivatives", "Multiple Integrals", "Multivariable Optimization"],
    category: "Mathematics",
    yearLevel: 2
  },
  {
    id: "21",
    title: "Mathematical Proof",
    code: "MATH 220",
    institution: "University of British Columbia - Vancouver",
    semester: "Fall 2023",
    description: `Sets and functions; induction; cardinality; properties of the real numbers; sequences, series, and limits. Logic, structure, style, and clarity of proofs emphasized throughout.`,
    topics: ["Mathematical Proofs", "Logic", "Set Theory", "Basic Analysis"],
    category: "Mathematics",
    yearLevel: 2
  },
  {
    id: "22",
    title: "Linear Programming",
    code: "MATH 340",
    institution: "University of British Columbia - Vancouver",
    semester: "Spring 2023",
    description: `Linear programming problems, dual problems, the simplex algorithm, solution of primal and dual problems, sensitivity analysis. Additional topics chosen from: Karmarkar's algorithm, non-linear programming, game theory, applications.`,
    topics: ["Simplex Algorithm", "Duality", "Game Theory"],
    category: "Mathematics",
    yearLevel: 3
  },
  {
    id: "23",
    title: "Statistical Inference for Data Science",
    code: "STAT 201",
    institution: "University of British Columbia - Vancouver",
    semester: "Fall 2022",
    description: `Classical and simulation-based techniques for estimation and hypothesis testing, including inference for means and proportions. Emphasis on case studies and real data sets, as well as reproducible and transparent workflows when writing computer scripts for analysis and reports.`,
    topics: ["Descriptive Statistics", "Probability", "Hypothesis Testing", "Regression", "Sampling Distributions", "Estimation"],
    category: "Data Science & Statistics",
    yearLevel: 2
  },
  {
    id: "24",
    title: "Elementary Statistics",
    code: "STAT 251",
    institution: "University of British Columbia - Vancouver",
    semester: "Spring 2023",
    description: `Probability, discrete and continuous random variables, joint probability distributions, estimation, hypothesis testing, regression, analysis of variance, goodness of fit.`,
    topics: ["Probability Techniques", "Random Variables", "Probability Distributions"],
    category: "Data Science & Statistics",
    yearLevel: 2
  },
  {
    id: "25",
    title: "Introduction to Astronomy",
    code: "ASTR 101",
    institution: "University of British Columbia - Vancouver",
    semester: "Fall 2023",
    description: `General principles of the celestial sphere, laws of motion and light, optics, and telescopes; current knowledge of the Sun and Solar System.`,
    topics: ["Solar System Composition", "Telescopes and Optics"],
    category: "Other",
    yearLevel: 1
  },
  {
    id: "26",
    title: "Models of Computation",
    code: "CPSC 121",
    institution: "University of British Columbia - Vancouver",
    semester: "Fall 2023",
    description: `Physical and mathematical structures of computation. Boolean algebra and combinations logic circuits; proof techniques; functions and sequential circuits; sets and relations; finite state machines; sequential instruction execution.`,
    topics: ["Logic", "Intro Circuitry", "Automata Theory"],
    category: "Computer Science",
    yearLevel: 1
  },
  {
    id: "27",
    title: "Systems Analysis and Design",
    code: "COSC 126",
    institution: "Okanagan College",
    semester: "Spring 2024",
    description: `activities associated with developing computer-based information systems. Online systems, including all aspects dealing with the use of databases and data communications, will be emphasized. Practical work will expose students to relational database management systems within a client-server environment and may include Computer Assisted Software Engineering (CASE) tools.`,
    topics: ["Software Development Lifecycle", "Software Methodologies", "Architecture & UX Design"],
    category: "Computer Science",
    yearLevel: 1
  },
  {
    id: "28",
    title: "Networks and Telecommunications I",
    code: "COSC 118",
    institution: "Okanagan College",
    semester: "Spring 2024",
    description: `Theory of practice of modern telecommunications with an emphasis on the TCP/IP (Transmission Control Protocol/Internet Protocol) stack. The focus will be on how the TCP/IP stack is associated with developing applications that use the Internet.`,
    topics: ["TCP/IP", "Intro network programming", "Network Topologies"],
    category: "Computer Science",
    yearLevel: 1
  },
  {
    id: "29",
    title: "Visual Programming",
    code: "COSC 131",
    institution: "Okanagan College",
    semester: "Spring 2024",
    description: `Develop and deploy Windows-based software programs. Topics include event-driven programming concepts, graphical user interface (GUI) design, Windows programming, database programming and web application development.`,
    topics: ["Visual Basic", ".NET", "GUI design"],
    category: "Computer Science",
    yearLevel: 1
  },
  {
    id: "30",
    title: "Machine Architecture",
    code: "COSC 211",
    institution: "Okanagan College",
    semester: "Spring 2024",
    description: `introduction to the conceptual structure and functional characteristics of a computer. Topics include computer organization, memory addressing schemes, and decoding and executing instructions. Laboratory assignments use the assembly language of selected machines.`,
    topics: ["AVR ISA", "C", "Low-level thinking"],
    category: "Computer Science",
    yearLevel: 2
  },
  {
    id: "31",
    title: "Web Development with LAMP",
    code: "COSC 213",
    institution: "Okanagan College",
    semester: "Fall 2024",
    description: `Web development using LAMP technology, the Linux operating system, the Apache web server, the MySQL database, and the PHP server-side scripting language. Course topics include LAMP set-up, HTML5, CSS, PHP, MySQL, fine-tuning and administration of the web server.`,
    topics: ["PHP", "Linux", "Web server administration", "Virtual Machines"],
    category: "Computer Science",
    yearLevel: 2
  },
  {
    id: "32",
    title: "Client-side Web Systems",
    code: "COSC 219",
    institution: "Okanagan College",
    semester: "Fall 2024",
    description: `Introduction to web applications published to the Internet. Topics will include validating end-user input, asynchronous and synchronous programming techniques, and content management systems. A scripting language for web development is the primary focus, with an exploration of one higher order library.`,
    topics: ["JavaScript", "jQuery", "Asynchronous programming"],
    category: "Computer Science",
    yearLevel: 2
  },
  {
    id: "33",
    title: "Introduction to Discrete Structures",
    code: "COSC 221",
    institution: "Okanagan College",
    semester: "Spring 2024",
    description: `Introduction to sets, logic, combinatorics, and graph theory, as applied in computing: sets and propositions, permutations and combinations, graphs and trees, Boolean algebra, algorithms, and applications.`,
    topics: ["Logic", "Intro set and graph theory", "Formal proofs"],
    category: "Computer Science",
    yearLevel: 2
  },
  {
    id: "34",
    title: "Information Systems Security",
    code: "COSC 232",
    institution: "Okanagan College",
    semester: "Spring 2024",
    description: `Various aspects of computing where security is important.`,
    topics: ["Security Terminology", "Ciphers", "Secure key generation", "Randomness", "Hashing algorithms", "Encryption and Decryption"],
    category: "Computer Science",
    yearLevel: 2
  },
  {
    id: "35",
    title: "Introduction to Database Management Systems",
    code: "COSC 304",
    institution: "Okanagan College",
    semester: "Fall 2024",
    description: `Introduction to database concepts including relational models, SQL, normalization, and database design.`,
    topics: ["SQL", "Normalization", "Triggers"],
    category: "Computer Science",
    yearLevel: 3
  },
  {
    id: "36",
    title: "iOS Application Development",
    code: "COSC 316",
    institution: "Okanagan College",
    semester: "Spring 2025",
    description: `Application development in the iOS platform. Topics include the Swift programming language, graphical user interface design, touch screen features and orientations, applications working with or without web server and databases, and 2D games.`,
    topics: ["Swift", "SQLite", "Mobile development"],
    category: "Computer Science",
    yearLevel: 3
  },
  {
    id: "37",
    title: "Network Programming",
    code: "COSC 318",
    institution: "Okanagan College",
    semester: "Spring 2025",
    description: `Various related topics in client-server and peer-to-peer network program development. Students will learn how to develop and deploy multithreaded network programs. Main topics include socket programming, distributed computing, secure socket layer (SSL) certificates, data encryption and compression.`,
    topics: ["Socket Programming", "Security", "Compression algorithms"],
    category: "Computer Science",
    yearLevel: 3
  },
  {
    id: "38",
    title: "Astronomy and Astrophysics",
    code: "ASTR 122",
    institution: "Okanagan College",
    semester: "Spring 2025",
    description: `Introduction to contemporary astronomy emphasizing the solar system and begins with topics in physics used by astronomers including general principles of the celestial sphere, laws of motion, light and optics. Observational techniques using earth-based telescopes, artificial satellites and interplanetary probes will be discussed. The second part of the course will examine the planets, moon and smaller bodies in our solar system.`,
    topics: ["Stars", "Galaxies", "Universe Structure"],
    category: "Other",
    yearLevel: 1
  },
  {
    id: "39",
    title: "Introduction to Data Analytics",
    code: "DATA 301",
    institution: "University of British Columbia - Okanagan",
    semester: "Summer 2025",
    description: `Techniques for computation, analysis, and visualization of data using software. Manipulation of small and large data sets. Databases. Automation using scripting. Real-world applications from life sciences, physical sciences, economics, engineering, or psychology.`,
    topics: ["Python", "R", "Pandas, NumPy, Matplotlib", "Scripting"],
    category: "Data Science & Statistics",
    yearLevel: 3
  },
  {
    id: "40",
    title: "Computer Ethics",
    code: "PHIL 331",
    institution: "University of British Columbia - Okanagan",
    semester: "Summer 2025",
    description: `Ethical and professional issues facing those who work with computers. Piracy, hacking, responsibility, and liability for the use of software; cyberpornography and freedom of information; computerized invasion of privacy; computers in the workplace; the use of artificial intelligence; and expert systems.`,
    topics: ["Kantian Ethics", "Bias", "Virtues", "Ethics regarding Artificial Intelligence"],
    category: "Other",
    yearLevel: 3
  },
  {
    id: "41",
    title: "Introduction to Operating Systems",
    code: "COSC 315",
    institution: "University of British Columbia - Okanagan",
    semester: "Spring 2026",
    description: `Introduction to batch, multiprogramming, and time-sharing systems. Process synchronization and communication. Main memory allocation techniques including virtual memory; process scheduling; deadlock avoidance and prevention; file organization and device management.`,
    topics: ["C (Programming language)", "Processes and Threads", "Memory Management", "File Systems"],
    category: "Computer Science",
    yearLevel: 3,
    inProgress: true
  },
  {
    id: "42",
    title: "Introduction to Artificial Intelligence",
    code: "COSC 322",
    institution: "University of British Columbia - Okanagan",
    semester: "Spring 2026",
    description: `AI and intelligent agents; state space search; game playing agents; logic and knowledge-based agents; constraint programming; planning; reasoning and decision making under uncertainty; machine learning; natural language understanding.`,
    topics: ["State space search", "Machine learning", "Knowledge representation", "Planning algorithms", "Monte Carlo methods", "Minimax algorithm"],
    category: "Computer Science",
    yearLevel: 3,
    inProgress: true
  },
  {
    id: "43",
    title: "Deep Learning",
    code: "COSC 419B",
    institution: "University of British Columbia - Okanagan",
    semester: "Spring 2026",
    description: `Linear Models, Regularizatrion and Optimization, Multi-layer perceptrons, Backpropagation, Deep Learning and CNN, CNN Architectures, Recurrent Neural Networks, Attention, Transformers, Vision Transformers, Generalization and fine tuning, Object detection and segmentation, Object Tracking`,
    topics: ["Deep Learning techniques", "Neural Networks", "Computer Vision", "Natural Language Processing"],
    category: "Computer Science",
    yearLevel: 4,
    inProgress: true
  },
  {
    id: "44",
    title: "Probability and Statistical Inference",
    code: "STAT 401",
    institution: "University of British Columbia - Okanagan",
    semester: "Spring 2026",
    description: `Theory of statistical modelling: distributions of data, likelihood-based inference for learning unknown parameters, construction of confidence intervals and development of tests. Bayesian methods will be used to contrast standard statistical procedures.`,
    topics: ["Distributions of Data", "Point Estimation", "Bayesian methods", "Construction of confidence intervals", "Development of tests"],
    category: "Data Science & Statistics",
    yearLevel: 4,
    inProgress: true
  },
];