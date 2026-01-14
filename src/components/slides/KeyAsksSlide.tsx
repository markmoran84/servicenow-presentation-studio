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
      title: "Executive Sponsorship",
      description: "Active engagement from P5 leadership in strategic conversations and relationship building",
      items: [
        "Quarterly executive touchpoints with customer C-suite",
        "Internal alignment on account priorities and investments",
        "Executive air cover for strategic decisions"
      ],
      color: "from-cyan-400 to-cyan-600"
    },
    {
      icon: Shield,
      title: "Resource Commitment",
      description: "Dedicated capacity and investment to execute against our strategic workstreams",
      items: [
        "Ring-fenced delivery resources for key initiatives",
        "Budget allocation for solution development",
        "Access to specialist skills and expertise"
      ],
      color: "from-emerald-400 to-emerald-600"
    },
    {
      icon: Zap,
      title: "Speed to Decision",
      description: "Accelerated governance and approval processes for time-sensitive opportunities",
      items: [
        "Fast-track approval for strategic pursuits",
        "Delegated authority for account-level decisions",
        "Streamlined commercial sign-off processes"
      ],
      color: "from-amber-400 to-amber-600"
    }
  ];

  const organizationalAsks = [
    {
      icon: Target,
      title: "Cross-functional Alignment",
      description: "Unified approach across all service lines and product areas",
      items: [
        "Single account strategy across all business units",
        "Coordinated go-to-market and client engagement",
        "Shared success metrics and accountability"
      ],
      color: "from-violet-400 to-violet-600"
    },
    {
      icon: Handshake,
      title: "Partner Ecosystem Access",
      description: "Leverage strategic partnerships and alliances to strengthen our proposition",
      items: [
        "Priority access to key technology partners",
        "Joint solution development with alliance partners",
        "Co-investment in customer-specific innovations"
      ],
      color: "from-rose-400 to-rose-600"
    },
    {
      icon: Building2,
      title: "Operational Excellence",
      description: "Consistent, high-quality delivery that builds trust and credibility",
      items: [
        "Proactive issue escalation and resolution",
        "Continuous improvement in service delivery",
        "Investment in account-specific capabilities"
      ],
      color: "from-blue-400 to-blue-600"
    }
  ];

  const successFactors = [
    "Unified leadership commitment to the account strategy",
    "Clear accountability and decision-making authority",
    "Sustained investment through the transformation journey",
    "Regular cadence of strategic reviews and course corrections"
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
