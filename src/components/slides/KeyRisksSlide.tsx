import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { ShieldAlert, Sparkles, AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";

// Risk category type
type RiskCategory = "Strategic" | "Operational" | "Governance" | "Commercial";

interface CategorizedRisk {
  id: number;
  risk: string;
  description: string;
  category: RiskCategory;
  severity: number; // 1-5, where 5 is highest (closest to center = higher severity)
  mitigation: string;
}

// Category descriptions
const categoryDescriptions: Record<RiskCategory, string> = {
  Strategic: "Risks that could limit our ability to position ServiceNow as a strategic platform partner and scale the account",
  Operational: "Risks that impact execution velocity, adoption, and realised value from ServiceNow deployments",
  Governance: "Risks associated with governance and oversight mechanisms",
  Commercial: "Risks that could affect account growth, renewal confidence, and long-term commercial expansion",
};

// Category colors - using #61D84E green
const categoryColors: Record<RiskCategory, { text: string; bg: string }> = {
  Strategic: { text: "#61D84E", bg: "rgba(97, 216, 78, 0.15)" },
  Operational: { text: "#61D84E", bg: "rgba(97, 216, 78, 0.15)" },
  Governance: { text: "#61D84E", bg: "rgba(97, 216, 78, 0.15)" },
  Commercial: { text: "#61D84E", bg: "rgba(97, 216, 78, 0.15)" },
};

export const KeyRisksSlide = () => {
  const { data } = useAccountData();
  const { basics, generatedPlan } = data;
  const [hoveredRisk, setHoveredRisk] = useState<number | null>(null);

  // Transform AI-generated risks into categorized format
  const categorizedRisks: CategorizedRisk[] = useMemo(() => {
    const risks = generatedPlan?.keyRisks || generatedPlan?.risksMitigations || [];
    
    // If we have the new keyRisks format with categories
    if (generatedPlan?.keyRisks) {
      return generatedPlan.keyRisks.map((risk, index) => ({
        id: index + 1,
        risk: risk.risk,
        description: risk.description || "",
        category: (risk.category as RiskCategory) || "Strategic",
        severity: risk.severity || 3,
        mitigation: risk.mitigation || "",
      }));
    }

    // Otherwise, distribute existing risks across categories
    const categories: RiskCategory[] = ["Strategic", "Operational", "Governance", "Commercial"];
    return risks.map((risk, index) => ({
      id: index + 1,
      risk: risk.risk,
      description: "",
      category: categories[index % 4],
      severity: risk.level === "High" ? 5 : risk.level === "Medium" ? 3 : 1,
      mitigation: risk.mitigation,
    }));
  }, [generatedPlan]);

  const isAIGenerated = categorizedRisks.length > 0;

  // Group risks by category
  const risksByCategory = useMemo(() => {
    const grouped: Record<RiskCategory, CategorizedRisk[]> = {
      Strategic: [],
      Operational: [],
      Governance: [],
      Commercial: [],
    };
    categorizedRisks.forEach((risk) => {
      grouped[risk.category].push(risk);
    });
    return grouped;
  }, [categorizedRisks]);

  // Calculate position on radar for each risk
  const getRiskPosition = (risk: CategorizedRisk, categoryIndex: number) => {
    const centerX = 220;
    const centerY = 220;
    const maxRadius = 180;
    
    // Calculate angle based on category (4 quadrants)
    // Strategic = top-left, Operational = top-right, Governance = bottom-left, Commercial = bottom-right
    const categoryAngles: Record<RiskCategory, number> = {
      Strategic: -135,
      Operational: -45,
      Governance: 135,
      Commercial: 45,
    };
    
    // Spread risks within their quadrant
    const risksInCategory = risksByCategory[risk.category];
    const riskIndexInCategory = risksInCategory.findIndex(r => r.id === risk.id);
    const spreadAngle = 60; // degrees to spread within quadrant
    const baseAngle = categoryAngles[risk.category];
    const angleOffset = risksInCategory.length > 1 
      ? (riskIndexInCategory - (risksInCategory.length - 1) / 2) * (spreadAngle / Math.max(risksInCategory.length - 1, 1))
      : 0;
    const angle = (baseAngle + angleOffset) * (Math.PI / 180);
    
    // Distance from center based on severity (5 = closest, 1 = furthest)
    const radiusRatio = 1 - (risk.severity - 1) / 5;
    const radius = 40 + radiusRatio * (maxRadius - 40);
    
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  };

  // Generate concentric circles for radar
  const concentricCircles = [180, 140, 100, 60];

  // Generate quadrant lines
  const quadrantLines = [
    { x1: 220, y1: 40, x2: 220, y2: 400 }, // vertical
    { x1: 40, y1: 220, x2: 400, y2: 220 }, // horizontal
  ];

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-[#61D84E]/20 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7 text-[#61D84E]" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#61D84E]">
              Key Risks to The FY26 Plan
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <RegenerateSectionButton section="keyRisks" />
            {isAIGenerated && (
              <span className="pill-badge bg-accent/20 text-accent border-accent/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
          The {basics.accountName || "account"} team categorises risks into four different areas to provide
          the appropriate level of governance and oversight to effectively manage these risks.
        </p>

        {!isAIGenerated ? (
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in">
            <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Risks Identified</h3>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
              Generate an AI-powered strategic plan to identify key risks categorized by type.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_440px_1fr] gap-6">
            {/* Left Column - Strategic & Governance */}
            <div className="space-y-8">
              {/* Strategic */}
              <div>
                <h2 className="text-xl font-bold text-[#61D84E] mb-2">Strategic</h2>
                <p className="text-xs text-muted-foreground mb-4">{categoryDescriptions.Strategic}</p>
                <div className="space-y-3">
                  {risksByCategory.Strategic.map((risk) => (
                    <div
                      key={risk.id}
                      className={`flex items-start gap-3 transition-all duration-300 ${
                        hoveredRisk === risk.id ? "opacity-100" : hoveredRisk !== null ? "opacity-40" : "opacity-100"
                      }`}
                      onMouseEnter={() => setHoveredRisk(risk.id)}
                      onMouseLeave={() => setHoveredRisk(null)}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#61D84E] flex items-center justify-center text-xs font-bold text-background flex-shrink-0">
                        {risk.id}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">{risk.risk}</h4>
                        {risk.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{risk.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Governance */}
              <div>
                <h2 className="text-xl font-bold text-[#61D84E] mb-2">Governance</h2>
                <p className="text-xs text-muted-foreground mb-4">{categoryDescriptions.Governance}</p>
                <div className="space-y-3">
                  {risksByCategory.Governance.map((risk) => (
                    <div
                      key={risk.id}
                      className={`flex items-start gap-3 transition-all duration-300 ${
                        hoveredRisk === risk.id ? "opacity-100" : hoveredRisk !== null ? "opacity-40" : "opacity-100"
                      }`}
                      onMouseEnter={() => setHoveredRisk(risk.id)}
                      onMouseLeave={() => setHoveredRisk(null)}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#61D84E] flex items-center justify-center text-xs font-bold text-background flex-shrink-0">
                        {risk.id}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">{risk.risk}</h4>
                        {risk.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{risk.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center - Radar Chart */}
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-foreground mb-4">Key Risks</h3>
              <div className="relative">
                <svg width="440" height="440" viewBox="0 0 440 440" className="drop-shadow-lg">
                  <defs>
                    {/* Gradient for radar background */}
                    <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(97, 216, 78, 0.3)" />
                      <stop offset="100%" stopColor="rgba(97, 216, 78, 0.05)" />
                    </radialGradient>
                    {/* Glow filter */}
                    <filter id="riskGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Concentric circles */}
                  {concentricCircles.map((radius, index) => (
                    <circle
                      key={radius}
                      cx="220"
                      cy="220"
                      r={radius}
                      fill={index === 0 ? "url(#radarGradient)" : "none"}
                      stroke="rgba(97, 216, 78, 0.3)"
                      strokeWidth="1"
                      strokeDasharray={index > 0 ? "4 4" : "none"}
                    />
                  ))}

                  {/* Quadrant divider lines */}
                  {quadrantLines.map((line, index) => (
                    <line
                      key={index}
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke="rgba(97, 216, 78, 0.4)"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Axis labels */}
                  <text x="220" y="25" textAnchor="middle" fill="#94A3B8" fontSize="11">Low</text>
                  <text x="220" y="420" textAnchor="middle" fill="#94A3B8" fontSize="11">Low</text>
                  <text x="25" y="224" textAnchor="middle" fill="#94A3B8" fontSize="11">Low</text>
                  <text x="415" y="224" textAnchor="middle" fill="#94A3B8" fontSize="11">Low</text>
                  <text x="220" y="235" textAnchor="middle" fill="#94A3B8" fontSize="11">High</text>

                  {/* Category labels curved around circle */}
                  <text x="120" y="100" textAnchor="middle" fill="rgba(97, 216, 78, 0.6)" fontSize="12" transform="rotate(-45 120 100)">
                    Strategic
                  </text>
                  <text x="320" y="100" textAnchor="middle" fill="rgba(97, 216, 78, 0.6)" fontSize="12" transform="rotate(45 320 100)">
                    Operational
                  </text>
                  <text x="120" y="340" textAnchor="middle" fill="rgba(97, 216, 78, 0.6)" fontSize="12" transform="rotate(45 120 340)">
                    Governance
                  </text>
                  <text x="320" y="340" textAnchor="middle" fill="rgba(97, 216, 78, 0.6)" fontSize="12" transform="rotate(-45 320 340)">
                    Commercial
                  </text>

                  {/* Risk Severity label */}
                  <text x="220" y="435" textAnchor="middle" fill="#94A3B8" fontSize="10">Risk Severity</text>

                  {/* Risk points */}
                  {categorizedRisks.map((risk, index) => {
                    const pos = getRiskPosition(risk, index);
                    const isHovered = hoveredRisk === risk.id;
                    return (
                      <g
                        key={risk.id}
                        className="cursor-pointer transition-all duration-300"
                        onMouseEnter={() => setHoveredRisk(risk.id)}
                        onMouseLeave={() => setHoveredRisk(null)}
                        style={{ opacity: hoveredRisk !== null && !isHovered ? 0.4 : 1 }}
                      >
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={isHovered ? 16 : 14}
                          fill="#61D84E"
                          filter={isHovered ? "url(#riskGlow)" : undefined}
                          className="transition-all duration-300"
                        />
                        <text
                          x={pos.x}
                          y={pos.y + 4}
                          textAnchor="middle"
                          fill="#0B1D26"
                          fontSize="11"
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
            <div className="space-y-8">
              {/* Operational */}
              <div>
                <h2 className="text-xl font-bold text-[#61D84E] mb-2">Operational</h2>
                <p className="text-xs text-muted-foreground mb-4">{categoryDescriptions.Operational}</p>
                <div className="space-y-3">
                  {risksByCategory.Operational.map((risk) => (
                    <div
                      key={risk.id}
                      className={`flex items-start gap-3 transition-all duration-300 ${
                        hoveredRisk === risk.id ? "opacity-100" : hoveredRisk !== null ? "opacity-40" : "opacity-100"
                      }`}
                      onMouseEnter={() => setHoveredRisk(risk.id)}
                      onMouseLeave={() => setHoveredRisk(null)}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#61D84E] flex items-center justify-center text-xs font-bold text-background flex-shrink-0">
                        {risk.id}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">{risk.risk}</h4>
                        {risk.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{risk.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commercial */}
              <div>
                <h2 className="text-xl font-bold text-[#61D84E] mb-2">Commercial</h2>
                <p className="text-xs text-muted-foreground mb-4">{categoryDescriptions.Commercial}</p>
                <div className="space-y-3">
                  {risksByCategory.Commercial.map((risk) => (
                    <div
                      key={risk.id}
                      className={`flex items-start gap-3 transition-all duration-300 ${
                        hoveredRisk === risk.id ? "opacity-100" : hoveredRisk !== null ? "opacity-40" : "opacity-100"
                      }`}
                      onMouseEnter={() => setHoveredRisk(risk.id)}
                      onMouseLeave={() => setHoveredRisk(null)}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#61D84E] flex items-center justify-center text-xs font-bold text-background flex-shrink-0">
                        {risk.id}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">{risk.risk}</h4>
                        {risk.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{risk.description}</p>
                        )}
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
