import { useAccountData } from "@/context/AccountDataContext";
import { Shield, AlertTriangle, Lightbulb, Flame, TrendingUp, TrendingDown } from "lucide-react";

export const SWOTSlide = () => {
  const { data } = useAccountData();
  const { swot, basics } = data;

  const quadrants = [
    {
      title: "Strengths",
      subtitle: "Internal capabilities that give advantage",
      items: swot.strengths,
      icon: Shield,
      gradient: "from-primary/20 to-primary/5",
      borderColor: "border-l-primary",
      iconBg: "bg-primary/20",
      iconColor: "text-primary",
      position: "positive" as const,
    },
    {
      title: "Weaknesses",
      subtitle: "Internal limitations to address",
      items: swot.weaknesses,
      icon: AlertTriangle,
      gradient: "from-amber-500/20 to-amber-500/5",
      borderColor: "border-l-amber-500",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-500",
      position: "negative" as const,
    },
    {
      title: "Opportunities",
      subtitle: "External factors we can leverage",
      items: swot.opportunities,
      icon: Lightbulb,
      gradient: "from-accent/20 to-accent/5",
      borderColor: "border-l-accent",
      iconBg: "bg-accent/20",
      iconColor: "text-accent",
      position: "positive" as const,
    },
    {
      title: "Threats",
      subtitle: "External risks to mitigate",
      items: swot.threats,
      icon: Flame,
      gradient: "from-destructive/20 to-destructive/5",
      borderColor: "border-l-destructive",
      iconBg: "bg-destructive/20",
      iconColor: "text-destructive",
      position: "negative" as const,
    },
  ];

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">SWOT Analysis</h1>
              <p className="text-muted-foreground text-lg">{basics.accountName} — Strategic Assessment</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Internal</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-muted-foreground">External</span>
            </div>
          </div>
        </div>

        {/* SWOT Grid */}
        <div className="grid grid-cols-2 gap-6">
          {quadrants.map((quadrant, qIndex) => (
            <div
              key={quadrant.title}
              className={`glass-card p-6 border-l-4 ${quadrant.borderColor} opacity-0 animate-fade-in`}
              style={{ animationDelay: `${100 + qIndex * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl ${quadrant.iconBg} flex items-center justify-center`}>
                  <quadrant.icon className={`w-5 h-5 ${quadrant.iconColor}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{quadrant.title}</h2>
                  <p className="text-xs text-muted-foreground">{quadrant.subtitle}</p>
                </div>
                <div className="ml-auto">
                  {quadrant.position === "positive" ? (
                    <TrendingUp className="w-5 h-5 text-primary/50" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-destructive/50" />
                  )}
                </div>
              </div>

              <ul className="space-y-3">
                {quadrant.items.map((item, index) => (
                  <li 
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r ${quadrant.gradient}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${quadrant.iconColor} mt-2 flex-shrink-0`} 
                         style={{ backgroundColor: 'currentColor' }} />
                    <span className="text-sm text-foreground/90 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Strategic Implications Footer */}
        <div className="mt-6 glass-card p-5 flex items-center gap-6 opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">Strategic Implication</h3>
            <p className="text-sm text-muted-foreground">
              ServiceNow can address weaknesses (technology sprawl, slow adoption) while capitalising on opportunities 
              (AI-first mandate, platform consolidation) — positioning as the execution backbone for transformation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
