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

/** Hero introduction, written in first person like the reference sites. */
export const intro = {
  greeting: "Hi there, I'm",
  // Rendered as: "I'm an engineer who builds {highlight}."
  lead: "I'm an engineer who builds",
  highlight: "production AI",
  detail:
    "Right now I'm a founding engineer at Serin Labs, working on Python backends, LLM pipelines and RAG over vector and graph databases.",
} as const;

export const socials = [
  { label: "GitHub", href: "https://github.com/HeetDobariya07", icon: "github" },
  { label: "LinkedIn", href: "https://linkedin.com/in/heet-dobariya-30758a28a", icon: "linkedin" },
  { label: "LeetCode", href: "https://leetcode.com/u/heetdobariya07/", icon: "leetcode" },
  { label: "Codeforces", href: "https://codeforces.com/profile/HeetDobariya", icon: "codeforces" },
  { label: "Instagram", href: "https://www.instagram.com/heet_4836/", icon: "instagram" },
  { label: "X", href: "https://x.com/HeetDobariya63", icon: "x" },
] as const;

export type SocialIcon = (typeof socials)[number]["icon"];

export const about = {
  paragraphs: [
    "I'm a Computer Science graduate from Pandit Deendayal Energy University (Minor in IoT) and a founding engineer at Serin Labs, where I help build Serin AI from the ground up.",
    "Most of my work sits where backend engineering meets applied AI: FastAPI services, retrieval pipelines over Pinecone, Qdrant and Neo4j, and the evaluation work that keeps LLM output honest.",
  ],
};

export type Dial = {
  label: string;
  value: string;
  unit: string;
  /** Scale shown around the dial, e.g. 0–10. */
  min: number;
  max: number;
  /** Distance between numbered marks. */
  labelStep: number;
  /** Start of the red zone, like a tachometer's redline. */
  redline: number;
  /** Where the needle rests, in scale units. */
  reading: number;
};

/** The two dials of the About-section instrument cluster. */
export const dials: Dial[] = [
  { label: "CGPA", value: "9.48", unit: "/10", min: 0, max: 10, labelStep: 2, redline: 8, reading: 9.48 },
  // Industry experience since Feb 2025 (Blink → Growexx → Serin), plus a 2024 internship.
  { label: "Experience", value: "1.5+", unit: "yrs", min: 0, max: 4, labelStep: 1, redline: 3, reading: 1.7 },
];

/** Readouts that cycle on the cluster's centre display. */
export const readouts = [
  { tag: "NOW", text: "Founding Engineer · Serin Labs" },
  { tag: "EDU", text: "B.Tech CS, Minor in IoT · PDEU" },
  { tag: "GATE", text: "Data Science & AI · AIR 3876" },
  { tag: "STACK", text: "Python · FastAPI · LLMs · RAG" },
] as const;

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
  /** Short facts shown as a spec sheet. */
  specs: { label: string; value: string }[];
  /** How a request/frame/document flows through the system, step by step. */
  pipeline: string[];
  /** Source code (GitHub). */
  href?: string;
  /** Live product site, for work projects with private code. */
  live?: string;
  /** Small chip marking work projects, e.g. "Work · Serin Labs". */
  badge?: string;
  /** My own contributions, shown as a "My work" list. */
  work?: string[];
};

