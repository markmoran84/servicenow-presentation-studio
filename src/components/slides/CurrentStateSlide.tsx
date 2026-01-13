import { useAccountData } from "@/context/AccountDataContext";
import { Gauge, AlertTriangle, Info } from "lucide-react";

export const CurrentStateSlide = () => {
  const { data } = useAccountData();
  const painPoints = data.painPoints.painPoints || [];
  const companyName = data.basics.accountName || "the customer";

  const hasContent = painPoints.length > 0;

  return (
    <div className="h-full overflow-auto p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-warning/20 flex items-center justify-center">
            <Gauge className="w-7 h-7 text-warning" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Current State Assessment</h1>
            <p className="text-muted-foreground text-lg">Where value is leaking and complexity exists</p>
          </div>
          <div className="ml-auto pill-badge-accent">
            Platform Health
          </div>
        </div>

        {!hasContent ? (
          <div className="glass-card rounded-2xl p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Pain Points Identified</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Add pain points in the Input Form to populate this current state assessment for {companyName}.
            </p>
          </div>
        ) : (
          <>
            {/* Pain Points Grid */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {painPoints.map((painPoint, index) => (
                <div 
                  key={index}
                  className="glass-card p-6 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-destructive mb-1">Pain Point {index + 1}</div>
                      <h3 className="font-bold text-foreground mb-2">{painPoint.title}</h3>
                      <p className="text-sm text-foreground/80">{painPoint.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Adoption Constraints - only show if we have pain points */}
            <div className="glass-card p-6 border-l-4 border-l-primary">
              <h3 className="font-bold text-foreground mb-4">Adoption Considerations</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-primary/5">
                  <span className="text-sm font-medium text-foreground">Change Management</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    User adoption requires proactive enablement and communication
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-primary/5">
                  <span className="text-sm font-medium text-foreground">Training & Enablement</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Capability building for advanced platform features
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-primary/5">
                  <span className="text-sm font-medium text-foreground">Value Demonstration</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Clear ROI metrics and success stories to drive adoption
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Insight */}
            <div className="mt-6 glass-card p-4 border-t-4 border-t-primary opacity-0 animate-fade-in animation-delay-500">
              <p className="text-foreground/90">
                <span className="font-semibold text-primary">Assessment:</span> Addressing these pain points 
                is critical for {companyName}'s transformation success. Focus on consolidation, governance, 
                and demonstrable outcomes.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
