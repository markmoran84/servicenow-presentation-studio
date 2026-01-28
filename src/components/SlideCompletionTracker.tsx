import { useAccountData } from "@/context/AccountDataContext";
import { useSlideCompletion, CompletionStatus } from "@/hooks/useSlideCompletion";
import { CheckCircle2, AlertCircle, Circle, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface SlideCompletionTrackerProps {
  onNavigateToSlide?: (slideNumber: number) => void;
  onFillWithAI?: (slideId: string, missingFields: string[]) => void;
  compact?: boolean;
}

const StatusIcon = ({ status }: { status: CompletionStatus }) => {
  switch (status) {
    case "complete":
      return <CheckCircle2 className="w-4 h-4 text-primary" />;
    case "partial":
      return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    case "empty":
      return <Circle className="w-4 h-4 text-muted-foreground" />;
  }
};

const StatusBadge = ({ status }: { status: CompletionStatus }) => {
  const styles = {
    complete: "bg-primary/20 text-primary border-primary/30",
    partial: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    empty: "bg-muted text-muted-foreground border-border",
  };
  
  const labels = {
    complete: "Complete",
    partial: "Partial",
    empty: "Empty",
  };
  
  return (
    <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", styles[status])}>
      {labels[status]}
    </span>
  );
};

export const SlideCompletionTracker = ({ 
  onNavigateToSlide, 
  onFillWithAI,
  compact = false 
}: SlideCompletionTrackerProps) => {
  const { data } = useAccountData();
  const completion = useSlideCompletion(data);
  const [isExpanded, setIsExpanded] = useState(!compact);

  if (compact) {
    return (
      <div className="glass-card p-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${completion.overallPercentage} 100`}
                  className="text-primary"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                {completion.overallPercentage}%
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Slide Completion</p>
              <p className="text-xs text-muted-foreground">
                {completion.totalComplete} complete • {completion.totalPartial} partial • {completion.totalEmpty} empty
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        
        {isExpanded && (
          <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto">
            {completion.slides.map((slide) => (
              <div 
                key={slide.slideId}
                className="flex items-center justify-between p-2 rounded-lg bg-background/50 hover:bg-background/80 cursor-pointer transition-colors"
                onClick={() => onNavigateToSlide?.(slide.slideNumber + 2)} // +2 for Input Form and Cover
              >
                <div className="flex items-center gap-2">
                  <StatusIcon status={slide.status} />
                  <span className="text-sm text-foreground">{slide.slideName}</span>
                </div>
                <div className="flex items-center gap-2">
                  {slide.missingRequiredFields.length > 0 && onFillWithAI && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onFillWithAI(slide.slideId, slide.missingFields.map(f => f.path));
                      }}
                      className="p-1 rounded hover:bg-primary/20 transition-colors"
                      title="Fill with AI"
                    >
                      <Sparkles className="w-3 h-3 text-primary" />
                    </button>
                  )}
                  <span className="text-xs text-muted-foreground">{slide.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground">Presentation Completion</h3>
          <StatusBadge status={completion.overallStatus} />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold text-primary">{completion.overallPercentage}%</span>
          </div>
          <Progress value={completion.overallPercentage} className="h-2" />
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 rounded-lg bg-primary/10">
            <p className="text-2xl font-bold text-primary">{completion.totalComplete}</p>
            <p className="text-xs text-muted-foreground">Complete</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-yellow-500/10">
            <p className="text-2xl font-bold text-yellow-400">{completion.totalPartial}</p>
            <p className="text-xs text-muted-foreground">Partial</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted">
            <p className="text-2xl font-bold text-muted-foreground">{completion.totalEmpty}</p>
            <p className="text-xs text-muted-foreground">Empty</p>
          </div>
        </div>
      </div>
      
      {/* Per-Slide Status */}
      <div className="glass-card p-5">
        <h3 className="font-bold text-foreground mb-4">Slide Status</h3>
        <div className="space-y-2">
          {completion.slides.map((slide) => (
            <div 
              key={slide.slideId}
              className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 cursor-pointer transition-colors group"
              onClick={() => onNavigateToSlide?.(slide.slideNumber + 2)}
            >
              <div className="flex items-center gap-3">
                <StatusIcon status={slide.status} />
                <div>
                  <p className="text-sm font-medium text-foreground">{slide.slideName}</p>
                  {slide.missingRequiredFields.length > 0 && (
                    <p className="text-xs text-destructive">
                      {slide.missingRequiredFields.length} required field{slide.missingRequiredFields.length > 1 ? 's' : ''} missing
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {slide.status !== "complete" && onFillWithAI && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFillWithAI(slide.slideId, slide.missingFields.map(f => f.path));
                    }}
                    className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2 py-1 rounded bg-primary/20 text-primary text-xs transition-opacity"
                  >
                    <Sparkles className="w-3 h-3" />
                    Fill with AI
                  </button>
                )}
                <div className="w-16">
                  <Progress value={slide.percentage} className="h-1.5" />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">{slide.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
