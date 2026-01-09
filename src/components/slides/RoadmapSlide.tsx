import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Calendar, ArrowRight, Sparkles, Info } from "lucide-react";

export const RoadmapSlide = () => {
  const { data } = useAccountData();
  const plan = data.generatedPlan;
  const companyName = data.basics.accountName || "the customer";

  // Use AI-generated roadmap phases only - no hardcoded defaults
  const phases = plan?.roadmapPhases?.slice(0, 3) || [];
  const hasPhases = phases.length > 0;

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
            <Calendar className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Transformation Roadmap</h1>
            <p className="text-muted-foreground text-lg">
              Phased execution plan for {companyName}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <RegenerateSectionButton section="roadmapPhases" />
            {hasPhases && (
              <span className="pill-badge bg-accent/20 text-accent border-accent/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
          </div>
        </div>

        {hasPhases ? (
          <>
            <div className="flex items-start gap-4">
              {phases.map((phase, i) => (
                <div 
                  key={i} 
                  className="flex-1 glass-card p-6 opacity-0 animate-fade-in" 
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="text-2xl font-bold text-primary mb-2">{phase.quarter}</div>
                  <div className="text-lg font-semibold text-foreground mb-4">{phase.title}</div>
                  <ul className="space-y-2">
                    {(phase.activities || []).map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ArrowRight className="w-4 h-4 text-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Summary Footer */}
            <div className="mt-8 glass-card p-6 border-l-4 border-l-primary opacity-0 animate-fade-in" style={{ animationDelay: "500ms" }}>
              <p className="text-foreground">
                <span className="font-semibold text-primary">Roadmap Approach:</span> Phased execution with clear milestones. 
                Each phase builds on the previous, ensuring sustainable transformation with measurable outcomes at each stage.
              </p>
            </div>
          </>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Roadmap Generated</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Complete the Input Form with account details and click <span className="font-medium text-foreground">Generate with AI</span> to create a transformation roadmap tailored to {companyName}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
