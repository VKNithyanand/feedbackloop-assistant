
import { useEffect, useRef, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { setupSecurityMonitoring } from '@/utils/securityCheck';

interface SecurityMonitorProps {
  stream: MediaStream | null;
  isRecording: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  onViolation: (count: number) => void;
}

export const SecurityMonitor = ({ 
  stream, 
  isRecording, 
  setIsAnalyzing, 
  onViolation 
}: SecurityMonitorProps) => {
  const { toast } = useToast();
  const securityCheckIntervalRef = useRef<NodeJS.Timeout>();
  const [violationCount, setViolationCount] = useState(0);

  useEffect(() => {
    if (stream) {
      securityCheckIntervalRef.current = setupSecurityMonitoring(
        stream,
        isRecording,
        setIsAnalyzing,
        (reason: string) => {
          const newCount = violationCount + 1;
          setViolationCount(newCount);
          onViolation(newCount);
          toast({
            variant: "destructive",
            title: "Security Warning",
            description: `${reason}. Warning ${newCount}/3`,
          });
        }
      );
    }

    return () => {
      if (securityCheckIntervalRef.current) {
        clearInterval(securityCheckIntervalRef.current);
      }
    };
  }, [stream, isRecording, setIsAnalyzing, onViolation, toast, violationCount]);

  return null;
};
