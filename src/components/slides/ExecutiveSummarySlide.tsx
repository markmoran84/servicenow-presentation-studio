import { useAccountData } from "@/context/AccountDataContext";
import { Leaf, TrendingUp, CheckCircle2, Target, Users } from "lucide-react";

export const ExecutiveSummarySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, annualReport } = data;

  const strategicPillars = [
    ...strategy.corporateStrategy.slice(0, 4).map((item, index) => {
      const keywords = ["INTEGRATED", "CUSTOMER", "AI-FIRST", "NET ZERO"];
      const titles = ["Logistics", "Centricity", "Operations", "Ambition"];
      return {
        keyword: keywords[index] || item.title.split(" ")[0].toUpperCase(),
        title: titles[index] || item.title.split(" ").slice(1).join(" "),
        description: item.title,
      };
    }),
  ].slice(0, 4);

  return (
    <div className="min-h-screen p-8 md:p-12 pb-24">
      <div className="max-w-7xl mx-auto h-full">
        {/* Top Navigation Labels */}
        <div className="flex justify-end gap-8 mb-6 text-sm text-muted-foreground">
          <span>Strategic Plan</span>
          <span>Account Governance</span>
          <span>Financial Outlook</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Two-tone title and narrative */}
          <div className="space-y-8">
            <div>
              <p className="text-muted-foreground text-lg mb-2">Powering</p>
              <h1 className="sn-title text-5xl md:text-6xl tracking-tight mb-6">
                <span className="green">A STRONGER</span><br />
                <span className="white">{basics.accountName.split(" ").pop()?.toUpperCase() || "PARTNER"}</span>
              </h1>
            </div>

            <p className="text-lg text-foreground/90 leading-relaxed font-light">
              {annualReport.executiveSummaryNarrative}
            </p>

            {/* Strategic Pillars with Wasabi Green callout lines */}
            <div className="space-y-5 mt-8">
              {strategicPillars.map((pillar, index) => (
                <div 
                  key={pillar.keyword}
                  className="sn-callout opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <h3 className="text-lg font-semibold">
                    <span className="text-primary">{pillar.keyword}</span>{" "}
                    <span className="text-foreground">{pillar.title}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Stats in glass cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Revenue - Full width emphasis */}
            <div className="col-span-2 sn-glass-emphasis p-8 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms", animationFillMode: 'forwards' }}>
              <p className="stat-label mb-2">FY24 Revenue</p>
              <p className="stat-value">{annualReport.revenue}</p>
              <p className="text-sm text-muted-foreground mt-2">({annualReport.revenueComparison})</p>
            </div>

            {/* EBIT & Net Zero */}
            <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: 'forwards' }}>
              <p className="stat-label mb-1">EBIT Improvement</p>
              <p className="stat-value-accent text-3xl">{annualReport.ebitImprovement}</p>
              <p className="text-xs text-muted-foreground">(2024 YoY)</p>
            </div>
            <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "250ms", animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-2 mb-1">
                <Leaf className="w-4 h-4 text-primary" />
                <p className="stat-label !mb-0">Net Zero Target</p>
              </div>
              <p className="stat-value text-3xl">{annualReport.netZeroTarget}</p>
              <p className="text-xs text-muted-foreground">(Science-based)</p>
            </div>

            {/* Key Milestones */}
            <div className="col-span-2 glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <p className="text-sm font-semibold text-foreground">Key Milestones (Annual Report)</p>
              </div>
              <div className="space-y-2">
                {annualReport.keyMilestones.slice(0, 4).map((milestone, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground">{milestone}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Achievements */}
            <div className="col-span-2 glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "400ms", animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-accent" />
                <p className="text-sm font-semibold text-foreground">Strategic Achievements</p>
              </div>
              <div className="space-y-2">
                {annualReport.strategicAchievements.slice(0, 4).map((achievement, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom stakeholder card */}
            <div className="col-span-2 sn-glass p-5 flex items-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "500ms", animationFillMode: 'forwards' }}>
              <div className="sn-icon-box flex-shrink-0">
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
