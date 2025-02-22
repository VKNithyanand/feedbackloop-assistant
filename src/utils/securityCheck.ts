
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
        checkVoices(mediaStream, onViolation),
        checkGaze(videoTrack, onViolation),
        checkEnvironment(videoTrack, onViolation)
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
    
    if (faces.length === 0) {
      onViolation('No face detected');
    } else if (faces.length > 1) {
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
  let backgroundNoise = false;
  
  for (let i = 0; i < bufferLength; i++) {
    // Check for distinct voice patterns
    if (dataArray[i] > 200 && i - lastPeak > 100) {
      voiceCount++;
      lastPeak = i;
    }
    
    // Check for sustained background noise
    if (dataArray[i] > 150 && dataArray[i] < 180) {
      backgroundNoise = true;
    }
  }
  
  if (voiceCount > 1) {
    onViolation('Multiple voices detected');
  }
  
  if (backgroundNoise) {
    onViolation('Suspicious background noise detected');
  }
};

// Basic gaze detection using face landmarks
const checkGaze = async (
  videoTrack: MediaStreamTrack,
  onViolation: (reason: string) => void
) => {
  const imageCapture = new window.ImageCapture(videoTrack);
  const bitmap = await imageCapture.grabFrame();
  
  if ('FaceDetector' in window) {
    const faceDetector = new window.FaceDetector({ maxDetectedFaces: 1 });
    const faces = await faceDetector.detect(bitmap);
    
    if (faces.length === 1) {
      const face = faces[0];
      const { boundingBox } = face;
      
      // Basic gaze direction check based on face position in frame
      if (boundingBox.x < 0.2 || boundingBox.x > 0.8) {
        onViolation('Candidate appears to be looking away from screen');
      }
    }
  }
};

// Basic environment check for movement and objects
const checkEnvironment = async (
  videoTrack: MediaStreamTrack,
  onViolation: (reason: string) => void
) => {
  const imageCapture = new window.ImageCapture(videoTrack);
  const bitmap = await imageCapture.grabFrame();
  
  // Analyze frame for sudden movements or changes
  // This is a basic implementation that could be enhanced with more sophisticated computer vision
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(bitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let changes = 0;
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (brightness > 240 || brightness < 15) {
        changes++;
      }
    }
    
    if (changes > (data.length / 4) * 0.4) {
      onViolation('Suspicious movement or object detected in environment');
    }
  }
};
