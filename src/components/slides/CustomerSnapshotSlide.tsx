import { TrendingUp, AlertTriangle, Target, Users, Building2 } from "lucide-react";

const topMetrics = [
  { label: "Current CACV", value: "$5.3M" },
  { label: "FY25 Ambition", value: "$1M" },
  { label: "FY25 Pipeline", value: "$4.9M" },
  { label: "3Y Ambition", value: "$27M" },
  { label: "Renewal", value: "June 27" },
];

const keyFigures = [
  { label: "Revenue Q4 2024", value: "$55.5bn", subtext: "YoY growth 8.6%", accent: "Margin 21.9%" },
  { label: "Customers worldwide", value: "100,000+" },
  { label: "Global Employees", value: "105,000+" },
];

const compellingEvents = [
  "Exec Connect (World Economic Forum)",
  "CxO EBC Santa Clara (Apr)",
  "K25 with Maersk CRM Team (May)",
  "Salesforce renewal 1st Jan 2026",
  "CPQ managed by 230+ People (Expensive)",
  "Logistics and services is a whitespace area",
];

const painPoints = [
  { title: "High cost to serve", desc: "due to fragmented systems, manual processes, and siloed workflows across core business areas" },
  { title: "Fragmented customer experience", desc: "driven by disconnected engagement channels, inconsistent service, and lack of real-time visibility across the customer journey" },
  { title: "Low strategic return from Salesforce investment", desc: "high license and run cost, complex integrations, limited adoption, and low ROI" },
  { title: "Lack of AI governance and orchestration", desc: "siloed AI pilots lack orchestration, limiting impact, scalability, and compliance across the enterprise" },
  { title: "Slow time to value from change", desc: "delivery bottlenecks, legacy tech debt, and custom development leading to delayed outcomes, inefficiencies, and high run costs" },
];

const platformHealth = [
  "High degree of over-customisation",
  "Immature governance structures",
  "Low adoption across key business functions limiting value delivery",
  "Missed value realization from prior investments risking confidence in future initiatives",
];

const accountRisks = [
  "Executive engagement is emerging but still limited",
  "Salesforce transition is high-stakes, high complexity and requires strong business change support and buy-in from key stakeholders to overcome internal resistance",
  "Salesforce may use aggressive commercial levers to retain position (e.g. deep discounting)",
  "Maersk GTM leadership is not yet aligned with the transformation agenda, creating risk for RFP momentum",
];

const implementationStrategy = [
  "Engage P5 leadership to drive executive alignment",
  "Mobilise strategic partner to support discovery and co-develop transformation programme",
  "Define joint value proposition + strategic roadmap",
  "Launch multi-track transformation programme",
];

export const CustomerSnapshotSlide = () => {
  return (
    <div className="px-8 pt-6 pb-32">
      <h1 className="text-4xl font-bold mb-6 opacity-0 animate-fade-in">
        <span className="text-primary">Customer</span>{" "}
        <span className="text-foreground">snapshot</span>
      </h1>

      {/* Top Metrics Bar */}
      <div className="flex gap-4 mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
        {topMetrics.map((metric) => (
          <div key={metric.label} className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border border-primary/30 bg-card/30">
            <span className="text-muted-foreground text-sm">{metric.label}</span>
            <span className="text-primary font-bold text-lg">{metric.value}</span>
          </div>
        ))}
      </div>

      {/* Main Grid - 3 columns */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Left Column - Key Figures */}
        <div className="p-5 rounded-xl border border-primary/30 bg-card/30 opacity-0 animate-fade-in" style={{ animationDelay: "150ms" }}>
          <h3 className="text-foreground font-semibold mb-4">Key customer figures</h3>
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-foreground">$55.5bn</div>
              <div className="text-sm text-muted-foreground">Revenue Q4 2024</div>
              <div className="flex gap-4 mt-1">
                <span className="text-xs text-muted-foreground">YoY growth <span className="text-primary">8.6%</span></span>
                <span className="text-xs text-muted-foreground">Margin <span className="text-primary">21.9%</span></span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-muted-foreground">Customers worldwide</span>
              <span className="text-xl font-bold text-primary">100,000+</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-primary">105,000+</span>
              <span className="text-sm text-muted-foreground ml-2">Global Employees</span>
            </div>
            <div className="pt-2 border-t border-border/30">
              <span className="text-sm text-muted-foreground">Competitors</span>
              <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 rounded bg-card/50">Hapag-Lloyd</span>
                <span className="px-2 py-1 rounded bg-card/50">MSC</span>
                <span className="px-2 py-1 rounded bg-card/50">CMA CGM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Compelling Events */}
        <div className="p-5 rounded-xl border border-primary/30 bg-card/30 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <h3 className="text-foreground font-semibold mb-4">FY25 compelling event</h3>
          <ul className="space-y-2">
            {compellingEvents.map((event, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                {event}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column - Pain Points */}
        <div className="p-5 rounded-xl border border-primary/30 bg-card/30 opacity-0 animate-fade-in" style={{ animationDelay: "250ms" }}>
          <h3 className="text-foreground font-semibold mb-4">Customer pain points being addressed</h3>
          <ul className="space-y-3">
            {painPoints.map((point, i) => (
              <li key={i} className="text-sm">
                <span className="text-primary font-medium">{point.title}</span>
                <span className="text-muted-foreground"> — {point.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Row - 3 columns */}
      <div className="grid grid-cols-3 gap-4">
        {/* Value Realisation */}
        <div className="p-5 rounded-xl border border-primary/30 bg-card/30 opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <h3 className="text-foreground font-semibold mb-2">Value realisation</h3>
          <div className="text-4xl font-bold text-primary mb-1">64%</div>
          <p className="text-sm text-muted-foreground mb-3">Platform health</p>
          <ul className="space-y-1.5">
            {platformHealth.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <div className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Account Risks */}
        <div className="p-5 rounded-xl border border-primary/30 bg-card/30 opacity-0 animate-fade-in" style={{ animationDelay: "350ms" }}>
          <h3 className="text-foreground font-semibold mb-4">Key Account risks / Obstacles</h3>
          <ul className="space-y-2">
            {accountRisks.map((risk, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                {risk}
              </li>
            ))}
          </ul>
        </div>

        {/* Implementation Strategy */}
        <div className="p-5 rounded-xl border border-primary/30 bg-card/30 opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <h3 className="text-foreground font-semibold mb-4">Implementation strategy + partner alignment</h3>
          <ul className="space-y-2 mb-4">
            {implementationStrategy.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="pt-3 border-t border-border/30">
            <p className="text-sm text-primary font-medium mb-2">Implementation partners</p>
            <div className="text-xs text-muted-foreground px-3 py-2 rounded bg-card/50 inline-block">
              The Whale Group
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
