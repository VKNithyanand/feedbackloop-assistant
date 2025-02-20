
import { Answer, Feedback, Question } from "@/types/interview";

const analyzeKeywords = (text: string, expectedKeywords: string[]): string[] => {
  const lowerText = text.toLowerCase();
  return expectedKeywords.filter(keyword => lowerText.includes(keyword.toLowerCase()));
};

const calculateScores = (
  text: string,
  question: Question
): { clarity: number; relevance: number; depth: number } => {
  // Mock scoring logic - in production, this would use AI/NLP
  const wordCount = text.split(' ').length;
  const sentenceCount = text.split(/[.!?]+/).length;
  const keywordCount = analyzeKeywords(text, question.expectedKeywords || []).length;

  return {
    clarity: Math.min(wordCount / 100, 1) * 100,
    relevance: (keywordCount / (question.expectedKeywords?.length || 1)) * 100,
    depth: Math.min((sentenceCount / 5) * 100, 100),
  };
};

const generateImprovements = (
  scores: { clarity: number; relevance: number; depth: number },
  keywordsFound: string[],
  question: Question
): string[] => {
  const improvements: string[] = [];

  if (scores.clarity < 70) {
    improvements.push("Try to structure your response more clearly using the STAR method");
  }
  if (scores.relevance < 70) {
    improvements.push("Include more specific examples related to the question");
  }
  if (scores.depth < 70) {
    improvements.push("Elaborate more on the key points of your response");
  }

  const missedKeywords = (question.expectedKeywords || [])
    .filter(keyword => !keywordsFound.includes(keyword));
  
  if (missedKeywords.length > 0) {
    improvements.push(`Consider addressing these aspects: ${missedKeywords.join(", ")}`);
  }

  return improvements;
};

export const generateFeedback = (answer: Answer, question: Question): Feedback => {
  const scores = calculateScores(answer.text, question);
  const keywordsFound = analyzeKeywords(answer.text, question.expectedKeywords || []);

  const overallScore = Math.round(
    (scores.clarity + scores.relevance + scores.depth) / 3
  );

  return {
    score: overallScore,
    strengths: [
      scores.clarity > 80 ? "Clear and well-structured response" : "",
      scores.relevance > 80 ? "Highly relevant to the question" : "",
      scores.depth > 80 ? "Good depth of explanation" : "",
      keywordsFound.length > 0 ? "Used relevant industry terminology" : "",
    ].filter(Boolean),
    improvements: generateImprovements(scores, keywordsFound, question),
    keywords: keywordsFound,
    detailedAnalysis: {
      clarity: scores.clarity,
      relevance: scores.relevance,
      depth: scores.depth,
      confidence: Math.round((keywordsFound.length / (question.expectedKeywords?.length || 1)) * 100),
    },
    suggestions: question.followUpQuestions || [],
  };
};
