import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { 
  Sparkles,
  ArrowRight,
  AlertCircle,
  Users,
  Target,
  Zap,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

export const AccountStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, opportunities, engagement, generatedPlan } = data;

  const customerPriorities = strategy.ceoBoardPriorities.slice(0, 4);
  const strategicOpportunities = opportunities.opportunities.slice(0, 4);
  const executives = engagement.knownExecutiveSponsors?.slice(0, 3) || [];

  const isAIGenerated = !!generatedPlan?.fy1Retrospective || !!generatedPlan?.strategicAlignment;
  const hasData = customerPriorities.length > 0 || strategicOpportunities.length > 0;

  // Build focus areas from actual data
  const focusAreas = [
    {
      title: customerPriorities[0]?.title || "Customer & Commercial Transformation",
      description: customerPriorities[0]?.description || "Deliver scalable, orchestrated customer service and commercial execution foundation.",
      whyNow: "Decision window is live. Time to expand from replacement to end-to-end orchestration."
    },
    {
      title: customerPriorities[1]?.title || "Operationalising AI",
      description: customerPriorities[1]?.description || "Move AI beyond isolated use cases to improve execution speed and decision quality.",
      whyNow: "AI-first ambition is clear. This is the inflection point to embed AI in workflows."
    },
    {
      title: strategicOpportunities[0]?.title || "Platform Expansion Beyond IT",
      description: strategicOpportunities[0]?.description || "Broaden platform adoption using customer and service workflows as the entry point.",
      whyNow: "Scaling integrated operations requires a common orchestration layer."
    },
    {
      title: strategicOpportunities[1]?.title || "Strategic Partnership Maturity",
      description: strategicOpportunities[1]?.description || "Evolve toward long-term strategic partner underpinning digital and AI ambition.",
      whyNow: "Relationship has renewed confidence. Window to shift to strategic partnership."
    }
  ];

  // Executive engagement narrative
  const executiveNarrative = [
    {
      action: "Align executives around a single narrative",
      details: "Integrator Strategy → Digital Backbone → AI-first execution → customer outcomes"
    },
    {
      action: "Sequence initiatives to protect continuity", 
      details: "Stabilise foundations, then scale orchestration, then embed AI across priority workflows"
    },
    {
      action: "Focus value on cost-to-serve reduction",
      details: "Measured through cycle time, automation rate, and service performance"
    },
    {
      action: "Co-create multi-year roadmap",
      details: "Governance model that reduces delivery risk and accelerates adoption across domains"
    }
  ];

  const keyOutcomes = [
    { label: "Cost Reduction", metric: "20-30%", sublabel: "cost-to-serve" },
    { label: "Automation", metric: "40%+", sublabel: "process automation" },
    { label: "Cycle Time", metric: "50%", sublabel: "reduction target" },
  ];

  const vision = basics.accountName 
    ? `Build the digital backbone that powers ${basics.accountName}'s transformation strategy, enabling AI-first execution at scale and delivering measurable improvements in customer cost, experience, and growth.`
    : "Build the digital backbone that powers the customer's transformation strategy, enabling AI-first execution at scale and delivering measurable improvements.";

  return (
    <div className="min-h-screen p-6 md:p-8 pb-28">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-emerald-400 to-accent bg-clip-text text-transparent">
              Account Strategy FY26
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Strategic priorities driving account growth</p>
          </div>
          <div className="flex items-center gap-2">
            <RegenerateSectionButton section="executiveSummary" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
                <Sparkles className="w-3 h-3" />
                AI Enhanced
              </span>
            )}
          </div>
        </div>

        {!hasData ? (
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in flex-1 flex items-center justify-center">
            <div>
              <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Strategy Data</h3>
              <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
                Complete the Customer Strategy and Opportunities sections to see the strategic alignment view.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-5">
            {/* Vision Banner */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border border-primary/20 p-5">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
              <div className="relative flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Vision</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                  </div>
                  <p className="text-foreground leading-relaxed text-sm">
                    {vision}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-12 gap-5 flex-1">
              {/* Left: Focus Areas */}
              <div className="col-span-7 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-lg font-bold text-foreground">What FY26 Will Focus On</h2>
                  <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium">
                    4 Strategic Pillars
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 flex-1">
                  {focusAreas.map((area, index) => (
                    <div 
                      key={index}
                      className="group relative overflow-hidden rounded-xl bg-secondary/40 border border-border/50 p-4 opacity-0 animate-fade-in hover:border-primary/30 transition-all duration-300"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent opacity-60" />
                      
                      <div className="flex items-start gap-2 mb-2">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                          {index + 1}
                        </span>
                        <h3 className="text-primary font-semibold text-sm leading-tight">
                          {area.title}
                        </h3>
                      </div>
                      
                      <p className="text-foreground/80 text-xs leading-relaxed mb-3 pl-7">
                        {area.description}
                      </p>
                      
                      <div className="pt-2 border-t border-border/30 pl-7">
                        <p className="text-[11px]">
                          <span className="text-primary font-semibold">Why now:</span>{" "}
                          <span className="text-muted-foreground">{area.whyNow}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: How We'll Win + Outcomes */}
              <div className="col-span-5 flex flex-col gap-4">
                {/* How We'll Win */}
                <div className="flex-1 rounded-xl bg-gradient-to-br from-secondary/60 to-secondary/30 border border-border/50 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-emerald-500 flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-foreground">How We'll Win</h2>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Executive Engagement Strategy</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {executiveNarrative.map((item, index) => (
                      <div 
                        key={index}
                        className="opacity-0 animate-fade-in"
                        style={{ animationDelay: `${400 + index * 80}ms` }}
                      >
                        <div className="flex items-start gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-foreground font-medium text-xs">{item.action}</p>
                            <p className="text-muted-foreground text-[11px] leading-relaxed mt-0.5">
                              {item.details}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Executive Sponsors */}
                  {executives.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border/30">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Key Sponsors</p>
                      <div className="flex flex-wrap gap-2">
                        {executives.map((exec: any, i) => (
                          <span key={i} className="px-2 py-1 rounded-md bg-accent/10 border border-accent/20 text-[10px] text-accent">
                            {exec.name || exec} • {exec.title || "Executive"}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Key Outcomes */}
                <div className="rounded-xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-border/50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold text-foreground">Key Outcomes</h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {keyOutcomes.map((outcome, index) => (
                      <div 
                        key={index}
                        className="text-center p-3 rounded-lg bg-secondary/60 border border-border/30 opacity-0 animate-fade-in"
                        style={{ animationDelay: `${600 + index * 80}ms` }}
                      >
                        <div className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          {outcome.metric}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-1">
                          {outcome.sublabel}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status */}
            <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/30 border border-border/30">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Strategic positioning for {basics.accountName || "target account"} • FY26
              </div>
              <div className="flex items-center gap-2 text-primary text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Strategy Aligned
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
