import { useAccountData } from "@/context/AccountDataContext";
import { SectionHeader } from "@/components/SectionHeader";
import { DollarSign, TrendingUp, Target, BarChart3, Layers, AlertCircle } from "lucide-react";

const getStateColor = (state: string) => {
  switch (state) {
    case "Greenfield": return "bg-accent/20 text-accent";
    case "Pilot": return "bg-primary/20 text-primary";
    case "Discovery": return "bg-amber-500/20 text-amber-400";
    case "Vision": return "bg-muted text-muted-foreground";
    case "Active Pursuit": return "bg-primary/20 text-primary";
    case "Strategic Initiative": return "bg-accent/20 text-accent";
    default: return "bg-muted text-muted-foreground";
  }
};

export const FinancialOpportunitySlide = () => {
  const { data } = useAccountData();
  const { basics, financial, accountStrategy, generatedPlan } = data;

  // Build current state from context
  const currentACV = basics.currentContractValue || "$0";
  const hasCurrentState = basics.currentContractValue || accountStrategy.bigBets.length > 0;

  // Build expansion targets from big bets / key workstreams
  const expansionTargets = [];
  
  if (accountStrategy.bigBets.length > 0) {
    accountStrategy.bigBets.forEach(bet => {
      expansionTargets.push({
        workflow: bet.title,
        currentState: bet.dealStatus || "Discovery",
        targetACV: bet.netNewACV || "$0",
        probability: bet.dealStatus === "Active Pursuit" ? 75 : bet.dealStatus === "Strategic Initiative" ? 60 : 40,
        timeline: bet.targetClose || "TBD",
        notes: bet.insight || bet.subtitle || "",
      });
    });
  } else if (generatedPlan?.keyWorkstreams) {
    generatedPlan.keyWorkstreams.slice(0, 4).forEach((ws, idx) => {
      expansionTargets.push({
        workflow: ws.title,
        currentState: ws.dealStatus || "Discovery",
        targetACV: ws.acv || "$0",
        probability: idx === 0 ? 75 : idx === 1 ? 60 : 40,
        timeline: ws.targetClose || "TBD",
        notes: ws.insight || "",
      });
    });
  }

  const parseValue = (val: string) => {
    const cleaned = val.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned) || 0;
    if (val.toLowerCase().includes('k')) return num / 1000;
    return num;
  };

  const totalTarget = expansionTargets.reduce((sum, t) => sum + parseValue(t.targetACV), 0);
  const currentValue = parseValue(currentACV);
  const growthPercent = currentValue > 0 ? Math.round((totalTarget / currentValue) * 100) : 0;

  const hasData = hasCurrentState || expansionTargets.length > 0;

  return (
    <div className="px-8 pt-6 pb-32">
      <div className="flex items-center gap-3 mb-6 opacity-0 animate-fade-in">
        <DollarSign className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-bold text-foreground">Financial Opportunity</h1>
      </div>

      {!hasData ? (
        <div className="glass-card p-12 text-center opacity-0 animate-fade-in">
          <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Financial Data Available</h3>
          <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
            Complete the Account Basics and Big Bets sections in the Input Form to populate the financial opportunity view.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {/* Current State */}
          <div className="glass-card p-6 opacity-0 animate-fade-in animation-delay-100">
            <SectionHeader
              title="Current Position"
              description={`Existing ServiceNow footprint at ${basics.accountName || "customer"}`}
              delay={100}
            />

            <div className="mt-6 space-y-4">
              {/* ACV */}
              <div className="p-4 rounded-xl bg-secondary/50">
                <div className="text-sm text-muted-foreground mb-1">Current ACV</div>
                <div className="metric-highlight text-4xl">{currentACV}</div>
              </div>

              {/* Tier */}
              <div className="p-4 rounded-xl bg-secondary/50">
                <div className="text-sm text-muted-foreground mb-1">Account Tier</div>
                <div className="text-lg font-semibold text-foreground">{basics.tier || "Enterprise"}</div>
              </div>

              {/* Ambition */}
              {basics.nextFYAmbition && (
                <div className="p-4 rounded-xl bg-secondary/50">
                  <div className="text-sm text-muted-foreground mb-1">Next FY Ambition</div>
                  <div className="text-lg font-semibold text-foreground">{basics.nextFYAmbition}</div>
                </div>
              )}

              {/* 3-Year Ambition */}
              {basics.threeYearAmbition && (
                <div className="p-4 rounded-xl bg-secondary/50">
                  <div className="text-sm text-muted-foreground mb-1">3-Year Ambition</div>
                  <div className="text-lg font-semibold text-foreground">{basics.threeYearAmbition}</div>
                </div>
              )}
            </div>
          </div>

          {/* Expansion Targets */}
          <div className="col-span-2">
            <div className="glass-card p-6 opacity-0 animate-fade-in animation-delay-200">
              <SectionHeader
                title="Expansion Roadmap"
                description={`Workflow expansion targets aligned to ${basics.accountName || "customer"} strategic priorities`}
                delay={150}
              />

              {expansionTargets.length === 0 ? (
                <div className="mt-5 p-8 text-center bg-secondary/20 rounded-xl">
                  <p className="text-muted-foreground">Add Big Bets to see expansion targets</p>
                </div>
              ) : (
                <>
                  <div className="mt-5 space-y-3">
                    {expansionTargets.map((target, index) => (
                      <div
                        key={target.workflow}
                        className="p-4 rounded-xl bg-secondary/30 border border-border/30 opacity-0 animate-fade-in hover:border-primary/30 transition-all"
                        style={{ animationDelay: `${300 + index * 100}ms` }}
                      >
                        <div className="flex items-center gap-4">
                          {/* Workflow Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <Layers className="w-4 h-4 text-primary" />
                              <h4 className="font-semibold text-foreground">{target.workflow}</h4>
                              <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${getStateColor(target.currentState)}`}>
                                {target.currentState}
                              </span>
                            </div>
                            {target.notes && (
                              <p className="text-sm text-muted-foreground">{target.notes}</p>
                            )}
                          </div>

                          {/* Target ACV */}
                          <div className="text-center px-4">
                            <div className="text-2xl font-bold text-gradient">{target.targetACV}</div>
                            <div className="text-[10px] text-muted-foreground">Target ACV</div>
                          </div>

                          {/* Probability */}
                          <div className="w-20">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">Prob.</span>
                              <span className="text-sm font-semibold text-accent">{target.probability}%</span>
                            </div>
                            <div className="progress-track h-1.5">
                              <div className="progress-fill h-1.5" style={{ width: `${target.probability}%` }} />
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="text-right">
                            <div className="text-sm font-medium text-foreground">{target.timeline}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="mt-5 grid grid-cols-3 gap-4">
                    <div className="stat-card opacity-0 animate-fade-in animation-delay-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-primary" />
                        <span className="text-sm text-muted-foreground">Total Opportunity</span>
                      </div>
                      <div className="metric-highlight text-3xl">${(currentValue + totalTarget).toFixed(1)}M</div>
                      <div className="text-xs text-muted-foreground mt-1">Current + Expansion</div>
                    </div>

                    <div className="stat-card opacity-0 animate-fade-in animation-delay-800">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-accent" />
                        <span className="text-sm text-muted-foreground">Growth Potential</span>
                      </div>
                      <div className="metric-highlight-accent text-3xl">+{growthPercent || "N/A"}%</div>
                      <div className="text-xs text-muted-foreground mt-1">ACV Uplift</div>
                    </div>

                    <div className="stat-card opacity-0 animate-fade-in animation-delay-800">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        <span className="text-sm text-muted-foreground">Active Pursuits</span>
                      </div>
                      <div className="text-xl font-bold text-foreground">{expansionTargets.length}</div>
                      <div className="text-xs text-muted-foreground mt-1">In pipeline</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
