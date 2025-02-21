
import { useState } from 'react';
import { VideoInterview } from '@/components/VideoInterview';
import { Question } from '@/types/interview';

const sampleQuestion: Question = {
  id: '1',
  text: "Tell me about your experience with React and how you've used it in your projects.",
  category: 'Technical',
  difficulty: 'Medium',
  expectedAnswer: 'Looking for knowledge of React fundamentals, hooks, state management.',
  type: 'technical'
};

const VideoInterviewPage = () => {
  const [isComplete, setIsComplete] = useState(false);

  const handleComplete = (recordingUrl: string) => {
    console.log('Recording URL:', recordingUrl);
    setIsComplete(true);
  };

  const handleNext = () => {
    setIsComplete(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Video Interview</h1>
      <div className="max-w-4xl mx-auto">
        <VideoInterview
          question={sampleQuestion}
          onComplete={handleComplete}
          onNext={handleNext}
        />
      </div>
    </div>
  );
};

export default VideoInterviewPage;
