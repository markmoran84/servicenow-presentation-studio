import { SectionHeader } from "@/components/SectionHeader";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, AlertTriangle, CheckCircle, Target, Anchor } from "lucide-react";

const marketMetrics = [
  {
    label: "Revenue FY24",
    value: "$51.1B",
    change: "-14%",
    trend: "down",
    context: "Market normalisation post-pandemic",
  },
  {
    label: "EBITDA",
    value: "$6.8B",
    change: "-37%",
    trend: "down",
    context: "Freight rate compression",
  },
  {
    label: "ROIC",
    value: "8.4%",
    change: "-12pp",
    trend: "down",
    context: "Focus on capital efficiency",
  },
  {
    label: "Net Debt",
    value: "$4.2B",
    change: "+$2.8B",
    trend: "neutral",
    context: "Strategic investments",
  },
];

const strategicImperatives = [
  {
    icon: DollarSign,
    title: "Cost Discipline",
    description: "Maintain strong ROIC and margin discipline while transforming",
    color: "text-amber-500",
  },
  {
    icon: TrendingUp,
    title: "Commercial Agility",
    description: "Improve responsiveness across products and regions",
    color: "text-sn-green",
  },
  {
    icon: Target,
    title: "Process Maturity",
    description: "Digitise and standardise end-to-end operations",
    color: "text-primary",
  },
];

const successMetrics = [
  "Tangible reduction in cost-to-serve",
  "Improved commercial responsiveness",
  "AI embedded into operational workflows",
  "ServiceNow as core digital backbone",
];

export const BusinessPerformanceSlide = () => {
  return (
    <div className="px-8 pt-6 pb-32">
      <h1 className="slide-title opacity-0 animate-fade-in">
        <span className="highlight">Business Performance</span>
        <br />& Market Context
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Left - Market Context */}
        <div className="col-span-2">
          <div className="glass-card rounded-2xl p-6">
            <SectionHeader
              title="Financial Position"
              description="Operating in a normalising freight environment with focus on capital efficiency"
              delay={100}
            />

            <div className="mt-5 grid grid-cols-4 gap-3">
              {marketMetrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className="bg-card/50 rounded-xl p-4 border border-border/50 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{metric.label}</span>
                    <div className={`flex items-center gap-1 text-[10px] ${
                      metric.trend === "down" ? "text-red-400" : 
                      metric.trend === "up" ? "text-sn-green" : "text-muted-foreground"
                    }`}>
                      {metric.trend === "down" ? <TrendingDown className="w-3 h-3" /> : 
                       metric.trend === "up" ? <TrendingUp className="w-3 h-3" /> : null}
                      {metric.change}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
                  <p className="text-[10px] text-muted-foreground">{metric.context}</p>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
                Strategic Imperatives from Maersk
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {strategicImperatives.map((item, index) => (
                  <div
                    key={item.title}
                    className="bg-card/50 rounded-xl p-4 border border-border/50 opacity-0 animate-fade-in"
                    style={{ animationDelay: `${700 + index * 100}ms` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 p-4 bg-sn-navy/30 rounded-xl border border-white/10 opacity-0 animate-fade-in" style={{ animationDelay: "1000ms" }}>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground text-sm">Investment Implications</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Cost discipline drives technology decisions. Every initiative must demonstrate clear ROI and alignment to strategic priorities. 
                Value realisation is non-negotiable.
              </p>
            </div>
          </div>
        </div>

        {/* Right - Success Metrics */}
        <div>
          <div className="glass-card rounded-2xl p-6 h-full">
            <SectionHeader
              title="What Success Looks Like"
              description="By end of FY26"
              delay={150}
            />

            <div className="mt-5 space-y-3">
              {successMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-sn-green/10 rounded-xl border border-sn-green/20 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <CheckCircle className="w-5 h-5 text-sn-green flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{metric}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-br from-primary/20 to-sn-green/20 rounded-xl border border-primary/30 opacity-0 animate-fade-in" style={{ animationDelay: "800ms" }}>
              <div className="flex items-center gap-2 mb-3">
                <Anchor className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground text-sm">Closing Position</span>
              </div>
              <p className="text-xs text-foreground italic leading-relaxed">
                "FY25 restored trust. FY26 is about scale — embedding AI, standardising execution, and turning 
                ServiceNow into a foundational capability that helps Maersk operate as one integrated enterprise."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
