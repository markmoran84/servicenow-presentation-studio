import { useAccountData } from "@/context/AccountDataContext";
import { Star, Target, Zap, Shield, Users } from "lucide-react";

interface TimelineActivity {
  label: string;
  startQ: number;
  spanQ: number;
  type: 'milestone' | 'activity' | 'implementation';
  highlight?: boolean;
}

interface ExecutionTrack {
  category: string;
  categoryColor: string;
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
    categoryColor: "from-emerald-500 to-emerald-600",
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
    categoryColor: "from-amber-500 to-yellow-500",
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
    categoryColor: "from-green-500 to-green-600",
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
    categoryColor: "from-green-600 to-emerald-500",
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
    <div className="p-6 min-h-[700px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-white">
            Roadmap to{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {targetACV}
            </span>
            {" "}by December 31, 2026
          </h1>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 border border-violet-500/30">
              Execution Roadmap
            </span>
          </div>
        </div>
        <p className="text-slate-400 text-sm">
          {basics?.accountName || "Account"} strategic execution timeline across all workstreams
        </p>
      </div>

      {/* Timeline Grid */}
      <div className="rounded-xl border border-slate-700/50 overflow-hidden bg-slate-900/50 backdrop-blur">
        {/* Header Row */}
        <div className="grid grid-cols-[140px_80px_repeat(6,1fr)_120px_80px] bg-gradient-to-r from-slate-800 to-slate-800/80 border-b border-slate-700/50">
          <div className="p-3 text-xs font-bold text-slate-300 uppercase tracking-wider border-r border-slate-700/50 flex items-center justify-center">
            Execution Tracks
          </div>
          <div className="p-3 border-r border-slate-700/50"></div>
          {quarters.map((q, i) => (
            <div key={i} className="p-3 text-xs font-bold text-slate-300 text-center border-r border-slate-700/50">
              {q}
            </div>
          ))}
          <div className="p-3 text-xs font-bold text-slate-300 text-center border-r border-slate-700/50">
            Capabilities
          </div>
          <div className="p-3 text-xs font-bold text-slate-300 text-center">
            NNACV
          </div>
        </div>

        {/* Track Rows */}
        {executionTracks.map((track, trackIdx) => (
          <div key={trackIdx} className="border-b border-slate-700/30 last:border-b-0">
            {track.items.map((item, itemIdx) => (
              <div 
                key={itemIdx} 
                className="grid grid-cols-[140px_80px_repeat(6,1fr)_120px_80px] min-h-[52px] hover:bg-slate-800/30 transition-colors"
              >
                {/* Category Label - only show for first item */}
                {itemIdx === 0 ? (
                  <div 
                    className={`p-2 text-xs font-bold text-white bg-gradient-to-r ${track.categoryColor} flex items-center justify-center border-r border-slate-700/50`}
                    style={{ gridRow: `span ${track.items.length}` }}
                  >
                    <span className="writing-mode-vertical transform -rotate-0 text-center leading-tight">
                      {track.category}
                    </span>
                  </div>
                ) : null}
                
                {/* Item Name */}
                <div className={`p-2 text-xs font-medium text-slate-200 flex items-center border-r border-slate-700/50 bg-gradient-to-r ${track.categoryColor} bg-opacity-20 ${itemIdx !== 0 ? 'col-start-2' : ''}`}>
                  {item.name}
                </div>

                {/* Timeline Cells */}
                {[1, 2, 3, 4, 5, 6].map((q) => (
                  <div key={q} className="p-1 border-r border-slate-700/30 relative flex items-center justify-center">
                    {item.activities
                      .filter(a => a.startQ === q)
                      .map((activity, aIdx) => (
                        <div
                          key={aIdx}
                          className={`
                            absolute left-1 right-1 flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium
                            ${activity.type === 'milestone' && activity.highlight
                              ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 shadow-lg shadow-amber-500/20'
                              : activity.type === 'milestone'
                              ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
                              : activity.type === 'implementation'
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                              : 'bg-slate-700 text-slate-200 border border-slate-600'
                            }
                          `}
                          style={{
                            width: activity.spanQ > 1 ? `calc(${activity.spanQ * 100}% + ${(activity.spanQ - 1) * 8}px)` : 'calc(100% - 8px)',
                            zIndex: 10
                          }}
                        >
                          {activity.highlight && <Star className="w-3 h-3 flex-shrink-0" />}
                          <span className="truncate">{activity.label}</span>
                        </div>
                      ))
                    }
                  </div>
                ))}

                {/* Capabilities - only show for first item */}
                {itemIdx === 0 ? (
                  <div 
                    className="p-2 text-[10px] text-slate-300 flex items-center justify-center text-center border-r border-slate-700/50"
                    style={{ gridRow: `span ${track.items.length}` }}
                  >
                    {track.capabilities.join(", ")}
                  </div>
                ) : null}

                {/* Value - only show for first item */}
                {itemIdx === 0 ? (
                  <div 
                    className="p-2 text-sm font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex items-center justify-center"
                    style={{ gridRow: `span ${track.items.length}` }}
                  >
                    {track.value}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Mega Deal Indicator */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400"></div>
          <span className="text-xs text-slate-400">Key Milestone</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-500"></div>
          <span className="text-xs text-slate-400">Activity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"></div>
          <span className="text-xs text-slate-400">Implementation</span>
        </div>
        <div className="h-4 w-px bg-slate-700"></div>
        <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30">
          <span className="text-xs font-semibold text-violet-300">
            Close mega deal (AI, L&S) = 6-8M USD
          </span>
        </div>
      </div>
    </div>
  );
};
