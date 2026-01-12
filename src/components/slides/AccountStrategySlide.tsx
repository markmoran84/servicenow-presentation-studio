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
  ArrowRight,
  Lightbulb,
  Network,
  Bot,
  Workflow,
  Eye
} from "lucide-react";

// Strategic pillar icons mapping
const pillarIcons = [Users, Cpu, Layers, Handshake, Building, Zap, Target, TrendingUp];
const platformIcons = [Layers, Bot, Network, Workflow];

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
  const visionStatement = data.accountStrategy.visionStatement || 
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
    <div className="min-h-screen p-6 md:p-10 pb-28 relative overflow-hidden">
      {/* Background gradient accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[900px] h-[600px] bg-gradient-to-bl from-emerald-500/6 via-teal-500/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[500px] bg-gradient-to-tr from-primary/6 via-cyan-500/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/4 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title - Large and Bold */}
        <div className="flex items-start justify-between mb-8 opacity-0 animate-fade-in">
          <div>
            <p className="text-muted-foreground text-xs tracking-widest uppercase mb-2">Strategic Account Planning</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
                Account Strategy
              </span>
              {" "}
              <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                {fiscalYear}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <RegenerateSectionButton section="strategicPriorities" label="Regenerate" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 text-xs text-accent font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                AI Generated
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
              Generate an AI-powered strategic plan to populate the account strategy focus areas.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column - What FY26 will focus on */}
              <div 
                className="col-span-7 opacity-0 animate-fade-in" 
                style={{ animationDelay: "100ms" }}
              >
                <div className="glass-card p-6 h-full border border-slate-600/40 bg-gradient-to-br from-slate-800/90 via-slate-850/80 to-slate-900/70 shadow-xl">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
                      <h2 className="text-xl font-bold text-foreground">What {fiscalYear} will focus on</h2>
                    </div>
                    <span className="px-4 py-1.5 rounded-full border border-emerald-500/50 text-emerald-400 text-xs font-semibold bg-emerald-500/10">
                      {fiscalYear} account strategy
                    </span>
                  </div>

                  {/* Strategic Focus Areas */}
                  <div className="space-y-4">
                    {focusAreas.map((area, index) => {
                      return (
                        <div 
                          key={index}
                          className="p-5 rounded-xl bg-gradient-to-br from-slate-700/40 to-slate-800/30 
                                     border border-slate-600/40 hover:border-emerald-500/40 
                                     transition-all duration-300 group hover:shadow-lg hover:shadow-emerald-500/5
                                     opacity-0 animate-fade-in"
                          style={{ animationDelay: `${180 + index * 80}ms` }}
                        >
                          <div className="flex items-start gap-4">
                            {/* Accent bar */}
                            <div className="w-1.5 h-full min-h-[60px] rounded-full bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 flex-shrink-0" />
                            <div className="flex-1">
                              <h3 className="text-emerald-400 font-bold text-base mb-2 leading-snug group-hover:text-emerald-300 transition-colors">
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
              <div 
                className="col-span-5 opacity-0 animate-fade-in" 
                style={{ animationDelay: "200ms" }}
              >
                <div className="glass-card p-6 h-full border border-primary/30 bg-gradient-to-br from-slate-800/90 via-primary/5 to-slate-900/70 shadow-xl shadow-primary/5">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-primary to-primary/60" />
                      <h2 className="text-xl font-bold text-foreground">Platform Enablement</h2>
                    </div>
                    <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 text-primary text-xs font-semibold border border-primary/40">
                      ServiceNow
                    </span>
                  </div>

                  {/* Platform Capabilities */}
                  <div className="space-y-4">
                    {platformEnablement.map((capability, index) => {
                      const IconComponent = platformIcons[index % platformIcons.length];
                      return (
                        <div 
                          key={index}
                          className="group p-4 rounded-xl bg-gradient-to-br from-slate-700/40 to-slate-800/30 
                                     border border-slate-600/30 hover:border-primary/50 
                                     transition-all duration-300 hover:shadow-lg hover:shadow-primary/10
                                     opacity-0 animate-fade-in"
                          style={{ animationDelay: `${350 + index * 80}ms` }}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/20 
                                            flex items-center justify-center flex-shrink-0 border border-primary/30
                                            group-hover:from-primary/40 group-hover:to-primary/30 transition-all duration-300">
                              <IconComponent className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-primary font-bold text-sm mb-1.5 group-hover:text-primary/90 transition-colors">
                                {capability.title}
                              </h3>
                              <p className="text-muted-foreground text-xs leading-relaxed">
                                {capability.description}
                              </p>
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
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                        <ArrowRight className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-muted-foreground">
                        Enabling <span className="text-primary font-semibold">{accountName}</span> transformation
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vision Statement Bar */}
            <div 
              className="glass-card p-5 border border-cyan-500/40 bg-gradient-to-r from-slate-800/95 via-cyan-900/20 to-slate-800/95 
                         shadow-xl shadow-cyan-500/5 opacity-0 animate-fade-in"
              style={{ animationDelay: "750ms" }}
            >
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/30 to-cyan-600/20 flex items-center justify-center border border-cyan-500/40">
                    <Eye className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-cyan-400 font-bold text-lg">Vision</span>
                </div>
                <div className="w-px h-10 bg-cyan-500/30" />
                <p className="text-foreground text-base leading-relaxed flex-1">
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
