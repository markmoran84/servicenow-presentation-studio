import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Compass, Target, Rocket, Lightbulb, ArrowRight, Sparkles, Link2, AlertCircle, CheckCircle } from "lucide-react";

export const CustomerStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, generatedPlan } = data;

  const corporate = (strategy.corporateStrategy ?? []).filter(
    (s) => (s.title || "").trim().length > 0 || (s.description || "").trim().length > 0,
  );
  const digital = (strategy.digitalStrategies ?? []).filter(
    (s) => (s.title || "").trim().length > 0 || (s.description || "").trim().length > 0,
  );
  const ceo = (strategy.ceoBoardPriorities ?? []).filter(
    (s) => (s.title || "").trim().length > 0 || (s.description || "").trim().length > 0,
  );
  const themes = (strategy.transformationThemes ?? []).filter(
    (s) => (s.title || "").trim().length > 0 || (s.description || "").trim().length > 0,
  );

  // AI-generated synthesis
  const isAIGenerated = !!generatedPlan?.customerStrategySynthesis;
  const synthesis = generatedPlan?.customerStrategySynthesis;

  const hasData = corporate.length > 0 || digital.length > 0 || ceo.length > 0 || themes.length > 0;

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Customer Strategy
          </h1>
          <div className="flex items-center gap-2">
            <RegenerateSectionButton section="customerStrategySynthesis" />
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
              Complete the Strategy section in the Input Form or generate an AI plan to populate customer strategy.
            </p>
          </div>
        ) : (
          <>
            {/* Top Row - Account and Industry Context */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="glass-card p-5 flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Account:</span>
                <span className="text-foreground font-medium">{basics.accountName || "Not specified"}</span>
              </div>
              <div className="glass-card p-5 flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Industry Focus:</span>
                <span className="text-foreground font-medium">{basics.industry || "Not specified"}</span>
              </div>
            </div>

            {/* Main Content - Two Columns */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Left Column - Strategic Synthesis / Corporate Strategy */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Rocket className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Corporate Strategy</h2>
                </div>
                {synthesis?.narrative ? (
                  <p className="text-foreground/90 leading-relaxed mb-4">
                    {synthesis.narrative}
                  </p>
                ) : corporate.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {corporate.slice(0, 3).map((item, index) => (
                      <div key={`${item.title}-${index}`} className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                          {index === 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">Primary</span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic mb-4">
                    No corporate strategy provided
                  </p>
                )}
                {ceo.length > 0 && (
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <p className="text-sm font-medium text-amber-400 mb-2">CEO & Board Priorities</p>
                    <div className="space-y-1">
                      {ceo.slice(0, 3).map((item, index) => (
                        <div key={`${item.title}-${index}`} className="flex items-start gap-2">
                          <ArrowRight className="w-3 h-3 text-amber-400 mt-1 flex-shrink-0" />
                          <p className="text-foreground/80 text-sm">{item.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Digital Strategies */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Target className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">Digital Strategies</h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                    Transformation Focus
                  </span>
                </div>

                {digital.length > 0 ? (
                  <div className="space-y-4">
                    {digital.slice(0, 4).map((item, index) => (
                      <div key={`${item.title}-${index}`} className="opacity-0 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                        <h3 className="text-primary font-semibold text-sm mb-1">{item.title}</h3>
                        {item.description && (
                          <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">
                    Add digital strategies in Input Form to see them here
                  </p>
                )}
              </div>
            </div>

            {/* Transformation Themes & ServiceNow Alignment */}
            {(themes.length > 0 || (synthesis?.serviceNowAlignment && synthesis.serviceNowAlignment.length > 0)) && (
              <div className="grid grid-cols-2 gap-6 mb-6">
                {themes.length > 0 && (
                  <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                      <h3 className="font-semibold text-foreground text-sm">Transformation Themes</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {themes.map((theme, index) => (
                        <span
                          key={`${theme.title}-${index}`}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 text-sm font-medium text-foreground"
                        >
                          {theme.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {synthesis?.serviceNowAlignment && synthesis.serviceNowAlignment.length > 0 && (
                  <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Link2 className="w-4 h-4 text-cyan-400" />
                      <h3 className="font-semibold text-foreground text-sm">
                        Platform Alignment
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {synthesis.serviceNowAlignment.slice(0, 3).map((alignment, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                          <span className="text-muted-foreground">{alignment.customerPriority}</span>
                          <ArrowRight className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                          <span className="text-foreground/80">{alignment.serviceNowValue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Row - Status */}
            <div className="glass-card p-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {basics.accountName} strategic priorities and digital transformation focus
              </span>
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Strategy Mapped</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
