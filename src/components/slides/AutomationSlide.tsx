import { Cog, ArrowRight, CheckCircle } from "lucide-react";

export const AutomationSlide = () => {
  const processes = [
    { name: "Case Auto-Classification", current: "Manual triage", target: "AI-powered routing", impact: "70% reduction in triage time" },
    { name: "Quote Generation", current: "Excel-based", target: "Automated workflow", impact: "50% faster quotes" },
    { name: "Customer Notifications", current: "Reactive", target: "Proactive alerts", impact: "30% fewer inbound calls" },
    { name: "Incident Resolution", current: "Tiered support", target: "Self-healing automation", impact: "40% auto-resolution" },
  ];

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Cog className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Automation & Process Transformation</h1>
            <p className="text-muted-foreground text-lg">Target processes for standardisation and scale</p>
          </div>
        </div>

        <div className="space-y-4">
          {processes.map((p, i) => (
            <div key={p.name} className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="grid grid-cols-4 gap-6 items-center">
                <div>
                  <h3 className="font-bold text-foreground">{p.name}</h3>
                </div>
                <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                  <span className="text-xs text-destructive">Current</span>
                  <p className="text-sm text-foreground">{p.current}</p>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
                <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                  <span className="text-xs text-accent">Target</span>
                  <p className="text-sm text-foreground">{p.target}</p>
                  <p className="text-xs text-accent mt-1">{p.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
