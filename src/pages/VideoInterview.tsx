
import { useState } from 'react';
import { Interview } from '@/components/Interview';
import { Question } from '@/types/interview';

const sampleQuestion: Question = {
  id: '1',
  text: "Tell me about your experience with React and how you've used it in your projects.",
  type: 'technical',
  category: 'technical',
  difficulty: 'medium',
  expectedKeywords: ['React', 'hooks', 'state management', 'components'],
  scoringCriteria: {
    clarity: 0.3,
    relevance: 0.4,
    depth: 0.3
  }
};

const VideoInterviewPage = () => {
  const [isComplete, setIsComplete] = useState(false);

  const handleComplete = (response: { text?: string; recordingUrl?: string; code?: string }) => {
    console.log('Response:', response);
    setIsComplete(true);
  };

  const handleNext = () => {
    setIsComplete(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Interview</h1>
      <div className="max-w-4xl mx-auto">
        <Interview
          question={sampleQuestion}
          mode="interview"
          onComplete={handleComplete}
          onNext={handleNext}
        />
      </div>
    </div>
  );
};

export default VideoInterviewPage;
