
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
        const newTime = timeRemaining - 1;
        if (newTime <= 0) {
          onTimeUp();
          setTimeRemaining(0);
        } else {
          setTimeRemaining(newTime);
        }
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
