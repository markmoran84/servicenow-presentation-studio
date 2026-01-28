import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Sparkles, AlertCircle } from "lucide-react";

export const CustomerStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, annualReport, generatedPlan } = data;

  // Get vision and purpose from annual report
  const visionStatement = annualReport?.visionStatement || "A Connected Trip";
  const purposeStatement = annualReport?.purposeStatement || "Our purpose is to make it easier for everyone to experience the world.";

  // Get long-term aims
  const longTermAims = annualReport?.longTermAims || [
    "Deliver a fully connected trip across accommodation, flights, ground transport, attractions, and payments",
    "Be the preferred platform for travelers and partners, at global scale",
    "Build a high-margin, resilient marketplace through technology and data",
    "Earn trust through security, privacy, and responsible AI",
    "Grow sustainably with strong cash generation",
    "Operate efficiently while scaling volume and complexity"
  ];

  // Get transformation themes (tasks for current year)
  const transformationThemes = strategy.transformationThemes?.filter(
    t => t.title?.trim()
  ) || [];

  // Get corporate strategy (objectives)
  const corporateStrategy = strategy.corporateStrategy?.filter(
    s => s.title?.trim()
  ) || [];

  // Medium-term ambitions
  const mediumTermAmbitions = annualReport?.mediumTermAmbitions || [
    { title: "Better efficiencies", metric: "Tbc" },
    { title: "Improve free cash flow", metric: "Tbc" },
    { title: "Grow the business", metric: "Tbc" }
  ];

  const isAIGenerated = !!generatedPlan?.customerStrategySynthesis;
  const hasData = visionStatement || transformationThemes.length > 0 || corporateStrategy.length > 0;

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
          <div className="space-y-5">
            {/* Vision Banner */}
            <div className="glass-card p-5 text-center opacity-0 animate-fade-in" style={{ animationDelay: "50ms" }}>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
                {visionStatement}
              </h2>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Our purpose</span> {purposeStatement}
              </p>
            </div>

            {/* Long-term Aims Row */}
            <div className="grid grid-cols-12 gap-5 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="col-span-2 glass-card p-4 flex items-center">
                <div>
                  <p className="text-primary font-semibold text-sm">Our six longer-term aims</p>
                  <p className="text-muted-foreground text-xs mt-1">Our ambition is...</p>
                </div>
              </div>
              <div className="col-span-10 grid grid-cols-3 gap-3">
                {longTermAims.slice(0, 6).map((aim, index) => (
                  <div key={index} className="glass-card p-3 flex items-center">
                    <p className="text-foreground text-xs font-medium leading-snug">{aim}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks Row - Transformation Themes */}
            {transformationThemes.length > 0 && (
              <div className="grid grid-cols-12 gap-5 opacity-0 animate-fade-in" style={{ animationDelay: "150ms" }}>
                <div className="col-span-2 glass-card p-4 flex items-center">
                  <div>
                    <p className="text-primary font-semibold text-sm">Our Tasks for 2025/26</p>
                    <p className="text-muted-foreground text-xs mt-1">We must...</p>
                  </div>
                </div>
                <div className="col-span-10 grid grid-cols-4 gap-3">
                  {transformationThemes.slice(0, 4).map((theme, index) => (
                    <div key={index} className="glass-card p-3 text-center">
                      <p className="text-primary font-semibold text-sm">{theme.title}</p>
                      <p className="text-muted-foreground text-[10px] mt-1">+ For more see page #xx</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Objectives Row - Corporate Strategy */}
            {corporateStrategy.length > 0 && (
              <div className="grid grid-cols-12 gap-5 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
                <div className="col-span-2 glass-card p-4 flex items-center">
                  <div>
                    <p className="text-primary font-semibold text-sm">Our Objectives for 2026 +</p>
                    <p className="text-muted-foreground text-xs mt-1">We will...</p>
                  </div>
                </div>
                <div className="col-span-10 grid grid-cols-4 gap-3">
                  {corporateStrategy.slice(0, 4).map((obj, index) => (
                    <div key={index} className="glass-card p-3">
                      <ul className="space-y-1">
                        <li className="text-foreground text-xs leading-snug">• {obj.description || obj.title}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Medium-term Ambitions Row */}
            <div className="grid grid-cols-12 gap-5 opacity-0 animate-fade-in" style={{ animationDelay: "250ms" }}>
              <div className="col-span-2 glass-card p-4 flex items-center">
                <div>
                  <p className="text-primary font-semibold text-sm">Delivering on our medium-term ambitions</p>
                </div>
              </div>
              <div className="col-span-10 grid grid-cols-4 gap-3">
                {mediumTermAmbitions.map((ambition: any, index: number) => (
                  <div key={index} className="glass-card p-4 text-center">
                    <p className="text-primary font-bold text-lg">{ambition.title}</p>
                    <p className="text-muted-foreground text-xs mt-2">{ambition.metric}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Banner */}
            <div className="rounded-xl bg-primary/20 border border-primary/30 p-4 text-center opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <p className="text-foreground text-sm font-medium">
                Underpinned by Group governance, support services and risk management
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
