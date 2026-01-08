import { Anchor, Cpu, Cog, Users, TrendingUp, Target, Leaf, Shield } from "lucide-react";

const strategicPillars = [
  {
    keyword: "INTEGRATED",
    title: "Logistics",
    description: "Unified platform supporting Maersk's 'All the Way' integrated logistics vision across Ocean, Terminals, and Landside services."
  },
  {
    keyword: "DIGITAL",
    title: "Backbone",
    description: "Enterprise-grade workflow automation creating a seamless digital layer from customer request to delivery."
  },
  {
    keyword: "AI-FIRST",
    title: "Operations",
    description: "Operationalising AI and automation at scale to drive efficiency, predictability, and competitive advantage."
  },
  {
    keyword: "COST",
    title: "Discipline",
    description: "Demonstrable ROI through process standardisation, platform consolidation, and operational excellence."
  },
];

export const ExecutiveSummarySlide = () => {
  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto h-full">
        {/* Top Navigation Labels */}
        <div className="flex justify-end gap-8 mb-8 text-sm text-muted-foreground">
          <span>Strategic Plan</span>
          <span>Account Governance</span>
          <span>Financial Outlook</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Narrative */}
          <div className="space-y-8">
            <div>
              <p className="text-muted-foreground text-lg mb-2">Powering</p>
              <h1 className="text-5xl md:text-6xl font-bold text-primary tracking-tight mb-6">
                A STRONGER<br />MAERSK
              </h1>
            </div>

            <p className="text-lg text-foreground/90 leading-relaxed">
              We are the world's leading integrated logistics company. Maersk operates across 130+ countries, 
              connecting and simplifying global trade for customers. We provide end-to-end supply chain 
              solutions underpinned by market-leading technology, creating seamless experiences.
            </p>

            {/* Strategic Pillars */}
            <div className="space-y-6 mt-8">
              {strategicPillars.map((pillar, index) => (
                <div 
                  key={pillar.keyword}
                  className="border-l-4 border-primary pl-4 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <h3 className="text-xl font-bold text-primary">
                    {pillar.keyword} <span className="text-foreground font-medium">{pillar.title}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Bento Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Top row - 2 items */}
            <div className="glass-card p-6 flex flex-col items-center justify-center text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <Anchor className="w-10 h-10 text-primary mb-3" />
              <span className="text-sm font-medium text-foreground">Integrated Logistics</span>
              <span className="text-xs text-muted-foreground">End-to-End Solutions</span>
            </div>
            <div className="glass-card p-6 flex flex-col items-center justify-center text-center opacity-0 animate-fade-in" style={{ animationDelay: "150ms" }}>
              <Target className="w-10 h-10 text-primary mb-3" />
              <span className="text-sm font-medium text-foreground">All the Way</span>
              <span className="text-xs text-muted-foreground">Strategic Vision</span>
            </div>

            {/* Large metric card */}
            <div className="col-span-2 glass-card p-8 text-center opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <p className="text-sm text-muted-foreground mb-2">FY24 Revenue</p>
              <p className="text-5xl font-bold text-primary">$55.5B</p>
              <p className="text-sm text-muted-foreground mt-2">(2023: $51.1B)</p>
            </div>

            {/* Middle row - icons with metrics */}
            <div className="glass-card p-5 flex flex-col items-center justify-center text-center opacity-0 animate-fade-in" style={{ animationDelay: "250ms" }}>
              <Cpu className="w-8 h-8 text-accent mb-2" />
              <span className="text-sm font-medium text-foreground">Digital First</span>
              <span className="text-xs text-muted-foreground">AI & Automation</span>
            </div>
            <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <p className="text-sm text-muted-foreground mb-1">Net Zero Target</p>
              <p className="text-3xl font-bold text-primary">2040</p>
              <p className="text-xs text-muted-foreground">(Science-based)</p>
            </div>

            {/* NPS Score */}
            <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "350ms" }}>
              <p className="text-sm text-muted-foreground mb-1">EBIT Improvement</p>
              <p className="text-3xl font-bold text-accent">+65%</p>
              <p className="text-xs text-muted-foreground">(2024 YoY)</p>
            </div>
            <div className="glass-card p-5 flex flex-col items-center justify-center text-center opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <Shield className="w-8 h-8 text-primary mb-2" />
              <span className="text-sm font-medium text-foreground">Resilient</span>
              <span className="text-xs text-muted-foreground">Supply Chains</span>
            </div>

            {/* Bottom full-width */}
            <div className="col-span-2 glass-card p-6 flex items-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "450ms" }}>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivering value to</p>
                <p className="font-semibold text-foreground">Customers, Employees & Shareholders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
