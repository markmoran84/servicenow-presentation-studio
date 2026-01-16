import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnnualReportAnalyzer } from "@/components/AnnualReportAnalyzer";
import { PowerPointAnalyzer } from "@/components/PowerPointAnalyzer";
import { toast } from "sonner";
import { 
  FileText, 
  Presentation, 
  ArrowRight,
  SkipForward
} from "lucide-react";

interface AIImportStepProps {
  onNext: () => void;
  onSkip: () => void;
  onAcceptImprovedSlides?: () => void;
}

export function AIImportStep({ onNext, onSkip, onAcceptImprovedSlides }: AIImportStepProps) {
  const [activeTab, setActiveTab] = useState<string>("annual-report");
  const [hasImported, setHasImported] = useState(false);

  const handleDataExtracted = async () => {
    setHasImported(true);
    toast.success("Data extracted! Review and continue to the next step.");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-3">Import Your Data</h2>
        <p className="text-lg text-muted-foreground">
          Upload documents and let AI extract account information automatically. 
          You can import from multiple sources.
        </p>
      </div>

      {/* Import Options */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 max-w-md mx-auto mb-8">
          <TabsTrigger value="annual-report" className="gap-2">
            <FileText className="w-4 h-4" />
            Annual Report
          </TabsTrigger>
          <TabsTrigger value="presentation" className="gap-2">
            <Presentation className="w-4 h-4" />
            PowerPoint
          </TabsTrigger>
        </TabsList>

        <TabsContent value="annual-report" className="mt-0">
          <AnnualReportAnalyzer 
            onGeneratePlan={handleDataExtracted}
          />
        </TabsContent>

        <TabsContent value="presentation" className="mt-0">
          <PowerPointAnalyzer 
            onGenerateTalkingNotes={() => {
              toast.info("Navigate to any slide and click 'Notes' to generate talking notes");
            }}
            onAcceptChanges={() => {
              onAcceptImprovedSlides?.();
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4 pt-4">
        {hasImported ? (
          <Button onClick={onNext} size="lg" className="gap-2">
            Continue with Imported Data
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            onClick={onSkip}
            className="gap-2 text-muted-foreground"
          >
            <SkipForward className="w-4 h-4" />
            Skip - I'll enter data manually
          </Button>
        )}
      </div>
    </div>
  );
}
