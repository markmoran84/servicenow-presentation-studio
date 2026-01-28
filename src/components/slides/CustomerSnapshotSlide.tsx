import { useAccountData } from "@/context/AccountDataContext";
import { DollarSign, TrendingUp, Building2, Users, Globe, Calendar, Target } from "lucide-react";

export const CustomerSnapshotSlide = () => {
  const { data } = useAccountData();
  const { basics, financial, engagement } = data;

  // Top metrics row
  const topMetrics = [
    {
      icon: DollarSign,
      value: financial.customerRevenue || "$23.7 bn",
      label: "Annual Revenue",
    },
    {
      icon: TrendingUp,
      value: financial.growthRate || "4.1%",
      label: "YoY",
    },
    {
      icon: Building2,
      value: financial.marginEBIT || "38.6%",
      label: "EBIT Margin",
    },
    {
      icon: Users,
      value: basics.numberOfEmployees || "28k +",
      label: "Global Workforce",
    },
  ];

  // Cost pressure areas
  const costPressures = (financial.costPressureAreas || "")
    .split(/[•\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .slice(0, 5);

  // Strategic investment areas
  const investments = (financial.strategicInvestmentAreas || "")
    .split(/[•\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .slice(0, 5);

  // Compelling events from decision deadlines or renewal
  const compellingEvents = (engagement.decisionDeadlines || "")
    .split(/[•\n,]/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .slice(0, 4);

  return (
    <div className="min-h-screen p-8 md:p-10 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
            Customer snapshot
          </h1>
          <p className="text-lg text-muted-foreground">
            {basics.accountName || "Company"} at a glance
          </p>
        </div>

        <div className="grid grid-cols-12 gap-5">
          {/* Left Side - Main Content */}
          <div className="col-span-8 space-y-5">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-4 gap-4">
              {topMetrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className="glass-card p-4 text-center opacity-0 animate-fade-in"
                  style={{ animationDelay: `${50 + index * 50}ms` }}
                >
                  <div className="w-10 h-10 rounded-full border-2 border-primary/30 flex items-center justify-center mx-auto mb-3">
                    <metric.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-primary mb-1">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </div>
              ))}
            </div>

            {/* Company Overview Section */}
            <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold text-foreground">Company Overview</h2>
                </div>
                {basics.tier && (
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                    {basics.tier}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Left Column - Company Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-primary font-medium mb-1">Industry</p>
                    <p className="text-sm text-foreground">{basics.industry || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-primary font-medium mb-1">Headquarters</p>
                    <p className="text-sm text-foreground">{basics.region || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-primary font-medium mb-1">Global Presence</p>
                    <p className="text-sm text-foreground">220+ Countries & Territories</p>
                  </div>
                  <div>
                    <p className="text-xs text-primary font-medium mb-1">Fleet Capacity</p>
                    <p className="text-sm text-foreground">4.1M TEU (700+ vessels)</p>
                  </div>
                </div>

                {/* Right Column - Cost Pressures & Investments */}
                <div className="space-y-4">
                  {costPressures.length > 0 && (
                    <div>
                      <p className="text-xs text-amber-400 font-semibold mb-2">Cost Pressure Areas</p>
                      <ul className="space-y-1">
                        {costPressures.map((item, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="text-muted-foreground mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {investments.length > 0 && (
                    <div>
                      <p className="text-xs text-primary font-semibold mb-2">Strategic Investment Areas</p>
                      <ul className="space-y-1">
                        {investments.map((item, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="text-muted-foreground mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - ServiceNow Position */}
          <div className="col-span-4 space-y-5">
            {/* ServiceNow Position Card */}
            <div className="glass-card p-5 border-l-4 border-l-primary opacity-0 animate-fade-in" style={{ animationDelay: "250ms" }}>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-primary text-sm">ServiceNow Position</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1">Annual Contract Value (ACV)</p>
                  <p className="text-2xl font-bold text-primary">{basics.currentContractValue || "$5.4M"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1">Pipeline</p>
                  <p className="text-2xl font-bold text-primary">$19.7M</p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-border/30">
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1">FY26 Ambition (ACV)</p>
                  <p className="text-xl font-bold text-foreground">{basics.nextFYAmbition || "$12.4M"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1">3-Year Target (ACV)</p>
                  <p className="text-xl font-bold text-accent">{basics.threeYearAmbition || "$27M"}</p>
                </div>
              </div>
            </div>

            {/* Compelling Events */}
            <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "350ms" }}>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-accent" />
                <h3 className="font-semibold text-foreground text-sm">Compelling Events</h3>
              </div>
              
              <div className="space-y-3">
                {compellingEvents.length > 0 ? (
                  compellingEvents.map((event, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <p className="text-sm text-foreground">{event}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <p className="text-sm text-foreground">CRM / Service Platform RFP decision window, January 2026</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <p className="text-sm text-foreground">Executive Briefing Centre (EBC), Santa Clara, March 2026</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <p className="text-sm text-foreground">Customer Technology Day, March 2026</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <p className="text-sm text-foreground">Contract renewal milestone, 27 June 2026</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
