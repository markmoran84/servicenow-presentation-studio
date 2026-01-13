import { useAccountData } from "@/context/AccountDataContext";
import { 
  Target, 
  TrendingUp, 
  Clock, 
  Users, 
  DollarSign,
  Calendar,
  ChevronRight,
  Layers,
  Zap,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Accelerating": return "bg-primary text-primary-foreground";
    case "On Track": return "bg-accent/20 text-accent border border-accent/30";
    case "Needs Attention": return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    case "At Risk": return "bg-destructive/20 text-destructive border border-destructive/30";
    case "Early Stage": return "bg-muted text-muted-foreground border border-border";
    default: return "bg-muted text-muted-foreground";
  }
};

const getStageProgress = (stage: string) => {
  switch (stage) {
    case "Qualification": return 20;
    case "Discovery": return 40;
    case "Proof of Value": return 55;
    case "Proposal": return 70;
    case "Negotiation": return 85;
    case "Closed Won": return 100;
    default: return 10;
  }
};

const getDealStatusStyle = (status: string) => {
  switch (status) {
    case "Active Pursuit": return "bg-primary text-background";
    case "Strategic Initiative": return "bg-accent text-background";
    case "Foundation Growth": return "bg-primary/80 text-background";
    default: return "bg-muted text-foreground";
  }
};

