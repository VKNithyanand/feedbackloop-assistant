
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Question } from "@/types/interview";
import { useState } from "react";

interface InterviewCardProps {
  question: Question;
  onAnswer: (text: string) => void;
}

export const InterviewCard = ({ question, onAnswer }: InterviewCardProps) => {
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
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">{question.text}</h3>
          <span className="text-sm text-muted-foreground">{question.category}</span>
        </div>
        
        <textarea
          className="w-full min-h-[120px] p-3 rounded-md border bg-background/50"
          placeholder="Type your answer here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>
            Submit Answer
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
