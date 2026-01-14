import { useAccountData } from "@/context/AccountDataContext";
import { 
  Users, 
  Shield, 
  Zap, 
  Target, 
  Handshake, 
  Building2,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export const KeyAsksSlide = () => {
  const { data } = useAccountData();
  const { basics } = data;

  const leadershipAsks = [
    {
      icon: Users,
      title: "Executive Sponsorship & Air Cover",
      description: "Senior leadership engagement to open doors and accelerate strategic conversations",
      items: [
        "P5 executive participation in key customer meetings",
        "Access to ServiceNow executive briefing center",
        "Internal advocacy for strategic investment decisions"
      ],
      color: "from-cyan-400 to-cyan-600"
    },
    {
      icon: Shield,
      title: "Resource & Capacity Commitment",
      description: "Dedicated specialist resources to execute against our strategic account plan",
      items: [
        "Priority access to solution consulting and architects",
        "Pre-sales investment for POCs and demos",
        "Dedicated customer success resources"
      ],
      color: "from-emerald-400 to-emerald-600"
    },
    {
      icon: Zap,
      title: "Deal Velocity & Flexibility",
      description: "Commercial agility to compete and win strategic opportunities",
      items: [
        "Fast-track deal desk approvals for strategic deals",
        "Pricing flexibility for multi-year commitments",
        "Creative commercial structures (co-investment, success-based)"
      ],
      color: "from-amber-400 to-amber-600"
    }
  ];

  const organizationalAsks = [
    {
      icon: Target,
      title: "Cross-Functional Go-to-Market",
      description: "Unified account strategy across all ServiceNow business units",
      items: [
        "Coordinated messaging across ITSM, ITOM, CSM, HRSD, etc.",
        "Joint account planning with product specialists",
        "Aligned quota and credit for collaborative wins"
      ],
      color: "from-violet-400 to-violet-600"
    },
    {
      icon: Handshake,
      title: "Partner & Ecosystem Leverage",
      description: "Strategic partner engagement to strengthen our position and delivery capability",
      items: [
        "SI partner co-sell and implementation support",
        "Technology partner integrations and joint solutions",
        "Access to partner-funded resources for POVs"
      ],
      color: "from-rose-400 to-rose-600"
    },
    {
      icon: Building2,
      title: "Marketing & Demand Investment",
      description: "Account-based marketing support to build awareness and generate pipeline",
      items: [
        "Executive events and customer roundtables",
        "Custom content and thought leadership",
        "Reference customer and case study development"
      ],
      color: "from-blue-400 to-blue-600"
    }
  ];

  const successFactors = [
    "Visible P5 commitment signals account priority to the customer",
    "Resource certainty enables proactive pursuit execution",
    "Commercial flexibility wins competitive displacement deals",
    "Cross-BU alignment prevents internal friction and confusion"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1D26] via-[#1a3a4a] to-[#0B1D26] p-8 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Key Asks
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            What we need to execute our {basics.accountName || "Account"} strategy
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
          <Target className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-medium text-amber-300">Strategic Enablers</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-12 gap-5">
        {/* Left Column - From P5 Leadership */}
        <div className="col-span-6 space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full" />
            <h2 className="text-lg font-semibold text-white">From P5 Leadership</h2>
          </div>
          
          <div className="space-y-3">
            {leadershipAsks.map((ask, index) => {
              const Icon = ask.icon;
              return (
                <div 
                  key={index}
                  className="bg-white/[0.03] backdrop-blur-sm rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${ask.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white mb-1">{ask.title}</h3>
                      <p className="text-xs text-slate-400 mb-2">{ask.description}</p>
                      <ul className="space-y-1">
                        {ask.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <ArrowRight className="w-3 h-3 text-slate-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - From the Organisation */}
        <div className="col-span-6 space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-gradient-to-b from-violet-400 to-violet-600 rounded-full" />
            <h2 className="text-lg font-semibold text-white">From the Organisation</h2>
          </div>
          
          <div className="space-y-3">
            {organizationalAsks.map((ask, index) => {
              const Icon = ask.icon;
              return (
                <div 
                  key={index}
                  className="bg-white/[0.03] backdrop-blur-sm rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${ask.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white mb-1">{ask.title}</h3>
                      <p className="text-xs text-slate-400 mb-2">{ask.description}</p>
                      <ul className="space-y-1">
                        {ask.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <ArrowRight className="w-3 h-3 text-slate-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Banner - Critical Success Factors */}
      <div className="mt-5 bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-xl p-4 border border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Critical Success Factors</h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {successFactors.map((factor, index) => (
            <div 
              key={index}
              className="flex items-start gap-2 text-xs text-slate-300"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-emerald-400">{index + 1}</span>
              </div>
              <span>{factor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
