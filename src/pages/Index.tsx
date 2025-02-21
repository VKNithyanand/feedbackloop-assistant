
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InterviewCard } from "@/components/InterviewCard";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { ProgressBar } from "@/components/ProgressBar";
import { DomainSelection } from "@/components/DomainSelection";
import { mockQuestions } from "@/data/mockQuestions";
import { generateFeedback } from "@/utils/feedbackAnalysis";
import type { Answer, InterviewSession } from "@/types/interview";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<"practice" | "interview" | "quiz" | "coding" | null>(null);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const { toast } = useToast();

  const handleDomainSelect = async (domain: string, mode: "practice" | "interview" | "quiz" | "coding") => {
    setSelectedDomain(domain);
    setSelectedMode(mode);
    
    // Create a new session with the selected mode
    const newSession: InterviewSession = {
      id: String(Date.now()),
      startTime: Date.now(),
      currentQuestionIndex: 0,
      questions: mockQuestions.filter(q => 
        mode === "coding" ? q.category === "technical" : true
      ),
      answers: [],
      feedback: [],
      category: domain,
    };
    
    setSession(newSession);
  };

  const handleAnswer = async (text: string) => {
    if (!session) return;

    const currentQuestion = session.questions[session.currentQuestionIndex];
    const answer: Answer = {
      questionId: currentQuestion.id,
      text,
      timestamp: Date.now(),
    };

    const feedback = generateFeedback(answer, currentQuestion);

    // Update session with new answer and feedback
    setSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        answers: [...prev.answers, answer],
        feedback: [...prev.feedback, feedback],
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        overallScore: feedback.score,
      };
    });

    // If this is the last question, save the score to the leaderboard
    if (session.currentQuestionIndex === session.questions.length - 1) {
      try {
        const { error } = await supabase
          .from('scores')
          .insert({
            domain: session.category,
            score: feedback.score,
          });

        if (error) throw error;

        toast({
          title: "Score saved!",
          description: "Your score has been added to the leaderboard.",
        });
      } catch (error) {
        console.error('Error saving score:', error);
        toast({
          title: "Error",
          description: "Failed to save your score to the leaderboard.",
          variant: "destructive",
        });
      }
    }

    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
    }, 4000);
  };

  const handleReset = () => {
    setSelectedDomain(null);
    setSelectedMode(null);
    setSession(null);
    setShowFeedback(false);
  };

  if (!selectedDomain || !session) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <DomainSelection onSelect={handleDomainSelect} />
      </div>
    );
  }

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
          <button
            onClick={handleReset}
            className="absolute top-4 left-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Domains
          </button>
          <h1 className="text-4xl font-bold mb-4">
            {selectedDomain.charAt(0).toUpperCase() + selectedDomain.slice(1)} {selectedMode?.charAt(0).toUpperCase() + selectedMode?.slice(1)}
          </h1>
          <p className="text-muted-foreground">
            {selectedMode === "practice" ? "Practice mode - Take your time to learn" :
             selectedMode === "interview" ? "Interview mode - Real interview simulation" :
             selectedMode === "quiz" ? "Quiz mode - Test your knowledge" :
             "Coding mode - Solve technical challenges"}
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
              <h2 className="text-2xl font-semibold mb-4">Session Complete!</h2>
              <p className="text-muted-foreground mb-8">
                Your final score: {session.overallScore}
              </p>
              <div className="space-x-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition-opacity"
                >
                  Choose Different Domain
                </button>
                <button
                  onClick={() => {
                    handleDomainSelect(selectedDomain, selectedMode!);
                  }}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
