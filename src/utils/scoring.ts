
import { toast } from "@/components/ui/use-toast";

export const validateAnswer = (
  text: string,
  expectedAnswer?: string,
  isQuiz = false
): boolean => {
  if (!text.trim()) {
    toast({
      title: "Error",
      description: "Please provide an answer before proceeding",
      variant: "destructive",
    });
    return false;
  }
  
  if (isQuiz && expectedAnswer) {
    const score = calculateScore(text, expectedAnswer);
    toast({
      title: "Quiz Score",
      description: `Your score: ${score}%`,
    });
    return score >= 70;
  }
  
  return true;
};

export const calculateScore = (userAnswer: string, expectedAnswer: string): number => {
  const userKeywords = userAnswer.toLowerCase().split(' ');
  const expectedKeywords = expectedAnswer.toLowerCase().split(' ');
  const matchedKeywords = expectedKeywords.filter(keyword => 
    userKeywords.includes(keyword)
  );
  return Math.round((matchedKeywords.length / expectedKeywords.length) * 100);
};
