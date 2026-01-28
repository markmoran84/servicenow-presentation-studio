import { useAccountData } from "@/context/AccountDataContext";
import { Shield, AlertTriangle, Lightbulb, Flame, Info } from "lucide-react";

export const SWOTSlide = () => {
  const { data } = useAccountData();
  const swot = data.swot;
  const companyName = data.basics.accountName || "Customer";

  // Use SWOT data from context - no hardcoded defaults
  const strengths = swot.strengths;
  const weaknesses = swot.weaknesses;
  const opportunities = swot.opportunities;
  const threats = swot.threats;

  const hasContent = strengths.length > 0 || weaknesses.length > 0 || opportunities.length > 0 || threats.length > 0;

  const quadrants = [
    {
      title: "Strengths",
      icon: Shield,
      items: strengths,
      iconColor: "text-primary",
      borderColor: "border-l-primary",
      bgGradient: "from-primary/5 to-transparent"
    },
    {
      title: "Weaknesses",
      icon: AlertTriangle,
      items: weaknesses,
      iconColor: "text-yellow-400",
      borderColor: "border-l-yellow-400",
      bgGradient: "from-yellow-500/5 to-transparent"
    },
    {
      title: "Opportunities",
      icon: Lightbulb,
      items: opportunities,
      iconColor: "text-cyan-400",
      borderColor: "border-l-cyan-400",
      bgGradient: "from-cyan-500/5 to-transparent"
    },
    {
      title: "Threats",
      icon: Flame,
      items: threats,
      iconColor: "text-orange-400",
      borderColor: "border-l-orange-400",
      bgGradient: "from-orange-500/5 to-transparent"
    }
  ];

  return (
    <div className="min-h-screen p-8 pb-32">
      {/* Header */}
      <div className="mb-8 opacity-0 animate-fade-in">
        <h1 className="text-5xl font-bold text-primary">SWOT Analysis</h1>
        <p className="text-muted-foreground mt-2">Strategic positioning assessment for {companyName}</p>
      </div>

      {hasContent ? (
        /* 2x2 Grid */
        <div className="grid grid-cols-2 gap-6">
          {quadrants.map((quadrant, index) => {
            const Icon = quadrant.icon;
            return (
              <div 
                key={quadrant.title}
                className={`glass-card p-6 opacity-0 animate-fade-in bg-gradient-to-br ${quadrant.bgGradient}`}
                style={{ animationDelay: `${100 + index * 100}ms` }}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`p-2 rounded-lg bg-background/50`}>
                    <Icon className={`w-6 h-6 ${quadrant.iconColor}`} />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{quadrant.title}</h2>
                  <span className="ml-auto text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                    {quadrant.items.length} items
                  </span>
                </div>

                {/* Items */}
                {quadrant.items.length > 0 ? (
                  <div className="space-y-3">
                    {quadrant.items.map((item, i) => (
                      <div 
                        key={i}
                        className={`bg-slate-800/50 rounded-lg p-3 border-l-4 ${quadrant.borderColor}`}
                      >
                        <span className="text-sm text-foreground/90">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      No {quadrant.title.toLowerCase()} defined yet.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Info className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No SWOT Data</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Complete the SWOT Analysis section in the Input Form to populate this slide with strengths, weaknesses, opportunities, and threats for {companyName}.
          </p>
        </div>
      )}
    </div>
  );
};
