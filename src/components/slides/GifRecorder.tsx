import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Video, Loader2, StopCircle } from "lucide-react";
import html2canvas from "html2canvas";

interface GifRecorderProps {
  targetRef: React.RefObject<HTMLElement>;
  frameContainerRef?: React.RefObject<HTMLElement>; // Used to composite the parent background into the recording
  backgroundImage?: string; // Same image used by the slide background
  duration?: number; // Total recording duration in ms
  frameRate?: number; // Frames per second
  fileName?: string;
}

const GifRecorder = ({
  targetRef,
  frameContainerRef,
  backgroundImage,
  duration = 12000, // Default 12 seconds (covers full animation cycle)
  frameRate = 10,
  fileName = "animation",
}: GifRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const framesRef = useRef<string[]>([]);
  const recordingRef = useRef(false);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const bgImagePromiseRef = useRef<Promise<HTMLImageElement> | null>(null);

  const getBackgroundImage = useCallback(async () => {
    if (!backgroundImage) return null;

    if (bgImageRef.current) return bgImageRef.current;

    if (!bgImagePromiseRef.current) {
      bgImagePromiseRef.current = new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          bgImageRef.current = img;
          resolve(img);
        };
        img.onerror = () => reject(new Error("Failed to load background image"));
        img.src = backgroundImage;
      });
    }

    return bgImagePromiseRef.current;
  }, [backgroundImage]);

  const captureFrame = useCallback(async (): Promise<string | null> => {
    if (!targetRef.current) return null;

    try {
      const targetEl = targetRef.current;

      // Capture ONLY the wheel with high resolution for crisp output
      const wheelCanvas = await html2canvas(targetEl, {
        scale: 4, // 4x resolution for maximum sharpness
        useCORS: true,
        allowTaint: true,
        backgroundColor: null, // Transparent background
        logging: false,
      });

      // Create output canvas with white background for GIF (GIF doesn't support alpha)
      const out = document.createElement("canvas");
      out.width = wheelCanvas.width;
      out.height = wheelCanvas.height;
      const ctx = out.getContext("2d");
      
      if (ctx) {
        // Fill with white background so there's no black
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, out.width, out.height);
        // Draw the wheel on top
        ctx.drawImage(wheelCanvas, 0, 0);
        return out.toDataURL("image/png");
      }

      return wheelCanvas.toDataURL("image/png");
    } catch (error) {
      console.error("Frame capture error:", error);
      return null;
    }
  }, [targetRef]);

  const createGif = useCallback(
    async (frames: string[]) => {
      // Dynamically import GIF.js
      const GIF = (await import("gif.js")).default;

      // Fetch the worker script and create a blob URL to avoid CORS issues
      const workerResponse = await fetch(
        "https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js"
      );
      const workerBlob = new Blob([await workerResponse.text()], {
        type: "application/javascript",
      });
      const workerUrl = URL.createObjectURL(workerBlob);

      const loadImage = (src: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("Failed to load frame image"));
          img.src = src;
        });

      const firstImg = await loadImage(frames[0]);

      return new Promise<Blob>((resolve, reject) => {
        const gif = new GIF({
          workers: 2,
          quality: 10,
          width: firstImg.width,
          height: firstImg.height,
          workerScript: workerUrl,
        });

        let loadedFrames = 0;

        const handleFrameLoaded = (img: HTMLImageElement) => {
          gif.addFrame(img, { delay: 1000 / frameRate });
          loadedFrames++;
          setProgress(Math.round((loadedFrames / frames.length) * 50) + 50);

          if (loadedFrames === frames.length) {
            gif.render();
          }
        };

        // Add first frame immediately
        handleFrameLoaded(firstImg);

        // Load + add remaining frames
        frames.slice(1).forEach((frameData) => {
          loadImage(frameData)
            .then(handleFrameLoaded)
            .catch(() => {
              loadedFrames++;
              if (loadedFrames === frames.length) gif.render();
            });
        });

        gif.on("finished", (blob: Blob) => {
          URL.revokeObjectURL(workerUrl);
          resolve(blob);
        });

        gif.on("error", (error: Error) => {
          URL.revokeObjectURL(workerUrl);
          reject(error);
        });
      });
    },
    [frameRate]
  );

  const startRecording = useCallback(async () => {
    if (!targetRef.current) return;
    
    setIsRecording(true);
    recordingRef.current = true;
    framesRef.current = [];
    setProgress(0);

    const frameInterval = 1000 / frameRate;
    const totalFrames = Math.ceil(duration / frameInterval);
    let capturedFrames = 0;

    const captureLoop = async () => {
      if (!recordingRef.current || capturedFrames >= totalFrames) {
        // Recording complete, process frames
        setIsRecording(false);
        setIsProcessing(true);
        
        try {
          const blob = await createGif(framesRef.current);
          
          // Download the GIF
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${fileName}.gif`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("GIF creation error:", error);
        }
        
        setIsProcessing(false);
        setProgress(0);
        return;
      }

      const frame = await captureFrame();
      if (frame) {
        framesRef.current.push(frame);
        capturedFrames++;
        setProgress(Math.round((capturedFrames / totalFrames) * 50));
      }

      setTimeout(captureLoop, frameInterval);
    };

    captureLoop();
  }, [targetRef, duration, frameRate, fileName, captureFrame, createGif]);

  const stopRecording = useCallback(() => {
    recordingRef.current = false;
  }, []);

  if (isProcessing) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        disabled
        className="bg-amber-500/20 border-amber-500/50 text-amber-300"
      >
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Creating GIF... {progress}%
      </Button>
    );
  }

  if (isRecording) {
    return (
      <Button 
        variant="outline" 
        size="sm"
        onClick={stopRecording}
        className="bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30"
      >
        <StopCircle className="w-4 h-4 mr-2 animate-pulse" />
        Recording... {progress}% (Click to stop)
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={startRecording}
      className="bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30"
    >
      <Video className="w-4 h-4 mr-2" />
      Record as GIF
    </Button>
  );
};

export default GifRecorder;
