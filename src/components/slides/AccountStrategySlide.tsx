import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { SlideFooter } from "@/components/SlideFooter";
import { 
  Sparkles,
  AlertCircle,
  Layers,
  Cpu,
  Users,
  Handshake,
  Building,
  Zap,
  Target,
  TrendingUp,
  ArrowRight
} from "lucide-react";

// Strategic pillar icons mapping
const pillarIcons = [Users, Cpu, Layers, Handshake, Building, Zap, Target, TrendingUp];

export const AccountStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, generatedPlan } = data;

  const fiscalYear = "FY26";
  const accountName = basics.accountName || "the Account";

  // Get strategic priorities (4 focus areas)
  const strategicPriorities = generatedPlan?.strategicPriorities?.slice(0, 4) || [];
  
  // Platform capabilities for right column
  const platformCapabilities = generatedPlan?.platformCapabilities?.capabilities?.slice(0, 4) || [];
  
  // Vision statement
  const visionStatement = basics.visionStatement || 
    `To build the digital backbone that powers ${accountName}'s Integrator Strategy to deliver seamless, integrated logistics across a connected global network.`;

  // Default focus areas if none generated
  const defaultFocusAreas = [
    { 
      title: "Customer & Commercial Transformation or CRM Modernisation",
      description: "Building on the FY25 commercial evaluation to deliver a scalable, orchestrated customer service and commercial execution foundation that reduces cost-to-serve and enables growth."
    },
    { 
      title: "Operationalising AI",
      description: "Operationalising AI beyond isolated use cases to improve execution speed, decision quality, and productivity across customer, commercial, and operational workflows."
    },
    { 
      title: "Expanding the Platform Beyond IT",
      description: "FY26 focuses on broadening platform adoption beyond IT, using customer and service workflows as the entry point to enable enterprise-wide workflow orchestration."
    },
    { 
      title: "Maturing the Strategic Partnership",
      description: "Evolving the relationship from execution recovery toward long-term strategic partner underpinning digital, AI, and operating model ambitions."
    },
  ];

  const focusAreas = strategicPriorities.length > 0 
    ? strategicPriorities.map(p => ({ title: p.title, description: p.whyNow || p.winningLooks || "" }))
    : defaultFocusAreas;

  // Default platform enablement
  const defaultPlatformEnablement = [
    { title: "Unified Platform Foundation", description: "Single platform for IT, Customer, and Employee workflows enabling seamless orchestration" },
    { title: "AI-Powered Automation", description: "Now Assist and agentic AI capabilities embedded across workflows" },
    { title: "Enterprise Integration Hub", description: "Connect legacy systems, cloud applications, and data sources" },
    { title: "Workflow Orchestration", description: "End-to-end process automation across business functions" },
  ];

  const platformEnablement = platformCapabilities.length > 0 
    ? platformCapabilities.map(c => ({ title: c.title, description: c.description }))
    : defaultPlatformEnablement;

  const isAIGenerated = strategicPriorities.length > 0 || platformCapabilities.length > 0;
  const hasData = focusAreas.length > 0;

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32 relative overflow-hidden">
      {/* Background gradient accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title - Large and Bold */}
        <div className="flex items-start justify-between mb-8">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Account Strategy
            </span>
            {" "}
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              {fiscalYear}
            </span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <RegenerateSectionButton section="strategicPriorities" label="Regenerate" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
          </div>
        </div>

        {!hasData ? (
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in">
            <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Strategy Data</h3>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
              Generate an AI-powered strategic plan to populate the account strategy focus areas.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column - What FY26 will focus on */}
              <div className="col-span-7 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <div className="glass-card p-6 h-full border border-slate-600/30 bg-gradient-to-br from-slate-800/80 to-slate-900/50">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground">What {fiscalYear} will focus on</h2>
                    <span className="px-3 py-1 rounded-full border border-emerald-500/40 text-emerald-400 text-xs font-medium">
                      {fiscalYear} account strategy
                    </span>
                  </div>

                  {/* Strategic Focus Areas */}
                  <div className="space-y-4">
                    {focusAreas.map((area, index) => {
                      const IconComponent = pillarIcons[index % pillarIcons.length];
                      return (
                        <div 
                          key={index}
                          className="p-4 rounded-xl bg-slate-700/30 border border-slate-600/30 hover:border-emerald-500/30 transition-all duration-300 group opacity-0 animate-fade-in"
                          style={{ animationDelay: `${200 + index * 100}ms` }}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-2 h-full min-h-[40px] rounded-full bg-emerald-500/60 flex-shrink-0" />
                            <div className="flex-1">
                              <h3 className="text-emerald-400 font-semibold text-base mb-2 leading-snug">
                                {area.title}
                              </h3>
                              <p className="text-foreground/80 text-sm leading-relaxed">
                                {area.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column - Platform Enablement */}
              <div className="col-span-5 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
                <div className="glass-card p-6 h-full border border-primary/20 bg-gradient-to-br from-slate-800/80 to-slate-900/50">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground">Platform Enablement</h2>
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium border border-primary/30">
                      ServiceNow
                    </span>
                  </div>

                  {/* Platform Capabilities */}
                  <div className="space-y-4">
                    {platformEnablement.map((capability, index) => (
                      <div 
                        key={index}
                        className="group p-4 rounded-xl bg-slate-700/30 border border-slate-600/30 hover:border-primary/40 transition-all duration-300 opacity-0 animate-fade-in"
                        style={{ animationDelay: `${400 + index * 100}ms` }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                            {index === 0 && <Layers className="w-4 h-4 text-primary" />}
                            {index === 1 && <Cpu className="w-4 h-4 text-primary" />}
                            {index === 2 && <Zap className="w-4 h-4 text-primary" />}
                            {index === 3 && <Target className="w-4 h-4 text-primary" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-primary font-semibold text-sm mb-1">
                              {capability.title}
                            </h3>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                              {capability.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Connection indicator */}
                  <div className="mt-5 pt-4 border-t border-slate-600/30">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ArrowRight className="w-3 h-3 text-primary" />
                      <span>Enabling <span className="text-primary font-medium">{accountName}</span> transformation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vision Statement Bar */}
            <div 
              className="glass-card p-5 border border-cyan-500/30 bg-gradient-to-r from-slate-800/90 via-cyan-900/20 to-slate-800/90 opacity-0 animate-fade-in"
              style={{ animationDelay: "700ms" }}
            >
              <div className="flex items-center gap-4">
                <span className="text-cyan-400 font-bold text-lg flex-shrink-0">Vision</span>
                <div className="w-px h-8 bg-cyan-500/30" />
                <p className="text-foreground text-base leading-relaxed">
                  {visionStatement}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <SlideFooter />
    </div>
  );
};
