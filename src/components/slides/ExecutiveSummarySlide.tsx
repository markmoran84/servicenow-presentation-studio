import { useAccountData, StrategicPillar } from "@/context/AccountDataContext";
import { Anchor, Cpu, Users, Zap, LucideIcon, ArrowRight, Sparkles } from "lucide-react";

const iconMap: Record<StrategicPillar["icon"], LucideIcon> = {
  network: Anchor,
  customer: Users,
  technology: Cpu,
  efficiency: Zap,
};

const gradientColors = [
  "from-primary/20 to-primary/5",
  "from-accent/20 to-accent/5",
  "from-purple-500/20 to-purple-500/5",
  "from-amber-500/20 to-amber-500/5",
];

const borderColors = [
  "border-l-primary",
  "border-l-accent",
  "border-l-purple-500",
  "border-l-amber-500",
];

export const ExecutiveSummarySlide = () => {
  const { data } = useAccountData();
  const { basics, annualReport, generatedPlan } = data;

  const companyName = basics.accountName.split(" ").pop()?.toUpperCase() || "PARTNER";
  
  // Use AI-generated pillars if available, otherwise fall back to annual report data
  const pillars = generatedPlan?.executiveSummaryPillars || annualReport.strategicPillars || [];
  const narrative = generatedPlan?.executiveSummaryNarrative || annualReport.executiveSummaryNarrative;
  const isAIGenerated = !!generatedPlan?.executiveSummaryPillars;

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header with badge */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="mb-3 opacity-0 animate-fade-in flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-semibold">
                Executive Summary
              </span>
              {isAIGenerated && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
                  <Sparkles className="w-3 h-3" />
                  AI Generated
                </span>
              )}
            </div>
            <h1 
              className="text-5xl md:text-6xl font-bold tracking-tight mb-4 opacity-0 animate-fade-in"
              style={{ animationDelay: '50ms' }}
            >
              <span className="text-foreground">Delivering </span>
              <span className="text-primary">BETTER</span>
              <span className="text-foreground"> {companyName}</span>
            </h1>
            <p 
              className="text-lg text-muted-foreground max-w-2xl opacity-0 animate-fade-in"
              style={{ animationDelay: '100ms' }}
            >
              Executing the integrator strategy with discipline, intelligence, and scale
            </p>
          </div>
        </div>

        {/* Brand Narrative */}
        <div 
          className="glass-card p-6 mb-8 border-l-4 border-l-primary opacity-0 animate-fade-in"
          style={{ animationDelay: '150ms' }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <ArrowRight className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Strategic Vision</h3>
              <p className="text-foreground/80 leading-relaxed">
                {narrative}
              </p>
            </div>
          </div>
        </div>

        {/* Four Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pillars.map((pillar, index) => {
            const IconComponent = iconMap[pillar.icon] || Anchor;
            return (
              <div 
                key={pillar.title}
                className={`glass-card p-6 border-l-4 ${borderColors[index % borderColors.length]} opacity-0 animate-fade-in hover:scale-[1.01] transition-transform duration-300`}
                style={{ animationDelay: `${200 + index * 75}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientColors[index % gradientColors.length]} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">
                      <span className="text-primary">{pillar.keyword}</span>
                      <span className="text-foreground ml-2">{pillar.title}</span>
                    </h3>
                    <p className="text-sm font-medium text-accent mb-3">{pillar.tagline}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {pillar.description}
                    </p>
                    <div className="pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Outcome focus:</span>
                        <span className="text-xs font-medium text-foreground">{pillar.outcome}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
