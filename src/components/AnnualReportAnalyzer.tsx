import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccountData } from "@/context/AccountDataContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Loader2, FileText, CheckCircle2, Upload, Link, Type } from "lucide-react";

type InputMode = "paste" | "pdf" | "url";

export const AnnualReportAnalyzer = () => {
  const { updateData } = useAccountData();
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>("paste");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeContent = async (textContent: string) => {
    if (textContent.trim().length < 100) {
      toast.error("Content too short. Please provide at least 100 characters.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisComplete(false);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-annual-report", {
        body: { content: textContent }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || "Analysis failed");

      const extracted = data.data;

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
      toast.success("Annual report analyzed! Data has been populated.");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to analyze report");
    } finally {
      setIsAnalyzing(false);
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

  const isLoading = isAnalyzing || isFetching;

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
          Extract key highlights from annual reports to auto-populate your Executive Summary slide.
        </p>

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
              >
                {isFetching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
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
            >
              {isFetching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Fetching...
                </>
              ) : isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
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
          <div className="flex items-center gap-2 text-sm text-sn-green bg-sn-green/10 p-3 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
            Data extracted and populated in the form!
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
