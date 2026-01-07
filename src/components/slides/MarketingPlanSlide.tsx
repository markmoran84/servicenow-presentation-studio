import { SectionHeader } from "@/components/SectionHeader";
import { UserCircle, Lightbulb, MessageSquare, Calendar, Star, ArrowUpRight } from "lucide-react";

const executiveEngagements = [
  {
    title: "CIO/CDO Strategic Sessions",
    frequency: "Quarterly",
    objective: "Reinforce ServiceNow as digital execution backbone",
    format: "1:1 executive dialogue",
  },
  {
    title: "Innovation Showcase",
    frequency: "Bi-annual",
    objective: "Demonstrate AI and workflow capabilities",
    format: "Technical deep-dive with demos",
  },
  {
    title: "Peer Benchmarking",
    frequency: "Annual",
    objective: "Connect Maersk with ServiceNow marquee customers",
    format: "Executive roundtable",
  },
];

const thoughtLeadership = [
  {
    icon: Lightbulb,
    title: "AI in Logistics Operations",
    narrative: "How workflow automation operationalises AI strategy",
    deliverable: "Executive brief + use case library",
  },
  {
    icon: MessageSquare,
    title: "CRM Modernisation Playbook",
    narrative: "Customer service transformation in global logistics",
    deliverable: "Reference architecture + ROI framework",
  },
  {
    icon: Star,
    title: "Platform Value Realisation",
    narrative: "From point solution to enterprise backbone",
    deliverable: "Value story + expansion roadmap",
  },
];

const strategicNarratives = [
  "ServiceNow enables Maersk's AI-first ambition by providing the workflow layer to operationalise intelligence",
  "CRM modernisation is the entry point to enterprise-wide digital transformation",
  "Platform consolidation drives cost discipline while improving customer experience",
];

export const MarketingPlanSlide = () => {
  return (
    <div className="px-8 pt-6 pb-32">
      <h1 className="text-4xl font-bold text-foreground mb-6 opacity-0 animate-fade-in">
        Marketing Plan
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Executive Engagement */}
        <div className="glass-card rounded-2xl p-5">
          <SectionHeader
            title="Executive Engagement"
            description="Structured touchpoints with Maersk leadership"
            delay={100}
          />

          <div className="mt-5 space-y-3">
            {executiveEngagements.map((engagement, index) => (
              <div
                key={engagement.title}
                className="bg-card/50 rounded-xl p-3 border border-border/50 opacity-0 animate-fade-in"
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground text-sm">{engagement.title}</h4>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    {engagement.frequency}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{engagement.objective}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {engagement.format}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thought Leadership */}
        <div className="glass-card rounded-2xl p-5">
          <SectionHeader
            title="Thought Leadership"
            description="Content and assets to reinforce positioning"
            delay={150}
          />

          <div className="mt-5 space-y-3">
            {thoughtLeadership.map((item, index) => (
              <div
                key={item.title}
                className="bg-card/50 rounded-xl p-3 border border-border/50 opacity-0 animate-fade-in hover:border-primary/30 transition-all"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sn-green/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-sn-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mb-1">{item.narrative}</p>
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <ArrowUpRight className="w-3 h-3" />
                      {item.deliverable}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Narratives */}
        <div className="glass-card rounded-2xl p-5">
          <SectionHeader
            title="Strategic Narratives"
            description="Core messages for all Maersk communications"
            delay={200}
          />

          <div className="mt-5 space-y-3">
            {strategicNarratives.map((narrative, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-primary/10 to-transparent rounded-xl border-l-4 border-primary opacity-0 animate-fade-in"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <p className="text-sm text-foreground leading-relaxed">{narrative}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3 bg-sn-navy/30 rounded-xl border border-white/10 opacity-0 animate-fade-in" style={{ animationDelay: "800ms" }}>
            <div className="flex items-center gap-2 mb-1">
              <UserCircle className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Tone & Voice</span>
            </div>
            <p className="text-xs text-muted-foreground">
              SVP / Board-ready. Clear, calm, confident. Outcomes over activities. Value over features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
