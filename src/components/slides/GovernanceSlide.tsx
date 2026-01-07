import { SectionHeader } from "@/components/SectionHeader";
import { Users, Calendar, BarChart3, Shield, ArrowRight, Star, Briefcase, Target } from "lucide-react";

const engagementTiers = [
  {
    tier: "1",
    title: "Executive Sponsorship",
    subtitle: "Strategic Alignment",
    cadence: "Annual / As Required",
    icon: Star,
    forums: ["Top-to-Top Sessions", "Executive Briefings (EBC)", "Strategic Alignment"],
    focus: ["Enterprise strategy alignment", "AI-first operating ambition", "Commercial partnership direction"],
    maersk: "Group Executive Leadership, Business Unit Presidents",
    servicenow: "CEO/President, GVP Strategic Accounts",
    outcome: "Clear strategic intent and executive sponsorship for must-win battles",
    color: "from-primary to-sn-green",
  },
  {
    tier: "2",
    title: "Executive Steering",
    subtitle: "Strategy Execution",
    cadence: "Quarterly",
    icon: Users,
    forums: ["Executive Steering Committee"],
    focus: ["Progress against priorities", "Risk & decision management", "Value realisation tracking"],
    maersk: "CIO / CDO / CTO, Business Transformation Leaders",
    servicenow: "Account & Industry Leadership",
    outcome: "Decisions unblocked, scope aligned, executive confidence maintained",
    color: "from-purple-500 to-pink-500",
  },
  {
    tier: "3",
    title: "Programme Management",
    subtitle: "Operational Momentum",
    cadence: "Monthly / Bi-weekly",
    icon: Calendar,
    forums: ["Account Governance Reviews", "Programme Reviews"],
    focus: ["Initiative execution", "Adoption & platform health", "Escalation management"],
    maersk: "Platform Leadership, Architecture Teams",
    servicenow: "Account Team, Customer Success",
    outcome: "Predictable execution, transparent progress, early risk mitigation",
    color: "from-amber-500 to-orange-500",
  },
  {
    tier: "4",
    title: "Commercial & Delivery",
    subtitle: "Execution",
    cadence: "As Required",
    icon: Briefcase,
    forums: ["Commercial Reviews", "Project Execution Syncs"],
    focus: ["Deal execution", "Contractual milestones", "Delivery outcomes"],
    maersk: "Procurement, Project Teams",
    servicenow: "Sales, Delivery, Services",
    outcome: "Deals closed, value delivered, trust reinforced",
    color: "from-blue-500 to-cyan-500",
  },
];

export const GovernanceSlide = () => {
  return (
    <div className="px-8 pt-6 pb-32">
      <h1 className="slide-title opacity-0 animate-fade-in">
        <span className="highlight">Executive Engagement</span>
        <br />& Governance Model
      </h1>

      <div className="mb-4 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <p className="text-sm text-muted-foreground">
          Sustained executive alignment, disciplined execution, and measurable value realisation through a tiered engagement model.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {engagementTiers.map((tier, index) => (
          <div
            key={tier.tier}
            className="glass-card rounded-2xl p-4 opacity-0 animate-fade-in flex flex-col"
            style={{ animationDelay: `${200 + index * 100}ms` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center flex-shrink-0`}>
                <tier.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary">Tier {tier.tier}</span>
                  <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">{tier.cadence}</span>
                </div>
                <h3 className="font-bold text-foreground text-sm">{tier.title}</h3>
              </div>
            </div>

            <div className="space-y-2 flex-1">
              <div className="bg-sn-navy/30 rounded-lg p-2">
                <span className="text-[10px] font-semibold text-muted-foreground block mb-1">Forums</span>
                <div className="space-y-0.5">
                  {tier.forums.map((forum, i) => (
                    <p key={i} className="text-[10px] text-foreground">{forum}</p>
                  ))}
                </div>
              </div>

              <div className="bg-card/50 rounded-lg p-2 border border-border/30">
                <span className="text-[10px] font-semibold text-muted-foreground block mb-1">Focus Areas</span>
                <ul className="space-y-0.5">
                  {tier.focus.map((item, i) => (
                    <li key={i} className="text-[10px] text-muted-foreground flex items-start gap-1">
                      <span className="w-1 h-1 rounded-full bg-primary mt-1 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <div className="bg-card/30 rounded p-1.5">
                  <span className="text-[9px] font-semibold text-primary block">Maersk</span>
                  <p className="text-[9px] text-muted-foreground">{tier.maersk}</p>
                </div>
                <div className="bg-card/30 rounded p-1.5">
                  <span className="text-[9px] font-semibold text-sn-green block">ServiceNow</span>
                  <p className="text-[9px] text-muted-foreground">{tier.servicenow}</p>
                </div>
              </div>
            </div>

            <div className="mt-3 p-2 bg-sn-green/10 rounded-lg border border-sn-green/20">
              <span className="text-[9px] font-semibold text-sn-green block mb-0.5">Outcome</span>
              <p className="text-[10px] text-muted-foreground">{tier.outcome}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 p-4 glass-card rounded-xl opacity-0 animate-fade-in" style={{ animationDelay: "700ms" }}>
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm text-foreground font-medium">
              "Our executive engagement model ensures alignment at the top, discipline in execution, and a clear path from strategy to measurable value."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
