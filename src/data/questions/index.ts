import { Question } from "@/types/interview";
import { softwareDevelopmentQuestions } from "./softwareDevelopment";
import { artificialIntelligenceQuestions } from "./artificialIntelligence";
import { cybersecurityQuestions } from "./cybersecurity";
import { dataScienceQuestions } from "./dataScience";
import { embeddedSystemsQuestions } from "./embeddedSystems";
import { cloudComputingQuestions } from "./cloudComputing";
import { blockchainQuestions } from "./blockchain";
import { softwareTestingQuestions } from "./softwareTesting";
import { computerNetworksQuestions } from "./computerNetworks";

export interface QuestionDomain {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

export const questionDomains: QuestionDomain[] = [
  {
    id: "software_development",
    name: "Software Development & Engineering",
    description: "Core concepts of software development lifecycle, methodologies, and engineering practices",
    questions: softwareDevelopmentQuestions,
  },
  {
    id: "artificial_intelligence",
    name: "Artificial Intelligence & Machine Learning",
    description: "Fundamentals of AI, ML algorithms, neural networks, and their applications",
    questions: artificialIntelligenceQuestions,
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description: "Key concepts in cybersecurity, threat detection, and prevention techniques",
    questions: cybersecurityQuestions,
  },
  {
    id: "data_science",
    name: "Data Science & Analytics",
    description: "Principles of data science, statistical analysis, and machine learning applications",
    questions: dataScienceQuestions,
  },
  {
    id: "embedded_systems",
    name: "Embedded Systems & IoT",
    description: "Fundamentals of embedded systems, IoT devices, and real-time computing",
    questions: embeddedSystemsQuestions,
  },
  {
    id: "cloud_computing",
    name: "Cloud Computing & DevOps",
    description: "Core concepts of cloud computing, DevOps practices, and containerization",
    questions: cloudComputingQuestions,
  },
  {
    id: "blockchain",
    name: "Blockchain & Web3",
    description: "Principles of blockchain technology, smart contracts, and decentralized applications",
    questions: blockchainQuestions,
  },
  {
    id: "software_testing",
    name: "Software Testing & Quality Assurance",
    description: "Techniques for software testing, quality assurance, and test automation",
    questions: softwareTestingQuestions,
  },
  {
    id: "computer_networks",
    name: "Computer Networks & Operating Systems",
    description: "Fundamentals of computer networks, protocols, and operating system concepts",
    questions: computerNetworksQuestions,
  },
];

export const getAllQuestions = (): Question[] => {
  return questionDomains.flatMap(domain => domain.questions);
};

export const getQuestionsByDomain = (domainId: string): Question[] => {
  const domain = questionDomains.find(d => d.id === domainId);
  return domain?.questions || [];
};
