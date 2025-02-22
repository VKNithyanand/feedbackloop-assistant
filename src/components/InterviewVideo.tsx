
import { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Mic, MicOff } from 'lucide-react';

interface InterviewVideoProps {
  stream: MediaStream | null;
  isRecording: boolean;
  isCameraOn: boolean;
  isMicOn: boolean;
  timeRemaining: number;
  onToggleCamera: () => void;
  onToggleMic: () => void;
}

export const InterviewVideo = ({
  stream,
  isRecording,
  isCameraOn,
  isMicOn,
  timeRemaining,
  onToggleCamera,
  onToggleMic
}: InterviewVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
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
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleCamera}
        >
          {isCameraOn ? <Camera /> : <CameraOff />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleMic}
        >
          {isMicOn ? <Mic /> : <MicOff />}
        </Button>
      </div>
    </div>
  );
};
