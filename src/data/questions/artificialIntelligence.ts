
import { Question } from "@/types/interview";

export const artificialIntelligenceQuestions: Question[] = [
  {
    id: "ai1",
    text: "What is the difference between AI and ML?",
    type: "technical",
    category: "artificial_intelligence",
    difficulty: "medium",
    expectedKeywords: ["artificial intelligence", "machine learning", "subset", "algorithms", "data", "training"],
    followUpQuestions: [
      "Can you give practical examples of each?",
      "How do they complement each other?",
    ],
    scoringCriteria: { clarity: 0.3, relevance: 0.4, depth: 0.3 },
  },
  {
    id: "ai2",
    text: "What are the main types of Machine Learning?",
    type: "technical",
    category: "artificial_intelligence",
    difficulty: "medium",
    expectedKeywords: ["supervised", "unsupervised", "reinforcement", "semi-supervised", "deep learning"],
    followUpQuestions: [
      "What are the use cases for each type?",
      "Which type is most commonly used in industry?",
    ],
    scoringCriteria: { clarity: 0.3, relevance: 0.4, depth: 0.3 },
  },
  // ... 8 more questions for AI & ML
];
