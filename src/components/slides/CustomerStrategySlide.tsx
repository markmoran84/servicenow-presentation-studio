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
  AlertCircle
} from "lucide-react";

// Foundational enabler icons
const enablerIcons = [Users, Cog, Cpu, BarChart3];

export const CustomerStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, generatedPlan } = data;

  const accountName = basics.accountName || "Customer";
  const fiscalYear = "FY26+";

  // Get AI-generated synthesis
  const synthesis = generatedPlan?.customerStrategySynthesis;
  
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
    <div className="min-h-screen p-8 md:p-12 pb-32 relative overflow-hidden">
      {/* Background gradient accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-gradient-to-tr from-cyan-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Customer {fiscalYear} Priorities
            </span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <RegenerateSectionButton section="customerStrategySynthesis" label="Generate" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
                <Sparkles className="w-3 h-3" />
                AI Synthesized
              </span>
            )}
          </div>
        </div>

        {!hasData ? (
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in">
            <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Strategy Data</h3>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
              Upload an annual report or click "Generate" to create customer strategy content.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Customer Strategic Direction */}
            <div className="col-span-7 space-y-6 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
              {/* Strategic Direction Card */}
              <div className="glass-card p-6 border border-cyan-500/20 bg-gradient-to-br from-slate-800/80 to-slate-900/50">
                {/* Header */}
                <h2 className="text-lg font-semibold text-cyan-400 mb-3">
                  {accountName} Strategic Direction
                </h2>
                
                {/* Strategic Direction Text */}
                <p className="text-foreground/90 text-base leading-relaxed mb-6">
                  {strategicDirection}
                </p>

                {/* 2x2 Grid of Foundational Enablers */}
                <div className="grid grid-cols-2 gap-4">
                  {enablers.slice(0, 4).map((enabler, index) => {
                    const IconComponent = enablerIcons[index % enablerIcons.length];
                    return (
                      <div 
                        key={index}
                        className="group p-4 rounded-xl bg-slate-700/40 border border-slate-600/40 hover:border-amber-400/40 transition-all duration-300 opacity-0 animate-fade-in"
                        style={{ animationDelay: `${200 + index * 100}ms` }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Yellow/amber accent square */}
                          <div className="w-10 h-10 rounded-lg bg-amber-400/90 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-400 transition-colors">
                            <IconComponent className="w-5 h-5 text-slate-900" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-foreground font-semibold text-sm leading-snug">
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
            <div className="col-span-5 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="glass-card p-6 h-full border border-emerald-500/20 bg-gradient-to-br from-slate-800/80 to-slate-900/50">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-semibold text-emerald-400">Digital Strategies</h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                    ServiceNow
                  </span>
                </div>

                {/* Digital Strategy Items */}
                <div className="space-y-4">
                  {digitalStrategies.slice(0, 4).map((strategy, index) => (
                    <div 
                      key={index}
                      className="group p-4 rounded-xl bg-slate-700/30 border border-slate-600/30 hover:border-emerald-500/40 transition-all duration-300 opacity-0 animate-fade-in"
                      style={{ animationDelay: `${400 + index * 100}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/30 transition-colors">
                          {index === 0 && <Layers className="w-4 h-4 text-emerald-400" />}
                          {index === 1 && <Cpu className="w-4 h-4 text-emerald-400" />}
                          {index === 2 && <Zap className="w-4 h-4 text-emerald-400" />}
                          {index === 3 && <Target className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-emerald-400 font-semibold text-sm mb-1">
                            {strategy.title}
                          </h3>
                          {strategy.description && (
                            <p className="text-muted-foreground text-xs leading-relaxed">
                              {strategy.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Connection indicator */}
                <div className="mt-6 pt-4 border-t border-slate-600/30">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ArrowRight className="w-3 h-3 text-emerald-400" />
                    <span>Aligned to <span className="text-emerald-400 font-medium">{accountName}</span> priorities</span>
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
