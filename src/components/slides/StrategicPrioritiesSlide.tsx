import { Target, Zap, Users, Layers, AlertCircle, Trophy, Shield } from "lucide-react";

const bigBets = [
  {
    icon: Users,
    title: "CRM & Customer Service Modernisation",
    subtitle: "The Commercial Wedge",
    whyNow: "CRM sits at the intersection of customer experience, cost-to-serve, and commercial growth. Primary opportunity to demonstrate enterprise value.",
    ifWeLose: "Competitor platforms embed. ServiceNow marginalised to IT operations only. Strategic relevance diminishes.",
    winningLooks: "Lower cost-to-serve. Improved agent productivity. Faster, consistent customer resolution. Reduced application complexity.",
    alignment: "Customer Centricity • Cost Discipline",
    color: "from-primary to-sn-green",
  },
  {
    icon: Zap,
    title: "AI-First Operationalisation at Enterprise Scale",
    subtitle: "The Control Plane for AI",
    whyNow: "Maersk's AI ambition requires operational platforms that can safely scale AI into day-to-day execution. Not isolated pilots.",
    ifWeLose: "AI initiatives scattered. No enterprise workflow backbone. Value fragmented across disconnected tools.",
    winningLooks: "AI embedded into execution workflows. Improved decision quality and speed. Measurable productivity uplift across functions.",
    alignment: "AI-First Ambition • Operational Excellence",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Layers,
    title: "Process & Technology Standardisation",
    subtitle: "Enterprise-Wide Orchestration",
    whyNow: "Fragmentation limits scalability, increases cost, and slows execution. Maersk pushing for process maturity and operational discipline.",
    ifWeLose: "Process variability continues. Execution cycles remain slow. Governance and transparency gaps persist.",
    winningLooks: "Reduced process variability. Faster execution cycles. Improved governance and transparency across regions.",
    alignment: "Standardisation • All the Way",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Platform Trust, Governance & Sustainable Adoption",
    subtitle: "The Foundation for Scale",
    whyNow: "Without platform trust, transformation stalls. Over-customisation legacy must be replaced with governed, scalable approach.",
    ifWeLose: "Adoption stagnates. Value realisation unpredictable. Long-term platform sustainability at risk.",
    winningLooks: "Improved adoption and utilisation. Predictable value realisation. ServiceNow as governed enterprise platform.",
    alignment: "Governance • Value Realisation",
    color: "from-cyan-500 to-blue-500",
  },
];

const fyPhasing = [
  { phase: "Q1", focus: "CRM & AI", description: "Advance CRM/Service Cloud modernisation. Progress AI-led use cases with clear business outcomes." },
  { phase: "Q2-Q4", focus: "Scale & Expand", description: "Extend AI and automation beyond CRM. Deepen platform standardisation and governance." },
];

export const StrategicPrioritiesSlide = () => {
  return (
    <div className="px-8 pt-5 pb-32">
      <h1 className="text-4xl font-bold text-foreground mb-4 opacity-0 animate-fade-in">
        Strategic Priorities FY26
      </h1>

      {/* Header Context */}
      <div className="mb-4">
        <div className="glass-card rounded-xl p-3 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <h2 className="font-semibold text-foreground text-sm">Must-Win Battles</h2>
              <p className="text-xs text-muted-foreground">
                "AI-first, with an underlying platform to operationalise it." — Each bet is economically meaningful and aligned to Maersk enterprise priorities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Big Bets Grid - 2x2 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {bigBets.map((bet, index) => (
          <div
            key={bet.title}
            className="glass-card rounded-xl p-4 opacity-0 animate-fade-in"
            style={{ animationDelay: `${200 + index * 100}ms` }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${bet.color} flex items-center justify-center flex-shrink-0`}>
                <bet.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-foreground leading-tight">{bet.title}</h3>
                <p className="text-xs text-primary">{bet.subtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
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
                  <span className="text-[10px] font-semibold text-sn-green">Winning Looks Like</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{bet.winningLooks}</p>
              </div>
            </div>

            <div className="mt-2 flex justify-end">
              <span className="text-[10px] text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">
                {bet.alignment}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* FY26 Phasing */}
      <div className="glass-card rounded-xl p-4 opacity-0 animate-fade-in" style={{ animationDelay: "650ms" }}>
        <div className="flex items-center gap-6">
          <span className="text-xs font-semibold text-foreground">FY26 Phasing:</span>
          {fyPhasing.map((phase, index) => (
            <div key={phase.phase} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary bg-primary/20 px-2 py-0.5 rounded">{phase.phase}</span>
                <span className="text-xs font-medium text-foreground">{phase.focus}</span>
                <span className="text-[10px] text-muted-foreground">— {phase.description}</span>
              </div>
              {index < fyPhasing.length - 1 && <span className="text-muted-foreground">→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
