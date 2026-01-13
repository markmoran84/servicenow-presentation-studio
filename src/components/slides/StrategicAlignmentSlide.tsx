import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { SlideFooter } from "@/components/SlideFooter";
import { Target, ArrowRight, Info, Sparkles, CheckCircle2, Zap, Network } from "lucide-react";

export const StrategicAlignmentSlide = () => {
  const { data } = useAccountData();
  const { generatedPlan, basics } = data;
  const companyName = basics.accountName || "the customer";

  // Use AI-generated strategic alignment if available
  const strategicAlignment = generatedPlan?.strategicAlignment;
  const isAIGenerated = !!strategicAlignment;
  const alignments = strategicAlignment?.alignments || [];
  const narrative = strategicAlignment?.narrative || "";
  const hasAlignment = alignments.length > 0;

  const alignmentColors = [
    { customer: "from-cyan-500/20 to-cyan-600/10", customerBorder: "border-cyan-500/40", customerText: "text-cyan-400", 
      platform: "from-primary/20 to-primary/10", platformBorder: "border-primary/40", platformText: "text-primary" },
    { customer: "from-emerald-500/20 to-emerald-600/10", customerBorder: "border-emerald-500/40", customerText: "text-emerald-400",
      platform: "from-purple-500/20 to-purple-500/10", platformBorder: "border-purple-500/40", platformText: "text-purple-400" },
    { customer: "from-amber-500/20 to-amber-600/10", customerBorder: "border-amber-500/40", customerText: "text-amber-400",
      platform: "from-pink-500/20 to-pink-500/10", platformBorder: "border-pink-500/40", platformText: "text-pink-400" },
    { customer: "from-indigo-500/20 to-indigo-600/10", customerBorder: "border-indigo-500/40", customerText: "text-indigo-400",
      platform: "from-teal-500/20 to-teal-500/10", platformBorder: "border-teal-500/40", platformText: "text-teal-400" },
  ];

  return (
    <div className="h-full overflow-auto p-6 md:p-10 pb-28 relative">
      {/* Background gradient accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[900px] h-[600px] bg-gradient-to-bl from-primary/6 via-cyan-500/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[500px] bg-gradient-to-tr from-purple-500/6 via-pink-500/4 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 opacity-0 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-cyan-500/20 flex items-center justify-center border border-primary/30">
              <Network className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-primary via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Strategic Alignment
                </span>
              </h1>
              <p className="text-muted-foreground text-lg mt-1">Connecting {companyName} priorities to platform value</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <RegenerateSectionButton section="strategicAlignment" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 text-xs text-accent font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                AI Generated
              </span>
            )}
            <span className="px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-semibold">
              FY26 Planning
            </span>
          </div>
        </div>

        {hasAlignment ? (
          <>
            {/* Narrative */}
            {narrative && (
              <div 
                className="glass-card p-6 mb-6 border border-primary/30 bg-gradient-to-br from-slate-800/90 via-primary/5 to-slate-900/70 shadow-xl opacity-0 animate-fade-in"
                style={{ animationDelay: "80ms" }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-1.5 h-full min-h-[40px] rounded-full bg-gradient-to-b from-primary to-primary/60" />
                  <p className="text-foreground/90 leading-relaxed text-base">{narrative}</p>
                </div>
              </div>
            )}

            {/* Alignment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {alignments.slice(0, 4).map((alignment, index) => {
                const colors = alignmentColors[index % alignmentColors.length];
                return (
                  <div
                    key={index}
                    className="glass-card p-6 border border-slate-600/40 bg-gradient-to-br from-slate-800/90 to-slate-900/70 
                               hover:shadow-xl transition-all duration-300 opacity-0 animate-fade-in"
                    style={{ animationDelay: `${120 + index * 80}ms` }}
                  >
                    <div className="grid grid-cols-9 gap-3 items-center mb-4">
                      {/* Customer Objective */}
                      <div className={`col-span-4 p-4 rounded-xl bg-gradient-to-br ${colors.customer} border ${colors.customerBorder}`}>
                        <span className={`text-xs font-bold ${colors.customerText} uppercase tracking-wider block mb-2`}>
                          Customer Objective
                        </span>
                        <p className="text-sm font-semibold text-foreground leading-snug">{alignment.customerObjective}</p>
                      </div>

                      {/* Arrow */}
                      <div className="col-span-1 flex justify-center">
                        <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center border border-slate-600/40">
                          <ArrowRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>

                      {/* ServiceNow Capability */}
                      <div className={`col-span-4 p-4 rounded-xl bg-gradient-to-br ${colors.platform} border ${colors.platformBorder}`}>
                        <span className={`text-xs font-bold ${colors.platformText} uppercase tracking-wider block mb-2`}>
                          Platform Capability
                        </span>
                        <p className="text-sm font-semibold text-foreground leading-snug">{alignment.serviceNowCapability}</p>
                      </div>
                    </div>

                    {/* Outcome */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/30">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">Expected Outcome</span>
                          <p className="text-sm text-foreground/80 leading-relaxed">{alignment.outcome}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Connection Flow Indicator */}
            <div 
              className="mt-8 glass-card p-5 border border-slate-600/40 bg-gradient-to-r from-slate-800/90 to-slate-800/90 opacity-0 animate-fade-in"
              style={{ animationDelay: "500ms" }}
            >
              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 shadow-lg shadow-cyan-500/30" />
                  <span className="text-sm font-semibold text-foreground">{companyName} Strategy</span>
                </div>
                <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 via-primary to-purple-500 rounded-full" />
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary to-primary shadow-lg shadow-primary/30 animate-pulse" />
                <div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-primary to-emerald-500 rounded-full" />
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-500/30" />
                  <span className="text-sm font-semibold text-foreground">Platform Value</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div 
            className="glass-card p-16 text-center border border-slate-600/30 opacity-0 animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            <div className="w-20 h-20 rounded-2xl bg-muted/10 flex items-center justify-center mx-auto mb-6 border border-muted/20">
              <Info className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">No Strategic Alignment Generated</h3>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Complete the Input Form with account details and click <span className="font-medium text-foreground">Generate with AI</span> to create strategic alignment analysis tailored to {companyName}.
            </p>
          </div>
        )}
      </div>
      <SlideFooter />
    </div>
  );
};
