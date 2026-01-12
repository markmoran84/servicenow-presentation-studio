import { useAccountData } from "@/context/AccountDataContext";
import { SlideFooter } from "@/components/SlideFooter";
import { 
  Target, 
  Layers, 
  Building2, 
  TrendingUp, 
  Shield, 
  Compass, 
  Zap, 
  Users, 
  Cpu,
  Globe,
  Anchor,
  Ship,
  Container
} from "lucide-react";

export const IntegratorStrategySlide = () => {
  const { data } = useAccountData();
  const accountName = data.basics?.accountName || "Customer";

  // Default data structure for the Integrator Strategy framework
  const framework = {
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
      { title: "Strengthen customer focus and profitable growth" },
      { title: "Drive operational excellence across the network" },
      { title: "Accelerate technology and transformation" },
      { title: "Scale AI and data to power intelligent operations" },
    ],
    divisions: [
      { name: "Ocean" },
      { name: "Logistics & Services" },
      { name: "Terminals" },
    ],
    mediumTermAmbitions: [
      { title: "Better efficiencies", target: "Tbc" },
      { title: "Improve free cash flow", target: "Tbc" },
      { title: "Grow the business", target: "Tbc" },
    ],
    foundation: "Underpinned by Group governance, support services and risk management"
  };

  const enablerIcons = [Users, Target, Zap, Cpu];
  const divisionIcons = [Ship, Globe, Container];

  return (
    <div className="min-h-screen p-6 md:p-10 pb-28 relative overflow-hidden">
      {/* Background gradient accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[900px] h-[500px] bg-gradient-to-br from-teal-500/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[400px] bg-gradient-to-tl from-purple-500/6 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-gradient-to-r from-yellow-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6 opacity-0 animate-fade-in">
          <p className="text-muted-foreground text-xs tracking-widest uppercase mb-2">ServiceNow Internal Confidential</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent">
              The Integrator
            </span>{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Strategy
            </span>
          </h1>
        </div>

        {/* Main Framework Container */}
        <div className="space-y-3">
          
          {/* Tagline Banner */}
          <div 
            className="bg-gradient-to-r from-teal-600/90 via-teal-500/80 to-cyan-500/70 rounded-full py-3 px-10 text-center shadow-lg shadow-teal-500/20 opacity-0 animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            <span className="text-xl md:text-2xl font-bold text-white tracking-wider drop-shadow-sm">
              {framework.tagline}
            </span>
          </div>

          {/* Purpose Row */}
          <div 
            className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 rounded-full py-3 px-10 text-center shadow-lg shadow-amber-400/20 opacity-0 animate-fade-in"
            style={{ animationDelay: "150ms" }}
          >
            <span className="text-slate-900 font-medium text-sm md:text-base">
              <span className="font-bold">Our purpose</span> {framework.purpose}
            </span>
          </div>

          {/* Strategic Priorities Section */}
          <div 
            className="flex gap-3 opacity-0 animate-fade-in"
            style={{ animationDelay: "200ms" }}
          >
            {/* Left Label */}
            <div className="w-44 flex-shrink-0 glass-card p-4 flex items-center justify-center border border-slate-600/40 bg-gradient-to-br from-slate-800/90 to-slate-900/70">
              <div className="text-center">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-2 border border-primary/30">
                  <Compass className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground font-semibold text-sm leading-tight block">Our strategic<br/>priorities</span>
              </div>
            </div>
            
            {/* Priorities Grid - 2 rows x 3 columns */}
            <div className="flex-1 grid grid-cols-3 gap-2">
              {framework.strategicPriorities.map((priority, index) => (
                <div 
                  key={index}
                  className="glass-card p-3 border border-slate-600/30 flex items-center justify-center text-center 
                             hover:border-primary/40 hover:bg-slate-700/50 transition-all duration-300 group
                             bg-gradient-to-br from-slate-800/60 to-slate-900/40"
                >
                  <p className="text-foreground/90 text-xs leading-snug group-hover:text-foreground transition-colors">
                    {priority.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Foundational Enablers Section */}
          <div 
            className="flex gap-3 opacity-0 animate-fade-in"
            style={{ animationDelay: "300ms" }}
          >
            {/* Left Label */}
            <div className="w-44 flex-shrink-0 glass-card p-4 flex items-center justify-center border border-slate-600/40 bg-gradient-to-br from-slate-800/90 to-slate-900/70">
              <div className="text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center mx-auto mb-2 border border-amber-400/30">
                  <Layers className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-foreground font-semibold text-sm leading-tight block">Built on our<br/>foundational<br/>enablers</span>
              </div>
            </div>
            
            {/* Enablers - 4 columns */}
            <div className="flex-1 grid grid-cols-4 gap-2">
              {framework.foundationalEnablers.map((enabler, index) => {
                const IconComponent = enablerIcons[index];
                return (
                  <div 
                    key={index}
                    className="glass-card p-4 border border-amber-400/30 
                               hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-400/10
                               transition-all duration-300 group bg-gradient-to-br from-amber-400/10 to-amber-300/5"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="w-9 h-9 rounded-lg bg-amber-400/20 flex items-center justify-center border border-amber-400/40 group-hover:bg-amber-400/30 transition-colors">
                        <IconComponent className="w-4 h-4 text-amber-400" />
                      </div>
                      <p className="text-amber-200 font-semibold text-xs leading-snug">
                        {enabler.title}
                      </p>
                      <p className="text-muted-foreground text-[10px]">+ For more see page #xx</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Divisions Section */}
          <div 
            className="flex gap-3 opacity-0 animate-fade-in"
            style={{ animationDelay: "400ms" }}
          >
            {/* Left Label */}
            <div className="w-44 flex-shrink-0 glass-card p-4 flex items-center justify-center border border-slate-600/40 bg-gradient-to-br from-slate-800/90 to-slate-900/70">
              <div className="text-center">
                <div className="w-10 h-10 rounded-xl bg-purple-400/20 flex items-center justify-center mx-auto mb-2 border border-purple-400/30">
                  <Building2 className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-foreground font-semibold text-sm leading-tight block">Delivered through<br/>our three divisions</span>
              </div>
            </div>
            
            {/* Divisions - 3 columns */}
            <div className="flex-1 grid grid-cols-3 gap-3">
              {framework.divisions.map((division, index) => {
                const gradients = [
                  "from-purple-700/90 via-purple-600/80 to-purple-800/90",
                  "from-purple-600/90 via-purple-500/80 to-purple-700/90", 
                  "from-purple-500/90 via-purple-400/80 to-purple-600/90"
                ];
                const IconComponent = divisionIcons[index];
                return (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br ${gradients[index]} rounded-xl p-5 flex items-center justify-center gap-3
                                border border-purple-400/30 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20
                                transition-all duration-300 cursor-default`}
                  >
                    <IconComponent className="w-6 h-6 text-white/80" />
                    <span className="text-white font-bold text-base tracking-wide">
                      {division.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Medium-term Ambitions Section */}
          <div 
            className="flex gap-3 opacity-0 animate-fade-in"
            style={{ animationDelay: "500ms" }}
          >
            {/* Left Label */}
            <div className="w-44 flex-shrink-0 glass-card p-4 flex items-center justify-center border border-slate-600/40 bg-gradient-to-br from-slate-800/90 to-slate-900/70">
              <div className="text-center">
                <div className="w-10 h-10 rounded-xl bg-teal-400/20 flex items-center justify-center mx-auto mb-2 border border-teal-400/30">
                  <TrendingUp className="w-5 h-5 text-teal-400" />
                </div>
                <span className="text-foreground font-semibold text-sm leading-tight block">Delivering on our<br/>medium-term<br/>ambitions</span>
              </div>
            </div>
            
            {/* Ambitions - 3 columns */}
            <div className="flex-1 grid grid-cols-3 gap-3">
              {framework.mediumTermAmbitions.map((ambition, index) => (
                <div 
                  key={index}
                  className="glass-card p-4 border border-teal-500/30 hover:border-teal-400/50 
                             transition-all duration-300 bg-gradient-to-br from-slate-800/60 to-teal-900/20
                             hover:shadow-lg hover:shadow-teal-500/10"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <p className="text-teal-400 font-bold text-sm">
                        {ambition.title}
                      </p>
                      <span className="text-muted-foreground text-xs bg-slate-700/60 px-2 py-1 rounded-md border border-slate-600/40">
                        {ambition.target}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Foundation Banner */}
          <div 
            className="bg-gradient-to-r from-teal-800/70 via-cyan-800/60 to-teal-800/70 rounded-xl py-4 px-8 text-center 
                       border border-teal-500/40 shadow-lg shadow-teal-500/10 opacity-0 animate-fade-in"
            style={{ animationDelay: "600ms" }}
          >
            <div className="flex items-center justify-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center border border-teal-400/30">
                <Shield className="w-4 h-4 text-teal-300" />
              </div>
              <span className="text-teal-100 font-medium text-sm md:text-base">
                {framework.foundation}
              </span>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter />
    </div>
  );
};

export default IntegratorStrategySlide;
