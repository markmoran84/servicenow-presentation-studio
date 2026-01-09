import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, Clock, Target, Users, Calendar, ArrowRight, Flag, Zap, Sparkles } from "lucide-react";

const getStatusConfig = (status: string) => {
  switch (status) {
    case "on-track":
    case "On Track":
      return { color: "bg-emerald-500", textColor: "text-emerald-400", label: "On Track", icon: CheckCircle2 };
    case "at-risk":
    case "At Risk":
      return { color: "bg-amber-500", textColor: "text-amber-400", label: "At Risk", icon: AlertTriangle };
    case "blocked":
    case "Blocked":
      return { color: "bg-red-500", textColor: "text-red-400", label: "Blocked", icon: AlertTriangle };
    default:
      return { color: "bg-slate-500", textColor: "text-slate-400", label: "Unknown", icon: Minus };
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    case "down":
      return <TrendingDown className="w-4 h-4 text-red-400" />;
    default:
      return <Minus className="w-4 h-4 text-slate-400" />;
  }
};

export const WeeklyUpdateSlide = () => {
  const { data } = useAccountData();
  const { accountStrategy, generatedPlan, basics, financial } = data;

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const weekNumber = Math.ceil((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));

  // AI-generated context
  const isAIGenerated = !!generatedPlan?.weeklyUpdateContext;
  const weeklyContext = generatedPlan?.weeklyUpdateContext;
  const overallStatus = weeklyContext?.overallStatus || "On Track";

  // Derive workstreams from Big Bets or AI-generated keyWorkstreams
  const bigBets = accountStrategy?.bigBets || [];
  const aiWorkstreams = generatedPlan?.keyWorkstreams || [];
  
  const workstreamStatus = bigBets.length > 0 
    ? bigBets.slice(0, 3).map((bet, index) => ({
        name: bet.title,
        status: index === 1 ? "at-risk" : "on-track", // Example status logic
        progress: bet.dealStatus === "Active Pursuit" ? 75 : bet.dealStatus === "Strategic Initiative" ? 45 : 60,
        milestone: bet.subtitle || "In Progress",
        nextMilestone: `Close ${bet.targetClose}`,
        owner: bet.people?.[0]?.name || "TBD",
        dueDate: bet.targetClose,
        acv: bet.netNewACV,
      }))
    : aiWorkstreams.slice(0, 3).map((ws, index) => ({
        name: ws.title,
        status: index === 1 ? "at-risk" : "on-track",
        progress: 60,
        milestone: ws.subtitle || "In Progress",
        nextMilestone: `Close ${ws.targetClose}`,
        owner: ws.people?.[0]?.name || "TBD",
        dueDate: ws.targetClose,
        acv: ws.acv,
      }));

  // Calculate metrics from real data
  const totalACV = bigBets.reduce((sum, bet) => {
    const acv = parseFloat(bet.netNewACV?.replace(/[^0-9.]/g, '') || '0');
    return sum + acv;
  }, 0);
  
  const weeklyMetrics = [
    { label: "Pipeline Value", value: `$${totalACV.toFixed(1)}M`, change: "+12%", trend: "up", icon: TrendingUp },
    { label: "Active Opportunities", value: String(bigBets.length || aiWorkstreams.length), change: "+2", trend: "up", icon: Target },
    { label: "Deals in Close", value: String(bigBets.filter(b => b.dealStatus === "Active Pursuit").length), change: "0", trend: "neutral", icon: Clock },
    { label: "Current ACV", value: basics.currentContractValue || "$0", change: "", trend: "neutral", icon: CheckCircle2 },
  ];

  // Key accomplishments from AI or defaults
  const keyHighlights = weeklyContext?.keyHighlights || [
    "Secured executive sponsorship from COO for CRM initiative",
    "Completed technical discovery with IT architecture team",
    "Delivered ROI analysis showing 3.2x return over 3 years",
  ];

  // Critical actions from AI or defaults
  const criticalActions = weeklyContext?.criticalActions || [
    "Approval for expanded POC scope (+$50K)",
    "Alignment on contract structure (multi-year vs annual)",
  ];

  // Derive risks from AI plan
  const risksAndBlockers = (generatedPlan?.risksMitigations || []).slice(0, 2).map(r => ({
    issue: r.risk,
    severity: r.level?.toLowerCase() || "medium",
    mitigation: r.mitigation,
  }));

  // Derive next priorities from engagement data
  const nextWeekPriorities = (data.engagement?.plannedExecutiveEvents || []).slice(0, 3).map((event, i) => ({
    action: event,
    date: `Week ${weekNumber + 1}`,
    owner: "Account Team",
  }));

  const statusConfig = getStatusConfig(overallStatus);

  return (
    <div className="min-h-screen p-8 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-primary/80 bg-primary/10 px-3 py-1 rounded-full">
                Week {weekNumber} • FY25
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Weekly Stakeholder Update</h1>
            <p className="text-muted-foreground">{currentDate} • {basics.accountName}</p>
          </div>
          <div className="flex items-center gap-3">
            <RegenerateSectionButton section="weeklyUpdateContext" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Account Status</div>
              <div className={`flex items-center gap-2 ${statusConfig.color}/10 border ${statusConfig.color}/20 rounded-full px-4 py-2`}>
                <div className={`w-2 h-2 rounded-full ${statusConfig.color} animate-pulse`} />
                <span className={`${statusConfig.textColor} font-semibold`}>{statusConfig.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {weeklyMetrics.map((metric, index) => (
            <div
              key={metric.label}
              className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-5 hover:border-primary/30 transition-all duration-300 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <metric.icon className="w-5 h-5 text-primary" />
                </div>
                {metric.change && (
                  <div className="flex items-center gap-1">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-sm font-medium ${
                      metric.trend === "up" ? "text-emerald-400" : 
                      metric.trend === "down" ? "text-red-400" : "text-slate-400"
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Workstream Progress */}
          <div className="col-span-2 bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Workstream Progress</h2>
            </div>
            <div className="space-y-4">
              {workstreamStatus.length > 0 ? workstreamStatus.map((ws, index) => {
                const wsStatusConfig = getStatusConfig(ws.status);
                return (
                  <div
                    key={ws.name}
                    className="bg-background/50 rounded-xl p-4 border border-border/30 opacity-0 animate-fade-in"
                    style={{ animationDelay: `${200 + index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">{ws.name}</h3>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${wsStatusConfig.color}/20 ${wsStatusConfig.textColor} border border-current/20`}>
                          {wsStatusConfig.label}
                        </span>
                        {ws.acv && (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {ws.acv}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {ws.owner}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {ws.dueDate}
                        </span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{ws.milestone}</span>
                        <span className="text-foreground font-medium">{ws.progress}%</span>
                      </div>
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            ws.status === "on-track" ? "bg-gradient-to-r from-emerald-500 to-emerald-400" :
                            ws.status === "at-risk" ? "bg-gradient-to-r from-amber-500 to-amber-400" :
                            "bg-gradient-to-r from-red-500 to-red-400"
                          }`}
                          style={{ width: `${ws.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Next:</span>
                      <span className="text-foreground">{ws.nextMilestone}</span>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-muted-foreground text-sm">No workstreams defined. Add Big Bets in the Input Form.</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Key Highlights */}
            <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-foreground">Key Highlights</h2>
              </div>
              <ul className="space-y-3">
                {keyHighlights.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Critical Actions */}
            <div className="bg-card/40 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Flag className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-foreground">Decisions Needed</h2>
              </div>
              <ul className="space-y-3">
                {criticalActions.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Risks & Blockers */}
          <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-foreground">Risks & Blockers</h2>
            </div>
            <div className="space-y-3">
              {risksAndBlockers.length > 0 ? risksAndBlockers.map((risk, index) => (
                <div key={index} className="bg-background/50 rounded-xl p-4 border border-border/30">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                      risk.severity === "high" ? "bg-red-400" :
                      risk.severity === "medium" ? "bg-amber-400" : "bg-slate-400"
                    }`} />
                    <div>
                      <p className="text-sm text-foreground mb-2">{risk.issue}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <Zap className="w-3 h-3 text-primary" />
                        <span className="text-muted-foreground">{risk.mitigation}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No risks identified. Generate plan to populate.</p>
              )}
            </div>
          </div>

          {/* Next Week Priorities */}
          <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <ArrowRight className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Upcoming Events</h2>
            </div>
            <div className="space-y-3">
              {nextWeekPriorities.length > 0 ? nextWeekPriorities.map((priority, index) => (
                <div key={index} className="flex items-center justify-between bg-background/50 rounded-xl p-4 border border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{priority.action}</p>
                      <p className="text-xs text-muted-foreground">{priority.owner}</p>
                    </div>
                  </div>
                  <div className="text-sm text-primary font-medium">{priority.date}</div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No events scheduled. Add in Executive Engagement.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
