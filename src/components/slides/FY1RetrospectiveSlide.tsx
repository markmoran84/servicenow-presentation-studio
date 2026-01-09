import { useAccountData } from "@/context/AccountDataContext";
import { Eye, ExternalLink, CheckCircle } from "lucide-react";

export const FY1RetrospectiveSlide = () => {
  const { data } = useAccountData();

  const focusAreas = [
    {
      title: "Rebuilding Trust",
      description: "Re-establishing credibility with key stakeholders after constrained the perceived value of existing investments"
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

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent mb-8">
          FY-1 Retrospective
        </h1>

        {/* Top Row - Date and Planner Cards */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Previous Account Plan Date */}
          <div className="glass-card p-5 flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Previous Account Plan Date:</span>
            <span className="text-foreground font-medium">{data.history.lastPlanDate || "MM/DD/YYY"}</span>
          </div>

          {/* Previous Account Planner */}
          <div className="glass-card p-5 flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Previous Account Planner:</span>
            <div className="text-right">
              <div className="text-foreground font-semibold">{data.history.plannerName}</div>
              <div className="text-muted-foreground text-sm">{data.history.plannerRole}</div>
            </div>
          </div>
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Left Column - Summary Narrative */}
          <div className="glass-card p-6">
            <p className="text-foreground/90 leading-relaxed mb-4">
              {data.history.lastPlanSummary}
            </p>
            <p className="text-foreground/90 leading-relaxed">
              {data.history.whatDidNotWork}
            </p>
          </div>

          {/* Right Column - What FY Focused On */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">What 2025 focused on</h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                FY25 Account Strategy
              </span>
            </div>

            <div className="space-y-4">
              {focusAreas.map((area, index) => (
                <div key={index}>
                  <h3 className="text-primary font-semibold text-sm mb-1">{area.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{area.description}</p>
                </div>
              ))}
            </div>
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
