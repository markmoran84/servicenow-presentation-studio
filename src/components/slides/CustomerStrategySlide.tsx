import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Compass, Target, Rocket, Lightbulb, ArrowRight, Sparkles, Link2 } from "lucide-react";

export const CustomerStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, generatedPlan } = data;

  const corporate = (strategy.corporateStrategy ?? []).filter(
    (s) => (s.title || "").trim().length > 0 || (s.description || "").trim().length > 0,
  );
  const digital = (strategy.digitalStrategies ?? []).filter(
    (s) => (s.title || "").trim().length > 0 || (s.description || "").trim().length > 0,
  );
  const ceo = (strategy.ceoBoardPriorities ?? []).filter(
    (s) => (s.title || "").trim().length > 0 || (s.description || "").trim().length > 0,
  );
  const themes = (strategy.transformationThemes ?? []).filter(
    (s) => (s.title || "").trim().length > 0 || (s.description || "").trim().length > 0,
  );

  // AI-generated synthesis
  const isAIGenerated = !!generatedPlan?.customerStrategySynthesis;
  const synthesis = generatedPlan?.customerStrategySynthesis;

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Compass className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Customer Strategy</h1>
              <p className="text-muted-foreground text-lg">{basics.accountName} Corporate Direction</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RegenerateSectionButton section="customerStrategySynthesis" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
          </div>
        </div>

        {/* AI Synthesis Banner */}
        {synthesis?.narrative && (
          <div className="glass-card p-5 mb-6 border-l-4 border-l-primary opacity-0 animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Link2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Strategic Synthesis</h3>
                <p className="text-foreground/80 leading-relaxed text-sm">{synthesis.narrative}</p>
              </div>
            </div>
          </div>
        )}

        {/* 3-column strategy canvas */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Left: CEO & Board */}
          <div className="space-y-4">
            <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "150ms" }}>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-accent" />
                <h3 className="font-bold text-foreground">CEO & Board Priorities</h3>
              </div>
              <div className="space-y-2">
                {ceo.length > 0 ? (
                  ceo.map((item, index) => (
                    <div
                      key={`${item.title}-${index}`}
                      className="flex items-start gap-2 p-2 rounded-lg hover:bg-secondary/30 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Add CEO/Board priorities in <span className="font-medium text-foreground">Input Form → Strategy</span>.
                  </p>
                )}
              </div>
            </div>

            <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "250ms" }}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Key Transformation Themes</h3>
              <div className="flex flex-wrap gap-3">
                {themes.length > 0 ? (
                  themes.map((theme, index) => (
                    <div
                      key={`${theme.title}-${index}`}
                      className="px-3 py-2 rounded-lg bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20"
                    >
                      <p className="font-semibold text-foreground text-sm">{theme.title}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Add transformation themes in <span className="font-medium text-foreground">Input Form → Strategy</span>.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Middle: Corporate strategies (main square) */}
          <div className="glass-card p-8 h-full opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-primary font-semibold uppercase tracking-wider">Corporate Strategy</p>
                <h2 className="text-2xl font-bold text-foreground">Strategic Direction</h2>
              </div>
            </div>

            {corporate.length > 0 ? (
              <div className="space-y-3">
                {corporate.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="p-4 rounded-xl bg-secondary/50 border border-border/50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      {index === 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">Primary</span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-secondary/50 border border-border/50 p-4">
                <p className="text-sm font-semibold text-foreground">No corporate strategy found</p>
                <p className="text-sm text-muted-foreground">
                  Go to <span className="font-medium text-foreground">Input Form → Strategy</span> and add Corporate Strategy items, then click{" "}
                  <span className="font-medium text-foreground">Generate with AI</span>.
                </p>
              </div>
            )}
          </div>

          {/* Right: Digital strategies */}
          <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">Digital Strategies</h3>
            </div>

            {digital.length > 0 ? (
              <div className="space-y-3">
                {digital.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="p-3 rounded-lg bg-secondary/50 border-l-2 border-l-primary"
                  >
                    <h4 className="font-semibold text-foreground text-sm mb-1">{item.title}</h4>
                    {item.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Add Digital Strategies in <span className="font-medium text-foreground">Input Form → Strategy</span>.
              </p>
            )}
          </div>
        </div>

        {/* ServiceNow Alignment Row */}
        {synthesis?.serviceNowAlignment && synthesis.serviceNowAlignment.length > 0 && (
          <div className="glass-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                <Link2 className="w-4 h-4 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground">ServiceNow Strategic Alignment</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {synthesis.serviceNowAlignment.map((alignment, index) => (
                <div key={index} className="p-4 rounded-xl bg-secondary/30 border border-border/30">
                  <p className="text-xs text-muted-foreground mb-1">Customer Priority</p>
                  <p className="text-sm font-medium text-foreground mb-3">{alignment.customerPriority}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="w-3 h-3 text-accent" />
                    <p className="text-xs text-accent font-medium">ServiceNow Value</p>
                  </div>
                  <p className="text-xs text-foreground/80">{alignment.serviceNowValue}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
