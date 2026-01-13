import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { 
  Sparkles,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export const AccountStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, opportunities, generatedPlan } = data;

  // Get customer priorities and strategic opportunities
  const customerPriorities = strategy.ceoBoardPriorities.slice(0, 4);
  const strategicOpportunities = opportunities.opportunities.slice(0, 4);

  const isAIGenerated = !!generatedPlan?.fy1Retrospective || !!generatedPlan?.strategicAlignment;
  const hasData = customerPriorities.length > 0 || strategicOpportunities.length > 0;

  // Build focus areas from data
  const focusAreas = [
    {
      title: customerPriorities[0]?.title || "Customer & Commercial Transformation",
      description: customerPriorities[0]?.description || "Deliver scalable, orchestrated customer service and commercial execution foundation that reduces cost-to-serve and enables growth.",
      whyNow: "The decision window is live. This is the moment to expand from replacement to end-to-end orchestration."
    },
    {
      title: customerPriorities[1]?.title || "Operationalising AI",
      description: customerPriorities[1]?.description || "Move AI beyond isolated use cases to improve execution speed, decision quality, and productivity across workflows.",
      whyNow: "AI-first ambition is clear, but current value is constrained. This is the inflection point to embed AI in workflows."
    },
    {
      title: strategicOpportunities[0]?.title || "Expanding the Platform Beyond IT",
      description: strategicOpportunities[0]?.description || "Broaden platform adoption beyond IT, using customer and service workflows as the entry point for enterprise-wide orchestration.",
      whyNow: "Scaling integrated logistics requires a common orchestration layer. The right time to converge on one platform direction."
    },
    {
      title: strategicOpportunities[1]?.title || "Maturing The Strategic Partnership",
      description: strategicOpportunities[1]?.description || "Evolve the relationship toward long-term strategic partner underpinning digital, AI, and operating model ambition.",
      whyNow: "The relationship has moved from recovery to renewed confidence. The window to shift to strategic partnership model."
    }
  ];

  // How we'll win statements
  const howWeWin = [
    `Align executives around a single narrative: Integrator Strategy → Digital Backbone → AI-first execution → customer and productivity outcomes.`,
    `Sequence initiatives to protect continuity: stabilise foundations, then scale orchestration, then embed AI across priority workflows.`,
    `Focus value on cost-to-serve reduction and capacity release, measured through cycle time, automation rate, and service performance.`,
    `Co-create a multi-year roadmap and governance model that reduces delivery risk and accelerates adoption across business domains.`
  ];

  // Vision statement
  const vision = basics.accountName 
    ? `Our vision is to build the digital backbone that powers ${basics.accountName}'s transformation strategy, enabling AI-first execution at scale and delivering measurable improvements in customer cost, experience, and growth across a connected global network.`
    : "Our vision is to build the digital backbone that powers the customer's transformation strategy, enabling AI-first execution at scale and delivering measurable improvements in customer cost, experience, and growth.";

  return (
    <div className="min-h-screen p-6 md:p-8 pb-28">
      <div className="max-w-7xl mx-auto h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-emerald-400 to-accent bg-clip-text text-transparent">
            Account Strategy FY26
          </h1>
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
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in">
            <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Strategy Data</h3>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
              Complete the Customer Strategy and Opportunities sections in the Input Form to see the strategic alignment view.
            </p>
          </div>
        ) : (
          <>
            {/* Vision Statement */}
            <div className="glass-card p-4 mb-5 border-l-4 border-primary/60">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 px-3 py-1.5 rounded bg-primary/20 border border-primary/30">
                  <span className="text-primary font-bold text-sm">Vision</span>
                </div>
                <p className="text-foreground/90 leading-relaxed text-sm flex-1">
                  {vision}
                </p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-5">
              {/* Left Section - Focus Areas (7 cols) */}
              <div className="col-span-7">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">What FY26 will focus on</h2>
                    <p className="text-xs text-muted-foreground">Strategic priorities driving account growth</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-secondary/80 border border-border/50 text-xs text-muted-foreground font-medium">
                    FY26 account strategy
                  </span>
                </div>

                {/* 2x2 Focus Area Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {focusAreas.map((area, index) => (
                    <div 
                      key={index}
                      className="glass-card p-4 opacity-0 animate-fade-in flex flex-col"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Card Title */}
                      <h3 className="text-primary font-semibold text-sm mb-2 leading-tight">
                        {area.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-foreground/80 text-xs leading-relaxed mb-3 flex-1">
                        {area.description}
                      </p>
                      
                      {/* Why Now Section */}
                      <div className="pt-3 border-t border-border/30">
                        <p className="text-xs">
                          <span className="text-primary font-medium">Why now:</span>{" "}
                          <span className="text-muted-foreground leading-relaxed">{area.whyNow}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Section - How We'll Win + Key Outcomes (5 cols) */}
              <div className="col-span-5 flex flex-col gap-4">
                {/* How We'll Win */}
                <div className="glass-card p-4 flex-1">
                  <h2 className="text-lg font-bold text-foreground mb-4">How We'll Win</h2>
                  <div className="space-y-3">
                    {howWeWin.map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-2 opacity-0 animate-fade-in"
                        style={{ animationDelay: `${400 + index * 100}ms` }}
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-foreground/90 text-xs leading-relaxed">
                          {item.split(/→|:/).map((part, i, arr) => {
                            if (i === arr.length - 1) return part;
                            return (
                              <span key={i}>
                                <span className="font-semibold">{part.trim()}</span>
                                {item.includes('→') ? ' → ' : ': '}
                              </span>
                            );
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Outcomes */}
                <div className="glass-card p-4">
                  <h2 className="text-lg font-bold text-foreground mb-3">Key Outcomes</h2>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-lg bg-secondary/50 border border-border/30">
                      <div className="text-2xl font-bold text-primary mb-1">{customerPriorities.length}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Priorities</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-secondary/50 border border-border/30">
                      <div className="text-2xl font-bold text-accent mb-1">{strategicOpportunities.length}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Focus Areas</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-secondary/50 border border-border/30">
                      <div className="text-2xl font-bold text-emerald-400 mb-1">
                        {Math.min(customerPriorities.length, strategicOpportunities.length)}
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Alignments</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
