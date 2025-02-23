
import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (stream) {
      securityCheckIntervalRef.current = setupSecurityMonitoring(
        stream,
        isRecording,
        setIsAnalyzing,
        (reason: string) => {
          onViolation((prev: number) => {
            const newCount = prev + 1;
            toast({
              variant: "destructive",
              title: "Security Warning",
              description: `${reason}. Warning ${newCount}/3`,
            });
            return newCount;
          });
        }
      );
    }

    return () => {
      if (securityCheckIntervalRef.current) {
        clearInterval(securityCheckIntervalRef.current);
      }
    };
  }, [stream, isRecording, setIsAnalyzing, onViolation, toast]);

  return null;
};
