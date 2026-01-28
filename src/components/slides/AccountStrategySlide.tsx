import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Sparkles, AlertCircle, CheckCircle, TrendingDown, TrendingUp, Timer } from "lucide-react";

export const AccountStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, opportunities, generatedPlan, accountStrategy } = data;

  const customerPriorities = strategy.ceoBoardPriorities?.slice(0, 4) || [];
  const strategicOpportunities = opportunities.opportunities?.slice(0, 2) || [];
  const isAIGenerated = !!generatedPlan?.strategicAlignment || !!accountStrategy?.strategyNarrative;
  
  // Vision from account strategy or generated
  const vision = accountStrategy?.strategyNarrative || 
    `Our vision is to build the digital backbone that powers ${basics.accountName || "the customer"}'s Integrator Strategy, enabling AI-first execution at scale and delivering measurable improvements in customer cost, experience, and growth across a connected global logistics network.`;

  // Strategic focus areas - What We'll Focus On
  const focusAreas = [
    {
      title: "Lead with CRM",
      description: "Building on the FY25 commercial evaluation to deliver a scalable, orchestrated customer service and commercial execution foundation that reduces cost-to-serve and enables growth",
      whyNow: "The CRM decision window is imminent, and the customer is prioritising cost-to-serve reduction and more consistent customer journeys. FY26 is the moment to expand from CRM replacement to end-to-end customer and commercial orchestration."
    },
    {
      title: "Anchor on AI Governance",
      description: "Operationalising AI beyond isolated use cases to improve execution speed, decision quality, and productivity across customer, commercial, and operational workflows.",
      whyNow: "AI-first ambition is clear, but current value is constrained by isolated use cases and fragmented execution. FY26 is the inflection point to embed AI in workflows with measurable productivity, decision-speed, and service outcomes."
    },
    {
      title: "Expand Beyond IT",
      description: "Broadening platform adoption beyond IT, using customer and service workflows as the entry point to enable enterprise-wide workflow orchestration aligned to Integrator strategy.",
      whyNow: "Scaling integrated logistics and needs a common orchestration layer to connect Ocean, L&S and Terminals. FY26 is the right time to converge on one platform direction, one data model, and repeatable architecture patterns."
    },
    {
      title: "Maturing The Strategic Partnership",
      description: "Evolving the relationship from execution recovery toward long-term strategic partner underpinning digital, AI, and operating model ambition.",
      whyNow: "Trust is re-established, and the focus must shift to long-term, strategic value creation with shared roadmaps, governance, and outcome accountability."
    }
  ];

  // Winning moves - How We'll Win
  const winningMoves = [
    {
      title: "Align Executives on a Single Narrative",
      description: "Integrator Strategy → Digital Backbone → AI-first execution → customer and productivity outcomes"
    },
    {
      title: "Land & Expand Through Quick Wins",
      description: "Prove value fast, build momentum, unlock broader enterprise investment"
    },
    {
      title: "Prove Value Through Visible, Measurable Outcomes",
      description: "Measured through ROI, AI adoption, cycle time, automation rate, and service performance (NPS)."
    },
    {
      title: "Co-create Multi-Year Roadmap and Governance Model",
      description: "Reduce delivery risk and accelerates adoption across business domains."
    }
  ];

  const hasData = customerPriorities.length > 0 || strategicOpportunities.length > 0 || vision;

  return (
    <div className="min-h-screen p-8 md:p-10 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Account Strategy FY26 +
          </h1>
          <div className="flex items-center gap-2">
            <RegenerateSectionButton section="strategicAlignment" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
          </div>
        </div>

        {!hasData ? (
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in">
            <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Strategy Data</h3>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
              Complete the Customer Strategy and Opportunities sections to generate account strategy.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Vision Banner */}
            <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "50ms" }}>
              <div className="flex items-start gap-4">
                <div className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary font-semibold text-sm flex-shrink-0">
                  Vision
                </div>
                <p className="text-foreground leading-relaxed">
                  {vision}
                </p>
              </div>
            </div>

            {/* Main Content - Two Columns */}
            <div className="grid grid-cols-12 gap-5">
              {/* Left Column - What We'll Focus On */}
              <div className="col-span-7 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">What We'll Focus On</span>
                  <div className="flex-1 h-px bg-primary/30" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {focusAreas.map((area, index) => (
                    <div 
                      key={index}
                      className="glass-card p-4 opacity-0 animate-fade-in"
                      style={{ animationDelay: `${100 + index * 50}ms` }}
                    >
                      <h3 className="text-foreground font-semibold text-sm mb-2">{area.title}</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                        {area.description}
                      </p>
                      <div className="pt-3 border-t border-border/30">
                        <p className="text-xs">
                          <span className="text-amber-400 font-semibold">Why now:</span>{" "}
                          <span className="text-muted-foreground">{area.whyNow}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - How We'll Win */}
              <div className="col-span-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">How We'll Win</span>
                  <div className="flex-1 h-px bg-primary/30" />
                </div>

                <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
                  <div className="space-y-4">
                    {winningMoves.map((move, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-foreground font-medium text-sm">{move.title}</p>
                          <p className="text-muted-foreground text-xs mt-1">{move.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target Metrics */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="glass-card p-4 text-center opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingDown className="w-4 h-4 text-primary" />
                      <span className="text-lg font-bold text-primary">%</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase">Cost Reduction</p>
                  </div>
                  <div className="glass-card p-4 text-center opacity-0 animate-fade-in" style={{ animationDelay: "350ms" }}>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-lg font-bold text-primary">%</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase">Automation & AI</p>
                  </div>
                  <div className="glass-card p-4 text-center opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Timer className="w-4 h-4 text-primary" />
                      <span className="text-lg font-bold text-primary">%</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase">Faster Cycles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
