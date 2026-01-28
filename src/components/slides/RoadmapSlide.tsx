import { useAccountData } from "@/context/AccountDataContext";

export const RoadmapSlide = () => {
  const { data } = useAccountData();
  const { accountStrategy, basics } = data;
  
  const companyName = basics.accountName || "Customer";
  
  // Sample workstreams - would be populated from data
  const workstreams = [
    { 
      name: "Autonomous CRM", 
      color: "bg-blue-500/60",
      nnacv: "$2M"
    },
    { 
      name: "Agentic AI @ Scale", 
      color: "bg-purple-500/60",
      nnacv: "$17M"
    },
    { 
      name: "Digital Backbone", 
      color: "bg-indigo-500/60",
      nnacv: "$2M"
    },
    { 
      name: "Exec Connect", 
      color: "bg-stone-500/60",
      nnacv: ""
    },
  ];

  const quarters = ["Q1-26", "Q2-26", "Q3-26", "Q4-26", "2027", "2028", "NNACV"];

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
        <h1 className="text-5xl font-bold text-primary mb-2">Roadmap to $27M ACV by December 31, 2029</h1>
      </div>

      {/* Timeline Grid */}
      <div className="opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
        {/* Header Row */}
        <div className="grid grid-cols-8 border-b border-white/20">
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
        {workstreams.map((ws, index) => (
          <div 
            key={ws.name}
            className="grid grid-cols-8 border-b border-white/10 opacity-0 animate-fade-in"
            style={{ animationDelay: `${200 + index * 100}ms` }}
          >
            {/* Workstream Name */}
            <div className={`py-8 px-4 ${ws.color} flex items-center`}>
              <span className="text-sm font-semibold text-white leading-tight">{ws.name}</span>
            </div>
            
            {/* Timeline cells - 6 quarters + NNACV */}
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="py-8 px-4 bg-slate-900/30 border-l border-white/5 relative"
              >
                {/* Q4-26 highlight column */}
                {i === 3 && index < 3 && (
                  <div className="absolute inset-0 bg-blue-500/20 border-l-2 border-r-2 border-blue-400/50" />
                )}
              </div>
            ))}
            
            {/* NNACV Column */}
            <div className="py-8 px-4 bg-slate-900/30 border-l border-white/10 flex items-center justify-center">
              {ws.nnacv && (
                <span className="text-lg font-bold text-primary">{ws.nnacv}</span>
              )}
            </div>
          </div>
        ))}

        {/* Milestone Marker - Q4-26 */}
        <div className="grid grid-cols-8 mt-2">
          <div className="col-span-1" />
          <div className="col-span-3" />
          <div className="col-span-1 text-center">
            <div className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded text-xs text-blue-300">
              Close mega deal (AI, L&S) = 6-8M USD
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-12 glass-card p-4 inline-flex items-center gap-8 opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500" />
          <span className="text-sm text-muted-foreground">Key Milestone</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-purple-500" />
          <span className="text-sm text-muted-foreground">Implementation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-slate-500" />
          <span className="text-sm text-muted-foreground">Activity</span>
        </div>
      </div>
    </div>
  );
};
