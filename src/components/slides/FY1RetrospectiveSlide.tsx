import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Eye, ExternalLink, CheckCircle, Sparkles, ArrowRight, Lightbulb } from "lucide-react";

export const FY1RetrospectiveSlide = () => {
  const { data } = useAccountData();
  const { history, generatedPlan, basics } = data;

  // Use AI-generated retrospective if available
  const isAIGenerated = !!generatedPlan?.fy1Retrospective;
  
  const focusAreas = generatedPlan?.fy1Retrospective?.focusAreas || [
    {
      title: "Rebuilding Trust",
      description: "Re-establishing credibility with key stakeholders after constraints limited the perceived value of existing investments"
    },
    {
      title: "Platform Stabilisation",
      description: "Addressing technical debt and performance issues from prior implementations"
    },
    {
      title: "CRM Modernisation",
      description: "Participating in a customer-led commercial evaluation to address cost-to-serve, execution risk, and scalability of the customer service platform"
    },
    {
      title: "Foundation Setting",
      description: "Creating conditions for FY26 expansion through governance and value demonstration"
    }
  ];

  const keyLessons = generatedPlan?.fy1Retrospective?.keyLessons || 
    "Despite initial setbacks with over-customisation, the team demonstrated resilience and rebuilt stakeholder confidence through consistent delivery and transparent communication.";
  
  const lookingAhead = generatedPlan?.fy1Retrospective?.lookingAhead ||
    "The foundation laid in FY-1 positions us for strategic expansion. CRM modernisation success will unlock broader platform adoption and AI operationalisation opportunities.";

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
            FY-1 Retrospective
          </h1>
          <div className="flex items-center gap-2">
            <RegenerateSectionButton section="fy1Retrospective" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
          </div>
        </div>

        {/* Top Row - Date and Planner Cards */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Previous Account Plan Date */}
          <div className="glass-card p-5 flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Previous Account Plan Date:</span>
            <span className="text-foreground font-medium">{history.lastPlanDate || "MM/DD/YYY"}</span>
          </div>

          {/* Previous Account Planner */}
          <div className="glass-card p-5 flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Previous Account Planner:</span>
            <div className="text-right">
              <div className="text-foreground font-semibold">{history.plannerName}</div>
              <div className="text-muted-foreground text-sm">{history.plannerRole}</div>
            </div>
          </div>
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Left Column - Summary Narrative */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">What Happened</h2>
            </div>
            <p className="text-foreground/90 leading-relaxed mb-4">
              {history.lastPlanSummary}
            </p>
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm font-medium text-red-400 mb-1">Challenges Encountered</p>
              <p className="text-foreground/80 text-sm leading-relaxed">
                {history.whatDidNotWork}
              </p>
            </div>
          </div>

          {/* Right Column - What FY Focused On */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">What FY-1 Focused On</h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                FY25 Account Strategy
              </span>
            </div>

            <div className="space-y-4">
              {focusAreas.map((area, index) => (
                <div key={index} className="opacity-0 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <h3 className="text-primary font-semibold text-sm mb-1">{area.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{area.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Lessons & Looking Ahead */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <h3 className="font-semibold text-foreground text-sm">Key Lessons Learned</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">{keyLessons}</p>
          </div>
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <ArrowRight className="w-4 h-4 text-emerald-400" />
              <h3 className="font-semibold text-foreground text-sm">Looking Ahead to {basics.accountName}</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">{lookingAhead}</p>
          </div>
        </div>

        {/* Bottom Row - Link and Status */}
        <div className="glass-card p-4 flex items-center justify-between">
          <a 
            href="#" 
            className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Link of Last Account Plan Summary
          </a>
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Approved</span>
          </div>
        </div>
      </div>
    </div>
  );
};
