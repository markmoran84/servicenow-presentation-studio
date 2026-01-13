import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { SlideFooter } from "@/components/SlideFooter";
import { Zap, Users, DollarSign, Cpu, ArrowRight, Sparkles, LucideIcon, TrendingUp, Target, CheckCircle2 } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  dollarsign: DollarSign,
  zap: Zap,
  users: Users,
  cpu: Cpu,
};

const driverStyles = [
  { gradient: "from-primary/20 to-cyan-500/10", border: "border-primary/40", iconBg: "from-primary to-cyan-500", accent: "text-primary", accentBg: "bg-primary/10" },
  { gradient: "from-emerald-500/20 to-teal-500/10", border: "border-emerald-500/40", iconBg: "from-emerald-500 to-teal-500", accent: "text-emerald-400", accentBg: "bg-emerald-500/10" },
  { gradient: "from-purple-500/20 to-pink-500/10", border: "border-purple-500/40", iconBg: "from-purple-500 to-pink-500", accent: "text-purple-400", accentBg: "bg-purple-500/10" },
  { gradient: "from-amber-500/20 to-orange-500/10", border: "border-amber-500/40", iconBg: "from-amber-500 to-orange-500", accent: "text-amber-400", accentBg: "bg-amber-500/10" },
];

const defaultValueDrivers = [
  {
    icon: DollarSign,
    title: "Reduce Cost-to-Serve",
    description: "Platform consolidation and workflow automation eliminate redundant systems and manual processes",
    outcomes: [
      "30% reduction in manual case handling",
      "Tool consolidation savings",
      "Operational efficiency gains",
    ],
    alignment: "Cost Discipline",
  },
  {
    icon: Zap,
    title: "Unlock Commercial Agility",
    description: "Unified CRM enables faster quote-to-cash and improved pipeline visibility",
    outcomes: [
      "50% faster quote generation",
      "Real-time pipeline analytics",
      "Cross-sell opportunity identification",
    ],
    alignment: "Customer Centricity",
  },
  {
    icon: Users,
    title: "Elevate Customer Experience",
    description: "AI-augmented service delivery with predictive routing and proactive engagement",
    outcomes: [
      "15pt CSAT improvement",
      "Reduced resolution time",
      "Proactive issue prevention",
    ],
    alignment: "All the Way",
  },
  {
    icon: Cpu,
    title: "Embed AI as Core Capability",
    description: "Workflow platform as the operationalisation layer for enterprise AI",
    outcomes: [
      "AI use cases in production",
      "Governance and control",
      "Scalable AI infrastructure",
    ],
    alignment: "AI-First Operations",
  },
];

export const CoreValueDriversSlide = () => {
  const { data } = useAccountData();
  const { generatedPlan, basics } = data;
  const accountName = basics.accountName || "the customer";

  // Use AI-generated value drivers if available
  const isAIGenerated = !!generatedPlan?.coreValueDrivers;
  const valueDrivers = generatedPlan?.coreValueDrivers?.map((driver, idx) => ({
    icon: idx === 0 ? DollarSign : idx === 1 ? Zap : idx === 2 ? Users : Cpu,
    title: driver.title,
    description: driver.description,
    outcomes: driver.outcomes || [],
    alignment: driver.alignment,
    style: driverStyles[idx % driverStyles.length],
  })) || defaultValueDrivers.map((driver, idx) => ({
    ...driver,
    style: driverStyles[idx % driverStyles.length],
  }));

  return (
    <div className="h-full overflow-auto p-6 md:p-10 pb-28 relative">
      {/* Background gradient accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[900px] h-[600px] bg-gradient-to-bl from-primary/6 via-cyan-500/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[500px] bg-gradient-to-tr from-emerald-500/6 via-teal-500/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-gradient-to-l from-purple-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 opacity-0 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/30">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-primary via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Core Value Drivers
                </span>
              </h1>
              <p className="text-muted-foreground text-lg mt-1">Four pillars of strategic value creation for {accountName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <RegenerateSectionButton section="coreValueDrivers" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 text-xs text-accent font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                AI Generated
              </span>
            )}
          </div>
        </div>

        {/* Value Drivers Grid */}
        <div className="grid grid-cols-2 gap-5">
          {valueDrivers.map((driver, index) => (
            <div 
              key={driver.title}
              className={`glass-card p-6 border ${driver.style.border} bg-gradient-to-br from-slate-800/90 to-slate-900/70 
                         hover:shadow-xl hover:scale-[1.01] transition-all duration-300 opacity-0 animate-fade-in`}
              style={{ animationDelay: `${100 + index * 80}ms` }}
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${driver.style.iconBg} flex items-center justify-center shadow-lg`}>
                  <driver.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground">{driver.title}</h3>
                  <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full ${driver.style.accentBg} ${driver.style.accent} font-semibold mt-1`}>
                    <Target className="w-3 h-3" />
                    {driver.alignment}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{driver.description}</p>

              {/* Outcomes */}
              <div className="space-y-2">
                {driver.outcomes.map((outcome, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${driver.style.gradient} border border-slate-600/30`}
                  >
                    <div className={`w-6 h-6 rounded-lg ${driver.style.accentBg} flex items-center justify-center flex-shrink-0`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${driver.style.accent}`} />
                    </div>
                    <span className="text-sm text-foreground/90 font-medium">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Value Interconnection */}
        <div 
          className="mt-8 glass-card p-5 border border-slate-600/40 bg-gradient-to-r from-slate-800/90 via-primary/5 to-slate-800/90 opacity-0 animate-fade-in"
          style={{ animationDelay: "500ms" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {[
                { label: "Cost Efficiency", color: "bg-gradient-to-r from-primary to-cyan-500" },
                { label: "Commercial Agility", color: "bg-gradient-to-r from-emerald-500 to-teal-500" },
                { label: "CX Excellence", color: "bg-gradient-to-r from-purple-500 to-pink-500" },
                { label: "AI at Scale", color: "bg-gradient-to-r from-amber-500 to-orange-500" },
              ].map((item, idx) => (
                <div key={item.label} className="flex items-center gap-2">
                  {idx > 0 && <ArrowRight className="w-4 h-4 text-muted-foreground mx-1" />}
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-foreground font-medium">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="text-right pl-6 border-l border-slate-600/40">
              <p className="text-base font-bold text-foreground">Flywheel Effect</p>
              <p className="text-xs text-muted-foreground">Each driver reinforces the others</p>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter />
    </div>
  );
};
