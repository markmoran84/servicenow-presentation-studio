import { SectionHeader } from "@/components/SectionHeader";
import { Users, Calendar, BarChart3, Shield, ArrowRight, CheckCircle } from "lucide-react";

const governanceItems = [
  {
    icon: Users,
    title: "Executive Steering Committee",
    frequency: "Quarterly",
    description: "SVP-level alignment on strategy, investment priorities, and value realisation",
    participants: ["Maersk CIO/CDO", "ServiceNow GVP", "Account Leadership"],
  },
  {
    icon: Calendar,
    title: "Operational Cadence",
    frequency: "Bi-weekly",
    description: "Execution tracking, blocker resolution, and delivery progress",
    participants: ["Account Team", "Delivery Leads", "Customer Success"],
  },
  {
    icon: BarChart3,
    title: "Value Tracking",
    frequency: "Monthly",
    description: "KPI review, ROI measurement, and business outcome reporting",
    participants: ["Value Advisory", "Business Stakeholders"],
  },
];

const prioritisationFramework = [
  { step: "1", label: "Strategic Alignment", description: "Does it map to Maersk priorities?" },
  { step: "2", label: "Economic Impact", description: "Is the ROI measurable and significant?" },
  { step: "3", label: "Execution Readiness", description: "Can we deliver in the timeframe?" },
  { step: "4", label: "Stakeholder Commitment", description: "Is executive sponsorship secured?" },
];

export const GovernanceSlide = () => {
  return (
    <div className="px-8 pt-6 pb-32">
      <h1 className="text-4xl font-bold text-foreground mb-6 opacity-0 animate-fade-in">
        Governance Model
      </h1>

      <div className="grid grid-cols-2 gap-6">
        {/* Left - Governance Structure */}
        <div className="glass-card rounded-2xl p-6">
          <SectionHeader
            title="Execution Governance"
            description="How we ensure alignment, accountability, and value realisation"
            delay={100}
          />

          <div className="mt-6 space-y-4">
            {governanceItems.map((item, index) => (
              <div
                key={item.title}
                className="bg-card/50 rounded-xl p-4 border border-border/50 opacity-0 animate-fade-in hover:border-primary/30 transition-all"
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <span className="text-xs bg-sn-green/20 text-sn-green px-2 py-0.5 rounded-full">
                        {item.frequency}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.participants.map((p) => (
                        <span key={p} className="text-xs bg-white/5 text-muted-foreground px-2 py-0.5 rounded">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Prioritisation Framework */}
        <div className="glass-card rounded-2xl p-6">
          <SectionHeader
            title="Prioritisation Framework"
            description="Decision criteria for initiative selection and resource allocation"
            delay={150}
          />

          <div className="mt-6 space-y-3">
            {prioritisationFramework.map((item, index) => (
              <div
                key={item.step}
                className="flex items-center gap-4 opacity-0 animate-fade-in"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-sn-green flex items-center justify-center font-bold text-white flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex-1 bg-card/50 rounded-lg p-3 border border-border/50">
                  <h4 className="font-semibold text-foreground text-sm">{item.label}</h4>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                {index < prioritisationFramework.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-sn-navy/30 rounded-xl border border-white/10 opacity-0 animate-fade-in" style={{ animationDelay: "800ms" }}>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Governance Principle</span>
            </div>
            <p className="text-sm text-muted-foreground">
              All initiatives must pass this framework. No investment without clear strategic alignment 
              and measurable business outcome. Value over activity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
