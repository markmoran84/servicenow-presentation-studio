import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Target, ArrowRight, Info, Sparkles, CheckCircle2 } from "lucide-react";

export const StrategicAlignmentSlide = () => {
  const { data } = useAccountData();
  const { generatedPlan, basics } = data;
  const companyName = basics.accountName || "the customer";

  // Use AI-generated strategic alignment if available
  const strategicAlignment = generatedPlan?.strategicAlignment;
  const isAIGenerated = !!strategicAlignment;
  const alignments = strategicAlignment?.alignments || [];
  const narrative = strategicAlignment?.narrative || "";
  const hasAlignment = alignments.length > 0;

  return (
    <div className="px-8 pt-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 opacity-0 animate-fade-in">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold text-foreground">Strategic Alignment</h1>
            <p className="text-muted-foreground mt-1">Connecting {companyName} priorities to platform value</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RegenerateSectionButton section="strategicAlignment" />
          {isAIGenerated && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
              <Sparkles className="w-3 h-3" />
              AI Generated
            </span>
          )}
          <div className="pill-badge">
            FY26 Planning
          </div>
        </div>
      </div>

      {hasAlignment ? (
        <>
          {/* Narrative */}
          {narrative && (
            <div className="glass-card p-6 mb-6 border-l-4 border-l-primary opacity-0 animate-fade-in" style={{ animationDelay: "50ms" }}>
              <p className="text-foreground/90">{narrative}</p>
            </div>
          )}

          {/* Alignment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {alignments.slice(0, 4).map((alignment, index) => (
              <div
                key={index}
                className="glass-card p-6 opacity-0 animate-fade-in"
                style={{ animationDelay: `${100 + index * 100}ms` }}
              >
                <div className="grid grid-cols-5 gap-4 items-center">
                  {/* Customer Objective */}
                  <div className="col-span-2 p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-2">
                      Customer Objective
                    </span>
                    <p className="text-sm font-medium text-foreground">{alignment.customerObjective}</p>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <ArrowRight className="w-6 h-6 text-muted-foreground" />
                  </div>

                  {/* ServiceNow Capability */}
                  <div className="col-span-2 p-4 rounded-xl bg-accent/5 border border-accent/20">
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider block mb-2">
                      Platform Capability
                    </span>
                    <p className="text-sm font-medium text-foreground">{alignment.serviceNowCapability}</p>
                  </div>
                </div>

                {/* Outcome */}
                <div className="mt-4 p-3 rounded-lg bg-secondary/30 border border-border/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{alignment.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Connection Flow Indicator */}
          <div className="mt-6 flex items-center justify-center gap-4 opacity-0 animate-fade-in animation-delay-500">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">{companyName} Strategy</span>
              <div className="w-24 h-0.5 bg-gradient-to-r from-primary to-primary/50"></div>
            </div>
            <div className="w-3 h-3 rounded-full bg-primary/50 animate-pulse"></div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-0.5 bg-gradient-to-r from-accent/50 to-accent"></div>
              <span className="text-xs font-medium text-muted-foreground">Platform Value</span>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Strategic Alignment Generated</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Complete the Input Form with account details and click <span className="font-medium text-foreground">Generate with AI</span> to create strategic alignment analysis tailored to {companyName}.
          </p>
        </div>
      )}
    </div>
  );
};
