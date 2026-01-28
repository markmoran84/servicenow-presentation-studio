import { useAccountData } from "@/context/AccountDataContext";
import { CheckCircle2 } from "lucide-react";

export const PursuitPlanSlide = () => {
  const { data } = useAccountData();

  const pursuitQuadrants = [
    {
      title: "Executive & Stakeholder Engagement",
      subtitle: "Building executive alignment and sponsorship",
      items: [
        "Executive connects (top-to-top alignment)",
        "EBC session (strategic briefings)",
        "Stakeholder mapping & influence plans"
      ],
      outcome: "Executive Confidence Increases"
    },
    {
      title: "Discovery & Validation",
      subtitle: "Understanding needs and validating hypotheses",
      items: [
        "Business discovery sessions",
        "Value hypothesis validation",
        "Architecture assessments"
      ],
      outcome: "Value Clarity Emerges"
    },
    {
      title: "Proof & Confidence Building",
      subtitle: "Demonstrating capability and reducing risk",
      items: [
        { text: "Proof of Value Pilots", col: 1 },
        { text: "Reference customer sessions", col: 2 },
        { text: "Targeted demos aligned to use cases", col: 1 },
        { text: "AI & CX workshops", col: 1 }
      ],
      outcome: "Risk Perception Decreases"
    },
    {
      title: "Narrative Positioning",
      subtitle: "Shaping the strategic story and vision",
      items: [
        { text: "Strategic POV development", col: 1 },
        { text: "Vision & Roadmap Co-Creation", col: 2 },
        { text: "Business Case Shaping", col: 1 },
        { text: "Strategic Alignment", col: 1 }
      ],
      outcome: "Scope and Ambition Converge"
    }
  ];

  return (
    <div className="min-h-screen p-8 pb-32 relative">
      {/* Draft Badge */}
      <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
        <div className="absolute top-6 -right-8 w-40 bg-primary text-background text-sm font-bold py-1.5 text-center rotate-45 shadow-lg">
          Draft
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 opacity-0 animate-fade-in">
        <h1 className="text-5xl font-bold text-primary mb-2">Pursuit Plan</h1>
        <p className="text-xl text-muted-foreground">Key milestones and decision points</p>
      </div>

      {/* Main Card */}
      <div className="glass-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
        {/* Card Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-primary mb-2">Create Momentum, Alignment & Confidence</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            "What are we actively doing to earn the right to close?" The pursuit plan defines the tangible actions we deliberately drive to build executive alignment, reduce perceived risk, and advance decision readiness.
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-2 gap-6">
          {pursuitQuadrants.map((quadrant, index) => (
            <div 
              key={quadrant.title}
              className="bg-slate-800/30 rounded-xl p-5 border border-white/5 opacity-0 animate-fade-in"
              style={{ animationDelay: `${200 + index * 100}ms` }}
            >
              {/* Quadrant Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-5 h-5 rounded bg-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{quadrant.title}</h3>
                  <p className="text-xs text-muted-foreground">{quadrant.subtitle}</p>
                </div>
              </div>

              {/* Items */}
              <div className={`space-y-2 mb-4 ${index >= 2 ? 'grid grid-cols-2 gap-2 space-y-0' : ''}`}>
                {quadrant.items.map((item, i) => {
                  const text = typeof item === 'string' ? item : item.text;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground/80">{text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Outcome */}
              <div className="pt-3 border-t border-white/10">
                <div className="bg-slate-900/50 rounded-lg py-2 px-4 text-center">
                  <span className="text-sm text-primary">✓ {quadrant.outcome}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 text-center opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
        <p className="text-sm text-muted-foreground">
          The pursuit plan creates belief, but it does not yet secure commitment. 
          <span className="text-accent ml-1">See Close Plan for commercial execution.</span>
        </p>
      </div>
    </div>
  );
};
