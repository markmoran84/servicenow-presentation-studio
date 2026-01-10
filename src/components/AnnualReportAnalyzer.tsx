import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccountData } from "@/context/AccountDataContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Loader2, FileText, CheckCircle2, Upload, Link, Type, Globe, FileCheck, RefreshCw, Rocket, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type InputMode = "paste" | "pdf" | "url";

interface DataSourceInfo {
  documentFields: string[];
  webFields: string[];
  usedWebSearch: boolean;
}

interface AnnualReportAnalyzerProps {
  onGeneratePlan?: () => Promise<void>;
}

export const AnnualReportAnalyzer = ({ onGeneratePlan }: AnnualReportAnalyzerProps) => {
  const { data, updateData, setGeneratedPlan } = useAccountData();
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>("paste");
  const [dataSourceInfo, setDataSourceInfo] = useState<DataSourceInfo | null>(null);
  const [isResyncing, setIsResyncing] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate the full plan using AI with provided extracted data
  const handleGenerateFullPlan = async (extractedData?: any) => {
    setIsGeneratingPlan(true);
    try {
      // Build account data from extracted data + existing context
      // This ensures we use fresh data, not stale React state
      const accountData = extractedData ? {
        ...data,
        basics: {
          ...data.basics,
          ...(extractedData.accountName && { accountName: extractedData.accountName }),
          ...(extractedData.industry && { industry: extractedData.industry }),
        },
        financial: {
          ...data.financial,
          ...(extractedData.revenue && { customerRevenue: extractedData.revenue }),
          ...(extractedData.growthRate && { growthRate: extractedData.growthRate }),
          ...(extractedData.marginEBIT && { marginEBIT: extractedData.marginEBIT }),
          ...(extractedData.costPressureAreas && { costPressureAreas: extractedData.costPressureAreas }),
          ...(extractedData.strategicInvestmentAreas && { strategicInvestmentAreas: extractedData.strategicInvestmentAreas }),
        },
        strategy: {
          ...data.strategy,
          ...(extractedData.corporateStrategy?.length && { 
            corporateStrategy: extractedData.corporateStrategy.map((item: any) => ({
              title: item.title || "",
              description: item.description || ""
            }))
          }),
          ...(extractedData.digitalStrategies?.length && { 
            digitalStrategies: extractedData.digitalStrategies.map((item: any) => ({
              title: item.title || "",
              description: item.description || ""
            }))
          }),
          ...(extractedData.ceoBoardPriorities?.length && { 
            ceoBoardPriorities: extractedData.ceoBoardPriorities.map((item: any) => ({
              title: item.title || "",
              description: item.description || ""
            }))
          }),
          ...(extractedData.transformationThemes?.length && { 
            transformationThemes: extractedData.transformationThemes.map((item: any) => ({
              title: item.title || "",
              description: item.description || ""
            }))
          }),
        },
        painPoints: {
          painPoints: extractedData.painPoints?.map((pp: any) => ({
            title: pp.title || "",
            description: pp.description || ""
          })) || data.painPoints.painPoints
        },
        opportunities: {
          opportunities: extractedData.opportunities?.map((op: any) => ({
            title: op.title || "",
            description: op.description || ""
          })) || data.opportunities.opportunities
        },
        swot: {
          strengths: extractedData.strengths || data.swot.strengths,
          weaknesses: extractedData.weaknesses || data.swot.weaknesses,
          opportunities: extractedData.swotOpportunities || data.swot.opportunities,
          threats: extractedData.threats || data.swot.threats,
        },
        annualReport: {
          ...data.annualReport,
          ...(extractedData.revenue && { revenue: extractedData.revenue }),
          ...(extractedData.revenueComparison && { revenueComparison: extractedData.revenueComparison }),
          ...(extractedData.ebitImprovement && { ebitImprovement: extractedData.ebitImprovement }),
          ...(extractedData.netZeroTarget && { netZeroTarget: extractedData.netZeroTarget }),
          ...(extractedData.keyMilestones?.length && { keyMilestones: extractedData.keyMilestones }),
          ...(extractedData.strategicAchievements?.length && { strategicAchievements: extractedData.strategicAchievements }),
          ...(extractedData.executiveSummaryNarrative && { executiveSummaryNarrative: extractedData.executiveSummaryNarrative }),
        }
      } : data;
      
      const { data: responseData, error } = await supabase.functions.invoke("generate-account-plan", {
        body: { accountData }
      });

      if (error) {
        console.error("Plan generation error:", error);
        throw error;
      }
      
      if (!responseData?.success) {
        throw new Error(responseData?.error || "Failed to generate plan");
      }

      // Store the AI-generated plan
      setGeneratedPlan(responseData.plan);
      
      toast.success("Full account plan generated!", { id: "auto-plan-gen" });
      
      // Call the parent callback to navigate to slides
      if (onGeneratePlan) {
        await onGeneratePlan();
      }
    } catch (error) {
      console.error("Plan generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate plan", { id: "auto-plan-gen" });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const analyzeContent = async (textContent: string) => {
    if (textContent.trim().length < 100) {
      toast.error("Content too short. Please provide at least 100 characters.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setDataSourceInfo(null);

    try {
      // Pass current account context to inform SWOT analysis
      const accountContext = {
        basics: data.basics,
        history: data.history,
        financial: data.financial,
        engagement: data.engagement
      };

      const { data: responseData, error } = await supabase.functions.invoke("analyze-annual-report", {
        body: { content: textContent, accountContext }
      });

      if (error) throw error;
      if (!responseData.success) throw new Error(responseData.error || "Analysis failed");

      const extracted = responseData.data;
      const dataSources = responseData.dataSources || {};
      const usedWebSearch = responseData.usedWebSearch || false;

      // Calculate source info
      const documentFields: string[] = [];
      const webFields: string[] = [];
      Object.entries(dataSources).forEach(([field, source]) => {
        if (source === "document") documentFields.push(field);
        else if (source === "web") webFields.push(field);
      });

      setDataSourceInfo({ documentFields, webFields, usedWebSearch });

      // Update Basics tab
      if (extracted.accountName || extracted.industry) {
        updateData("basics", {
          ...(extracted.accountName && { accountName: extracted.accountName }),
          ...(extracted.industry && { industry: extracted.industry }),
        });
      }

      // Update Financial tab
      if (extracted.revenue || extracted.growthRate || extracted.marginEBIT) {
        updateData("financial", {
          ...(extracted.revenue && { customerRevenue: extracted.revenue }),
          ...(extracted.growthRate && { growthRate: extracted.growthRate }),
          ...(extracted.marginEBIT && { marginEBIT: extracted.marginEBIT }),
          ...(extracted.costPressureAreas && { costPressureAreas: extracted.costPressureAreas }),
          ...(extracted.strategicInvestmentAreas && { strategicInvestmentAreas: extracted.strategicInvestmentAreas }),
        });
      }

      // Update Strategy tab - convert to StrategyItem format
      if (extracted.corporateStrategy?.length || extracted.digitalStrategies?.length || extracted.ceoBoardPriorities?.length || extracted.transformationThemes?.length) {
        updateData("strategy", {
          ...(extracted.corporateStrategy?.length && { 
            corporateStrategy: extracted.corporateStrategy.map((item: { title: string; description: string }) => ({
              title: item.title || "",
              description: item.description || ""
            }))
          }),
          ...(extracted.digitalStrategies?.length && { 
            digitalStrategies: extracted.digitalStrategies.map((item: { title: string; description: string }) => ({
              title: item.title || "",
              description: item.description || ""
            }))
          }),
          ...(extracted.ceoBoardPriorities?.length && { 
            ceoBoardPriorities: extracted.ceoBoardPriorities.map((item: { title: string; description: string }) => ({
              title: item.title || "",
              description: item.description || ""
            }))
          }),
          ...(extracted.transformationThemes?.length && { 
            transformationThemes: extracted.transformationThemes.map((item: { title: string; description: string }) => ({
              title: item.title || "",
              description: item.description || ""
            }))
          }),
        });
      }

      // Update Pain Points tab - convert to title/description format
      if (extracted.painPoints?.length) {
        updateData("painPoints", {
          painPoints: extracted.painPoints.map((pp: { title: string; description: string }) => ({
            title: pp.title || "",
            description: pp.description || ""
          }))
        });
      }

      // Update Opportunities tab - convert to title/description format
      if (extracted.opportunities?.length) {
        updateData("opportunities", {
          opportunities: extracted.opportunities.map((op: { title: string; description: string }) => ({
            title: op.title || "",
            description: op.description || ""
          }))
        });
      }

      // Update SWOT tab
      if (extracted.strengths?.length || extracted.weaknesses?.length || extracted.swotOpportunities?.length || extracted.threats?.length) {
        updateData("swot", {
          ...(extracted.strengths?.length && { strengths: extracted.strengths }),
          ...(extracted.weaknesses?.length && { weaknesses: extracted.weaknesses }),
          ...(extracted.swotOpportunities?.length && { opportunities: extracted.swotOpportunities }),
          ...(extracted.threats?.length && { threats: extracted.threats }),
        });
      }

      // Update Annual Report tab
      updateData("annualReport", {
        ...(extracted.revenue && { revenue: extracted.revenue }),
        ...(extracted.revenueComparison && { revenueComparison: extracted.revenueComparison }),
        ...(extracted.ebitImprovement && { ebitImprovement: extracted.ebitImprovement }),
        ...(extracted.netZeroTarget && { netZeroTarget: extracted.netZeroTarget }),
        ...(extracted.keyMilestones?.length && { keyMilestones: extracted.keyMilestones }),
        ...(extracted.strategicAchievements?.length && { strategicAchievements: extracted.strategicAchievements }),
        ...(extracted.executiveSummaryNarrative && { executiveSummaryNarrative: extracted.executiveSummaryNarrative }),
      });

      setAnalysisComplete(true);
      toast.success("Analysis complete! Data populated across all relevant tabs.");

      // Auto-generate the full plan if enabled - pass extracted data directly
      if (autoGenerate) {
        toast.loading("Now generating full account plan...", { id: "auto-plan-gen" });
        await handleGenerateFullPlan(extracted);
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to analyze report");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleResyncStrategy = async () => {
    setIsResyncing(true);
    try {
      const accountContext = {
        basics: data.basics,
        history: data.history,
        financial: data.financial,
        strategy: data.strategy,
        engagement: data.engagement,
        annualReport: data.annualReport
      };

      const existingAnalysis = {
        painPoints: data.painPoints.painPoints,
        opportunities: data.opportunities.opportunities
      };

      const { data: responseData, error } = await supabase.functions.invoke("resync-strategy", {
        body: { accountContext, existingAnalysis }
      });

      if (error) throw error;
      if (!responseData.success) throw new Error(responseData.error || "Resync failed");

      const resynced = responseData.data;

      // Update Pain Points
      if (resynced.painPoints?.length) {
        updateData("painPoints", {
          painPoints: resynced.painPoints.map((pp: { title: string; description: string }) => ({
            title: pp.title || "",
            description: pp.description || ""
          }))
        });
      }

      // Update Opportunities
      if (resynced.opportunities?.length) {
        updateData("opportunities", {
          opportunities: resynced.opportunities.map((op: { title: string; description: string }) => ({
            title: op.title || "",
            description: op.description || ""
          }))
        });
      }

      // Update SWOT
      if (resynced.strengths?.length || resynced.weaknesses?.length) {
        updateData("swot", {
          strengths: resynced.strengths || [],
          weaknesses: resynced.weaknesses || [],
          opportunities: resynced.swotOpportunities || [],
          threats: resynced.threats || []
        });
      }

      toast.success("Strategy realigned with updated context!");
      if (resynced.alignmentNotes) {
        toast.info(resynced.alignmentNotes, { duration: 5000 });
      }
    } catch (error) {
      console.error("Resync error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to resync strategy");
    } finally {
      setIsResyncing(false);
    }
  };

  const handlePasteAnalyze = () => analyzeContent(content);

  const handleUrlFetch = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    setIsFetching(true);
    try {
      const { data, error } = await supabase.functions.invoke("fetch-url-content", {
        body: { url }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || "Failed to fetch URL");

      toast.success("Content fetched! Now analyzing...");
      await analyzeContent(data.content);
    } catch (error) {
      console.error("URL fetch error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to fetch URL");
    } finally {
      setIsFetching(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please upload a PDF file");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 50MB.");
      return;
    }

    setIsFetching(true);
    try {
      // Upload to storage
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("annual-reports")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      toast.success("PDF uploaded! Extracting text...");

      // Parse the PDF
      const { data, error } = await supabase.functions.invoke("parse-pdf", {
        body: { filePath: fileName }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || "Failed to parse PDF");

      toast.success("Text extracted! Now analyzing...");
      await analyzeContent(data.content);
    } catch (error) {
      console.error("PDF upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process PDF");
    } finally {
      setIsFetching(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const isLoading = isAnalyzing || isFetching || isGeneratingPlan;

  return (
    <Card className="glass-card border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Annual Report Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* One-Click Flow Description */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/20">
              <Rocket className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                One-Click AI Generation
                <Badge variant="secondary" className="text-xs">Recommended</Badge>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Upload an annual report → AI extracts all data → Automatically generates your full 23-slide account plan. No manual input required.
              </p>
            </div>
          </div>
          
          {/* Auto-generate toggle */}
          <div className="mt-3 flex items-center justify-between p-2 rounded bg-background/50">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Auto-generate full plan after analysis</span>
            </div>
            <button
              onClick={() => setAutoGenerate(!autoGenerate)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoGenerate ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoGenerate ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as InputMode)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="paste" className="gap-2">
              <Type className="w-4 h-4" />
              Paste Text
            </TabsTrigger>
            <TabsTrigger value="pdf" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload PDF
            </TabsTrigger>
            <TabsTrigger value="url" className="gap-2">
              <Link className="w-4 h-4" />
              Fetch URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="paste" className="space-y-4 mt-4">
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
              <Button 
                onClick={handlePasteAnalyze} 
                disabled={isLoading || content.length < 100}
                className="gap-2"
                size="lg"
              >
                {isGeneratingPlan ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Plan...
                  </>
                ) : isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing Report...
                  </>
                ) : autoGenerate ? (
                  <>
                    <Rocket className="w-4 h-4" />
                    Analyze & Generate Plan
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Analyze & Extract
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="pdf" className="space-y-4 mt-4">
            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload a PDF of the annual report (max 50MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="pdf-upload"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="gap-2"
                size="lg"
              >
                {isGeneratingPlan ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Plan...
                  </>
                ) : isFetching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing PDF...
                  </>
                ) : isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : autoGenerate ? (
                  <>
                    <Rocket className="w-4 h-4" />
                    Upload & Generate Plan
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Choose PDF File
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Works best with text-based PDFs. Image-based or scanned PDFs may not extract properly.
            </p>
          </TabsContent>

          <TabsContent value="url" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Investor Relations Page URL</label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://company.com/investor-relations/annual-report"
                type="url"
              />
              <p className="text-xs text-muted-foreground">
                Paste a link to the company's investor relations page, annual report page, or earnings press release.
              </p>
            </div>
            <Button 
              onClick={handleUrlFetch} 
              disabled={isLoading || !url.trim()}
              className="gap-2"
              size="lg"
            >
              {isGeneratingPlan ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Plan...
                </>
              ) : isFetching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Fetching...
                </>
              ) : isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : autoGenerate ? (
                <>
                  <Rocket className="w-4 h-4" />
                  Fetch & Generate Plan
                </>
              ) : (
                <>
                  <Link className="w-4 h-4" />
                  Fetch & Analyze
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {analysisComplete && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 text-sm text-sn-green bg-sn-green/10 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Data extracted and populated across multiple tabs! Review each tab to verify and refine.
              </div>
            </div>

            {/* Re-sync Strategy Button */}
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Updated Account Info?</p>
                  <p className="text-xs text-muted-foreground">
                    Re-align SWOT, pain points & opportunities with your latest inputs
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResyncStrategy}
                  disabled={isResyncing}
                  className="gap-2"
                >
                  {isResyncing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Re-sync Strategy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Data Quality Indicator */}
            {dataSourceInfo && (
              <div className="p-3 rounded-lg bg-secondary/30 space-y-2">
                <p className="text-sm font-medium text-foreground">Data Sources</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="gap-1 text-xs">
                    <FileCheck className="w-3 h-3" />
                    {dataSourceInfo.documentFields.length} fields from document
                  </Badge>
                  {dataSourceInfo.usedWebSearch && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <Globe className="w-3 h-3" />
                      {dataSourceInfo.webFields.length} fields from web search
                    </Badge>
                  )}
                </div>
                {dataSourceInfo.usedWebSearch && dataSourceInfo.webFields.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Web-enriched: {dataSourceInfo.webFields.slice(0, 5).join(", ")}
                    {dataSourceInfo.webFields.length > 5 && ` +${dataSourceInfo.webFields.length - 5} more`}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-secondary/30 p-3 rounded-lg">
          <strong>Tip:</strong> For best results, include content about revenue, EBIT/profit, strategic initiatives, 
          key milestones, and sustainability targets.
        </div>
      </CardContent>
    </Card>
  );
};
