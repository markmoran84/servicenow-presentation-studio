import { SectionHeader } from "@/components/SectionHeader";
import { Calendar, Target, Rocket, TrendingUp, CheckCircle, Star, ArrowRight } from "lucide-react";

const ebcPhases = [
  {
    phase: "Phase 1",
    title: "Executive Alignment & Framing",
    timing: "Now → Feb",
    icon: Target,
    activities: [
      "Confirm Maersk strategic priorities for FY26",
      "Align on 3–4 Must-Win Battles",
      "Validate AI-first positioning and enterprise outcomes",
      "Shape EBC agenda around Maersk priorities (not demos)",
    ],
    outputs: ["Agreed strategic narrative", "Executive-aligned EBC agenda", "Clear decision themes for March"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    phase: "Phase 2",
    title: "Executive Briefing Center",
    timing: "March – Santa Clara",
    icon: Star,
    activities: [
      "Reinforce ServiceNow as Maersk's digital execution backbone",
      "Demonstrate AI-led use cases driving growth",
      "Show platform enabling execution excellence at scale",
      "Secure executive sponsorship for FY26 initiatives",
    ],
    outputs: ["Executive endorsement", "Agreement on sequencing", "Clear next-step commitments"],
    color: "from-primary to-sn-green",
    highlight: true,
  },
  {
    phase: "Phase 3",
    title: "Commercialisation & Commitment",
    timing: "Post-EBC → Q2",
    icon: CheckCircle,
    activities: [
      "Translate EBC outcomes into funded initiatives",
      "Finalise commercial constructs",
      "Establish delivery governance",
      "Lock executive sponsors per initiative",
    ],
    outputs: ["Signed agreements", "Delivery plans in motion", "Governance cadence activated"],
    color: "from-amber-500 to-orange-500",
  },
  {
    phase: "Phase 4",
    title: "Scale & Expand",
    timing: "Q2 → FY26",
    icon: TrendingUp,
    activities: [
      "Expand adoption beyond CRM into broader workflows",
      "Scale AI and automation use cases",
      "Track and report value consistently",
    ],
    outputs: ["Visible enterprise impact", "Sustained executive confidence", "Expanded platform footprint"],
    color: "from-purple-500 to-pink-500",
  },
];

const ebcFocusAreas = [
  "AI-first operationalisation",
  "CRM & customer service modernisation",
  "Enterprise process orchestration",
  "Governance, scale, and control",
];

export const MarketingPlanSlide = () => {
  return (
    <div className="px-8 pt-6 pb-32">
      <h1 className="slide-title opacity-0 animate-fade-in">
        <span className="highlight">FY26 Executive</span>
        <br />Close Plan
      </h1>

      <div className="mb-4 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <p className="text-sm text-muted-foreground">
          Convert strategic alignment into committed execution, with the <span className="text-primary font-semibold">March EBC in Santa Clara</span> as the anchor moment.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-5">
        {ebcPhases.map((phase, index) => (
          <div
            key={phase.phase}
            className={`glass-card rounded-2xl p-4 opacity-0 animate-fade-in flex flex-col ${phase.highlight ? 'ring-2 ring-primary/50' : ''}`}
            style={{ animationDelay: `${200 + index * 100}ms` }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center flex-shrink-0`}>
                <phase.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-primary">{phase.phase}</span>
                <h3 className="font-bold text-foreground text-sm leading-tight">{phase.title}</h3>
                <span className="text-[10px] text-muted-foreground">{phase.timing}</span>
              </div>
            </div>

            <div className="space-y-2 flex-1">
              <div className="bg-sn-navy/30 rounded-lg p-2">
                <span className="text-[10px] font-semibold text-muted-foreground block mb-1">Key Activities</span>
                <ul className="space-y-0.5">
                  {phase.activities.map((activity, i) => (
                    <li key={i} className="text-[10px] text-muted-foreground flex items-start gap-1">
                      <span className="w-1 h-1 rounded-full bg-primary mt-1 flex-shrink-0" />
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-3 p-2 bg-sn-green/10 rounded-lg border border-sn-green/20">
              <span className="text-[9px] font-semibold text-sn-green block mb-0.5">Outputs</span>
              <ul className="space-y-0.5">
                {phase.outputs.map((output, i) => (
                  <li key={i} className="text-[10px] text-foreground flex items-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5 text-sn-green flex-shrink-0" />
                    {output}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-4 opacity-0 animate-fade-in" style={{ animationDelay: "700ms" }}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground text-sm">EBC Focus Areas</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ebcFocusAreas.map((area, index) => (
              <div key={index} className="bg-primary/10 rounded-lg p-2 border border-primary/20">
                <p className="text-xs text-foreground">{area}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 opacity-0 animate-fade-in" style={{ animationDelay: "800ms" }}>
          <div className="flex items-center gap-2 mb-3">
            <Rocket className="w-5 h-5 text-sn-green" />
            <span className="font-semibold text-foreground text-sm">Strategic Positioning</span>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              AI use cases and automation services are the <span className="text-primary font-semibold">primary levers</span> for growth and differentiation.
            </p>
            <p className="text-xs text-muted-foreground">
              Platform capabilities serve as <span className="text-primary font-semibold">enablers</span> of execution excellence.
            </p>
            <p className="text-xs text-muted-foreground">
              The EBC is a <span className="text-sn-green font-semibold">decision event</span>, not a showcase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
