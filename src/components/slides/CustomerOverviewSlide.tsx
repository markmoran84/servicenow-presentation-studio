import { SectionHeader } from "@/components/SectionHeader";
import { Ship, Globe, TrendingUp, Target, Cpu, DollarSign, Zap, Users } from "lucide-react";

const strategicPillars = [
  {
    icon: DollarSign,
    title: "Reduce Structural Cost-to-Serve",
    description: "Eliminate operational friction and fragmented workflows",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Zap,
    title: "Improve Commercial Agility",
    description: "Faster execution across products and regions",
    color: "from-primary to-sn-green",
  },
  {
    icon: Globe,
    title: "Digitise & Standardise",
    description: "End-to-end process transformation at scale",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Cpu,
    title: "Scale AI & Data",
    description: "Power intelligent operations enterprise-wide",
    color: "from-blue-500 to-cyan-500",
  },
];

const coreValueDrivers = [
  {
    label: "Reduce Cost to Serve",
    description: "Eliminate operational friction, manual effort, and fragmented workflows",
  },
  {
    label: "Unlock Commercial Agility",
    description: "Faster lead-to-agreement cycles and responsive execution",
  },
  {
    label: "Elevate Customer Experience",
    description: "Connected, predictable, high-quality customer journeys",
  },
  {
    label: "Embed AI as Core Capability",
    description: "Operationalise AI across workflows at scale",
  },
];

export const CustomerOverviewSlide = () => {
  return (
    <div className="px-8 pt-6 pb-32">
      <h1 className="slide-title opacity-0 animate-fade-in">
        <span className="highlight">Customer Overview</span>
        <br />& Strategic Context
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Left - Maersk Strategic Direction */}
        <div className="col-span-2">
          <div className="glass-card rounded-2xl p-6 h-full">
            <SectionHeader
              title="Maersk Strategic Direction"
              description="Global integrator of container logistics — Ocean, Logistics & Services, and Terminals as one connected enterprise"
              delay={100}
            />

            <div className="mt-5 grid grid-cols-2 gap-3">
              {strategicPillars.map((pillar, index) => (
                <div
                  key={pillar.title}
                  className="bg-card/50 rounded-xl p-4 border border-border/50 opacity-0 animate-fade-in hover:border-primary/30 transition-all duration-300"
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-3`}>
                    <pillar.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{pillar.title}</h3>
                  <p className="text-xs text-muted-foreground">{pillar.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground text-sm">FY25 Reset</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Stabilising the partnership and restoring execution confidence. Platform health challenges 
                  addressed. Trust rebuilt as prerequisite to growth.
                </p>
              </div>

              <div className="p-4 bg-sn-green/10 rounded-xl border border-sn-green/30 opacity-0 animate-fade-in" style={{ animationDelay: "700ms" }}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-sn-green" />
                  <span className="font-semibold text-foreground text-sm">FY26 Intent</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shift from stabilisation to scaled value creation. ServiceNow as the digital backbone 
                  that operationalises AI across workflows.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Core Value Drivers */}
        <div>
          <div className="glass-card rounded-2xl p-6 h-full">
            <SectionHeader
              title="Core Value Drivers"
              description="Aligned directly to Maersk's strategic objectives"
              delay={150}
            />

            <div className="mt-5 space-y-3">
              {coreValueDrivers.map((driver, index) => (
                <div
                  key={driver.label}
                  className="p-3 bg-gradient-to-r from-sn-navy/50 to-transparent rounded-xl border-l-4 border-primary opacity-0 animate-fade-in"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <h4 className="font-semibold text-foreground text-sm mb-1">{driver.label}</h4>
                  <p className="text-xs text-muted-foreground">{driver.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 p-4 bg-sn-navy/30 rounded-xl border border-white/10 opacity-0 animate-fade-in" style={{ animationDelay: "800ms" }}>
              <div className="flex items-center gap-2 mb-2">
                <Ship className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground text-sm">ServiceNow Position</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Digital execution backbone — not a point solution. AI-led use cases with platform 
                capabilities as the execution layer for scale and control.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
