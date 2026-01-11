import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Target, Users, TrendingUp, Shield, Globe, Zap, Sparkles, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

const iconMap = {
  target: Target,
  users: Users,
  "trending-up": TrendingUp,
  shield: Shield,
  globe: Globe,
  zap: Zap,
};

export const CustomerStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, generatedPlan } = data;

  // AI-generated synthesis with structured pillars
  const synthesis = generatedPlan?.customerStrategySynthesis;
  const strategicPillars = synthesis?.strategicPillars || [];
  const isAIGenerated = strategicPillars.length > 0;

  // Fallback to raw input data if no AI synthesis
  const normalizeKey = (s: { title?: string; description?: string }) =>
    `${(s.title ?? "").trim().toLowerCase().replace(/\s+/g, " ")}||${(s.description ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")}`;

  const dedupeItems = (items: { title?: string; description?: string }[]) => {
    const seen = new Set<string>();
    return items.filter((it) => {
      const key = normalizeKey(it);
      if (key === "||") return false;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const corporate = dedupeItems((strategy.corporateStrategy ?? []).filter(
    (s) => (s.title || "").trim().length > 0 || (s.description || "").trim().length > 0,
  ));

  const digitalRaw = dedupeItems((strategy.digitalStrategies ?? []).filter(
    (s) => (s.title || "").trim().length > 0 || (s.description || "").trim().length > 0,
  ));

  // If the extractor duplicated corporate strategy into digital strategy, hide duplicates.
  const corporateKeys = new Set(corporate.map(normalizeKey));
  const digital = digitalRaw.filter((s) => !corporateKeys.has(normalizeKey(s)));

  const hasData = strategicPillars.length > 0 || corporate.length > 0 || digital.length > 0;

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
                AI Synthesized
              </span>
            )}
          </div>
        </div>

        {!hasData ? (
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in">
            <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Strategy Data</h3>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
              Upload an annual report or generate an AI plan to extract strategic pillars.
            </p>
          </div>
        ) : (
          <>
            {/* Top Row - Account Context */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="glass-card p-5 flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Account:</span>
                <span className="text-foreground font-medium">{basics.accountName || "Not specified"}</span>
              </div>
              <div className="glass-card p-5 flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Strategic Pillars:</span>
                <span className="text-foreground font-semibold">
                  {strategicPillars.length > 0 ? strategicPillars.length : corporate.length + digital.length}
                </span>
              </div>
            </div>

            {/* Strategic Pillars Grid - AI Generated */}
            {strategicPillars.length > 0 ? (
              <div className="grid grid-cols-2 gap-6 mb-8">
                {strategicPillars.map((pillar, index) => {
                  const IconComponent = iconMap[pillar.icon as keyof typeof iconMap] || Target;
                  const gradients = [
                    "from-blue-500/20 to-cyan-500/10",
                    "from-emerald-500/20 to-teal-500/10",
                    "from-amber-500/20 to-orange-500/10",
                    "from-purple-500/20 to-pink-500/10",
                  ];
                  const iconColors = ["text-blue-400", "text-emerald-400", "text-amber-400", "text-purple-400"];
                  
                  return (
                    <div 
                      key={index} 
                      className={`glass-card p-6 bg-gradient-to-br ${gradients[index % 4]} opacity-0 animate-fade-in`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className={`w-6 h-6 ${iconColors[index % 4]}`} />
                        </div>
                        <div className="flex-1">
                          {/* Headline + Subtitle */}
                          <h3 className="text-xl font-bold text-foreground leading-tight mb-1">
                            {pillar.headline}
                          </h3>
                          <p className={`text-lg font-medium ${iconColors[index % 4]} mb-3`}>
                            {pillar.subtitle}
                          </p>
                          {/* Description */}
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {pillar.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Fallback: Raw Input Data Display with Confidence Indicators */
              <div className="grid grid-cols-2 gap-6 mb-8">
                {corporate.map((item, index) => (
                  <div 
                    key={`corp-${index}`} 
                    className="glass-card p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 opacity-0 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center flex-shrink-0">
                        <Target className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-foreground leading-tight">
                            {item.title}
                          </h3>
                          {(item as any).confidence && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-medium ${
                              (item as any).confidence === 'explicit' 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {(item as any).confidence === 'explicit' ? 'Explicit' : 'Derived'}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                            {item.description}
                          </p>
                        )}
                        {(item as any).sourceReference && (
                          <p className="text-[11px] text-muted-foreground/60 italic">
                            Source: {(item as any).sourceReference}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {digital.map((item, index) => (
                  <div 
                    key={`dig-${index}`} 
                    className="glass-card p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 opacity-0 animate-fade-in"
                    style={{ animationDelay: `${(corporate.length + index) * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-foreground leading-tight">
                            {item.title}
                          </h3>
                          {(item as any).confidence && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-medium ${
                              (item as any).confidence === 'explicit' 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {(item as any).confidence === 'explicit' ? 'Explicit' : 'Derived'}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                            {item.description}
                          </p>
                        )}
                        {(item as any).sourceReference && (
                          <p className="text-[11px] text-muted-foreground/60 italic">
                            Source: {(item as any).sourceReference}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ServiceNow Alignment Section */}
            {synthesis?.serviceNowAlignment && synthesis.serviceNowAlignment.length > 0 && (
              <div className="glass-card p-6 mb-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">Platform Alignment</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {synthesis.serviceNowAlignment.slice(0, 4).map((alignment, index) => (
                    <div 
                      key={index} 
                      className="p-4 rounded-lg bg-secondary/30 border border-border/50 opacity-0 animate-fade-in"
                      style={{ animationDelay: `${400 + index * 100}ms` }}
                    >
                      <p className="text-muted-foreground text-sm mb-2">{alignment.customerPriority}</p>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="w-3 h-3 text-primary flex-shrink-0" />
                        <p className="text-foreground font-medium text-sm">{alignment.serviceNowValue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Bar */}
            <div className="glass-card p-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {basics.accountName} strategic priorities extracted from annual report
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
