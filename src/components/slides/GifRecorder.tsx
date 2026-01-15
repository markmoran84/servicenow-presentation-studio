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
      const canvas = await html2canvas(targetRef.current, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      // If we have a slide background image + container, bake the matching background INTO the frame.
      // This avoids black fills in GIFs (GIF doesn't support full alpha transparency).
      if (backgroundImage && frameContainerRef?.current) {
        const bgImg = await getBackgroundImage();
        if (bgImg) {
          const slideRect = frameContainerRef.current.getBoundingClientRect();
          const targetRect = targetRef.current.getBoundingClientRect();

          const containerW = slideRect.width;
          const containerH = slideRect.height;
          const imgW = bgImg.naturalWidth || bgImg.width;
          const imgH = bgImg.naturalHeight || bgImg.height;

          // Replicate CSS: background-size: cover; background-position: center
          const coverScale = Math.max(containerW / imgW, containerH / imgH);
          const drawnW = imgW * coverScale;
          const drawnH = imgH * coverScale;
          const offsetX = (containerW - drawnW) / 2;
          const offsetY = (containerH - drawnH) / 2;

          const tx = targetRect.left - slideRect.left;
          const ty = targetRect.top - slideRect.top;

          const ratioX = canvas.width / targetRect.width;
          const ratioY = canvas.height / targetRect.height;

          const out = document.createElement("canvas");
          out.width = canvas.width;
          out.height = canvas.height;

          const ctx = out.getContext("2d");
          if (ctx) {
            ctx.drawImage(
              bgImg,
              (offsetX - tx) * ratioX,
              (offsetY - ty) * ratioY,
              drawnW * ratioX,
              drawnH * ratioY
            );
            ctx.drawImage(canvas, 0, 0);
            return out.toDataURL("image/png");
          }
        }
      }

      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Frame capture error:", error);
      return null;
    }
  }, [targetRef, backgroundImage, frameContainerRef, getBackgroundImage]);

  const createGif = useCallback(async (frames: string[]) => {
    // Dynamically import GIF.js
    const GIF = (await import("gif.js")).default;
    
    // Fetch the worker script and create a blob URL to avoid CORS issues
    const workerResponse = await fetch("https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js");
    const workerBlob = new Blob([await workerResponse.text()], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(workerBlob);
    
    return new Promise<Blob>((resolve, reject) => {
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: targetRef.current?.offsetWidth || 600,
        height: targetRef.current?.offsetHeight || 600,
        workerScript: workerUrl,
      });

      let loadedFrames = 0;
      
      frames.forEach((frameData) => {
        const img = new Image();
        img.onload = () => {
          gif.addFrame(img, { delay: 1000 / frameRate });
          loadedFrames++;
          setProgress(Math.round((loadedFrames / frames.length) * 50) + 50);
          
          if (loadedFrames === frames.length) {
            gif.render();
          }
        };
        img.onerror = () => {
          loadedFrames++;
          if (loadedFrames === frames.length) {
            gif.render();
          }
        };
        img.src = frameData;
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
  }, [targetRef, frameRate]);

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
