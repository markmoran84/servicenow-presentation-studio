import { SectionHeader } from "@/components/SectionHeader";
import { Target, Clock, ArrowRight } from "lucide-react";

const workstreams = [
  {
    driver: "Elevate Customer Experience",
    color: "bg-sn-green",
    initiatives: [
      { name: "Establish CoE & Governance", phase: "now", benefit: "Reduced delivery risk" },
      { name: "CRM Platform Modernisation", phase: "now", benefit: "Unified customer view" },
      { name: "Omnichannel Foundation", phase: "next", benefit: "Seamless experience" },
      { name: "AI-Powered Self-Service", phase: "later", benefit: "Reduced cost-to-serve" },
    ],
  },
  {
    driver: "Lower Cost to Serve",
    color: "bg-sn-teal",
    initiatives: [
      { name: "Case Management Automation", phase: "now", benefit: "30% efficiency gain" },
      { name: "Workflow Standardisation", phase: "now", benefit: "Reduced complexity" },
      { name: "Knowledge Management", phase: "next", benefit: "Faster resolution" },
      { name: "Predictive Operations", phase: "later", benefit: "Proactive service" },
    ],
  },
  {
    driver: "Unlock Commercial Agility",
    color: "bg-sn-green",
    initiatives: [
      { name: "Sales & Service Integration", phase: "now", benefit: "Cross-sell enablement" },
      { name: "Lead-to-Agreement Automation", phase: "next", benefit: "Faster cycles" },
      { name: "Customer 360 Analytics", phase: "next", benefit: "Data-driven growth" },
      { name: "Revenue Intelligence", phase: "later", benefit: "Margin optimisation" },
    ],
  },
  {
    driver: "Embed AI as Core Capability",
    color: "bg-sn-teal",
    initiatives: [
      { name: "Now Assist Deployment", phase: "now", benefit: "Agent productivity" },
      { name: "Virtual Agent Expansion", phase: "next", benefit: "24/7 customer support" },
      { name: "Document Intelligence", phase: "next", benefit: "Automated processing" },
      { name: "Agentic AI Operations", phase: "later", benefit: "Autonomous workflows" },
    ],
  },
];

const phases = [
  { key: "now", label: "Q1-Q2 FY26", color: "bg-sn-green" },
  { key: "next", label: "Q3 FY26", color: "bg-sn-teal" },
  { key: "later", label: "Q4 FY26+", color: "bg-white/20" },
];

export const RoadmapSlide = () => {
  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="Delivery Roadmap" 
          description="Timeline to deliver results together"
        />

        {/* Timeline Header */}
        <div className="mt-6 mb-4">
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-3">
              <span className="text-xs text-muted-foreground">Drivers & Challenges</span>
            </div>
            <div className="col-span-9">
              <div className="flex items-center">
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xs font-semibold text-sn-green">Now</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-sn-green to-sn-teal" />
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xs font-semibold text-sn-teal">Next</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-sn-teal to-white/30" />
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">Later</span>
                  <div className="flex-1 h-px bg-white/20" />
                  <ArrowRight className="w-4 h-4 text-white/30" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workstreams */}
        <div className="space-y-3">
          {workstreams.map((ws, wsIndex) => (
            <div key={wsIndex} className="grid grid-cols-12 gap-2 items-stretch">
              {/* Driver Card */}
              <div className="col-span-3">
                <div className={`h-full ${ws.color} rounded-lg p-3 flex items-center`}>
                  <div>
                    <span className="text-sm font-bold text-sn-navy">{ws.driver}</span>
                  </div>
                </div>
              </div>

              {/* Initiative Cards */}
              <div className="col-span-9 grid grid-cols-4 gap-2">
                {ws.initiatives.map((initiative, initIndex) => {
                  const phaseColors = {
                    now: "border-sn-green bg-sn-green/10",
                    next: "border-sn-teal bg-sn-teal/10",
                    later: "border-white/30 bg-white/5",
                  };
                  return (
                    <div
                      key={initIndex}
                      className={`border rounded-lg p-2.5 ${phaseColors[initiative.phase as keyof typeof phaseColors]} hover:scale-[1.02] transition-transform`}
                    >
                      <h4 className="text-xs font-semibold text-foreground leading-tight">
                        {initiative.name}
                      </h4>
                      <p className="text-[10px] text-sn-green mt-1">→ {initiative.benefit}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Target Outcomes */}
        <div className="mt-6 grid grid-cols-4 gap-3">
          {[
            { label: "Customer Experience", target: "CSAT +15%" },
            { label: "Cost Efficiency", target: "TCO -25%" },
            { label: "Commercial Agility", target: "Cycle -40%" },
            { label: "AI Adoption", target: "80% Coverage" },
          ].map((outcome, index) => (
            <div
              key={index}
              className="bg-sn-navy/60 border border-sn-green/30 rounded-lg p-3 text-center"
            >
              <div className="text-xs text-muted-foreground">{outcome.label}</div>
              <div className="text-lg font-bold text-sn-green mt-1">{outcome.target}</div>
              <div className="text-[10px] text-muted-foreground">FY26 Target</div>
            </div>
          ))}
        </div>

        {/* Phase Legend */}
        <div className="mt-4 flex justify-center gap-6">
          {phases.map((phase, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${phase.color}`} />
              <span className="text-xs text-muted-foreground">{phase.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
