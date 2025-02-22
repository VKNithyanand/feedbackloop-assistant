
import { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from 'lucide-react';
import { Question } from '@/types/interview';
import { CodeEditor } from './CodeEditor';
import { InterviewVideo } from './InterviewVideo';
import { setupSecurityMonitoring } from '@/utils/securityCheck';
import { validateAnswer } from '@/utils/scoring';

// Add type definitions
declare global {
  interface Window {
    ImageCapture: any;
    FaceDetector: any;
  }
}

interface InterviewProps {
  question: Question;
  mode: 'practice' | 'interview' | 'quiz' | 'coding';
  onComplete: (response: { text?: string; recordingUrl?: string; code?: string }) => void;
  onNext: () => void;
  timeLimit?: number;
}

export const Interview = ({ 
  question, 
  mode,
  onComplete, 
  onNext,
  timeLimit = 300
}: InterviewProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [securityViolations, setSecurityViolations] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [answer, setAnswer] = useState("");
  const [code, setCode] = useState("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();
  const securityCheckIntervalRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  useEffect(() => {
    if (mode === 'interview') {
      initializeMedia();
    }
    return () => {
      cleanup();
    };
  }, [mode]);

  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (securityCheckIntervalRef.current) {
      clearInterval(securityCheckIntervalRef.current);
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const initializeMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);

      securityCheckIntervalRef.current = setupSecurityMonitoring(
        mediaStream,
        isRecording,
        setIsAnalyzing,
        handleSecurityViolation
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to access camera or microphone. Please check your permissions.",
        variant: "destructive",
      });
    }
  };

  const handleSecurityViolation = (reason: string) => {
    setSecurityViolations(prev => {
      const newCount = prev + 1;
      toast({
        variant: "destructive",
        title: "Security Warning",
        description: `${reason}. Warning ${newCount}/3`,
      });
      
      if (newCount >= 3) {
        cleanup();
        onComplete({});
        return 0;
      }
      return newCount;
    });
  };

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(!isMicOn);
    }
  };

  const handleSubmit = () => {
    if (mode === 'coding') {
      if (!code.trim()) {
        toast({
          title: "Error",
          description: "Please write some code before submitting",
          variant: "destructive",
        });
        return;
      }
      onComplete({ code });
    } else if (mode === 'practice' || mode === 'quiz') {
      if (validateAnswer(answer, question.expectedAnswer, mode === 'quiz')) {
        onComplete({ text: answer });
      }
    }
    setAnswer("");
    setCode("");
  };

  const renderContent = () => {
    switch (mode) {
      case 'coding':
        return (
          <CodeEditor
            code={code}
            onChange={setCode}
            language={question.type === 'technical' ? 'javascript' : 'plaintext'}
          />
        );
      case 'practice':
      case 'quiz':
        return (
          <textarea
            className="w-full min-h-[200px] p-4 rounded-lg border bg-background resize-none"
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        );
      case 'interview':
        return (
          <InterviewVideo
            stream={stream}
            isRecording={isRecording}
            isCameraOn={isCameraOn}
            isMicOn={isMicOn}
            timeRemaining={timeRemaining}
            onToggleCamera={toggleCamera}
            onToggleMic={toggleMic}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="glass-card p-6 space-y-6 backdrop-blur-xl bg-background/80">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">{question.text}</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground capitalize">{mode}</span>
              {isAnalyzing && (
                <span className="text-yellow-500 animate-pulse flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  Analyzing
                </span>
              )}
            </div>
          </div>

          {renderContent()}

          <div className="flex justify-end gap-2">
            <Button
              onClick={handleSubmit}
              className="bg-primary"
            >
              Submit
            </Button>
            <Button
              variant="outline"
              onClick={onNext}
            >
              Next Question
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};
