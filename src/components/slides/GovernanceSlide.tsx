import { SectionHeader } from "@/components/SectionHeader";
import { Users, Calendar, BarChart3, Shield, ArrowRight, Target, Briefcase, CheckCircle } from "lucide-react";

const executiveTiers = [
  {
    tier: "1",
    title: "Executive Sponsorship & Strategic Alignment",
    cadence: "Annual / As Required",
    objective: "Direction, ambition, and commitment",
    forums: ["Top-to-Top Executive Sessions", "Executive Briefings (EBC)"],
    focusAreas: ["Enterprise strategy alignment", "AI-first operating ambition", "Commercial partnership direction"],
    outcome: "Clear strategic intent. Executive sponsorship for must-win battles.",
    color: "from-primary to-sn-green",
  },
  {
    tier: "2",
    title: "Executive Committee & Enterprise Steering",
    cadence: "Quarterly",
    objective: "Strategy execution oversight",
    forums: ["Executive Steering Committee"],
    focusAreas: ["Progress against strategic priorities", "Risk, dependency, decision management", "Value realisation tracking"],
    outcome: "Decisions unblocked. Scope and priority alignment.",
    color: "from-purple-500 to-pink-500",
  },
  {
    tier: "3",
    title: "Relationship & Programme Management",
    cadence: "Monthly / Bi-weekly",
    objective: "Operational momentum",
    forums: ["Account Governance Reviews", "Programme Reviews"],
    focusAreas: ["Initiative execution", "Adoption and platform health", "Escalation management"],
    outcome: "Predictable execution. Early risk mitigation.",
    color: "from-amber-500 to-orange-500",
  },
  {
    tier: "4",
    title: "Commercial & Delivery Execution",
    cadence: "As Required",
    objective: "Commercial closure and delivery",
    forums: ["Commercial reviews", "Project execution syncs"],
    focusAreas: ["Deal execution", "Contractual milestones", "Delivery outcomes"],
    outcome: "Deals closed. Value delivered. Trust reinforced.",
    color: "from-cyan-500 to-blue-500",
  },
];

const executiveClosePlan = [
  {
    phase: "Phase 1",
    timing: "Now → Feb",
    title: "Alignment & Framing",
    activities: ["Confirm Maersk FY26 priorities", "Align on Must-Win Battles", "Shape EBC agenda"],
  },
  {
    phase: "Phase 2",
    timing: "March",
    title: "EBC Santa Clara",
    activities: ["Reinforce digital backbone positioning", "Demonstrate AI-led use cases", "Secure executive sponsorship"],
  },
  {
    phase: "Phase 3",
    timing: "Post-EBC → Q2",
    title: "Commercialisation",
    activities: ["Translate EBC outcomes to funded initiatives", "Finalise commercial constructs", "Lock executive sponsors"],
  },
  {
    phase: "Phase 4",
    timing: "Q2 → FY26",
    title: "Scale & Expand",
    activities: ["Expand beyond CRM", "Scale AI automation", "Track value consistently"],
  },
];

export const GovernanceSlide = () => {
  return (
    <div className="px-8 pt-5 pb-32">
      <h1 className="text-4xl font-bold text-foreground mb-4 opacity-0 animate-fade-in">
        Executive Engagement & Governance
      </h1>

      <div className="grid grid-cols-12 gap-4">
        {/* Left - Executive Connection Model */}
        <div className="col-span-7">
          <div className="glass-card rounded-xl p-4 h-full">
            <SectionHeader
              title="Executive Connection Model"
              description="Tiered engagement from strategic direction to day-to-day execution"
              delay={100}
            />

            <div className="mt-4 space-y-2">
              {executiveTiers.map((tier, index) => (
                <div
                  key={tier.tier}
                  className="bg-card/50 rounded-lg p-3 border border-border/50 opacity-0 animate-fade-in hover:border-primary/30 transition-all"
                  style={{ animationDelay: `${200 + index * 80}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-sm font-bold text-white">{tier.tier}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-foreground text-sm">{tier.title}</h3>
                        <span className="text-[10px] bg-sn-green/20 text-sn-green px-2 py-0.5 rounded-full">
                          {tier.cadence}
                        </span>
                      </div>
                      <p className="text-[10px] text-primary mb-1">{tier.objective}</p>
                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {tier.focusAreas[0]}
                        </span>
                        <span className="text-sn-green">→ {tier.outcome}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - FY26 Executive Close Plan */}
        <div className="col-span-5">
          <div className="glass-card rounded-xl p-4 h-full">
            <SectionHeader
              title="FY26 Executive Close Plan"
              description="March EBC as catalyst for FY26 commitments"
              delay={150}
            />

            <div className="mt-4 space-y-2">
              {executiveClosePlan.map((phase, index) => (
                <div
                  key={phase.phase}
                  className={`p-3 rounded-lg border opacity-0 animate-fade-in ${
                    phase.phase === "Phase 2" 
                      ? "bg-gradient-to-r from-primary/20 to-sn-green/10 border-primary/30" 
                      : "bg-card/50 border-border/50"
                  }`}
                  style={{ animationDelay: `${400 + index * 80}ms` }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-primary bg-primary/20 px-1.5 py-0.5 rounded">{phase.phase}</span>
                    <span className="text-[10px] text-muted-foreground">{phase.timing}</span>
                    <span className="text-xs font-semibold text-foreground ml-auto">{phase.title}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {phase.activities.map((activity, i) => (
                      <span key={i} className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <CheckCircle className="w-2.5 h-2.5 text-sn-green" />
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Governance Principle */}
            <div className="mt-3 p-3 bg-sn-navy/30 rounded-lg border border-white/10 opacity-0 animate-fade-in" style={{ animationDelay: "750ms" }}>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">Execution Principle</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Alignment at the top, discipline in execution, clear path from strategy to measurable value. 
                The EBC is a decision event, not a showcase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
