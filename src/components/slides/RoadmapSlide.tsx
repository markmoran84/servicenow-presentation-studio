import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Calendar, ArrowRight, Sparkles, Info, Target, Flag, Users, TrendingUp, CheckCircle } from "lucide-react";

export const RoadmapSlide = () => {
  const { data } = useAccountData();
  const plan = data.generatedPlan;
  const companyName = data.basics.accountName || "the customer";

  // Get big bets as initiatives
  const bigBets = data.accountStrategy?.bigBets?.filter(b => b.title) || [];
  const hasInitiatives = bigBets.length > 0;
  
  // Roadmap phases from AI generation
  const phases = plan?.roadmapPhases?.slice(0, 3) || [];
  const hasPhases = phases.length > 0;
  
  // Success metrics as target outcomes
  const successMetrics = plan?.successMetrics?.slice(0, 4) || [];

  // Default phases if not generated
  const defaultPhases = [
    { quarter: "Now", title: "Foundation", activities: ["Current initiatives", "Quick wins", "Foundation setup"] },
    { quarter: "Next", title: "Expansion", activities: ["Scale successful pilots", "New workstreams", "Integration focus"] },
    { quarter: "Later", title: "Transformation", activities: ["Full platform adoption", "Advanced capabilities", "Business outcomes"] },
  ];

  const displayPhases = hasPhases ? phases : defaultPhases;

  return (
    <div className="min-h-screen p-6 md:p-8 pb-32 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Strategic Roadmap for {companyName}</h1>
            <p className="text-muted-foreground">Transformation journey connecting initiatives to outcomes</p>
          </div>
          <div className="flex items-center gap-2">
            <RegenerateSectionButton section="roadmapPhases" />
            {hasPhases && (
              <span className="pill-badge bg-accent/20 text-accent border-accent/30 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
          </div>
        </div>

        {hasInitiatives ? (
          <div className="grid grid-cols-12 gap-4">
            {/* Column 1: Initiatives (Big Bets) */}
            <div className="col-span-3 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground uppercase tracking-wider">Initiatives</span>
              </div>
              <div className="flex-1 space-y-2">
                {bigBets.slice(0, 6).map((bet, i) => (
                  <div 
                    key={i} 
                    className="glass-card p-3 border-l-3 border-l-primary opacity-0 animate-fade-in"
                    style={{ animationDelay: `${i * 80}ms`, borderLeftWidth: '3px' }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="text-sm font-bold text-foreground line-clamp-1">{bet.title}</div>
                        {bet.subtitle && (
                          <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{bet.subtitle}</div>
                        )}
                      </div>
                      <span className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-medium ${
                        bet.dealStatus === "Active Pursuit" ? "bg-accent/20 text-accent" :
                        bet.dealStatus === "Strategic Initiative" ? "bg-primary/20 text-primary" :
                        bet.dealStatus === "Foundation Growth" ? "bg-amber-500/20 text-amber-400" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {bet.dealStatus?.split(" ")[0] || "Pipeline"}
                      </span>
                    </div>
                    {bet.sponsor && (
                      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border/30">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">Sponsor: {bet.sponsor}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Strategic Roadmap Timeline */}
            <div className="col-span-6 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Flag className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-foreground uppercase tracking-wider">Strategic Roadmap</span>
              </div>
              
              {/* Timeline Header */}
              <div className="flex items-center justify-between px-4 mb-3 py-2 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-sm font-bold text-accent">Now</span>
                </div>
                <div className="flex-1 mx-4 border-t-2 border-dashed border-muted-foreground/30 relative">
                  <ArrowRight className="w-4 h-4 text-muted-foreground/50 absolute right-0 -top-2" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary/60" />
                  <span className="text-sm font-medium text-muted-foreground">Next</span>
                </div>
                <div className="flex-1 mx-4 border-t-2 border-dashed border-muted-foreground/30 relative">
                  <ArrowRight className="w-4 h-4 text-muted-foreground/50 absolute right-0 -top-2" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/40" />
                  <span className="text-sm font-medium text-muted-foreground/60">Later</span>
                </div>
              </div>

              {/* Roadmap Phases */}
              <div className="flex-1 grid grid-cols-3 gap-3">
                {displayPhases.map((phase, i) => (
                  <div 
                    key={i} 
                    className={`glass-card p-4 opacity-0 animate-fade-in ${
                      i === 0 ? 'border-accent/50 bg-accent/5 ring-1 ring-accent/20' : ''
                    }`}
                    style={{ animationDelay: `${(i + 6) * 80}ms` }}
                  >
                    <div className={`text-lg font-bold mb-1 ${i === 0 ? 'text-accent' : i === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                      {phase.quarter}
                    </div>
                    <div className="text-sm font-semibold text-foreground mb-3">{phase.title}</div>
                    <ul className="space-y-2">
                      {(phase.activities || []).slice(0, 4).map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                            i === 0 ? 'text-accent' : 'text-primary/60'
                          }`} />
                          <span className="line-clamp-2">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Target Outcomes */}
            <div className="col-span-3 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground uppercase tracking-wider">Target Outcomes</span>
              </div>
              <div className="flex-1 space-y-2">
                {(successMetrics.length > 0 ? successMetrics : [
                  { metric: "TBD", label: "Customer Satisfaction" },
                  { metric: "TBD", label: "Cost Reduction" },
                  { metric: "TBD", label: "Revenue Impact" },
                  { metric: "TBD", label: "Time to Value" }
                ]).map((outcome, i) => (
                  <div 
                    key={i} 
                    className="relative opacity-0 animate-fade-in" 
                    style={{ animationDelay: `${(i + 9) * 80}ms` }}
                  >
                    <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-3 border border-accent/20">
                      <div className="text-xl font-bold text-accent">{outcome.metric}</div>
                      <div className="text-xs text-muted-foreground">{outcome.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Box */}
              <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="text-xs font-medium text-primary mb-1">FY26 Platform Vision</div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {data.basics.visionStatement 
                    ? data.basics.visionStatement.substring(0, 120) + (data.basics.visionStatement.length > 120 ? "..." : "")
                    : `Enabling ${companyName}'s transformation through strategic ServiceNow adoption.`}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Initiatives Defined</h3>
            <p className="text-muted-foreground max-w-lg mx-auto mb-4">
              Add Big Bets in the Input Form (Big Bets tab) to populate the initiatives on this roadmap. Each Big Bet title will appear as an initiative with its sponsor.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-primary">
              <ArrowRight className="w-4 h-4" />
              Go to Input Form → Big Bets tab → Add your initiatives
            </div>
          </div>
        )}
      </div>
    </div>
  );
};