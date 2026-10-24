// Single source of truth for every piece of text on the site.
// Facts come from Resume.pdf (latest), wording fixes from Resume_1page.tex, extra builds from CV_old.pdf.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://heetdobariya.vercel.app";

export const profile = {
  name: "Heet Dobariya",
  role: "AI Engineer",
  headline: "Founding Engineer @ Serin Labs",
  pitch:
    "I build production AI systems: Python backends, LLM pipelines and RAG over vector and graph databases.",
  location: "Ahmedabad, India",
  timeZone: "Asia/Kolkata",
  email: "heetdobariya07@gmail.com",
  resumeUrl: "/Heet_Dobariya_Resume.pdf",
} as const;

export const socials = [
  { label: "GitHub", href: "https://github.com/HeetDobariya07", icon: "github" },
  { label: "LinkedIn", href: "https://linkedin.com/in/heet-dobariya-30758a28a", icon: "linkedin" },
  { label: "LeetCode", href: "https://leetcode.com/u/heetdobariya07/", icon: "leetcode" },
  { label: "Codeforces", href: "https://codeforces.com/profile/HeetDobariya", icon: "codeforces" },
] as const;

export type SocialIcon = (typeof socials)[number]["icon"];

export const about = {
  paragraphs: [
    "I'm a Computer Science graduate from Pandit Deendayal Energy University (Minor in IoT) and a founding engineer at Serin Labs, where I help build Serin AI from the ground up.",
    "Most of my work sits where backend engineering meets applied AI: FastAPI services, retrieval pipelines over Pinecone, Qdrant and Neo4j, and the evaluation work that keeps LLM output honest.",
  ],
  offTheClock:
    "Off the clock you'll find me at the gym, sketching, or grinding a competitive programming problem.",
};

export type Stat = {
  label: string;
  value: string;
  unit?: string;
  /** Needle position on the dial, 0–1. */
  needle: number;
  caption: string;
};

export const stats: Stat[] = [
  { label: "CGPA", value: "9.48", unit: "/10", needle: 0.948, caption: "B.Tech CS, PDEU" },
  { label: "GATE DA", value: "3876", unit: "AIR", needle: 0.78, caption: "Score 432 · 2025" },
  { label: "Builds", value: "12", unit: "projects", needle: 0.82, caption: "AI, web & IoT" },
];

export type Role = {
  title: string;
  company: string;
  place: string;
  period: string;
  current?: boolean;
  points: string[];
  tags: string[];
};

export const experience: Role[] = [
  {
    title: "Founding Engineer",
    company: "Serin Labs",
    place: "Ahmedabad",
    period: "Sep 2026 – Present",
    current: true,
    points: [
      "Building core Serin AI features as part of the founding team, shipping fixes and platform improvements.",
      "Developed Serin MCP integrations and led platform-wide QC to catch bugs, edge cases and usability issues.",
    ],
    tags: ["Serin AI", "MCP", "QC"],
  },
  {
    title: "Jr. Software Engineer",
    company: "Growexx AI Solutions",
    place: "Ahmedabad",
    period: "Jan 2026 – Jul 2026",
    points: [
      "Developed Python/FastAPI backend features for Ojavix, a RAG-based AI therapist chatbot.",
      "Built the knowledge base from PDF/TXT files via Azure Document Intelligence, indexed in Pinecone and Neo4j.",
      "Developed therapy workflows combining vector/graph retrieval with short- and long-term user memory.",
    ],
    tags: ["FastAPI", "RAG", "Pinecone", "Neo4j", "Azure"],
  },
  {
    title: "Data Science Intern",
    company: "Blink Analytics",
    place: "Ahmedabad",
    period: "Feb 2025 – Jan 2026",
    points: [
      "Curated domain-specific datasets to fine-tune LLMs with SFT and RLHF, improving accuracy and relevance.",
      "Evaluated and debugged LLM outputs in production using custom benchmarks and interpretability tools.",
    ],
    tags: ["LLMs", "SFT", "RLHF", "Evals"],
  },
  {
    title: "AI/ML Intern",
    company: "Nexus Info",
    place: "Remote",
    period: "May 2024 – Jun 2024",
    points: [
      "Built TravelGuru and EduAdvisor chatbots for travel guidance and college admissions, and an ML-based disease prediction system.",
    ],
    tags: ["Gemini API", "Streamlit", "scikit-learn"],
  },
];

export type Project = {
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  href?: string;
  note?: string;
};

