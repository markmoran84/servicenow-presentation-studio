import { useAccountData } from "@/context/AccountDataContext";
import { Target, Layers, Building2, TrendingUp, Shield, Compass, Zap, Users, Cpu } from "lucide-react";

export const IntegratorStrategySlide = () => {
  const { data } = useAccountData();

  // Default data structure for the Integrator Strategy framework
  const defaultFramework = {
    tagline: "All the way",
    purpose: "Improving life for all by integrating the world",
    strategicPriorities: [
      { text: "Lead as the global integrator of logistics (Ocean, L&S, Terminals working as one)." },
      { text: "Build resilient, efficient networks (Gemini design; disciplined capacity)" },
      { text: "Grow profitably with strong cost discipline (ROIC >7.5%; Ocean EBIT >6%)" },
      { text: "Deliver reliable, connected customer experiences end-to-end" },
      { text: "Digitise operations and decisions with data, automation and AI" },
      { text: "Decarbonise at scale (green methanol fleet All the way to zero 2040)" },
    ],
    foundationalEnablers: [
      { title: "Strengthen customer focus and profitable growth", icon: Users },
      { title: "Drive operational excellence across the network", icon: Target },
      { title: "Accelerate technology and transformation", icon: Zap },
      { title: "Scale AI and data to power intelligent operations", icon: Cpu },
    ],
    divisions: [
      { name: "Ocean", color: "from-purple-600 to-purple-800" },
      { name: "Logistics & Services", color: "from-purple-500 to-purple-700" },
      { name: "Terminals", color: "from-purple-400 to-purple-600" },
    ],
    mediumTermAmbitions: [
      { title: "Better efficiencies", target: "Tbc" },
      { title: "Improve free cash flow", target: "Tbc" },
      { title: "Grow the business", target: "Tbc" },
    ],
    foundation: "Underpinned by Group governance, support services and risk management"
  };

  // Use defaults for now (can be extended with AI-generated data later)
  const framework = defaultFramework;
  const companyName = data.basics?.accountName || "Customer";

  const enablerIcons = [Users, Target, Zap, Cpu];

  return (
    <div className="min-h-screen p-8 md:p-12 relative">
      {/* Header */}
      <div className="mb-6">
        <p className="text-muted-foreground text-sm mb-2">ServiceNow Internal Confidential</p>
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="text-primary">The Integrator</span>{" "}
          <span className="text-emerald-400">Strategy</span>
        </h1>
      </div>

      {/* Main Framework Container */}
      <div className="space-y-4">
        
        {/* Tagline Banner */}
        <div className="bg-gradient-to-r from-teal-600/80 to-teal-500/60 rounded-full py-3 px-8 text-center">
          <span className="text-xl md:text-2xl font-bold text-white tracking-wide">
            {framework.tagline || "All the way"}
          </span>
        </div>

        {/* Purpose Row */}
        <div className="bg-gradient-to-r from-yellow-400/90 to-yellow-300/80 rounded-full py-3 px-8 text-center">
          <span className="text-slate-800 font-medium">
            <span className="font-bold">Our purpose</span> {framework.purpose}
          </span>
        </div>

        {/* Strategic Priorities Section */}
        <div className="flex gap-4">
          {/* Left Label */}
          <div className="w-48 flex-shrink-0 bg-slate-700/50 rounded-xl p-4 flex items-center justify-center border border-slate-600/30">
            <div className="text-center">
              <Compass className="w-6 h-6 text-primary mx-auto mb-2" />
              <span className="text-white font-semibold text-sm">Our strategic<br/>priorities</span>
            </div>
          </div>
          
          {/* Priorities Grid - 2 rows x 3 columns */}
          <div className="flex-1 grid grid-cols-3 gap-2">
            {(framework.strategicPriorities || defaultFramework.strategicPriorities).slice(0, 6).map((priority, index) => (
              <div 
                key={index}
                className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-3 border border-slate-600/30 flex items-center justify-center text-center hover:bg-slate-700/60 transition-colors"
              >
                <p className="text-white text-xs leading-tight">
                  {typeof priority === 'string' ? priority : priority.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Foundational Enablers Section */}
        <div className="flex gap-4">
          {/* Left Label */}
          <div className="w-48 flex-shrink-0 bg-slate-700/50 rounded-xl p-4 flex items-center justify-center border border-slate-600/30">
            <div className="text-center">
              <Layers className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <span className="text-white font-semibold text-sm">Built on our<br/>foundational<br/>enablers</span>
            </div>
          </div>
          
          {/* Enablers - 4 columns */}
          <div className="flex-1 grid grid-cols-4 gap-3">
            {(framework.foundationalEnablers || defaultFramework.foundationalEnablers).map((enabler, index) => {
              const IconComponent = enablerIcons[index % enablerIcons.length];
              return (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-yellow-400/20 to-yellow-300/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30 hover:border-yellow-400/50 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-yellow-300 font-semibold text-sm leading-tight">
                        {typeof enabler === 'string' ? enabler : enabler.title}
                      </p>
                      <p className="text-slate-400 text-xs mt-1">+ For more see page #xx</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divisions Section */}
        <div className="flex gap-4">
          {/* Left Label */}
          <div className="w-48 flex-shrink-0 bg-slate-700/50 rounded-xl p-4 flex items-center justify-center border border-slate-600/30">
            <div className="text-center">
              <Building2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <span className="text-white font-semibold text-sm">Delivered through<br/>our three divisions</span>
            </div>
          </div>
          
          {/* Divisions - 3 columns */}
          <div className="flex-1 grid grid-cols-3 gap-3">
            {(framework.divisions || defaultFramework.divisions).map((division, index) => {
              const gradients = [
                "from-purple-700 to-purple-900",
                "from-purple-600 to-purple-800", 
                "from-purple-500 to-purple-700"
              ];
              return (
                <div 
                  key={index}
                  className={`bg-gradient-to-br ${gradients[index % 3]} rounded-xl p-6 flex items-center justify-center border border-purple-400/30 hover:scale-[1.02] transition-transform`}
                >
                  <span className="text-white font-bold text-lg">
                    {typeof division === 'string' ? division : division.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Medium-term Ambitions Section */}
        <div className="flex gap-4">
          {/* Left Label */}
          <div className="w-48 flex-shrink-0 bg-slate-700/50 rounded-xl p-4 flex items-center justify-center border border-slate-600/30">
            <div className="text-center">
              <TrendingUp className="w-6 h-6 text-teal-400 mx-auto mb-2" />
              <span className="text-white font-semibold text-sm">Delivering on our<br/>medium-term<br/>ambitions</span>
            </div>
          </div>
          
          {/* Ambitions - 3 columns */}
          <div className="flex-1 grid grid-cols-3 gap-3">
            {(framework.mediumTermAmbitions || defaultFramework.mediumTermAmbitions).map((ambition, index) => (
              <div 
                key={index}
                className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-teal-500/30 hover:border-teal-400/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <p className="text-teal-400 font-semibold text-sm">
                    {typeof ambition === 'string' ? ambition : ambition.title}
                  </p>
                  <span className="text-slate-400 text-xs bg-slate-700/50 px-2 py-1 rounded">
                    {typeof ambition === 'object' && ambition.target ? ambition.target : 'Tbc'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Foundation Banner */}
        <div className="bg-gradient-to-r from-teal-700/60 to-teal-600/40 rounded-xl py-4 px-8 text-center border border-teal-500/30">
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-5 h-5 text-teal-300" />
            <span className="text-teal-100 font-medium">
              {framework.foundation || defaultFramework.foundation}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegratorStrategySlide;
