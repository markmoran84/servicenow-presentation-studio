import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Eye, ExternalLink, CheckCircle, Sparkles, ArrowRight, Lightbulb, AlertCircle } from "lucide-react";

export const FY1RetrospectiveSlide = () => {
  const { data } = useAccountData();
  const { history, generatedPlan, basics } = data;

  // Use AI-generated retrospective if available
  const isAIGenerated = !!generatedPlan?.fy1Retrospective;
  
  const focusAreas = generatedPlan?.fy1Retrospective?.focusAreas || [];
  const keyLessons = generatedPlan?.fy1Retrospective?.keyLessons || history.lastPlanSummary || "";
  const lookingAhead = generatedPlan?.fy1Retrospective?.lookingAhead || "";

  const hasData = history.lastPlanDate || history.plannerName || history.lastPlanSummary || focusAreas.length > 0;

  return (
    <div className="h-full overflow-auto p-8 md:p-12 pb-32">
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

        {!hasData ? (
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in">
            <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Historical Data</h3>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
              Complete the Account History section in the Input Form or generate an AI plan to populate the FY-1 retrospective.
            </p>
          </div>
        ) : (
          <>
            {/* Top Row - Date and Planner Cards */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Previous Account Plan Date */}
              <div className="glass-card p-5 flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Previous Account Plan Date:</span>
                <span className="text-foreground font-medium">{history.lastPlanDate || "Not specified"}</span>
              </div>

              {/* Previous Account Planner */}
              <div className="glass-card p-5 flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Previous Account Planner:</span>
                <div className="text-right">
                  <div className="text-foreground font-semibold">{history.plannerName || "Not specified"}</div>
                  {history.plannerRole && (
                    <div className="text-muted-foreground text-sm">{history.plannerRole}</div>
                  )}
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
                {history.lastPlanSummary ? (
                  <p className="text-foreground/90 leading-relaxed mb-4">
                    {history.lastPlanSummary}
                  </p>
                ) : (
                  <p className="text-muted-foreground italic mb-4">
                    No summary provided
                  </p>
                )}
                {history.whatDidNotWork && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-sm font-medium text-red-400 mb-1">Challenges Encountered</p>
                    <p className="text-foreground/80 text-sm leading-relaxed">
                      {history.whatDidNotWork}
                    </p>
                  </div>
                )}
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
                    Previous Account Strategy
                  </span>
                </div>

                {focusAreas.length > 0 ? (
                  <div className="space-y-4">
                    {focusAreas.map((area, index) => (
                      <div key={index} className="opacity-0 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                        <h3 className="text-primary font-semibold text-sm mb-1">{area.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{area.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">
                    Generate an AI plan to see focus area analysis
                  </p>
                )}
              </div>
            </div>

            {/* Key Lessons & Looking Ahead */}
            {(keyLessons || lookingAhead) && (
              <div className="grid grid-cols-2 gap-6 mb-6">
                {keyLessons && (
                  <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <h3 className="font-semibold text-foreground text-sm">Key Lessons Learned</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{keyLessons}</p>
                  </div>
                )}
                {lookingAhead && (
                  <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                      <h3 className="font-semibold text-foreground text-sm">
                        Looking Ahead{basics.accountName ? ` to ${basics.accountName}` : ""}
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{lookingAhead}</p>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Row - Status */}
            <div className="glass-card p-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Historical context for strategic planning
              </span>
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Context Loaded</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
