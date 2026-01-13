import { useAccountData } from "@/context/AccountDataContext";
import { Cog, ArrowRight, AlertCircle, Sparkles } from "lucide-react";

export const AutomationSlide = () => {
  const { data } = useAccountData();
  const { basics, generatedPlan, painPoints, opportunities } = data;

  // Build automation opportunities from pain points and opportunities
  const automationProcesses = [];

  // Transform pain points into automation opportunities
  if (painPoints.painPoints.length > 0) {
    painPoints.painPoints.slice(0, 2).forEach(pp => {
      automationProcesses.push({
        name: pp.title,
        current: "Manual / fragmented process",
        target: "Automated workflow with ServiceNow",
        impact: "Significant efficiency gains expected"
      });
    });
  }

  // Transform opportunities into automation targets
  if (opportunities.opportunities.length > 0) {
    opportunities.opportunities.slice(0, 2).forEach(opp => {
      automationProcesses.push({
        name: opp.title,
        current: "Legacy approach",
        target: "AI-powered automation",
        impact: "Strategic value realisation"
      });
    });
  }

  const hasData = automationProcesses.length > 0;

  return (
    <div className="h-full overflow-auto p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Cog className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Automation & Process Transformation</h1>
            <p className="text-muted-foreground text-lg">
              {basics.accountName ? `Target processes for standardisation and scale at ${basics.accountName}` : "Target processes for standardisation and scale"}
            </p>
          </div>
        </div>

        {!hasData ? (
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in">
            <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Automation Targets Defined</h3>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
              Add pain points and opportunities in the Input Form to identify automation and transformation targets.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {automationProcesses.map((p, i) => (
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
        )}
      </div>
    </div>
  );
};
