
import { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  Timer,
  RefreshCw,
  Save,
  AlertTriangle
} from 'lucide-react';
import { Question } from '@/types/interview';
import { CodeEditor } from './CodeEditor';

// Add ImageCapture type definition
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
  const [answer, setAnswer] = useState(""); // Add missing state
  const [code, setCode] = useState(""); // Add missing state
  
  const videoRef = useRef<HTMLVideoElement>(null);
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
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setupSecurityCheck(mediaStream);
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to access camera or microphone. Please check your permissions.",
        variant: "destructive",
      });
    }
  };

  const setupSecurityCheck = (mediaStream: MediaStream) => {
    const videoTrack = mediaStream.getVideoTracks()[0];
    const audioTrack = mediaStream.getAudioTracks()[0];

    securityCheckIntervalRef.current = setInterval(async () => {
      if (!isRecording) return;

      setIsAnalyzing(true);
      try {
        // Check for multiple faces using browser's face detection API
        const imageCapture = new window.ImageCapture(videoTrack);
        const bitmap = await imageCapture.grabFrame();
        
        if ('FaceDetector' in window) {
          const faceDetector = new window.FaceDetector();
          const faces = await faceDetector.detect(bitmap);
          
          if (faces.length > 1) {
            handleSecurityViolation('Multiple faces detected');
          }
        }

        // Check for multiple voices
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(mediaStream);
        source.connect(analyser);
        
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);
        
        let voiceCount = 0;
        let lastPeak = 0;
        for (let i = 0; i < bufferLength; i++) {
          if (dataArray[i] > 200 && i - lastPeak > 100) {
            voiceCount++;
            lastPeak = i;
          }
        }
        
        if (voiceCount > 1) {
          handleSecurityViolation('Multiple voices detected');
        }

      } catch (error) {
        console.error('Security check error:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }, 5000);
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

  const validateAnswer = (text: string): boolean => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please provide an answer before proceeding",
        variant: "destructive",
      });
      return false;
    }
    
    if (mode === 'quiz' && question.expectedAnswer) {
      const score = calculateScore(text, question.expectedAnswer);
      toast({
        title: "Quiz Score",
        description: `Your score: ${score}%`,
      });
      return score >= 70;
    }
    
    return true;
  };

  const calculateScore = (userAnswer: string, expectedAnswer: string): number => {
    const userKeywords = userAnswer.toLowerCase().split(' ');
    const expectedKeywords = expectedAnswer.toLowerCase().split(' ');
    const matchedKeywords = expectedKeywords.filter(keyword => 
      userKeywords.includes(keyword)
    );
    return Math.round((matchedKeywords.length / expectedKeywords.length) * 100);
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
      if (validateAnswer(answer)) {
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
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center space-x-2 bg-black/50 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white text-sm">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

          <div className="flex justify-between items-center">
            {mode === 'interview' && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleCamera}
                >
                  {isCameraOn ? <Camera /> : <CameraOff />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleMic}
                >
                  {isMicOn ? <Mic /> : <MicOff />}
                </Button>
              </div>
            )}

            <div className="flex gap-2 ml-auto">
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
          </div>

        </motion.div>
      </AnimatePresence>
    </Card>
  );
};
