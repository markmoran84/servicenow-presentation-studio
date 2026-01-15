import { useState, useRef } from "react";
import JSZip from "jszip";
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
  FileText,
  Clock,
  MessageCircle,
  Quote,
  ArrowLeft,
  Check,
  Layout,
  Eye,
  ChevronLeft
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAccountData } from "@/context/AccountDataContext";
import { toast } from "sonner";

interface SlideNote {
  slideId: string;
  slideLabel: string;
  openingHook: string;
  keyPoints: string[];
  dataToMention?: string[];
  anticipatedQuestions?: { question: string; suggestedResponse: string }[];
  transitionToNext?: string;
  speakingDuration?: string;
}

interface TalkingNotes {
  overallNarrative: string;
  keyThemes: string[];
  slideNotes: SlideNote[];
  closingRecommendations?: string[];
}

// Using ImprovedSlide and ImprovedPresentation from context
import type { ImprovedSlide, ImprovedPresentation } from "@/context/AccountDataContext";

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
  onAcceptChanges?: () => void;
}

export const PowerPointAnalyzer = ({ onGenerateTalkingNotes, onAcceptChanges }: PowerPointAnalyzerProps) => {
  const { data, updateData, setImprovedPresentation: setContextImprovedPresentation, setGeneratedPlan } = useAccountData();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PresentationAnalysis | null>(null);
  const [webSearchUsed, setWebSearchUsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["gaps", "suggestions"]));
  const [parsedContent, setParsedContent] = useState<string>("");
  const [parsedSlideCount, setParsedSlideCount] = useState<number | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Talking notes state
  const [talkingNotes, setTalkingNotes] = useState<TalkingNotes | null>(null);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [notesWebSearchUsed, setNotesWebSearchUsed] = useState(false);
  const [showNotesView, setShowNotesView] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState<Set<number>>(new Set());
  
  // Improved slides state
  const [improvedPresentation, setImprovedPresentation] = useState<ImprovedPresentation | null>(null);
  const [isGeneratingSlides, setIsGeneratingSlides] = useState(false);
  const [showSlidesView, setShowSlidesView] = useState(false);
  const [currentImprovedSlide, setCurrentImprovedSlide] = useState(0);
  const [showSlideNotes, setShowSlideNotes] = useState(true);

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

  const toggleNoteSlide = (index: number) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const normalizeAnalysis = (raw: unknown): PresentationAnalysis => {
    const obj = (raw && typeof raw === "object") ? (raw as Record<string, unknown>) : {};

    const normalizePriority = (p: unknown): "high" | "medium" | "low" => {
      return p === "high" || p === "medium" || p === "low" ? p : "medium";
    };

    const strengthsRaw = Array.isArray(obj.strengths) ? obj.strengths : [];
    const gapsRaw = Array.isArray(obj.gaps) ? obj.gaps : [];
    const slideSuggestionsRaw = Array.isArray(obj.slideSuggestions) ? obj.slideSuggestions : [];

    const webInsightsRaw = Array.isArray(obj.webInsights) ? obj.webInsights : null;
    const missingSlidesRaw = Array.isArray(obj.missingSlides) ? obj.missingSlides : null;
    const executiveTipsRaw = Array.isArray(obj.executiveTips) ? obj.executiveTips : null;

    return {
      companyName: typeof obj.companyName === "string" ? obj.companyName : "Unknown Company",
      industry: typeof obj.industry === "string" ? obj.industry : undefined,
      overallScore: typeof obj.overallScore === "number" ? obj.overallScore : Number(obj.overallScore ?? 0) || 0,
      overallAssessment: typeof obj.overallAssessment === "string" ? obj.overallAssessment : "",
      strengths: strengthsRaw
        .filter(Boolean)
        .map((s: any) => ({
          title: String(s?.title ?? "Strength"),
          detail: String(s?.detail ?? ""),
        })),
      gaps: gapsRaw
        .filter(Boolean)
        .map((g: any) => ({
          title: String(g?.title ?? "Gap"),
          detail: String(g?.detail ?? ""),
          priority: normalizePriority(g?.priority),
        })),
      webInsights: webInsightsRaw
        ? webInsightsRaw
            .filter(Boolean)
            .map((w: any) => ({
              insight: String(w?.insight ?? ""),
              suggestion: String(w?.suggestion ?? ""),
            }))
            .filter((w: any) => (w.insight || w.suggestion))
        : undefined,
      slideSuggestions: slideSuggestionsRaw
        .filter(Boolean)
        .map((s: any) => ({
          slideTitle: String(s?.slideTitle ?? "Slide"),
          currentState: String(s?.currentState ?? ""),
          suggestion: String(s?.suggestion ?? ""),
          priority: normalizePriority(s?.priority),
        })),
      missingSlides: missingSlidesRaw
        ? missingSlidesRaw
            .filter(Boolean)
            .map((m: any) => ({
              title: String(m?.title ?? "Additional slide"),
              rationale: String(m?.rationale ?? ""),
              suggestedContent: String(m?.suggestedContent ?? ""),
            }))
        : undefined,
      executiveTips: executiveTipsRaw ? executiveTipsRaw.filter(Boolean).map((t: any) => String(t)) : undefined,
    };
  };

  const decodeXmlEntities = (value: string) => {
    return value
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, "&");
  };

  const extractTextFromPptxXml = (xml: string) => {
    const textMatches = xml.match(/<a:t>([^<]*)<\/a:t>/g) || [];
    return textMatches
      .map((match) => match.replace(/<a:t>([^<]*)<\/a:t>/, "$1"))
      .map(decodeXmlEntities)
      .map((t) => t.trim())
      .filter(Boolean)
      .join(" ");
  };

  const parsePptxInBrowser = async (file: File): Promise<{ content: string; slideCount: number }> => {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    const slideTexts: string[] = [];

    const slideFiles = Object.keys(zip.files)
      .filter((name) => /ppt\/slides\/slide\d+\.xml$/.test(name))
      .sort((a, b) => {
        const numA = parseInt(a.match(/slide(\d+)\.xml/)?.[1] || "0", 10);
        const numB = parseInt(b.match(/slide(\d+)\.xml/)?.[1] || "0", 10);
        return numA - numB;
      });

    const slideCount = slideFiles.length;

    for (const slideFile of slideFiles) {
      const xml = await zip.file(slideFile)?.async("string");
      if (!xml) continue;

      const slideText = extractTextFromPptxXml(xml);
      if (slideText.trim()) {
        const slideNum = slideFile.match(/slide(\d+)\.xml/)?.[1] || "?";
        slideTexts.push(`[Slide ${slideNum}]\n${slideText}`);
      }
    }

    const noteFiles = Object.keys(zip.files).filter((name) => /ppt\/notesSlides\/notesSlide\d+\.xml$/.test(name));

    for (const noteFile of noteFiles) {
      const xml = await zip.file(noteFile)?.async("string");
      if (!xml) continue;

      const tokens = extractTextFromPptxXml(xml)
        .split(/\s+/)
        .filter((t) => t.trim().length > 0 && !/^\d+$/.test(t));
      const noteText = tokens.join(" ");

      if (noteText.trim() && noteText.length > 20) {
        const slideNum = noteFile.match(/notesSlide(\d+)\.xml/)?.[1] || "?";
        slideTexts.push(`[Notes for Slide ${slideNum}]\n${noteText}`);
      }
    }

    const extractedText = slideTexts.join("\n\n").trim();

    if (!extractedText || extractedText.length < 50) {
      throw new Error(
        "Could not extract meaningful text from the PowerPoint. The file may be image-based or protected."
      );
    }

    return {
      content: extractedText.slice(0, 100000),
      slideCount,
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".pptx") && !fileName.endsWith(".ppt")) {
      toast.error("Please upload a PowerPoint file (.pptx or .ppt)");
      return;
    }

    // File size check - 150MB limit
    const maxSize = 150 * 1024 * 1024;
    console.log(`File: ${file.name}, Size: ${file.size} bytes, Max: ${maxSize} bytes`);

    if (file.size > maxSize) {
      toast.error(
        `File too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 150MB.`
      );
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      toast.loading("Uploading PowerPoint...", { id: "pptx-analysis" });

      // Upload to storage first
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
      const storageName = `${Date.now()}-${safeName}`;
      console.log(`Uploading to storage: ${storageName}`);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("annual-reports")
        .upload(storageName, file);

      console.log("Upload result:", { uploadData, uploadError });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      toast.loading("Extracting content from PowerPoint...", { id: "pptx-analysis" });

      // Large PPTX files can exceed backend function memory limits.
      // For those (and as a fallback), extract slide text in the browser.
      const shouldParseInBrowser = fileName.endsWith(".pptx") && file.size > 25 * 1024 * 1024;

      let content = "";
      let slideCount = 0;

      if (shouldParseInBrowser) {
        console.log("Parsing PPTX in browser (large file)");
        const parsed = await parsePptxInBrowser(file);
        content = parsed.content;
        slideCount = parsed.slideCount;
      } else {
        try {
          // Parse the PowerPoint using our backend parse-document endpoint
          const { data: parseData, error: parseError } = await supabase.functions.invoke("parse-document", {
            body: { filePath: storageName, fileType: "pptx" },
          });

          if (parseError) throw parseError;
          if (!parseData?.success) throw new Error(parseData?.error || "Failed to parse PowerPoint");

          content = parseData.content || "";
          slideCount = parseData.slideCount || 0;
        } catch (e) {
          console.warn("Backend parse failed; falling back to browser parsing", e);
          const parsed = await parsePptxInBrowser(file);
          content = parsed.content;
          slideCount = parsed.slideCount;
        }
      }

      setParsedContent(content);
      setParsedSlideCount(slideCount);

      toast.loading("Analyzing presentation and researching company...", { id: "pptx-analysis" });

      // Analyze the presentation
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke("analyze-presentation", {
        body: { presentationContent: content, slideCount },
      });

      if (analysisError) throw analysisError;
      if (!analysisData?.success) throw new Error(analysisData?.error || "Failed to analyze presentation");

      const normalized = normalizeAnalysis(analysisData.data);
      setAnalysis(normalized);
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

  // Extract slides from parsed content for talking notes
  const extractSlidesFromContent = (content: string): { label: string; index: number; description: string }[] => {
    const slideRegex = /\[Slide (\d+)\]/g;
    const slides: { label: string; index: number; description: string }[] = [];
    let match;
    let slideIndex = 0;
    
    while ((match = slideRegex.exec(content)) !== null) {
      slides.push({
        label: `Slide ${match[1]}`,
        index: slideIndex,
        description: `Content from slide ${match[1]}`
      });
      slideIndex++;
    }
    
    // If no slides found, create generic ones based on slide count
    if (slides.length === 0 && parsedSlideCount) {
      for (let i = 1; i <= parsedSlideCount; i++) {
        slides.push({
          label: `Slide ${i}`,
          index: i - 1,
          description: `Presentation slide ${i}`
        });
      }
    }
    
    return slides;
  };

  const handleGenerateTalkingNotes = async () => {
    if (!data.basics.accountName && !analysis?.companyName) {
      toast.error("Please upload a presentation first to identify the company");
      return;
    }

    setIsGeneratingNotes(true);
    try {
      toast.loading("Generating talking notes for all slides...", { id: "talking-notes" });
      
      const slideInfo = extractSlidesFromContent(parsedContent);
      
      const { data: responseData, error } = await supabase.functions.invoke("generate-talking-notes", {
        body: { 
          accountData: {
            ...data,
            basics: {
              ...data.basics,
              accountName: data.basics.accountName || analysis?.companyName || "Unknown Company",
              industry: data.basics.industry || analysis?.industry || ""
            }
          },
          documentContent: parsedContent,
          slideInfo
        }
      });

      if (error) throw error;
      if (!responseData.success) throw new Error(responseData.error || "Failed to generate notes");

      setTalkingNotes(responseData.data);
      setNotesWebSearchUsed(responseData.webSearchUsed || false);
      setShowNotesView(true);
      // Expand all slides by default
      setExpandedNotes(new Set(responseData.data.slideNotes.map((_: any, i: number) => i)));
      toast.success("Talking notes generated for all slides!", { id: "talking-notes" });
    } catch (error) {
      console.error("Error generating talking notes:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate talking notes", { id: "talking-notes" });
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  // Handle accepting changes and generating improved PPT-based slides
  const handleAcceptChanges = async () => {
    if (!analysis) {
      toast.error("No analysis available");
      return;
    }

    setIsGeneratingSlides(true);
    try {
      toast.loading("Generating improved presentation slides...", { id: "improved-slides" });

      // Use the new generate-ppt-slides function that creates ImprovedPresentation
      const { data: responseData, error } = await supabase.functions.invoke("generate-ppt-slides", {
        body: {
          analysis,
          originalContent: parsedContent,
          companyName: analysis.companyName || data.basics.accountName,
          industry: analysis.industry || data.basics.industry,
          slideCount: parsedSlideCount,
        },
      });

      if (error) throw error;
      if (!responseData.success) throw new Error(responseData.error || "Failed to generate improved slides");

      // The response is an ImprovedPresentation structure
      const improvedPres: ImprovedPresentation = responseData.data;
      
      // Store in context - this will switch Index.tsx to PPT mode
      setContextImprovedPresentation(improvedPres);
      
      toast.success("Presentation slides improved!", { id: "improved-slides" });
      
      // Navigate to the first PPT slide
      onAcceptChanges?.();
    } catch (error) {
      console.error("Error generating improved slides:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate improved slides", { id: "improved-slides" });
    } finally {
      setIsGeneratingSlides(false);
    }
  };

  // Navigate between improved slides
  const goToPreviousSlide = () => {
    if (improvedPresentation && currentImprovedSlide > 0) {
      setCurrentImprovedSlide(currentImprovedSlide - 1);
    }
  };

  const goToNextSlide = () => {
    if (improvedPresentation && currentImprovedSlide < improvedPresentation.slides.length - 1) {
      setCurrentImprovedSlide(currentImprovedSlide + 1);
    }
  };

  // Render improved slide content
  const renderImprovedSlide = (slide: ImprovedSlide) => (
    <div className="h-full flex flex-col">
      {/* Slide Content */}
      <div className="flex-1 p-8 flex flex-col">
        {/* Slide Title */}
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
            {slide.slideNumber}
          </div>
          {slide.title}
        </h2>

        {/* Key Points */}
        <div className="flex-1 space-y-4">
          {slide.keyPoints.map((point, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-base text-foreground leading-relaxed">{point}</p>
            </div>
          ))}
        </div>

        {/* Visual Suggestion & Data Highlight */}
        <div className="mt-6 flex gap-4">
          {slide.visualSuggestion && (
            <div className="flex-1 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Layout className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-semibold text-blue-400 uppercase">Visual</span>
              </div>
              <p className="text-sm text-muted-foreground">{slide.visualSuggestion}</p>
            </div>
          )}
          {slide.dataHighlight && (
            <div className="flex-1 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-amber-400 uppercase">Data</span>
              </div>
              <p className="text-sm text-muted-foreground">{slide.dataHighlight}</p>
            </div>
          )}
        </div>
      </div>

      {/* Speaker Notes Panel */}
      {showSlideNotes && (
        <div className="border-t border-border/50 bg-muted/20 p-4 max-h-[40%] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Mic className="w-4 h-4 text-primary" />
              Speaker Notes
            </h4>
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {slide.speakerNotes.estimatedDuration}
            </Badge>
          </div>

          {/* Opening Hook */}
          <div className="mb-3">
            <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Opening Hook</p>
            <p className="text-sm italic text-primary">"{slide.speakerNotes.openingHook}"</p>
          </div>

          {/* Talking Points */}
          <div className="mb-3">
            <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Talking Points</p>
            <ul className="space-y-2">
              {slide.speakerNotes.talkingPoints.map((point, idx) => (
                <li key={idx} className="text-sm text-foreground/90 flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Data to Mention */}
          {slide.speakerNotes.dataToMention && slide.speakerNotes.dataToMention.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Data Points</p>
              <div className="flex flex-wrap gap-2">
                {slide.speakerNotes.dataToMention.map((data, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {data}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Transition */}
          {slide.speakerNotes.transitionToNext && (
            <div className="pt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold">→ Transition:</span> {slide.speakerNotes.transitionToNext}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Render slide note content
  const renderSlideNoteContent = (note: SlideNote) => (
    <div className="space-y-4">
      {/* Opening Hook */}
      <div>
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
          Opening Hook
        </h5>
        <p className="text-sm italic text-foreground/90">"{note.openingHook}"</p>
      </div>

      {/* Key Points */}
      <div>
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Key Points
        </h5>
        <ul className="space-y-2">
          {note.keyPoints.map((point, idx) => (
            <li key={idx} className="text-sm flex items-start gap-2">
              <TrendingUp className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Data to Mention */}
      {note.dataToMention && note.dataToMention.length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Data Points
          </h5>
          <div className="space-y-1">
            {note.dataToMention.map((d, idx) => (
              <div key={idx} className="text-sm flex items-start gap-2 bg-muted/30 rounded px-2 py-1">
                <Quote className="w-3 h-3 text-accent mt-1 flex-shrink-0" />
                <span className="font-medium">{d}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Anticipated Questions */}
      {note.anticipatedQuestions && note.anticipatedQuestions.length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Anticipated Questions
          </h5>
          <div className="space-y-3">
            {note.anticipatedQuestions.map((qa, idx) => (
              <div key={idx} className="bg-muted/20 rounded-lg p-2">
                <p className="text-sm font-medium flex items-start gap-2">
                  <MessageCircle className="w-3 h-3 text-amber-500 mt-1 flex-shrink-0" />
                  {qa.question}
                </p>
                <p className="text-sm text-muted-foreground mt-1 ml-5">
                  → {qa.suggestedResponse}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transition */}
      {note.transitionToNext && (
        <div className="border-t border-border/50 pt-3">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold">Transition:</span> {note.transitionToNext}
          </p>
        </div>
      )}
    </div>
  );

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
        {/* Improved Slides View */}
        {showSlidesView && improvedPresentation ? (
          <div className="h-[80vh] max-h-[800px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <Button
                variant="ghost"
                onClick={() => setShowSlidesView(false)}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Analysis
              </Button>
              <div className="text-center">
                <h3 className="text-lg font-bold text-foreground">{improvedPresentation.title}</h3>
                <p className="text-xs text-muted-foreground">{improvedPresentation.companyName}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSlideNotes(!showSlideNotes)}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                {showSlideNotes ? "Hide Notes" : "Show Notes"}
              </Button>
            </div>

            {/* Presentation Info */}
            <div className="py-3 px-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg my-3">
              <p className="text-sm text-foreground/90">{improvedPresentation.overallNarrative}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {improvedPresentation.keyThemes.map((theme, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Slide Content */}
            <div className="flex-1 border border-border/30 rounded-lg bg-card overflow-hidden">
              {renderImprovedSlide(improvedPresentation.slides[currentImprovedSlide])}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-4">
              <Button
                variant="outline"
                onClick={goToPreviousSlide}
                disabled={currentImprovedSlide === 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {improvedPresentation.slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImprovedSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      idx === currentImprovedSlide 
                        ? "bg-primary" 
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {currentImprovedSlide + 1} / {improvedPresentation.slides.length}
                </span>
                <Button
                  variant="outline"
                  onClick={goToNextSlide}
                  disabled={currentImprovedSlide === improvedPresentation.slides.length - 1}
                  className="gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Closing Tips */}
            {improvedPresentation.closingTips && improvedPresentation.closingTips.length > 0 && (
              <Card className="mt-4 bg-muted/30">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Delivery Tips
                  </h4>
                  <ul className="space-y-1">
                    {improvedPresentation.closingTips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        ) : showNotesView && talkingNotes ? (
          <ScrollArea className="h-[70vh] max-h-[700px]">
            <div className="space-y-4 pr-4">
              {/* Header with Back Button */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setShowNotesView(false)}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Analysis
                </Button>
                {notesWebSearchUsed && (
                  <Badge variant="outline" className="text-xs">
                    <Globe className="w-3 h-3 mr-1" />
                    Web Enhanced
                  </Badge>
                )}
              </div>

              {/* Title */}
              <div className="text-center py-4">
                <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                  <Mic className="w-6 h-6 text-primary" />
                  Talking Notes
                </h2>
                <p className="text-muted-foreground mt-1">
                  {analysis?.companyName || data.basics.accountName} - {talkingNotes.slideNotes.length} slides
                </p>
              </div>

              {/* Overall Narrative */}
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    Story Arc
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <p className="text-sm text-foreground/90">{talkingNotes.overallNarrative}</p>
                </CardContent>
              </Card>

              {/* Key Themes */}
              <div className="flex flex-wrap gap-2">
                {talkingNotes.keyThemes.map((theme, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {theme}
                  </Badge>
                ))}
              </div>

              {/* All Slides with Notes */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Presentation className="w-5 h-5 text-purple-500" />
                  All Slides
                </h3>
                {talkingNotes.slideNotes.map((note, index) => (
                  <Card 
                    key={index} 
                    className="border-l-4 border-l-primary/50 overflow-hidden"
                  >
                    <Collapsible 
                      open={expandedNotes.has(index)}
                      onOpenChange={() => toggleNoteSlide(index)}
                    >
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center font-bold text-primary">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">{note.slideLabel}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-1">{note.openingHook}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {note.speakingDuration && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {note.speakingDuration}
                              </span>
                            )}
                            {expandedNotes.has(index) ? (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-4 pb-4 pt-0 border-t border-border/50">
                          <div className="pt-4">
                            {renderSlideNoteContent(note)}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))}
              </div>

              {/* Closing Recommendations */}
              {talkingNotes.closingRecommendations && talkingNotes.closingRecommendations.length > 0 && (
                <Card className="bg-muted/50">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm">Delivery Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-4">
                    <ul className="space-y-2">
                      {talkingNotes.closingRecommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Regenerate Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowNotesView(false)}
                  className="flex-1 gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Analysis
                </Button>
                <Button 
                  onClick={handleGenerateTalkingNotes} 
                  disabled={isGeneratingNotes}
                  className="flex-1 gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isGeneratingNotes ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Regenerate Notes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </ScrollArea>
        ) : !analysis ? (
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
                onChange={(e) => {
                  const picked = e.target.files?.[0];
                  if (picked) {
                    setSelectedFileName(picked.name);
                    toast.info(`Selected: ${picked.name}`);
                  }
                  handleFileUpload(e);
                }}
                className="sr-only"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  toast.info("Choose a PowerPoint file to analyze");
                  fileInputRef.current?.click();
                }}
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
              {selectedFileName && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Selected: <span className="text-foreground">{selectedFileName}</span>
                </p>
              )}
            </div>
          </>
        ) : (
          <ScrollArea className="h-[70vh] max-h-[600px]">
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

              {/* Extracted Content */}
              {parsedContent && (
                <Collapsible
                  open={expandedSections.has("extracted")}
                  onOpenChange={() => toggleSection("extracted")}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-3 h-auto bg-muted/30 hover:bg-muted/40">
                      <span className="flex items-center gap-2 font-semibold">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        Extracted slide text{parsedSlideCount ? ` (${parsedSlideCount})` : ""}
                      </span>
                      {expandedSections.has("extracted") ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 pt-2">
                    <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                      <pre className="whitespace-pre-wrap text-xs text-muted-foreground">
                        {parsedContent.length > 20000
                          ? `${parsedContent.slice(0, 20000)}\n\n… (truncated)`
                          : parsedContent}
                      </pre>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

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

              {/* Accept Changes Button - Primary CTA */}
              <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Ready to apply improvements?
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Generate improved slides with all suggestions integrated and speaker notes included.
                      </p>
                    </div>
                    <Button
                      onClick={handleAcceptChanges}
                      disabled={isGeneratingSlides}
                      className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      size="lg"
                    >
                      {isGeneratingSlides ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Accept Changes
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAnalysis(null);
                    setParsedContent("");
                    setParsedSlideCount(null);
                    setSelectedFileName(null);
                    setTalkingNotes(null);
                    setShowNotesView(false);
                    setImprovedPresentation(null);
                    setShowSlidesView(false);
                  }}
                  className="flex-1 gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Analyze Another
                </Button>
                <Button
                  onClick={handleGenerateTalkingNotes}
                  disabled={isGeneratingNotes}
                  className="flex-1 gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isGeneratingNotes ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating Notes...
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Generate Talking Notes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
