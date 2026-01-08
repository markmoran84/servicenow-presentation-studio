import { ArrowRight, Cog, Users, Zap, Target } from "lucide-react";

export const StrategicImplicationSlide = () => {
  const implications = [
    {
      capability: "Workflow Automation",
      pressure: "Manual processes cannot scale with AI ambition",
      mustChange: "Every workflow must be automatable and AI-ready by design",
      icon: Cog,
    },
    {
      capability: "Customer Experience",
      pressure: "Digital-native competitors raising customer expectations",
      mustChange: "AI-augmented service delivery with predictive capabilities",
      icon: Users,
    },
    {
      capability: "Operational Efficiency",
      pressure: "Cost discipline requires demonstrable productivity gains",
      mustChange: "Platform consolidation with measurable ROI per initiative",
      icon: Zap,
    },
    {
      capability: "Governance & Control",
      pressure: "AI experiments scattered without enterprise orchestration",
      mustChange: "Unified platform for AI operationalisation at scale",
      icon: Target,
    },
  ];

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32 flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
            <ArrowRight className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Strategic Implication</h1>
            <p className="text-muted-foreground text-lg">Point of View — Step 2: What Must Change</p>
          </div>
          <div className="ml-auto pill-badge-accent">
            PoV Framework
          </div>
        </div>

        {/* Implications Grid */}
        <div className="grid grid-cols-2 gap-6">
          {implications.map((item, index) => (
            <div 
              key={item.capability}
              className="glass-card p-6 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{item.capability}</h3>
              </div>

              <div className="space-y-4">
                {/* Pressure */}
                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-destructive" />
                    <span className="text-xs font-semibold text-destructive uppercase tracking-wider">Under Pressure</span>
                  </div>
                  <p className="text-sm text-foreground/90">{item.pressure}</p>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>

                {/* Must Change */}
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">Must Change</span>
                  </div>
                  <p className="text-sm text-foreground/90">{item.mustChange}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 glass-card p-6 border-t-4 border-t-accent opacity-0 animate-fade-in animation-delay-500">
          <p className="text-lg text-foreground/90 text-center">
            <span className="font-semibold text-accent">The implication is clear:</span> Maersk cannot achieve its AI-first ambition 
            with fragmented tools and manual processes. A unified platform for workflow automation and AI operationalisation is 
            no longer optional — it's a strategic imperative.
          </p>
        </div>
      </div>
    </div>
  );
};
