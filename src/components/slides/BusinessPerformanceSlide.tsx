import { SectionHeader } from "@/components/SectionHeader";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, AlertTriangle, CheckCircle } from "lucide-react";

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

const pressures = [
  {
    icon: AlertTriangle,
    title: "Cost Pressure",
    items: [
      "Fuel cost volatility",
      "Labour cost increases",
      "Regulatory compliance costs",
    ],
    color: "text-amber-500",
  },
  {
    icon: TrendingDown,
    title: "Market Challenges",
    items: [
      "Freight rate normalisation",
      "Overcapacity in shipping",
      "Geopolitical disruption",
    ],
    color: "text-red-400",
  },
  {
    icon: CheckCircle,
    title: "Growth Levers",
    items: [
      "Logistics & Services expansion",
      "Digital product offerings",
      "Customer experience differentiation",
    ],
    color: "text-sn-green",
  },
];

export const BusinessPerformanceSlide = () => {
  return (
    <div className="px-8 pt-6 pb-32">
      <h1 className="text-4xl font-bold text-foreground mb-6 opacity-0 animate-fade-in">
        Business Performance
      </h1>

      <div className="grid grid-cols-2 gap-6">
        {/* Left - Market Context */}
        <div className="glass-card rounded-2xl p-6">
          <SectionHeader
            title="Market Context & Financial Position"
            description="Maersk operating in a normalising freight environment"
            delay={100}
          />

          <div className="mt-6 grid grid-cols-2 gap-4">
            {marketMetrics.map((metric, index) => (
              <div
                key={metric.label}
                className="bg-card/50 rounded-xl p-4 border border-border/50 opacity-0 animate-fade-in"
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                  <div className={`flex items-center gap-1 text-xs ${
                    metric.trend === "down" ? "text-red-400" : 
                    metric.trend === "up" ? "text-sn-green" : "text-muted-foreground"
                  }`}>
                    {metric.trend === "down" ? <TrendingDown className="w-3 h-3" /> : 
                     metric.trend === "up" ? <TrendingUp className="w-3 h-3" /> : null}
                    {metric.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.context}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-sn-navy/30 rounded-xl border border-white/10 opacity-0 animate-fade-in" style={{ animationDelay: "700ms" }}>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Investment Implications</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Cost discipline drives technology decisions. Every initiative must demonstrate 
              clear ROI and alignment to strategic priorities. Value realisation is non-negotiable.
            </p>
          </div>
        </div>

        {/* Right - Pressures & Opportunities */}
        <div className="glass-card rounded-2xl p-6">
          <SectionHeader
            title="Cost, Growth & Efficiency Pressures"
            description="Key forces shaping Maersk's technology investment priorities"
            delay={150}
          />

          <div className="mt-6 space-y-4">
            {pressures.map((pressure, index) => (
              <div
                key={pressure.title}
                className="bg-card/50 rounded-xl p-4 border border-border/50 opacity-0 animate-fade-in"
                style={{ animationDelay: `${300 + index * 150}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <pressure.icon className={`w-5 h-5 ${pressure.color}`} />
                  <h3 className="font-semibold text-foreground">{pressure.title}</h3>
                </div>
                <ul className="space-y-1.5">
                  {pressure.items.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
