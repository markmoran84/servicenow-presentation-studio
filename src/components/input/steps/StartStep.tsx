import { Button } from "@/components/ui/button";
import { 
  Upload, 
  FileText, 
  Presentation, 
  Sparkles, 
  ArrowRight,
  Wand2,
  PenLine
} from "lucide-react";

interface StartStepProps {
  onStartFromScratch: () => void;
  onImportData: () => void;
}

export function StartStep({ onStartFromScratch, onImportData }: StartStepProps) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      {/* Hero */}
      <div className="mb-12">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
          <Sparkles className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Create Your Account Plan
        </h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          Generate a comprehensive, AI-powered account strategy in minutes. 
          Choose how you'd like to get started.
        </p>
      </div>

      {/* Options */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* AI Import Option */}
        <button
          onClick={onImportData}
          className="group relative p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary/40 transition-all text-left hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10"
        >
          <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
            Recommended
          </div>
          
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/30 transition-colors">
            <Wand2 className="w-7 h-7 text-primary" />
          </div>
          
          <h3 className="text-xl font-semibold mb-2">Import with AI</h3>
          <p className="text-muted-foreground mb-6">
            Upload an annual report, existing presentation, or paste content. AI will extract and populate your account data automatically.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 text-xs font-medium">
              <FileText className="w-3.5 h-3.5" />
              Annual Reports
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 text-xs font-medium">
              <Presentation className="w-3.5 h-3.5" />
              PowerPoints
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 text-xs font-medium">
              <Upload className="w-3.5 h-3.5" />
              PDFs
            </span>
          </div>

          <div className="flex items-center gap-2 text-primary font-medium">
            Get started with AI
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Manual Entry Option */}
        <button
          onClick={onStartFromScratch}
          className="group p-8 rounded-2xl bg-secondary/30 border-2 border-border/50 hover:border-border transition-all text-left hover:scale-[1.02] hover:shadow-xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-5 group-hover:bg-muted/80 transition-colors">
            <PenLine className="w-7 h-7 text-foreground" />
          </div>
          
          <h3 className="text-xl font-semibold mb-2">Start from Scratch</h3>
          <p className="text-muted-foreground mb-6">
            Manually enter your account details step by step. Great for building a new plan with fresh information.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 text-xs font-medium">
              Full control
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 text-xs font-medium">
              Guided steps
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 text-xs font-medium">
              AI assistance
            </span>
          </div>

          <div className="flex items-center gap-2 text-foreground font-medium">
            Start manually
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Footer note */}
      <p className="mt-10 text-sm text-muted-foreground">
        You can always add or edit information later. AI will help fill gaps in your data.
      </p>
    </div>
  );
}
