
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InterviewCard } from "@/components/InterviewCard";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { ProgressBar } from "@/components/ProgressBar";
import type { Question, Answer, Feedback, InterviewSession } from "@/types/interview";

const mockQuestions: Question[] = [
  {
    id: "1",
    text: "Tell me about a challenging project you've worked on and how you overcame obstacles.",
    category: "behavioral",
    difficulty: "medium",
  },
  {
    id: "2",
    text: "What are your strongest technical skills and how have you applied them in past projects?",
    category: "technical",
    difficulty: "medium",
  },
  {
    id: "3",
    text: "How do you handle conflicts within a team?",
    category: "situational",
    difficulty: "hard",
  },
];

const generateFeedback = (answer: string): Feedback => {
  // This is a mock feedback generator - in production, this would use AI
  return {
    score: Math.floor(Math.random() * 30) + 70,
    strengths: [
      "Clear communication style",
      "Provided specific examples",
      "Demonstrated problem-solving skills",
    ],
    improvements: [
      "Could provide more quantitative results",
      "Consider structuring response with STAR method",
    ],
    keywords: ["teamwork", "communication", "problem-solving", "leadership"],
  };
};

const Index = () => {
  const [session, setSession] = useState<InterviewSession>({
    id: "1",
    startTime: Date.now(),
    currentQuestionIndex: 0,
    questions: mockQuestions,
    answers: [],
    feedback: [],
  });

  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswer = (text: string) => {
    const currentQuestion = session.questions[session.currentQuestionIndex];
    const answer: Answer = {
      questionId: currentQuestion.id,
      text,
      timestamp: Date.now(),
    };

    const feedback = generateFeedback(text);

    setSession((prev) => ({
      ...prev,
      answers: [...prev.answers, answer],
      feedback: [...prev.feedback, feedback],
      currentQuestionIndex: prev.currentQuestionIndex + 1,
    }));

    setShowFeedback(true);
    
    // Show feedback for 3 seconds before moving to the next question
    setTimeout(() => {
      setShowFeedback(false);
    }, 3000);
  };

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const isComplete = session.currentQuestionIndex >= session.questions.length;
  const latestFeedback = session.feedback[session.feedback.length - 1];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">AI Interview Assistant</h1>
          <p className="text-muted-foreground">
            Answer the questions naturally and receive instant feedback on your responses.
          </p>
        </motion.div>

        {!isComplete && (
          <ProgressBar
            current={session.currentQuestionIndex + 1}
            total={session.questions.length}
          />
        )}

        <AnimatePresence mode="wait">
          {!isComplete && !showFeedback && currentQuestion && (
            <InterviewCard
              key={currentQuestion.id}
              question={currentQuestion}
              onAnswer={handleAnswer}
            />
          )}

          {showFeedback && latestFeedback && (
            <div className="flex justify-center">
              <FeedbackPanel feedback={latestFeedback} />
            </div>
          )}

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h2 className="text-2xl font-semibold mb-4">Interview Complete!</h2>
              <p className="text-muted-foreground mb-8">
                Thank you for completing the interview. Your responses have been recorded.
              </p>
              <button
                onClick={() => {
                  setSession({
                    id: String(Date.now()),
                    startTime: Date.now(),
                    currentQuestionIndex: 0,
                    questions: mockQuestions,
                    answers: [],
                    feedback: [],
                  });
                }}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
              >
                Start New Interview
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
