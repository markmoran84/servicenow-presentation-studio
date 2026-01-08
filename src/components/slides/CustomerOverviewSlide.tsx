import { SectionHeader } from "@/components/SectionHeader";
import { Ship, Globe, TrendingUp, Target, Cpu, DollarSign, Zap, AlertTriangle, CheckCircle } from "lucide-react";

const strategicPillars = [
  {
    icon: Ship,
    title: "Global Integrator",
    description: "Operating Ocean, Logistics & Services, and Terminals as one connected enterprise",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Cpu,
    title: "AI & Data-Led Transformation",
    description: "Scale AI and data to power intelligent operations and execution quality at scale",
    color: "from-primary to-sn-green",
  },
  {
    icon: DollarSign,
    title: "Cost Discipline & ROIC",
    description: "Reduce structural cost-to-serve while maintaining strong margins during transformation",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Globe,
    title: "Commercial Agility",
    description: "Digitise and standardise end-to-end processes to improve responsiveness across regions",
    color: "from-purple-500 to-pink-500",
  },
];

const coreValueDrivers = [
  {
    icon: DollarSign,
    title: "Reduce Cost to Serve",
    description: "Eliminate operational friction, manual effort, and fragmented workflows",
    color: "text-amber-400",
  },
  {
    icon: Zap,
    title: "Unlock Commercial Agility",
    description: "Faster lead-to-agreement cycles, improved cross-sell and upsell execution",
    color: "text-primary",
  },
  {
    icon: TrendingUp,
    title: "Elevate Customer Experience",
    description: "Connected, predictable, high-quality customer journeys across channels",
    color: "text-sn-green",
  },
  {
    icon: Cpu,
    title: "Embed AI as Core Capability",
    description: "Operationalise AI across workflows to augment decision-making at scale",
    color: "text-purple-400",
  },
];

export const CustomerOverviewSlide = () => {
  return (
    <div className="px-8 pt-6 pb-32">
      <h1 className="text-4xl font-bold text-foreground mb-6 opacity-0 animate-fade-in">
        Customer Overview & Strategic Context
      </h1>

      <div className="grid grid-cols-12 gap-5">
        {/* Left - Maersk Strategic Direction */}
        <div className="col-span-7">
          <div className="glass-card rounded-2xl p-5 h-full">
            <SectionHeader
              title="Maersk Strategic Direction"
              description="Global integrator of container logistics — Ocean, Logistics & Services, Terminals as one enterprise"
              delay={100}
            />

            <div className="mt-4 grid grid-cols-2 gap-3">
              {strategicPillars.map((pillar, index) => (
                <div
                  key={pillar.title}
                  className="bg-card/50 rounded-xl p-3 border border-border/50 opacity-0 animate-fade-in hover:border-primary/30 transition-all duration-300"
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-2`}>
                    <pillar.icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{pillar.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>

            {/* FY25 Reset Context */}
            <div className="mt-4 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-foreground text-sm">FY25 Reset Context</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                FY25 was deliberately focused on stabilising the partnership and restoring execution confidence. 
                Platform health challenges driven by over-customisation had constrained perceived value. 
                This reset enabled return to strategic conversations aligned with Maersk's enterprise agenda.
              </p>
            </div>
          </div>
        </div>

        {/* Right - Core Value Drivers & Strategic Intent */}
        <div className="col-span-5 space-y-4">
          {/* Core Value Drivers */}
          <div className="glass-card rounded-2xl p-5">
            <SectionHeader
              title="FY26 Core Value Drivers"
              description="Directly mapped to Maersk strategic objectives"
              delay={150}
            />

            <div className="mt-4 space-y-2">
              {coreValueDrivers.map((driver, index) => (
                <div
                  key={driver.title}
                  className="flex items-start gap-3 p-3 bg-card/50 rounded-lg border border-border/50 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${300 + index * 80}ms` }}
                >
                  <driver.icon className={`w-4 h-4 ${driver.color} mt-0.5 flex-shrink-0`} />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{driver.title}</h4>
                    <p className="text-xs text-muted-foreground">{driver.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Intent */}
          <div className="p-4 bg-gradient-to-br from-primary/20 to-sn-green/10 rounded-xl border border-primary/30 opacity-0 animate-fade-in" style={{ animationDelay: "700ms" }}>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="font-semibold text-foreground text-sm">FY26 Strategic Intent</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Shift from stabilisation to <span className="text-primary font-medium">scaled value creation</span>. 
              ServiceNow positioned as the digital backbone that operationalises AI across customer, commercial, and operational workflows.
            </p>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle className="w-3 h-3 text-sn-green" />
              <span className="text-sn-green font-medium">AI-led use cases and automation at the core</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
