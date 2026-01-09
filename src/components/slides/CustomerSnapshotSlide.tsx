import { useAccountData } from "@/context/AccountDataContext";
import { Building2, Users, DollarSign, TrendingUp, Globe, Calendar, Target, Briefcase } from "lucide-react";

export const CustomerSnapshotSlide = () => {
  const { data } = useAccountData();
  const { basics, financial } = data;
  const competitors = data.businessModel.competitors || [];

  const metrics = [
    {
      icon: DollarSign,
      label: "Annual Revenue",
      value: financial.customerRevenue,
      detail: data.annualReport.revenueComparison || "Prior year comparison",
    },
    {
      icon: TrendingUp,
      label: "Growth Rate",
      value: financial.growthRate,
      detail: "Year over Year",
    },
    {
      icon: Briefcase,
      label: "EBIT Margin",
      value: financial.marginEBIT,
      detail: "Operating profit",
    },
    {
      icon: Users,
      label: "Employees",
      value: basics.numberOfEmployees,
      detail: "Global workforce",
    },
  ];

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-5 mb-10">
          <div className="icon-box">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="slide-title">Customer Snapshot</h1>
            <p className="slide-subtitle">{basics.accountName} — At a Glance</p>
          </div>
          <span className="tier-badge">
            {basics.tier} Account
          </span>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Company Profile */}
          <div className="col-span-2 space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-4 gap-4">
              {metrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className="stat-card text-center opacity-0 animate-fade-in"
                  style={{ animationDelay: `${100 + index * 50}ms` }}
                >
                  <div className="icon-box-sm mx-auto mb-4">
                    <metric.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-1">{metric.value}</p>
                  <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">{metric.detail}</p>
                </div>
              ))}
            </div>

            {/* Company Overview */}
            <div className="glass-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center gap-3 mb-5">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className="section-title">Company Overview</h2>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div className="data-cell">
                    <p className="metric-label mb-1.5">Industry</p>
                    <p className="font-semibold text-foreground">{basics.industry}</p>
                  </div>
                  <div className="data-cell">
                    <p className="metric-label mb-1.5">Region / HQ</p>
                    <p className="font-semibold text-foreground">{basics.region}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="data-cell">
                    <p className="metric-label mb-1.5">Cost Pressure Areas</p>
                    <p className="font-medium text-foreground text-sm leading-relaxed">{financial.costPressureAreas}</p>
                  </div>
                  <div className="data-cell">
                    <p className="metric-label mb-1.5">Strategic Investment Areas</p>
                    <p className="font-medium text-foreground text-sm leading-relaxed">{financial.strategicInvestmentAreas}</p>
                  </div>
                </div>
              </div>

              {/* Competitive Landscape */}
              {competitors.length > 0 && (
                <div className="mt-5 pt-5 border-t border-border/50">
                  <p className="metric-label mb-3">Competitive Landscape</p>
                  <div className="flex flex-wrap gap-2">
                    {competitors.map((competitor, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium border border-red-500/20"
                      >
                        {competitor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - ServiceNow Position */}
          <div className="space-y-6">
            {/* Current Relationship */}
            <div className="glass-card p-6 border-l-4 border-l-primary opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <h3 className="card-title mb-5 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                ServiceNow Position
              </h3>
              <div className="space-y-5">
                <div>
                  <p className="metric-label mb-1">Current Contract Value</p>
                  <p className="metric-value">{basics.currentContractValue}</p>
                </div>
                <div className="divider-gradient" />
                <div>
                  <p className="metric-label mb-1">FY26 Ambition</p>
                  <p className="text-2xl font-bold text-foreground">{basics.nextFYAmbition}</p>
                </div>
                <div>
                  <p className="metric-label mb-1">3-Year Target</p>
                  <p className="text-2xl font-bold text-accent">{basics.threeYearAmbition}</p>
                </div>
              </div>
            </div>

            {/* Renewal Info */}
            <div className="glass-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-accent" />
                <h3 className="card-title">Key Dates</h3>
              </div>
              <div className="space-y-4">
                <div className="data-cell-highlight">
                  <p className="metric-label mb-1">Renewal Date</p>
                  <p className="font-bold text-foreground">{basics.renewalDates}</p>
                </div>
                <div className="data-cell">
                  <p className="metric-label mb-1">Decision Timeline</p>
                  <p className="font-medium text-foreground text-sm">{data.engagement.decisionDeadlines}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
