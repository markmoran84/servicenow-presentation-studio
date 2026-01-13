import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { ArrowRight, Cog, Users, Zap, Target, Sparkles } from "lucide-react";

export const StrategicImplicationSlide = () => {
  const { data } = useAccountData();
  const plan = data.generatedPlan;

  // Use AI-generated implications or fallback to defaults
  const implications = plan?.strategicImplications?.slice(0, 4).map((impl, i) => ({
    heading: impl.heading,
    detail: impl.detail,
    icon: [Cog, Users, Zap, Target][i % 4],
  })) || [
    { heading: "Workflow Automation", detail: "Manual processes cannot scale with AI ambition. Every workflow must be automatable.", icon: Cog },
    { heading: "Customer Experience", detail: "Digital-native competitors raising customer expectations. AI-augmented service delivery needed.", icon: Users },
    { heading: "Operational Efficiency", detail: "Cost discipline requires demonstrable productivity gains. Platform consolidation with measurable ROI.", icon: Zap },
    { heading: "Governance & Control", detail: "AI experiments scattered without enterprise orchestration. Unified platform for AI at scale.", icon: Target },
  ];

  return (
    <div className="h-full overflow-auto p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
            <ArrowRight className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Strategic Implication</h1>
            <p className="text-muted-foreground text-lg">Point of View — Step 2: What Must Change</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <RegenerateSectionButton section="strategicImplications" />
            {plan && (
              <span className="pill-badge bg-accent/20 text-accent border-accent/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
            <span className="pill-badge-accent">PoV Framework</span>
          </div>
        </div>

        {/* Implications Grid */}
        <div className="grid grid-cols-2 gap-6">
          {implications.map((item, index) => (
            <div 
              key={index}
              className="glass-card p-6 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{item.heading}</h3>
              </div>

              <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider">Implication</span>
                </div>
                <p className="text-sm text-foreground/90">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 glass-card p-6 border-t-4 border-t-accent opacity-0 animate-fade-in animation-delay-500">
          <p className="text-lg text-foreground/90 text-center">
            <span className="font-semibold text-accent">The implication is clear:</span> {data.basics.accountName} cannot achieve its 
            strategic ambitions with fragmented tools and manual processes. A unified platform for workflow automation and 
            AI operationalisation is a strategic imperative.
          </p>
        </div>
      </div>
    </div>
  );
};
