import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { 
  Sparkles,
  Clock,
  AlertTriangle,
  Trophy,
  Target,
  Zap,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export const AccountStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, generatedPlan } = data;

  const customerPriorities = strategy.ceoBoardPriorities.slice(0, 3);
  const strategicPriorities = generatedPlan?.strategicPriorities?.slice(0, 3) || [];
  
  const isAIGenerated = strategicPriorities.length > 0;
  const hasData = customerPriorities.length > 0 || strategicPriorities.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Fixed 16:9 Container */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[1400px] aspect-video bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-2xl overflow-hidden flex flex-col">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-border/30 bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  {basics.accountName || "Account"} Strategy
                </h1>
                <p className="text-xs text-muted-foreground">FY26 Strategic Framework</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RegenerateSectionButton section="strategicPriorities" />
              {isAIGenerated && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
                  <Sparkles className="w-3 h-3" />
                  AI Generated
                </span>
              )}
            </div>
          </div>

          {!hasData ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-1">No Strategy Data</h3>
                <p className="text-sm text-muted-foreground/70">Generate an AI plan to see strategic priorities.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col p-6 gap-4 overflow-hidden">
              
              {/* Customer Priorities Row */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-primary" />
                  </div>
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Customer Priorities</h2>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {customerPriorities.map((priority, index) => (
                    <div 
                      key={index}
                      className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all"
                    >
                      <div className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground leading-tight">{priority.title}</h3>
                          {priority.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{priority.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {customerPriorities.length === 0 && (
                    <div className="col-span-3 p-4 rounded-xl border border-dashed border-border text-center">
                      <p className="text-sm text-muted-foreground">Add customer priorities in the Input Form</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Our Strategic Response */}
              <div className="flex-1 min-h-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Target className="w-3 h-3 text-accent" />
                  </div>
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Our Strategic Response</h2>
                </div>
                
                {strategicPriorities.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4 h-[calc(100%-2rem)]">
                    {strategicPriorities.map((priority, index) => (
                      <div 
                        key={index}
                        className="flex flex-col rounded-xl border border-border/50 bg-gradient-to-b from-card to-card/50 overflow-hidden shadow-lg hover:shadow-xl transition-all hover:border-accent/30"
                      >
                        {/* Priority Header */}
                        <div 
                          className="px-4 py-3 border-b border-border/30"
                          style={{ 
                            background: `linear-gradient(135deg, ${priority.color || 'hsl(var(--accent))'}15, transparent)` 
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2.5 h-2.5 rounded-full shadow-lg"
                              style={{ backgroundColor: priority.color || 'hsl(var(--accent))' }}
                            />
                            <h3 className="font-semibold text-foreground text-sm">{priority.title}</h3>
                          </div>
                          {priority.alignment && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{priority.alignment}</p>
                          )}
                        </div>

                        {/* Three Narrative Cards */}
                        <div className="flex-1 flex flex-col gap-2 p-3 overflow-auto">
                          {/* Why Now */}
                          <div className="flex-1 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Clock className="w-3 h-3 text-amber-400" />
                              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Why Now</span>
                            </div>
                            <p className="text-xs text-foreground/80 leading-relaxed line-clamp-3">
                              {priority.whyNow || "Timing is critical for this initiative..."}
                            </p>
                          </div>

                          {/* If We Lose */}
                          <div className="flex-1 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                            <div className="flex items-center gap-1.5 mb-1">
                              <AlertTriangle className="w-3 h-3 text-red-400" />
                              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">If We Lose</span>
                            </div>
                            <p className="text-xs text-foreground/80 leading-relaxed line-clamp-3">
                              {priority.ifWeLose || "Risk of competitive displacement..."}
                            </p>
                          </div>

                          {/* Winning Looks Like */}
                          <div className="flex-1 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Trophy className="w-3 h-3 text-emerald-400" />
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Winning in FY26</span>
                            </div>
                            <p className="text-xs text-foreground/80 leading-relaxed line-clamp-3">
                              {priority.winningLooks || "Success means expanding partnership..."}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full border border-dashed border-border rounded-xl">
                    <p className="text-sm text-muted-foreground">Generate an AI plan to see strategic priorities</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex-shrink-0 px-8 py-3 border-t border-border/30 bg-muted/30 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Strategic framework aligning customer priorities with our response
            </span>
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Strategy Defined</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
