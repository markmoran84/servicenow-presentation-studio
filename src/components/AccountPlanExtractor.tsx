import { useState, useRef } from "react";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Loader2, 
  CheckCircle2, 
  FileText,
  Building2,
  Target,
  Users,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAccountData } from "@/context/AccountDataContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ExtractedField {
  category: string;
  icon: React.ElementType;
  fields: { label: string; value: string | string[] }[];
}

interface AccountPlanExtractorProps {
  onDataExtracted?: () => void;
}

export const AccountPlanExtractor = ({ onDataExtracted }: AccountPlanExtractorProps) => {
  const { updateData } = useAccountData();
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionComplete, setExtractionComplete] = useState(false);
  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>([]);
  const [progress, setProgress] = useState(0);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const parsePptxInBrowser = async (file: File): Promise<string> => {
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

    for (const slideFile of slideFiles) {
      const xml = await zip.file(slideFile)?.async("string");
      if (!xml) continue;
      const slideText = extractTextFromPptxXml(xml);
      if (slideText.trim()) {
        const slideNum = slideFile.match(/slide(\d+)\.xml/)?.[1] || "?";
        slideTexts.push(`[Slide ${slideNum}]\n${slideText}`);
      }
    }

    return slideTexts.join("\n\n").trim().slice(0, 100000);
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

    const maxSize = 150 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File too large. Maximum size is 150MB.`);
      return;
    }

    setIsExtracting(true);
    setExtractionComplete(false);
    setExtractedFields([]);
    setProgress(10);

    try {
      toast.loading("Extracting content from your account plan...", { id: "extract-plan" });
      setProgress(30);

      // Parse PowerPoint content
      let content = "";
      if (fileName.endsWith(".pptx")) {
        content = await parsePptxInBrowser(file);
      } else {
        // For .ppt files, upload and use backend
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
        const storageName = `${Date.now()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("annual-reports")
          .upload(storageName, file);

        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

        const { data: parseData, error: parseError } = await supabase.functions.invoke("parse-document", {
          body: { filePath: storageName, fileType: "ppt" },
        });

        if (parseError) throw parseError;
        content = parseData?.content || "";

        await supabase.storage.from("annual-reports").remove([storageName]);
      }

      if (!content || content.length < 50) {
        throw new Error("Could not extract meaningful text from the PowerPoint.");
      }

      setProgress(60);
      toast.loading("Analyzing account plan with AI...", { id: "extract-plan" });

      // Use the annual report analyzer to extract structured data
      const { data: responseData, error } = await supabase.functions.invoke("analyze-annual-report", {
        body: { 
          content,
          accountContext: {},
          extractMode: "account-plan" // Tell it we're extracting from an existing plan
        }
      });

      if (error) throw error;
      if (!responseData.success) throw new Error(responseData.error || "Extraction failed");

      setProgress(90);

      const extracted = responseData.data;
      const fieldsExtracted: ExtractedField[] = [];

      // Update Company Basics
      if (extracted.accountName || extracted.industry) {
        updateData("basics", {
          ...(extracted.accountName && { accountName: extracted.accountName }),
          ...(extracted.industry && { industry: extracted.industry }),
        });
        fieldsExtracted.push({
          category: "Company Basics",
          icon: Building2,
          fields: [
            ...(extracted.accountName ? [{ label: "Company Name", value: extracted.accountName }] : []),
            ...(extracted.industry ? [{ label: "Industry", value: extracted.industry }] : []),
          ]
        });
      }

      // Update Financial
      if (extracted.revenue || extracted.growthRate) {
        updateData("financial", {
          ...(extracted.revenue && { customerRevenue: extracted.revenue }),
          ...(extracted.growthRate && { growthRate: extracted.growthRate }),
        });
        fieldsExtracted.push({
          category: "Financial Data",
          icon: TrendingUp,
          fields: [
            ...(extracted.revenue ? [{ label: "Revenue", value: extracted.revenue }] : []),
            ...(extracted.growthRate ? [{ label: "Growth Rate", value: extracted.growthRate }] : []),
          ]
        });
      }

      // Update Strategy
      if (extracted.corporateStrategy?.length || extracted.digitalStrategies?.length) {
        updateData("strategy", {
          ...(extracted.corporateStrategy?.length && { 
            corporateStrategy: extracted.corporateStrategy.map((item: any) => ({
              title: item.title || "",
              description: item.description || ""
            }))
          }),
          ...(extracted.digitalStrategies?.length && { 
            digitalStrategies: extracted.digitalStrategies.map((item: any) => ({
              title: item.title || "",
              description: item.description || ""
            }))
          }),
        });
        fieldsExtracted.push({
          category: "Strategy",
          icon: Target,
          fields: [
            ...(extracted.corporateStrategy?.length ? [{ 
              label: "Corporate Strategies", 
              value: extracted.corporateStrategy.map((s: any) => s.title) 
            }] : []),
            ...(extracted.digitalStrategies?.length ? [{ 
              label: "Digital Strategies", 
              value: extracted.digitalStrategies.map((s: any) => s.title) 
            }] : []),
          ]
        });
      }

      // Update Pain Points & Opportunities
      if (extracted.painPoints?.length) {
        updateData("painPoints", {
          painPoints: extracted.painPoints.map((pp: any) => ({
            title: pp.title || "",
            description: pp.description || ""
          }))
        });
      }
      if (extracted.opportunities?.length) {
        updateData("opportunities", {
          opportunities: extracted.opportunities.map((op: any) => ({
            title: op.title || "",
            description: op.description || ""
          }))
        });
      }
      if (extracted.painPoints?.length || extracted.opportunities?.length) {
        fieldsExtracted.push({
          category: "Pain Points & Opportunities",
          icon: AlertCircle,
          fields: [
            ...(extracted.painPoints?.length ? [{ 
              label: "Pain Points", 
              value: extracted.painPoints.map((p: any) => p.title) 
            }] : []),
            ...(extracted.opportunities?.length ? [{ 
              label: "Opportunities", 
              value: extracted.opportunities.map((o: any) => o.title) 
            }] : []),
          ]
        });
      }

      // Update SWOT
      if (extracted.strengths?.length || extracted.weaknesses?.length) {
        updateData("swot", {
          ...(extracted.strengths?.length && { strengths: extracted.strengths }),
          ...(extracted.weaknesses?.length && { weaknesses: extracted.weaknesses }),
          ...(extracted.swotOpportunities?.length && { opportunities: extracted.swotOpportunities }),
          ...(extracted.threats?.length && { threats: extracted.threats }),
        });
      }

      setProgress(100);
      setExtractedFields(fieldsExtracted);
      setExtractionComplete(true);
      toast.success("Account plan data extracted successfully!", { id: "extract-plan" });
      onDataExtracted?.();

    } catch (error) {
      console.error("Extraction error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to extract data", { id: "extract-plan" });
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card 
        className={cn(
          "border-2 border-dashed transition-all cursor-pointer hover:border-primary/50 hover:bg-muted/30",
          selectedFileName && "border-primary/30 bg-primary/5"
        )}
        onClick={() => !isExtracting && fileInputRef.current?.click()}
      >
        <CardContent className="pt-8 pb-8">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pptx,.ppt"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isExtracting}
          />
          
          <div className="flex flex-col items-center gap-4 text-center">
            {isExtracting ? (
              <>
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <div className="space-y-2 w-full max-w-xs">
                  <p className="font-medium">Extracting data from your account plan...</p>
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground">{progress}% complete</p>
                </div>
              </>
            ) : extractionComplete ? (
              <>
                <CheckCircle2 className="w-12 h-12 text-green-500" />
                <div>
                  <p className="font-medium text-green-600">Data extracted successfully!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedFileName}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 rounded-full bg-primary/10">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Upload your existing account plan</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PowerPoint files (.pptx, .ppt) up to 150MB
                  </p>
                </div>
                <Button variant="outline" className="mt-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Select PowerPoint File
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Extracted Data Summary */}
      {extractionComplete && extractedFields.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold">Extracted Data</h3>
              <Badge variant="secondary" className="ml-auto">
                {extractedFields.reduce((acc, f) => acc + f.fields.length, 0)} fields
              </Badge>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {extractedFields.map((category, idx) => {
                const Icon = category.icon;
                return (
                  <div key={idx} className="p-3 rounded-lg bg-muted/50 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Icon className="w-4 h-4 text-primary" />
                      {category.category}
                    </div>
                    <div className="space-y-1">
                      {category.fields.map((field, fIdx) => (
                        <div key={fIdx} className="text-xs">
                          <span className="text-muted-foreground">{field.label}: </span>
                          <span className="font-medium">
                            {Array.isArray(field.value) 
                              ? field.value.slice(0, 3).join(", ") + (field.value.length > 3 ? ` +${field.value.length - 3} more` : "")
                              : field.value
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-sm text-muted-foreground mt-4 text-center">
              This data has been pre-filled in your account plan. You can review and edit it in the next steps.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
