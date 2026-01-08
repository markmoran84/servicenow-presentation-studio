import { useAccountData } from "@/context/AccountDataContext";
import { Gauge, AlertTriangle } from "lucide-react";

export const CurrentStateSlide = () => {
  const { data } = useAccountData();

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
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

        {/* Pain Points Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {data.painPoints.painPoints.map((painPoint, index) => (
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

        {/* Adoption Constraints */}
        <div className="glass-card p-6 border-l-4 border-l-primary">
          <h3 className="font-bold text-foreground mb-4">Why Adoption Is Constrained</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-primary/5">
              <span className="text-sm font-medium text-foreground">Change Fatigue</span>
              <p className="text-xs text-muted-foreground mt-1">
                Users resistant after prior failed implementations
              </p>
            </div>
            <div className="p-3 rounded-lg bg-primary/5">
              <span className="text-sm font-medium text-foreground">Training Gaps</span>
              <p className="text-xs text-muted-foreground mt-1">
                Insufficient enablement for advanced capabilities
              </p>
            </div>
            <div className="p-3 rounded-lg bg-primary/5">
              <span className="text-sm font-medium text-foreground">Value Not Demonstrated</span>
              <p className="text-xs text-muted-foreground mt-1">
                Users don't see ROI from current platform usage
              </p>
            </div>
          </div>
        </div>

        {/* Summary Insight */}
        <div className="mt-6 glass-card p-4 border-t-4 border-t-primary opacity-0 animate-fade-in animation-delay-500">
          <p className="text-foreground/90">
            <span className="font-semibold text-primary">Assessment:</span> Platform health is improving but value realisation 
            remains constrained by fragmentation, governance gaps, and adoption barriers. FY26 must prioritise consolidation 
            and demonstrable outcomes over feature expansion.
          </p>
        </div>
      </div>
    </div>
  );
};
