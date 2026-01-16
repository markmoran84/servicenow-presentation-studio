import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Zap, TrendingUp, Calendar, Users, Lightbulb, Sparkles, Box, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const normalizeInsightText = (raw: string) => {
  const text = (raw || "").trim();
  if (!text) return "";
  if (!text.includes('"options"')) return raw;

  try {
    const parsed = JSON.parse(text);
    const opts = Array.isArray(parsed?.options) ? parsed.options : [];
    const first = opts.find((o: any) => typeof o === "string" && o.trim()) as string | undefined;
    if (first) return first.trim();
  } catch {
    const idx = text.indexOf("[");
    if (idx !== -1) {
      const slice = text.slice(idx);
      const matches = [...slice.matchAll(/"((?:\\.|[^"\\])*)"/g)].map((m) => m[1].replace(/\\"/g, '"'));
      const first = matches.find((m) => m.trim());
      if (first) return first.trim();
    }
  }

  return raw;
};

export const BigBetsSlide = () => {
  const { data } = useAccountData();
  const { generatedPlan, accountStrategy } = data;

  // Priority: accountStrategy.bigBets > generatedPlan.keyWorkstreams > empty
  const isFromAccountStrategy = accountStrategy?.bigBets && accountStrategy.bigBets.length > 0;
  const isAIGenerated = !isFromAccountStrategy && !!generatedPlan?.keyWorkstreams && generatedPlan.keyWorkstreams.length > 0;

  const workstreams = isFromAccountStrategy
    ? accountStrategy.bigBets.slice(0, 3).map((bet: any, idx: number) => ({
        title: bet.title,
        subtitle: bet.subtitle || "Strategic Initiative",
        dealClose: bet.targetClose,
        dealStatus: bet.dealStatus || "Pipeline",
        statusColor: idx === 0 ? "bg-primary" : idx === 1 ? "bg-accent" : "bg-primary",
        insight: bet.insight,
        netNewACV: bet.netNewACV,
        steadyStateBenefit: bet.steadyStateBenefit || "TBD",
        products: bet.products || [],
        people: bet.people || [],
      }))
    : isAIGenerated
    ? generatedPlan.keyWorkstreams.map((ws, idx) => ({
        title: ws.title,
        subtitle: ws.subtitle || "Strategic Initiative",
        dealClose: ws.targetClose,
        dealStatus: ws.dealStatus || (idx === 0 ? "Active Pursuit" : idx === 1 ? "Strategic Initiative" : "Foundation Growth"),
        statusColor: idx === 0 ? "bg-primary" : idx === 1 ? "bg-accent" : "bg-primary",
        insight: ws.insight,
        netNewACV: ws.acv,
        steadyStateBenefit: ws.steadyStateBenefit || "TBD",
        products: [],
        people: ws.people || [],
      }))
    : [];

  // Priority: accountStrategy.keyExecutives > engagement.knownExecutiveSponsors > empty
  const executives = (accountStrategy?.keyExecutives && accountStrategy.keyExecutives.length > 0)
    ? accountStrategy.keyExecutives.slice(0, 6)
    : data.engagement.knownExecutiveSponsors.length > 0
      ? data.engagement.knownExecutiveSponsors.slice(0, 6).map((sponsor: string) => {
          const parts = sponsor.split("(");
          return {
            name: parts[0].trim(),
            role: parts[1]?.replace(")", "") || "Executive Sponsor",
          };
        })
      : [];

  const hasContent = workstreams.length > 0;

  return (
    <div className="px-8 pt-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 opacity-0 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Big Bets</h1>
          <p className="text-muted-foreground mt-1">Strategic transformation workstreams aligned to accelerate impact</p>
        </div>
        <div className="flex items-center gap-2">
          <RegenerateSectionButton section="keyWorkstreams" />
          {isAIGenerated && (
            <span className="badge-accent">
              <Sparkles className="w-3 h-3 mr-1.5" />
              AI Generated
            </span>
          )}
          <span className="badge-primary">FY26 Big Bets</span>
        </div>
      </div>

      {!hasContent ? (
        <div className="glass-card rounded-2xl p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Big Bets Configured</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Complete the Input Form with account details and click <span className="font-medium text-foreground">Generate with AI</span> to create strategic Big Bets tailored to your account priorities.
          </p>
        </div>
      ) : (
        <>
          {/* Executive Row */}
          {executives.length > 0 && (
            <div className="glass-card p-4 mb-4 opacity-0 animate-fade-in animation-delay-100">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Key Executives</span>
              </div>
              <div className="relative">
                <div className="absolute top-5 left-8 right-8 h-0.5 bg-gradient-to-r from-primary via-primary to-primary/50" />
                <div className="flex items-center justify-between relative">
                  {executives.map((exec) => (
                    <div key={exec.name || 'exec'} className="flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center mb-1 z-10">
                        <span className="text-xs font-bold text-foreground">
                          {(exec.name || '').split(' ').filter(Boolean).map(n => n[0] || '').join('')}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-foreground">{exec.name || 'TBD'}</span>
                      <span className="text-[9px] text-muted-foreground">{exec.role || 'Executive'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Workstreams Grid */}
          <div className="grid grid-cols-3 gap-4">
            {workstreams.map((stream, index) => (
              <div
                key={stream.title}
                className="glass-card p-0 overflow-hidden opacity-0 animate-fade-in"
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                {/* Stream Header */}
                <div className="p-4 border-b border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stream.statusColor} text-background`}>
                      {stream.dealStatus}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Close: {stream.dealClose || "TBD"}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-foreground text-sm leading-tight">{stream.title}</h3>
                  <p className="text-xs text-primary mt-0.5">{stream.subtitle}</p>
                  
                  {/* Products Tags */}
                  {stream.products && stream.products.length > 0 && (
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      <Box className="w-3 h-3 text-muted-foreground" />
                      {stream.products.map((product: string) => (
                        <Badge 
                          key={product} 
                          variant="outline" 
                          className="text-[9px] px-1.5 py-0 h-4 bg-accent/10 border-accent/30 text-accent"
                        >
                          {product}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Insight Section */}
                <div className="p-4 border-b border-border/30">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Lightbulb className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Insights</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {normalizeInsightText(stream.insight) || "Strategic insight pending generation."}
                  </p>
                </div>

                {/* Financials */}
                <div className="p-4 border-b border-border/30">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] text-muted-foreground block mb-0.5">Net new ACV</span>
                      <span className="text-xl font-bold text-primary">{stream.netNewACV || "TBD"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-muted-foreground block mb-0.5">Steady-state benefit</span>
                      <span className="text-xl font-bold text-primary">{stream.steadyStateBenefit}</span>
                    </div>
                  </div>
                  <div className="mt-3 h-1 rounded-full bg-border/50 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${stream.statusColor}`}
                      style={{ width: index === 0 ? '75%' : index === 1 ? '40%' : '55%' }}
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
                      {stream.people.slice(0, 4).map((person, pIdx) => (
                        <div key={person?.name || `person-${pIdx}`} className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-background border border-primary/50 flex items-center justify-center flex-shrink-0">
                            <span className="text-[8px] font-bold text-foreground">
                              {(person?.name || '').split(' ').filter(Boolean).map(n => n[0] || '').join('')}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-medium text-foreground block truncate">{person?.name || 'TBD'}</span>
                            <span className="text-[9px] text-muted-foreground block truncate">{person?.role || 'Team Member'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary Callout */}
          {workstreams.length > 0 && (
            <div className="mt-4 glass-card p-3 flex items-center gap-4 opacity-0 animate-fade-in animation-delay-600">
              <div className="icon-box animate-pulse-glow">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold text-foreground">{workstreams[0]?.title?.split('–')[0]?.trim() || 'Primary Initiative'} is the Primary Commercial Wedge</span>
                <span className="text-sm text-muted-foreground ml-2">— Priority focus. Success unlocks multi-workflow expansion.</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">
                  {workstreams.reduce((sum, w) => {
                    const rawVal = w.netNewACV;
                    const strVal = typeof rawVal === 'number' ? String(rawVal) : (rawVal || "0");
                    const val = parseFloat(strVal.replace(/[^0-9.]/g, "")) || 0;
                    return sum + val;
                  }, 0).toFixed(0)}M+
                </span>
                <span className="text-xs text-muted-foreground block">Total ACV Opportunity</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
