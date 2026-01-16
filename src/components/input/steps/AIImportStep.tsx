import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnnualReportAnalyzer } from "@/components/AnnualReportAnalyzer";
import { PowerPointAnalyzer } from "@/components/PowerPointAnalyzer";
import { toast } from "sonner";
import { 
  FileText, 
  Presentation, 
  ArrowRight,
  SkipForward,
  Search,
  PlusCircle,
  ArrowLeft,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

type ImportMode = null | "analyze-existing" | "create-from-annual" | "create-from-ppt";

interface AIImportStepProps {
  onNext: () => void;
  onSkip: () => void;
  onAcceptImprovedSlides?: () => void;
}

const modeOptions = [
  {
    id: "analyze-existing" as const,
    icon: Search,
    title: "Analyze Existing Presentation",
    description: "Upload a PowerPoint to get AI feedback, talking notes, and improvement suggestions",
    badge: "Review & Improve",
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    iconColor: "text-blue-500"
  },
  {
    id: "create-from-annual" as const,
    icon: FileText,
    title: "Create from Annual Report",
    description: "Upload an annual report (PDF, text, or URL) to generate a complete account plan",
    badge: "Generate New",
    color: "from-emerald-500/20 to-green-500/20 border-emerald-500/30",
    iconColor: "text-emerald-500"
  },
  {
    id: "create-from-ppt" as const,
    icon: Presentation,
    title: "Create from Existing Account Plan",
    description: "Upload an existing account plan PowerPoint to extract data and enhance it",
    badge: "Extract & Enhance",
    color: "from-purple-500/20 to-violet-500/20 border-purple-500/30",
    iconColor: "text-purple-500"
  }
];

export function AIImportStep({ onNext, onSkip, onAcceptImprovedSlides }: AIImportStepProps) {
  const [selectedMode, setSelectedMode] = useState<ImportMode>(null);
  const [hasImported, setHasImported] = useState(false);

  const handleDataExtracted = async () => {
    setHasImported(true);
    toast.success("Data extracted! Review and continue to the next step.");
  };

  const handleBack = () => {
    setSelectedMode(null);
    setHasImported(false);
  };

  // Mode selection view
  if (!selectedMode) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">What would you like to do?</h2>
          <p className="text-lg text-muted-foreground">
            Choose how you'd like to work with AI to create or improve your account plan
          </p>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid gap-4 max-w-3xl mx-auto">
          {modeOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card
                key={option.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg",
                  "border-2 bg-gradient-to-br",
                  option.color
                )}
                onClick={() => setSelectedMode(option.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "p-3 rounded-xl bg-background/50 backdrop-blur",
                      option.iconColor
                    )}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{option.title}</CardTitle>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-background/50 text-muted-foreground font-medium">
                          {option.badge}
                        </span>
                      </div>
                      <CardDescription className="text-sm">
                        {option.description}
                      </CardDescription>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground mt-1" />
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Skip Option */}
        <div className="flex items-center justify-center pt-4">
          <Button 
            variant="ghost" 
            onClick={onSkip}
            className="gap-2 text-muted-foreground"
          >
            <SkipForward className="w-4 h-4" />
            Skip - I'll enter data manually
          </Button>
        </div>
      </div>
    );
  }

  // Get current mode info
  const currentMode = modeOptions.find(m => m.id === selectedMode)!;

  return (
    <div className="space-y-6">
      {/* Back button and header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleBack}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg bg-gradient-to-br",
            currentMode.color
          )}>
            <currentMode.icon className={cn("w-5 h-5", currentMode.iconColor)} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{currentMode.title}</h2>
            <p className="text-sm text-muted-foreground">{currentMode.description}</p>
          </div>
        </div>
      </div>

      {/* Content based on mode */}
      <div className="mt-6">
        {selectedMode === "analyze-existing" && (
          <PowerPointAnalyzer 
            onGenerateTalkingNotes={() => {
              toast.info("Navigate to any slide and click 'Notes' to generate talking notes");
            }}
            onAcceptChanges={() => {
              setHasImported(true);
              onAcceptImprovedSlides?.();
            }}
          />
        )}

        {selectedMode === "create-from-annual" && (
          <AnnualReportAnalyzer 
            onGeneratePlan={handleDataExtracted}
          />
        )}

        {selectedMode === "create-from-ppt" && (
          <div className="space-y-4">
            <Card className="border-dashed border-2 bg-muted/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">How this works:</p>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Upload your existing account plan PowerPoint</li>
                      <li>AI will extract all relevant data (company info, strategy, etc.)</li>
                      <li>Review and edit the extracted information</li>
                      <li>Generate an enhanced, improved version</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
            <PowerPointAnalyzer 
              onGenerateTalkingNotes={() => {
                toast.info("Navigate to any slide and click 'Notes' to generate talking notes");
              }}
              onAcceptChanges={() => {
                setHasImported(true);
                onAcceptImprovedSlides?.();
              }}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Choose Different Option
        </Button>
        
        {hasImported && (
          <Button onClick={onNext} size="lg" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Continue with Imported Data
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
