import { useAccountData } from "@/context/AccountDataContext";
import { Zap, Users, DollarSign, Cpu, ArrowRight, Sparkles, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  dollarsign: DollarSign,
  zap: Zap,
  users: Users,
  cpu: Cpu,
};

const defaultValueDrivers = [
  {
    icon: DollarSign,
    title: "Reduce Cost-to-Serve",
    description: "Platform consolidation and workflow automation eliminate redundant systems and manual processes",
    outcomes: [
      "30% reduction in manual case handling",
      "Tool consolidation savings",
      "Operational efficiency gains",
    ],
    alignment: "Cost Discipline",
    color: "primary",
  },
  {
    icon: Zap,
    title: "Unlock Commercial Agility",
    description: "Unified CRM enables faster quote-to-cash and improved pipeline visibility",
    outcomes: [
      "50% faster quote generation",
      "Real-time pipeline analytics",
      "Cross-sell opportunity identification",
    ],
    alignment: "Customer Centricity",
    color: "accent",
  },
  {
    icon: Users,
    title: "Elevate Customer Experience",
    description: "AI-augmented service delivery with predictive routing and proactive engagement",
    outcomes: [
      "15pt CSAT improvement",
      "Reduced resolution time",
      "Proactive issue prevention",
    ],
    alignment: "All the Way",
    color: "primary",
  },
  {
    icon: Cpu,
    title: "Embed AI as Core Capability",
    description: "Workflow platform as the operationalisation layer for enterprise AI",
    outcomes: [
      "AI use cases in production",
      "Governance and control",
      "Scalable AI infrastructure",
    ],
    alignment: "AI-First Operations",
    color: "accent",
  },
];

export const CoreValueDriversSlide = () => {
  const { data } = useAccountData();
  const { generatedPlan } = data;

  // Use AI-generated value drivers if available
  const isAIGenerated = !!generatedPlan?.coreValueDrivers;
  const valueDrivers = generatedPlan?.coreValueDrivers?.map((driver, idx) => ({
    icon: idx === 0 ? DollarSign : idx === 1 ? Zap : idx === 2 ? Users : Cpu,
    title: driver.title,
    description: driver.description,
    outcomes: driver.outcomes || [],
    alignment: driver.alignment,
    color: idx % 2 === 0 ? "primary" : "accent",
  })) || defaultValueDrivers;

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Core Value Drivers</h1>
            <p className="text-muted-foreground text-lg">Four pillars of strategic value creation</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
            <div className="pill-badge">
              Slide 11
            </div>
          </div>
        </div>

        {/* Value Drivers Grid */}
        <div className="grid grid-cols-2 gap-6">
          {valueDrivers.map((driver, index) => (
            <div 
              key={driver.title}
              className="glass-card p-6 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  driver.color === 'accent' ? 'bg-accent/20' : 'bg-primary/20'
                }`}>
                  <driver.icon className={`w-7 h-7 ${
                    driver.color === 'accent' ? 'text-accent' : 'text-primary'
                  }`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{driver.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    driver.color === 'accent' 
                      ? 'bg-accent/10 text-accent' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {driver.alignment}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4">{driver.description}</p>

              {/* Outcomes */}
              <div className="space-y-2">
                {driver.outcomes.map((outcome, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30"
                  >
                    <ArrowRight className={`w-4 h-4 ${
                      driver.color === 'accent' ? 'text-accent' : 'text-primary'
                    }`} />
                    <span className="text-sm text-foreground/90">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Value Interconnection */}
        <div className="mt-8 glass-card p-6 opacity-0 animate-fade-in animation-delay-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Cost Efficiency</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-sm text-muted-foreground">Commercial Agility</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">CX Excellence</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-sm text-muted-foreground">AI at Scale</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">Flywheel Effect</p>
              <p className="text-xs text-muted-foreground">Each driver reinforces the others</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
