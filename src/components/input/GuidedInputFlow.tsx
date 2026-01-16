import { useState, useMemo } from "react";
import { useAccountData } from "@/context/AccountDataContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Upload, 
  FileText, 
  Presentation,
  CheckCircle2,
  Circle,
  Loader2,
  Building2,
  Target,
  Users,
  Zap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Import step components
import { StartStep } from "./steps/StartStep";
import { AIImportStep } from "./steps/AIImportStep";
import { CompanyBasicsStep } from "./steps/CompanyBasicsStep";
import { StrategyStep } from "./steps/StrategyStep";
import { TeamStep } from "./steps/TeamStep";
import { ReviewStep } from "./steps/ReviewStep";

interface GuidedInputFlowProps {
  onGenerate?: () => void;
  onAcceptImprovedSlides?: () => void;
}

type StepId = 'start' | 'import' | 'basics' | 'strategy' | 'team' | 'review';

interface Step {
  id: StepId;
  title: string;
  description: string;
  icon: React.ElementType;
  optional?: boolean;
}

const STEPS: Step[] = [
  { 
    id: 'start', 
    title: 'Get Started', 
    description: 'Choose how to create your plan',
    icon: Sparkles 
  },
  { 
    id: 'import', 
    title: 'Import Data', 
    description: 'Upload documents or enter manually',
    icon: Upload,
    optional: true
  },
  { 
    id: 'basics', 
    title: 'Company Info', 
    description: 'Basic account details',
    icon: Building2 
  },
  { 
    id: 'strategy', 
    title: 'Strategy', 
    description: 'Goals, opportunities & challenges',
    icon: Target 
  },
  { 
    id: 'team', 
    title: 'Team & Execs', 
    description: 'Key stakeholders',
    icon: Users,
    optional: true
  },
  { 
    id: 'review', 
    title: 'Generate', 
    description: 'Review and create your plan',
    icon: Zap 
  },
];

export function GuidedInputFlow({ onGenerate, onAcceptImprovedSlides }: GuidedInputFlowProps) {
  const { data, setGeneratedPlan } = useAccountData();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());

  const currentStep = STEPS[currentStepIndex];
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const canProceed = useMemo(() => {
    switch (currentStep.id) {
      case 'start':
        return true;
      case 'import':
        return true; // Optional step
      case 'basics':
        return data.basics.accountName.trim().length > 0;
      case 'strategy':
        return true; // Can be filled by AI
      case 'team':
        return true; // Optional
      case 'review':
        return data.basics.accountName.trim().length > 0;
      default:
        return true;
    }
  }, [currentStep.id, data]);

  const goToStep = (index: number) => {
    if (index >= 0 && index < STEPS.length) {
      // Mark current step as completed when moving forward
      if (index > currentStepIndex) {
        setCompletedSteps(prev => new Set(prev).add(currentStep.id));
      }
      setCurrentStepIndex(index);
    }
  };

  const goNext = () => goToStep(currentStepIndex + 1);
  const goBack = () => goToStep(currentStepIndex - 1);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      toast.loading("Generating your account plan with AI...", { id: "plan-gen" });
      
      const { data: responseData, error } = await supabase.functions.invoke("generate-account-plan", {
        body: { accountData: data }
      });

      if (error) throw error;
      if (!responseData?.success) throw new Error(responseData?.error || "Failed to generate plan");

      setGeneratedPlan(responseData.plan);
      toast.success("Account plan generated!", { id: "plan-gen" });
      onGenerate?.();
    } catch (error) {
      console.error("Plan generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate plan", { id: "plan-gen" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSkipToManual = () => {
    setCurrentStepIndex(2); // Jump to basics
  };

  const renderStepContent = () => {
    switch (currentStep.id) {
      case 'start':
        return (
          <StartStep 
            onStartFromScratch={handleSkipToManual}
            onImportData={goNext}
          />
        );
      case 'import':
        return (
          <AIImportStep 
            onNext={goNext}
            onSkip={goNext}
            onAcceptImprovedSlides={onAcceptImprovedSlides}
          />
        );
      case 'basics':
        return <CompanyBasicsStep />;
      case 'strategy':
        return <StrategyStep />;
      case 'team':
        return <TeamStep />;
      case 'review':
        return (
          <ReviewStep 
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress Header */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4">
          {/* Step indicators */}
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = completedSteps.has(step.id) || index < currentStepIndex;
              const isClickable = index <= currentStepIndex || isCompleted;
              
              return (
                <button
                  key={step.id}
                  onClick={() => isClickable && goToStep(index)}
                  disabled={!isClickable}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                    isActive && "bg-primary/10 text-primary",
                    !isActive && isCompleted && "text-primary/70 hover:bg-primary/5",
                    !isActive && !isCompleted && "text-muted-foreground",
                    isClickable && "cursor-pointer",
                    !isClickable && "cursor-not-allowed opacity-50"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    isActive && "bg-primary text-primary-foreground",
                    isCompleted && !isActive && "bg-primary/20 text-primary",
                    !isActive && !isCompleted && "bg-muted text-muted-foreground"
                  )}>
                    {isCompleted && !isActive ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground hidden lg:block">{step.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Progress bar */}
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 py-8 md:py-12 px-4 md:px-8 pb-32">
        <div className="max-w-4xl mx-auto">
          {renderStepContent()}
        </div>
      </div>

      {/* Bottom Navigation */}
      {currentStep.id !== 'start' && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-background/95 backdrop-blur-xl rounded-full px-6 py-3 border border-border/50 shadow-2xl">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={currentStepIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="w-px h-6 bg-border" />
          
          <span className="text-sm text-muted-foreground px-2">
            Step {currentStepIndex + 1} of {STEPS.length}
          </span>
          
          <div className="w-px h-6 bg-border" />

          {currentStep.id === 'review' ? (
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !canProceed}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Plan
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={goNext}
              disabled={!canProceed}
              className="gap-2"
            >
              {currentStep.optional ? 'Continue' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
