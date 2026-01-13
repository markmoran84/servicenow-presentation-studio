import { useAccountData } from "@/context/AccountDataContext";
import { Shield, AlertTriangle, Lightbulb, Flame, TrendingUp, TrendingDown, Target, Info } from "lucide-react";

export const SWOTSlide = () => {
  const { data } = useAccountData();
  const { swot, basics } = data;
  const companyName = basics.accountName || "the customer";

  const quadrants = [
    {
      title: "Strengths",
      subtitle: "Internal capabilities that give advantage",
      items: swot.strengths,
      icon: Shield,
      borderColor: "border-l-primary",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
      itemBg: "bg-primary/5",
      dotColor: "bg-primary",
      position: "positive" as const,
    },
    {
      title: "Weaknesses",
      subtitle: "Internal limitations to address",
      items: swot.weaknesses,
      icon: AlertTriangle,
      borderColor: "border-l-amber-500",
      iconBg: "bg-amber-500/15",
      iconColor: "text-amber-500",
      itemBg: "bg-amber-500/5",
      dotColor: "bg-amber-500",
      position: "negative" as const,
    },
    {
      title: "Opportunities",
      subtitle: "External factors we can leverage",
      items: swot.opportunities,
      icon: Lightbulb,
      borderColor: "border-l-accent",
      iconBg: "bg-accent/15",
      iconColor: "text-accent",
      itemBg: "bg-accent/5",
      dotColor: "bg-accent",
      position: "positive" as const,
    },
    {
      title: "Threats",
      subtitle: "External risks to mitigate",
      items: swot.threats,
      icon: Flame,
      borderColor: "border-l-destructive",
      iconBg: "bg-destructive/15",
      iconColor: "text-destructive",
      itemBg: "bg-destructive/5",
      dotColor: "bg-destructive",
      position: "negative" as const,
    },
  ];

  const hasAnyContent = quadrants.some(q => q.items.length > 0);

  return (
    <div className="h-full overflow-auto p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <div className="icon-box">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="slide-title">SWOT Analysis</h1>
              <p className="slide-subtitle">{companyName} — Strategic Assessment</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Internal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-sm text-muted-foreground">External</span>
            </div>
          </div>
        </div>

        {!hasAnyContent ? (
          <div className="glass-card rounded-2xl p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No SWOT Analysis Data</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Complete the Input Form with SWOT analysis details or upload an Annual Report to auto-populate this strategic assessment.
            </p>
          </div>
        ) : (
          <>
            {/* SWOT Grid */}
            <div className="grid grid-cols-2 gap-6">
              {quadrants.map((quadrant, qIndex) => (
                <div
                  key={quadrant.title}
                  className={`glass-card p-6 border-l-4 ${quadrant.borderColor} opacity-0 animate-fade-in`}
                  style={{ animationDelay: `${100 + qIndex * 100}ms` }}
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-11 h-11 rounded-xl ${quadrant.iconBg} flex items-center justify-center border border-white/5`}>
                      <quadrant.icon className={`w-5 h-5 ${quadrant.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h2 className="section-title">{quadrant.title}</h2>
                      <p className="text-xs text-muted-foreground">{quadrant.subtitle}</p>
                    </div>
                    <div className="ml-auto">
                      {quadrant.position === "positive" ? (
                        <TrendingUp className="w-5 h-5 text-primary/40" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-destructive/40" />
                      )}
                    </div>
                  </div>

                  {quadrant.items.length > 0 ? (
                    <ul className="space-y-2.5">
                      {quadrant.items.map((item, index) => (
                        <li 
                          key={index}
                          className={`flex items-start gap-3 p-3 rounded-xl ${quadrant.itemBg} border border-white/[0.03]`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${quadrant.dotColor} mt-2 flex-shrink-0`} />
                          <span className="text-sm text-foreground/90 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No {quadrant.title.toLowerCase()} defined yet
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Strategic Implications Footer */}
            <div className="mt-6 glass-card p-5 flex items-center gap-5 opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
              <div className="icon-box flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="card-title mb-1">Strategic Implication</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Leverage identified strengths and opportunities while addressing weaknesses to mitigate threats — 
                  positioning as the execution backbone for {companyName}'s transformation.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
