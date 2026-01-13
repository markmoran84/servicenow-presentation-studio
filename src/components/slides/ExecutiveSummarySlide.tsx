import { useAccountData, StrategicPillar } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Anchor, Cpu, Users, Zap, LucideIcon, ArrowRight, Sparkles, Info } from "lucide-react";

const iconMap: Record<StrategicPillar["icon"], LucideIcon> = {
  network: Anchor,
  customer: Users,
  technology: Cpu,
  efficiency: Zap,
};

const pillarStyles = [
  { gradient: "from-primary/20 via-primary/10 to-transparent", border: "border-l-primary", iconBg: "bg-primary/15" },
  { gradient: "from-accent/20 via-accent/10 to-transparent", border: "border-l-accent", iconBg: "bg-accent/15" },
  { gradient: "from-purple-500/20 via-purple-500/10 to-transparent", border: "border-l-purple-500", iconBg: "bg-purple-500/15" },
  { gradient: "from-amber-500/20 via-amber-500/10 to-transparent", border: "border-l-amber-500", iconBg: "bg-amber-500/15" },
];

export const ExecutiveSummarySlide = () => {
  const { data } = useAccountData();
  const { basics, annualReport, generatedPlan } = data;

  const companyName = basics.accountName?.trim() 
    ? basics.accountName.split(" ").pop()?.toUpperCase() 
    : null;
  
  const pillars = generatedPlan?.executiveSummaryPillars || annualReport.strategicPillars || [];
  const narrative = generatedPlan?.executiveSummaryNarrative || annualReport.executiveSummaryNarrative;
  const isAIGenerated = !!generatedPlan?.executiveSummaryPillars;

  const hasContent = pillars.length > 0 || narrative;

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="mb-4 opacity-0 animate-fade-in flex items-center gap-3">
              <span className="badge-primary">
                Executive Summary
              </span>
              <RegenerateSectionButton section="executiveSummary" />
              {isAIGenerated && (
                <span className="badge-accent">
                  <Sparkles className="w-3 h-3 mr-1.5" />
                  AI Generated
                </span>
              )}
            </div>
            <h1 
              className="slide-title mb-3 opacity-0 animate-fade-in"
              style={{ animationDelay: '50ms' }}
            >
              {companyName ? (
                <>
                  <span className="text-foreground">Delivering </span>
                  <span className="text-primary">{companyName}</span>
                  <span className="text-foreground"> Forward</span>
                </>
              ) : (
                <span className="text-foreground">Executive Summary</span>
              )}
            </h1>
            <p 
              className="slide-subtitle max-w-2xl opacity-0 animate-fade-in"
              style={{ animationDelay: '100ms' }}
            >
              {hasContent 
                ? "Strategic vision and transformation pillars" 
                : "Generate with AI to create your executive summary"}
            </p>
          </div>
        </div>

        {!hasContent ? (
          <div className="glass-card rounded-2xl p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "150ms" }}>
            <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Executive Summary Generated</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Complete the Input Form with account details and click <span className="font-medium text-foreground">Generate with AI</span> to create an executive summary with strategic pillars.
            </p>
          </div>
        ) : (
          <>
            {/* Strategic Vision Card */}
            {narrative && (
              <div 
                className="glass-card p-6 mb-8 border-l-4 border-l-primary opacity-0 animate-fade-in"
                style={{ animationDelay: '150ms' }}
              >
                <div className="flex items-start gap-5">
                  <div className="icon-box flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="card-title mb-2">Strategic Vision</h3>
                    <p className="text-foreground/80 leading-relaxed text-[15px]">
                      {narrative}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Four Pillars Grid */}
            {pillars.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {pillars.map((pillar, index) => {
                  const IconComponent = iconMap[pillar.icon] || Anchor;
                  const style = pillarStyles[index % pillarStyles.length];
                  return (
                    <div 
                      key={pillar.title}
                      className={`glass-card p-6 border-l-4 ${style.border} opacity-0 animate-fade-in hover:scale-[1.01] transition-all duration-300`}
                      style={{ animationDelay: `${200 + index * 75}ms` }}
                    >
                      <div className="flex items-start gap-5">
                        <div className={`w-12 h-12 rounded-xl ${style.iconBg} flex items-center justify-center flex-shrink-0 border border-white/5`}>
                          <IconComponent className="w-6 h-6 text-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold mb-1.5">
                            <span className="text-primary">{pillar.keyword}</span>
                            <span className="text-foreground ml-2">{pillar.title}</span>
                          </h3>
                          <p className="text-sm font-medium text-accent mb-3">{pillar.tagline}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                            {pillar.description}
                          </p>
                          <div className="pt-3 border-t border-border/50">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground font-medium">Outcome:</span>
                              <span className="text-xs font-semibold text-foreground">{pillar.outcome}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
