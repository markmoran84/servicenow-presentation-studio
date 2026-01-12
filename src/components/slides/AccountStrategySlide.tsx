import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { 
  Sparkles,
  AlertCircle,
  Users,
  Cpu,
  Layers,
  Handshake,
  Rocket,
  Target,
  TrendingUp,
  Zap,
  Globe,
  ArrowUpRight
} from "lucide-react";

// Strategic pillar icons mapping
const pillarIcons = [Users, Cpu, Layers, Handshake, Rocket, Target];

export const AccountStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, generatedPlan, strategy } = data;

  // Get strategic priorities as focus areas
  const strategicPriorities = generatedPlan?.strategicPriorities?.slice(0, 4) || [];
  
  // Get customer strategy synthesis for context
  const customerSynthesis = generatedPlan?.customerStrategySynthesis;
  const customerPillars = customerSynthesis?.strategicPillars?.slice(0, 3) || [];
  const annualTasks = customerSynthesis?.annualTasks?.slice(0, 3) || [];
  
  // Fallback to raw strategy items if no synthesis
  const corporateStrategies = strategy?.corporateStrategy?.slice(0, 3) || [];
  const digitalStrategies = strategy?.digitalStrategies?.slice(0, 2) || [];
  
  // Check if AI-generated
  const isAIGenerated = strategicPriorities.length > 0;
  const hasData = strategicPriorities.length > 0;

  const fiscalYear = "FY26";
  const accountName = basics.accountName || "the Account";
  
  // Vision statement - from basics or generated
  const visionStatement = basics.visionStatement || 
    `To build the digital backbone that powers ${accountName}'s strategic transformation, enabling seamless operations across their connected enterprise.`;

  // Determine what context to show in left column
  const hasCustomerContext = customerPillars.length > 0 || annualTasks.length > 0 || corporateStrategies.length > 0;

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32 relative overflow-hidden">
      {/* Background gradient accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-gradient-to-bl from-emerald-500/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-gradient-to-tr from-primary/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-cyan-500/3 via-transparent to-emerald-500/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col h-full">
        {/* Title - Large and Bold */}
        <div className="flex items-start justify-between mb-8">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Account Strategy
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              {fiscalYear}
            </span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <RegenerateSectionButton section="strategicPriorities" label="Regenerate" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
          </div>
        </div>

        {!hasData ? (
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in flex-1 flex flex-col items-center justify-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Strategy Data</h3>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
              Generate an AI-powered strategic plan to populate the account strategy focus areas.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
              {/* Left Column - Customer Strategic Context */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <div className="glass-card p-6 h-full border border-slate-600/30 bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-xl">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-cyan-400" />
                      </div>
                      <h2 className="text-lg font-semibold text-foreground">{accountName}'s Strategic Context</h2>
                    </div>
                    <span className="px-3 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-xs font-medium">
                      Why Now
                    </span>
                  </div>

                  {/* Customer Strategic Themes */}
                  {hasCustomerContext ? (
                    <div className="space-y-4">
                      {/* Show annual tasks if available */}
                      {annualTasks.length > 0 ? (
                        annualTasks.map((task, index) => (
                          <div 
                            key={index}
                            className="p-4 rounded-lg bg-slate-700/40 border border-slate-600/40 hover:border-cyan-500/30 transition-all duration-300 group opacity-0 animate-fade-in"
                            style={{ animationDelay: `${200 + index * 100}ms` }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" 
                                   style={{ backgroundColor: task.color || '#22d3ee' }} />
                              <div>
                                <h3 className="text-cyan-300 font-medium text-sm mb-1">{task.title}</h3>
                                {task.description && (
                                  <p className="text-foreground/70 text-xs leading-relaxed">{task.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : customerPillars.length > 0 ? (
                        customerPillars.map((pillar, index) => (
                          <div 
                            key={index}
                            className="p-4 rounded-lg bg-slate-700/40 border border-slate-600/40 hover:border-cyan-500/30 transition-all duration-300 group opacity-0 animate-fade-in"
                            style={{ animationDelay: `${200 + index * 100}ms` }}
                          >
                            <h3 className="text-cyan-300 font-medium text-sm mb-1">{pillar.headline}</h3>
                            <p className="text-foreground/70 text-xs leading-relaxed">{pillar.description}</p>
                          </div>
                        ))
                      ) : (
                        [...corporateStrategies, ...digitalStrategies].slice(0, 4).map((item, index) => (
                          <div 
                            key={index}
                            className="p-4 rounded-lg bg-slate-700/40 border border-slate-600/40 hover:border-cyan-500/30 transition-all duration-300 group opacity-0 animate-fade-in"
                            style={{ animationDelay: `${200 + index * 100}ms` }}
                          >
                            <div className="flex items-start gap-3">
                              <ArrowUpRight className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <h3 className="text-cyan-300 font-medium text-sm mb-1">{item.title}</h3>
                                <p className="text-foreground/70 text-xs leading-relaxed line-clamp-2">{item.description}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                      
                      {/* Connection indicator */}
                      <div className="pt-4 border-t border-slate-600/30 mt-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                          <span>These priorities inform our <span className="text-cyan-400 font-medium">{fiscalYear} focus areas</span></span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-center py-8">
                      <div>
                        <Globe className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground/60">Customer strategy context will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Strategic Focus Card */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
                <div className="glass-card p-6 h-full border border-emerald-500/20 bg-gradient-to-br from-slate-800/80 to-slate-900/50 backdrop-blur-xl">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <Target className="w-5 h-5 text-emerald-400" />
                      </div>
                      <h2 className="text-lg font-semibold text-foreground">What {fiscalYear} will focus on</h2>
                    </div>
                    <span className="px-3 py-1 rounded-full border border-emerald-500/40 text-emerald-400 text-xs font-medium">
                      {fiscalYear} account strategy
                    </span>
                  </div>

                  {/* Strategic Pillars */}
                  <div className="space-y-4">
                    {strategicPriorities.map((priority, index) => {
                      const IconComponent = pillarIcons[index % pillarIcons.length];
                      return (
                        <div 
                          key={index}
                          className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/30 hover:border-emerald-500/30 transition-all duration-300 group opacity-0 animate-fade-in"
                          style={{ animationDelay: `${300 + index * 100}ms` }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                              <IconComponent className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-emerald-400 font-semibold text-sm mb-1 leading-snug">
                                {priority.title}
                              </h3>
                              <p className="text-foreground/75 text-xs leading-relaxed line-clamp-3">
                                {priority.whyNow || priority.winningLooks || `Strategic focus area for ${fiscalYear} aligned to ${accountName}'s transformation priorities.`}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Vision Banner - Bottom */}
            <div 
              className="mt-6 opacity-0 animate-fade-in"
              style={{ animationDelay: "700ms" }}
            >
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-cyan-500/15 to-emerald-500/20 border border-primary/30 backdrop-blur-lg">
                {/* Subtle glow effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-emerald-500/5" />
                <div className="absolute top-0 left-1/4 w-64 h-32 bg-cyan-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-64 h-32 bg-emerald-400/10 rounded-full blur-3xl" />
                
                <div className="relative px-8 py-6 flex items-center justify-center">
                  <div className="flex items-center gap-4">
                    <div className="w-1 h-12 rounded-full bg-gradient-to-b from-emerald-400 via-cyan-400 to-primary hidden md:block" />
                    <p className="text-lg md:text-xl font-medium text-center text-foreground leading-relaxed max-w-4xl">
                      {visionStatement}
                    </p>
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
