import { useAccountData } from "@/context/AccountDataContext";
import { Star, Target, Zap, Shield, Users, Calendar, TrendingUp, ArrowRight, Sparkles, Clock } from "lucide-react";

interface TimelinePhase {
  quarter: string;
  period: string;
  focus: string;
  milestones: {
    track: string;
    label: string;
    isKey?: boolean;
  }[];
}

interface ExecutionTrack {
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  target: string;
  initiatives: string[];
}

const executionTracks: ExecutionTrack[] = [
  {
    name: "AI & Data",
    icon: Sparkles,
    color: "text-emerald-400",
    bgColor: "from-emerald-500/20 to-emerald-600/10",
    borderColor: "border-emerald-500/30",
    target: "$2M",
    initiatives: ["AI Control Tower", "Data.world", "Moveworks"]
  },
  {
    name: "CRM & Commerce",
    icon: Users,
    color: "text-amber-400",
    bgColor: "from-amber-500/20 to-amber-600/10",
    borderColor: "border-amber-500/30",
    target: "$17M",
    initiatives: ["Ocean CRM", "L&S CRM", "CPQ Warehouses"]
  },
  {
    name: "Security",
    icon: Shield,
    color: "text-cyan-400",
    bgColor: "from-cyan-500/20 to-cyan-600/10",
    borderColor: "border-cyan-500/30",
    target: "$2M",
    initiatives: ["Veza", "Armis", "Risk Management"]
  },
  {
    name: "Executive Connect",
    icon: Target,
    color: "text-violet-400",
    bgColor: "from-violet-500/20 to-violet-600/10",
    borderColor: "border-violet-500/30",
    target: "Strategic",
    initiatives: ["C-Suite Engagement", "EBC Follow-ups"]
  }
];

const timelinePhases: TimelinePhase[] = [
  {
    quarter: "Q1",
    period: "Jan - Mar 2026",
    focus: "Foundation & Quick Wins",
    milestones: [
      { track: "CRM", label: "Sign $8M Ocean CRM Deal", isKey: true },
      { track: "AI", label: "Position AI Control Tower" },
      { track: "Executive", label: "SVP Simon Short → CTIO Navneet", isKey: true }
    ]
  },
  {
    quarter: "Q2",
    period: "Apr - Jun 2026",
    focus: "Proof of Value & Expansion",
    milestones: [
      { track: "CRM", label: "Ocean CRM Implementation Begins" },
      { track: "AI", label: "AI Control Tower PoV Launch", isKey: true },
      { track: "Security", label: "Veza Assessment (AI Play)" },
      { track: "Executive", label: "PoV Kick-off Event", isKey: true }
    ]
  },
  {
    quarter: "Q3",
    period: "Jul - Sep 2026",
    focus: "Scale & Validate",
    milestones: [
      { track: "CRM", label: "Position CSM for L&S" },
      { track: "CRM", label: "CPQ Warehouses PoV" },
      { track: "Executive", label: "CAIO Follow-up on AI Strategy", isKey: true }
    ]
  },
  {
    quarter: "Q4",
    period: "Oct - Dec 2026",
    focus: "Close & Commit",
    milestones: [
      { track: "CRM", label: "L&S Executive Follow-up", isKey: true },
      { track: "AI", label: "AI Platform Decision" },
      { track: "Security", label: "Veza Executive Follow-up" },
      { track: "Executive", label: "CCO Karsten Kildahl Meeting", isKey: true }
    ]
  }
];

export const ExecutionTimelineSlide = () => {
  const { data } = useAccountData();
  const basics = data?.basics;
  const targetACV = "$21M";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1D26] via-[#1a3a4a] to-[#0B1D26] p-8 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Execution Timeline
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Roadmap to {targetACV} ACV by December 31, 2026 • {basics?.accountName || "Account"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-300">Target: {targetACV} ACV</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30">
            <Calendar className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-medium text-violet-300">FY2026</span>
          </div>
        </div>
      </div>

      {/* Execution Tracks Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {executionTracks.map((track, index) => {
          const Icon = track.icon;
          return (
            <div 
              key={index}
              className={`bg-gradient-to-br ${track.bgColor} backdrop-blur-sm rounded-xl p-4 border ${track.borderColor}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${track.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{track.name}</h3>
                  <span className={`text-lg font-bold ${track.color}`}>{track.target}</span>
                </div>
              </div>
              <div className="space-y-1">
                {track.initiatives.map((initiative, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <div className={`w-1.5 h-1.5 rounded-full ${track.color.replace('text-', 'bg-')}`} />
                    <span>{initiative}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline Grid */}
      <div className="flex-1 grid grid-cols-4 gap-4">
        {timelinePhases.map((phase, phaseIndex) => (
          <div 
            key={phaseIndex}
            className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden flex flex-col"
          >
            {/* Phase Header */}
            <div className={`p-4 bg-gradient-to-r ${
              phaseIndex === 0 ? 'from-cyan-600/30 to-cyan-700/20' :
              phaseIndex === 1 ? 'from-emerald-600/30 to-emerald-700/20' :
              phaseIndex === 2 ? 'from-amber-600/30 to-amber-700/20' :
              'from-violet-600/30 to-violet-700/20'
            } border-b border-white/5`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-2xl font-bold ${
                  phaseIndex === 0 ? 'text-cyan-400' :
                  phaseIndex === 1 ? 'text-emerald-400' :
                  phaseIndex === 2 ? 'text-amber-400' :
                  'text-violet-400'
                }`}>{phase.quarter}</span>
                <Clock className="w-4 h-4 text-slate-500" />
              </div>
              <p className="text-xs text-slate-400 mb-1">{phase.period}</p>
              <p className="text-sm font-medium text-white">{phase.focus}</p>
            </div>

            {/* Milestones */}
            <div className="p-4 flex-1 space-y-3">
              {phase.milestones.map((milestone, mIndex) => (
                <div 
                  key={mIndex}
                  className={`p-3 rounded-lg ${
                    milestone.isKey 
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30' 
                      : 'bg-white/[0.03] border border-white/5'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {milestone.isKey ? (
                      <Star className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        milestone.track === 'CRM' ? 'bg-amber-500/20 text-amber-300' :
                        milestone.track === 'AI' ? 'bg-emerald-500/20 text-emerald-300' :
                        milestone.track === 'Security' ? 'bg-cyan-500/20 text-cyan-300' :
                        'bg-violet-500/20 text-violet-300'
                      }`}>
                        {milestone.track}
                      </span>
                      <p className={`text-xs mt-1 ${milestone.isKey ? 'text-white font-medium' : 'text-slate-300'}`}>
                        {milestone.label}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Banner */}
      <div className="mt-5 bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-xl p-4 border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400" />
              <span className="text-xs text-slate-400">Key Milestone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/10 border border-white/20" />
              <span className="text-xs text-slate-400">Activity</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-px bg-slate-700" />
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30">
              <span className="text-xs font-semibold text-violet-300">
                🎯 Mega Deal Target: Close AI + L&S = $6-8M USD
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
