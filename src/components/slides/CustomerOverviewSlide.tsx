import { SectionHeader } from "@/components/SectionHeader";
import { Ship, Globe, TrendingUp, Target, Cpu, DollarSign } from "lucide-react";

const strategicPillars = [
  {
    icon: Ship,
    title: "Gemini Network",
    description: "Network reliability and schedule integrity as competitive differentiator",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Cpu,
    title: "AI-First Ambition",
    description: "AI is central to operations, customer experience, and decision-making",
    color: "from-primary to-sn-green",
  },
  {
    icon: DollarSign,
    title: "Cost Discipline & ROIC",
    description: "Rigorous cost management with focus on return on invested capital",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Globe,
    title: "Digital Transformation",
    description: "Standardisation and modernisation across technology landscape",
    color: "from-purple-500 to-pink-500",
  },
];

const keyPriorities = [
  {
    label: "All the Way",
    description: "End-to-end integrated logistics from factory to final destination",
  },
  {
    label: "Customer Centricity",
    description: "Commercial agility and superior customer experience",
  },
  {
    label: "Operational Excellence",
    description: "Standardised processes and technology backbone",
  },
];

export const CustomerOverviewSlide = () => {
  return (
    <div className="px-8 pt-6 pb-32">
      <h1 className="text-4xl font-bold text-foreground mb-6 opacity-0 animate-fade-in">
        Customer Overview & Strategy
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Left - Maersk Overview */}
        <div className="col-span-2">
          <div className="glass-card rounded-2xl p-6 h-full">
            <SectionHeader
              title="Maersk Strategic Direction"
              description="A.P. Møller - Maersk: Global integrator of container logistics"
              delay={100}
            />

            <div className="mt-6 grid grid-cols-2 gap-4">
              {strategicPillars.map((pillar, index) => (
                <div
                  key={pillar.title}
                  className="bg-card/50 rounded-xl p-4 border border-border/50 opacity-0 animate-fade-in hover:border-primary/30 transition-all duration-300"
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-3`}>
                    <pillar.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground">{pillar.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20 opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">FY25 Context</span>
              </div>
              <p className="text-sm text-muted-foreground">
                FY25 focused on stabilisation, trust rebuilding, and platform health. Over-customisation 
                constrained perceived value. CRM modernisation is the primary commercial wedge for FY26.
              </p>
            </div>
          </div>
        </div>

        {/* Right - Key Priorities */}
        <div>
          <div className="glass-card rounded-2xl p-6 h-full">
            <SectionHeader
              title="Enterprise Priorities"
              description="Operating context aligned to 'All the Way' framework"
              delay={150}
            />

            <div className="mt-6 space-y-4">
              {keyPriorities.map((priority, index) => (
                <div
                  key={priority.label}
                  className="p-4 bg-gradient-to-r from-sn-navy/50 to-transparent rounded-xl border-l-4 border-primary opacity-0 animate-fade-in"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <h4 className="font-semibold text-foreground mb-1">{priority.label}</h4>
                  <p className="text-sm text-muted-foreground">{priority.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-sn-green/10 rounded-xl border border-sn-green/30 opacity-0 animate-fade-in" style={{ animationDelay: "700ms" }}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-sn-green" />
                <span className="font-semibold text-foreground">ServiceNow Position</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Digital execution backbone — not a point solution. Platform to operationalise AI-first strategy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
