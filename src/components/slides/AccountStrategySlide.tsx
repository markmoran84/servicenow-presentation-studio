import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { 
  Target, 
  Lightbulb, 
  Sparkles,
  ArrowRight,
  Zap
} from "lucide-react";

export const AccountStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, opportunities, generatedPlan } = data;

  const customerPriorities = strategy.ceoBoardPriorities.slice(0, 4);
  const strategicOpportunities = opportunities.opportunities.slice(0, 4);
  const isAIGenerated = !!generatedPlan?.fy1Retrospective || !!generatedPlan?.strategicAlignment;
  const hasData = customerPriorities.length > 0 || strategicOpportunities.length > 0;

  // Create alignment pairs
  const alignmentPairs = customerPriorities.map((priority, idx) => ({
    priority,
    response: strategicOpportunities[idx] || null
  }));

  // Fill remaining responses without priorities
  const remainingResponses = strategicOpportunities.slice(customerPriorities.length);

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-gradient-radial from-accent/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Strategic Framework
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              Account Strategy
            </h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-xl">
              Bridging {basics.accountName || "customer"} priorities to transformative outcomes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RegenerateSectionButton section="strategicAlignment" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
                <Sparkles className="w-3 h-3" />
                AI Enhanced
              </span>
            )}
          </div>
        </div>

        {!hasData ? (
          <div className="glass-card p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <Target className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-2xl font-semibold text-muted-foreground mb-3">No Strategy Data</h3>
            <p className="text-muted-foreground/70 max-w-md mx-auto">
              Complete the Customer Strategy and Opportunities sections to reveal strategic alignment.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Strategic Bridge - Visual Flow */}
            <div className="relative">
              {/* Column Headers */}
              <div className="grid grid-cols-[1fr,80px,1fr] gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg shadow-primary/20">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground">Customer Priorities</h2>
                    <p className="text-xs text-muted-foreground">CEO/Board Agenda</p>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%] animate-[gradient-x_3s_ease_infinite] flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-end">
                  <div>
                    <h2 className="font-bold text-foreground text-right">Our Strategic Response</h2>
                    <p className="text-xs text-muted-foreground text-right">Value Delivery</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center shadow-lg shadow-accent/20">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Alignment Rows */}
              <div className="space-y-4">
                {alignmentPairs.map((pair, index) => (
                  <div 
                    key={index}
                    className="grid grid-cols-[1fr,80px,1fr] gap-4 items-center opacity-0 animate-fade-in"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Customer Priority Card */}
                    <div className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative p-5 rounded-2xl bg-gradient-to-br from-secondary/80 to-secondary/40 border border-primary/20 hover:border-primary/40 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-primary">{index + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">
                              {pair.priority.title}
                            </h3>
                            {pair.priority.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {pair.priority.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connection Bridge */}
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-full h-0.5 bg-gradient-to-r from-primary/50 via-accent to-primary/50" />
                      <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg z-10">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Strategic Response Card */}
                    {pair.response ? (
                      <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-l from-accent/20 to-accent/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative p-5 rounded-2xl bg-gradient-to-br from-secondary/80 to-secondary/40 border border-accent/20 hover:border-accent/40 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-accent/10">
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                              <Zap className="w-4 h-4 text-accent" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">
                                {pair.response.title}
                              </h3>
                              {pair.response.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {pair.response.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 rounded-2xl border border-dashed border-muted-foreground/20 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">Add response</span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Additional responses without priority pairs */}
                {remainingResponses.map((response, index) => (
                  <div 
                    key={`extra-${index}`}
                    className="grid grid-cols-[1fr,80px,1fr] gap-4 items-center opacity-0 animate-fade-in"
                    style={{ animationDelay: `${(alignmentPairs.length + index) * 150}ms` }}
                  >
                    <div className="p-5 rounded-2xl border border-dashed border-muted-foreground/20 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">Opportunity</span>
                    </div>
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-full h-0.5 bg-gradient-to-r from-muted-foreground/20 via-accent/50 to-muted-foreground/20" />
                      <div className="relative w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center z-10">
                        <Zap className="w-4 h-4 text-accent" />
                      </div>
                    </div>
                    <div className="group relative">
                      <div className="relative p-5 rounded-2xl bg-gradient-to-br from-secondary/80 to-secondary/40 border border-accent/20 hover:border-accent/40 transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                            <Zap className="w-4 h-4 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">
                              {response.title}
                            </h3>
                            {response.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {response.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Thesis - Full Width */}
            <div 
              className="relative mt-10 opacity-0 animate-fade-in"
              style={{ animationDelay: "600ms" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl blur-2xl" />
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-secondary/90 to-secondary/50 border border-primary/20 backdrop-blur-sm">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/30 flex-shrink-0">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-foreground">Strategic Thesis</h3>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" style={{ animationDelay: "150ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      By systematically mapping our capabilities to{" "}
                      <span className="text-primary font-medium">{basics.accountName || "customer"}'s</span>{" "}
                      stated transformation priorities, we establish a{" "}
                      <span className="text-accent font-medium">defensible strategic position</span>{" "}
                      that accelerates their agenda while creating sustainable competitive advantage.
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {Math.min(customerPriorities.length, strategicOpportunities.length)}:{strategicOpportunities.length}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Alignment Ratio</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};
