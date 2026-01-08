import { Target, Building2, Users, Zap, CheckCircle2 } from "lucide-react";

const alignmentData = [
  {
    category: "Organisational Objectives",
    icon: Building2,
    color: "primary",
    items: [
      { title: "Integrated Logistics Leader", description: "'All the Way' end-to-end supply chain ownership" },
      { title: "Cost Discipline", description: "Rigorous ROI on every technology investment" },
      { title: "Customer Experience", description: "Record-high CSAT through seamless service delivery" },
      { title: "Net Zero 2040", description: "Decarbonisation leadership with green methanol fleet" },
    ],
  },
  {
    category: "CXO Priorities",
    icon: Users,
    color: "accent",
    items: [
      { title: "Digital Transformation", description: "AI-first operations with predictive analytics" },
      { title: "Platform Consolidation", description: "Reduce tool sprawl, unify workflows" },
      { title: "Operational Resilience", description: "Navigate disruption (Red Sea, Cape routing)" },
      { title: "Speed to Value", description: "Faster deployment, quicker business outcomes" },
    ],
  },
  {
    category: "ServiceNow Alignment",
    icon: Zap,
    color: "primary",
    items: [
      { title: "Workflow Automation", description: "Digital backbone for enterprise processes" },
      { title: "AI Operationalisation", description: "From AI experiments to production workflows" },
      { title: "Service Management", description: "Unified IT, HR, Customer, and Field Service" },
      { title: "Platform Play", description: "Single platform replacing point solutions" },
    ],
  },
  {
    category: "Target Outcomes",
    icon: CheckCircle2,
    color: "accent",
    items: [
      { title: "Efficiency Gains", description: "30%+ reduction in manual process effort" },
      { title: "CSAT Improvement", description: "Measurable customer experience uplift" },
      { title: "Cost Avoidance", description: "Consolidation savings from tool rationalisation" },
      { title: "Time to Resolution", description: "50% faster case and incident resolution" },
    ],
  },
];

export const StrategicAlignmentSlide = () => {
  return (
    <div className="min-h-screen px-8 pt-6 pb-24">
      {/* Header - Two-tone style */}
      <div className="slide-header flex items-center justify-between opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
        <div className="flex items-center gap-4">
          <div className="sn-icon-box">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="slide-header-title">
              <span className="text-primary">Strategic</span>{" "}
              <span className="text-foreground">Alignment</span>
            </h1>
            <p className="slide-header-subtitle">Connecting Maersk priorities to ServiceNow value</p>
          </div>
        </div>
        <div className="sn-badge">
          FY26 Planning
        </div>
      </div>

      {/* Four Column Grid - Template style */}
      <div className="grid grid-cols-4 gap-4">
        {alignmentData.map((column, colIndex) => (
          <div
            key={column.category}
            className="opacity-0 animate-fade-in"
            style={{ animationDelay: `${100 + colIndex * 100}ms`, animationFillMode: 'forwards' }}
          >
            {/* Column Header with colored bottom border */}
            <div className={column.color === 'accent' ? 'column-header-accent' : 'column-header'}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                column.color === 'accent' 
                  ? 'bg-accent/15' 
                  : 'bg-primary/15'
              }`}>
                <column.icon className={`w-4 h-4 ${
                  column.color === 'accent' ? 'text-accent' : 'text-primary'
                }`} />
              </div>
              <h2 className="font-semibold text-foreground text-sm uppercase tracking-wide">
                {column.category}
              </h2>
            </div>

            {/* Items in glass cards */}
            <div className="space-y-3">
              {column.items.map((item, itemIndex) => (
                <div
                  key={item.title}
                  className="glass-card p-4 transition-all duration-300 hover:border-primary/30 group"
                >
                  <h3 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Connection Flow Indicator */}
      <div className="mt-8 flex items-center justify-center gap-4 opacity-0 animate-fade-in animation-delay-500" style={{ animationFillMode: 'forwards' }}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground">Maersk Strategy</span>
          <div className="w-20 h-0.5 bg-gradient-to-r from-primary to-primary/30"></div>
        </div>
        <div className="w-3 h-3 rounded-full bg-primary/60 animate-pulse"></div>
        <div className="flex items-center gap-3">
          <div className="w-20 h-0.5 bg-gradient-to-r from-accent/30 to-accent"></div>
          <span className="text-xs font-medium text-muted-foreground">ServiceNow Value</span>
        </div>
      </div>
    </div>
  );
};
