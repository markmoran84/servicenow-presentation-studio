import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { 
  Sparkles,
  AlertCircle,
  Layers,
  Cpu,
  Users,
  Handshake,
  Building,
  Zap,
  ArrowRight
} from "lucide-react";

// Strategic pillar icons mapping
const pillarIcons = [Users, Cpu, Layers, Handshake, Building, Zap];

export const AccountStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, generatedPlan } = data;

  // Get strategic priorities or opportunities as focus areas
  const strategicPriorities = generatedPlan?.strategicPriorities?.slice(0, 4) || [];
  const platformCapabilities = generatedPlan?.platformCapabilities?.capabilities?.slice(0, 4) || [];
  
  // Check if AI-generated
  const isAIGenerated = strategicPriorities.length > 0 || platformCapabilities.length > 0;

  const hasData = strategicPriorities.length > 0;

  const fiscalYear = "FY26";
  const accountName = basics.accountName || "the Account";

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32 relative overflow-hidden">
      {/* Background gradient accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title - Large and Bold */}
        <div className="flex items-start justify-between mb-10">
          <h1 className="text-6xl font-bold leading-tight">
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
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in">
            <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Strategy Data</h3>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
              Generate an AI-powered strategic plan to populate the account strategy focus areas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Platform Vision */}
            <div className="space-y-6 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
              {/* Platform Vision Card */}
              <div className="glass-card p-6 border border-primary/20 bg-gradient-to-br from-slate-800/50 to-slate-900/30">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-foreground">Platform Vision</h2>
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium border border-primary/30">
                    ServiceNow
                  </span>
                </div>
                
                {platformCapabilities.length > 0 ? (
                  <div className="space-y-4">
                    {platformCapabilities.map((capability, idx) => (
                      <div key={idx} className="group">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                            <Layers className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-primary mb-1">{capability.title}</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">{capability.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-secondary/20 border border-border/30">
                      <div className="flex items-center gap-3 mb-2">
                        <Layers className="w-5 h-5 text-primary" />
                        <h3 className="text-sm font-semibold text-foreground">Unified Platform Foundation</h3>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Single platform for IT, Customer, and Employee workflows enabling seamless orchestration across {accountName}'s enterprise.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/20 border border-border/30">
                      <div className="flex items-center gap-3 mb-2">
                        <Cpu className="w-5 h-5 text-primary" />
                        <h3 className="text-sm font-semibold text-foreground">AI-Powered Intelligence</h3>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Now Assist and agentic AI capabilities embedded across workflows to drive automation and decision velocity.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/20 border border-border/30">
                      <div className="flex items-center gap-3 mb-2">
                        <Zap className="w-5 h-5 text-primary" />
                        <h3 className="text-sm font-semibold text-foreground">Enterprise Integration Hub</h3>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Connect legacy systems, cloud applications, and data sources into a cohesive digital backbone.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Value Statement */}
              <div className="glass-card p-5 border-l-4 border-emerald-500 bg-gradient-to-r from-emerald-500/5 to-transparent">
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "ServiceNow positions as the strategic platform partner to enable {accountName}'s digital, AI, and operational transformation ambitions."
                </p>
              </div>
            </div>

            {/* Right Column - Strategic Focus Card */}
            <div className="opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="glass-card p-6 h-full border border-emerald-500/20 bg-gradient-to-br from-slate-800/80 to-slate-900/50 backdrop-blur-xl">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">What {fiscalYear} will focus on</h2>
                  <span className="px-3 py-1 rounded-full border border-emerald-500/40 text-emerald-400 text-xs font-medium">
                    {fiscalYear} account strategy
                  </span>
                </div>

                {/* Strategic Pillars */}
                <div className="space-y-5">
                  {strategicPriorities.map((priority, index) => {
                    const IconComponent = pillarIcons[index % pillarIcons.length];
                    return (
                      <div 
                        key={index}
                        className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/30 hover:border-emerald-500/30 transition-all duration-300 group opacity-0 animate-fade-in"
                        style={{ animationDelay: `${300 + index * 100}ms` }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                            <IconComponent className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-emerald-400 font-semibold text-base mb-2 leading-snug">
                              {priority.title}
                            </h3>
                            <p className="text-foreground/80 text-sm leading-relaxed">
                              {priority.whyNow || priority.winningLooks || `Strategic focus area for ${fiscalYear} aligned to ${accountName}'s transformation priorities.`}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Strategic Connection Line */}
                <div className="mt-6 pt-5 border-t border-slate-600/30">
                  <div className="flex items-center gap-3 text-sm">
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                    <span className="text-muted-foreground">
                      Aligned to <span className="text-emerald-400 font-medium">{accountName}'s</span> strategic imperatives
                    </span>
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
