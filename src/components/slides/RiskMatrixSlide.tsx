import { SectionHeader } from "@/components/SectionHeader";
import { Shield, TrendingUp, Settings, DollarSign } from "lucide-react";

const quadrants = [
  {
    title: "Strategic",
    icon: TrendingUp,
    color: "text-sn-green",
    bgColor: "bg-sn-green/10",
    borderColor: "border-sn-green/30",
    description: "Value drivers associated with current and future account plans and strategies",
    items: [
      { id: 1, title: "Align and Elevate", desc: "Mobilise P5 to engage Maersk leaders to secure buy-in and align ServiceNow initiatives with Maersk's integrated logistics strategy" },
      { id: 2, title: "Make the Case for Salesforce Takeout", desc: "Present compelling business case to replace Salesforce and streamline lead-to-cash workflows, cutting costs by up to 30%" },
      { id: 3, title: "Automate to Optimise Logistics", desc: "Target high-value use cases in logistics and fulfilment for automation such as freight booking and claims management" },
      { id: 4, title: "Rebuild Stakeholder Trust", desc: "Deliver measurable outcomes through ongoing engagement, transparent reporting, and consistent progress updates" },
    ],
  },
  {
    title: "Operational",
    icon: Settings,
    color: "text-sn-teal",
    bgColor: "bg-sn-teal/10",
    borderColor: "border-sn-teal/30",
    description: "Value drivers associated with business activities and operations, procedures, people and systems",
    items: [
      { id: 7, title: "Stabilise Platform Health", desc: "Launch platform stabilisation initiative to address reliability issues and enhance performance" },
      { id: 8, title: "Reduce Customisation", desc: "Transition to native, out-of-the-box capabilities to minimise technical debt and enable scalability" },
      { id: 9, title: "Resource Where It Matters", desc: "Support Maersk teams with ServiceNow and partner expertise to accelerate delivery" },
      { id: 10, title: "Bridge the Skills Gap", desc: "Empower Maersk teams through enablement and access to ServiceNow expertise" },
    ],
  },
  {
    title: "Governance",
    icon: Shield,
    color: "text-sn-lime",
    bgColor: "bg-sn-lime/10",
    borderColor: "border-sn-lime/30",
    description: "Value drivers associated with governance structures and decision-making",
    items: [
      { id: 5, title: "Create a Centre of Excellence", desc: "Establish a governance hub to streamline decision-making, define roles, and scale key initiatives across Maersk" },
      { id: 6, title: "Operationalise Best Practices", desc: "Standardise platform governance and conduct reviews to ensure operational alignment and efficiency" },
    ],
  },
  {
    title: "Commercial",
    icon: DollarSign,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/30",
    description: "Value drivers associated with commercial execution, budget constraints, and contract misalignment",
    items: [
      { id: 11, title: "Prove ROI", desc: "Deliver ROI insights through quarterly reviews to build confidence in future investments" },
      { id: 12, title: "Fast Track Funding Approval", desc: "Build compelling business cases and POVs with clear ROI metrics to accelerate decision-making" },
      { id: 13, title: "Reallocate Budgets", desc: "Guide Maersk in reallocating budgets toward high-impact initiatives aligned with strategic priorities" },
    ],
  },
];