export const projects: Project[] = [
  {
    name: "Serin AI",
    tagline: "AI interview platform",
    badge: "Work · Serin Labs",
    description:
      "An AI-powered interview platform that runs voice and video interviews, proctors them for integrity and evaluates every candidate, so hirers can interview everyone and shortlist the best. I'm on the founding team, working across the interview agent, reports, the MCP server and the web app.",
    stack: ["Next.js", "React", "FastAPI", "LLM agents", "MCP", "Supabase", "PostHog"],
    specs: [
      { label: "Role", value: "Founding Engineer" },
      { label: "Interviews", value: "Voice · Video" },
      { label: "Access", value: "Web · MCP" },
    ],
    pipeline: ["Job & candidates", "AI interview", "Proctoring", "Evaluation", "PDF report", "Hirer dashboard"],
    live: "https://serin-ai.com",
    work: [
      "Extended the Serin MCP server's tools and skills for the new assessment report",
      "Built report features: additional-assessment section, PDF timeline monitoring and anomaly rows",
      "Tuned the interview agent: prompt rules, turn intake and transcript generation",
      "Hardened the interview flow: start-failure handling and the Report Issue form",
      "Set up Infisical secrets, PostHog analytics and keyboard shortcuts on the hirer app",
    ],
  },
  {
    name: "QSkim",
    tagline: "Govt. scheme discovery platform",
    description:
      "Full-stack platform to discover and compare Indian government schemes, using hybrid RAG with BGE-M3 and Qdrant, metadata-based eligibility matching, and multilingual voice and WhatsApp access.",
    stack: ["RAG", "BGE-M3", "Qdrant", "FastAPI", "Next.js", "Groq", "Sarvam", "Twilio"],
    specs: [
      { label: "Retrieval", value: "Hybrid" },
      { label: "Access", value: "Web · Voice · WhatsApp" },
      { label: "Matching", value: "Eligibility-aware" },
    ],
    pipeline: ["Scheme data", "BGE-M3 embeddings", "Qdrant hybrid search", "Eligibility filter", "Groq answer", "Voice / WhatsApp"],
    href: "https://github.com/HeetDobariya07/QSkim",
  },
  {
    name: "IoT Fire Detection",
    tagline: "On-device TinyML on an ESP32-CAM",
    description:
      "Low-cost fire detection running a TinyML model on an ESP32-CAM, trained with Edge Impulse on a custom 176-image dataset. On detection it sounds a buzzer and switches a relay-driven water pump, while DHT11 and MQ-2 monitor heat and gas.",
    stack: ["ESP32-CAM", "Edge Impulse", "TinyML", "DHT11", "MQ-2"],
    specs: [
      { label: "Dataset", value: "176 images" },
      { label: "Model input", value: "96 × 96" },
      { label: "Trigger", value: "> 0.8 confidence" },
    ],
    pipeline: ["Camera frame", "TinyML model", "Fire? > 0.8", "Buzzer", "Relay", "Water pump"],
    href: "https://github.com/HeetDobariya07/IoT-Fire-Detection-System",
  },
  {
    name: "TalentLens",
    tagline: "Resume ranking system",
    description:
      "Ranks resumes against job descriptions using SpaCy skill extraction and BERT embeddings, scoring relevancy with Gradient Boosting, Random Forest, Ridge and SVR models on a Flask + MongoDB backend.",
    stack: ["BERT", "SpaCy", "scikit-learn", "Flask", "MongoDB"],
    specs: [
      { label: "Embeddings", value: "BERT" },
      { label: "Models", value: "4 regressors" },
      { label: "Output", value: "Ranked shortlist" },
    ],
    pipeline: ["Resume + JD", "SpaCy parsing", "Skill extraction", "BERT similarity", "Regressor ensemble", "Ranked list"],
    href: "https://github.com/HeetDobariya07/TalentLens-Resume_Ranking_System",
  },
  {
    name: "Scholaris",
    tagline: "Assignment evaluator",
    description:
      "Flask + MongoDB app where teachers create and grade assignments. The Groq API generates viva questions from each submitted file (TXT, PDF, DOCX) so teachers can assess students.",
    stack: ["Flask", "MongoDB", "Groq API"],
    specs: [
      { label: "Formats", value: "TXT · PDF · DOCX" },
      { label: "LLM", value: "Groq API" },
      { label: "Output", value: "Viva questions" },
    ],
    pipeline: ["Assignment", "Student upload", "Document parsing", "Groq LLM", "Viva questions", "Teacher review"],
    href: "https://github.com/HeetDobariya07/Scholaris-Assignment_Evaluator",
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
