
import { Question } from "@/types/interview";
import { softwareDevelopmentQuestions } from "./softwareDevelopment";
import { artificialIntelligenceQuestions } from "./artificialIntelligence";

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
  }
];

export const getAllQuestions = (): Question[] => {
  return questionDomains.flatMap(domain => domain.questions);
};

export const getQuestionsByDomain = (domainId: string): Question[] => {
  const domain = questionDomains.find(d => d.id === domainId);
  return domain?.questions || [];
};
