import { SectionHeader } from "@/components/SectionHeader";
import { Target, Zap, Users, Layers, AlertCircle, Trophy, Shield, Calendar } from "lucide-react";

const bigBets = [
  {
    icon: Users,
    number: "01",
    title: "CRM & Customer Service Modernisation",
    subtitle: "The Commercial Wedge",
    whyNow: "CRM sits at the intersection of customer experience, cost-to-serve, and commercial growth. Primary value lever identified.",
    ifWeLose: "Competitor platforms embed. ServiceNow becomes marginalised to IT operations only. Strategic relevance diminishes.",
    winningLooks: "Lower cost-to-serve. Improved agent productivity. Faster, more consistent customer resolution. Reduced application complexity.",
    color: "from-primary to-sn-green",
  },
  {
    icon: Zap,
    number: "02",
    title: "AI-First Operationalisation",
    subtitle: "Enterprise Scale",
    whyNow: "Maersk's AI ambition requires operational platforms that can safely scale AI into day-to-day execution. AI is central, not additive.",
    ifWeLose: "AI initiatives remain isolated pilots. No enterprise workflow backbone. Value fragmented across point solutions.",
    winningLooks: "AI embedded into execution, not pilots. Improved decision quality and speed. Measurable productivity uplift across functions.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Layers,
    number: "03",
    title: "Process & Technology Standardisation",
    subtitle: "Across the Enterprise",
    whyNow: "Fragmentation limits scalability, increases cost, and slows execution. Maersk pushing for process maturity and operational discipline.",
    ifWeLose: "Process variability persists. Execution cycles slow. Governance and transparency remain weak.",
    winningLooks: "Reduced process variability. Faster execution cycles. Improved governance and transparency across regions.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    number: "04",
    title: "Platform Trust & Governance",
    subtitle: "Sustainable Adoption",
    whyNow: "Without platform trust, transformation stalls. Clear ownership and standards needed for long-term sustainability.",
    ifWeLose: "Adoption stagnates. Value realisation unpredictable. Platform becomes technical debt rather than strategic asset.",
    winningLooks: "Improved adoption and utilisation. Predictable value realisation. Long-term platform sustainability.",
    color: "from-blue-500 to-cyan-500",
  },
];

const fy26Phasing = [
  {
    phase: "Q1",
    focus: "CRM & Service Cloud modernisation. AI-led use cases aligned to clear business outcomes.",
  },
  {
    phase: "FY26",
    focus: "Extend AI, automation, and workflow adoption beyond CRM. Deepen platform standardisation.",
  },
];

export const StrategicPrioritiesSlide = () => {
  return (
    <div className="px-8 pt-6 pb-32">
      <h1 className="slide-title opacity-0 animate-fade-in">
        <span className="highlight">Strategic Priorities</span>
        <br />FY26 Must-Win Battles
      </h1>

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4">
            {bigBets.map((bet, index) => (
              <div
                key={bet.title}
                className="glass-card rounded-2xl p-4 opacity-0 animate-fade-in"
                style={{ animationDelay: `${150 + index * 100}ms` }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bet.color} flex items-center justify-center flex-shrink-0`}>
                    <bet.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-primary font-bold">{bet.number}</span>
                      <span className="text-xs text-muted-foreground">{bet.subtitle}</span>
                    </div>
                    <h3 className="font-bold text-foreground text-sm">{bet.title}</h3>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="bg-sn-navy/30 rounded-lg p-2 border border-white/10">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Zap className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-semibold text-primary">Why Now</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{bet.whyNow}</p>
                  </div>

                  <div className="bg-red-500/10 rounded-lg p-2 border border-red-500/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      <AlertCircle className="w-3 h-3 text-red-400" />
                      <span className="text-[10px] font-semibold text-red-400">If We Lose</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{bet.ifWeLose}</p>
                  </div>

                  <div className="bg-sn-green/10 rounded-lg p-2 border border-sn-green/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Trophy className="w-3 h-3 text-sn-green" />
                      <span className="text-[10px] font-semibold text-sn-green">Winning in FY26</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{bet.winningLooks}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-64 flex-shrink-0">
          <div className="glass-card rounded-2xl p-5 h-full">
            <SectionHeader
              title="FY26 Focus"
              description="Phased execution approach"
              delay={600}
            />

            <div className="mt-5 space-y-4">
              {fy26Phasing.map((item, index) => (
                <div
                  key={item.phase}
                  className="p-3 bg-gradient-to-r from-primary/10 to-transparent rounded-xl border-l-4 border-primary opacity-0 animate-fade-in"
                  style={{ animationDelay: `${700 + index * 100}ms` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-bold text-primary text-sm">{item.phase}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.focus}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 p-4 bg-sn-navy/30 rounded-xl border border-white/10 opacity-0 animate-fade-in" style={{ animationDelay: "900ms" }}>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="font-semibold text-foreground text-xs">Strategic Anchor</span>
              </div>
              <p className="text-xs text-muted-foreground italic">
                "AI-first, with an underlying platform to operationalise it."
              </p>
            </div>

            <div className="mt-4 p-3 bg-sn-green/10 rounded-xl border border-sn-green/30 opacity-0 animate-fade-in" style={{ animationDelay: "1000ms" }}>
              <p className="text-xs text-foreground font-medium text-center">
                Every bet is economically meaningful and aligned to Maersk priorities
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
