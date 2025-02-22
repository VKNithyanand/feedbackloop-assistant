
export type QuestionCategory = 
  | "software_development"
  | "artificial_intelligence"
  | "cybersecurity"
  | "data_science"
  | "embedded_systems"
  | "cloud_computing"
  | "blockchain"
  | "software_testing"
  | "computer_networks"
  | "technical";

export type DifficultyLevel = "easy" | "medium" | "hard" | "expert";

export type Question = {
  id: string;
  text: string;
  type: string;
  category: QuestionCategory;
  difficulty: DifficultyLevel;
  expectedKeywords: string[];
  followUpQuestions?: string[];
  scoringCriteria: {
    clarity: number;
    relevance: number;
    depth: number;
  };
};

export type Answer = {
  questionId: string;
  text: string;
  timestamp: number;
  audioUrl?: string;
  duration?: number;
};

export type Feedback = {
  score: number;
  strengths: string[];
  improvements: string[];
  keywords: string[];
  detailedAnalysis: {
    clarity: number;
    relevance: number;
    depth: number;
    confidence: number;
  };
  suggestions: string[];
};

export type InterviewSession = {
  id: string;
  startTime: number;
  currentQuestionIndex: number;
  questions: Question[];
  answers: Answer[];
  feedback: Feedback[];
  overallScore?: number;
  category?: string;
  candidateName?: string;
};