export const RiskMatrixSlide = () => {
  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="Navigating Risks" 
          description="Impact mapping of key initiatives to prioritise transformation efforts"
        />

        <div className="mt-6 grid grid-cols-12 gap-4">
          {/* Left Column - Strategic & Governance */}
          <div className="col-span-4 space-y-4">
            {[quadrants[0], quadrants[2]].map((quadrant, qIndex) => (
              <div key={qIndex} className={`${quadrant.bgColor} border ${quadrant.borderColor} rounded-xl p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <quadrant.icon className={`w-5 h-5 ${quadrant.color}`} />
                  <h3 className={`text-lg font-bold ${quadrant.color}`}>{quadrant.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{quadrant.description}</p>
                <div className="space-y-2">
                  {quadrant.items.map((item) => (
                    <div key={item.id} className="bg-sn-navy/40 rounded-lg p-2.5 border border-white/10 hover:border-white/20 transition-all">
                      <div className="flex items-start gap-2">
                        <div className={`w-5 h-5 rounded-full ${quadrant.bgColor} border ${quadrant.borderColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <span className={`text-[10px] font-bold ${quadrant.color}`}>{item.id}</span>
                        </div>
                        <div>
                          <h4 className={`text-xs font-semibold ${quadrant.color}`}>{item.title}</h4>
                          <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Center - Impact Map Visualization */}
          <div className="col-span-4 flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[280px]">
              {/* Concentric circles */}
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <div className="absolute inset-[15%] rounded-full border border-white/15" />
              <div className="absolute inset-[30%] rounded-full border border-white/20" />
              <div className="absolute inset-[45%] rounded-full border border-sn-green/30 bg-sn-green/5" />
              
              {/* Center label */}
              <div className="absolute inset-[45%] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[10px] font-semibold text-sn-green">Strategic</div>
                  <div className="text-[10px] text-muted-foreground">Priority</div>
                </div>
              </div>

              {/* Quadrant Labels */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-sn-teal font-semibold">Operational</div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-sn-lime font-semibold">Governance</div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-sn-green font-semibold writing-vertical">Strategic</div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-yellow-400 font-semibold writing-vertical">Commercial</div>

              {/* Initiative dots */}
              {[
                { id: 1, top: "38%", left: "25%" },
                { id: 2, top: "48%", left: "32%" },
                { id: 3, top: "55%", left: "28%" },
                { id: 4, top: "45%", left: "20%" },
                { id: 5, top: "68%", left: "42%" },
                { id: 6, top: "75%", left: "55%" },
                { id: 7, top: "28%", left: "58%" },
                { id: 8, top: "35%", left: "68%" },
                { id: 9, top: "42%", left: "62%" },
                { id: 10, top: "32%", left: "72%" },
                { id: 11, top: "58%", left: "72%" },
                { id: 12, top: "65%", left: "78%" },
                { id: 13, top: "72%", left: "68%" },
              ].map((dot) => (
                <div
                  key={dot.id}
                  className="absolute w-5 h-5 rounded-full bg-sn-green/80 border-2 border-sn-green flex items-center justify-center cursor-pointer hover:scale-125 transition-transform"
                  style={{ top: dot.top, left: dot.left }}
                >
                  <span className="text-[9px] font-bold text-sn-navy">{dot.id}</span>
                </div>
              ))}

              {/* Enabler labels */}
              <div className="absolute top-[15%] right-[15%] text-[9px] text-muted-foreground">Enabler</div>
              <div className="absolute bottom-[15%] left-[15%] text-[9px] text-muted-foreground">Enabler</div>
            </div>
          </div>

          {/* Right Column - Operational & Commercial */}
          <div className="col-span-4 space-y-4">
            {[quadrants[1], quadrants[3]].map((quadrant, qIndex) => (
              <div key={qIndex} className={`${quadrant.bgColor} border ${quadrant.borderColor} rounded-xl p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <quadrant.icon className={`w-5 h-5 ${quadrant.color}`} />
                  <h3 className={`text-lg font-bold ${quadrant.color}`}>{quadrant.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{quadrant.description}</p>
                <div className="space-y-2">
                  {quadrant.items.map((item) => (
                    <div key={item.id} className="bg-sn-navy/40 rounded-lg p-2.5 border border-white/10 hover:border-white/20 transition-all">
                      <div className="flex items-start gap-2">
                        <div className={`w-5 h-5 rounded-full ${quadrant.bgColor} border ${quadrant.borderColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <span className={`text-[10px] font-bold ${quadrant.color}`}>{item.id}</span>
                        </div>
                        <div>
                          <h4 className={`text-xs font-semibold ${quadrant.color}`}>{item.title}</h4>
                          <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
