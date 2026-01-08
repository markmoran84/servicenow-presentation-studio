import { Trophy, CheckCircle, TrendingUp, Target } from "lucide-react";

export const SuccessSlide = () => {
  const outcomes = [
    { metric: "$15-20M", label: "Annual cost savings", description: "Through platform consolidation and automation" },
    { metric: "+15pts", label: "CSAT improvement", description: "AI-augmented customer experience" },
    { metric: "5x", label: "Faster AI deployment", description: "Unified operationalisation layer" },
    { metric: "50%", label: "Reduced resolution time", description: "Intelligent automation and routing" },
  ];

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32 flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center animate-pulse-glow">
            <Trophy className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">What Success Looks Like</h1>
            <p className="text-muted-foreground text-lg">Measurable outcomes and strategic positioning</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {outcomes.map((outcome, i) => (
            <div key={outcome.label} className="glass-card p-6 text-center opacity-0 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <p className="text-4xl font-bold text-gradient mb-2">{outcome.metric}</p>
              <p className="font-semibold text-foreground mb-1">{outcome.label}</p>
              <p className="text-sm text-muted-foreground">{outcome.description}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-8 text-center border-t-4 border-t-accent">
          <h3 className="text-2xl font-bold text-foreground mb-4">Strategic Vision</h3>
          <p className="text-lg text-muted-foreground">
            ServiceNow becomes Maersk's enterprise workflow backbone — enabling AI operationalisation, 
            customer experience excellence, and cost efficiency at global scale.
          </p>
        </div>
      </div>
    </div>
  );
};