export const projects: Project[] = [
  {
    name: "QSkim",
    tagline: "Govt. scheme discovery platform",
    description:
      "Full-stack platform to discover and compare Indian government schemes, using hybrid RAG with BGE-M3 and Qdrant, metadata-based eligibility matching, and multilingual voice and WhatsApp access.",
    stack: ["RAG", "BGE-M3", "Qdrant", "FastAPI", "Next.js", "Groq", "Sarvam", "Twilio"],
    href: "https://github.com/HeetDobariya07/QSkim",
  },
  {
    name: "IoT Fire Detection",
    tagline: "On-device TinyML on an ESP32-CAM",
    description:
      "Low-cost fire detection running a TinyML model on an ESP32-CAM, trained with Edge Impulse on a custom 176-image dataset. On detection it sounds a buzzer and switches a relay-driven water pump, while DHT11 and MQ-2 monitor heat and gas.",
    stack: ["ESP32-CAM", "Edge Impulse", "TinyML", "DHT11", "MQ-2"],
    href: "https://github.com/HeetDobariya07/IoT-Fire-Detection-System",
  },
  {
    name: "TalentLens",
    tagline: "Resume ranking system",
    description:
      "Ranks resumes against job descriptions using SpaCy skill extraction and BERT embeddings, scoring relevancy with Gradient Boosting, Random Forest, Ridge and SVR models on a Flask + MongoDB backend.",
    stack: ["BERT", "SpaCy", "scikit-learn", "Flask", "MongoDB"],
    href: "https://github.com/HeetDobariya07/TalentLens-Resume_Ranking_System",
  },
  {
    name: "Scholaris",
    tagline: "Assignment evaluator",
    description:
      "Flask + MongoDB app where teachers create and grade assignments. The Groq API generates viva questions from each submitted file (TXT, PDF, DOCX) so teachers can assess students.",
    stack: ["Flask", "MongoDB", "Groq API"],
    href: "https://github.com/HeetDobariya07/Scholaris-Assignment_Evaluator",
  },
];

export type Build = { name: string; summary: string; stack: string; href?: string };

export const moreBuilds: Build[] = [
  {
    name: "Radiation Impact Predictor",
    summary: "HackOut24 (DAIICT): predicts space-radiation risk to astronauts and satellites.",
    stack: "Python · scikit-learn · Flask",
    href: "https://github.com/HeetDobariya07/HackOut24",
  },
  {
    name: "Car Fleet Management",
    summary: "SQL system for vehicles, drivers, maintenance scheduling and trip tracking.",
    stack: "Python · SQL",
    href: "https://github.com/HeetDobariya07/Fleet-Management-DBMS-Project",
  },
  {
    name: "Crop Management System",
    summary: "ESP32 sensor node with SMTP email alerts and an Arduino Cloud dashboard.",
    stack: "ESP32 · DHT11 · Arduino Cloud",
  },
  {
    name: "TravelGuru",
    summary: "Gemini-powered trip recommendations, itineraries and booking tips.",
    stack: "Python · Gemini API · Streamlit",
    href: "https://github.com/HeetDobariya07/AIML-Project-Series",
  },
  {
    name: "EduAdvisor",
    summary: "Conversational assistant for college admissions and course choices.",
    stack: "Python · Gemini API · Streamlit",
    href: "https://github.com/HeetDobariya07/AIML-Project-Series",
  },
  {
    name: "Disease Prediction System",
    summary: "Symptom-based prediction with SVM, Naive Bayes and Random Forest.",
    stack: "Python · scikit-learn · Streamlit",
    href: "https://github.com/HeetDobariya07/AIML-Project-Series",
  },
  {
    name: "OS Algorithm Simulator",
    summary: "Visual simulations of SRTF, SSTF, producer-consumer and page replacement.",
    stack: "Python",
    href: "https://github.com/HeetDobariya07/OS-Simulations",
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "C", "C++", "SQL", "Java", "JavaScript", "TypeScript", "HTML", "CSS"] },
  {
    group: "AI / ML",
    items: ["LLMs", "RAG", "Prompt Engineering", "NLP", "Transformers", "BERT", "Deep Learning", "scikit-learn", "TensorFlow", "Keras"],
  },
  { group: "Backend & Data", items: ["FastAPI", "Flask", "PostgreSQL", "MongoDB", "Pinecone", "Qdrant", "Neo4j"] },
  { group: "Cloud & Tools", items: ["Git", "GitHub", "AWS", "Azure", "Next.js"] },
  { group: "IoT", items: ["ESP32", "Arduino", "Edge Impulse"] },
];

export const certifications = [
  { name: "GATE: Data Science & AI", detail: "AIR 3876 · Score 432", date: "2025" },
  { name: "Neural Networks Bootcamp", detail: "Udemy", date: "2026" },
  { name: "SQL & PostgreSQL", detail: "Udemy", date: "2026" },
  { name: "Foundations of Agents", detail: "Hugging Face", date: "2025" },
  { name: "Machine Learning Specialization courses", detail: "Stanford Online", date: "2024" },
];

export const leadership = {
  title: "Content & Documentation Head",
  org: "Mind Ripple, PDEU",
  period: "May 2024 – Jun 2025",
};

export const sections = [
  { id: "about", gear: "1", label: "About" },
  { id: "experience", gear: "2", label: "Experience" },
  { id: "projects", gear: "3", label: "Projects" },
  { id: "skills", gear: "4", label: "Skills" },
  { id: "contact", gear: "N", label: "Contact" },
] as const;
