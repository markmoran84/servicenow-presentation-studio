import { useAccountData } from "@/context/AccountDataContext";
import { Shield, AlertTriangle, Lightbulb, Flame } from "lucide-react";

export const SWOTSlide = () => {
  const { data } = useAccountData();
  const swot = data.swot;

  const defaultStrengths = [
    "Executive alignment at the highest level",
    "Proven AI value at Maersk – #2 globally in Now Assist adoption",
    "Strong strategic fit with Integrator Strategy",
    "Unique ability to govern and orchestrate Maersk's multi-vendor AI landscape at scale",
    "Marquee account status with strong commercial backing"
  ];

  const defaultWeaknesses = [
    "Platform health and legacy challenges",
    "Depth of executive engagement still emerging",
    "Limited CRM credibility at Maersk",
    "GTM alignment risk",
    "Change management and adoption risk"
  ];

  const defaultOpportunities = [
    "CRM & Customer Service transformation",
    "AI Control Tower as an enterprise anchor",
    "Cost-to-serve reduction mandate",
    "Platform consolidation & standardisation",
    "Executive appetite for platform-led change"
  ];

  const defaultThreats = [
    "Salesforce incumbency risk",
    "Internal build preference",
    "Transformation fatigue",
    "Competitive platform narratives",
    "Execution and sequencing risk"
  ];

  const strengths = swot.strengths.length > 0 ? swot.strengths : defaultStrengths;
  const weaknesses = swot.weaknesses.length > 0 ? swot.weaknesses : defaultWeaknesses;
  const opportunities = swot.opportunities.length > 0 ? swot.opportunities : defaultOpportunities;
  const threats = swot.threats.length > 0 ? swot.threats : defaultThreats;

  const quadrants = [
    {
      title: "Strengths",
      icon: Shield,
      items: strengths,
      iconColor: "text-primary",
      borderColor: "border-l-primary"
    },
    {
      title: "Weaknesses",
      icon: AlertTriangle,
      items: weaknesses,
      iconColor: "text-yellow-400",
      borderColor: "border-l-yellow-400"
    },
    {
      title: "Opportunities",
      icon: Lightbulb,
      items: opportunities,
      iconColor: "text-cyan-400",
      borderColor: "border-l-cyan-400"
    },
    {
      title: "Threats",
      icon: Flame,
      items: threats,
      iconColor: "text-orange-400",
      borderColor: "border-l-orange-400"
    }
  ];

  return (
    <div className="min-h-screen p-8 pb-32">
      {/* Header */}
      <div className="mb-8 opacity-0 animate-fade-in">
        <h1 className="text-5xl font-bold text-primary">SWOT Analysis</h1>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-6">
        {quadrants.map((quadrant, index) => {
          const Icon = quadrant.icon;
          return (
            <div 
              key={quadrant.title}
              className="glass-card p-6 opacity-0 animate-fade-in"
              style={{ animationDelay: `${100 + index * 100}ms` }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <Icon className={`w-6 h-6 ${quadrant.iconColor}`} />
                <h2 className="text-xl font-bold text-foreground">{quadrant.title}</h2>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {quadrant.items.map((item, i) => (
                  <div 
                    key={i}
                    className={`bg-slate-800/50 rounded-lg p-3 border-l-4 ${quadrant.borderColor}`}
                  >
                    <span className="text-sm text-foreground/90">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
