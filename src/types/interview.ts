
export type Question = {
  id: string;
  text: string;
  category: "behavioral" | "technical" | "situational";
  difficulty: "easy" | "medium" | "hard";
};

export type Answer = {
  questionId: string;
  text: string;
  timestamp: number;
};

export type Feedback = {
  score: number;
  strengths: string[];
  improvements: string[];
  keywords: string[];
};

export type InterviewSession = {
  id: string;
  startTime: number;
  currentQuestionIndex: number;
  questions: Question[];
  answers: Answer[];
  feedback: Feedback[];
};
