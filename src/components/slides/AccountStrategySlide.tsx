import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { 
  Sparkles,
  ArrowRight,
  AlertCircle,
  Crosshair,
  Rocket,
  Shield,
  Lightbulb,
} from "lucide-react";

export const AccountStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, opportunities, engagement, generatedPlan } = data;

  const customerPriorities = strategy.ceoBoardPriorities.slice(0, 4);
  const strategicOpportunities = opportunities.opportunities.slice(0, 4);
  const executives = engagement.knownExecutiveSponsors?.slice(0, 3) || [];

  const isAIGenerated = !!generatedPlan?.fy1Retrospective || !!generatedPlan?.strategicAlignment;
  const hasData = customerPriorities.length > 0 || strategicOpportunities.length > 0;

  // Strategic pillars - what we'll focus on
  const strategicPillars = [
    {
      icon: Crosshair,
      title: customerPriorities[0]?.title || "Customer & Commercial Transformation",
      description: customerPriorities[0]?.description || "Deliver scalable, orchestrated customer service and commercial execution foundation.",
      accent: "from-blue-500 to-cyan-400"
    },
    {
      icon: Rocket,
      title: customerPriorities[1]?.title || "Operationalising AI",
      description: customerPriorities[1]?.description || "Move AI beyond isolated use cases to improve execution speed and decision quality.",
      accent: "from-violet-500 to-purple-400"
    },
    {
      icon: Shield,
      title: strategicOpportunities[0]?.title || "Platform Expansion Beyond IT",
      description: strategicOpportunities[0]?.description || "Broaden platform adoption using customer and service workflows as the entry point.",
      accent: "from-emerald-500 to-teal-400"
    },
    {
      icon: Lightbulb,
      title: strategicOpportunities[1]?.title || "Strategic Partnership Maturity",
      description: strategicOpportunities[1]?.description || "Evolve toward long-term strategic partner underpinning digital and AI ambition.",
      accent: "from-amber-500 to-orange-400"
    }
  ];

  // How we'll win - executive engagement approach
  const winningMoves = [
    {
      headline: "Align on a Single Narrative",
      subtext: "Integrator Strategy → Digital Backbone → AI-first execution → Customer outcomes"
    },
    {
      headline: "Sequence to Protect Continuity",
      subtext: "Stabilise foundations, scale orchestration, embed AI across priority workflows"
    },
    {
      headline: "Focus Value on Cost-to-Serve",
      subtext: "Measured through cycle time, automation rate, and service performance"
    },
    {
      headline: "Co-create Multi-Year Roadmap",
      subtext: "Governance model reducing delivery risk and accelerating adoption"
    }
  ];

  const vision = basics.accountName 
    ? `Build the digital backbone that powers ${basics.accountName}'s transformation strategy—enabling AI-first execution at scale.`
    : "Build the digital backbone that powers the customer's transformation strategy—enabling AI-first execution at scale.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 pb-28">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        
        {/* Minimal Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-1 h-12 bg-gradient-to-b from-blue-400 to-emerald-400 rounded-full" />
            <div>
              <h1 className="text-3xl font-light text-white tracking-tight">
                Account Strategy <span className="font-semibold text-blue-400">FY26</span>
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">{basics.accountName || "Strategic Account"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RegenerateSectionButton section="executiveSummary" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400">
                <Sparkles className="w-3 h-3" />
                AI Enhanced
              </span>
            )}
          </div>
        </div>

        {!hasData ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-400 mb-2">No Strategy Data</h3>
              <p className="text-sm text-slate-600 max-w-md">
                Complete the Customer Strategy and Opportunities sections.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-8">
            
            {/* Vision Statement - Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 via-transparent to-emerald-600/20 border border-white/5 p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.15),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(16,185,129,0.15),transparent_50%)]" />
              <div className="relative">
                <div className="text-xs font-medium text-blue-400 uppercase tracking-[0.2em] mb-3">Our Vision</div>
                <p className="text-2xl md:text-3xl font-light text-white leading-relaxed max-w-4xl">
                  {vision}
                </p>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-12 gap-8 flex-1">
              
              {/* Left: Strategic Pillars */}
              <div className="col-span-7">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-[0.15em]">What We'll Focus On</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {strategicPillars.map((pillar, index) => {
                    const Icon = pillar.icon;
                    return (
                      <div 
                        key={index}
                        className="group relative rounded-xl bg-white/[0.02] border border-white/5 p-5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 opacity-0 animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Gradient accent line */}
                        <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${pillar.accent} rounded-t-xl opacity-60 group-hover:opacity-100 transition-opacity`} />
                        
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${pillar.accent} flex items-center justify-center shadow-lg`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-slate-600 text-xs font-mono">{String(index + 1).padStart(2, '0')}</span>
                        </div>
                        
                        <h3 className="text-white font-medium text-sm mb-2 leading-snug">
                          {pillar.title}
                        </h3>
                        
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {pillar.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: How We'll Win */}
              <div className="col-span-5">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-[0.15em]">How We'll Win</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent" />
                </div>

                <div className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/5 p-6">
                  <div className="space-y-5">
                    {winningMoves.map((move, index) => (
                      <div 
                        key={index}
                        className="opacity-0 animate-fade-in"
                        style={{ animationDelay: `${400 + index * 100}ms` }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mt-0.5">
                            <ArrowRight className="w-3 h-3 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{move.headline}</p>
                            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                              {move.subtext}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Executive Sponsors */}
                  {executives.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-white/5">
                      <p className="text-[10px] text-slate-600 uppercase tracking-[0.15em] mb-3">Key Sponsors</p>
                      <div className="flex flex-wrap gap-2">
                        {executives.map((exec: any, i: number) => (
                          <span 
                            key={i} 
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="text-white">{exec.name || exec}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-500">{exec.title || "Executive"}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Target Outcomes - Compact */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { value: "20-30%", label: "Cost Reduction" },
                    { value: "40%+", label: "Automation" },
                    { value: "50%", label: "Faster Cycles" }
                  ].map((outcome, index) => (
                    <div 
                      key={index}
                      className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5 opacity-0 animate-fade-in"
                      style={{ animationDelay: `${700 + index * 80}ms` }}
                    >
                      <div className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        {outcome.value}
                      </div>
                      <div className="text-[10px] text-slate-600 mt-1 uppercase tracking-wider">
                        {outcome.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
