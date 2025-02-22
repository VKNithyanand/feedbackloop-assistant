
import { Question } from "@/types/interview";

export const mockQuestions: Question[] = [
  // Software Development & Engineering
  {
    id: "sde1",
    text: "What are the phases of the Software Development Life Cycle (SDLC)?",
    type: "technical",
    category: "technical",
    difficulty: "medium",
    expectedKeywords: ["planning", "analysis", "design", "implementation", "testing", "maintenance"],
    followUpQuestions: [
      "Which SDLC phase do you think is most critical?",
      "How do you handle requirement changes during development?",
    ],
    scoringCriteria: {
      clarity: 0.3,
      relevance: 0.4,
      depth: 0.3,
    },
  },
  {
    id: "sde2",
    text: "What is the difference between Agile and Waterfall models?",
    type: "technical",
    category: "technical",
    difficulty: "medium",
    expectedKeywords: ["iterative", "flexible", "sequential", "documentation", "delivery", "feedback"],
    followUpQuestions: [
      "Which methodology do you prefer and why?",
      "How do you handle stakeholder communication in each model?",
    ],
    scoringCriteria: {
      clarity: 0.35,
      relevance: 0.35,
      depth: 0.3,
    },
  },
  // AI & Machine Learning
  {
    id: "ai1",
    text: "What is the difference between AI and ML?",
    type: "technical",
    category: "technical",
    difficulty: "medium",
    expectedKeywords: ["artificial intelligence", "machine learning", "subset", "algorithms", "data", "training"],
    followUpQuestions: [
      "Can you give practical examples of each?",
      "How do they complement each other?",
    ],
    scoringCriteria: {
      clarity: 0.4,
      relevance: 0.3,
      depth: 0.3,
    },
  },
  {
    id: "ai2",
    text: "What is overfitting in ML?",
    type: "technical",
    category: "technical",
    difficulty: "hard",
    expectedKeywords: ["training data", "generalization", "noise", "validation", "regularization"],
    followUpQuestions: [
      "How do you prevent overfitting?",
      "What's the difference between overfitting and underfitting?",
    ],
    scoringCriteria: {
      clarity: 0.3,
      relevance: 0.4,
      depth: 0.3,
    },
  },
  // Cybersecurity
  {
    id: "sec1",
    text: "What are the main types of cyber threats?",
    type: "technical",
    category: "technical",
    difficulty: "medium",
    expectedKeywords: ["malware", "phishing", "ransomware", "ddos", "social engineering"],
    followUpQuestions: [
      "How do you protect against these threats?",
      "Which threat do you consider most dangerous and why?",
    ],
    scoringCriteria: {
      clarity: 0.3,
      relevance: 0.4,
      depth: 0.3,
    },
  },
  {
    id: "sec2",
    text: "What is the CIA Triad in cybersecurity?",
    type: "technical",
    category: "technical",
    difficulty: "medium",
    expectedKeywords: ["confidentiality", "integrity", "availability", "security", "principles"],
    followUpQuestions: [
      "How do you ensure each aspect of the CIA triad?",
      "Which element is most challenging to maintain?",
    ],
    scoringCriteria: {
      clarity: 0.35,
      relevance: 0.35,
      depth: 0.3,
    },
  },
  // Cloud Computing & DevOps
  {
    id: "cloud1",
    text: "What is cloud computing?",
    type: "technical",
    category: "technical",
    difficulty: "medium",
    expectedKeywords: ["services", "internet", "resources", "scalability", "on-demand", "infrastructure"],
    followUpQuestions: [
      "What are the main service models in cloud computing?",
      "What are the advantages and disadvantages of cloud computing?",
    ],
    scoringCriteria: {
      clarity: 0.3,
      relevance: 0.4,
      depth: 0.3,
    },
  },
  {
    id: "devops1",
    text: "What is CI/CD in DevOps?",
    type: "technical",
    category: "technical",
    difficulty: "hard",
    expectedKeywords: ["continuous integration", "continuous delivery", "automation", "pipeline", "deployment"],
    followUpQuestions: [
      "What tools have you used for CI/CD?",
      "How do you handle failed deployments?",
    ],
    scoringCriteria: {
      clarity: 0.3,
      relevance: 0.4,
      depth: 0.3,
    },
  },
  // Blockchain & Web3
  {
    id: "blockchain1",
    text: "What is blockchain?",
    type: "technical",
    category: "technical",
    difficulty: "medium",
    expectedKeywords: ["distributed ledger", "decentralized", "cryptography", "consensus", "immutable"],
    followUpQuestions: [
      "What are the main applications of blockchain?",
      "What are the limitations of blockchain technology?",
    ],
    scoringCriteria: {
      clarity: 0.35,
      relevance: 0.35,
      depth: 0.3,
    },
  },
  {
    id: "blockchain2",
    text: "What are smart contracts?",
    type: "technical",
    category: "technical",
    difficulty: "hard",
    expectedKeywords: ["self-executing", "automated", "conditions", "blockchain", "ethereum"],
    followUpQuestions: [
      "What are the security considerations in smart contracts?",
      "How do you test smart contracts?",
    ],
    scoringCriteria: {
      clarity: 0.3,
      relevance: 0.4,
      depth: 0.3,
    },
  },
  // Computer Networks
  {
    id: "network1",
    text: "What is the OSI model?",
    type: "technical",
    category: "technical",
    difficulty: "medium",
    expectedKeywords: ["layers", "protocol", "communication", "network", "standardization"],
    followUpQuestions: [
      "Can you explain each layer of the OSI model?",
      "How does data flow through the OSI layers?",
    ],
    scoringCriteria: {
      clarity: 0.35,
      relevance: 0.35,
      depth: 0.3,
    },
  },
  {
    id: "network2",
    text: "What is the difference between TCP and UDP?",
    type: "technical",
    category: "technical",
    difficulty: "medium",
    expectedKeywords: ["connection-oriented", "reliability", "speed", "packets", "protocols"],
    followUpQuestions: [
      "When would you use TCP over UDP?",
      "How does TCP ensure reliable delivery?",
    ],
    scoringCriteria: {
      clarity: 0.3,
      relevance: 0.4,
      depth: 0.3,
    },
  }
];
