import { useAccountData } from "@/context/AccountDataContext";
import { Anchor, Cpu, Target, Leaf, Shield, Users, TrendingUp, CheckCircle2, Calendar } from "lucide-react";

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
                A STRONGER<br />{basics.accountName.split(" ").pop()?.toUpperCase() || "PARTNER"}
              </h1>
            </div>

            <p className="text-lg text-foreground/90 leading-relaxed">
              {annualReport.executiveSummaryNarrative}
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

          {/* Right Column - Annual Report Highlights */}
          <div className="grid grid-cols-2 gap-4">
            {/* Revenue */}
            <div className="col-span-2 glass-card p-8 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <p className="text-sm text-muted-foreground mb-2">FY24 Revenue</p>
              <p className="text-5xl font-bold text-primary">{annualReport.revenue}</p>
              <p className="text-sm text-muted-foreground mt-2">({annualReport.revenueComparison})</p>
            </div>

            {/* EBIT & Net Zero */}
            <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <p className="text-sm text-muted-foreground mb-1">EBIT Improvement</p>
              <p className="text-3xl font-bold text-accent">{annualReport.ebitImprovement}</p>
              <p className="text-xs text-muted-foreground">(2024 YoY)</p>
            </div>
            <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "250ms" }}>
              <div className="flex items-center gap-2 mb-1">
                <Leaf className="w-4 h-4 text-sn-green" />
                <p className="text-sm text-muted-foreground">Net Zero Target</p>
              </div>
              <p className="text-3xl font-bold text-primary">{annualReport.netZeroTarget}</p>
              <p className="text-xs text-muted-foreground">(Science-based)</p>
            </div>

            {/* Key Milestones */}
            <div className="col-span-2 glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <p className="text-sm font-semibold text-foreground">Key Milestones (Annual Report)</p>
              </div>
              <div className="space-y-2">
                {annualReport.keyMilestones.slice(0, 4).map((milestone, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sn-green flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground">{milestone}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Achievements */}
            <div className="col-span-2 glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
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
            <div className="col-span-2 glass-card p-6 flex items-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "500ms" }}>
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