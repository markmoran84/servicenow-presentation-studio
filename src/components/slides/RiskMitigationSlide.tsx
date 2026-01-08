import { useAccountData } from "@/context/AccountDataContext";
import { ShieldAlert, AlertTriangle, CheckCircle, ArrowRight, TrendingDown, ShieldCheck } from "lucide-react";

interface Risk {
  title: string;
  description: string;
  likelihood: "High" | "Medium" | "Low";
  impact: "High" | "Medium" | "Low";
  mitigation: string;
  owner: string;
}

export const RiskMitigationSlide = () => {
  const { data } = useAccountData();
  const { swot, basics } = data;

  // Derive risks from SWOT threats and add mitigation strategies
  const risks: Risk[] = [
    {
      title: "Incumbent Vendor Lock-in",
      description: "High incumbent vendor risk with Salesforce, SAP, and Microsoft deeply embedded in customer operations",
      likelihood: "High",
      impact: "High",
      mitigation: "Lead with differentiated AI operationalisation narrative; demonstrate clear TCO advantage; executive sponsorship engagement",
      owner: "Client Director",
    },
    {
      title: "Decision Delay",
      description: "Complex procurement processes and multiple stakeholder alignment may delay key decisions beyond target dates",
      likelihood: "Medium",
      impact: "High",
      mitigation: "Early stakeholder mapping; proactive governance cadence; executive alignment on decision timeline",
      owner: "Account Team",
    },
    {
      title: "Budget Constraints",
      description: "Economic uncertainty and cost discipline may limit available investment budget for transformation",
      likelihood: "Medium",
      impact: "Medium",
      mitigation: "Strong business case with clear ROI; phased approach with quick wins; align to existing budget cycles",
      owner: "Value Advisory",
    },
    {
      title: "Competitive Displacement",
      description: "Alternative platforms may position aggressively with pricing or feature advantages",
      likelihood: "Medium",
      impact: "High",
      mitigation: "Highlight platform breadth; customer success stories; technical differentiation on workflow orchestration",
      owner: "Solution Consultant",
    },
  ];

  const getLikelihoodColor = (level: string) => {
    switch (level) {
      case "High": return "bg-destructive/20 text-destructive border-destructive/30";
      case "Medium": return "bg-amber-500/20 text-amber-500 border-amber-500/30";
      case "Low": return "bg-primary/20 text-primary border-primary/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case "High": return "text-destructive";
      case "Medium": return "text-amber-500";
      case "Low": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-destructive/20 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7 text-destructive" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Risk & Mitigation</h1>
            <p className="text-muted-foreground text-lg">Navigating challenges to achieve {basics.accountName} objectives</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-muted-foreground">High</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Low</span>
            </div>
          </div>
        </div>

        {/* Risk Cards Grid */}
        <div className="grid grid-cols-2 gap-5">
          {risks.map((risk, index) => (
            <div
              key={risk.title}
              className="glass-card overflow-hidden opacity-0 animate-fade-in"
              style={{ animationDelay: `${100 + index * 100}ms` }}
            >
              {/* Risk Header */}
              <div className="p-5 border-b border-border/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <h3 className="font-bold text-foreground">{risk.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getLikelihoodColor(risk.likelihood)}`}>
                      {risk.likelihood}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{risk.description}</p>
                
                {/* Likelihood/Impact Indicators */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Likelihood:</span>
                    <span className={`text-xs font-semibold ${getImpactColor(risk.likelihood)}`}>{risk.likelihood}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Impact:</span>
                    <span className={`text-xs font-semibold ${getImpactColor(risk.impact)}`}>{risk.impact}</span>
                  </div>
                </div>
              </div>

              {/* Mitigation */}
              <div className="p-5 bg-primary/5">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">Mitigation Strategy</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed mb-3">{risk.mitigation}</p>
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Owner: <span className="font-medium text-foreground">{risk.owner}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Risk Summary Footer */}
        <div className="mt-6 glass-card p-5 flex items-center gap-6 opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 animate-pulse-glow">
            <CheckCircle className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">Risk Management Approach</h3>
            <p className="text-sm text-muted-foreground">
              Proactive risk identification with clear ownership. Regular review in governance cadence. 
              Escalation path to executive sponsors when blockers emerge.
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">4</p>
            <p className="text-xs text-muted-foreground">Active Risks</p>
          </div>
        </div>
      </div>
    </div>
  );
};
