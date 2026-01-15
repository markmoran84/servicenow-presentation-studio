import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Video, Loader2, StopCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import html2canvas from "html2canvas";

interface GifRecorderProps {
  targetRef: React.RefObject<HTMLElement>;
  duration?: number; // Total recording duration in ms
  frameRate?: number; // Frames per second
  fileName?: string;
}

const GifRecorder = ({ 
  targetRef, 
  duration = 12000, // Default 12 seconds (covers full animation cycle)
  frameRate = 10,
  fileName = "animation"
}: GifRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transparentBg, setTransparentBg] = useState(false);
  const framesRef = useRef<string[]>([]);
  const recordingRef = useRef(false);

  const captureFrame = useCallback(async (): Promise<string | null> => {
    if (!targetRef.current) return null;
    
    try {
      const canvas = await html2canvas(targetRef.current, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: transparentBg ? null : "#0a1525",
        logging: false,
      });
      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Frame capture error:", error);
      return null;
    }
  }, [targetRef, transparentBg]);

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
        transparent: transparentBg ? 0x000000 : null,
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
  }, [targetRef, frameRate, transparentBg]);

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
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Switch 
          id="transparent-bg" 
          checked={transparentBg} 
          onCheckedChange={setTransparentBg}
          disabled={isRecording || isProcessing}
        />
        <Label htmlFor="transparent-bg" className="text-xs text-gray-300">
          Transparent BG
        </Label>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={startRecording}
        className="bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30"
      >
        <Video className="w-4 h-4 mr-2" />
        Record as GIF
      </Button>
    </div>
  );
};

export default GifRecorder;
