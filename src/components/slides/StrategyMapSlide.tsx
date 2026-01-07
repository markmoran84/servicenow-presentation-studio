import { SectionHeader } from "@/components/SectionHeader";
import { Target, Users, TrendingDown, Zap, Brain, ArrowRight } from "lucide-react";

const valueDrivers = [
  { icon: Users, label: "Elevate Customer Experience", color: "bg-sn-green" },
  { icon: TrendingDown, label: "Lower Cost to Serve", color: "bg-sn-teal" },
  { icon: Zap, label: "Unlock Commercial Agility", color: "bg-sn-green" },
  { icon: Brain, label: "Embed AI as Core Capability", color: "bg-sn-teal" },
];

const transformationObjectives = [
  {
    title: "Seamless Omni-Channel Customer Experience",
    description: "Deliver digital-first omni-channel experience across all touchpoints to strengthen loyalty",
  },
  {
    title: "Modernised Case Management & Agent Productivity",
    description: "Transform case management with automation, intelligent routing, and unified workspaces",
  },
  {
    title: "Increased Operational Efficiency through Automation",
    description: "Automate service and logistics workflows to streamline operations and reduce manual effort",
  },
  {
    title: "Simplified CRM Landscape and Increased Agility",
    description: "Reduce redundant applications, modernise legacy systems, and lower TCO",
  },
  {
    title: "Data-Driven Decision Making & Operational Intelligence",
    description: "Unify data and analytics to provide real-time insights and actionable intelligence",
  },
  {
    title: "Agentic Operating Fabric",
    description: "Deploy AI agents across service, logistics, and customer workflows to accelerate outcomes",
  },
];

const executionTracks = [
  {
    title: "Simplified & Optimised Foundation",
    capabilities: ["Operating Model & Governance", "SN University Training", "Center of Excellence"],
  },
  {
    title: "Connected & Scalable Enterprise",
    capabilities: ["Workflow Data Fabric", "Platform Analytics", "RaptorDB Pro"],
  },
  {
    title: "Platform for Customer Transformation",
    capabilities: ["Multilingual CSM Pro", "Omnichannel Engagement", "Knowledge Management"],
  },
  {
    title: "AI Agentic Ops",
    capabilities: ["Document Intelligence", "Now Assist / Virtual Agent", "AI Control Tower"],
  },
];

export const StrategyMapSlide = () => {
  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="Transformation Blueprint" 
          description="Strategic alignment from Maersk priorities to ServiceNow execution"
        />
        
        <div className="grid grid-cols-12 gap-4 mt-6">
          {/* Core Value Drivers */}
          <div className="col-span-2 space-y-3">
            <h3 className="text-xs font-semibold text-sn-green mb-3">Core Value Drivers</h3>
            {valueDrivers.map((driver, index) => (
              <div
                key={index}
                className="bg-sn-navy/60 border border-sn-green/30 rounded-lg p-3 hover:border-sn-green/60 transition-all"
              >
                <div className="flex items-center gap-2">
                  <div className={`${driver.color} p-1.5 rounded`}>
                    <driver.icon className="w-3.5 h-3.5 text-sn-navy" />
                  </div>
                  <span className="text-xs font-medium text-foreground">{driver.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Transformation Objectives */}
          <div className="col-span-5">
            <h3 className="text-xs font-semibold text-sn-green mb-3">Transformation Objectives</h3>
            <div className="space-y-2">
              {transformationObjectives.map((objective, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all group"
                >
                  <h4 className="text-sm font-semibold text-sn-green group-hover:text-sn-lime transition-colors">
                    {objective.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">{objective.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Connection Arrow */}
          <div className="col-span-1 flex items-center justify-center">
            <div className="h-full w-px bg-gradient-to-b from-transparent via-sn-green/50 to-transparent relative">
              <ArrowRight className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-sn-green" />
            </div>
          </div>

          {/* Execution Tracks */}
          <div className="col-span-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-semibold text-sn-teal">Execution Tracks</h3>
              <h3 className="text-xs font-semibold text-sn-green">Capabilities</h3>
            </div>
            <div className="space-y-3">
              {executionTracks.map((track, index) => (
                <div
                  key={index}
                  className="bg-sn-navy/40 border border-sn-teal/30 rounded-lg p-3 hover:border-sn-teal/60 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-sn-teal">{track.title}</h4>
                      <div className="flex gap-1 mt-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-5 h-5 rounded-full border border-sn-green/40 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-sn-green/60" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      {track.capabilities.map((cap, capIndex) => (
                        <div
                          key={capIndex}
                          className="text-xs text-right text-muted-foreground bg-white/5 rounded px-2 py-0.5"
                        >
                          {cap}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Legend */}
        <div className="mt-6 flex justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-sn-green" />
            <span className="text-xs text-muted-foreground">Maersk Priority Aligned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-sn-teal" />
            <span className="text-xs text-muted-foreground">ServiceNow Enablement</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border border-white/30" />
            <span className="text-xs text-muted-foreground">FY26 Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};
