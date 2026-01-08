import { CheckCircle, ArrowRight, Target, Zap, AlertTriangle, TrendingUp } from "lucide-react";

const fy25Achievements = [
  "Stabilised Maersk–ServiceNow partnership",
  "Restored confidence in execution",
  "Remediated platform foundation",
  "Advanced AI-centred opportunities",
];

const fy26Priorities = [
  {
    title: "CRM Modernisation",
    description: "SFDC Takeout as critical deliverable",
    icon: Target,
  },
  {
    title: "AI Operationalisation",
    description: "ServiceNow as AI embedding layer",
    icon: Zap,
  },
  {
    title: "Platform Expansion",
    description: "CPQ & commercial agility",
    icon: TrendingUp,
  },
];

export const JourneyContextSlide = () => {
  return (
    <div className="px-8 pt-6 pb-32">
      <h1 className="text-4xl font-bold text-foreground mb-2 opacity-0 animate-fade-in">
        The Journey So Far
      </h1>
      <p className="text-muted-foreground mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
        From stabilisation to strategic acceleration
      </p>

      <div className="grid grid-cols-12 gap-6">
        {/* FY25 Context - Left Column */}
        <div className="col-span-5 space-y-4">
          <div 
            className="glass-card rounded-2xl p-5 opacity-0 animate-fade-in"
            style={{ animationDelay: "150ms" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">FY25 Starting Point</h2>
                <p className="text-xs text-muted-foreground">The challenge we inherited</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Platform health challenges driven by <span className="text-amber-400 font-medium">over-customisation</span> had 
              constrained the perceived value of existing investments, making remediation of the foundation a critical priority.
            </p>
          </div>

          <div 
            className="glass-card rounded-2xl p-5 opacity-0 animate-fade-in"
            style={{ animationDelay: "250ms" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sn-green/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-sn-green" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">FY25 Focus</h2>
                <p className="text-xs text-muted-foreground">Trust rebuilding & stabilisation</p>
              </div>
            </div>
            <ul className="space-y-2">
              {fy25Achievements.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-sn-green" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div 
            className="glass-card rounded-2xl p-4 border-l-4 border-primary opacity-0 animate-fade-in"
            style={{ animationDelay: "350ms" }}
          >
            <p className="text-sm text-muted-foreground italic">
              "The account strategy was deliberately shaped around Maersk's <span className="text-primary font-medium">AI-first ambition</span>. 
              ServiceNow positioned as the underlying platform to embed AI as a core capability."
            </p>
          </div>
        </div>

        {/* Arrow Transition */}
        <div 
          className="col-span-2 flex items-center justify-center opacity-0 animate-fade-in"
          style={{ animationDelay: "400ms" }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-sn-green flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-white" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Q1 FY26</span>
          </div>
        </div>

        {/* FY26 Priorities - Right Column */}
        <div className="col-span-5 space-y-4">
          <div 
            className="glass-card rounded-2xl p-5 opacity-0 animate-fade-in"
            style={{ animationDelay: "450ms" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">FY26 Strategic Priorities</h2>
                <p className="text-xs text-muted-foreground">Clear intent, accelerated execution</p>
              </div>
            </div>
            <div className="space-y-3">
              {fy26Priorities.map((priority, index) => (
                <div 
                  key={priority.title}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                    <priority.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{priority.title}</h3>
                    <p className="text-xs text-muted-foreground">{priority.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div 
            className="glass-card rounded-2xl p-5 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 opacity-0 animate-fade-in"
            style={{ animationDelay: "550ms" }}
          >
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="text-primary">●</span> SFDC Takeout Update
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Anticipated Q4 FY25 close <span className="text-amber-400">slipped to Q1 FY26</span>. 
              CRM modernisation remains the primary commercial wedge.
            </p>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-primary/20 text-primary rounded-full font-medium">Primary Wedge</span>
              <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full font-medium">Q1 FY26 Target</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
