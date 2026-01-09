import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Target, Zap, Users, Layers, AlertCircle, Trophy, Sparkles, LucideIcon, Info } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  zap: Zap,
  layers: Layers,
  target: Target,
};

export const StrategicPrioritiesSlide = () => {
  const { data } = useAccountData();
  const { generatedPlan, basics } = data;

  // Use AI-generated priorities only - no hardcoded defaults
  const isAIGenerated = !!generatedPlan?.strategicPriorities && generatedPlan.strategicPriorities.length > 0;
  const bigBets = isAIGenerated
    ? generatedPlan.strategicPriorities.map((priority, idx) => ({
        icon: idx === 0 ? Users : idx === 1 ? Zap : Layers,
        title: priority.title,
        whyNow: priority.whyNow,
        ifWeLose: priority.ifWeLose,
        winningLooks: priority.winningLooks || "Success criteria to be defined",
        alignment: priority.alignment || "Strategic Alignment",
        color: priority.color || (idx === 0 ? "from-primary to-sn-green" : idx === 1 ? "from-purple-500 to-pink-500" : "from-amber-500 to-orange-500"),
      }))
    : [];

  const companyName = basics.accountName || "the customer";

  return (
    <div className="px-8 pt-6 pb-32">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-foreground opacity-0 animate-fade-in">
          Strategic Priorities FY26
        </h1>
        <div className="flex items-center gap-2">
          <RegenerateSectionButton section="strategicPriorities" />
          {isAIGenerated && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium opacity-0 animate-fade-in">
              <Sparkles className="w-3 h-3" />
              AI Generated
            </span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="glass-card rounded-2xl p-4 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-primary" />
            <div>
              <h2 className="font-semibold text-foreground">Must-Win Battles</h2>
              <p className="text-sm text-muted-foreground">
                Strategic priorities aligned to {companyName} enterprise transformation objectives.
              </p>
            </div>
          </div>
        </div>
      </div>

      {bigBets.length > 0 ? (
        <div className="space-y-4">
          {bigBets.map((bet, index) => (
            <div
              key={bet.title}
              className="glass-card rounded-2xl p-5 opacity-0 animate-fade-in"
              style={{ animationDelay: `${200 + index * 150}ms` }}
            >
              <div className="flex gap-5">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bet.color} flex items-center justify-center flex-shrink-0`}>
                  <bet.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-foreground">{bet.title}</h3>
                    <span className="text-xs text-muted-foreground bg-white/5 px-3 py-1 rounded-full">
                      {bet.alignment}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-sn-navy/30 rounded-lg p-3 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-xs font-semibold text-primary">Why Now</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{bet.whyNow}</p>
                    </div>

                    <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-semibold text-red-400">If We Lose</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{bet.ifWeLose}</p>
                    </div>

                    <div className="bg-sn-green/10 rounded-lg p-3 border border-sn-green/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-4 h-4 text-sn-green" />
                        <span className="text-xs font-semibold text-sn-green">Winning in FY26</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{bet.winningLooks}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 text-center opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Strategic Priorities Generated</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Complete the Input Form with account details and click <span className="font-medium text-foreground">Generate with AI</span> to create strategic priorities tailored to your account.
          </p>
        </div>
      )}
    </div>
  );
};
