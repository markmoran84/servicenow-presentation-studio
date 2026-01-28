import { useAccountData } from "@/context/AccountDataContext";
import { Calendar, Target, DollarSign } from "lucide-react";

export const RoadmapSlide = () => {
  const { data } = useAccountData();
  const { accountStrategy, generatedPlan, basics } = data;
  
  const companyName = basics.accountName || "Customer";
  
  // Get workstreams from big bets or generated plan
  const bigBets = accountStrategy?.bigBets?.length > 0 
    ? accountStrategy.bigBets 
    : generatedPlan?.keyWorkstreams?.map(ws => ({
        title: ws.title,
        netNewACV: ws.acv,
        targetClose: ws.targetClose,
        dealStatus: ws.dealStatus || "Pipeline",
      })) || [];

  // Color palette for workstreams
  const workstreamColors = [
    "bg-blue-500/60",
    "bg-purple-500/60",
    "bg-indigo-500/60",
    "bg-cyan-500/60",
    "bg-emerald-500/60",
  ];

  // Build workstreams from big bets
  const workstreams = bigBets.slice(0, 5).map((bet, idx) => ({
    name: bet.title,
    color: workstreamColors[idx % workstreamColors.length],
    nnacv: bet.netNewACV || "",
    targetClose: bet.targetClose || "",
  }));

  // Calculate total ACV
  const totalACV = workstreams.reduce((sum, ws) => {
    const value = parseFloat(ws.nnacv?.replace(/[^0-9.]/g, '') || '0');
    return sum + value;
  }, 0);

  // Generate quarters dynamically
  const currentYear = new Date().getFullYear();
  const currentQuarter = Math.floor(new Date().getMonth() / 3) + 1;
  const quarters: string[] = [];
  
  for (let i = 0; i < 6; i++) {
    const q = ((currentQuarter - 1 + i) % 4) + 1;
    const year = currentYear + Math.floor((currentQuarter - 1 + i) / 4);
    quarters.push(`Q${q}-${String(year).slice(-2)}`);
  }
  quarters.push("NNACV");

  // Determine which quarter each workstream targets
  const getTargetQuarterIndex = (targetClose: string): number => {
    if (!targetClose) return -1;
    const match = targetClose.match(/Q(\d)[\s-]?(\d{2,4})/i);
    if (match) {
      const targetQ = parseInt(match[1]);
      const targetYear = match[2].length === 2 ? 2000 + parseInt(match[2]) : parseInt(match[2]);
      for (let i = 0; i < quarters.length - 1; i++) {
        const qMatch = quarters[i].match(/Q(\d)-(\d{2})/);
        if (qMatch) {
          const qNum = parseInt(qMatch[1]);
          const qYear = 2000 + parseInt(qMatch[2]);
          if (targetQ === qNum && targetYear === qYear) return i;
        }
      }
    }
    return -1;
  };

  return (
    <div className="min-h-screen p-8 pb-32 relative">
      {/* Draft Badge */}
      <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
        <div className="absolute top-6 -right-8 w-40 bg-primary text-background text-sm font-bold py-1.5 text-center rotate-45 shadow-lg">
          Draft
        </div>
      </div>

      {/* Header */}
      <div className="mb-8 opacity-0 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
          Roadmap to ${totalACV > 0 ? `${totalACV}M` : "TBD"} ACV
        </h1>
        <p className="text-muted-foreground">Strategic timeline for {companyName} transformation initiatives</p>
      </div>

      {workstreams.length > 0 ? (
        <div className="opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          {/* Header Row */}
          <div className={`grid border-b border-white/20`} style={{ gridTemplateColumns: `200px repeat(${quarters.length}, 1fr)` }}>
            <div className="py-4 px-4 text-sm font-semibold text-muted-foreground bg-slate-800/50">
              Workstream
            </div>
            {quarters.map((q) => (
              <div key={q} className="py-4 px-4 text-sm font-semibold text-muted-foreground text-center bg-slate-800/50">
                {q}
              </div>
            ))}
          </div>

          {/* Workstream Rows */}
          {workstreams.map((ws, index) => {
            const targetIdx = getTargetQuarterIndex(ws.targetClose);
            
            return (
              <div 
                key={ws.name}
                className="border-b border-white/10 opacity-0 animate-fade-in"
                style={{ 
                  animationDelay: `${200 + index * 100}ms`,
                  display: 'grid',
                  gridTemplateColumns: `200px repeat(${quarters.length}, 1fr)`
                }}
              >
                {/* Workstream Name */}
                <div className={`py-6 px-4 ${ws.color} flex items-center`}>
                  <span className="text-sm font-semibold text-white leading-tight">{ws.name}</span>
                </div>
                
                {/* Timeline cells */}
                {quarters.slice(0, -1).map((_, i) => (
                  <div 
                    key={i} 
                    className="py-6 px-4 bg-slate-900/30 border-l border-white/5 relative"
                  >
                    {/* Highlight target quarter */}
                    {targetIdx === i && (
                      <div className="absolute inset-0 bg-primary/20 border-l-2 border-r-2 border-primary/50 flex items-center justify-center">
                        <Target className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    {/* Show progress bar for quarters before target */}
                    {targetIdx > i && (
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 mx-1">
                        <div className="h-full bg-primary/40 rounded-full" />
                      </div>
                    )}
                  </div>
                ))}
                
                {/* NNACV Column */}
                <div className="py-6 px-4 bg-slate-900/30 border-l border-white/10 flex items-center justify-center">
                  {ws.nnacv && (
                    <span className="text-lg font-bold text-primary">{ws.nnacv}</span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Total Row */}
          <div 
            className="border-t-2 border-primary/30"
            style={{ 
              display: 'grid',
              gridTemplateColumns: `200px repeat(${quarters.length}, 1fr)`
            }}
          >
            <div className="py-4 px-4 bg-primary/10 flex items-center">
              <span className="text-sm font-bold text-primary">Total ACV Target</span>
            </div>
            {quarters.slice(0, -1).map((_, i) => (
              <div key={i} className="py-4 px-4 bg-slate-900/20 border-l border-white/5" />
            ))}
            <div className="py-4 px-4 bg-primary/10 border-l border-white/10 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">${totalACV}M</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Roadmap Data</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Define Big Bets in the Input Form to generate the strategic roadmap for {companyName}.
          </p>
        </div>
      )}

      {/* Legend */}
      {workstreams.length > 0 && (
        <div className="mt-8 glass-card p-4 inline-flex items-center gap-8 opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Target Close</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 rounded-full bg-primary/40" />
            <span className="text-sm text-muted-foreground">Active Timeline</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Net New ACV</span>
          </div>
        </div>
      )}
    </div>
  );
};
