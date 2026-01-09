import { useAccountData } from "@/context/AccountDataContext";
import { Compass, Target, Rocket, Lightbulb, ArrowRight } from "lucide-react";

export const CustomerStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy } = data;

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

  // Get the first corporate strategy as the main thesis
  const mainStrategy = corporate[0];
  const supportingStrategies = corporate.slice(1);

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Compass className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Customer Strategy</h1>
            <p className="text-muted-foreground text-lg">{basics.accountName} Corporate Direction</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Strategy Thesis - Takes 2 columns */}
          <div className="col-span-2">
            <div className="glass-card p-8 h-full opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-primary font-semibold uppercase tracking-wider">Corporate Strategy</p>
                  <h2 className="text-2xl font-bold text-foreground">
                    {mainStrategy?.title || "Corporate Strategy (add in Input Form)"}
                  </h2>
                </div>
              </div>

              {mainStrategy?.description ? (
                <p className="text-lg text-foreground/90 leading-relaxed mb-8">{mainStrategy.description}</p>
              ) : (
                <div className="rounded-xl bg-secondary/50 border border-border/50 p-4 mb-8">
                  <p className="text-sm font-semibold text-foreground">No corporate strategy found</p>
                  <p className="text-sm text-muted-foreground">
                    Go to <span className="font-medium text-foreground">Input Form → Strategy</span> and add at least one Corporate Strategy item (title + description), then click{" "}
                    <span className="font-medium text-foreground">Generate with AI</span>.
                  </p>
                </div>
              )}

              {/* Digital Strategy Priorities */}
              <div className="border-t border-border pt-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Digital Strategy Priorities
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {digital.map((item, index) => (
                    <div
                      key={`${item.title}-${index}`}
                      className="p-4 rounded-xl bg-secondary/50 border border-border/50 opacity-0 animate-fade-in"
                      style={{ animationDelay: `${200 + index * 100}ms` }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Corporate Strategies + CEO Priorities */}
          <div className="space-y-4">
            <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "150ms" }}>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground">Corporate Strategies</h3>
              </div>
              <div className="space-y-3">
                {corporate.length > 0 ? (
                  corporate.slice(0, 4).map((item, index) => (
                    <div
                      key={`${item.title}-${index}`}
                      className="p-3 rounded-lg bg-secondary/50 border-l-2 border-l-primary opacity-0 animate-fade-in"
                      style={{ animationDelay: `${250 + index * 75}ms` }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                        {index === 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">Primary</span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Add Corporate Strategies in <span className="font-medium text-foreground">Input Form → Strategy</span>.
                  </p>
                )}
              </div>
            </div>

            {/* CEO Priorities */}
            <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-accent" />
                <h3 className="font-bold text-foreground">CEO & Board Priorities</h3>
              </div>
              <div className="space-y-2">
                {ceo.slice(0, 4).map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="flex items-start gap-2 p-2 rounded-lg hover:bg-secondary/30 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transformation Themes Footer */}
        <div className="mt-6 glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "500ms" }}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Key Transformation Themes</h3>
          <div className="flex gap-4">
            {themes.map((theme, index) => (
              <div
                key={`${theme.title}-${index}`}
                className="flex-1 p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20"
              >
                <p className="font-semibold text-foreground text-sm">{theme.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
