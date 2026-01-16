import { useState } from "react";
import { useAccountData } from "@/context/AccountDataContext";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Target, 
  AlertTriangle, 
  Lightbulb, 
  Sparkles, 
  Loader2,
  RefreshCw,
  TrendingUp,
  Shield
} from "lucide-react";

export function StrategyStep() {
  const { data, updateData } = useAccountData();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateStrategy = async () => {
    setIsGenerating(true);
    try {
      const { data: responseData, error } = await supabase.functions.invoke("generate-account-strategy", {
        body: { accountData: data }
      });

      if (error) throw error;
      if (!responseData?.success) throw new Error(responseData?.error || "Failed to generate strategy");

      // Update the strategy fields
      if (responseData.strategy) {
        updateData("strategy", responseData.strategy);
      }
      if (responseData.opportunities) {
        updateData("opportunities", responseData.opportunities);
      }
      if (responseData.painPoints) {
        updateData("painPoints", responseData.painPoints);
      }

      toast.success("Strategy insights generated!");
    } catch (error) {
      console.error("Strategy generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate strategy");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleArrayInput = (section: 'strategy' | 'opportunities' | 'painPoints', field: string, value: string) => {
    const items = value.split("\n").filter((item) => item.trim() !== "").map(item => ({
      title: item.trim(),
      description: ""
    }));
    updateData(section, { [field]: items });
  };

  // Convert items to text for display
  const strategicPriorities = data.strategy?.corporateStrategy?.map(s => s.title).join("\n") || "";
  const opportunities = data.opportunities?.opportunities?.map(o => o.title).join("\n") || "";
  const challenges = data.painPoints?.painPoints?.map(p => p.title).join("\n") || "";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-3">Strategy & Opportunities</h2>
        <p className="text-lg text-muted-foreground">
          Define the strategic context for this account. What are their priorities and where can you help?
        </p>
      </div>

      {/* AI Assist Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleGenerateStrategy} 
          disabled={isGenerating || !data.basics.accountName}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating insights...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Strategy with AI
            </>
          )}
        </Button>
      </div>

      {/* Form */}
      <div className="grid gap-6">
        {/* Customer Strategic Priorities */}
        <Card className="glass-card border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Customer's Strategic Priorities</h3>
                <p className="text-sm text-muted-foreground">What are their top business objectives?</p>
              </div>
            </div>
            
            <Textarea
              value={strategicPriorities}
              onChange={(e) => handleArrayInput("strategy", "corporateStrategy", e.target.value)}
              placeholder="Enter each priority on a new line, e.g.:
• Digital transformation and automation
• Cost reduction and operational efficiency  
• Customer experience improvement
• AI and data analytics adoption"
              rows={5}
              className="resize-none"
            />
          </CardContent>
        </Card>

        {/* Opportunities */}
        <Card className="glass-card border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Growth Opportunities</h3>
                <p className="text-sm text-muted-foreground">Where can you expand and add value?</p>
              </div>
            </div>
            
            <Textarea
              value={opportunities}
              onChange={(e) => handleArrayInput("opportunities", "opportunities", e.target.value)}
              placeholder="Enter each opportunity on a new line, e.g.:
• Expand ITSM to additional business units
• Introduce HR Service Delivery
• Platform consolidation opportunity
• AI/ML use cases for automation"
              rows={5}
              className="resize-none"
            />
          </CardContent>
        </Card>

        {/* Challenges & Risks */}
        <Card className="glass-card border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Challenges & Risks</h3>
                <p className="text-sm text-muted-foreground">What obstacles or concerns exist?</p>
              </div>
            </div>
            
            <Textarea
              value={challenges}
              onChange={(e) => handleArrayInput("painPoints", "painPoints", e.target.value)}
              placeholder="Enter each challenge on a new line, e.g.:
• Budget constraints due to market conditions
• Competing priorities with other initiatives
• Integration complexity concerns
• Change management resistance"
              rows={5}
              className="resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* Helper text */}
      <p className="text-center text-sm text-muted-foreground">
        Use one item per line. AI will use this context to create relevant recommendations in your plan.
      </p>
    </div>
  );
}
