import { useAccountData, CategorizedRisk } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { ShieldAlert, AlertTriangle, CheckCircle, TrendingDown, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { useMemo } from "react";

// Category colors
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Strategic: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
  Operational: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30" },
  Governance: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
  Commercial: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
};

export const RiskMitigationSlide = () => {
  const { data } = useAccountData();
  const { basics, generatedPlan } = data;

  // Use categorized keyRisks if available, fall back to legacy risksMitigations
  const risks = useMemo(() => {
    if (generatedPlan?.keyRisks && generatedPlan.keyRisks.length > 0) {
      return generatedPlan.keyRisks.map((risk) => ({
        risk: risk.risk,
        mitigation: risk.mitigation,
        level: risk.severity >= 4 ? "High" : risk.severity >= 2 ? "Medium" : "Low",
        category: risk.category,
      }));
    }
    return generatedPlan?.risksMitigations?.slice(0, 8) || [];
  }, [generatedPlan]);

  const isAIGenerated = risks.length > 0;

  const getLevelColor = (level: string) => {
    switch (level) {
      case "High": return { bg: "bg-destructive/20", text: "text-destructive", border: "border-destructive/30", dot: "bg-destructive" };
      case "Medium": return { bg: "bg-amber-500/20", text: "text-amber-500", border: "border-amber-500/30", dot: "bg-amber-500" };
      case "Low": return { bg: "bg-[#61D84E]/20", text: "text-[#61D84E]", border: "border-[#61D84E]/30", dot: "bg-[#61D84E]" };
      default: return { bg: "bg-muted", text: "text-muted-foreground", border: "border-border", dot: "bg-muted-foreground" };
    }
  };

  const hasData = risks.length > 0;

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-destructive/20 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7 text-destructive" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Risk & Mitigation</h1>
            <p className="text-muted-foreground text-lg">
              {basics.accountName ? `Navigating challenges to achieve ${basics.accountName} objectives` : "Navigating challenges to achieve objectives"}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <RegenerateSectionButton section="risksMitigations" />
            {isAIGenerated && (
              <span className="pill-badge bg-accent/20 text-accent border-accent/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
            {hasData && (
              <>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">High</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground">Medium</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Low</span>
                </div>
              </>
            )}
          </div>
        </div>

        {!hasData ? (
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in">
            <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Risks Identified</h3>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
              Generate an AI-powered strategic plan to identify risks and mitigation strategies aligned to your account context.
            </p>
          </div>
        ) : (
          <>
            {/* Risk Cards Grid */}
            <div className="grid grid-cols-2 gap-5">
              {risks.map((riskItem, index) => {
                const colors = getLevelColor(riskItem.level);
                return (
                  <div
                    key={index}
                    className="glass-card overflow-hidden opacity-0 animate-fade-in"
                    style={{ animationDelay: `${100 + index * 100}ms` }}
                  >
                    {/* Risk Header */}
                    <div className="p-5 border-b border-border/50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-destructive" />
                          </div>
                          <h3 className="font-bold text-foreground">{riskItem.risk}</h3>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}>
                          {riskItem.level}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3">
                        <TrendingDown className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Risk Level:</span>
                        <span className={`text-xs font-semibold ${colors.text}`}>{riskItem.level}</span>
                      </div>
                    </div>

                    {/* Mitigation */}
                    <div className="p-5 bg-primary/5">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">Mitigation Strategy</span>
                      </div>
                      <p className="text-sm text-foreground/90 leading-relaxed">{riskItem.mitigation}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Risk Summary Footer */}
            <div className="mt-6 glass-card p-5 flex items-center gap-6 opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Risk Management Approach</h3>
                <p className="text-sm text-muted-foreground">
                  Proactive risk identification with clear ownership. Regular review in governance cadence. 
                  Escalation path to executive sponsors when blockers emerge.
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{risks.length}</p>
                <p className="text-xs text-muted-foreground">Active Risks</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
