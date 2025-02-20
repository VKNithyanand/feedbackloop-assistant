
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Feedback } from "@/types/interview";

interface FeedbackPanelProps {
  feedback: Feedback;
}

export const FeedbackPanel = ({ feedback }: FeedbackPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl"
    >
      <Card className="glass-card p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Overall Score</h3>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${feedback.score}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground text-right">
            {feedback.score}/100
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Strengths</h4>
            <ul className="space-y-1">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Areas for Improvement</h4>
            <ul className="space-y-1">
              {feedback.improvements.map((improvement, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-center">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2" />
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Detailed Analysis</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(feedback.detailedAnalysis).map(([key, value]) => (
                <div key={key} className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-sm font-medium capitalize">{key}</div>
                  <div className="text-2xl font-semibold">{Math.round(value)}%</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Key Points Mentioned</h4>
            <div className="flex flex-wrap gap-2">
              {feedback.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {feedback.suggestions.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Follow-up Questions to Consider</h4>
              <ul className="space-y-1">
                {feedback.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
