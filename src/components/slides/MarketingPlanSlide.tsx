import { SectionHeader } from "@/components/SectionHeader";
import { UserCircle, Lightbulb, MessageSquare, Calendar, Star, ArrowUpRight, Target, Zap, Building } from "lucide-react";

const ebcObjectives = [
  { label: "Reinforce ServiceNow as Maersk's digital execution backbone" },
  { label: "Demonstrate how AI-led use cases drive enterprise outcomes" },
  { label: "Show how platform enables execution excellence at scale" },
  { label: "Secure executive sponsorship for FY26 initiatives" },
];

const ebcFocusAreas = [
  { icon: Zap, title: "AI-First Operationalisation", description: "Workflows that scale AI into execution" },
  { icon: UserCircle, title: "CRM & Customer Service", description: "Modernisation as commercial wedge" },
  { icon: Building, title: "Enterprise Orchestration", description: "Process standardisation at scale" },
  { icon: Target, title: "Governance & Control", description: "Platform trust and sustainability" },
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
  "AI-led use cases and automation services are the primary levers for growth and differentiation",
  "Platform capabilities serve as the enablers of execution excellence — not standalone features",
  "Executive engagement is intentional, not opportunistic — every interaction drives toward commitment",
  "CRM modernisation is the entry point to enterprise-wide digital transformation",
];

const successMetrics = [
  { metric: "Cost-to-Serve", target: "Tangible reduction" },
  { metric: "Commercial Speed", target: "Improved responsiveness" },
  { metric: "AI Adoption", target: "Embedded at scale" },
  { metric: "Platform Position", target: "Core digital backbone" },
];

export const MarketingPlanSlide = () => {
  return (
    <div className="px-8 pt-5 pb-32">
      <h1 className="text-4xl font-bold text-foreground mb-4 opacity-0 animate-fade-in">
        Executive Engagement & Success
      </h1>

      <div className="grid grid-cols-12 gap-4">
        {/* Left Column - EBC Focus */}
        <div className="col-span-5">
          <div className="glass-card rounded-xl p-4 h-full">
            <SectionHeader
              title="March EBC — Santa Clara"
              description="The catalyst for FY26 commitments"
              delay={100}
            />

            {/* EBC Objectives */}
            <div className="mt-4 space-y-2">
              {ebcObjectives.map((obj, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${200 + index * 60}ms` }}
                >
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-primary">{index + 1}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{obj.label}</p>
                </div>
              ))}
            </div>

            {/* EBC Focus Areas */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {ebcFocusAreas.map((area, index) => (
                <div
                  key={area.title}
                  className="bg-card/50 rounded-lg p-2 border border-border/50 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${450 + index * 60}ms` }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <area.icon className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-semibold text-foreground">{area.title}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{area.description}</p>
                </div>
              ))}
            </div>

            {/* Target Outcomes */}
            <div className="mt-4 p-3 bg-gradient-to-r from-primary/20 to-sn-green/10 rounded-lg border border-primary/30 opacity-0 animate-fade-in" style={{ animationDelay: "700ms" }}>
              <span className="text-[10px] font-semibold text-primary block mb-2">Target Outcomes:</span>
              <p className="text-[10px] text-muted-foreground">
                Executive endorsement of priority initiatives. Agreement on sequencing and scope. Clear next-step commitments.
              </p>
            </div>
          </div>
        </div>

        {/* Middle Column - Strategic Narratives & Thought Leadership */}
        <div className="col-span-4">
          <div className="glass-card rounded-xl p-4 h-full">
            <SectionHeader
              title="Strategic Narratives"
              description="Core messages for all Maersk communications"
              delay={150}
            />

            <div className="mt-4 space-y-2">
              {strategicNarratives.map((narrative, index) => (
                <div
                  key={index}
                  className="p-2 bg-gradient-to-r from-primary/10 to-transparent rounded-lg border-l-2 border-primary opacity-0 animate-fade-in"
                  style={{ animationDelay: `${300 + index * 60}ms` }}
                >
                  <p className="text-[10px] text-foreground leading-relaxed">{narrative}</p>
                </div>
              ))}
            </div>

            {/* Thought Leadership */}
            <div className="mt-4 space-y-2">
              <span className="text-[10px] font-semibold text-muted-foreground">THOUGHT LEADERSHIP</span>
              {thoughtLeadership.map((item, index) => (
                <div
                  key={item.title}
                  className="flex items-start gap-2 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${550 + index * 60}ms` }}
                >
                  <item.icon className="w-3.5 h-3.5 text-sn-green mt-0.5" />
                  <div>
                    <span className="text-[10px] font-medium text-foreground">{item.title}</span>
                    <p className="text-[10px] text-muted-foreground">{item.deliverable}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Success Metrics & Closing */}
        <div className="col-span-3">
          <div className="glass-card rounded-xl p-4 h-full flex flex-col">
            <SectionHeader
              title="FY26 Success"
              description="What winning looks like"
              delay={200}
            />

            <div className="mt-4 space-y-2 flex-1">
              {successMetrics.map((item, index) => (
                <div
                  key={item.metric}
                  className="p-2 bg-sn-green/10 rounded-lg border border-sn-green/20 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${350 + index * 60}ms` }}
                >
                  <span className="text-[10px] font-semibold text-sn-green block">{item.metric}</span>
                  <span className="text-[10px] text-muted-foreground">{item.target}</span>
                </div>
              ))}
            </div>

            {/* Closing Statement */}
            <div className="mt-4 p-3 bg-sn-navy/50 rounded-lg border border-white/10 opacity-0 animate-fade-in" style={{ animationDelay: "800ms" }}>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-semibold text-foreground">Final Position</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                "FY25 restored trust. FY26 is about scale — embedding AI, standardising execution, and turning ServiceNow into a foundational capability that helps Maersk operate as one integrated enterprise."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
