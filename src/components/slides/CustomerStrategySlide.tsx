import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Sparkles, AlertCircle } from "lucide-react";

export const CustomerStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, annualReport, generatedPlan } = data;

  // Get vision and purpose from annual report
  const visionStatement = annualReport?.visionStatement || "";
  const purposeStatement = annualReport?.purposeStatement || "";

  // Get long-term aims (6 strategic aims)
  const longTermAims = annualReport?.longTermAims || [];

  // Get transformation themes (tasks for current year)
  const transformationThemes = strategy.transformationThemes?.filter(
    t => t.title?.trim()
  ) || [];

  // Get strategic objectives organized by theme
  const strategicObjectives = annualReport?.strategicObjectives || [];

  // Get corporate strategy (fallback for objectives if strategicObjectives not available)
  const corporateStrategy = strategy.corporateStrategy?.filter(
    s => s.title?.trim()
  ) || [];

  // Medium-term ambitions with metrics
  const mediumTermAmbitions = annualReport?.mediumTermAmbitions || [];

  const isAIGenerated = !!generatedPlan?.customerStrategySynthesis;
  const hasData = visionStatement || transformationThemes.length > 0 || longTermAims.length > 0;

  return (
    <div className="min-h-screen p-8 md:p-10 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Customer Strategy
          </h1>
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

        {!hasData ? (
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in">
            <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Strategy Data</h3>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
              Upload an annual report or complete the Strategy section to populate customer strategy.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Vision Banner */}
            {visionStatement && (
              <div className="glass-card p-4 text-center opacity-0 animate-fade-in" style={{ animationDelay: "50ms" }}>
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  {visionStatement}
                </h2>
                {purposeStatement && (
                  <p className="text-muted-foreground text-sm">
                    <span className="font-semibold text-foreground">Our purpose</span> {purposeStatement}
                  </p>
                )}
              </div>
            )}

            {/* Long-term Aims Row */}
            {longTermAims.length > 0 && (
              <div className="grid grid-cols-12 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <div className="col-span-2 glass-card p-3 flex items-center">
                  <div>
                    <p className="text-primary font-semibold text-xs">Our {longTermAims.length} longer-term aims</p>
                    <p className="text-muted-foreground text-[10px] mt-1">Our ambition is...</p>
                  </div>
                </div>
                <div className="col-span-10 grid grid-cols-3 gap-2">
                  {longTermAims.slice(0, 6).map((aim, index) => (
                    <div key={index} className="glass-card p-2 flex items-center">
                      <p className="text-foreground text-[11px] font-medium leading-snug">{aim}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tasks Row - Transformation Themes */}
            {transformationThemes.length > 0 && (
              <div className="grid grid-cols-12 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "150ms" }}>
                <div className="col-span-2 glass-card p-3 flex items-center">
                  <div>
                    <p className="text-primary font-semibold text-xs">Our Tasks for 2025/26</p>
                    <p className="text-muted-foreground text-[10px] mt-1">We must...</p>
                  </div>
                </div>
                <div className={`col-span-10 grid gap-2 ${transformationThemes.length <= 4 ? 'grid-cols-4' : 'grid-cols-5'}`}>
                  {transformationThemes.slice(0, 5).map((theme, index) => (
                    <div key={index} className="glass-card p-3 text-center">
                      <p className="text-primary font-semibold text-xs">{theme.title}</p>
                      {theme.description && (
                        <p className="text-muted-foreground text-[9px] mt-1 line-clamp-2">{theme.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Objectives Row - Detailed bullet points for each theme */}
            {(strategicObjectives.length > 0 || corporateStrategy.length > 0) && (
              <div className="grid grid-cols-12 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
                <div className="col-span-2 glass-card p-3 flex items-center">
                  <div>
                    <p className="text-primary font-semibold text-xs">Our Objectives for 2026+</p>
                    <p className="text-muted-foreground text-[10px] mt-1">We will...</p>
                  </div>
                </div>
                <div className={`col-span-10 grid gap-2 ${
                  strategicObjectives.length > 0 
                    ? (strategicObjectives.length <= 4 ? 'grid-cols-4' : 'grid-cols-5')
                    : (corporateStrategy.length <= 4 ? 'grid-cols-4' : 'grid-cols-5')
                }`}>
                  {strategicObjectives.length > 0 ? (
                    strategicObjectives.slice(0, 5).map((obj, index) => (
                      <div key={index} className="glass-card p-3">
                        <ul className="space-y-1">
                          {obj.bullets.slice(0, 4).map((bullet, bIndex) => (
                            <li key={bIndex} className="text-foreground text-[10px] leading-snug flex items-start gap-1">
                              <span className="text-primary mt-0.5">•</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    corporateStrategy.slice(0, 5).map((obj, index) => (
                      <div key={index} className="glass-card p-3">
                        <ul className="space-y-1">
                          <li className="text-foreground text-[10px] leading-snug flex items-start gap-1">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{obj.description || obj.title}</span>
                          </li>
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Medium-term Ambitions Row with Metrics */}
            {mediumTermAmbitions.length > 0 && (
              <div className="grid grid-cols-12 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "250ms" }}>
                <div className="col-span-2 glass-card p-3 flex items-center">
                  <div>
                    <p className="text-primary font-semibold text-xs">Delivering on our medium-term ambitions</p>
                  </div>
                </div>
                <div className={`col-span-10 grid gap-2 ${mediumTermAmbitions.length <= 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                  {mediumTermAmbitions.slice(0, 4).map((ambition, index) => (
                    <div key={index} className="glass-card p-3 text-center">
                      <p className="text-primary font-bold text-sm">{ambition.title}</p>
                      <p className="text-muted-foreground text-xs mt-1">{ambition.metric || "Tbc"}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Banner */}
            <div className="rounded-xl bg-primary/20 border border-primary/30 p-3 text-center opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <p className="text-foreground text-xs font-medium">
                Underpinned by Group governance, support services and risk management
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
