
import { useEffect, useRef } from 'react';

interface TimerProps {
  isActive: boolean;
  timeRemaining: number;
  setTimeRemaining: (time: number) => void;
  onTimeUp: () => void;
}

export const Timer = ({ isActive, timeRemaining, setTimeRemaining, onTimeUp }: TimerProps) => {
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, timeRemaining, onTimeUp, setTimeRemaining]);

  return null;
};