export const WorkstreamDetailSlide = () => {
  const { data } = useAccountData();
  const { accountStrategy, basics } = data;
  const companyName = basics.accountName || "the customer";

  // Use account strategy big bets if available
  const workstreams = accountStrategy?.bigBets && accountStrategy.bigBets.length > 0
    ? accountStrategy.bigBets.map((bet) => ({
        title: bet.title,
        subtitle: bet.subtitle || "Strategic Initiative",
        dealClose: bet.targetClose,
        dealStatus: bet.dealStatus,
        netNewACV: bet.netNewACV,
        steadyStateBenefit: bet.steadyStateBenefit || "TBD",
        insight: bet.insight,
        people: bet.people || [],
        opportunities: bet.products?.map((product, idx) => {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const closeMonth = months[(new Date().getMonth() + idx + 2) % 12];
          const closeYear = new Date().getFullYear() + (new Date().getMonth() + idx + 2 >= 12 ? 1 : 0);
          return {
            name: `${product} Implementation`,
            value: `$${(Math.random() * 1.5 + 0.2).toFixed(1)}M`,
            stage: ["Qualification", "Discovery", "Proposal", "Negotiation"][idx % 4],
            probability: Math.floor(Math.random() * 40 + 40),
            status: ["On Track", "Accelerating", "Needs Attention", "On Track"][idx % 4],
            oppNumber: `OPP-${new Date().getFullYear()}-${String(idx + 1).padStart(3, '0')}`,
            closeDate: `${closeMonth} ${closeYear}`,
            products: [product],
          };
        }) || [],
      }))
    : [];

  const hasWorkstreams = workstreams.length > 0;

  const totalPipelineValue = workstreams.reduce((acc, ws) => {
    const value = parseFloat(ws.netNewACV?.replace(/[^0-9.]/g, '') || '0');
    return acc + value;
  }, 0);

  return (
    <div className="h-full overflow-auto px-8 pt-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 opacity-0 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Workstream Deep Dive</h1>
          <p className="text-muted-foreground mt-1">Detailed view of opportunities and initiatives across strategic workstreams</p>
        </div>
        {hasWorkstreams && (
          <div className="flex items-center gap-3">
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Total Pipeline:</span>
              <span className="text-lg font-bold text-primary">${totalPipelineValue}M</span>
            </div>
            <span className="badge-primary">
              <Layers className="w-3 h-3 mr-1.5" />
              {workstreams.length} Workstreams
            </span>
          </div>
        )}
      </div>

      {hasWorkstreams ? (
        <>
          {/* Workstream Cards */}
          <div className="space-y-5">
            {workstreams.map((workstream, wsIndex) => (
              <div 
                key={workstream.title} 
                className="glass-card p-0 overflow-hidden opacity-0 animate-fade-in"
                style={{ animationDelay: `${100 + wsIndex * 150}ms` }}
              >
                {/* Workstream Header */}
                <div className="p-5 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 border-b border-border/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${getDealStatusStyle(workstream.dealStatus)}`}>
                          {workstream.dealStatus}
                        </span>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-xs">Target: {workstream.dealClose}</span>
                        </div>
                      </div>
                      <h2 className="text-xl font-bold text-foreground">{workstream.title}</h2>
                      <p className="text-sm text-primary mt-0.5">{workstream.subtitle}</p>
                    </div>

                    {/* Value Summary */}
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground block">Net New ACV</span>
                        <span className="text-2xl font-bold text-primary">{workstream.netNewACV}</span>
                      </div>
                      <div className="w-px h-12 bg-border/50" />
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground block">Steady-State</span>
                        <span className="text-2xl font-bold text-foreground/80">{workstream.steadyStateBenefit}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Opportunities Grid */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-foreground uppercase tracking-wider">Opportunities & Initiatives</span>
                    <span className="text-xs text-muted-foreground ml-2">({workstream.opportunities.length} active)</span>
                  </div>

                  {workstream.opportunities.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {workstream.opportunities.map((opp) => (
                        <div 
                          key={opp.name}
                          className="group relative bg-background/50 rounded-xl border border-border/50 p-4 hover:border-primary/30 hover:bg-background/80 transition-all duration-300"
                        >
                          {/* Status Badge */}
                          <div className="flex items-center justify-between mb-3">
                            <Badge className={`text-[10px] px-2 py-0.5 ${getStatusColor(opp.status)}`}>
                              {opp.status}
                            </Badge>
                            <span className="text-lg font-bold text-primary">{opp.value}</span>
                          </div>

                          {/* Opportunity Number & Close Date */}
                          <div className="flex items-center justify-between mb-2">
                            {opp.oppNumber && (
                              <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                                {opp.oppNumber}
                              </span>
                            )}
                            {opp.closeDate && (
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {opp.closeDate}
                              </span>
                            )}
                          </div>

                          {/* Opportunity Name */}
                          <h4 className="font-semibold text-sm text-foreground mb-2 leading-tight">{opp.name}</h4>

                          {/* Products */}
                          {opp.products && opp.products.length > 0 && (
                            <div className="flex items-center gap-1 mb-2 flex-wrap">
                              {opp.products.map((product: string) => (
                                <Badge 
                                  key={product}
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 bg-accent/10 border-accent/30 text-accent"
                                >
                                  {product}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Stage & Progress */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">{opp.stage}</span>
                              <span className="text-primary font-medium">{opp.probability}%</span>
                            </div>
                            <Progress value={getStageProgress(opp.stage)} className="h-1.5" />
                          </div>

                          {/* Hover Arrow */}
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No opportunities defined for this workstream.</p>
                  )}

                  {/* People & Insight Row */}
                  <div className="mt-4 pt-4 border-t border-border/30 flex items-start gap-6">
                    {/* Key People */}
                    {workstream.people.length > 0 && (
                      <div className="flex-shrink-0">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Users className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs font-bold text-primary uppercase tracking-wider">Key Stakeholders</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {workstream.people.slice(0, 4).map((person) => (
                            <div key={person.name} className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-foreground">
                                  {person.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs font-medium text-foreground block">{person.name}</span>
                                <span className="text-[10px] text-muted-foreground block">{person.role}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Insight */}
                    {workstream.insight && (
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Zap className="w-3.5 h-3.5 text-accent" />
                          <span className="text-xs font-bold text-accent uppercase tracking-wider">Strategic Insight</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{workstream.insight}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Footer */}
          <div className="mt-5 glass-card p-4 flex items-center justify-between opacity-0 animate-fade-in animation-delay-600">
            <div className="flex items-center gap-4">
              <div className="icon-box">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-sm font-semibold text-foreground">Pipeline Health Overview</span>
                <p className="text-xs text-muted-foreground">Track progress across all workstreams and opportunities</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">On Track</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-xs text-muted-foreground">Needs Attention</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-xs text-muted-foreground">At Risk</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Workstreams Defined</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Complete the Input Form with Big Bets data to see detailed workstream breakdowns for {companyName}. Add initiatives, products, and stakeholders to populate this view.
          </p>
        </div>
      )}
    </div>
  );
};
