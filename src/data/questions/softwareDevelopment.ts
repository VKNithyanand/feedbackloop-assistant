
import { Question } from "@/types/interview";

export const softwareDevelopmentQuestions: Question[] = [
  {
    id: "sde1",
    text: "What are the phases of the Software Development Life Cycle (SDLC)?",
    type: "technical",
    category: "software_development",
    difficulty: "medium",
    expectedKeywords: ["planning", "analysis", "design", "implementation", "testing", "maintenance"],
    followUpQuestions: [
      "Which SDLC phase do you think is most critical?",
      "How do you handle requirement changes during development?",
    ],
    scoringCriteria: { clarity: 0.3, relevance: 0.4, depth: 0.3 },
  },
  {
    id: "sde2",
    text: "What is the difference between software development and software engineering?",
    type: "technical",
    category: "software_development",
    difficulty: "medium",
    expectedKeywords: ["methodology", "discipline", "practices", "principles", "engineering", "development"],
    followUpQuestions: [
      "How does this difference impact project management?",
      "Which approach is better for small vs large projects?",
    ],
    scoringCriteria: { clarity: 0.3, relevance: 0.4, depth: 0.3 },
  },
  // ... 8 more questions for Software Development
];
