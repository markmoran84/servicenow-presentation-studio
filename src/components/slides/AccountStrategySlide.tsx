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
      title: customerPriorities[0]?.title || "Strengthen customer focus & profitable growth",
      description: customerPriorities[0]?.description || "Deliver scalable, orchestrated customer service and commercial execution foundation.",
      whyNow: "Decision window is live. Time to expand from replacement to end-to-end orchestration.",
      accent: "from-blue-500 to-cyan-400",
      objectives: [
        "Reduce cost-to-serve through workflow automation and digital self-service",
        "Release frontline capacity from manual case handling and rework",
        "Improve service consistency while absorbing volume growth"
      ]
    },
    {
      icon: Rocket,
      title: customerPriorities[1]?.title || "Drive operational excellence across the network",
      description: customerPriorities[1]?.description || "Reduce manual coordination and exception handling across Ocean, L&S, and Terminals.",
      whyNow: "Scaling integrated operations requires a common orchestration layer.",
      accent: "from-violet-500 to-purple-400",
      objectives: [
        "Reduce manual coordination and exception handling",
        "Increase operational productivity through orchestration",
        "Improve reliability without adding structural overhead"
      ]
    },
    {
      icon: Shield,
      title: strategicOpportunities[0]?.title || "Accelerate technology & transformation",
      description: strategicOpportunities[0]?.description || "Simplify platforms and workflows to reduce dependency on manual intervention.",
      whyNow: "Platform consolidation creates momentum for broader adoption.",
      accent: "from-emerald-500 to-teal-400",
      objectives: [
        "Simplify platforms and reduce manual intervention",
        "Enable teams to scale through standardised processes",
        "Improve change velocity without increasing run cost"
      ]
    },
    {
      icon: Lightbulb,
      title: strategicOpportunities[1]?.title || "Scale AI & data to power intelligent operations",
      description: strategicOpportunities[1]?.description || "Embed AI to augment teams and improve decision productivity.",
      whyNow: "AI-first ambition is clear. Inflection point to embed AI in workflows.",
      accent: "from-amber-500 to-orange-400",
      objectives: [
        "Embed AI to augment teams and improve decision productivity",
        "Reduce repetitive, low-value work through AI-assisted execution",
        "Enable capacity uplift without additional headcount"
      ]
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

  // Medium-term ambitions
  const ambitions = [
    {
      title: "Better efficiencies",
      bullets: ["Sustained productivity improvements", "Lower manual effort and rework", "Increased execution capacity per team"],
      accent: "from-blue-500 to-cyan-400"
    },
    {
      title: "Improve free cash flow",
      bullets: ["Margin improvement driven by automation", "Scale volumes without proportional cost"],
      accent: "from-emerald-500 to-teal-400"
    },
    {
      title: "Grow the business",
      bullets: ["Customer experience differentiation", "Data-driven decision making"],
      accent: "from-amber-500 to-orange-400"
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

                <div className="grid grid-cols-2 gap-3">
                  {strategicPillars.map((pillar, index) => {
                    const Icon = pillar.icon;
                    return (
                      <div 
                        key={index}
                        className="group relative rounded-xl bg-white/[0.02] border border-white/5 p-4 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 opacity-0 animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Gradient accent line */}
                        <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${pillar.accent} rounded-t-xl opacity-60 group-hover:opacity-100 transition-opacity`} />
                        
                        <div className="flex items-start gap-2 mb-2">
                          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${pillar.accent} flex items-center justify-center shadow-lg flex-shrink-0`}>
                            <Icon className="w-3.5 h-3.5 text-white" />
                          </div>
                          <h3 className="text-white font-medium text-xs leading-snug flex-1">
                            {pillar.title}
                          </h3>
                        </div>
                        
                        {/* Objectives as bullet points */}
                        <div className="space-y-1 mt-3">
                          {pillar.objectives.map((obj, objIdx) => (
                            <div key={objIdx} className="flex items-start gap-2">
                              <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${pillar.accent} mt-1.5 flex-shrink-0`} />
                              <p className="text-slate-400 text-[10px] leading-relaxed">{obj}</p>
                            </div>
                          ))}
                        </div>

                        {/* Why Now */}
                        <div className="pt-2 mt-2 border-t border-white/5">
                          <p className="text-[9px]">
                            <span className={`bg-gradient-to-r ${pillar.accent} bg-clip-text text-transparent font-semibold`}>Why now:</span>{" "}
                            <span className="text-slate-500">{pillar.whyNow}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Medium-term Ambitions */}
                <div className="mt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-medium text-slate-600 uppercase tracking-[0.15em]">Medium-term Ambitions</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-800 to-transparent" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {ambitions.map((amb, index) => (
                      <div 
                        key={index}
                        className="rounded-lg bg-white/[0.02] border border-white/5 p-3 opacity-0 animate-fade-in"
                        style={{ animationDelay: `${600 + index * 100}ms` }}
                      >
                        <h4 className={`text-xs font-semibold bg-gradient-to-r ${amb.accent} bg-clip-text text-transparent mb-2`}>
                          {amb.title}
                        </h4>
                        <div className="space-y-1">
                          {amb.bullets.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-1.5">
                              <div className="w-1 h-1 rounded-full bg-slate-600 mt-1.5 flex-shrink-0" />
                              <p className="text-slate-500 text-[9px] leading-relaxed">{bullet}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
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
