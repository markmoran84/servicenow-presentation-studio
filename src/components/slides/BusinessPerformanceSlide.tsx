import { TrendingUp, TrendingDown, BarChart3, Ship, Package, Building2 } from "lucide-react";

const financialHighlights = [
  {
    segment: "Ocean",
    revenue: "$26.3B",
    ebitda: "$5.7B",
    change: "-10%",
    trend: "down",
    note: "Gemini Cooperation delivering cost savings, 7% volume growth YoY",
  },
  {
    segment: "Logistics & Services",
    revenue: "$11.9B",
    ebitda: "$1.3B",
    change: "+5%",
    trend: "up",
    note: "5.5% margin improvement, Fulfilled by Maersk growth in Warehousing",
  },
  {
    segment: "Terminals",
    revenue: "$4.2B",
    ebitda: "$1.4B",
    change: "+22%",
    trend: "up",
    note: "Record volumes, 89% utilisation, strong demand across all regions",
  },
];

const keyMetrics = [
  { label: "9M Revenue", value: "$40.7B", change: "~flat YoY" },
  { label: "FY25 EBIT Guidance", value: "$3.0-3.5B", change: "Raised" },
  { label: "FY25 EBITDA Guidance", value: "$9.0-9.5B", change: "Raised" },
  { label: "9M Net Result", value: "$2.8B", change: "-31% YoY" },
];

export const BusinessPerformanceSlide = () => {
  return (
    <div className="px-8 pt-6 pb-32">
      <div className="flex items-center gap-3 mb-6 opacity-0 animate-fade-in">
        <BarChart3 className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-bold text-foreground">Business Performance 9M 2025</h1>
        <span className="pill-badge-accent ml-2">YTD Q3 2025 Results</span>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {keyMetrics.map((metric, index) => (
          <div
            key={metric.label}
            className="stat-card opacity-0 animate-fade-in"
            style={{ animationDelay: `${100 + index * 75}ms` }}
          >
            <div className="text-sm text-muted-foreground mb-1">{metric.label}</div>
            <div className="metric-highlight text-3xl">{metric.value}</div>
            {metric.change && (
              <div className="flex items-center gap-1 mt-1 text-accent text-sm">
                <TrendingUp className="w-4 h-4" />
                {metric.change} YoY
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {financialHighlights.map((segment, index) => (
          <div
            key={segment.segment}
            className="glass-card p-5 opacity-0 animate-fade-in"
            style={{ animationDelay: `${400 + index * 100}ms` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-container">
                {segment.segment === "Ocean" && <Ship className="w-5 h-5 text-primary" />}
                {segment.segment === "Logistics & Services" && <Package className="w-5 h-5 text-primary" />}
                {segment.segment === "Terminals" && <Building2 className="w-5 h-5 text-primary" />}
              </div>
              <h3 className="font-bold text-foreground text-lg">{segment.segment}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Revenue</div>
                <div className="text-2xl font-bold text-foreground">{segment.revenue}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">EBITDA</div>
                <div className="text-2xl font-bold text-gradient">{segment.ebitda}</div>
              </div>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg ${segment.trend === "down" ? "bg-amber-500/10 border border-amber-500/20" : "bg-accent/5 border border-accent/20"}`}>
              <span className="text-sm text-muted-foreground">{segment.note}</span>
              <span className={`font-semibold flex items-center gap-1 ${segment.trend === "down" ? "text-amber-500" : "text-accent"}`}>
                {segment.trend === "down" ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                {segment.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 glass-card p-4 opacity-0 animate-fade-in animation-delay-700">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Investment Implication:</span> Cost discipline drives technology decisions. 
          Every initiative must demonstrate clear ROI and alignment to strategic priorities. $2B share buyback announced reflects confidence in sustained performance.
        </p>
      </div>
    </div>
  );
};
