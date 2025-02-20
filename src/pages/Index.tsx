
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InterviewCard } from "@/components/InterviewCard";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { ProgressBar } from "@/components/ProgressBar";
import { mockQuestions } from "@/data/mockQuestions";
import { generateFeedback } from "@/utils/feedbackAnalysis";
import type { Answer, InterviewSession } from "@/types/interview";

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

    const feedback = generateFeedback(answer, currentQuestion);

    setSession((prev) => ({
      ...prev,
      answers: [...prev.answers, answer],
      feedback: [...prev.feedback, feedback],
      currentQuestionIndex: prev.currentQuestionIndex + 1,
    }));

    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
    }, 4000); // Increased to 4 seconds to give more time to read feedback
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
