import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { SlideFooter } from "@/components/SlideFooter";
import { 
  Sparkles, 
  Users, 
  Cog, 
  Cpu, 
  BarChart3,
  Zap,
  Layers,
  Target,
  ArrowRight,
  AlertCircle,
  Lightbulb,
  Network,
  Workflow,
  Bot
} from "lucide-react";

// Foundational enabler icons
const enablerIcons = [Users, Cog, Cpu, BarChart3];
const digitalIcons = [Layers, Bot, Network, Workflow];

export const CustomerStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, generatedPlan } = data;

  const accountName = basics.accountName || "Customer";
  const fiscalYear = "FY26+";

  // Get AI-generated synthesis with layout variant
  const synthesis = generatedPlan?.customerStrategySynthesis;
  const layoutVariant = synthesis?.layoutVariant || "grid-2x2";
  
  // Strategic direction / purpose
  const strategicDirection = synthesis?.purpose || 
    strategy.corporateStrategy?.[0]?.description ||
    `Transforming ${accountName} to be the global integrator of container logistics, connecting and simplifying customers' supply chains`;

  // Foundational enablers (4 pillars from customer strategy)
  const defaultEnablers = [
    { title: "Strengthen customer focus and profitable growth", description: "Drive customer-centric transformation" },
    { title: "Drive operational excellence across the network", description: "Optimize end-to-end operations" },
    { title: "Accelerate technology and transformation", description: "Modernize technology foundation" },
    { title: "Scale AI and data to power intelligent operations", description: "Enable data-driven decisions" },
  ];

  const enablers = synthesis?.annualTasks?.slice(0, 4).map(task => ({
    title: task.title,
    description: task.description || ""
  })) || 
  strategy.corporateStrategy?.slice(0, 4).map(s => ({
    title: s.title,
    description: s.description
  })) ||
  defaultEnablers;

  // Digital strategies (right column)
  const defaultDigitalStrategies = [
    { title: "Unified Platform Foundation", description: "Single platform for IT, Customer, and Employee workflows enabling seamless orchestration" },
    { title: "AI-Powered Automation", description: "Now Assist and agentic AI capabilities embedded across workflows to drive automation" },
    { title: "Integration Excellence", description: "Connect legacy systems, cloud applications, and data sources into a cohesive digital backbone" },
    { title: "Experience Transformation", description: "Consumer-grade experiences for employees, customers, and partners" },
  ];

  const digitalStrategies = synthesis?.serviceNowAlignment?.slice(0, 4).map(item => ({
    title: item.serviceNowValue,
    description: item.customerPriority
  })) ||
  strategy.digitalStrategies?.slice(0, 4).map(s => ({
    title: s.title,
    description: s.description
  })) ||
  defaultDigitalStrategies;

  const hasData = enablers.length > 0 || digitalStrategies.length > 0;
  const isAIGenerated = !!synthesis;

  return (
    <div className="h-full overflow-auto p-6 md:p-10 pb-28 relative">
      {/* Background gradient accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[900px] h-[600px] bg-gradient-to-bl from-emerald-500/6 via-cyan-500/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-500/6 via-teal-500/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-amber-500/4 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 opacity-0 animate-fade-in">
          <div>
            <p className="text-muted-foreground text-xs tracking-widest uppercase mb-2">Customer Strategic Overview</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
                Customer {fiscalYear} Priorities
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <RegenerateSectionButton section="customerStrategySynthesis" label="Generate" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 text-xs text-accent font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                AI Synthesized
              </span>
            )}
          </div>
        </div>

        {!hasData ? (
          <div 
            className="glass-card p-16 text-center border border-slate-600/30 opacity-0 animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            <div className="w-20 h-20 rounded-2xl bg-muted/10 flex items-center justify-center mx-auto mb-6 border border-muted/20">
              <AlertCircle className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">No Strategy Data</h3>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Upload an annual report or click "Generate" to create customer strategy content based on your account data.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Customer Strategic Direction */}
            <div 
              className="col-span-7 space-y-6 opacity-0 animate-fade-in" 
              style={{ animationDelay: "100ms" }}
            >
              {/* Strategic Direction Card */}
              <div className="glass-card p-6 border border-cyan-500/30 bg-gradient-to-br from-slate-800/90 via-cyan-900/10 to-slate-900/70 shadow-xl shadow-cyan-500/5">
                {/* Header with accent line */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-cyan-600" />
                  <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                    {accountName} Strategic Direction
                  </h2>
                </div>
                
                {/* Strategic Direction Text */}
                <p className="text-foreground/90 text-base leading-relaxed mb-8 pl-5">
                  {strategicDirection}
                </p>

                {/* 2x2 Grid of Foundational Enablers */}
                <div className="grid grid-cols-2 gap-4">
                  {enablers.slice(0, 4).map((enabler, index) => {
                    const IconComponent = enablerIcons[index % enablerIcons.length];
                    return (
                      <div 
                        key={index}
                        className="group p-4 rounded-xl bg-gradient-to-br from-slate-700/50 to-slate-800/40 
                                   border border-slate-600/40 hover:border-amber-400/50 
                                   transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/10
                                   opacity-0 animate-fade-in"
                        style={{ animationDelay: `${200 + index * 80}ms` }}
                      >
                        <div className="flex items-start gap-4">
                          {/* Yellow/amber accent square */}
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 
                                          flex items-center justify-center flex-shrink-0 
                                          group-hover:shadow-lg group-hover:shadow-amber-400/30 transition-all duration-300">
                            <IconComponent className="w-6 h-6 text-slate-900" />
                          </div>
                          <div className="flex-1 min-w-0 pt-1">
                            <h3 className="text-foreground font-semibold text-sm leading-snug group-hover:text-amber-200 transition-colors">
                              {enabler.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Digital Strategies */}
            <div 
              className="col-span-5 opacity-0 animate-fade-in" 
              style={{ animationDelay: "200ms" }}
            >
              <div className="glass-card p-6 h-full border border-emerald-500/30 bg-gradient-to-br from-slate-800/90 via-emerald-900/10 to-slate-900/70 shadow-xl shadow-emerald-500/5">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
                    <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                      Digital Strategies
                    </h2>
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-400/10 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
                    ServiceNow
                  </span>
                </div>

                {/* Digital Strategy Items */}
                <div className="space-y-4">
                  {digitalStrategies.slice(0, 4).map((strategyItem, index) => {
                    const IconComponent = digitalIcons[index % digitalIcons.length];
                    return (
                      <div 
                        key={index}
                        className="group p-4 rounded-xl bg-gradient-to-br from-slate-700/40 to-slate-800/30 
                                   border border-slate-600/30 hover:border-emerald-500/50 
                                   transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10
                                   opacity-0 animate-fade-in"
                        style={{ animationDelay: `${350 + index * 80}ms` }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 
                                          flex items-center justify-center flex-shrink-0 border border-emerald-500/30
                                          group-hover:from-emerald-500/40 group-hover:to-emerald-600/30 transition-all duration-300">
                            <IconComponent className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-emerald-400 font-bold text-sm mb-1.5 group-hover:text-emerald-300 transition-colors">
                              {strategyItem.title}
                            </h3>
                            {strategyItem.description && (
                              <p className="text-muted-foreground text-xs leading-relaxed">
                                {strategyItem.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Connection indicator */}
                <div 
                  className="mt-6 pt-5 border-t border-slate-600/40 opacity-0 animate-fade-in"
                  style={{ animationDelay: "700ms" }}
                >
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-muted-foreground">
                      Aligned to <span className="text-emerald-400 font-semibold">{accountName}</span> priorities
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <SlideFooter />
    </div>
  );
};
