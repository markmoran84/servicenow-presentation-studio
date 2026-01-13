import { useAccountData } from "@/context/AccountDataContext";
import { TrendingUp, TrendingDown, BarChart3, AlertCircle, Building2 } from "lucide-react";

export const BusinessPerformanceSlide = () => {
  const { data } = useAccountData();
  const { basics, financial, annualReport } = data;

  // Build metrics from financial data
  const hasFinancialData = financial.customerRevenue || financial.growthRate || financial.marginEBIT;
  const hasAnnualReportData = annualReport.revenue || annualReport.keyMilestones.length > 0;
  const hasData = hasFinancialData || hasAnnualReportData;

  const keyMetrics = [];
  
  if (financial.customerRevenue) {
    keyMetrics.push({ label: "Customer Revenue", value: financial.customerRevenue, change: financial.growthRate || "" });
  } else if (annualReport.revenue) {
    keyMetrics.push({ label: "Revenue", value: annualReport.revenue, change: annualReport.revenueComparison || "" });
  }
  
  if (financial.growthRate) {
    keyMetrics.push({ label: "Growth Rate", value: financial.growthRate, change: "" });
  }
  
  if (financial.marginEBIT) {
    keyMetrics.push({ label: "EBIT Margin", value: financial.marginEBIT, change: annualReport.ebitImprovement || "" });
  }

  if (annualReport.netZeroTarget) {
    keyMetrics.push({ label: "Net Zero Target", value: annualReport.netZeroTarget, change: "" });
  }

  // Build highlights from annual report
  const highlights = [];
  
  if (annualReport.keyMilestones.length > 0) {
    annualReport.keyMilestones.slice(0, 3).forEach((milestone, idx) => {
      highlights.push({
        segment: `Milestone ${idx + 1}`,
        note: milestone,
        trend: "up",
        change: ""
      });
    });
  }

  if (annualReport.strategicAchievements.length > 0) {
    annualReport.strategicAchievements.slice(0, 3).forEach((achievement, idx) => {
      highlights.push({
        segment: `Achievement ${idx + 1}`,
        note: achievement,
        trend: "up",
        change: ""
      });
    });
  }

  return (
    <div className="h-full overflow-auto px-8 pt-6 pb-32">
      <div className="flex items-center gap-3 mb-6 opacity-0 animate-fade-in">
        <BarChart3 className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-bold text-foreground">
          {basics.accountName ? `${basics.accountName} Business Performance` : "Business Performance"}
        </h1>
      </div>

      {!hasData ? (
        <div className="glass-card p-12 text-center opacity-0 animate-fade-in">
          <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Financial Data Available</h3>
          <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
            Complete the Financial Snapshot section in the Input Form or upload an Annual Report to populate business performance metrics.
          </p>
        </div>
      ) : (
        <>
          {keyMetrics.length > 0 && (
            <div className={`grid grid-cols-${Math.min(keyMetrics.length, 4)} gap-4 mb-6`}>
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
                      {metric.change}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {highlights.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {highlights.slice(0, 3).map((highlight, index) => (
                <div
                  key={index}
                  className="glass-card p-5 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="icon-container">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground text-lg">{highlight.segment}</h3>
                  </div>

                  <div className={`flex items-center justify-between p-3 rounded-lg ${highlight.trend === "down" ? "bg-amber-500/10 border border-amber-500/20" : "bg-accent/5 border border-accent/20"}`}>
                    <span className="text-sm text-muted-foreground">{highlight.note}</span>
                    {highlight.change && (
                      <span className={`font-semibold flex items-center gap-1 ${highlight.trend === "down" ? "text-amber-500" : "text-accent"}`}>
                        {highlight.trend === "down" ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                        {highlight.change}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {financial.costPressureAreas && (
            <div className="mt-6 glass-card p-4 opacity-0 animate-fade-in animation-delay-700">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Investment Implication:</span> {financial.costPressureAreas}. 
                Every initiative must demonstrate clear ROI and alignment to strategic priorities.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
