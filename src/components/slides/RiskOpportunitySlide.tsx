import { SectionHeader } from "@/components/SectionHeader";
import { AlertTriangle, TrendingUp, Shield, ArrowRight, Target } from "lucide-react";

const risks = [
  {
    title: "Salesforce Entrenchment",
    severity: "High",
    description: "Service Cloud deeply embedded. Switching costs perceived as high. Internal champions exist.",
    mitigation: "Focus on integration value, not replacement. Position as enhancement layer initially.",
  },
  {
    title: "Budget Scrutiny",
    severity: "High",
    description: "Cost discipline is non-negotiable. Every investment requires clear, measurable ROI.",
    mitigation: "Value Advisory engagement. Business case with quantified outcomes. Phased implementation.",
  },
  {
    title: "Decision Velocity",
    severity: "Medium",
    description: "Global organisation. Multi-stakeholder approval. Extended procurement cycles.",
    mitigation: "Early stakeholder mapping. Executive sponsorship. Governance alignment.",
  },
  {
    title: "Platform Perception",
    severity: "Medium",
    description: "ServiceNow seen as 'IT tool' not enterprise platform. Customer-facing credibility gap.",
    mitigation: "CRM win changes narrative. Customer reference stories. Executive positioning.",
  },
];

const opportunities = [
  {
    title: "CRM Consolidation",
    potential: "$2-3M",
    timeline: "Q1 FY26",
    description: "Service Cloud replacement opportunity. Active pursuit with stakeholder engagement.",
    probability: 75,
  },
  {
    title: "AI Workflow Automation",
    potential: "$1-2M",
    timeline: "H1 FY26",
    description: "AI-first strategy creates demand for operationalisation layer. Multiple use case candidates.",
    probability: 60,
  },
  {
    title: "SecOps Expansion",
    potential: "$500K-1M",
    timeline: "H2 FY26",
    description: "Security orchestration adjacency to ITSM. Global operations visibility requirement.",
    probability: 50,
  },
  {
    title: "HR Service Delivery",
    potential: "$1-1.5M",
    timeline: "FY27",
    description: "Employee experience modernisation. Natural workflow expansion from IT to HR.",
    probability: 35,
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "High": return "bg-destructive/20 text-destructive border-destructive/30";
    case "Medium": return "bg-warning/20 text-warning border-warning/30";
    default: return "bg-muted text-muted-foreground";
  }
};

export const RiskOpportunitySlide = () => {
  return (
    <div className="px-8 pt-6 pb-32">
      <div className="flex items-center gap-3 mb-6 opacity-0 animate-fade-in">
        <Target className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-bold text-foreground">Risk & Opportunity Matrix</h1>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Risks */}
        <div className="glass-card p-6">
          <SectionHeader
            title="Key Risks"
            description="Barriers to navigate for strategic success"
            delay={100}
          />

          <div className="mt-5 space-y-3">
            {risks.map((risk, index) => (
              <div
                key={risk.title}
                className="p-4 rounded-xl bg-secondary/30 border border-border/30 opacity-0 animate-fade-in"
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <h4 className="font-semibold text-foreground">{risk.title}</h4>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${getSeverityColor(risk.severity)}`}>
                    {risk.severity}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{risk.description}</p>
                <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/5">
                  <Shield className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">{risk.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div className="glass-card p-6">
          <SectionHeader
            title="Pipeline Opportunities"
            description="Value creation potential aligned to Maersk priorities"
            delay={150}
          />

          <div className="mt-5 space-y-3">
            {opportunities.map((opp, index) => (
              <div
                key={opp.title}
                className="p-4 rounded-xl bg-secondary/30 border border-border/30 opacity-0 animate-fade-in group hover:border-accent/30 transition-all"
                style={{ animationDelay: `${250 + index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <h4 className="font-semibold text-foreground">{opp.title}</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gradient-accent">{opp.potential}</div>
                    <div className="text-[10px] text-muted-foreground">{opp.timeline}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{opp.description}</p>
                
                {/* Probability Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${opp.probability}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-accent">{opp.probability}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Total Opportunity */}
          <div className="mt-4 p-4 rounded-xl bg-accent/5 border border-accent/20 opacity-0 animate-fade-in animation-delay-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-accent" />
                <span className="font-semibold text-foreground">Total Pipeline Potential</span>
              </div>
              <div className="text-2xl font-bold text-gradient-accent">$4.5-7.5M</div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Weighted opportunity value over FY26-FY27 horizon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
