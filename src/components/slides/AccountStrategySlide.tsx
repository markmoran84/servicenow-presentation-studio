import { useAccountData } from "@/context/AccountDataContext";
import { 
  Compass, 
  Target, 
  Lightbulb, 
  ArrowRight, 
  Sparkles,
  TrendingUp,
  CheckCircle2,
  ArrowDown,
  AlertCircle
} from "lucide-react";

export const AccountStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, opportunities } = data;

  // Get customer priorities (CEO/Board priorities)
  const customerPriorities = strategy.ceoBoardPriorities.slice(0, 4);
  
  // Get our strategic opportunities (account strategy)
  const strategicOpportunities = opportunities.opportunities.slice(0, 4);

  // Generate alignment connections
  const alignmentConnections = strategicOpportunities.map((opp, idx) => ({
    opportunity: opp,
    alignsTo: customerPriorities[idx % customerPriorities.length] || { title: "Customer Priority", description: "" },
  }));

  const gradientColors = [
    { bg: "from-primary/20 to-primary/5", border: "border-primary/40", icon: "text-primary", glow: "shadow-primary/20" },
    { bg: "from-accent/20 to-accent/5", border: "border-accent/40", icon: "text-accent", glow: "shadow-accent/20" },
    { bg: "from-purple-500/20 to-purple-500/5", border: "border-purple-500/40", icon: "text-purple-400", glow: "shadow-purple-500/20" },
    { bg: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/40", icon: "text-amber-400", glow: "shadow-amber-500/20" },
  ];

  const hasData = customerPriorities.length > 0 || strategicOpportunities.length > 0;

  return (
    <div className="min-h-screen p-8 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="opacity-0 animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="badge-primary text-xs">FY26 Focus</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-2">
              Account Strategy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              {basics.accountName 
                ? `Strategic focus areas aligned to ${basics.accountName}'s transformation priorities`
                : "Strategic focus areas aligned to customer transformation priorities"}
            </p>
          </div>
        </div>

        {!hasData ? (
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in">
            <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Strategy Data</h3>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
              Complete the Customer Strategy and Opportunities sections in the Input Form to see the strategic alignment view.
            </p>
          </div>
        ) : (
          <>
            {/* Strategic Bridge Visualization */}
            <div className="relative">
              {/* Customer Priorities Header */}
              <div className="flex items-center gap-3 mb-4 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Customer Priorities</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
              </div>

              {/* Main Grid - Strategic Alignment Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                {alignmentConnections.length > 0 ? (
                  alignmentConnections.map((connection, index) => {
                    const style = gradientColors[index % gradientColors.length];
                    return (
                      <div
                        key={connection.opportunity.title}
                        className="opacity-0 animate-fade-in"
                        style={{ animationDelay: `${200 + index * 100}ms` }}
                      >
                        {/* Customer Priority Card - Top */}
                        <div className={`glass-card p-4 rounded-2xl border-2 ${style.border} mb-3 relative overflow-hidden`}>
                          <div className={`absolute inset-0 bg-gradient-to-br ${style.bg} pointer-events-none`} />
                          <div className="relative">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className={`w-4 h-4 ${style.icon}`} />
                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Priority</span>
                            </div>
                            <h3 className="font-bold text-foreground text-sm leading-tight">
                              {connection.alignsTo.title}
                            </h3>
                          </div>
                        </div>

                        {/* Connection Arrow */}
                        <div className="flex justify-center my-2">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-b ${style.bg} border ${style.border} flex items-center justify-center shadow-lg ${style.glow}`}>
                            <ArrowDown className={`w-4 h-4 ${style.icon}`} />
                          </div>
                        </div>

                        {/* Our Strategic Response Card - Bottom */}
                        <div className={`glass-card p-5 rounded-2xl border ${style.border} relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-xl ${style.glow}`}>
                          <div className={`absolute inset-0 bg-gradient-to-br ${style.bg} opacity-50 pointer-events-none`} />
                          <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${style.bg} border ${style.border} flex items-center justify-center`}>
                                <Lightbulb className={`w-4 h-4 ${style.icon}`} />
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Our Response</span>
                            </div>
                            <h3 className="font-bold text-foreground text-base mb-2 leading-tight group-hover:text-primary transition-colors">
                              {connection.opportunity.title}
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                              {connection.opportunity.description}
                            </p>
                            
                            {/* Alignment Indicator */}
                            <div className="mt-4 pt-3 border-t border-border/30">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className={`w-3.5 h-3.5 ${style.icon}`} />
                                <span className="text-[10px] font-medium text-muted-foreground">
                                  Aligned to: {connection.alignsTo.title.split(" ").slice(0, 3).join(" ")}...
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-4 text-center py-8 text-muted-foreground">
                    Add customer priorities and opportunities to see strategic alignment
                  </div>
                )}
              </div>

              {/* Our Response Header */}
              <div className="flex items-center gap-3 opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
                <div className="flex-1 h-px bg-gradient-to-l from-accent/50 to-transparent" />
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  <span className="text-sm font-semibold text-foreground">Strategic Focus Areas</span>
                </div>
              </div>
            </div>

            {/* Bottom Call-to-Action */}
            <div 
              className="mt-8 glass-card p-6 rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-0 animate-fade-in"
              style={{ animationDelay: "700ms" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">Strategic Thesis</h3>
                    <p className="text-muted-foreground max-w-2xl">
                      {basics.accountName 
                        ? `By aligning our capabilities directly to ${basics.accountName}'s stated priorities, we create a defensible position that competitors cannot easily replicate.`
                        : "By aligning our capabilities directly to customer priorities, we create a defensible position that competitors cannot easily replicate."}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-3xl font-bold text-primary">{strategicOpportunities.length}</span>
                    <span className="text-sm text-muted-foreground block">Focus Areas</span>
                  </div>
                  <ArrowRight className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>

            {/* Sparkle decoration */}
            <div className="absolute top-20 right-20 opacity-20 pointer-events-none">
              <Sparkles className="w-32 h-32 text-primary animate-pulse" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
