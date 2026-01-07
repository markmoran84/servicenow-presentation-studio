import { SectionHeader } from "@/components/SectionHeader";
import { Target, Calendar, Users, DollarSign, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

const opportunities = [
  {
    name: "CRM Platform Modernisation",
    value: "$2.4M",
    stage: "Proposal",
    closeDate: "Q1 FY26",
    probability: 75,
    status: "on-track",
    nextSteps: ["Executive sponsor alignment", "Technical validation complete", "Commercial terms review"],
  },
  {
    name: "Customer Service Management Expansion",
    value: "$1.8M",
    stage: "Negotiation",
    closeDate: "Q1 FY26",
    probability: 85,
    status: "on-track",
    nextSteps: ["Legal review in progress", "Implementation timeline agreed", "SOW finalisation"],
  },
  {
    name: "Now Assist / AI Implementation",
    value: "$950K",
    stage: "Qualification",
    closeDate: "Q2 FY26",
    probability: 60,
    status: "at-risk",
    nextSteps: ["AI governance approval needed", "Proof of value planning", "Budget confirmation"],
  },
  {
    name: "Platform Analytics & Intelligence",
    value: "$650K",
    stage: "Discovery",
    closeDate: "Q3 FY26",
    probability: 40,
    status: "early",
    nextSteps: ["Business case development", "Stakeholder mapping", "Requirements gathering"],
  },
];

const keyMilestones = [
  { date: "Jan 15", event: "CRM Technical Design Approval", status: "complete" },
  { date: "Feb 1", event: "Executive Business Review", status: "upcoming" },
  { date: "Feb 15", event: "Commercial Terms Agreement", status: "upcoming" },
  { date: "Mar 1", event: "Contract Signature Target", status: "target" },
  { date: "Mar 15", event: "Implementation Kickoff", status: "target" },
];

const powerMap = [
  { role: "CIO", name: "Digital Transformation Lead", stance: "Champion", influence: "high" },
  { role: "CFO", name: "Finance & Operations", stance: "Supporter", influence: "high" },
  { role: "VP Customer Service", name: "Customer Operations", stance: "Champion", influence: "medium" },
  { role: "Procurement Lead", name: "Strategic Sourcing", stance: "Neutral", influence: "medium" },
  { role: "IT Director", name: "Platform Architecture", stance: "Supporter", influence: "medium" },
];

export const ClosePlanSlide = () => {
  const totalPipeline = opportunities.reduce((sum, opp) => {
    const value = parseFloat(opp.value.replace(/[$MK]/g, ""));
    const multiplier = opp.value.includes("M") ? 1000000 : opp.value.includes("K") ? 1000 : 1;
    return sum + (value * multiplier * opp.probability / 100);
  }, 0);

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="Close Plan FY26" 
          description="Opportunity pipeline and execution milestones"
        />

        <div className="grid grid-cols-12 gap-4 mt-6">
          {/* Pipeline Summary */}
          <div className="col-span-8">
            <h3 className="text-xs font-semibold text-sn-green mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Active Opportunities
            </h3>
            <div className="space-y-2">
              {opportunities.map((opp, index) => {
                const statusColors = {
                  "on-track": "border-sn-green bg-sn-green/10",
                  "at-risk": "border-yellow-500 bg-yellow-500/10",
                  "early": "border-white/30 bg-white/5",
                };
                const statusIcons = {
                  "on-track": <CheckCircle2 className="w-4 h-4 text-sn-green" />,
                  "at-risk": <AlertTriangle className="w-4 h-4 text-yellow-500" />,
                  "early": <Clock className="w-4 h-4 text-white/50" />,
                };
                return (
                  <div
                    key={index}
                    className={`border rounded-lg p-3 ${statusColors[opp.status as keyof typeof statusColors]} hover:scale-[1.01] transition-transform`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {statusIcons[opp.status as keyof typeof statusIcons]}
                          <h4 className="text-sm font-semibold text-foreground">{opp.name}</h4>
                        </div>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Stage: <span className="text-sn-teal">{opp.stage}</span></span>
                          <span>Close: <span className="text-foreground">{opp.closeDate}</span></span>
                          <span>Prob: <span className="text-sn-green">{opp.probability}%</span></span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-sn-green">{opp.value}</div>
                        <div className="text-[10px] text-muted-foreground">TCV</div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <div className="text-[10px] text-muted-foreground mb-1">Next Steps:</div>
                      <div className="flex flex-wrap gap-1">
                        {opp.nextSteps.map((step, stepIndex) => (
                          <span key={stepIndex} className="text-[10px] bg-white/10 rounded px-1.5 py-0.5">
                            {step}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Pipeline Total */}
            <div className="mt-3 bg-sn-navy/60 border border-sn-green/30 rounded-lg p-3 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Weighted Pipeline Value</span>
              <span className="text-xl font-bold text-sn-green">${(totalPipeline / 1000000).toFixed(2)}M</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-4 space-y-4">
            {/* Key Milestones */}
            <div>
              <h3 className="text-xs font-semibold text-sn-teal mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Key Milestones
              </h3>
              <div className="space-y-2">
                {keyMilestones.map((milestone, index) => {
                  const statusStyles = {
                    complete: "bg-sn-green text-sn-navy",
                    upcoming: "bg-sn-teal text-sn-navy",
                    target: "bg-white/20 text-foreground",
                  };
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`text-[10px] font-semibold px-2 py-1 rounded ${statusStyles[milestone.status as keyof typeof statusStyles]}`}>
                        {milestone.date}
                      </div>
                      <span className="text-xs text-foreground">{milestone.event}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Power Map */}
            <div>
              <h3 className="text-xs font-semibold text-sn-green mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" /> Stakeholder Power Map
              </h3>
              <div className="space-y-2">
                {powerMap.map((person, index) => {
                  const stanceColors = {
                    Champion: "text-sn-green",
                    Supporter: "text-sn-teal",
                    Neutral: "text-yellow-500",
                    Blocker: "text-red-500",
                  };
                  return (
                    <div key={index} className="bg-white/5 rounded-lg p-2 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-foreground">{person.role}</div>
                          <div className="text-[10px] text-muted-foreground">{person.name}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs font-semibold ${stanceColors[person.stance as keyof typeof stanceColors]}`}>
                            {person.stance}
                          </div>
                          <div className="text-[10px] text-muted-foreground capitalize">{person.influence} influence</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
