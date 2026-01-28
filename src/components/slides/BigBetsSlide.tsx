import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Zap, Calendar, Users, Lightbulb, Sparkles, Box, Info } from "lucide-react";
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

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Active Pursuit":
      return { bg: "bg-primary", text: "text-background" };
    case "Strategic Initiative":
      return { bg: "bg-accent", text: "text-background" };
    case "Planned":
    case "Pipeline":
      return { bg: "bg-muted", text: "text-foreground" };
    default:
      return { bg: "bg-primary/50", text: "text-foreground" };
  }
};

export const BigBetsSlide = () => {
  const { data } = useAccountData();
  const { generatedPlan, accountStrategy, engagement } = data;

  // Priority: accountStrategy.bigBets > generatedPlan.keyWorkstreams > empty
  const isFromAccountStrategy = accountStrategy?.bigBets && accountStrategy.bigBets.length > 0;
  const isAIGenerated = !isFromAccountStrategy && !!generatedPlan?.keyWorkstreams && generatedPlan.keyWorkstreams.length > 0;

  const workstreams = isFromAccountStrategy
    ? accountStrategy.bigBets.slice(0, 3).map((bet: any) => ({
        title: bet.title,
        subtitle: bet.subtitle || "Strategic Initiative",
        dealClose: bet.targetClose,
        dealStatus: bet.dealStatus || "Pipeline",
        insight: bet.insight,
        netNewACV: bet.netNewACV,
        steadyStateBenefit: bet.steadyStateBenefit || "TBD",
        products: bet.products || [],
        people: bet.people || [],
      }))
    : isAIGenerated
    ? generatedPlan.keyWorkstreams.map((ws) => ({
        title: ws.title,
        subtitle: ws.subtitle || "Strategic Initiative",
        dealClose: ws.targetClose,
        dealStatus: ws.dealStatus || "Active Pursuit",
        insight: ws.insight,
        netNewACV: ws.acv,
        steadyStateBenefit: ws.steadyStateBenefit || "TBD",
        products: [],
        people: ws.people || [],
      }))
    : [];

  // Executives from engagement or account strategy
  const executives = (accountStrategy?.keyExecutives && accountStrategy.keyExecutives.length > 0)
    ? accountStrategy.keyExecutives.slice(0, 12)
    : engagement.knownExecutiveSponsors.length > 0
      ? engagement.knownExecutiveSponsors.slice(0, 12).map((sponsor: string) => {
          const parts = sponsor.split("(");
          return {
            name: parts[0].trim(),
            role: parts[1]?.replace(")", "") || "Executive",
          };
        })
      : [];

  const hasContent = workstreams.length > 0;

  return (
    <div className="min-h-screen p-8 md:p-10 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 opacity-0 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary">Big Bets</h1>
            <p className="text-muted-foreground mt-1">Strategic transformation opportunities to accelerate impact</p>
          </div>
          <div className="flex items-center gap-2">
            <RegenerateSectionButton section="keyWorkstreams" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
          </div>
        </div>

        {!hasContent ? (
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Info className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Big Bets Configured</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Complete the Input Form with account details and click <span className="font-medium text-foreground">Generate with AI</span> to create strategic Big Bets.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Executive Timeline Row */}
            {executives.length > 0 && (
              <div className="glass-card p-4 opacity-0 animate-fade-in" style={{ animationDelay: "50ms" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Execs</span>
                </div>
                <div className="relative">
                  {/* Connection line */}
                  <div className="absolute top-5 left-6 right-6 h-0.5 bg-gradient-to-r from-primary via-primary to-primary/30" />
                  <div className="flex items-center justify-between relative">
                    {executives.map((exec, index) => (
                      <div key={exec.name || `exec-${index}`} className="flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center mb-1.5 z-10">
                          <span className="text-[10px] font-bold text-foreground">
                            {(exec.name || '').split(' ').filter(Boolean).map(n => n[0] || '').join('')}
                          </span>
                        </div>
                        <span className="text-[10px] font-medium text-foreground max-w-[70px] truncate">{exec.name || 'TBD'}</span>
                        <span className="text-[9px] text-muted-foreground max-w-[70px] truncate">{exec.role || 'Executive'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Workstreams Grid */}
            <div className="grid grid-cols-3 gap-4">
              {workstreams.map((stream, index) => {
                const statusStyles = getStatusStyles(stream.dealStatus);
                return (
                  <div
                    key={stream.title}
                    className="glass-card p-0 overflow-hidden opacity-0 animate-fade-in"
                    style={{ animationDelay: `${100 + index * 50}ms` }}
                  >
                    {/* Stream Header */}
                    <div className="p-4 border-b border-border/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${statusStyles.bg} ${statusStyles.text}`}>
                          {stream.dealStatus}
                        </span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Close: {stream.dealClose || "TBD"}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-foreground text-base leading-tight">{stream.title}</h3>
                      <p className="text-xs text-primary mt-0.5">{stream.subtitle}</p>
                      
                      {/* Products Tags */}
                      {stream.products && stream.products.length > 0 && (
                        <div className="flex items-center gap-1 mt-3 flex-wrap">
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
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {normalizeInsightText(stream.insight) || "Strategic insight pending generation."}
                      </p>
                    </div>

                    {/* Financials */}
                    <div className="p-4 border-b border-border/30">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] text-muted-foreground block mb-0.5">Net new contract value</span>
                          <span className="text-2xl font-bold text-primary">{stream.netNewACV || "TBD"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-muted-foreground block mb-0.5">Steady-state-benefit (Annual)</span>
                          <span className="text-2xl font-bold text-primary">{stream.steadyStateBenefit}</span>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-3 flex gap-1">
                        {[...Array(8)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-1.5 flex-1 rounded-full ${
                              i < (index === 0 ? 6 : index === 1 ? 4 : 3) 
                                ? 'bg-primary' 
                                : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-[9px] text-muted-foreground text-right mt-1">Pursuit Progress</p>
                    </div>

                    {/* Key Stakeholders Section */}
                    {stream.people.length > 0 && (
                      <div className="p-4">
                        <div className="flex items-center gap-1.5 mb-3">
                          <Users className="w-3.5 h-3.5 text-primary" />
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Key Stakeholders</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {stream.people.slice(0, 6).map((person, pIdx) => (
                            <div key={person?.name || `person-${pIdx}`} className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-background border border-primary/50 flex items-center justify-center flex-shrink-0">
                                <span className="text-[8px] font-bold text-foreground">
                                  {(person?.name || '').split(' ').filter(Boolean).map(n => n[0] || '').join('')}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <span className="text-[10px] font-medium text-foreground block truncate">{person?.name || 'TBD'}</span>
                                <span className="text-[9px] text-muted-foreground block truncate">{person?.role || 'Stakeholder'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
