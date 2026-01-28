import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Sparkles, AlertCircle, CheckCircle, TrendingDown, TrendingUp, Timer, Info } from "lucide-react";

export const AccountStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, opportunities, painPoints, generatedPlan, accountStrategy, annualReport, swot } = data;

  const companyName = basics.accountName || "Customer";
  
  // Check if we have AI-generated content
  const isAIGenerated = !!generatedPlan?.strategicAlignment || !!accountStrategy?.strategyNarrative;
  
  // Vision: prioritize input form → AI generated → contextual default
  const vision = accountStrategy?.strategyNarrative || 
    generatedPlan?.strategicAlignment?.narrative ||
    "";

  // Focus Areas: derive from strategic priorities or CEO/Board priorities
  const focusAreas = generatedPlan?.strategicPriorities?.slice(0, 4).map(p => ({
    title: p.title,
    description: p.winningLooks || "",
    whyNow: p.whyNow || "",
  })) || strategy.ceoBoardPriorities?.slice(0, 4).map(p => ({
    title: p.title,
    description: p.description,
    whyNow: "",
  })) || [];

  // Winning Moves: derive from strategic alignment or opportunities
  const winningMoves = generatedPlan?.strategicAlignment?.alignments?.slice(0, 4).map(a => ({
    title: a.customerObjective,
    description: `${a.serviceNowCapability} → ${a.outcome}`,
  })) || opportunities.opportunities?.slice(0, 4).map(o => ({
    title: o.title,
    description: o.description,
  })) || [];

  // Target Metrics from generated plan
  const metrics = generatedPlan?.successMetrics?.slice(0, 3) || [];

  // Determine if we have meaningful content
  const hasVision = vision.length > 0;
  const hasFocusAreas = focusAreas.length > 0;
  const hasWinningMoves = winningMoves.length > 0;
  const hasContent = hasVision || hasFocusAreas || hasWinningMoves;

  return (
    <div className="min-h-screen p-8 md:p-10 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary">
              Account Strategy FY26+
            </h1>
            <p className="text-muted-foreground mt-1">Strategic approach for {companyName}</p>
          </div>
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

        {!hasContent ? (
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in">
            <Info className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Strategy Data</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Complete the Account Strategy section in the Input Form, or click <span className="font-medium text-foreground">Generate with AI</span> to create a strategy based on your account data.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Vision Banner */}
            {hasVision && (
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
            )}

            {/* Main Content - Two Columns */}
            <div className="grid grid-cols-12 gap-5">
              {/* Left Column - What We'll Focus On */}
              <div className="col-span-7 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">What We'll Focus On</span>
                  <div className="flex-1 h-px bg-primary/30" />
                </div>

                {hasFocusAreas ? (
                  <div className="grid grid-cols-2 gap-4">
                    {focusAreas.map((area, index) => (
                      <div 
                        key={index}
                        className="glass-card p-4 opacity-0 animate-fade-in"
                        style={{ animationDelay: `${100 + index * 50}ms` }}
                      >
                        <h3 className="text-foreground font-semibold text-sm mb-2">{area.title}</h3>
                        {area.description && (
                          <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                            {area.description}
                          </p>
                        )}
                        {area.whyNow && (
                          <div className="pt-3 border-t border-border/30">
                            <p className="text-xs">
                              <span className="text-amber-400 font-semibold">Why now:</span>{" "}
                              <span className="text-muted-foreground">{area.whyNow}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-card p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Add CEO/Board Priorities or generate strategic priorities with AI.
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column - How We'll Win */}
              <div className="col-span-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">How We'll Win</span>
                  <div className="flex-1 h-px bg-primary/30" />
                </div>

                {hasWinningMoves ? (
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
                ) : (
                  <div className="glass-card p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Add Strategic Opportunities or generate with AI.
                    </p>
                  </div>
                )}

                {/* Target Metrics */}
                {metrics.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {metrics.map((metric, index) => (
                      <div 
                        key={index}
                        className="glass-card p-4 text-center opacity-0 animate-fade-in" 
                        style={{ animationDelay: `${300 + index * 50}ms` }}
                      >
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <span className="text-lg font-bold text-primary">{metric.metric}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
