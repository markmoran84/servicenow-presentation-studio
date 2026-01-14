import { useAccountData } from "@/context/AccountDataContext";
import { Star, Sparkles } from "lucide-react";

interface TimelineActivity {
  label: string;
  startQ: number;
  spanQ: number;
  type: 'milestone' | 'activity' | 'implementation';
  highlight?: boolean;
}

interface ExecutionTrack {
  category: string;
  accent: string;
  accentBg: string;
  items: {
    name: string;
    activities: TimelineActivity[];
  }[];
  capabilities: string[];
  value: string;
}

const executionTracks: ExecutionTrack[] = [
  {
    category: "AI",
    accent: "from-blue-500 to-cyan-400",
    accentBg: "bg-blue-500/10",
    items: [
      {
        name: "AI Control Tower",
        activities: [
          { label: "Position AI Control Tower as strategic solution", startQ: 1, spanQ: 1, type: 'milestone' },
          { label: "Post EBC: Assess Control Tower (PoV)", startQ: 2, spanQ: 1, type: 'activity' },
          { label: "Executive follow-up", startQ: 4, spanQ: 1, type: 'milestone', highlight: true },
        ]
      },
      {
        name: "Data.world",
        activities: [
          { label: "Post EBC: Assess data.world (PoV)", startQ: 2, spanQ: 1, type: 'activity' },
        ]
      },
      {
        name: "Moveworks",
        activities: [
          { label: "Post EBC: Assess moveworks (PoV)", startQ: 2, spanQ: 1, type: 'activity' },
        ]
      },
    ],
    capabilities: ["Data.world", "AI Control Tower", "Moveworks"],
    value: "$2M"
  },
  {
    category: "CRM",
    accent: "from-violet-500 to-purple-400",
    accentBg: "bg-violet-500/10",
    items: [
      {
        name: "Ocean CRM",
        activities: [
          { label: "Sign 8M USD Ocean CRM deal", startQ: 1, spanQ: 1, type: 'milestone', highlight: true },
          { label: "Ocean CRM Implementation", startQ: 2, spanQ: 2, type: 'implementation' },
        ]
      },
      {
        name: "L&S CRM",
        activities: [
          { label: "Establish connect with SVP's in L&S", startQ: 2, spanQ: 1, type: 'activity' },
          { label: "Position CSM for L&S", startQ: 3, spanQ: 1, type: 'activity' },
          { label: "Executive follow-up", startQ: 4, spanQ: 1, type: 'milestone', highlight: true },
        ]
      },
      {
        name: "CPQ",
        activities: [
          { label: "Re-establish connect with SVP's", startQ: 1, spanQ: 1, type: 'activity' },
          { label: "PoV CPQ Warehouses sales", startQ: 2, spanQ: 2, type: 'activity' },
        ]
      },
    ],
    capabilities: ["CSM", "SOM", "CPQ"],
    value: "$17M"
  },
  {
    category: "Security",
    accent: "from-emerald-500 to-teal-400",
    accentBg: "bg-emerald-500/10",
    items: [
      {
        name: "Veza",
        activities: [
          { label: "Post EBC: Assess Veza (Part of AI play)", startQ: 2, spanQ: 2, type: 'activity' },
          { label: "Exe follow-up", startQ: 4, spanQ: 1, type: 'milestone' },
        ]
      },
      {
        name: "Armis",
        activities: []
      },
      {
        name: "Risk",
        activities: []
      },
    ],
    capabilities: ["Veza", "Armis", "Risk"],
    value: "$2M"
  },
  {
    category: "Executive Connect",
    accent: "from-amber-500 to-orange-400",
    accentBg: "bg-amber-500/10",
    items: [
      {
        name: "Executive Connect",
        activities: [
          { label: "Simon Short SVP – Navneet CTIO", startQ: 1, spanQ: 1, type: 'milestone', highlight: true },
          { label: "PoV Kick-off", startQ: 2, spanQ: 1, type: 'milestone', highlight: true },
          { label: "CAIO: Krisnan follow-up on AI", startQ: 3, spanQ: 1, type: 'milestone', highlight: true },
          { label: "CCO: Karsten Kildahl follow-up", startQ: 4, spanQ: 1, type: 'milestone', highlight: true },
        ]
      },
    ],
    capabilities: [],
    value: ""
  },
];

const quarters = ["Q1 - 2026", "Q2 - 2026", "Q3 - 2026", "Q4 - 2026", "2027", "2028"];

