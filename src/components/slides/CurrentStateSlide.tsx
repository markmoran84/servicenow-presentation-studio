import { useAccountData } from "@/context/AccountDataContext";
import { Gauge, AlertTriangle } from "lucide-react";

export const CurrentStateSlide = () => {
  const { data } = useAccountData();

  return (
    <div className="min-h-screen p-8 md:p-12 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header - Two-tone style */}
        <div className="slide-header flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="sn-icon-box-warning">
              <Gauge className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h1 className="slide-header-title">
                <span className="text-primary">Current State</span>{" "}
                <span className="text-foreground">Assessment</span>
              </h1>
              <p className="slide-header-subtitle">Where value is leaking and complexity exists</p>
            </div>
          </div>
          <div className="sn-badge-accent">
            Platform Health
          </div>
        </div>

        {/* Pain Points Grid */}
        <div className="grid grid-cols-2 gap-5 mb-6">
          {data.painPoints.painPoints.map((painPoint, index) => (
            <div 
              key={index}
              className="glass-card p-6 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="flex items-start gap-4">
                <div className="sn-icon-box-warning flex-shrink-0 w-10 h-10">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-warning mb-1">Pain Point {index + 1}</div>
                  <h3 className="font-semibold text-foreground mb-2">{painPoint.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{painPoint.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Adoption Constraints - with Wasabi Green left border */}
        <div className="sn-glass-emphasis p-6 sn-callout opacity-0 animate-fade-in animation-delay-400" style={{ animationFillMode: 'forwards' }}>
          <h3 className="font-semibold text-foreground mb-4">Why Adoption Is Constrained</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="data-item">
              <span className="text-sm font-medium text-foreground">Change Fatigue</span>
              <p className="text-xs text-muted-foreground mt-1">
                Users resistant after prior failed implementations
              </p>
            </div>
            <div className="data-item">
              <span className="text-sm font-medium text-foreground">Training Gaps</span>
              <p className="text-xs text-muted-foreground mt-1">
                Insufficient enablement for advanced capabilities
              </p>
            </div>
            <div className="data-item">
              <span className="text-sm font-medium text-foreground">Value Not Demonstrated</span>
              <p className="text-xs text-muted-foreground mt-1">
                Users don't see ROI from current platform usage
              </p>
            </div>
          </div>
        </div>

        {/* Summary Insight */}
        <div className="mt-6 sn-glass p-5 opacity-0 animate-fade-in animation-delay-500" style={{ animationFillMode: 'forwards' }}>
          <p className="text-foreground/90 leading-relaxed">
            <span className="font-semibold text-primary">Assessment:</span> Platform health is improving but value realisation 
            remains constrained by fragmentation, governance gaps, and adoption barriers. FY26 must prioritise consolidation 
            and demonstrable outcomes over feature expansion.
          </p>
        </div>
      </div>
    </div>
  );
};
