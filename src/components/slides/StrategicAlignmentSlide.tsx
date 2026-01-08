import { SectionHeader } from "@/components/SectionHeader";
import { Ship, Globe, Leaf, TrendingUp, Cpu, Package, Target } from "lucide-react";

const allTheWayPillars = [
  {
    icon: Ship,
    title: "Gemini Network",
    description: "93% schedule reliability through the Maersk-Hapag Lloyd Gemini Cooperation — network performance as competitive differentiator",
    metric: "93%",
    metricLabel: "Reliability",
    color: "primary",
  },
  {
    icon: Package,
    title: "Integrated Logistics",
    description: "End-to-end supply chain from factory to final destination — Ocean, Warehousing, Air, First Mile combined",
    metric: "$14.9B",
    metricLabel: "L&S Revenue",
    color: "accent",
  },
  {
    icon: Leaf,
    title: "Net Zero 2040",
    description: "Decarbonisation leadership with green methanol vessels and 65%+ GHG reduction fuels commitment",
    metric: "2040",
    metricLabel: "Net Zero Target",
    color: "primary",
  },
  {
    icon: Cpu,
    title: "Digital Resilience",
    description: "Technology backbone for supply chain visibility, predictive analytics, and automated decision-making",
    metric: "130+",
    metricLabel: "Countries",
    color: "accent",
  },
];

const strategicImperatives = [
  {
    label: "Cost Discipline",
    description: "Rigorous management driving 65% EBIT growth — every investment must demonstrate clear ROI",
  },
  {
    label: "Customer Centricity",
    description: "Record-high customer satisfaction scores — commercial agility and service excellence",
  },
  {
    label: "Operational Excellence",
    description: "Productivity gains and cost stability despite Red Sea disruption and Cape routing",
  },
];

export const StrategicAlignmentSlide = () => {
  return (
    <div className="px-8 pt-6 pb-32">
      <div className="flex items-center gap-3 mb-6 opacity-0 animate-fade-in">
        <Target className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-bold text-foreground">
          Maersk Strategic Alignment
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content - All the Way Framework */}
        <div className="col-span-2">
          <div className="glass-card p-6">
            <SectionHeader
              title="'All the Way' Framework"
              description="Maersk's integrated logistics strategy connecting every link of the supply chain"
              delay={100}
            />

            <div className="mt-6 grid grid-cols-2 gap-4">
              {allTheWayPillars.map((pillar, index) => (
                <div
                  key={pillar.title}
                  className="data-grid-item opacity-0 animate-fade-in group hover:border-primary/30 transition-all"
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`icon-container${pillar.color === 'accent' ? '-accent' : ''} w-10 h-10`}>
                      <pillar.icon className={`w-5 h-5 ${pillar.color === 'accent' ? 'text-accent' : 'text-primary'}`} />
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${pillar.color === 'accent' ? 'text-gradient-accent' : 'text-gradient'}`}>
                        {pillar.metric}
                      </div>
                      <div className="text-xs text-muted-foreground">{pillar.metricLabel}</div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>

            {/* FY24 Context */}
            <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20 opacity-0 animate-fade-in animation-delay-600">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">FY2024 Performance Context</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Third-strongest financial year in Maersk history. Revenue of $55.5B (+9%), EBIT of $6.5B (+65%). 
                Growth across all three segments: Ocean, Logistics & Services, and Terminals. Red Sea disruption 
                managed through operational excellence and Cape routing without significant cost increases.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar - Strategic Imperatives */}
        <div>
          <div className="glass-card p-6 h-full">
            <SectionHeader
              title="Strategic Imperatives"
              description="Enterprise priorities shaping technology investment"
              delay={150}
            />

            <div className="mt-6 space-y-4">
              {strategicImperatives.map((imperative, index) => (
                <div
                  key={imperative.label}
                  className="p-4 rounded-xl bg-secondary/50 border-l-4 border-primary opacity-0 animate-fade-in"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <h4 className="font-semibold text-foreground mb-1">{imperative.label}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{imperative.description}</p>
                </div>
              ))}
            </div>

            {/* ServiceNow Position */}
            <div className="mt-6 p-4 rounded-xl bg-accent/5 border border-accent/20 opacity-0 animate-fade-in animation-delay-700">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-accent" />
                <span className="font-semibold text-foreground">ServiceNow Position</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Digital execution backbone — not a point solution. The platform to operationalise 
                Maersk's AI-first strategy and unify workflows across the enterprise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
