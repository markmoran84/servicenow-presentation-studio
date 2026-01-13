import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { SlideFooter } from "@/components/SlideFooter";
import { 
  Sparkles,
  AlertCircle,
  Target,
  TrendingUp,
  Compass,
  ArrowUpRight,
  Crosshair,
  Rocket,
  Eye,
  CheckCircle2,
  Zap
} from "lucide-react";

// Strategic focus icons
const focusIcons = [Target, Compass, Crosshair, Rocket, TrendingUp, Zap];

export const AccountStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, generatedPlan } = data;

  const fiscalYear = "FY26";
  const accountName = basics.accountName || "the Account";

  // Get strategic priorities (up to 4 focus areas)
  const strategicPriorities = generatedPlan?.strategicPriorities?.slice(0, 4) || [];
  
  // Account Team Strategies (from opportunities section)
  const accountStrategies = data.opportunities?.opportunities?.slice(0, 3) || [];
  
  // Vision statement
  const visionStatement = data.accountStrategy.visionStatement || 
    `To establish ServiceNow as the strategic platform partner that powers ${accountName}'s digital transformation across customer experience, operational excellence, and AI-driven innovation.`;

  // Default focus areas if none generated
  const defaultFocusAreas = [
    { 
      title: "Strategic Platform Expansion",
      description: "Evolve from point solutions to enterprise-wide platform adoption, enabling connected workflows across business functions.",
      whyNow: "Digital transformation urgency and competitive pressure require unified platform approach."
    },
    { 
      title: "AI-Powered Transformation",
      description: "Deploy Now Assist and agentic AI capabilities to automate workflows, enhance decision-making, and improve productivity.",
      whyNow: "AI readiness and board mandate to operationalize AI across the enterprise."
    },
    { 
      title: "Customer Experience Excellence",
      description: "Modernize customer-facing workflows to deliver seamless omnichannel experiences and reduce cost-to-serve.",
      whyNow: "Rising customer expectations and competitive differentiation needs."
    },
    { 
      title: "Strategic Partnership Maturity",
      description: "Transition from vendor relationship to trusted strategic partner aligned with long-term business objectives.",
      whyNow: "Executive sponsorship opportunity and transformation alignment."
    },
  ];

  const focusAreas = strategicPriorities.length > 0 
    ? strategicPriorities.map(p => ({ 
        title: p.title, 
        description: p.winningLooks || p.whyNow || "",
        whyNow: p.whyNow || ""
      }))
    : defaultFocusAreas;

  // Default account strategies if none defined
  const defaultAccountStrategies = [
    { title: "Executive Alignment", description: "Build C-suite relationships and strategic alignment" },
    { title: "Value Realization", description: "Demonstrate quantifiable business outcomes" },
    { title: "Platform Adoption", description: "Expand footprint across business units" },
  ];

  const displayStrategies = accountStrategies.length > 0 && accountStrategies.some((s: any) => s.title?.trim())
    ? accountStrategies.filter((s: any) => s.title?.trim())
    : defaultAccountStrategies;

  const isAIGenerated = strategicPriorities.length > 0;
  const hasData = focusAreas.length > 0;

  return (
    <div className="h-full overflow-auto p-6 md:p-10 pb-28 relative">
      {/* Background gradient accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[900px] h-[600px] bg-gradient-to-bl from-emerald-500/8 via-teal-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[500px] bg-gradient-to-tr from-primary/8 via-cyan-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-emerald-400/4 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title Header */}
        <div className="flex items-start justify-between mb-8 opacity-0 animate-fade-in">
          <div>
            <p className="text-muted-foreground text-xs tracking-widest uppercase mb-2 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5" />
              Strategic Account Planning
            </p>
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
            {/* Vision Statement - Hero Banner */}
            <div 
              className="glass-card p-6 border border-emerald-500/40 bg-gradient-to-r from-slate-800/95 via-emerald-900/20 to-slate-800/95 
                         shadow-xl shadow-emerald-500/10 opacity-0 animate-fade-in relative overflow-hidden"
              style={{ animationDelay: "100ms" }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full blur-2xl" />
              <div className="flex items-start gap-5 relative z-10">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 flex items-center justify-center border border-emerald-500/40 shadow-lg shadow-emerald-500/20">
                    <Eye className="w-7 h-7 text-emerald-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-emerald-400 font-bold text-lg">Account Team Vision</h2>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                      {fiscalYear}
                    </span>
                  </div>
                  <p className="text-foreground text-lg leading-relaxed font-medium">
                    {visionStatement}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column - Strategic Focus Areas */}
              <div 
                className="col-span-8 opacity-0 animate-fade-in" 
                style={{ animationDelay: "200ms" }}
              >
                <div className="glass-card p-6 h-full border border-slate-600/40 bg-gradient-to-br from-slate-800/90 via-slate-850/80 to-slate-900/70 shadow-xl">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-cyan-400 to-cyan-600" />
                      <div>
                        <h2 className="text-xl font-bold text-foreground">What {fiscalYear} Will Focus On</h2>
                        <p className="text-sm text-muted-foreground">Strategic priorities driving account growth</p>
                      </div>
                    </div>
                    <span className="px-4 py-1.5 rounded-full border border-cyan-500/50 text-cyan-400 text-xs font-semibold bg-cyan-500/10">
                      Core Focus
                    </span>
                  </div>

                  {/* Strategic Focus Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {focusAreas.map((area, index) => {
                      const IconComponent = focusIcons[index % focusIcons.length];
                      return (
                        <div 
                          key={index}
                          className="group p-5 rounded-xl bg-gradient-to-br from-slate-700/50 to-slate-800/40 
                                     border border-slate-600/40 hover:border-cyan-500/50 
                                     transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10
                                     opacity-0 animate-fade-in relative overflow-hidden"
                          style={{ animationDelay: `${280 + index * 80}ms` }}
                        >
                          {/* Accent Corner */}
                          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 via-cyan-500 to-cyan-600 rounded-l-xl" />
                          
                          <div className="pl-3">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 
                                              flex items-center justify-center flex-shrink-0 border border-cyan-500/30
                                              group-hover:from-cyan-500/30 group-hover:to-cyan-600/20 transition-all duration-300">
                                <IconComponent className="w-5 h-5 text-cyan-400" />
                              </div>
                              <h3 className="text-cyan-300 font-bold text-base leading-snug group-hover:text-cyan-200 transition-colors flex-1">
                                {area.title}
                              </h3>
                            </div>
                            <p className="text-foreground/80 text-sm leading-relaxed">
                              {area.description}
                            </p>
                            {area.whyNow && (
                              <div className="mt-3 pt-3 border-t border-slate-600/30">
                                <span className="text-xs text-cyan-400/80 font-medium">Why Now: </span>
                                <span className="text-xs text-muted-foreground">{area.whyNow}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column - Account Team Strategies & Key Outcomes */}
              <div 
                className="col-span-4 opacity-0 animate-fade-in space-y-5" 
                style={{ animationDelay: "300ms" }}
              >
                {/* Account Team Strategies */}
                <div className="glass-card p-5 border border-primary/30 bg-gradient-to-br from-slate-800/90 via-primary/5 to-slate-900/70 shadow-xl shadow-primary/5">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-primary to-primary/60" />
                    <h2 className="text-lg font-bold text-foreground">How We'll Win</h2>
                  </div>

                  <div className="space-y-3">
                    {displayStrategies.slice(0, 3).map((strategy: any, index: number) => (
                      <div 
                        key={index}
                        className="group p-4 rounded-xl bg-gradient-to-br from-slate-700/40 to-slate-800/30 
                                   border border-slate-600/30 hover:border-primary/50 
                                   transition-all duration-300 hover:shadow-lg hover:shadow-primary/10
                                   opacity-0 animate-fade-in"
                        style={{ animationDelay: `${450 + index * 70}ms` }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-primary/20 
                                          flex items-center justify-center flex-shrink-0 border border-primary/30
                                          group-hover:from-primary/40 group-hover:to-primary/30 transition-all duration-300">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-primary font-bold text-sm mb-1 group-hover:text-primary/90 transition-colors">
                              {strategy.title}
                            </h3>
                            <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                              {strategy.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Success Metrics Preview */}
                <div 
                  className="glass-card p-5 border border-amber-500/30 bg-gradient-to-br from-slate-800/90 via-amber-900/10 to-slate-900/70 shadow-xl shadow-amber-500/5
                             opacity-0 animate-fade-in"
                  style={{ animationDelay: "650ms" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-amber-400 to-amber-600" />
                    <h2 className="text-lg font-bold text-foreground">Key Outcomes</h2>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 border border-slate-600/30">
                      <span className="text-sm text-muted-foreground">Next FY Target</span>
                      <span className="text-amber-400 font-bold text-base">{basics.nextFYAmbition || "TBD"}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 border border-slate-600/30">
                      <span className="text-sm text-muted-foreground">3-Year Ambition</span>
                      <span className="text-amber-400 font-bold text-base">{basics.threeYearAmbition || "TBD"}</span>
                    </div>
                    {basics.renewalDates && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 border border-slate-600/30">
                        <span className="text-sm text-muted-foreground">Key Renewal</span>
                        <span className="text-amber-400 font-bold text-sm">{basics.renewalDates}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-600/30 flex items-center gap-2 text-sm">
                    <ArrowUpRight className="w-4 h-4 text-amber-400" />
                    <span className="text-muted-foreground">
                      Enabling <span className="text-amber-400 font-semibold">{accountName}</span> growth
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
