
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
  Save
} from 'lucide-react';
import { Question } from '@/types/interview';

interface VideoInterviewProps {
  question: Question;
  onComplete: (recordingUrl: string) => void;
  onNext: () => void;
  timeLimit?: number; // in seconds
}

export const VideoInterview = ({ 
  question, 
  onComplete, 
  onNext,
  timeLimit = 300 // 5 minutes default
}: VideoInterviewProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isPreparingResponse, setIsPreparingResponse] = useState(true);
  const [transcriptText, setTranscriptText] = useState<string>("");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  useEffect(() => {
    initializeMedia();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to access camera or microphone. Please check your permissions.",
        variant: "destructive",
      });
    }
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

  const startRecording = () => {
    if (stream) {
      setIsPreparingResponse(false);
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        onComplete(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const restartPreparation = () => {
    setIsPreparingResponse(true);
    setTimeRemaining(timeLimit);
    setTranscriptText("");
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

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{question.text}</h3>
              <span className="text-sm text-muted-foreground">{question.category}</span>
            </div>
            
            {isPreparingResponse && (
              <div className="bg-secondary/20 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Take a moment to prepare your response. When you're ready, click "Start Recording".
                  You'll have {formatTime(timeLimit)} to answer.
                </p>
              </div>
            )}

            <Progress value={(timeRemaining / timeLimit) * 100} />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleCamera}
                className="relative"
              >
                {isCameraOn ? <Camera /> : <CameraOff />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMic}
                className="relative"
              >
                {isMicOn ? <Mic /> : <MicOff />}
              </Button>
            </div>

            <div className="flex gap-2">
              {!isRecording ? (
                <>
                  <Button
                    onClick={startRecording}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Start Recording
                  </Button>
                  <Button
                    variant="outline"
                    onClick={restartPreparation}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </>
              ) : (
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                >
                  Stop Recording
                </Button>
              )}
              <Button
                variant="outline"
                onClick={onNext}
              >
                Next Question
              </Button>
            </div>
          </div>

          {transcriptText && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Live Transcript</h4>
              <div className="bg-secondary/20 p-4 rounded-lg">
                <p className="text-sm">{transcriptText}</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};
