import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccountData } from "@/context/AccountDataContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Loader2, FileText, CheckCircle2 } from "lucide-react";

export const AnnualReportAnalyzer = () => {
  const { updateData } = useAccountData();
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleAnalyze = async () => {
    if (content.trim().length < 100) {
      toast.error("Please paste more content from the annual report (at least 100 characters)");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisComplete(false);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-annual-report", {
        body: { content }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || "Analysis failed");
      }

      const extracted = data.data;

      // Update the account context with extracted data
      updateData("annualReport", {
        revenue: extracted.revenue,
        revenueComparison: extracted.revenueComparison,
        ebitImprovement: extracted.ebitImprovement,
        netZeroTarget: extracted.netZeroTarget,
        keyMilestones: extracted.keyMilestones,
        strategicAchievements: extracted.strategicAchievements,
        executiveSummaryNarrative: extracted.executiveSummaryNarrative,
      });

      setAnalysisComplete(true);
      toast.success("Annual report analyzed! Data has been populated in the form.");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to analyze annual report");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="glass-card border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Annual Report Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Paste content from the company's annual report, investor presentation, or earnings call transcript. 
          Our AI will extract key highlights for your Executive Summary slide.
        </p>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste annual report content here...

Example: Copy text from sections like:
• CEO Letter / Chairman's Statement
• Financial Highlights
• Strategic Priorities
• Key Achievements
• Sustainability Goals"
          rows={8}
          className="font-mono text-sm"
        />

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {content.length} characters {content.length < 100 && "(minimum 100)"}
          </div>
          
          <div className="flex gap-2">
            {analysisComplete && (
              <div className="flex items-center gap-1 text-sm text-sn-green">
                <CheckCircle2 className="w-4 h-4" />
                Data populated
              </div>
            )}
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || content.length < 100}
              className="gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Analyze & Extract
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-secondary/30 p-3 rounded-lg">
          <strong>Tip:</strong> For best results, include content about revenue, EBIT/profit, strategic initiatives, 
          key milestones, and sustainability targets. The more context you provide, the better the extraction.
        </div>
      </CardContent>
    </Card>
  );
};