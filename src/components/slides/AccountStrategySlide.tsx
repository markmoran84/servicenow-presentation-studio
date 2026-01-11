import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { 
  Compass, 
  Target, 
  Lightbulb, 
  Sparkles,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Zap,
  Shield
} from "lucide-react";

export const AccountStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, opportunities, generatedPlan } = data;

  // Get customer priorities (CEO/Board priorities)
  const customerPriorities = strategy.ceoBoardPriorities.slice(0, 4);
  
  // Get our strategic opportunities (account strategy)
  const strategicOpportunities = opportunities.opportunities.slice(0, 4);

  // Check if AI-generated (check any generated content)
  const isAIGenerated = !!generatedPlan?.fy1Retrospective || !!generatedPlan?.strategicAlignment;

  const hasData = customerPriorities.length > 0 || strategicOpportunities.length > 0;

  // Strategic thesis based on data
  const strategicThesis = basics.accountName 
    ? `Position ${basics.industry || "technology"} expertise to accelerate ${basics.accountName}'s transformation agenda through targeted capability alignment.`
    : "Position our capabilities to accelerate the customer's transformation agenda through targeted strategic alignment.";

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Account Strategy
          </h1>
          <div className="flex items-center gap-2">
            <RegenerateSectionButton section="executiveSummary" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
                <Sparkles className="w-3 h-3" />
                AI Enhanced
              </span>
            )}
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
            {/* Top Row - Account Context Cards */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="glass-card p-5 flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Account:</span>
                <span className="text-foreground font-medium">{basics.accountName || "Enterprise Account"}</span>
              </div>
              <div className="glass-card p-5 flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Strategic Focus:</span>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                    FY26 Priorities
                  </span>
                  <span className="text-foreground font-semibold">{strategicOpportunities.length} Areas</span>
                </div>
              </div>
            </div>

            {/* Main Content - Two Columns */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Left Column - Customer Priorities */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Target className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">Customer Priorities</h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                    CEO/Board Agenda
                  </span>
                </div>

                {customerPriorities.length > 0 ? (
                  <div className="space-y-4">
                    {customerPriorities.map((priority, index) => (
                      <div 
                        key={index} 
                        className="opacity-0 animate-fade-in p-3 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-colors"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-primary">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-foreground font-semibold text-sm mb-1">{priority.title}</h3>
                            {priority.description && (
                              <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{priority.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-sm">
                    Add customer priorities in the Input Form
                  </p>
                )}
              </div>

              {/* Right Column - Our Strategic Response */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-accent" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">Our Strategic Response</h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                    Focus Areas
                  </span>
                </div>

                {strategicOpportunities.length > 0 ? (
                  <div className="space-y-4">
                    {strategicOpportunities.map((opp, index) => (
                      <div 
                        key={index} 
                        className="opacity-0 animate-fade-in p-3 rounded-lg bg-secondary/30 border border-border/50 hover:border-accent/30 transition-colors"
                        style={{ animationDelay: `${index * 100 + 200}ms` }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Zap className="w-3 h-3 text-accent" />
                          </div>
                          <div>
                            <h3 className="text-foreground font-semibold text-sm mb-1">{opp.title}</h3>
                            {opp.description && (
                              <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{opp.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-sm">
                    Add strategic opportunities in the Input Form
                  </p>
                )}
              </div>
            </div>

            {/* Strategic Thesis - Full Width Narrative */}
            <div className="glass-card p-6 mb-6 border-l-4 border-primary">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                  <Compass className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">Strategic Thesis</h3>
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {strategicThesis}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Row - Key Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="glass-card p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-2xl font-bold text-primary">{customerPriorities.length}</span>
                </div>
                <span className="text-xs text-muted-foreground">Customer Priorities</span>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  <span className="text-2xl font-bold text-accent">{strategicOpportunities.length}</span>
                </div>
                <span className="text-xs text-muted-foreground">Strategic Focus Areas</span>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-2xl font-bold text-emerald-400">
                    {Math.min(customerPriorities.length, strategicOpportunities.length)}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Direct Alignments</span>
              </div>
            </div>

            {/* Status Bar */}
            <div className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Strategic positioning for {basics.accountName || "target account"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Strategy Aligned</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
