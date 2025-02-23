
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Interview } from '@/components/Interview';
import { Question } from '@/types/interview';
import { supabase } from '@/integrations/supabase/client';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

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
  const [showGuestAlert, setShowGuestAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserAccess();
  }, []);

  const checkUserAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.user_metadata.isGuest) {
      setShowGuestAlert(true);
    }
    setIsLoading(false);
  };

  const handleComplete = (response: { text?: string; recordingUrl?: string; code?: string }) => {
    console.log('Response:', response);
    setIsComplete(true);
  };

  const handleNext = () => {
    setIsComplete(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <>
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

      <AlertDialog open={showGuestAlert} onOpenChange={setShowGuestAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Feature Not Available</AlertDialogTitle>
            <AlertDialogDescription>
              Video interview features are only available for registered users.
              Please sign in or create an account to access this feature.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => navigate('/auth')}>Sign In</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default VideoInterviewPage;
