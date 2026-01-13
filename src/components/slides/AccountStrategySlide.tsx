import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { 
  Sparkles,
  Target,
  Zap,
  TrendingUp,
  Users,
  ChevronRight,
  Clock,
} from "lucide-react";

export const AccountStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, opportunities, engagement, generatedPlan } = data;

  const customerPriorities = strategy.ceoBoardPriorities.slice(0, 4);
  const strategicOpportunities = opportunities.opportunities.slice(0, 4);
  const executives = engagement.knownExecutiveSponsors?.slice(0, 3) || [];

  const isAIGenerated = !!generatedPlan?.fy1Retrospective || !!generatedPlan?.strategicAlignment;
  const hasData = customerPriorities.length > 0 || strategicOpportunities.length > 0;

  // Strategic pillars with why now
  const strategicPillars = [
    {
      number: "01",
      title: customerPriorities[0]?.title || "Customer & Commercial Transformation",
      description: customerPriorities[0]?.description || "Deliver scalable, orchestrated customer service and commercial execution foundation.",
      whyNow: "Decision window is live—time to expand from replacement to end-to-end orchestration.",
      color: "from-cyan-400 to-blue-500",
      bgGlow: "bg-cyan-500/20"
    },
    {
      number: "02",
      title: customerPriorities[1]?.title || "Operationalising AI",
      description: customerPriorities[1]?.description || "Move AI beyond isolated use cases to improve execution speed and decision quality.",
      whyNow: "AI-first ambition is clear. This is the inflection point to embed AI in workflows.",
      color: "from-violet-400 to-purple-500",
      bgGlow: "bg-violet-500/20"
    },
    {
      number: "03",
      title: strategicOpportunities[0]?.title || "Platform Expansion Beyond IT",
      description: strategicOpportunities[0]?.description || "Broaden platform adoption using customer and service workflows as the entry point.",
      whyNow: "Scaling integrated operations requires a common orchestration layer.",
      color: "from-emerald-400 to-teal-500",
      bgGlow: "bg-emerald-500/20"
    },
    {
      number: "04",
      title: strategicOpportunities[1]?.title || "Strategic Partnership Maturity",
      description: strategicOpportunities[1]?.description || "Evolve toward long-term strategic partner underpinning digital and AI ambition.",
      whyNow: "Relationship has renewed confidence. Window to shift to strategic partnership.",
      color: "from-amber-400 to-orange-500",
      bgGlow: "bg-amber-500/20"
    }
  ];

  // Executive engagement moves
  const winningMoves = [
    {
      icon: Target,
      action: "Align Executives",
      detail: "Single narrative: Integrator Strategy → Digital Backbone → AI-first → Outcomes"
    },
    {
      icon: TrendingUp,
      action: "Sequence for Continuity",
      detail: "Stabilise → Scale orchestration → Embed AI across priority workflows"
    },
    {
      icon: Zap,
      action: "Focus on Cost-to-Serve",
      detail: "Measure through cycle time, automation rate, and service performance"
    },
    {
      icon: Users,
      action: "Co-create Roadmap",
      detail: "Governance model reducing delivery risk and accelerating adoption"
    }
  ];

  const vision = basics.accountName 
    ? `Build the digital backbone that powers ${basics.accountName}'s transformation—enabling AI-first execution at scale.`
    : "Build the digital backbone that powers transformation—enabling AI-first execution at scale.";

  return (
    <div className="min-h-screen bg-slate-950 p-6 pb-28 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[100px]" />
      
      <div className="max-w-7xl mx-auto h-full flex flex-col relative z-10">
        
        {/* Compact Header Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">
                  Account Strategy
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-slate-500 text-xs">{basics.accountName || "Strategic Account"}</span>
                  <span className="text-slate-700">•</span>
                  <span className="text-blue-400 text-xs font-medium">FY26</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RegenerateSectionButton section="executiveSummary" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-white/5 text-[10px] text-blue-400 font-medium">
                <Sparkles className="w-3 h-3" />
                AI Enhanced
              </span>
            )}
          </div>
        </div>

        {!hasData ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-12 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
              <Target className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-400 mb-2">No Strategy Data</h3>
              <p className="text-sm text-slate-600 max-w-sm">
                Complete the Customer Strategy and Opportunities sections to generate your account strategy.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Vision Banner - Full Width Hero */}
            <div className="relative mb-6 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-violet-600/20 to-cyan-600/30" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwIDEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9nPjwvc3ZnPg==')] opacity-50" />
              <div className="relative px-8 py-6 backdrop-blur-sm border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex-1 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Strategic Vision</span>
                    </div>
                    <p className="text-xl md:text-2xl font-light text-white leading-relaxed">
                      {vision}
                    </p>
                  </div>
                  <div className="hidden lg:flex flex-col items-end gap-1 pl-8 border-l border-white/10">
                    <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                      $25M+
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Target TCV</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-12 gap-4">
              
              {/* Left Column - Strategic Pillars */}
              <div className="col-span-8">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xs font-semibold text-white uppercase tracking-[0.2em]">Strategic Focus Areas</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-700 via-slate-800 to-transparent" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {strategicPillars.map((pillar, index) => (
                    <div 
                      key={index}
                      className="group relative rounded-xl bg-slate-900/50 border border-white/[0.05] hover:border-white/10 transition-all duration-500 overflow-hidden"
                    >
                      {/* Hover glow effect */}
                      <div className={`absolute -top-20 -right-20 w-40 h-40 ${pillar.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      
                      <div className="relative p-4">
                        {/* Number & Gradient Bar */}
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`text-2xl font-bold bg-gradient-to-r ${pillar.color} bg-clip-text text-transparent`}>
                            {pillar.number}
                          </span>
                          <div className={`flex-1 h-0.5 bg-gradient-to-r ${pillar.color} opacity-30 rounded-full`} />
                        </div>

                        {/* Title */}
                        <h3 className="text-white font-semibold text-sm leading-tight mb-2 pr-4">
                          {pillar.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-slate-400 text-xs leading-relaxed mb-3">
                          {pillar.description}
                        </p>

                        {/* Why Now - Distinguished Section */}
                        <div className="relative pt-3 border-t border-white/5">
                          <div className="flex items-start gap-2">
                            <Clock className={`w-3 h-3 mt-0.5 flex-shrink-0 bg-gradient-to-r ${pillar.color} bg-clip-text`} style={{
                              color: 'transparent',
                              backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                              WebkitBackgroundClip: 'text',
                              backgroundClip: 'text'
                            }} />
                            <div>
                              <span className={`text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${pillar.color} bg-clip-text text-transparent`}>
                                Why Now
                              </span>
                              <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">
                                {pillar.whyNow}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - How We Win + Outcomes */}
              <div className="col-span-4 flex flex-col gap-4">
                
                {/* How We'll Win Panel */}
                <div className="flex-1 rounded-xl bg-gradient-to-b from-slate-900/80 to-slate-900/40 border border-white/5 p-4 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl" />
                  
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                        <ChevronRight className="w-3.5 h-3.5 text-white" />
                      </div>
                      <h2 className="text-xs font-semibold text-white uppercase tracking-[0.15em]">How We'll Win</h2>
                    </div>

                    <div className="space-y-3">
                      {winningMoves.map((move, index) => {
                        const Icon = move.icon;
                        return (
                          <div 
                            key={index}
                            className="group flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors"
                          >
                            <div className="w-7 h-7 rounded-lg bg-slate-800/80 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:border-blue-500/30 transition-colors">
                              <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-xs">{move.action}</p>
                              <p className="text-slate-500 text-[10px] leading-relaxed mt-0.5 line-clamp-2">
                                {move.detail}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Executive Sponsors */}
                {executives.length > 0 && (
                  <div className="rounded-xl bg-slate-900/30 border border-white/5 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px] font-semibold text-white uppercase tracking-wider">Key Sponsors</span>
                    </div>
                    <div className="space-y-2">
                      {executives.map((exec: any, i: number) => (
                        <div 
                          key={i} 
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5"
                        >
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-[10px] font-bold text-white">
                            {(exec.name || exec).charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-medium truncate">{exec.name || exec}</p>
                            <p className="text-slate-600 text-[10px] truncate">{exec.title || "Executive Sponsor"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Target Outcomes - Compact Row */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "20-30%", label: "Cost Reduction", color: "from-cyan-400 to-blue-500" },
                    { value: "40%+", label: "Automation", color: "from-violet-400 to-purple-500" },
                    { value: "50%", label: "Faster Cycles", color: "from-emerald-400 to-teal-500" }
                  ].map((outcome, index) => (
                    <div 
                      key={index}
                      className="text-center p-3 rounded-xl bg-slate-900/50 border border-white/5"
                    >
                      <div className={`text-lg font-bold bg-gradient-to-r ${outcome.color} bg-clip-text text-transparent`}>
                        {outcome.value}
                      </div>
                      <div className="text-[9px] text-slate-600 mt-0.5 uppercase tracking-wider leading-tight">
                        {outcome.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
