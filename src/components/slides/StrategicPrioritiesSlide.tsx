import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { SlideFooter } from "@/components/SlideFooter";
import { Target, Zap, Users, Layers, AlertCircle, Trophy, Sparkles, LucideIcon, Info, TrendingUp, Shield } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  zap: Zap,
  layers: Layers,
  target: Target,
};

const priorityStyles = [
  { gradient: "from-primary/20 to-cyan-500/10", border: "border-primary/40", iconBg: "from-primary to-cyan-500", accent: "text-primary" },
  { gradient: "from-purple-500/20 to-pink-500/10", border: "border-purple-500/40", iconBg: "from-purple-500 to-pink-500", accent: "text-purple-400" },
  { gradient: "from-amber-500/20 to-orange-500/10", border: "border-amber-500/40", iconBg: "from-amber-500 to-orange-500", accent: "text-amber-400" },
];

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
        style: priorityStyles[idx % priorityStyles.length],
      }))
    : [];

  const companyName = basics.accountName || "the customer";

  return (
    <div className="h-full overflow-auto p-6 md:p-10 pb-28 relative">
      {/* Background gradient accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[900px] h-[600px] bg-gradient-to-bl from-primary/6 via-purple-500/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[500px] bg-gradient-to-tr from-amber-500/6 via-orange-500/4 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 opacity-0 animate-fade-in">
          <div>
            <p className="text-muted-foreground text-xs tracking-widest uppercase mb-2">Must-Win Battles</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Strategic Priorities
              </span>
              {" "}
              <span className="text-foreground">FY26</span>
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Strategic priorities aligned to {companyName} enterprise transformation objectives.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <RegenerateSectionButton section="strategicPriorities" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 text-xs text-accent font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                AI Generated
              </span>
            )}
          </div>
        </div>

        {/* Intro Card */}
        <div 
          className="glass-card p-5 mb-6 border border-primary/30 bg-gradient-to-r from-slate-800/90 via-primary/5 to-slate-800/90 opacity-0 animate-fade-in"
          style={{ animationDelay: "80ms" }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/20 flex items-center justify-center border border-primary/30">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-lg">Must-Win Battles</h2>
              <p className="text-muted-foreground text-sm">
                Three strategic priorities that define success in FY26
              </p>
            </div>
          </div>
        </div>

        {bigBets.length > 0 ? (
          <div className="space-y-5">
            {bigBets.map((bet, index) => (
              <div
                key={bet.title}
                className={`glass-card p-6 border ${bet.style.border} bg-gradient-to-br from-slate-800/90 to-slate-900/70 
                           hover:shadow-xl transition-all duration-300 opacity-0 animate-fade-in`}
                style={{ animationDelay: `${150 + index * 100}ms` }}
              >
                <div className="flex gap-6">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${bet.style.iconBg} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <bet.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-foreground">{bet.title}</h3>
                      <span className="px-4 py-1.5 rounded-full bg-slate-700/50 border border-slate-600/40 text-xs font-medium text-muted-foreground">
                        {bet.alignment}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {/* Why Now */}
                      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-cyan-500/5 border border-primary/30 hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-xs font-bold text-primary uppercase tracking-wider">Why Now</span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{bet.whyNow}</p>
                      </div>

                      {/* If We Lose */}
                      <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/5 border border-red-500/30 hover:border-red-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 text-red-400" />
                          </div>
                          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">If We Lose</span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{bet.ifWeLose}</p>
                      </div>

                      {/* Winning Looks */}
                      <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/30 hover:border-emerald-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <Trophy className="w-4 h-4 text-emerald-400" />
                          </div>
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Winning in FY26</span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{bet.winningLooks}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div 
            className="glass-card p-16 text-center border border-slate-600/30 opacity-0 animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            <div className="w-20 h-20 rounded-2xl bg-muted/10 flex items-center justify-center mx-auto mb-6 border border-muted/20">
              <Info className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">No Strategic Priorities Generated</h3>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Complete the Input Form with account details and click <span className="font-medium text-foreground">Generate with AI</span> to create strategic priorities tailored to your account.
            </p>
          </div>
        )}
      </div>
      <SlideFooter />
    </div>
  );
};
