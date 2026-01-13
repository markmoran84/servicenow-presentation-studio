import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { SectionHeader } from "@/components/SectionHeader";
import { AlertTriangle, TrendingUp, Shield, Target, Info, Sparkles } from "lucide-react";

const getSeverityColor = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case "high": return "bg-destructive/20 text-destructive border-destructive/30";
    case "medium": return "bg-warning/20 text-warning border-warning/30";
    default: return "bg-muted text-muted-foreground";
  }
};

export const RiskOpportunitySlide = () => {
  const { data } = useAccountData();
  const { generatedPlan, basics } = data;
  const companyName = basics.accountName || "the customer";

  // Use AI-generated risks and opportunities if available
  const riskOpportunityMatrix = generatedPlan?.riskOpportunityMatrix;
  const isAIGenerated = !!riskOpportunityMatrix;
  
  const items = riskOpportunityMatrix?.items || [];
  const narrative = riskOpportunityMatrix?.narrative || "";
  
  const risks = items.filter(item => item.type === "risk");
  const opportunities = items.filter(item => item.type === "opportunity");
  
  const hasContent = items.length > 0;

  return (
    <div className="h-full overflow-auto px-8 pt-6 pb-32">
      <div className="flex items-center justify-between mb-6 opacity-0 animate-fade-in">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">Risk & Opportunity Matrix</h1>
        </div>
        <div className="flex items-center gap-2">
          <RegenerateSectionButton section="riskOpportunityMatrix" />
          {isAIGenerated && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
              <Sparkles className="w-3 h-3" />
              AI Generated
            </span>
          )}
        </div>
      </div>

      {hasContent ? (
        <>
          {/* Narrative */}
          {narrative && (
            <div className="glass-card p-6 mb-6 border-l-4 border-l-primary opacity-0 animate-fade-in" style={{ animationDelay: "50ms" }}>
              <p className="text-foreground/90">{narrative}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            {/* Risks */}
            <div className="glass-card p-6">
              <SectionHeader
                title="Key Risks"
                description="Barriers to navigate for strategic success"
                delay={100}
              />

              <div className="mt-5 space-y-3">
                {risks.length > 0 ? risks.map((risk, index) => (
                  <div
                    key={risk.title}
                    className="p-4 rounded-xl bg-secondary/30 border border-border/30 opacity-0 animate-fade-in"
                    style={{ animationDelay: `${200 + index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        <h4 className="font-semibold text-foreground">{risk.title}</h4>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${getSeverityColor(risk.impact)}`}>
                        {risk.impact}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <span>Likelihood: {risk.likelihood}</span>
                    </div>
                    {risk.mitigation && (
                      <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/5">
                        <Shield className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">{risk.mitigation}</p>
                      </div>
                    )}
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">No risks identified.</p>
                )}
              </div>
            </div>

            {/* Opportunities */}
            <div className="glass-card p-6">
              <SectionHeader
                title="Opportunities"
                description={`Value creation potential aligned to ${companyName} priorities`}
                delay={150}
              />

              <div className="mt-5 space-y-3">
                {opportunities.length > 0 ? opportunities.map((opp, index) => (
                  <div
                    key={opp.title}
                    className="p-4 rounded-xl bg-secondary/30 border border-border/30 opacity-0 animate-fade-in group hover:border-accent/30 transition-all"
                    style={{ animationDelay: `${250 + index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-accent" />
                        <h4 className="font-semibold text-foreground">{opp.title}</h4>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded border bg-accent/20 text-accent border-accent/30`}>
                        {opp.impact} Impact
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Likelihood: {opp.likelihood}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">No opportunities identified.</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Risk & Opportunity Analysis Generated</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Complete the Input Form with account details and click <span className="font-medium text-foreground">Generate with AI</span> to create a risk and opportunity matrix tailored to {companyName}.
          </p>
        </div>
      )}
    </div>
  );
};
