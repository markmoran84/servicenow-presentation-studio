import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  slideLabels: string[];
}

export const SlideNavigation = ({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  slideLabels,
}: SlideNavigationProps) => {
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-sn-navy/90 backdrop-blur-md rounded-full px-6 py-3 shadow-2xl border border-white/10">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevious}
        disabled={currentSlide === 0}
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
        {slideLabels[currentSlide]}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        disabled={currentSlide === totalSlides - 1}
        className="text-white hover:bg-white/10 disabled:opacity-30"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
};
