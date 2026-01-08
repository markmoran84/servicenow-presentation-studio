import { useAccountData } from "@/context/AccountDataContext";
import { History, AlertTriangle, CheckCircle, XCircle, Eye } from "lucide-react";

export const FY1RetrospectiveSlide = () => {
  const { data } = useAccountData();

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
            <History className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">FY-1 Retrospective</h1>
            <p className="text-muted-foreground text-lg">What Actually Happened — Honest Assessment</p>
          </div>
          <div className="ml-auto pill-badge">
            FY25 Review
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - What Happened */}
          <div className="space-y-6">
            {/* What FY25 Focused On */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">What FY25 Focused On</h2>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <span className="font-medium text-foreground">Platform Stabilisation</span>
                    <p className="text-sm text-muted-foreground">
                      Addressing technical debt and performance issues from prior implementations
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <span className="font-medium text-foreground">Trust Rebuilding</span>
                    <p className="text-sm text-muted-foreground">
                      Re-establishing credibility with key stakeholders after over-customisation challenges
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <span className="font-medium text-foreground">Foundation Setting</span>
                    <p className="text-sm text-muted-foreground">
                      Creating conditions for FY26 expansion through governance and value demonstration
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Prior Plan Summary */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Prior Plan Summary</h2>
                  <p className="text-xs text-muted-foreground">
                    {data.history.lastPlanDate} • {data.history.plannerName}, {data.history.plannerRole}
                  </p>
                </div>
              </div>
              <p className="text-foreground/90 leading-relaxed">
                {data.history.lastPlanSummary}
              </p>
            </div>
          </div>

          {/* Right Column - Challenges & Context */}
          <div className="space-y-6">
            {/* What Did Not Work */}
            <div className="glass-card p-6 border-l-4 border-l-destructive/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-destructive" />
                </div>
                <h2 className="text-xl font-bold text-foreground">What Did Not Work</h2>
              </div>
              <p className="text-foreground/90 leading-relaxed mb-4">
                {data.history.whatDidNotWork}
              </p>
              <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                <h4 className="text-sm font-semibold text-destructive mb-2">Prior Transformation Attempts</h4>
                <p className="text-sm text-muted-foreground">
                  {data.history.priorTransformationAttempts}
                </p>
              </div>
            </div>

            {/* Why Stabilisation Was Necessary */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Why Stabilisation Was Necessary</h2>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-secondary/30">
                  <span className="text-sm font-medium text-foreground">Over-Customisation</span>
                  <p className="text-xs text-muted-foreground">
                    Deviated from platform best practices, creating upgrade complexity and maintenance burden
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <span className="text-sm font-medium text-foreground">Value Perception Gap</span>
                  <p className="text-xs text-muted-foreground">
                    Platform capability masked by implementation challenges — not delivering promised outcomes
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <span className="text-sm font-medium text-foreground">Trust Deficit</span>
                  <p className="text-xs text-muted-foreground">
                    Executive confidence eroded — required demonstration of reliability before expansion
                  </p>
                </div>
              </div>
            </div>

            {/* What Was Deprioritised */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-foreground mb-3">What Was Deliberately Deprioritised</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs">CRM Expansion</span>
                <span className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs">AI Use Cases</span>
                <span className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs">HR Service Delivery</span>
                <span className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs">SecOps Rollout</span>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                These initiatives were paused to focus resources on platform health — now ready for FY26.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