export const ExecutionTimelineSlide = () => {
  const { data } = useAccountData();
  const basics = data?.basics;
  const targetACV = "$21M ACV";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 pb-28">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-1 h-12 bg-gradient-to-b from-blue-400 to-emerald-400 rounded-full" />
            <div>
              <h1 className="text-3xl font-light text-white tracking-tight">
                Roadmap to{" "}
                <span className="font-semibold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  {targetACV}
                </span>
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {basics?.accountName || "Account"} • Target: December 31, 2026
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400">
            <Sparkles className="w-3 h-3" />
            Execution Roadmap
          </span>
        </div>

        {/* Timeline Table */}
        <div className="rounded-2xl border border-white/5 overflow-hidden bg-white/[0.02] backdrop-blur">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-slate-800/80 to-slate-800/40">
                <th className="p-4 text-xs font-medium text-slate-400 uppercase tracking-[0.1em] border-r border-white/5 text-left w-[100px]">
                  Workstream
                </th>
                <th className="p-4 text-xs font-medium text-slate-400 uppercase tracking-[0.1em] border-r border-white/5 text-left w-[100px]">
                  Initiative
                </th>
                {quarters.map((q, i) => (
                  <th key={i} className="p-4 text-xs font-medium text-slate-400 text-center border-r border-white/5 uppercase tracking-wider">
                    {q}
                  </th>
                ))}
                <th className="p-4 text-xs font-medium text-slate-400 text-center border-r border-white/5 uppercase tracking-wider w-[100px]">
                  Capabilities
                </th>
                <th className="p-4 text-xs font-medium text-slate-400 text-center uppercase tracking-wider w-[80px]">
                  NNACV
                </th>
              </tr>
            </thead>
            <tbody>
              {executionTracks.map((track, trackIdx) => (
                track.items.map((item, itemIdx) => (
                  <tr 
                    key={`${trackIdx}-${itemIdx}`}
                    className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors opacity-0 animate-fade-in"
                    style={{ animationDelay: `${trackIdx * 100 + itemIdx * 50}ms` }}
                  >
                    {/* Category - only on first row of track */}
                    {itemIdx === 0 && (
                      <td 
                        rowSpan={track.items.length}
                        className={`p-3 text-xs font-semibold text-white bg-gradient-to-br ${track.accent} border-r border-white/10 text-center align-middle`}
                      >
                        <span className="drop-shadow-sm">{track.category}</span>
                      </td>
                    )}
                    
                    {/* Item Name */}
                    <td className={`p-3 text-xs font-medium text-slate-300 border-r border-white/5 ${track.accentBg}`}>
                      {item.name}
                    </td>

                    {/* Timeline Cells */}
                    {[1, 2, 3, 4, 5, 6].map((q) => (
                      <td key={q} className="p-2 border-r border-white/5 relative h-[52px]">
                        {item.activities
                          .filter(a => a.startQ === q)
                          .map((activity, aIdx) => (
                            <div
                              key={aIdx}
                              className={`
                                absolute top-1/2 -translate-y-1/2 left-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium shadow-lg
                                ${activity.type === 'milestone' && activity.highlight
                                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-blue-500/20'
                                  : activity.type === 'milestone'
                                  ? 'bg-gradient-to-r from-slate-600 to-slate-500 text-white shadow-slate-500/20'
                                  : activity.type === 'implementation'
                                  ? 'bg-gradient-to-r from-violet-500 to-purple-400 text-white shadow-violet-500/20'
                                  : 'bg-slate-800/80 text-slate-300 border border-white/10'
                                }
                              `}
                              style={{
                                width: activity.spanQ > 1 ? `calc(${activity.spanQ * 100}% + ${(activity.spanQ - 1) * 8}px)` : 'calc(100% - 16px)',
                                zIndex: 10
                              }}
                            >
                              {activity.highlight && <Star className="w-3 h-3 flex-shrink-0" />}
                              <span className="truncate">{activity.label}</span>
                            </div>
                          ))
                        }
                      </td>
                    ))}

                    {/* Capabilities - only on first row of track */}
                    {itemIdx === 0 && (
                      <td 
                        rowSpan={track.items.length}
                        className="p-3 text-[10px] text-slate-400 text-center border-r border-white/5 align-middle"
                      >
                        {track.capabilities.join(", ")}
                      </td>
                    )}

                    {/* Value - only on first row of track */}
                    {itemIdx === 0 && (
                      <td 
                        rowSpan={track.items.length}
                        className="p-3 text-base font-semibold text-center align-middle"
                      >
                        <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                          {track.value}
                        </span>
                      </td>
                    )}
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30"></div>
            <span className="text-xs text-slate-500">Key Milestone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-slate-600 to-slate-500"></div>
            <span className="text-xs text-slate-500">Milestone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-400"></div>
            <span className="text-xs text-slate-500">Implementation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-800 border border-white/10"></div>
            <span className="text-xs text-slate-500">Activity</span>
          </div>
          <div className="h-4 w-px bg-slate-700/50"></div>
          <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-white/5">
            <span className="text-xs font-medium bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Close mega deal (AI, L&S) = 6-8M USD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
