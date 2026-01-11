import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { 
  Target, 
  Lightbulb, 
  Sparkles,
  AlertTriangle,
  Trophy,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export const AccountStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, generatedPlan } = data;

  const customerPriorities = strategy.ceoBoardPriorities.slice(0, 4);
  
  // Use strategicPriorities from generatedPlan which has whyNow, ifWeLose, winningLooks
  const strategicPriorities = generatedPlan?.strategicPriorities?.slice(0, 4) || [];
  
  const isAIGenerated = strategicPriorities.length > 0;
  const hasData = customerPriorities.length > 0 || strategicPriorities.length > 0;

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Account Strategy
          </h1>
          <div className="flex items-center gap-2">
            <RegenerateSectionButton section="strategicPriorities" />
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
              Generate an AI plan to see strategic priorities with rationale.
            </p>
          </div>
        ) : (
          <>
            {/* Top Row - Context Cards */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="glass-card p-5 flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Account:</span>
                <span className="text-foreground font-medium">{basics.accountName || "Target Account"}</span>
              </div>
              <div className="glass-card p-5 flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Planning Horizon:</span>
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                  FY26 Strategic Focus
                </span>
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
                    CEO/Board
                  </span>
                </div>

                {customerPriorities.length > 0 ? (
                  <div className="space-y-4">
                    {customerPriorities.map((priority, index) => (
                      <div 
                        key={index} 
                        className="opacity-0 animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <h3 className="text-primary font-semibold text-sm mb-1">{priority.title}</h3>
                        {priority.description && (
                          <p className="text-muted-foreground text-sm leading-relaxed">{priority.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-sm">
                    Add customer priorities in the Input Form
                  </p>
                )}
              </div>

              {/* Right Column - Strategic Focus Areas */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-accent" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">Our Strategic Focus</h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                    FY26 Priorities
                  </span>
                </div>

                {strategicPriorities.length > 0 ? (
                  <div className="space-y-4">
                    {strategicPriorities.slice(0, 3).map((priority, index) => (
                      <div 
                        key={index} 
                        className="opacity-0 animate-fade-in"
                        style={{ animationDelay: `${index * 100 + 200}ms` }}
                      >
                        <h3 className="text-accent font-semibold text-sm mb-1">{priority.title}</h3>
                        {priority.alignment && (
                          <p className="text-muted-foreground text-sm leading-relaxed">{priority.alignment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-sm">
                    Generate an AI plan to see strategic priorities
                  </p>
                )}
              </div>
            </div>

            {/* Strategic Priorities Detail Cards */}
            {strategicPriorities.length > 0 && (
              <div className="grid grid-cols-2 gap-6 mb-6">
                {strategicPriorities.slice(0, 4).map((priority, index) => (
                  <div 
                    key={index}
                    className="glass-card p-5 opacity-0 animate-fade-in"
                    style={{ animationDelay: `${index * 100 + 400}ms` }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: priority.color || 'hsl(var(--primary))' }}
                      />
                      <h3 className="font-semibold text-foreground">{priority.title}</h3>
                    </div>

                    <div className="space-y-3">
                      {/* Why Now */}
                      {priority.whyNow && (
                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Why Now</span>
                          </div>
                          <p className="text-foreground/80 text-sm leading-relaxed">{priority.whyNow}</p>
                        </div>
                      )}

                      {/* If We Lose */}
                      {priority.ifWeLose && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                            <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">If We Lose</span>
                          </div>
                          <p className="text-foreground/80 text-sm leading-relaxed">{priority.ifWeLose}</p>
                        </div>
                      )}

                      {/* Winning Looks Like */}
                      {priority.winningLooks && (
                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Winning in FY26</span>
                          </div>
                          <p className="text-foreground/80 text-sm leading-relaxed">{priority.winningLooks}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Status Bar */}
            <div className="glass-card p-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Strategic framework for {basics.accountName || "target account"}
              </span>
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Strategy Defined</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
