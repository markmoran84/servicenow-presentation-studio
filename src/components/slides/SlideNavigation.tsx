import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, Loader2, Camera, FileText } from "lucide-react";
import { exportToPowerPoint } from "@/utils/exportToPowerPoint";
import { captureElementAsImage, createPowerPointFromImages } from "@/utils/captureSlides";
import { useAccountData } from "@/context/AccountDataContext";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  slideLabels: string[];
  onExportStart?: () => void;
  onExportSlide?: (index: number) => Promise<void>;
  onExportEnd?: () => void;
  getSlideElement?: () => HTMLElement | null;
}

export const SlideNavigation = ({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  slideLabels,
  onExportStart,
  onExportSlide,
  onExportEnd,
  getSlideElement,
}: SlideNavigationProps) => {
  const { data } = useAccountData();
  const [isExporting, setIsExporting] = useState(false);
  const [exportMode, setExportMode] = useState<"shapes" | "images" | "pdf">("images");

  const handleExportImages = async () => {
    if (isExporting || !onExportSlide) return;

    setIsExporting(true);
    const toastId = toast.loading("Capturing slides as images…");

    try {
      onExportStart?.();
      
      const images: string[] = [];
      const exportableSlides = slideLabels.slice(1); // Skip input form
      
      // Iterate through all slides (skip index 0 which is input form)
      for (let i = 1; i < totalSlides; i++) {
        toast.loading(`Capturing slide ${i} of ${totalSlides - 1}…`, { id: toastId });
        
        // Navigate to slide and wait for render
        await onExportSlide(i);
        
        // Longer delay to ensure full render with styles
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Capture the slide element
        const element = getSlideElement?.();
        if (element) {
          try {
            const imageData = await captureElementAsImage(element);
            images.push(imageData);
            console.log(`Captured slide ${i}: ${imageData.length} bytes`);
          } catch (err) {
            console.error(`Failed to capture slide ${i}:`, err);
            images.push("");
          }
        } else {
          console.error(`Slide element not found for slide ${i}`);
          images.push("");
        }
      }

      toast.loading("Generating PowerPoint…", { id: toastId });
      await createPowerPointFromImages(images, exportableSlides, data);
      
      toast.success("PowerPoint downloaded!", { id: toastId });
    } catch (err) {
      console.error("PowerPoint export failed:", err);
      toast.error("Export failed — check console for details.", { id: toastId });
    } finally {
      setIsExporting(false);
      onExportEnd?.();
    }
  };

  const handleExportShapes = async () => {
    if (isExporting) return;

    setIsExporting(true);
    const toastId = toast.loading("Generating PowerPoint…");

    try {
      await exportToPowerPoint(data);
      toast.success("PowerPoint downloaded.", { id: toastId });
    } catch (err) {
      console.error("PowerPoint export failed:", err);
      toast.error("Export failed — check console for details.", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (isExporting || !onExportSlide) return;

    setIsExporting(true);
    const toastId = toast.loading("Capturing slides for PDF…");

    try {
      onExportStart?.();
      
      const images: string[] = [];
      const exportableSlides = slideLabels.slice(1);
      
      for (let i = 1; i < totalSlides; i++) {
        toast.loading(`Capturing slide ${i} of ${totalSlides - 1}…`, { id: toastId });
        await onExportSlide(i);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const element = getSlideElement?.();
        if (element) {
          try {
            const imageData = await captureElementAsImage(element);
            images.push(imageData);
          } catch (err) {
            console.error(`Failed to capture slide ${i}:`, err);
            images.push("");
          }
        } else {
          images.push("");
        }
      }

      toast.loading("Generating PDF…", { id: toastId });
      
      // Create PDF in landscape 16:9 format
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "in",
        format: [10, 5.625], // 16:9 aspect ratio
      });

      images.forEach((imgData, index) => {
        if (index > 0) pdf.addPage([10, 5.625], "landscape");
        if (imgData) {
          pdf.addImage(imgData, "PNG", 0, 0, 10, 5.625);
        }
      });

      const accountName = data.basics.accountName || "Account";
      pdf.save(`${accountName}_Account_Plan.pdf`);
      
      toast.success("PDF downloaded!", { id: toastId });
    } catch (err) {
      console.error("PDF export failed:", err);
      toast.error("Export failed — check console for details.", { id: toastId });
    } finally {
      setIsExporting(false);
      onExportEnd?.();
    }
  };

  const handleExport = () => {
    if (exportMode === "pdf" && onExportSlide) {
      handleExportPDF();
    } else if (exportMode === "images" && onExportSlide) {
      handleExportImages();
    } else {
      handleExportShapes();
    }
  };

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-sn-navy/90 backdrop-blur-md rounded-full px-6 py-3 shadow-2xl border border-white/10">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevious}
        disabled={currentSlide === 0 || isExporting}
        className="text-white hover:bg-white/10 disabled:opacity-30"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <div className="flex items-center gap-2">
        {slideLabels.map((label, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-primary"
                : "w-2 bg-white/30 hover:bg-white/50"
            }`}
            title={label}
          />
        ))}
      </div>

      <div className="text-white/70 text-sm font-medium min-w-[100px] text-center">
        {isExporting ? "Exporting…" : slideLabels[currentSlide]}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        disabled={currentSlide === totalSlides - 1 || isExporting}
        className="text-white hover:bg-white/10 disabled:opacity-30"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>

      <div className="w-px h-6 bg-white/20 mx-2" />

      {/* Export mode toggle */}
      <div className="flex items-center gap-1 bg-white/10 rounded-full p-0.5">
        <button
          onClick={() => setExportMode("images")}
          disabled={isExporting}
          className={`px-2 py-1 rounded-full text-xs transition-all ${
            exportMode === "images"
              ? "bg-primary text-white"
              : "text-white/60 hover:text-white"
          }`}
          title="Pixel-perfect PowerPoint (as images)"
        >
          <Camera className="w-3 h-3" />
        </button>
        <button
          onClick={() => setExportMode("shapes")}
          disabled={isExporting}
          className={`px-2 py-1 rounded-full text-xs transition-all ${
            exportMode === "shapes"
              ? "bg-primary text-white"
              : "text-white/60 hover:text-white"
          }`}
          title="Editable PowerPoint (shapes/text)"
        >
          Edit
        </button>
        <button
          onClick={() => setExportMode("pdf")}
          disabled={isExporting}
          className={`px-2 py-1 rounded-full text-xs transition-all ${
            exportMode === "pdf"
              ? "bg-primary text-white"
              : "text-white/60 hover:text-white"
          }`}
          title="Export as PDF"
        >
          <FileText className="w-3 h-3" />
        </button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleExport}
        disabled={isExporting}
        className="text-white hover:bg-white/10 gap-2 disabled:opacity-60"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Exporting…
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Export
          </>
        )}
      </Button>
    </div>
  );
};
