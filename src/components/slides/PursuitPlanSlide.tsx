import { useAccountData } from "@/context/AccountDataContext";
import { Target, Calendar, DollarSign, Users, ArrowRight, CheckCircle, Clock, Zap, AlertCircle } from "lucide-react";

export const PursuitPlanSlide = () => {
  const { data } = useAccountData();
  const { basics, accountStrategy, generatedPlan } = data;

  // Build pursuits from big bets / key workstreams
  const bigBets = accountStrategy.bigBets || [];
  const keyWorkstreams = generatedPlan?.keyWorkstreams || [];
  
  // Transform big bets into pursuit format
  const pursuits = bigBets.length > 0 
    ? bigBets.map((bet, idx) => ({
        name: bet.title,
        product: bet.products?.join(", ") || "ServiceNow Platform",
        stage: bet.dealStatus || "Discovery",
        closeDate: bet.targetClose || "TBD",
        acv: bet.netNewACV || "$0",
        probability: bet.dealStatus === "Active Pursuit" ? 65 : bet.dealStatus === "Strategic Initiative" ? 50 : 35,
        sponsor: bet.people?.[0]?.name || "TBD",
        nextAction: bet.insight || "Define next steps",
        status: bet.dealStatus === "Active Pursuit" ? "on-track" as const : "at-risk" as const,
      }))
    : keyWorkstreams.slice(0, 4).map((ws, idx) => ({
        name: ws.title,
        product: "ServiceNow Platform",
        stage: ws.dealStatus || "Discovery",
        closeDate: ws.targetClose || "TBD",
        acv: ws.acv || "$0",
        probability: idx === 0 ? 65 : idx === 1 ? 50 : 35,
        sponsor: ws.people?.[0]?.name || "TBD",
        nextAction: ws.insight || "Define next steps",
        status: idx === 0 ? "on-track" as const : "at-risk" as const,
      }));

  const parseACV = (acv: string) => {
    const cleaned = acv.replace(/[^0-9.]/g, '');
    const value = parseFloat(cleaned) || 0;
    if (acv.toLowerCase().includes('k')) return value / 1000;
    return value;
  };

  const totalACV = pursuits.reduce((sum, p) => sum + parseACV(p.acv), 0);
  const weightedACV = pursuits.reduce((sum, p) => sum + (parseACV(p.acv) * p.probability / 100), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track": return "bg-primary text-primary-foreground";
      case "at-risk": return "bg-amber-500 text-white";
      case "closed": return "bg-accent text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getProgressColor = (probability: number) => {
    if (probability >= 60) return "bg-primary";
    if (probability >= 40) return "bg-accent";
    return "bg-amber-500";
  };

  const hasData = pursuits.length > 0;

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Target className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Pursuit Plan</h1>
              <p className="text-muted-foreground text-lg">
                {basics.accountName ? `${basics.accountName} — Commercial Roadmap` : "Commercial Roadmap"}
              </p>
            </div>
          </div>
          
          {hasData && (
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total Pipeline</p>
                <p className="text-2xl font-bold text-foreground">${totalACV.toFixed(1)}M</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Weighted Value</p>
                <p className="text-2xl font-bold text-primary">${weightedACV.toFixed(1)}M</p>
              </div>
            </div>
          )}
        </div>

        {!hasData ? (
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in">
            <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Pursuits Defined</h3>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
              Add Big Bets in the Input Form or generate an AI-powered plan to populate the commercial pursuit roadmap.
            </p>
          </div>
        ) : (
          <>
            {/* Pursuit Cards */}
            <div className="space-y-4">
              {pursuits.map((pursuit, index) => (
                <div
                  key={pursuit.name}
                  className="glass-card overflow-hidden opacity-0 animate-fade-in"
                  style={{ animationDelay: `${100 + index * 100}ms` }}
                >
                  <div className="grid grid-cols-12 gap-4 p-5">
                    {/* Pursuit Info */}
                    <div className="col-span-5">
                      <div className="flex items-start gap-3">
                        <div className={`px-2 py-1 rounded text-[10px] font-bold ${getStatusColor(pursuit.status)}`}>
                          {pursuit.status.replace("-", " ").toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground mb-1">{pursuit.name}</h3>
                          <p className="text-sm text-primary">{pursuit.product}</p>
                        </div>
                      </div>
                    </div>

                    {/* Stage & Timeline */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Stage</span>
                      </div>
                      <p className="font-semibold text-foreground text-sm">{pursuit.stage}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3 text-accent" />
                        <span className="text-xs text-accent">{pursuit.closeDate}</span>
                      </div>
                    </div>

                    {/* Value & Probability */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Value</span>
                      </div>
                      <p className="text-xl font-bold text-gradient">{pursuit.acv}</p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Probability</span>
                          <span className="font-semibold text-foreground">{pursuit.probability}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-border overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${getProgressColor(pursuit.probability)}`}
                            style={{ width: `${pursuit.probability}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sponsor & Next Action */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Executive Sponsor</span>
                      </div>
                      <p className="text-sm font-medium text-foreground mb-2">{pursuit.sponsor}</p>
                      <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                        <div className="flex items-start gap-2">
                          <ArrowRight className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-foreground">{pursuit.nextAction}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pipeline Summary */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="glass-card p-5 text-center opacity-0 animate-fade-in" style={{ animationDelay: "500ms" }}>
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">{pursuits.length}</p>
                <p className="text-sm text-muted-foreground">Active Pursuits</p>
              </div>
              <div className="glass-card p-5 text-center opacity-0 animate-fade-in" style={{ animationDelay: "550ms" }}>
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary">{pursuits.filter(p => p.status === 'on-track').length}</p>
                <p className="text-sm text-muted-foreground">On Track</p>
              </div>
              <div className="glass-card p-5 text-center opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <p className="text-3xl font-bold text-accent">{pursuits[0]?.closeDate?.split(" ")[0] || "Q1"}</p>
                <p className="text-sm text-muted-foreground">Priority Close</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
