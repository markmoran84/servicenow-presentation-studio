import { useAccountData, StrategicPillar } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { SlideFooter } from "@/components/SlideFooter";
import { Anchor, Cpu, Users, Zap, LucideIcon, ArrowRight, Sparkles, Info, Target, Eye } from "lucide-react";

const iconMap: Record<StrategicPillar["icon"], LucideIcon> = {
  network: Anchor,
  customer: Users,
  technology: Cpu,
  efficiency: Zap,
};

const pillarStyles = [
  { gradient: "from-primary/30 via-primary/15 to-transparent", border: "border-primary/50", iconBg: "bg-gradient-to-br from-primary/30 to-primary/20", iconColor: "text-primary" },
  { gradient: "from-emerald-500/30 via-emerald-500/15 to-transparent", border: "border-emerald-500/50", iconBg: "bg-gradient-to-br from-emerald-500/30 to-emerald-500/20", iconColor: "text-emerald-400" },
  { gradient: "from-purple-500/30 via-purple-500/15 to-transparent", border: "border-purple-500/50", iconBg: "bg-gradient-to-br from-purple-500/30 to-purple-500/20", iconColor: "text-purple-400" },
  { gradient: "from-amber-500/30 via-amber-500/15 to-transparent", border: "border-amber-500/50", iconBg: "bg-gradient-to-br from-amber-500/30 to-amber-500/20", iconColor: "text-amber-400" },
];

export const ExecutiveSummarySlide = () => {
  const { data } = useAccountData();
  const { basics, annualReport, generatedPlan } = data;

  const companyName = basics.accountName?.trim() 
    ? basics.accountName.split(" ").pop()?.toUpperCase() 
    : null;
  
  // Get layout metadata for dynamic styling
  const layoutMetadata = generatedPlan?.layoutMetadata as { style?: string; colorScheme?: string } | undefined;
  const layoutStyle = layoutMetadata?.style || "bold";
  
  const pillars = generatedPlan?.executiveSummaryPillars || annualReport.strategicPillars || [];
  const narrative = generatedPlan?.executiveSummaryNarrative || annualReport.executiveSummaryNarrative;
  const isAIGenerated = !!generatedPlan?.executiveSummaryPillars;

  const hasContent = pillars.length > 0 || narrative;
  
  // Dynamic styles based on layout style
  const getHeaderStyle = () => {
    switch (layoutStyle) {
      case "elegant": return "text-3xl md:text-4xl lg:text-5xl";
      case "minimal": return "text-3xl md:text-4xl";
      case "bold": return "text-4xl md:text-5xl lg:text-6xl";
      default: return "text-4xl md:text-5xl lg:text-6xl";
    }
  };

  return (
    <div className="h-full p-6 md:p-10 pb-16 relative overflow-hidden flex flex-col">
      {/* Background gradient accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[900px] h-[600px] bg-gradient-to-bl from-primary/6 via-cyan-500/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[500px] bg-gradient-to-tr from-emerald-500/6 via-teal-500/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/4 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 opacity-0 animate-fade-in">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/40 text-primary text-xs font-semibold">
                Executive Summary
              </span>
              <RegenerateSectionButton section="executiveSummary" />
              {isAIGenerated && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 text-xs text-accent font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Generated
                </span>
              )}
            </div>
            <h1 className={`${getHeaderStyle()} font-bold leading-tight`}>
              {companyName ? (
                <>
                  <span className="text-foreground">Delivering </span>
                  <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent">{companyName}</span>
                  <span className="text-foreground"> Forward</span>
                </>
              ) : (
                <span className="bg-gradient-to-r from-primary via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Executive Summary</span>
              )}
            </h1>
            <p className="text-muted-foreground text-lg mt-2 max-w-2xl">
              {hasContent 
                ? "Strategic vision and transformation pillars" 
                : "Generate with AI to create your executive summary"}
            </p>
          </div>
        </div>

        {!hasContent ? (
          <div 
            className="glass-card p-16 text-center border border-slate-600/30 opacity-0 animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            <div className="w-20 h-20 rounded-2xl bg-muted/10 flex items-center justify-center mx-auto mb-6 border border-muted/20">
              <Info className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">No Executive Summary Generated</h3>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Complete the Input Form with account details and click <span className="font-medium text-foreground">Generate with AI</span> to create an executive summary with strategic pillars.
            </p>
          </div>
        ) : (
          <>
            {/* Strategic Vision Card */}
            {narrative && (
              <div 
                className="glass-card p-6 mb-8 border border-primary/30 bg-gradient-to-br from-slate-800/90 via-primary/5 to-slate-900/70 shadow-xl shadow-primary/5 opacity-0 animate-fade-in"
                style={{ animationDelay: '100ms' }}
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30">
                    <Eye className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-primary to-primary/60" />
                      <h3 className="text-xl font-bold text-foreground">Strategic Vision</h3>
                    </div>
                    <p className="text-foreground/90 leading-relaxed text-base pl-5">
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
                      className={`glass-card p-6 border ${style.border} bg-gradient-to-br from-slate-800/90 to-slate-900/70 
                                  hover:scale-[1.01] hover:shadow-xl transition-all duration-300 opacity-0 animate-fade-in`}
                      style={{ animationDelay: `${150 + index * 80}ms` }}
                    >
                      <div className="flex items-start gap-5">
                        <div className={`w-14 h-14 rounded-xl ${style.iconBg} flex items-center justify-center flex-shrink-0 border border-white/10`}>
                          <IconComponent className={`w-7 h-7 ${style.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold mb-1.5">
                            <span className={style.iconColor}>{pillar.keyword}</span>
                            <span className="text-foreground ml-2">{pillar.title}</span>
                          </h3>
                          <p className="text-sm font-semibold text-accent/80 mb-3">{pillar.tagline}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                            {pillar.description}
                          </p>
                          <div className="pt-4 border-t border-slate-600/40">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                <Target className="w-3.5 h-3.5 text-emerald-400" />
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground font-medium">Outcome:</span>
                                <span className="text-sm font-semibold text-foreground ml-2">{pillar.outcome}</span>
                              </div>
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
      <SlideFooter />
    </div>
  );
};
