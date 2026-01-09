import { useAccountData } from "@/context/AccountDataContext";
import { Eye, TrendingUp, Target, Sparkles } from "lucide-react";

export const StrategicObservationSlide = () => {
  const { data } = useAccountData();
  const plan = data.generatedPlan;

  // Use AI-generated observations or fallback to defaults
  const observations = plan?.strategicObservations || [
    { heading: "AI-First Ambition", detail: "Declared AI-first strategy with execution infrastructure lagging behind ambition." },
    { heading: "Platform Opportunity", detail: "Fragmented applications create friction. Unified platform reduces complexity." },
    { heading: "Cost Discipline", detail: "Every initiative must demonstrate clear ROI through productivity gains." },
    { heading: "Customer Experience Gap", detail: "Inconsistent service levels impact satisfaction and retention." },
  ];

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Eye className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Strategic Observation</h1>
            <p className="text-muted-foreground text-lg">Point of View — Step 1: Verifiable Facts</p>
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

        {/* Observations Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {observations.slice(0, 4).map((obs, i) => (
            <div 
              key={i} 
              className="glass-card p-6 opacity-0 animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-2">{obs.heading}</h3>
                  <p className="text-muted-foreground">{obs.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Supporting Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-gradient">{data.financial.customerRevenue?.split(' ')[0] || "—"}</p>
            <p className="text-sm text-muted-foreground">Revenue</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-gradient-accent">{data.financial.growthRate || "—"}</p>
            <p className="text-sm text-muted-foreground">Growth</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-primary">{data.financial.marginEBIT || "—"}</p>
            <p className="text-sm text-muted-foreground">EBIT</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-accent">{data.basics.currentContractValue || "—"}</p>
            <p className="text-sm text-muted-foreground">Current ACV</p>
          </div>
        </div>

        {/* Summary Insight */}
        <div className="glass-card p-6 border-l-4 border-l-primary">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Strategic Summary</h3>
          </div>
          <p className="text-foreground">
            {plan?.executiveSummaryNarrative || 
             `ServiceNow uniquely bridges the gap between ${data.basics.accountName}'s strategic ambition and operational execution.`}
          </p>
        </div>
      </div>
    </div>
  );
};
