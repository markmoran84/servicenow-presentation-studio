import { SectionHeader } from "@/components/SectionHeader";
import { Ship, Globe, TrendingUp, Target, Cpu, DollarSign, Users, Info, ArrowRight } from "lucide-react";
import { useAccountData } from "@/context/AccountDataContext";

export const CustomerOverviewSlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, businessModel, annualReport } = data;
  const competitors = businessModel.competitors || [];
  const companyName = basics.accountName || "Customer";

  // Build strategic pillars from context data
  const corporateStrategies = strategy.corporateStrategy?.filter(s => s.title?.trim()) || [];
  const digitalStrategies = strategy.digitalStrategies?.filter(s => s.title?.trim()) || [];
  const ceoPriorities = strategy.ceoBoardPriorities?.filter(s => s.title?.trim()) || [];

  const hasStrategyData = corporateStrategies.length > 0 || digitalStrategies.length > 0 || ceoPriorities.length > 0;

  // Dynamic pillars from annual report or strategy
  const pillars = annualReport.strategicPillars?.slice(0, 4) || [];
  const hasPillars = pillars.length > 0;

  const iconForPillar = (icon: string) => {
    switch (icon) {
      case "network": return Ship;
      case "technology": return Cpu;
      case "efficiency": return DollarSign;
      case "customer": return Users;
      default: return Globe;
    }
  };

  const colorForIndex = (idx: number) => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-primary to-sn-green",
      "from-amber-500 to-orange-500",
      "from-purple-500 to-pink-500",
    ];
    return colors[idx % colors.length];
  };

  return (
    <div className="h-full overflow-auto px-8 pt-6 pb-32">
      <h1 className="text-4xl font-bold text-foreground mb-6 opacity-0 animate-fade-in">
        Customer Overview & Strategy
      </h1>

      {!hasStrategyData && !hasPillars ? (
        <div className="glass-card rounded-2xl p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Customer Strategy Data</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Complete the Input Form with customer strategy details or upload an Annual Report to populate this view with {companyName}'s strategic direction.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {/* Left - Overview */}
          <div className="col-span-2">
            <div className="glass-card rounded-2xl p-6 h-full">
              <SectionHeader
                title={`${companyName} Strategic Direction`}
                description={basics.industry ? `${basics.industry} sector leader` : "Enterprise customer"}
                delay={100}
              />

              {hasPillars ? (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {pillars.map((pillar, index) => {
                    const IconComponent = iconForPillar(pillar.icon);
                    return (
                      <div
                        key={pillar.title}
                        className="bg-card/50 rounded-xl p-4 border border-border/50 opacity-0 animate-fade-in hover:border-primary/30 transition-all duration-300"
                        style={{ animationDelay: `${200 + index * 100}ms` }}
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorForIndex(index)} flex items-center justify-center mb-3`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{pillar.title}</h3>
                        <p className="text-sm text-muted-foreground">{pillar.description}</p>
                      </div>
                    );
                  })}
                </div>
              ) : corporateStrategies.length > 0 ? (
                <div className="mt-6 space-y-3">
                  {corporateStrategies.slice(0, 4).map((strat, index) => (
                    <div
                      key={`${strat.title}-${index}`}
                      className="bg-card/50 rounded-xl p-4 border border-border/50 opacity-0 animate-fade-in"
                      style={{ animationDelay: `${200 + index * 100}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <ArrowRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-foreground">{strat.title}</h3>
                          {strat.description && (
                            <p className="text-sm text-muted-foreground mt-1">{strat.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 p-4 bg-secondary/30 rounded-xl border border-border/30">
                  <p className="text-sm text-muted-foreground">
                    Add corporate strategies in the Input Form to see strategic direction here.
                  </p>
                </div>
              )}

              {/* Context summary */}
              {annualReport.executiveSummaryNarrative && (
                <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20 opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">Strategic Context</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {annualReport.executiveSummaryNarrative}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right - Priorities */}
          <div>
            <div className="glass-card rounded-2xl p-6 h-full">
              <SectionHeader
                title="Enterprise Priorities"
                description={`${companyName} key focus areas`}
                delay={150}
              />

              {ceoPriorities.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {ceoPriorities.slice(0, 4).map((priority, index) => (
                    <div
                      key={`${priority.title}-${index}`}
                      className="p-4 bg-gradient-to-r from-sn-navy/50 to-transparent rounded-xl border-l-4 border-primary opacity-0 animate-fade-in"
                      style={{ animationDelay: `${300 + index * 100}ms` }}
                    >
                      <h4 className="font-semibold text-foreground mb-1">{priority.title}</h4>
                      {priority.description && (
                        <p className="text-sm text-muted-foreground">{priority.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 p-4 bg-secondary/30 rounded-xl border border-border/30">
                  <p className="text-sm text-muted-foreground">
                    Add CEO/Board priorities in the Input Form to see enterprise priorities here.
                  </p>
                </div>
              )}

              {/* ServiceNow Position - only if we have context */}
              {hasStrategyData && (
                <div className="mt-6 p-4 bg-sn-green/10 rounded-xl border border-sn-green/30 opacity-0 animate-fade-in" style={{ animationDelay: "700ms" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-sn-green" />
                    <span className="font-semibold text-foreground">ServiceNow Position</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Digital execution backbone — positioned as the strategic platform to operationalise {companyName}'s transformation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Competitive Landscape Section */}
      {competitors.length > 0 && (
        <div className="mt-6 glass-card rounded-2xl p-6 opacity-0 animate-fade-in" style={{ animationDelay: "800ms" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Competitive Landscape</h3>
              <p className="text-sm text-muted-foreground">Key competitors in the market</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {competitors.map((competitor, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-card/50 rounded-lg border border-border/50 text-sm font-medium text-foreground hover:border-primary/30 transition-all duration-300 opacity-0 animate-fade-in"
                style={{ animationDelay: `${850 + index * 50}ms` }}
              >
                {competitor}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
