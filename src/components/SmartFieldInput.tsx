import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, X, Loader2, AlertCircle } from "lucide-react";
import { SlideField, validateField } from "@/hooks/useSlideCompletion";
import { cn } from "@/lib/utils";

interface SmartFieldInputProps {
  field: SlideField;
  value: any;
  onChange: (value: any) => void;
  onAISuggest?: () => Promise<string | null>;
  aiSuggestion?: string | null;
  isLoadingAI?: boolean;
  className?: string;
}

export const SmartFieldInput = ({
  field,
  value,
  onChange,
  onAISuggest,
  aiSuggestion,
  isLoadingAI = false,
  className,
}: SmartFieldInputProps) => {
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [localSuggestion, setLocalSuggestion] = useState<string | null>(aiSuggestion || null);
  const [isLoading, setIsLoading] = useState(false);
  
  const validation = validateField(value, field);
  const hasError = !validation.valid && field.required;
  
  const handleAISuggest = async () => {
    if (!onAISuggest) return;
    
    setIsLoading(true);
    try {
      const suggestion = await onAISuggest();
      if (suggestion) {
        setLocalSuggestion(suggestion);
        setShowAISuggestion(true);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const acceptSuggestion = () => {
    if (localSuggestion) {
      onChange(localSuggestion);
      setShowAISuggestion(false);
      setLocalSuggestion(null);
    }
  };
  
  const rejectSuggestion = () => {
    setShowAISuggestion(false);
    setLocalSuggestion(null);
  };
  
  const inputStyles = cn(
    "transition-all",
    hasError && "border-destructive focus-visible:ring-destructive",
    className
  );

  // Render different input types
  if (field.type === "array") {
    const arrayValue = Array.isArray(value) ? value.join("\n") : "";
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            {field.label}
            {field.required && <span className="text-destructive">*</span>}
            {hasError && <AlertCircle className="w-3 h-3 text-destructive" />}
          </label>
          {field.aiSuggestionPrompt && onAISuggest && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAISuggest}
              disabled={isLoading || isLoadingAI}
              className="h-6 px-2 text-xs"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <Sparkles className="w-3 h-3 mr-1 text-primary" />
              )}
              AI Suggest
            </Button>
          )}
        </div>
        
        <Textarea
          value={arrayValue}
          onChange={(e) => onChange(e.target.value.split("\n").filter(s => s.trim()))}
          placeholder={`Enter ${field.label.toLowerCase()} (one per line)`}
          className={cn(inputStyles, "min-h-[80px]")}
        />
        
        {showAISuggestion && localSuggestion && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-primary flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI Suggestion
              </span>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" onClick={acceptSuggestion} className="h-6 px-2">
                  <Check className="w-3 h-3 text-primary" />
                </Button>
                <Button size="sm" variant="ghost" onClick={rejectSuggestion} className="h-6 px-2">
                  <X className="w-3 h-3 text-muted-foreground" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-foreground/80 whitespace-pre-wrap">{localSuggestion}</p>
          </div>
        )}
        
        {hasError && validation.error && (
          <p className="text-xs text-destructive">{validation.error}</p>
        )}
      </div>
    );
  }
  
  // Text input (single line or multiline based on content)
  const isMultiline = field.type === "text" && (field.label.toLowerCase().includes("description") || field.label.toLowerCase().includes("narrative") || field.label.toLowerCase().includes("summary"));
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          {field.label}
          {field.required && <span className="text-destructive">*</span>}
          {hasError && <AlertCircle className="w-3 h-3 text-destructive" />}
        </label>
        {field.aiSuggestionPrompt && onAISuggest && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAISuggest}
            disabled={isLoading || isLoadingAI}
            className="h-6 px-2 text-xs"
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
            ) : (
              <Sparkles className="w-3 h-3 mr-1 text-primary" />
            )}
            AI Suggest
          </Button>
        )}
      </div>
      
      {isMultiline ? (
        <Textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          className={cn(inputStyles, "min-h-[80px]")}
        />
      ) : (
        <Input
          type={field.type === "number" ? "number" : "text"}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          className={inputStyles}
        />
      )}
      
      {showAISuggestion && localSuggestion && (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-primary flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI Suggestion
            </span>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" onClick={acceptSuggestion} className="h-6 px-2">
                <Check className="w-3 h-3 text-primary" />
              </Button>
              <Button size="sm" variant="ghost" onClick={rejectSuggestion} className="h-6 px-2">
                <X className="w-3 h-3 text-muted-foreground" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-foreground/80">{localSuggestion}</p>
        </div>
      )}
      
      {hasError && validation.error && (
        <p className="text-xs text-destructive">{validation.error}</p>
      )}
    </div>
  );
};
