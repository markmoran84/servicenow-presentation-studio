import { Scale, AlertTriangle, TrendingUp, Shield } from "lucide-react";

export const StrategicTensionSlide = () => {
  const tensions = [
    {
      left: {
        label: "Cost Discipline",
        description: "Every investment scrutinised for ROI. $2B buyback signals capital efficiency focus.",
        icon: Shield,
      },
      right: {
        label: "Experience Excellence",
        description: "Customer expectations rising. Digital-native competitors raising the bar.",
        icon: TrendingUp,
      },
      dilemma: "How do you transform customer experience while maintaining rigorous cost control?",
    },
    {
      left: {
        label: "AI Ambition",
        description: "Board-level mandate for AI-first operations. Foundational to competitive position.",
        icon: TrendingUp,
      },
      right: {
        label: "Governance Maturity",
        description: "AI experiments scattered. No enterprise orchestration. Production readiness gaps.",
        icon: Shield,
      },
      dilemma: "How do you scale AI from experiments to production without an operationalisation layer?",
    },
  ];

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32 flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 rounded-2xl bg-warning/20 flex items-center justify-center">
            <Scale className="w-7 h-7 text-warning" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Strategic Tension</h1>
            <p className="text-muted-foreground text-lg">Point of View — Step 3: The Executive Dilemma</p>
          </div>
          <div className="ml-auto pill-badge">
            PoV Framework
          </div>
        </div>

        {/* Tensions */}
        <div className="space-y-8">
          {tensions.map((tension, index) => (
            <div 
              key={index}
              className="glass-card p-8 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="grid grid-cols-5 gap-6 items-center">
                {/* Left Force */}
                <div className="col-span-2 p-6 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <tension.left.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-primary">{tension.left.label}</h3>
                  </div>
                  <p className="text-sm text-foreground/80">{tension.left.description}</p>
                </div>

                {/* Tension Indicator */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-warning/20 border-2 border-warning flex items-center justify-center mb-2">
                    <AlertTriangle className="w-7 h-7 text-warning" />
                  </div>
                  <span className="text-xs text-warning font-semibold uppercase tracking-wider">TENSION</span>
                </div>

                {/* Right Force */}
                <div className="col-span-2 p-6 rounded-xl bg-accent/5 border border-accent/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <tension.right.icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-accent">{tension.right.label}</h3>
                  </div>
                  <p className="text-sm text-foreground/80">{tension.right.description}</p>
                </div>
              </div>

              {/* Dilemma */}
              <div className="mt-6 p-4 rounded-xl bg-warning/5 border border-warning/20 text-center">
                <p className="text-lg font-medium text-foreground italic">"{tension.dilemma}"</p>
              </div>
            </div>
          ))}
        </div>

        {/* Synthesis */}
        <div className="mt-8 glass-card p-6 border-l-4 border-l-warning opacity-0 animate-fade-in animation-delay-500">
          <p className="text-foreground/90">
            <span className="font-semibold text-warning">The Strategic Tension:</span> Maersk's leadership faces a fundamental 
            challenge — pursuing aggressive AI and customer experience transformation while maintaining the cost discipline 
            that shareholders expect. This tension cannot be resolved by traditional approaches.
          </p>
        </div>
      </div>
    </div>
  );
};
