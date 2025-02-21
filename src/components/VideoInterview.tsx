
import { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Video, Mic, MicOff, Camera, CameraOff } from 'lucide-react';
import { Question } from '@/types/interview';

interface VideoInterviewProps {
  question: Question;
  onComplete: (recordingUrl: string) => void;
  onNext: () => void;
}

export const VideoInterview = ({ question, onComplete, onNext }: VideoInterviewProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    initializeMedia();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
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
        description: "Unable to access camera or microphone",
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
      
      // Automatically stop recording after 5 minutes
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          stopRecording();
        }
      }, 5 * 60 * 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">{question.text}</h3>
        <p className="text-muted-foreground">{question.category}</p>
      </div>

      <div className="flex justify-between items-center">
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

        <div className="flex gap-2">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Start Recording
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              variant="destructive"
            >
              Stop Recording
            </Button>
          )}
          <Button
            onClick={onNext}
            variant="outline"
          >
            Next Question
          </Button>
        </div>
      </div>
    </Card>
  );
};
