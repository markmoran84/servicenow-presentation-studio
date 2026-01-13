import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { ShieldAlert, AlertTriangle, CheckCircle, ShieldCheck, Sparkles, AlertCircle, Target, Cog, Scale, TrendingUp } from "lucide-react";

// Category configuration matching Risk Radar
const categoryConfig = {
  strategic: {
    label: "Strategic",
    description: "Risks that could limit our ability to position ServiceNow as a strategic platform partner",
    icon: Target,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/40",
    iconBg: "bg-blue-500/20",
  },
  operational: {
    label: "Operational",
    description: "Risks that impact execution velocity, adoption, and realised value",
    icon: Cog,
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
    borderColor: "border-amber-500/40",
    iconBg: "bg-amber-500/20",
  },
  governance: {
    label: "Governance",
    description: "Risks associated with governance, compliance, and decision-making",
    icon: Scale,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/40",
    iconBg: "bg-purple-500/20",
  },
  commercial: {
    label: "Commercial",
    description: "Risks that could affect account growth and renewal confidence",
    icon: TrendingUp,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    borderColor: "border-emerald-500/40",
    iconBg: "bg-emerald-500/20",
  },
};

type RiskCategory = keyof typeof categoryConfig;

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high": return { bg: "bg-destructive/20", text: "text-destructive", border: "border-destructive/30", dot: "bg-destructive" };
    case "medium": return { bg: "bg-amber-500/20", text: "text-amber-500", border: "border-amber-500/30", dot: "bg-amber-500" };
    case "low": return { bg: "bg-primary/20", text: "text-primary", border: "border-primary/30", dot: "bg-primary" };
    default: return { bg: "bg-muted", text: "text-muted-foreground", border: "border-border", dot: "bg-muted-foreground" };
  }
};

export const RiskMitigationSlide = () => {
  const { data } = useAccountData();
  const { basics, generatedPlan } = data;

  // Use Risk Radar data (new format) or fall back to legacy risksMitigations
  const riskRadar = generatedPlan?.riskRadar;
  const legacyRisks = generatedPlan?.risksMitigations;
  
  const isAIGenerated = !!riskRadar?.risks?.length || !!legacyRisks?.length;
  const risks = riskRadar?.risks || [];

  // Group risks by category
  const risksByCategory: Record<RiskCategory, typeof risks> = {
    strategic: risks.filter(r => r.category === "strategic"),
    operational: risks.filter(r => r.category === "operational"),
    governance: risks.filter(r => r.category === "governance"),
    commercial: risks.filter(r => r.category === "commercial"),
  };

  // If using legacy format, convert to new structure
  const useLegacyFormat = !riskRadar?.risks?.length && legacyRisks?.length;

  const hasData = risks.length > 0 || (legacyRisks?.length || 0) > 0;

  // Count risks by severity
  const highRisks = risks.filter(r => r.severity === "high").length;
  const mediumRisks = risks.filter(r => r.severity === "medium").length;
  const lowRisks = risks.filter(r => r.severity === "low").length;

  return (
    <div className="h-full overflow-auto p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-destructive/20 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7 text-destructive" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Risk & Mitigation</h1>
            <p className="text-muted-foreground text-lg">
              {basics.accountName ? `Mitigation strategies for ${basics.accountName} key risks` : "Mitigation strategies for key risks"}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <RegenerateSectionButton section="riskRadar" label="Regenerate" />
            {isAIGenerated && (
              <span className="pill-badge bg-accent/20 text-accent border-accent/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
            {hasData && (
              <>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">High ({highRisks})</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground">Medium ({mediumRisks})</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Low ({lowRisks})</span>
                </div>
              </>
            )}
          </div>
        </div>

        {!hasData ? (
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in">
            <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Risks Identified</h3>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
              Generate risks from the Risk Radar slide to populate mitigation strategies.
            </p>
          </div>
        ) : useLegacyFormat ? (
          // Legacy format display
          <div className="grid grid-cols-2 gap-5">
            {legacyRisks?.slice(0, 4).map((riskItem, index) => {
              const colors = getSeverityColor(riskItem.level.toLowerCase());
              return (
                <div
                  key={index}
                  className="glass-card overflow-hidden opacity-0 animate-fade-in"
                  style={{ animationDelay: `${100 + index * 100}ms` }}
                >
                  <div className="p-5 border-b border-border/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                        </div>
                        <h3 className="font-bold text-foreground">{riskItem.risk}</h3>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}>
                        {riskItem.level}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 bg-primary/5">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">Mitigation Strategy</span>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed">{riskItem.mitigation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // New categorized format
          <div className="grid grid-cols-2 gap-5">
            {(Object.keys(categoryConfig) as RiskCategory[]).map((category, catIdx) => {
              const config = categoryConfig[category];
              const categoryRisks = risksByCategory[category];
              const IconComponent = config.icon;
              
              if (categoryRisks.length === 0) return null;
              
              return (
                <div 
                  key={category}
                  className={`glass-card overflow-hidden opacity-0 animate-fade-in border ${config.borderColor}`}
                  style={{ animationDelay: `${100 + catIdx * 100}ms` }}
                >
                  {/* Category Header */}
                  <div className={`p-4 ${config.bgColor} border-b ${config.borderColor}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center`}>
                        <IconComponent className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div>
                        <h3 className={`font-bold ${config.color}`}>{config.label}</h3>
                        <p className="text-xs text-muted-foreground">{config.description}</p>
                      </div>
                      <span className={`ml-auto px-2 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.color}`}>
                        {categoryRisks.length} {categoryRisks.length === 1 ? 'risk' : 'risks'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Risks List */}
                  <div className="divide-y divide-border/30">
                    {categoryRisks.slice(0, 3).map((risk, riskIdx) => {
                      const severityColors = getSeverityColor(risk.severity);
                      return (
                        <div key={risk.id} className="p-4">
                          <div className="flex items-start gap-3 mb-2">
                            <span className={`w-6 h-6 rounded-full ${config.bgColor} flex items-center justify-center text-xs font-bold ${config.color} flex-shrink-0`}>
                              {risk.id}
                            </span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-foreground text-sm">{risk.title}</h4>
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase ${severityColors.bg} ${severityColors.text} ${severityColors.border} border`}>
                                  {risk.severity}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">{risk.description}</p>
                            </div>
                          </div>
                          
                          {/* Mitigation - show suggested action */}
                          <div className="ml-9 mt-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
                            <div className="flex items-center gap-1.5 mb-1">
                              <ShieldCheck className="w-3 h-3 text-primary" />
                              <span className="text-[10px] font-semibold text-primary uppercase">Mitigation</span>
                            </div>
                            <p className="text-xs text-foreground/80 leading-relaxed">
                              {risk.severity === "high" 
                                ? "Immediate executive escalation and weekly monitoring. Develop contingency plan with clear triggers."
                                : risk.severity === "medium"
                                ? "Active monitoring with bi-weekly review. Assign clear owner and track progress."
                                : "Track in risk register. Review monthly in governance cadence."}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Risk Summary Footer */}
        {hasData && (
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
            <div className="flex gap-6">
              {(Object.keys(categoryConfig) as RiskCategory[]).map((cat) => {
                const config = categoryConfig[cat];
                const count = risksByCategory[cat].length;
                if (count === 0) return null;
                return (
                  <div key={cat} className="text-center">
                    <p className={`text-2xl font-bold ${config.color}`}>{count}</p>
                    <p className="text-xs text-muted-foreground">{config.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
