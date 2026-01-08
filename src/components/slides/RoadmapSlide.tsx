import { Calendar, ArrowRight } from "lucide-react";

export const RoadmapSlide = () => {
  const phases = [
    { quarter: "Q1 FY26", title: "Foundation", items: ["CRM decision forum", "EBC execution", "Pilot scoping"] },
    { quarter: "Q2 FY26", title: "Commercialisation", items: ["Contract finalisation", "SOW development", "Kick-off planning"] },
    { quarter: "Q3-Q4", title: "Expansion", items: ["AI use case deployment", "SecOps integration", "Platform scaling"] },
  ];

  return (
    <div className="min-h-screen p-8 md:p-12 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header - Two-tone style */}
        <div className="slide-header flex items-center gap-4">
          <div className="sn-icon-box-accent">
            <Calendar className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="slide-header-title">
              <span className="text-primary">Transformation</span>{" "}
              <span className="text-foreground">Roadmap</span>
            </h1>
            <p className="slide-header-subtitle">FY26 phased execution plan</p>
          </div>
        </div>

        {/* Timeline phases */}
        <div className="flex items-stretch gap-6">
          {phases.map((phase, i) => (
            <div 
              key={phase.quarter} 
              className="flex-1 sn-glass-emphasis p-6 opacity-0 animate-fade-in" 
              style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'forwards' }}
            >
              <div className="sn-badge mb-4">{phase.quarter}</div>
              <div className="text-xl font-semibold text-foreground mb-4">{phase.title}</div>
              <ul className="space-y-3">
                {phase.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Timeline connector */}
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary"></div>
            <div className="w-32 h-1 bg-gradient-to-r from-primary to-primary/50"></div>
            <div className="w-3 h-3 rounded-full bg-primary/60"></div>
            <div className="w-32 h-1 bg-gradient-to-r from-primary/50 to-accent/50"></div>
            <div className="w-3 h-3 rounded-full bg-accent/60"></div>
            <div className="w-32 h-1 bg-gradient-to-r from-accent/50 to-accent"></div>
            <div className="w-4 h-4 rounded-full bg-accent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
