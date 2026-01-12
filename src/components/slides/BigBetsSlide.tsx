import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { SlideFooter } from "@/components/SlideFooter";
import { Zap, TrendingUp, Calendar, Users, Lightbulb, Sparkles, Box, Info, Target, DollarSign, Rocket } from "lucide-react";
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

const streamStyles = [
  { gradient: "from-primary/20 to-cyan-500/10", border: "border-primary/40", statusBg: "bg-gradient-to-r from-primary to-cyan-500", accent: "text-primary" },
  { gradient: "from-emerald-500/20 to-teal-500/10", border: "border-emerald-500/40", statusBg: "bg-gradient-to-r from-emerald-500 to-teal-500", accent: "text-emerald-400" },
  { gradient: "from-purple-500/20 to-pink-500/10", border: "border-purple-500/40", statusBg: "bg-gradient-to-r from-purple-500 to-pink-500", accent: "text-purple-400" },
];

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
        style: streamStyles[idx % streamStyles.length],
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
        style: streamStyles[idx % streamStyles.length],
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
    <div className="min-h-screen p-6 md:p-10 pb-28 relative overflow-hidden">
      {/* Background gradient accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[900px] h-[600px] bg-gradient-to-bl from-primary/6 via-cyan-500/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[500px] bg-gradient-to-tr from-emerald-500/6 via-teal-500/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 opacity-0 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/30">
              <Rocket className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-primary via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Big Bets
                </span>
              </h1>
              <p className="text-muted-foreground text-lg mt-1">Strategic transformation workstreams aligned to accelerate impact</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <RegenerateSectionButton section="keyWorkstreams" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 text-xs text-accent font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                AI Generated
              </span>
            )}
            <span className="px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-semibold">
              FY26 Big Bets
            </span>
          </div>
        </div>

        {!hasContent ? (
          <div 
            className="glass-card p-16 text-center border border-slate-600/30 opacity-0 animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            <div className="w-20 h-20 rounded-2xl bg-muted/10 flex items-center justify-center mx-auto mb-6 border border-muted/20">
              <Info className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">No Big Bets Configured</h3>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Complete the Input Form with account details and click <span className="font-medium text-foreground">Generate with AI</span> to create strategic Big Bets tailored to your account priorities.
            </p>
          </div>
        ) : (
          <>
            {/* Executive Row */}
            {executives.length > 0 && (
              <div 
                className="glass-card p-5 mb-6 border border-slate-600/40 bg-gradient-to-r from-slate-800/90 via-primary/5 to-slate-800/90 opacity-0 animate-fade-in"
                style={{ animationDelay: "80ms" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-foreground uppercase tracking-wider">Key Executives</span>
                </div>
                <div className="relative">
                  <div className="absolute top-6 left-12 right-12 h-0.5 bg-gradient-to-r from-primary via-emerald-500 to-purple-500 rounded-full" />
                  <div className="flex items-center justify-between relative">
                    {executives.map((exec) => (
                      <div key={exec.name || 'exec'} className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-primary flex items-center justify-center mb-2 z-10 shadow-lg shadow-primary/20">
                          <span className="text-sm font-bold text-foreground">
                            {(exec.name || '').split(' ').filter(Boolean).map(n => n[0] || '').join('')}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-foreground">{exec.name || 'TBD'}</span>
                        <span className="text-[10px] text-muted-foreground">{exec.role || 'Executive'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Workstreams Grid */}
            <div className="grid grid-cols-3 gap-5">
              {workstreams.map((stream, index) => (
                <div
                  key={stream.title}
                  className={`glass-card p-0 overflow-hidden border ${stream.style.border} bg-gradient-to-br from-slate-800/90 to-slate-900/70 
                             hover:shadow-xl transition-all duration-300 opacity-0 animate-fade-in`}
                  style={{ animationDelay: `${150 + index * 80}ms` }}
                >
                  {/* Stream Header */}
                  <div className={`p-5 border-b border-slate-600/40 bg-gradient-to-r ${stream.style.gradient}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${stream.style.statusBg} text-white shadow-sm`}>
                        {stream.dealStatus}
                      </span>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs">Close: {stream.dealClose || "TBD"}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-foreground text-base leading-tight mb-1">{stream.title}</h3>
                    <p className={`text-xs ${stream.style.accent} font-medium`}>{stream.subtitle}</p>
                    
                    {/* Products Tags */}
                    {stream.products && stream.products.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                        <Box className="w-3.5 h-3.5 text-muted-foreground" />
                        {stream.products.map((product: string) => (
                          <Badge 
                            key={product} 
                            variant="outline" 
                            className={`text-[9px] px-2 py-0.5 bg-slate-700/50 border-slate-600/40 ${stream.style.accent}`}
                          >
                            {product}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Insight Section */}
                  <div className="p-5 border-b border-slate-600/40">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/30`}>
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Insights</span>
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed">
                      {normalizeInsightText(stream.insight) || "Strategic insight pending generation."}
                    </p>
                  </div>

                  {/* Financials */}
                  <div className="p-5 border-b border-slate-600/40">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <DollarSign className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Net new ACV</span>
                        </div>
                        <span className={`text-2xl font-bold ${stream.style.accent}`}>{stream.netNewACV || "TBD"}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <TrendingUp className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Steady-state benefit</span>
                        </div>
                        <span className={`text-2xl font-bold ${stream.style.accent}`}>{stream.steadyStateBenefit}</span>
                      </div>
                    </div>
                    <div className="mt-4 h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${stream.style.statusBg}`}
                        style={{ width: index === 0 ? '75%' : index === 1 ? '40%' : '55%' }}
                      />
                    </div>
                  </div>

                  {/* People Section */}
                  {stream.people.length > 0 && (
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                          <Users className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Team</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {stream.people.slice(0, 4).map((person, pIdx) => (
                          <div key={person?.name || `person-${pIdx}`} className="flex items-center gap-2 p-2 rounded-lg bg-slate-700/30 border border-slate-600/30">
                            <div className="w-7 h-7 rounded-full bg-slate-800 border border-primary/40 flex items-center justify-center flex-shrink-0">
                              <span className="text-[9px] font-bold text-foreground">
                                {(person?.name || '').split(' ').filter(Boolean).map(n => n[0] || '').join('')}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <span className="text-[10px] font-semibold text-foreground block truncate">{person?.name || 'TBD'}</span>
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
              <div 
                className="mt-6 glass-card p-5 border border-primary/30 bg-gradient-to-r from-slate-800/90 via-primary/10 to-slate-800/90 flex items-center gap-5 opacity-0 animate-fade-in"
                style={{ animationDelay: "500ms" }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-lg font-bold text-foreground">{workstreams[0]?.title?.split('–')[0]?.trim() || 'Primary Initiative'} is the Primary Commercial Wedge</span>
                  <span className="text-base text-muted-foreground ml-2">— Priority focus. Success unlocks multi-workflow expansion.</span>
                </div>
                <div className="text-right pl-6 border-l border-slate-600/40">
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                    {workstreams.reduce((sum, w) => {
                      const val = parseFloat((w.netNewACV || "0").replace(/[^0-9.]/g, "")) || 0;
                      return sum + val;
                    }, 0).toFixed(0)}M+
                  </span>
                  <span className="text-xs text-muted-foreground block mt-1">Total ACV Opportunity</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <SlideFooter />
    </div>
  );
};
