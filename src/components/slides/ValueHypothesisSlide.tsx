import { useAccountData } from "@/context/AccountDataContext";
import { Rocket, DollarSign, Clock, TrendingUp, Target, Sparkles } from "lucide-react";

export const ValueHypothesisSlide = () => {
  const { data } = useAccountData();
  const plan = data.generatedPlan;

  // Use AI-generated value hypotheses or fallback to defaults
  const hypotheses = plan?.valueHypotheses?.slice(0, 4).map((h, i) => ({
    ...h,
    icon: [DollarSign, Rocket, TrendingUp, Clock][i % 4],
    color: i % 2 === 0 ? "primary" : "accent",
  })) || [
    { outcome: "Reduce cost-to-serve by 30%", mechanism: "Platform consolidation eliminates duplicate systems and automates handling", timeframe: "12-18 months", impact: "$15-20M annual savings", icon: DollarSign, color: "primary" },
    { outcome: "Accelerate AI operationalisation 5x", mechanism: "Unified workflow platform provides production-ready AI orchestration layer", timeframe: "6-12 months", impact: "Avoided cost of failed initiatives", icon: Rocket, color: "accent" },
    { outcome: "Improve CSAT by 15 points", mechanism: "Predictive case routing and AI-augmented service delivery", timeframe: "9-12 months", impact: "Customer retention value", icon: TrendingUp, color: "primary" },
    { outcome: "Reduce time-to-resolution by 50%", mechanism: "Intelligent automation and proactive notifications", timeframe: "6-9 months", impact: "Operational efficiency", icon: Clock, color: "accent" },
  ];

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Target className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Value Hypothesis</h1>
            <p className="text-muted-foreground text-lg">Point of View — Step 5: Testable Business Outcomes</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {plan && (
              <span className="pill-badge bg-accent/20 text-accent border-accent/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
            <span className="pill-badge">PoV Framework</span>
          </div>
        </div>

        {/* Hypotheses Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {hypotheses.map((hypothesis, index) => (
            <div 
              key={index}
              className="glass-card p-6 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  hypothesis.color === 'accent' ? 'bg-accent/20' : 'bg-primary/20'
                }`}>
                  <hypothesis.icon className={`w-6 h-6 ${
                    hypothesis.color === 'accent' ? 'text-accent' : 'text-primary'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold mb-2 ${
                    hypothesis.color === 'accent' ? 'text-accent' : 'text-primary'
                  }`}>
                    {hypothesis.outcome}
                  </h3>
                  <p className="text-sm text-foreground/80 mb-4">{hypothesis.mechanism}</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <span className="text-xs text-muted-foreground block mb-1">Timeframe</span>
                      <span className="font-semibold text-foreground">{hypothesis.timeframe}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <span className="text-xs text-muted-foreground block mb-1">Economic Impact</span>
                      <span className="font-semibold text-foreground">{hypothesis.impact}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Validation Approach */}
        <div className="glass-card p-6 border-t-4 border-t-primary">
          <h3 className="font-bold text-foreground mb-4">Hypothesis Validation Approach</h3>
          <div className="grid grid-cols-4 gap-4">
            {["Define baseline metrics", "Execute pilot scope", "Measure outcomes", "Scale or pivot"].map((step, i) => (
              <div key={i} className="p-4 rounded-xl bg-primary/5 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{i + 1}</div>
                <p className="text-sm text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
