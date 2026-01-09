import { useAccountData } from "@/context/AccountDataContext";
import { Zap, TrendingUp, Calendar, Users, Lightbulb, Sparkles } from "lucide-react";

const defaultExecutives = [
  { name: "Vincent Clerc", role: "CEO MAERSK" },
  { name: "Navneet Kapoor", role: "EVP & CTIO" },
  { name: "Narin Pohl", role: "EVP & CPO L&S" },
  { name: "John Ball", role: "EVP CRM" },
  { name: "Karsten Kildahl", role: "CCO" },
  { name: "Bill McDermott", role: "CEO ServiceNow" },
];

const defaultWorkstreams = [
  {
    title: "CRM Modernisation",
    subtitle: "Customer Service Platform",
    dealClose: "Q1 2026",
    dealStatus: "Active Pursuit",
    statusColor: "bg-primary",
    insight: "Primary commercial wedge. Direct alignment to customer experience priorities.",
    netNewACV: "$5M",
    steadyStateBenefit: "$565M",
    people: [
      { name: "IT Lead", role: "SVP, IT" },
      { name: "Procurement Lead", role: "Strategic Sourcing" },
    ],
  },
  {
    title: "AI Use Cases & Automation",
    subtitle: "Operationalising AI-First Strategy",
    dealClose: "Q2 2026",
    dealStatus: "Strategic Initiative",
    statusColor: "bg-accent",
    insight: "Position as the operationalisation layer for AI — connecting intelligence to automated workflows.",
    netNewACV: "$2M",
    steadyStateBenefit: "TBD",
    people: [
      { name: "CX Lead", role: "Head of CX" },
      { name: "AI Lead", role: "AI Platform Owner" },
    ],
  },
  {
    title: "IT & Security Operations",
    subtitle: "SecOps & ITOM Expansion",
    dealClose: "Q3 2026",
    dealStatus: "Foundation Growth",
    statusColor: "bg-blue-500",
    insight: "Existing ITSM footprint provides platform for SecOps and ITOM expansion. Unified visibility required.",
    netNewACV: "$3M",
    steadyStateBenefit: "$320M",
    people: [
      { name: "Security Lead", role: "CISO" },
      { name: "Ops Lead", role: "Director Platform" },
    ],
  },
];

export const BigBetsSlide = () => {
  const { data } = useAccountData();
  const { generatedPlan, engagement } = data;

  // Use AI-generated workstreams if available
  const isAIGenerated = !!generatedPlan?.keyWorkstreams;
  const workstreams = generatedPlan?.keyWorkstreams?.map((ws, idx) => ({
    title: ws.title,
    subtitle: ws.subtitle || "Strategic Initiative",
    dealClose: ws.targetClose,
    dealStatus: ws.dealStatus || (idx === 0 ? "Active Pursuit" : idx === 1 ? "Strategic Initiative" : "Foundation Growth"),
    statusColor: idx === 0 ? "bg-primary" : idx === 1 ? "bg-accent" : "bg-blue-500",
    insight: ws.insight,
    netNewACV: ws.acv,
    steadyStateBenefit: ws.steadyStateBenefit || "TBD",
    people: ws.people || [],
  })) || defaultWorkstreams;

  // Get executives from engagement data or use defaults
  const executives = engagement.knownExecutiveSponsors.length > 0
    ? engagement.knownExecutiveSponsors.slice(0, 6).map(sponsor => {
        const parts = sponsor.split("(");
        return {
          name: parts[0].trim(),
          role: parts[1]?.replace(")", "") || "Executive Sponsor",
        };
      })
    : defaultExecutives;

  return (
    <div className="px-8 pt-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 opacity-0 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Key Transformation Workstreams</h1>
          <p className="text-muted-foreground mt-1">Aligning stakeholders to accelerate impact and outcomes</p>
        </div>
        <div className="flex items-center gap-2">
          {isAIGenerated && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
              <Sparkles className="w-3 h-3" />
              AI Generated
            </span>
          )}
          <div className="pill-badge">
            FY26 Big Bets
          </div>
        </div>
      </div>

      {/* Executive Row */}
      <div className="glass-card p-4 mb-4 opacity-0 animate-fade-in animation-delay-100">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Execs</span>
        </div>
        <div className="flex items-center justify-between">
          {executives.map((exec, index) => (
            <div
              key={exec.name}
              className="flex flex-col items-center text-center"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-primary/50 flex items-center justify-center mb-1">
                <span className="text-xs font-bold text-foreground">
                  {exec.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-foreground">{exec.name}</span>
              <span className="text-[9px] text-muted-foreground">{exec.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Workstreams Grid */}
      <div className="grid grid-cols-3 gap-4">
        {workstreams.map((stream, index) => (
          <div
            key={stream.title}
            className="glass-card p-0 overflow-hidden opacity-0 animate-fade-in"
            style={{ animationDelay: `${200 + index * 100}ms` }}
          >
            {/* Stream Header */}
            <div className={`p-4 ${stream.statusColor}/10 border-b border-border/30`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stream.statusColor} text-white`}>
                  {stream.dealStatus}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Close: {stream.dealClose}</span>
                </div>
              </div>
              <h3 className="font-bold text-foreground text-sm leading-tight">{stream.title}</h3>
              <p className="text-xs text-primary mt-0.5">{stream.subtitle}</p>
            </div>

            {/* Insight Section */}
            <div className="p-4 border-b border-border/30">
              <div className="flex items-center gap-1.5 mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-accent" />
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Insights</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {stream.insight}
              </p>
            </div>

            {/* Financials */}
            <div className="p-4 bg-secondary/30 border-b border-border/30">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] text-muted-foreground block mb-0.5">Net new ACV</span>
                  <span className="text-xl font-bold text-gradient">{stream.netNewACV}</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground block mb-0.5">Steady-state benefit</span>
                  <span className="text-xl font-bold text-gradient-accent">{stream.steadyStateBenefit}</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-3 h-1 rounded-full bg-border/50 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${stream.statusColor}`}
                  style={{ width: index === 0 ? '75%' : index === 1 ? '40%' : '25%' }}
                />
              </div>
            </div>

            {/* People Section */}
            {stream.people.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">People</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {stream.people.slice(0, 4).map((person) => (
                    <div key={person.name} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-[8px] font-bold text-foreground">
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-medium text-foreground block truncate">{person.name}</span>
                        <span className="text-[9px] text-muted-foreground block truncate">{person.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CRM Priority Callout */}
      <div className="mt-4 glass-card p-3 flex items-center gap-4 opacity-0 animate-fade-in animation-delay-600">
        <div className="icon-container animate-pulse-glow">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <span className="text-sm font-semibold text-foreground">{workstreams[0]?.title} is the Primary Commercial Wedge</span>
          <span className="text-sm text-muted-foreground ml-2">— Q1 FY26 priority. Success unlocks multi-workflow expansion.</span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-gradient">$10M+</span>
          <span className="text-xs text-muted-foreground block">Total ACV Opportunity</span>
        </div>
      </div>
    </div>
  );
};
