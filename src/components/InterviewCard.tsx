
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Question } from "@/types/interview";
import { useState } from "react";

interface InterviewCardProps {
  question: Question;
  onAnswer: (text: string) => void;
  isRecording?: boolean;
}

export const InterviewCard = ({ question, onAnswer, isRecording = false }: InterviewCardProps) => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (answer.trim()) {
      onAnswer(answer);
      setAnswer("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground capitalize">
            {question.category}
          </span>
          <span className="text-sm font-medium text-muted-foreground capitalize px-2 py-1 bg-secondary rounded">
            {question.difficulty}
          </span>
        </div>
        
        <h2 className="text-xl font-semibold">{question.text}</h2>
        
        <div className="space-y-4">
          <textarea
            className="w-full min-h-[120px] p-3 rounded-md border bg-background/50"
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {isRecording && (
                <span className="flex items-center text-sm text-red-500">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />
                  Recording
                </span>
              )}
            </div>
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
              onClick={handleSubmit}
            >
              Submit Answer
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
