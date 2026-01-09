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
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Building2 className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Customer Snapshot</h1>
            <p className="text-muted-foreground text-lg">{basics.accountName} — At a Glance</p>
          </div>
          <div className="ml-auto">
            <span className="px-4 py-2 rounded-full bg-primary/20 text-primary font-semibold text-sm border border-primary/30">
              {basics.tier} Account
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Company Profile */}
          <div className="col-span-2 space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-4 gap-4">
              {metrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className="glass-card p-5 text-center opacity-0 animate-fade-in"
                  style={{ animationDelay: `${100 + index * 50}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <metric.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-1">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">{metric.detail}</p>
                </div>
              ))}
            </div>

            {/* Company Overview */}
            <div className="glass-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Company Overview</h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Industry</p>
                    <p className="font-medium text-foreground">{basics.industry}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Region / HQ</p>
                    <p className="font-medium text-foreground">{basics.region}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Cost Pressure Areas</p>
                    <p className="font-medium text-foreground text-sm">{financial.costPressureAreas}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Strategic Investment Areas</p>
                    <p className="font-medium text-foreground text-sm">{financial.strategicInvestmentAreas}</p>
                  </div>
                </div>
              </div>

              {/* Competitive Landscape */}
              {competitors.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">Competitive Landscape</p>
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
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                ServiceNow Position
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Current Contract Value</p>
                  <p className="text-2xl font-bold text-primary">{basics.currentContractValue}</p>
                </div>
                <div className="h-px bg-border" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">FY26 Ambition</p>
                  <p className="text-xl font-bold text-foreground">{basics.nextFYAmbition}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">3-Year Target</p>
                  <p className="text-xl font-bold text-accent">{basics.threeYearAmbition}</p>
                </div>
              </div>
            </div>

            {/* Renewal Info */}
            <div className="glass-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-accent" />
                <h3 className="font-bold text-foreground">Key Dates</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-xs text-muted-foreground mb-1">Renewal Date</p>
                  <p className="font-semibold text-foreground">{basics.renewalDates}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground mb-1">Decision Timeline</p>
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
