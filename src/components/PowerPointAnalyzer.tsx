import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Presentation,
  Sparkles, 
  Loader2, 
  ChevronDown, 
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Globe,
  Upload,
  Mic,
  Target,
  TrendingUp,
  AlertCircle,
  FileText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAccountData } from "@/context/AccountDataContext";
import { toast } from "sonner";

interface PresentationAnalysis {
  companyName: string;
  industry?: string;
  overallScore: number;
  overallAssessment: string;
  strengths: { title: string; detail: string }[];
  gaps: { title: string; detail: string; priority: "high" | "medium" | "low" }[];
  webInsights?: { insight: string; suggestion: string }[];
  slideSuggestions: { slideTitle: string; currentState: string; suggestion: string; priority: "high" | "medium" | "low" }[];
  missingSlides?: { title: string; rationale: string; suggestedContent: string }[];
  executiveTips?: string[];
}

interface PowerPointAnalyzerProps {
  onGenerateTalkingNotes?: () => void;
}

export const PowerPointAnalyzer = ({ onGenerateTalkingNotes }: PowerPointAnalyzerProps) => {
  const { updateData } = useAccountData();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PresentationAnalysis | null>(null);
  const [webSearchUsed, setWebSearchUsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["gaps", "suggestions"]));
  const [parsedContent, setParsedContent] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".pptx") && !fileName.endsWith(".ppt")) {
      toast.error("Please upload a PowerPoint file (.pptx or .ppt)");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 50MB.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      // Upload to storage first
      const storageName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("annual-reports")
        .upload(storageName, file);

      if (uploadError) throw uploadError;

      toast.loading("Extracting content from PowerPoint...", { id: "pptx-analysis" });

      // Parse the PowerPoint using our parse-document endpoint
      const { data: parseData, error: parseError } = await supabase.functions.invoke("parse-document", {
        body: { filePath: storageName, fileType: "pptx" }
      });

      if (parseError) throw parseError;
      if (!parseData?.success) throw new Error(parseData?.error || "Failed to parse PowerPoint");

      const content = parseData.content || "";
      const slideCount = parseData.slideCount || 0;
      setParsedContent(content);

      toast.loading("Analyzing presentation and researching company...", { id: "pptx-analysis" });

      // Analyze the presentation
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke("analyze-presentation", {
        body: { presentationContent: content, slideCount }
      });

      if (analysisError) throw analysisError;
      if (!analysisData?.success) throw new Error(analysisData?.error || "Failed to analyze presentation");

      setAnalysis(analysisData.data);
      setWebSearchUsed(analysisData.webSearchUsed || false);

      // Update account data with identified company
      if (analysisData.data.companyName && analysisData.data.companyName !== "Unknown Company") {
        updateData("basics", { 
          accountName: analysisData.data.companyName,
          industry: analysisData.data.industry || ""
        });
      }

      toast.success("Analysis complete!", { id: "pptx-analysis" });

      // Cleanup: delete the uploaded file
      await supabase.storage.from("annual-reports").remove([storageName]);

    } catch (error) {
      console.error("PowerPoint analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to analyze PowerPoint", { id: "pptx-analysis" });
    } finally {
      setIsAnalyzing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500";
    if (score >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    if (score >= 4) return "Needs Work";
    return "Significant Issues";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-muted";
    }
  };

  return (
    <Card className="glass-card border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Presentation className="w-5 h-5 text-purple-500" />
          PowerPoint Analyzer
          <Badge variant="outline" className="ml-2 text-xs bg-purple-500/10 border-purple-500/30">
            Beta
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysis ? (
          <>
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <p className="text-sm text-muted-foreground">
                Upload your existing account plan or annual report presentation. AI will:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <Target className="w-3 h-3 text-purple-500" />
                  Identify the customer and industry
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="w-3 h-3 text-purple-500" />
                  Research company info from the web
                </li>
                <li className="flex items-center gap-2">
                  <Lightbulb className="w-3 h-3 text-purple-500" />
                  Analyze strengths and suggest improvements
                </li>
                <li className="flex items-center gap-2">
                  <Mic className="w-3 h-3 text-purple-500" />
                  Generate talking notes for your slides
                </li>
              </ul>
            </div>

            <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center">
              <Presentation className="w-12 h-12 mx-auto text-purple-500/50 mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload a PowerPoint file (.pptx)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pptx,.ppt"
                onChange={handleFileUpload}
                className="hidden"
                id="pptx-upload"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="gap-2 border-purple-500/50 hover:bg-purple-500/10"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload PowerPoint
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <ScrollArea className="max-h-[600px]">
            <div className="space-y-4 pr-4">
              {/* Company & Score Header */}
              <div className="flex items-start justify-between p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{analysis.companyName}</h3>
                  {analysis.industry && (
                    <p className="text-sm text-muted-foreground">{analysis.industry}</p>
                  )}
                  {webSearchUsed && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      Web Enhanced
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}/10
                  </div>
                  <p className="text-sm text-muted-foreground">{getScoreLabel(analysis.overallScore)}</p>
                  <Progress 
                    value={analysis.overallScore * 10} 
                    className="w-24 mt-2 h-2"
                  />
                </div>
              </div>

              {/* Overall Assessment */}
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <p className="text-sm text-foreground/90">{analysis.overallAssessment}</p>
                </CardContent>
              </Card>

              {/* Strengths */}
              <Collapsible 
                open={expandedSections.has("strengths")}
                onOpenChange={() => toggleSection("strengths")}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-3 h-auto bg-green-500/5 hover:bg-green-500/10">
                    <span className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Strengths ({analysis.strengths.length})
                    </span>
                    {expandedSections.has("strengths") ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pt-2">
                  {analysis.strengths.map((strength, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                      <h4 className="font-medium text-green-400 text-sm">{strength.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{strength.detail}</p>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Gaps / Improvements */}
              <Collapsible 
                open={expandedSections.has("gaps")}
                onOpenChange={() => toggleSection("gaps")}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-3 h-auto bg-amber-500/5 hover:bg-amber-500/10">
                    <span className="flex items-center gap-2 font-semibold">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Areas for Improvement ({analysis.gaps.length})
                    </span>
                    {expandedSections.has("gaps") ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pt-2">
                  {analysis.gaps.map((gap, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-amber-400 text-sm">{gap.title}</h4>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(gap.priority)}`}>
                          {gap.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{gap.detail}</p>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Web Insights */}
              {analysis.webInsights && analysis.webInsights.length > 0 && (
                <Collapsible 
                  open={expandedSections.has("web")}
                  onOpenChange={() => toggleSection("web")}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-3 h-auto bg-blue-500/5 hover:bg-blue-500/10">
                      <span className="flex items-center gap-2 font-semibold">
                        <Globe className="w-4 h-4 text-blue-500" />
                        Web Research Insights ({analysis.webInsights.length})
                      </span>
                      {expandedSections.has("web") ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 pt-2">
                    {analysis.webInsights.map((insight, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                        <div className="flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{insight.insight}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              <span className="text-blue-400">→</span> {insight.suggestion}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Slide Suggestions */}
              <Collapsible 
                open={expandedSections.has("suggestions")}
                onOpenChange={() => toggleSection("suggestions")}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-3 h-auto bg-purple-500/5 hover:bg-purple-500/10">
                    <span className="flex items-center gap-2 font-semibold">
                      <Lightbulb className="w-4 h-4 text-purple-500" />
                      Slide Suggestions ({analysis.slideSuggestions.length})
                    </span>
                    {expandedSections.has("suggestions") ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pt-2">
                  {analysis.slideSuggestions.map((suggestion, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-purple-400 text-sm">{suggestion.slideTitle}</h4>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(suggestion.priority)}`}>
                          {suggestion.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        <span className="font-medium">Current:</span> {suggestion.currentState}
                      </p>
                      <p className="text-sm text-foreground">
                        <span className="text-purple-400 font-medium">Suggestion:</span> {suggestion.suggestion}
                      </p>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Missing Slides */}
              {analysis.missingSlides && analysis.missingSlides.length > 0 && (
                <Collapsible 
                  open={expandedSections.has("missing")}
                  onOpenChange={() => toggleSection("missing")}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-3 h-auto bg-red-500/5 hover:bg-red-500/10">
                      <span className="flex items-center gap-2 font-semibold">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        Suggested Additional Slides ({analysis.missingSlides.length})
                      </span>
                      {expandedSections.has("missing") ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 pt-2">
                    {analysis.missingSlides.map((slide, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                        <h4 className="font-medium text-red-400 text-sm">{slide.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{slide.rationale}</p>
                        <p className="text-sm text-foreground mt-2">
                          <span className="font-medium">Include:</span> {slide.suggestedContent}
                        </p>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Executive Tips */}
              {analysis.executiveTips && analysis.executiveTips.length > 0 && (
                <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Executive Presentation Tips
                    </h4>
                    <ul className="space-y-2">
                      {analysis.executiveTips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAnalysis(null);
                    setParsedContent("");
                  }}
                  className="flex-1 gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Analyze Another
                </Button>
                {onGenerateTalkingNotes && (
                  <Button
                    onClick={onGenerateTalkingNotes}
                    className="flex-1 gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Mic className="w-4 h-4" />
                    Generate Talking Notes
                  </Button>
                )}
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
