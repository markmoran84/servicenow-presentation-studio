import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Calendar, ArrowRight, Sparkles, Info, Target, Compass, Zap, TrendingUp } from "lucide-react";

export const RoadmapSlide = () => {
  const { data } = useAccountData();
  const plan = data.generatedPlan;
  const companyName = data.basics.accountName || "the customer";

  // Pull strategic data from various sources
  const phases = plan?.roadmapPhases?.slice(0, 3) || [];
  const hasPhases = phases.length > 0;
  
  // Customer strategy themes (drivers)
  const transformationThemes = data.strategy.transformationThemes?.filter(t => t.title).slice(0, 4) || [];
  
  // Strategic priorities mapped to workstreams
  const strategicPriorities = plan?.strategicPriorities?.slice(0, 4) || [];
  
  // Success metrics as target outcomes
  const successMetrics = plan?.successMetrics?.slice(0, 4) || [];
  
  // Vision statement
  const vision = data.basics.visionStatement || data.annualReport?.executiveSummaryNarrative || "";

  return (
    <div className="min-h-screen p-6 md:p-8 pb-32 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Strategic Roadmap for {companyName}</h1>
            <p className="text-muted-foreground">Transformation journey connecting strategy to execution</p>
          </div>
          <div className="flex items-center gap-2">
            <RegenerateSectionButton section="roadmapPhases" />
            {hasPhases && (
              <span className="pill-badge bg-accent/20 text-accent border-accent/30 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
          </div>
        </div>

        {hasPhases ? (
          <div className="grid grid-cols-12 gap-3">
            {/* Column 1: Purpose/Vision */}
            <div className="col-span-2 flex flex-col">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 text-center">Purpose</div>
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-primary/5 rounded-xl border border-primary/30" />
                <div className="relative h-full flex items-center justify-center p-4">
                  <div className="writing-mode-vertical text-center">
                    <p className="text-sm font-medium text-primary leading-relaxed">
                      {vision || `Enabling ${companyName}'s digital transformation through strategic partnership`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Business Objectives */}
            <div className="col-span-2 flex flex-col">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 text-center">Business Objectives</div>
              <div className="flex-1 space-y-2">
                {(transformationThemes.length > 0 ? transformationThemes : [
                  { title: "Customer Growth", description: "Drive profitable growth" },
                  { title: "Operational Excellence", description: "Faster, safer, lower cost" },
                  { title: "Technology Transformation", description: "Enable agility & innovation" },
                  { title: "AI & Data at Scale", description: "Predict, decide, act faster" }
                ]).map((theme, i) => (
                  <div key={i} className="glass-card p-3 border-l-2 border-l-accent opacity-0 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="text-xs font-bold text-foreground">{theme.title}</div>
                    <div className="text-[10px] text-muted-foreground line-clamp-2">{theme.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: CX Drivers */}
            <div className="col-span-2 flex flex-col">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 text-center">CX Drivers</div>
              <div className="flex-1 space-y-2">
                {(strategicPriorities.length > 0 ? strategicPriorities : [
                  { title: "Elevate Customer Experience" },
                  { title: "Lower Cost to Serve" },
                  { title: "Unlock Commercial Agility" },
                  { title: "Embed AI as Core Capability" }
                ]).map((priority, i) => (
                  <div key={i} className="bg-secondary/80 backdrop-blur rounded-lg p-3 border border-border/50 opacity-0 animate-fade-in flex items-center gap-2" style={{ animationDelay: `${(i + 4) * 100}ms` }}>
                    <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center shrink-0">
                      {i === 0 && <Target className="w-3 h-3 text-primary" />}
                      {i === 1 && <TrendingUp className="w-3 h-3 text-primary" />}
                      {i === 2 && <Zap className="w-3 h-3 text-primary" />}
                      {i === 3 && <Compass className="w-3 h-3 text-primary" />}
                    </div>
                    <span className="text-xs font-semibold text-foreground">{priority.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 4: Strategic Roadmap Timeline */}
            <div className="col-span-4 flex flex-col">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 text-center">Strategic Roadmap</div>
              
              {/* Timeline Header */}
              <div className="flex items-center justify-between px-4 mb-2">
                <span className="text-[10px] font-medium text-accent">Now</span>
                <div className="flex-1 mx-2 border-t border-dashed border-muted-foreground/30 relative">
                  <ArrowRight className="w-3 h-3 text-muted-foreground/50 absolute right-0 -top-1.5" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">Next</span>
                <div className="flex-1 mx-2 border-t border-dashed border-muted-foreground/30 relative">
                  <ArrowRight className="w-3 h-3 text-muted-foreground/50 absolute right-0 -top-1.5" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground/60">Later</span>
              </div>

              {/* Roadmap Phases */}
              <div className="flex-1 grid grid-cols-3 gap-2">
                {phases.map((phase, i) => (
                  <div 
                    key={i} 
                    className={`glass-card p-3 opacity-0 animate-fade-in ${i === 0 ? 'border-accent/50 bg-accent/5' : ''}`}
                    style={{ animationDelay: `${(i + 8) * 100}ms` }}
                  >
                    <div className={`text-sm font-bold mb-1 ${i === 0 ? 'text-accent' : 'text-primary'}`}>{phase.quarter}</div>
                    <div className="text-xs font-semibold text-foreground mb-2">{phase.title}</div>
                    <ul className="space-y-1">
                      {(phase.activities || []).slice(0, 3).map((item, j) => (
                        <li key={j} className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
                          <ArrowRight className="w-2.5 h-2.5 text-accent mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 5: Target Outcomes */}
            <div className="col-span-2 flex flex-col">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 text-center">Target Outcomes</div>
              <div className="flex-1 space-y-2">
                {(successMetrics.length > 0 ? successMetrics : [
                  { metric: "TBD", label: "Customer Satisfaction" },
                  { metric: "TBD", label: "Cost Reduction" },
                  { metric: "TBD", label: "Revenue Growth" },
                  { metric: "TBD", label: "Time to Value" }
                ]).map((outcome, i) => (
                  <div key={i} className="relative opacity-0 animate-fade-in" style={{ animationDelay: `${(i + 11) * 100}ms` }}>
                    <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg p-3 border border-accent/30">
                      <div className="text-lg font-bold text-accent">{outcome.metric}</div>
                      <div className="text-[10px] text-muted-foreground">{outcome.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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

      <style>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
        }
      `}</style>
    </div>
  );
};
