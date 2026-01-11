import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Target, Users, TrendingUp, Shield, Globe, Zap, Sparkles, ArrowRight, CheckCircle, AlertCircle, Layers } from "lucide-react";

const iconMap = {
  target: Target,
  users: Users,
  "trending-up": TrendingUp,
  shield: Shield,
  globe: Globe,
  zap: Zap,
  layers: Layers,
};

const colorPalettes = {
  blue: {
    gradients: [
      "from-blue-500/20 to-cyan-500/10",
      "from-blue-400/20 to-sky-500/10",
      "from-indigo-500/20 to-blue-500/10",
      "from-cyan-500/20 to-blue-500/10",
    ],
    iconColors: ["text-blue-400", "text-cyan-400", "text-indigo-400", "text-sky-400"],
    accent: "text-blue-400",
    border: "border-blue-500/30",
  },
  emerald: {
    gradients: [
      "from-emerald-500/20 to-teal-500/10",
      "from-green-500/20 to-emerald-500/10",
      "from-teal-500/20 to-cyan-500/10",
      "from-emerald-400/20 to-green-500/10",
    ],
    iconColors: ["text-emerald-400", "text-teal-400", "text-green-400", "text-cyan-400"],
    accent: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  amber: {
    gradients: [
      "from-amber-500/20 to-orange-500/10",
      "from-yellow-500/20 to-amber-500/10",
      "from-orange-500/20 to-red-500/10",
      "from-amber-400/20 to-yellow-500/10",
    ],
    iconColors: ["text-amber-400", "text-orange-400", "text-yellow-400", "text-red-400"],
    accent: "text-amber-400",
    border: "border-amber-500/30",
  },
  purple: {
    gradients: [
      "from-purple-500/20 to-pink-500/10",
      "from-violet-500/20 to-purple-500/10",
      "from-fuchsia-500/20 to-pink-500/10",
      "from-purple-400/20 to-indigo-500/10",
    ],
    iconColors: ["text-purple-400", "text-violet-400", "text-fuchsia-400", "text-pink-400"],
    accent: "text-purple-400",
    border: "border-purple-500/30",
  },
  rose: {
    gradients: [
      "from-rose-500/20 to-pink-500/10",
      "from-red-500/20 to-rose-500/10",
      "from-pink-500/20 to-fuchsia-500/10",
      "from-rose-400/20 to-red-500/10",
    ],
    iconColors: ["text-rose-400", "text-pink-400", "text-red-400", "text-fuchsia-400"],
    accent: "text-rose-400",
    border: "border-rose-500/30",
  },
  cyan: {
    gradients: [
      "from-cyan-500/20 to-blue-500/10",
      "from-sky-500/20 to-cyan-500/10",
      "from-teal-500/20 to-cyan-500/10",
      "from-cyan-400/20 to-sky-500/10",
    ],
    iconColors: ["text-cyan-400", "text-sky-400", "text-teal-400", "text-blue-400"],
    accent: "text-cyan-400",
    border: "border-cyan-500/30",
  },
  indigo: {
    gradients: [
      "from-indigo-500/20 to-purple-500/10",
      "from-violet-500/20 to-indigo-500/10",
      "from-blue-500/20 to-indigo-500/10",
      "from-indigo-400/20 to-violet-500/10",
    ],
    iconColors: ["text-indigo-400", "text-violet-400", "text-blue-400", "text-purple-400"],
    accent: "text-indigo-400",
    border: "border-indigo-500/30",
  },
};

export const CustomerStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, generatedPlan } = data;

  // AI-generated synthesis with structured pillars
  const synthesis = generatedPlan?.customerStrategySynthesis;
  const strategicPillars = synthesis?.strategicPillars || [];
  const layoutVariant = synthesis?.layoutVariant || "grid-2x2";
  const accentColor = synthesis?.accentColor || "blue";
  const palette = colorPalettes[accentColor] || colorPalettes.blue;
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

  // Render pillars based on layout variant
  const renderPillars = () => {
    if (strategicPillars.length === 0) return null;

    switch (layoutVariant) {
      case "stacked-cards":
        return (
          <div className="space-y-4 mb-8">
            {strategicPillars.map((pillar, index) => {
              const IconComponent = iconMap[pillar.icon as keyof typeof iconMap] || Target;
              return (
                <div 
                  key={index} 
                  className={`glass-card p-6 bg-gradient-to-r ${palette.gradients[index % 4]} opacity-0 animate-fade-in border-l-4 ${palette.border}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-xl bg-background/50 flex items-center justify-center flex-shrink-0">
                      <IconComponent className={`w-7 h-7 ${palette.iconColors[index % 4]}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3 mb-1">
                        <h3 className="text-2xl font-bold text-foreground">{pillar.headline}</h3>
                        <span className={`text-sm font-medium ${palette.accent}`}>{pillar.subtitle}</span>
                      </div>
                      <p className="text-muted-foreground text-sm">{pillar.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case "horizontal-flow":
        return (
          <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
            {strategicPillars.map((pillar, index) => {
              const IconComponent = iconMap[pillar.icon as keyof typeof iconMap] || Target;
              return (
                <div 
                  key={index} 
                  className={`glass-card p-5 bg-gradient-to-br ${palette.gradients[index % 4]} min-w-[280px] flex-shrink-0 opacity-0 animate-fade-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center">
                      <IconComponent className={`w-5 h-5 ${palette.iconColors[index % 4]}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground leading-tight">{pillar.headline}</h3>
                    </div>
                  </div>
                  <p className={`text-sm font-medium ${palette.accent} mb-2`}>{pillar.subtitle}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">{pillar.description}</p>
                  {index < strategicPillars.length - 1 && (
                    <ArrowRight className={`absolute right-[-20px] top-1/2 -translate-y-1/2 w-6 h-6 ${palette.accent} hidden lg:block`} />
                  )}
                </div>
              );
            })}
          </div>
        );

      case "spotlight":
        const spotlightPillar = strategicPillars[0];
        const otherPillars = strategicPillars.slice(1);
        const SpotlightIcon = iconMap[spotlightPillar?.icon as keyof typeof iconMap] || Target;
        
        return (
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Spotlight card - larger */}
            <div 
              className={`col-span-2 glass-card p-8 bg-gradient-to-br ${palette.gradients[0]} opacity-0 animate-fade-in`}
            >
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl bg-background/50 flex items-center justify-center flex-shrink-0">
                  <SpotlightIcon className={`w-8 h-8 ${palette.iconColors[0]}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-foreground mb-2">{spotlightPillar?.headline}</h3>
                  <p className={`text-lg font-medium ${palette.accent} mb-4`}>{spotlightPillar?.subtitle}</p>
                  <p className="text-muted-foreground leading-relaxed">{spotlightPillar?.description}</p>
                </div>
              </div>
            </div>
            {/* Secondary pillars - stacked */}
            <div className="space-y-4">
              {otherPillars.slice(0, 3).map((pillar, index) => {
                const IconComponent = iconMap[pillar.icon as keyof typeof iconMap] || Target;
                return (
                  <div 
                    key={index} 
                    className={`glass-card p-4 bg-gradient-to-br ${palette.gradients[(index + 1) % 4]} opacity-0 animate-fade-in`}
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center flex-shrink-0">
                        <IconComponent className={`w-5 h-5 ${palette.iconColors[(index + 1) % 4]}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{pillar.headline}</h4>
                        <p className={`text-xs ${palette.accent}`}>{pillar.subtitle}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "grid-2x2":
      default:
        return (
          <div className="grid grid-cols-2 gap-6 mb-8">
            {strategicPillars.map((pillar, index) => {
              const IconComponent = iconMap[pillar.icon as keyof typeof iconMap] || Target;
              return (
                <div 
                  key={index} 
                  className={`glass-card p-6 bg-gradient-to-br ${palette.gradients[index % 4]} opacity-0 animate-fade-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center flex-shrink-0">
                      <IconComponent className={`w-6 h-6 ${palette.iconColors[index % 4]}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground leading-tight mb-1">
                        {pillar.headline}
                      </h3>
                      <p className={`text-lg font-medium ${palette.accent} mb-3`}>
                        {pillar.subtitle}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Customer Strategy
          </h1>
          <div className="flex items-center gap-2">
            <RegenerateSectionButton section="customerStrategySynthesis" label="Regenerate Slide" />
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

            {/* Strategic Pillars - AI Generated with Layout Variants */}
            {strategicPillars.length > 0 ? (
              renderPillars()
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

            {/* Narrative Section */}
            {synthesis?.narrative && (
              <div className="glass-card p-6 mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
                <p className="text-muted-foreground leading-relaxed italic">
                  "{synthesis.narrative}"
                </p>
              </div>
            )}

            {/* ServiceNow Alignment Section */}
            {synthesis?.serviceNowAlignment && synthesis.serviceNowAlignment.length > 0 && (
              <div className="glass-card p-6 mb-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center`}>
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">Platform Alignment</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {synthesis.serviceNowAlignment.slice(0, 4).map((alignment, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg bg-secondary/30 border ${palette.border} opacity-0 animate-fade-in`}
                      style={{ animationDelay: `${400 + index * 100}ms` }}
                    >
                      <p className="text-muted-foreground text-sm mb-2">{alignment.customerPriority}</p>
                      <div className="flex items-center gap-2">
                        <ArrowRight className={`w-3 h-3 ${palette.accent} flex-shrink-0`} />
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
              <div className={`flex items-center gap-2 ${palette.accent}`}>
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
