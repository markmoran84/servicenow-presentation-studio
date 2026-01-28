import { useState } from "react";
import { useAccountData } from "@/context/AccountDataContext";
import { SlideField, getNestedValue, slideRequirements } from "@/hooks/useSlideCompletion";
import { SmartFieldInput } from "@/components/SmartFieldInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sparkles, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MissingFieldsPromptProps {
  slideId: string;
  missingFields: SlideField[];
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const MissingFieldsPrompt = ({
  slideId,
  missingFields,
  isOpen,
  onClose,
  onComplete,
}: MissingFieldsPromptProps) => {
  const { data, updateData } = useAccountData();
  const [isFillingAll, setIsFillingAll] = useState(false);
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  
  const slideReq = slideRequirements.find(r => r.slideId === slideId);
  
  const handleFieldChange = (field: SlideField, value: any) => {
    setFieldValues(prev => ({ ...prev, [field.path]: value }));
    
    // Update the actual data
    const [section, ...rest] = field.path.split(".");
    const fieldPath = rest.join(".");
    
    if (section in data) {
      const currentSection = data[section as keyof typeof data];
      if (typeof currentSection === "object" && currentSection !== null) {
        updateData(section as keyof typeof data, { [fieldPath]: value });
      }
    }
  };
  
  const handleAISuggestField = async (field: SlideField): Promise<string | null> => {
    if (!field.aiSuggestionPrompt) return null;
    
    try {
      const { data: responseData, error } = await supabase.functions.invoke("generate-field-suggestion", {
        body: {
          fieldPath: field.path,
          fieldLabel: field.label,
          prompt: field.aiSuggestionPrompt,
          accountContext: {
            accountName: data.basics.accountName,
            industry: data.basics.industry,
            annualReport: data.annualReport,
            strategy: data.strategy,
          },
        },
      });
      
      if (error) throw error;
      return responseData?.suggestion || null;
    } catch (error) {
      console.error("AI suggestion error:", error);
      toast.error("Failed to generate suggestion");
      return null;
    }
  };
  
  const handleFillAllWithAI = async () => {
    setIsFillingAll(true);
    toast.loading("Generating AI suggestions for missing fields...", { id: "fill-all" });
    
    try {
      const fieldsWithPrompts = missingFields.filter(f => f.aiSuggestionPrompt);
      
      for (const field of fieldsWithPrompts) {
        const suggestion = await handleAISuggestField(field);
        if (suggestion) {
          handleFieldChange(field, suggestion);
        }
      }
      
      toast.success(`Generated ${fieldsWithPrompts.length} AI suggestions`, { id: "fill-all" });
    } catch (error) {
      console.error("Fill all error:", error);
      toast.error("Failed to generate some suggestions", { id: "fill-all" });
    } finally {
      setIsFillingAll(false);
    }
  };
  
  const requiredFields = missingFields.filter(f => f.required);
  const optionalFields = missingFields.filter(f => !f.required);
  const fieldsWithAI = missingFields.filter(f => f.aiSuggestionPrompt);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Complete Missing Fields for {slideReq?.slideName}
          </DialogTitle>
          <DialogDescription>
            Fill in the required fields below to complete this slide. Optional fields can be skipped.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* AI Fill All Button */}
          {fieldsWithAI.length > 0 && (
            <Button
              onClick={handleFillAllWithAI}
              disabled={isFillingAll}
              className="w-full"
              variant="outline"
            >
              {isFillingAll ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Generating AI Suggestions...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2 text-primary" />
                  Fill {fieldsWithAI.length} Fields with AI
                </>
              )}
            </Button>
          )}
          
          {/* Required Fields */}
          {requiredFields.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-destructive flex items-center gap-2">
                Required Fields ({requiredFields.length})
              </h4>
              {requiredFields.map((field) => (
                <SmartFieldInput
                  key={field.path}
                  field={field}
                  value={fieldValues[field.path] || getNestedValue(data, field.path)}
                  onChange={(value) => handleFieldChange(field, value)}
                  onAISuggest={field.aiSuggestionPrompt ? () => handleAISuggestField(field) : undefined}
                />
              ))}
            </div>
          )}
          
          {/* Optional Fields */}
          {optionalFields.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                Optional Fields ({optionalFields.length})
              </h4>
              {optionalFields.map((field) => (
                <SmartFieldInput
                  key={field.path}
                  field={field}
                  value={fieldValues[field.path] || getNestedValue(data, field.path)}
                  onChange={(value) => handleFieldChange(field, value)}
                  onAISuggest={field.aiSuggestionPrompt ? () => handleAISuggestField(field) : undefined}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Skip for Now
          </Button>
          <Button onClick={() => { onComplete?.(); onClose(); }}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
