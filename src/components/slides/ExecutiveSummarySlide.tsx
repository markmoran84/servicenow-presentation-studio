import { useAccountData, StrategicPillar } from "@/context/AccountDataContext";
import { Anchor, Cpu, Users, Zap, LucideIcon } from "lucide-react";

const iconMap: Record<StrategicPillar["icon"], LucideIcon> = {
  network: Anchor,
  customer: Users,
  technology: Cpu,
  efficiency: Zap,
};

export const ExecutiveSummarySlide = () => {
  const { data } = useAccountData();
  const { basics, annualReport } = data;

  const companyName = basics.accountName.split(" ").pop()?.toUpperCase() || "PARTNER";
  const pillars = annualReport.strategicPillars || [];

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto h-full">
        {/* Header */}
        <div className="mb-10">
          <p className="text-muted-foreground text-lg mb-2">Delivering</p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="text-foreground">A </span>
            <span className="text-primary">BETTER</span>
            <span className="text-foreground"> {companyName}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Executing the Integrator Strategy with discipline, intelligence, and scale
          </p>
        </div>

        {/* Brand Concept */}
        <div className="glass-card p-6 mb-8 max-w-4xl">
          <p className="text-foreground/90 leading-relaxed">
            {annualReport.executiveSummaryNarrative}
          </p>
        </div>

        {/* Four Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, index) => {
            const IconComponent = iconMap[pillar.icon] || Anchor;
            return (
              <div 
                key={pillar.title}
                className="glass-card p-6 opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">
                    <span className="text-primary">{pillar.keyword}</span>
                    <span className="text-foreground ml-2">{pillar.title}</span>
                  </h3>
                </div>
                
                <p className="text-sm font-medium text-accent mb-3">{pillar.tagline}</p>
                
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {pillar.description}
                </p>
                
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Outcome focus:</span> {pillar.outcome}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
