import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Sparkles, AlertCircle, Radar } from "lucide-react";

// Risk categories with colors
const categoryConfig = {
  strategic: {
    label: "Strategic",
    description: "Risks that could limit our ability to position ServiceNow as a strategic platform partner and scale the account",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    borderColor: "border-emerald-500/40",
  },
  operational: {
    label: "Operational",
    description: "Risks that impact execution velocity, adoption, and realised value from ServiceNow deployments",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    borderColor: "border-emerald-500/40",
  },
  governance: {
    label: "Governance",
    description: "Risks associated with governance, compliance, and decision-making processes",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    borderColor: "border-emerald-500/40",
  },
  commercial: {
    label: "Commercial",
    description: "Risks that could affect account growth, renewal confidence, and long-term commercial expansion",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    borderColor: "border-emerald-500/40",
  },
};

type RiskCategory = keyof typeof categoryConfig;

interface CategorizedRisk {
  id: number;
  title: string;
  description: string;
  category: RiskCategory;
  severity: "high" | "medium" | "low";
}

export const RiskRadarSlide = () => {
  const { data } = useAccountData();
  const { basics, generatedPlan } = data;

  // Get categorized risks from generated plan or create default structure
  const riskRadar = generatedPlan?.riskRadar;
  const isAIGenerated = !!riskRadar && riskRadar.risks?.length > 0;

  // Default risks for display (will be replaced by AI-generated ones)
  const defaultRisks: CategorizedRisk[] = [];
  
  const risks: CategorizedRisk[] = riskRadar?.risks || defaultRisks;

  // Group risks by category
  const risksByCategory = {
    strategic: risks.filter(r => r.category === "strategic"),
    operational: risks.filter(r => r.category === "operational"),
    governance: risks.filter(r => r.category === "governance"),
    commercial: risks.filter(r => r.category === "commercial"),
  };

  // Calculate positions for risks on the radar (simplified - positions based on severity)
  const getRadarPosition = (risk: CategorizedRisk, index: number, categoryRisks: CategorizedRisk[]) => {
    // Angle based on category (quadrant)
    const categoryAngles: Record<RiskCategory, number> = {
      strategic: -135, // top-left
      operational: -45, // top-right
      governance: 135, // bottom-left
      commercial: 45, // bottom-right
    };
    
    // Base angle for category + offset for multiple risks in same category
    const baseAngle = categoryAngles[risk.category];
    const angleSpread = 40; // degrees spread within quadrant
    const angleOffset = (index - (categoryRisks.length - 1) / 2) * (angleSpread / Math.max(categoryRisks.length - 1, 1));
    const angle = (baseAngle + angleOffset) * (Math.PI / 180);
    
    // Distance based on severity (high = closer to center)
    const severityDistance: Record<string, number> = {
      high: 30,
      medium: 50,
      low: 70,
    };
    const distance = severityDistance[risk.severity] || 50;
    
    return {
      x: 50 + distance * Math.cos(angle),
      y: 50 + distance * Math.sin(angle),
    };
  };

  const hasData = risks.length > 0;

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Key Risks to The FY26 Account Plan
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl">
              The {basics.accountName || "account"} team categorises risks into four different areas to provide 
              the appropriate level of governance and oversight to effectively manage these risks.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RegenerateSectionButton section="riskRadar" label="Generate with AI" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
          </div>
        </div>

        {!hasData ? (
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in">
            <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Risk Data</h3>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
              Click "Generate with AI" to create a comprehensive risk radar based on your account context.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_400px_1fr] gap-6">
            {/* Left Column - Strategic & Governance */}
            <div className="space-y-6">
              {/* Strategic */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <h2 className="text-xl font-bold text-emerald-400 mb-2">{categoryConfig.strategic.label}</h2>
                <p className="text-sm text-muted-foreground mb-4">{categoryConfig.strategic.description}</p>
                <div className="space-y-3">
                  {risksByCategory.strategic.map((risk) => (
                    <div key={risk.id} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {risk.id}
                      </span>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{risk.title}</p>
                        <p className="text-muted-foreground text-xs">{risk.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Governance */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
                <h2 className="text-xl font-bold text-emerald-400 mb-2">{categoryConfig.governance.label}</h2>
                <p className="text-sm text-muted-foreground mb-4">{categoryConfig.governance.description}</p>
                <div className="space-y-3">
                  {risksByCategory.governance.map((risk) => (
                    <div key={risk.id} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {risk.id}
                      </span>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{risk.title}</p>
                        <p className="text-muted-foreground text-xs">{risk.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center - Radar Visualization */}
            <div className="flex flex-col items-center justify-center opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <p className="text-sm text-muted-foreground mb-4 font-medium">Key Risks</p>
              <div className="relative w-[360px] h-[360px]">
                {/* Radar circles */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Outer gradient glow */}
                  <defs>
                    <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="50" cy="50" r="48" fill="url(#radarGlow)" />
                  
                  {/* Concentric circles */}
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgb(16, 185, 129)" strokeOpacity="0.2" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="rgb(16, 185, 129)" strokeOpacity="0.3" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="25" fill="none" stroke="rgb(16, 185, 129)" strokeOpacity="0.4" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="15" fill="none" stroke="rgb(16, 185, 129)" strokeOpacity="0.5" strokeWidth="0.5" />
                  
                  {/* Cross lines */}
                  <line x1="50" y1="5" x2="50" y2="95" stroke="rgb(16, 185, 129)" strokeOpacity="0.3" strokeWidth="0.3" />
                  <line x1="5" y1="50" x2="95" y2="50" stroke="rgb(16, 185, 129)" strokeOpacity="0.3" strokeWidth="0.3" />
                  
                  {/* Quadrant labels */}
                  <text x="25" y="20" fill="rgb(16, 185, 129)" fontSize="4" opacity="0.7" textAnchor="middle" className="font-medium">Strategic</text>
                  <text x="75" y="20" fill="rgb(16, 185, 129)" fontSize="4" opacity="0.7" textAnchor="middle" className="font-medium">Operational</text>
                  <text x="25" y="85" fill="rgb(16, 185, 129)" fontSize="4" opacity="0.7" textAnchor="middle" className="font-medium">Governance</text>
                  <text x="75" y="85" fill="rgb(16, 185, 129)" fontSize="4" opacity="0.7" textAnchor="middle" className="font-medium">Commercial</text>
                  
                  {/* Axis labels */}
                  <text x="50" y="8" fill="rgb(156, 163, 175)" fontSize="3" textAnchor="middle">Low</text>
                  <text x="50" y="95" fill="rgb(156, 163, 175)" fontSize="3" textAnchor="middle">Low</text>
                  <text x="8" y="51" fill="rgb(156, 163, 175)" fontSize="3" textAnchor="middle">Low</text>
                  <text x="92" y="51" fill="rgb(156, 163, 175)" fontSize="3" textAnchor="middle">Low</text>
                  <text x="50" y="53" fill="rgb(156, 163, 175)" fontSize="3" textAnchor="middle">High</text>
                  
                  {/* Risk Severity label */}
                  <text x="50" y="98" fill="rgb(156, 163, 175)" fontSize="3" textAnchor="middle">Risk Severity</text>
                  
                  {/* Risk points */}
                  {risks.map((risk, idx) => {
                    const categoryRisks = risks.filter(r => r.category === risk.category);
                    const categoryIndex = categoryRisks.indexOf(risk);
                    const pos = getRadarPosition(risk, categoryIndex, categoryRisks);
                    return (
                      <g key={risk.id}>
                        <circle 
                          cx={pos.x} 
                          cy={pos.y} 
                          r="3.5" 
                          fill="rgb(16, 185, 129)" 
                          className="transition-all duration-300"
                        />
                        <text 
                          x={pos.x} 
                          y={pos.y + 1} 
                          fill="white" 
                          fontSize="2.5" 
                          textAnchor="middle" 
                          fontWeight="bold"
                        >
                          {risk.id}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Right Column - Operational & Commercial */}
            <div className="space-y-6">
              {/* Operational */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <h2 className="text-xl font-bold text-emerald-400 mb-2">{categoryConfig.operational.label}</h2>
                <p className="text-sm text-muted-foreground mb-4">{categoryConfig.operational.description}</p>
                <div className="space-y-3">
                  {risksByCategory.operational.map((risk) => (
                    <div key={risk.id} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {risk.id}
                      </span>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{risk.title}</p>
                        <p className="text-muted-foreground text-xs">{risk.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commercial */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
                <h2 className="text-xl font-bold text-emerald-400 mb-2">{categoryConfig.commercial.label}</h2>
                <p className="text-sm text-muted-foreground mb-4">{categoryConfig.commercial.description}</p>
                <div className="space-y-3">
                  {risksByCategory.commercial.map((risk) => (
                    <div key={risk.id} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {risk.id}
                      </span>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{risk.title}</p>
                        <p className="text-muted-foreground text-xs">{risk.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
