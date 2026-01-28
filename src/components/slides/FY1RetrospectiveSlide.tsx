import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Sparkles, ArrowRight, AlertCircle, ExternalLink } from "lucide-react";

export const FY1RetrospectiveSlide = () => {
  const { data } = useAccountData();
  const { history, generatedPlan, basics } = data;

  // Use AI-generated retrospective if available
  const isAIGenerated = !!generatedPlan?.fy1Retrospective;
  
  const focusAreas = generatedPlan?.fy1Retrospective?.focusAreas || [];
  const keyLessons = generatedPlan?.fy1Retrospective?.keyLessons || history.lastPlanSummary || "";
  const lookingAhead = generatedPlan?.fy1Retrospective?.lookingAhead || "";
  const narrativeSummary = history.whatDidNotWork || "";

  const hasData = history.lastPlanDate || history.plannerName || history.lastPlanSummary || focusAreas.length > 0;

  return (
    <div className="min-h-screen p-8 md:p-10 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
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
          <div className="space-y-5">
            {/* Top Row - Date and Planner Cards */}
            <div className="grid grid-cols-2 gap-5">
              <div className="glass-card p-4 flex items-center justify-between opacity-0 animate-fade-in" style={{ animationDelay: "50ms" }}>
                <span className="text-muted-foreground text-sm">Previous Account Plan Date:</span>
                <span className="text-foreground font-medium">{history.lastPlanDate || "08/01/2025"}</span>
              </div>
              <div className="glass-card p-4 flex items-center justify-between opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <span className="text-muted-foreground text-sm">Previous Account Planners</span>
                <span className="text-foreground font-medium">{history.plannerName || "Core Team"}</span>
              </div>
            </div>

            {/* Main Content - Two Columns */}
            <div className="grid grid-cols-2 gap-5">
              {/* Left Column - What FY25 Focused On */}
              <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "150ms" }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-foreground">What FY25 focused on</h2>
                  <span className="px-2.5 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-medium">
                    Previous account strategy
                  </span>
                </div>

                <div className="space-y-4">
                  {focusAreas.length > 0 ? (
                    focusAreas.map((area: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary/50 pl-3">
                        <h3 className="text-primary font-semibold text-sm mb-1">{area.title}</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">{area.description}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="border-l-2 border-primary/50 pl-3">
                        <h3 className="text-primary font-semibold text-sm mb-1">Rebuilding Trust</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          Re-establishing credibility with key stakeholders after constrained the perceived value of existing investments
                        </p>
                      </div>
                      <div className="border-l-2 border-primary/50 pl-3">
                        <h3 className="text-primary font-semibold text-sm mb-1">Platform Stabilisation</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          Addressing technical debt and performance issues from prior implementations
                        </p>
                      </div>
                      <div className="border-l-2 border-primary/50 pl-3">
                        <h3 className="text-primary font-semibold text-sm mb-1">CRM Modernisation</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          Participating in a customer-led commercial evaluation to address cost-to-serve, execution risk, and scalability
                        </p>
                      </div>
                      <div className="border-l-2 border-primary/50 pl-3">
                        <h3 className="text-primary font-semibold text-sm mb-1">Foundation Setting</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          Creating conditions for FY26 expansion through governance and value demonstration
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Right Column - Narrative Summary */}
              <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
                <p className="text-foreground/90 text-sm leading-relaxed">
                  {narrativeSummary || `In FY25, our focus was on stabilising the ${basics.accountName || "customer"}–ServiceNow partnership and restoring confidence in execution. Platform health challenges driven by over-customisation had constrained the perceived value of existing investments, making remediation of the foundation a critical priority within the plan.`}
                </p>
                <p className="text-foreground/90 text-sm leading-relaxed mt-4">
                  {lookingAhead || `From there, the account strategy was deliberately shaped around the customer's AI-first ambition. We centred the engagement on AI-led use cases, with ServiceNow positioned as the underlying platform to embed AI as a core capability across customer, commercial, and service workflows.`}
                </p>
              </div>
            </div>

            {/* Bottom Row - Lessons & Looking Ahead */}
            <div className="grid grid-cols-2 gap-5">
              <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "250ms" }}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-primary text-sm">Key Lessons Learned</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {keyLessons || "Heavy reporting, governance overhead, and deal velocity have constrained momentum. Success requires lighter governance, clearer accountability, and maintaining agility and optionality to accelerate decisions, execution, and value creation without adding unnecessary operational burden."}
                </p>
              </div>
              <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-primary text-sm">Looking Ahead to Fy+1</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {lookingAhead || `The partnership must now pivot from remediation to strategic value creation. We will elevate the conversation from IT-centric use cases to C-suite business problems, explicitly connecting the ServiceNow platform to the customer's Integrator strategy.`}
                </p>
              </div>
            </div>

            {/* Footer Row */}
            <div className="glass-card p-4 flex items-center justify-between opacity-0 animate-fade-in" style={{ animationDelay: "350ms" }}>
              <a href="#" className="text-primary text-sm flex items-center gap-1.5 hover:underline">
                <ExternalLink className="w-3.5 h-3.5" />
                Link to Previous Account Plan
              </a>
              <span className="text-primary text-sm font-medium">Approved</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
