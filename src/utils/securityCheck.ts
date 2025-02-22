
import { toast } from "@/components/ui/use-toast";

export const setupSecurityMonitoring = (
  mediaStream: MediaStream,
  isRecording: boolean,
  setIsAnalyzing: (analyzing: boolean) => void,
  onViolation: (reason: string) => void
) => {
  const videoTrack = mediaStream.getVideoTracks()[0];

  const checkSecurity = async () => {
    if (!isRecording) return;

    setIsAnalyzing(true);
    try {
      await Promise.all([
        checkFaces(videoTrack, onViolation),
        checkVoices(mediaStream, onViolation)
      ]);
    } catch (error) {
      console.error('Security check error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const interval = setInterval(checkSecurity, 5000);
  return interval;
};

const checkFaces = async (
  videoTrack: MediaStreamTrack,
  onViolation: (reason: string) => void
) => {
  const imageCapture = new window.ImageCapture(videoTrack);
  const bitmap = await imageCapture.grabFrame();
  
  if ('FaceDetector' in window) {
    const faceDetector = new window.FaceDetector();
    const faces = await faceDetector.detect(bitmap);
    
    if (faces.length > 1) {
      onViolation('Multiple faces detected');
    }
  }
};

const checkVoices = async (
  mediaStream: MediaStream,
  onViolation: (reason: string) => void
) => {
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
    onViolation('Multiple voices detected');
  }
};
