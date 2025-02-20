
import { Question } from "@/types/interview";

export const mockQuestions: Question[] = [
  {
    id: "1",
    text: "Tell me about a challenging project you've worked on and how you overcame obstacles.",
    category: "behavioral",
    difficulty: "medium",
    expectedKeywords: ["challenge", "solution", "teamwork", "results", "learning"],
    followUpQuestions: [
      "What was the biggest lesson learned?",
      "How did this experience change your approach to project management?",
    ],
    scoringCriteria: {
      clarity: 0.35,
      relevance: 0.35,
      depth: 0.30,
    },
  },
  {
    id: "2",
    text: "Describe a situation where you had to debug a complex technical issue. What was your approach?",
    category: "technical",
    difficulty: "hard",
    expectedKeywords: ["debugging", "analysis", "problem-solving", "tools", "solution"],
    followUpQuestions: [
      "What tools did you use?",
      "How would you prevent similar issues in the future?",
    ],
    scoringCriteria: {
      clarity: 0.3,
      relevance: 0.4,
      depth: 0.3,
    },
  },
  {
    id: "3",
    text: "How do you handle conflicts within a team?",
    category: "situational",
    difficulty: "medium",
    expectedKeywords: ["communication", "resolution", "mediation", "compromise", "understanding"],
    followUpQuestions: [
      "Can you provide a specific example?",
      "What would you do differently next time?",
    ],
    scoringCriteria: {
      clarity: 0.4,
      relevance: 0.3,
      depth: 0.3,
    },
  },
  {
    id: "4",
    text: "Explain a time when you had to make a difficult decision with incomplete information.",
    category: "leadership",
    difficulty: "hard",
    expectedKeywords: ["decision-making", "risk", "analysis", "outcome", "stakeholders"],
    followUpQuestions: [
      "How did you handle the uncertainty?",
      "What was the outcome of your decision?",
    ],
    scoringCriteria: {
      clarity: 0.3,
      relevance: 0.35,
      depth: 0.35,
    },
  },
];
