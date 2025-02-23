
import { useEffect, useRef } from 'react';

interface SpeechRecognitionProps {
  isRecording: boolean;
  onTranscriptionUpdate: (text: string) => void;
}

export const SpeechRecognition = ({ isRecording, onTranscriptionUpdate }: SpeechRecognitionProps) => {
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          onTranscriptionUpdate(prev => prev + ' ' + finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscriptionUpdate]);

  useEffect(() => {
    if (recognitionRef.current) {
      if (isRecording) {
        recognitionRef.current.start();
      } else {
        recognitionRef.current.stop();
      }
    }
  }, [isRecording]);

  return null;
};
