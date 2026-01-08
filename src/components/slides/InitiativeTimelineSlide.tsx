import { Calendar } from "lucide-react";

const quarters = ["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"];

const workstreams = [
  {
    name: "CRM / SFDC Takeout",
    color: "bg-primary",
    milestones: [
      { quarter: 0, title: "Discovery & Scoping", description: "Requirements gathering, stakeholder alignment" },
      { quarter: 1, title: "Technical POC", description: "ServiceCloud proof of concept" },
      { quarter: 1, title: "Business Case", description: "ROI validation & exec approval" },
      { quarter: 2, title: "Phase 1 Build", description: "Core CSM module implementation" },
      { quarter: 3, title: "Go-Live Phase 1", description: "Pilot deployment & adoption" },
    ]
  },
  {
    name: "AI Use Cases",
    color: "bg-accent",
    milestones: [
      { quarter: 0, title: "Use Case Mapping", description: "GenAI opportunity assessment" },
      { quarter: 1, title: "EBC Deep-Dive", description: "AI demo & capability showcase" },
      { quarter: 2, title: "Pilot Selection", description: "Priority use case selection" },
      { quarter: 2, title: "AI POC", description: "Virtual agent & predictive intelligence" },
      { quarter: 3, title: "Scale Planning", description: "Enterprise rollout strategy" },
    ]
  },
  {
    name: "IT & Security",
    color: "bg-emerald-500",
    milestones: [
      { quarter: 0, title: "SecOps Assessment", description: "Current state analysis" },
      { quarter: 1, title: "ITSM Expansion", description: "Additional module planning" },
      { quarter: 2, title: "Security Integration", description: "SIEM/SOAR evaluation" },
      { quarter: 3, title: "IRM Phase", description: "Integrated risk management" },
      { quarter: 3, title: "Full SecOps", description: "Security operations center" },
    ]
  },
  {
    name: "Platform & Governance",
    color: "bg-violet-500",
    milestones: [
      { quarter: 0, title: "EBC Planning", description: "March Santa Clara prep" },
      { quarter: 1, title: "Executive Signoff", description: "FY26 commitment secured" },
      { quarter: 2, title: "Delivery Activation", description: "Implementation kickoff" },
      { quarter: 3, title: "Scaled Adoption", description: "Enterprise expansion" },
    ]
  }
];

export const InitiativeTimelineSlide = () => {
  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              FY26 Initiative Roadmap
            </h1>
            <p className="text-muted-foreground">Strategic timeline across workstreams</p>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="glass-card p-6 overflow-x-auto">
          {/* Quarter Headers */}
          <div className="grid grid-cols-[180px_repeat(4,1fr)] gap-2 mb-4 min-w-[900px]">
            <div className="text-sm font-semibold text-muted-foreground"></div>
            {quarters.map((quarter, index) => (
              <div 
                key={quarter} 
                className="text-center text-sm font-semibold text-primary border-b-2 border-primary/30 pb-2"
              >
                {quarter}
              </div>
            ))}
          </div>

          {/* Workstream Rows */}
          {workstreams.map((workstream, wsIndex) => (
            <div 
              key={workstream.name}
              className="grid grid-cols-[180px_repeat(4,1fr)] gap-2 min-w-[900px] mb-6 opacity-0 animate-fade-in"
              style={{ animationDelay: `${wsIndex * 100}ms` }}
            >
              {/* Workstream Label */}
              <div className="flex items-start">
                <div className={`${workstream.color} text-white text-xs font-medium px-3 py-2 rounded-lg writing-vertical`}>
                  {workstream.name}
                </div>
              </div>

              {/* Quarter Columns */}
              {quarters.map((_, qIndex) => {
                const milestonesInQuarter = workstream.milestones.filter(m => m.quarter === qIndex);
                return (
                  <div key={qIndex} className="relative min-h-[100px] border-l border-border/30 pl-3">
                    {/* Connecting line */}
                    <div className="absolute top-0 bottom-0 left-0 w-px bg-border/20" />
                    
                    {/* Milestones */}
                    <div className="space-y-3">
                      {milestonesInQuarter.map((milestone, mIndex) => (
                        <div 
                          key={mIndex}
                          className="glass-card p-3 border-l-2 hover:bg-primary/5 transition-colors"
                          style={{ borderLeftColor: workstream.color.replace('bg-', 'var(--') === workstream.color ? undefined : undefined }}
                        >
                          <div className="flex items-start gap-2">
                            <div className={`w-2 h-2 rounded-full ${workstream.color} mt-1.5 flex-shrink-0`} />
                            <div>
                              <p className="text-sm font-medium text-foreground">{milestone.title}</p>
                              <p className="text-xs text-muted-foreground">{milestone.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-border/30">
            {workstreams.map((ws) => (
              <div key={ws.name} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${ws.color}`} />
                <span className="text-xs text-muted-foreground">{ws.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Milestones Callout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="glass-card p-4 border-l-4 border-l-primary">
            <p className="text-sm font-semibold text-primary">Q1 Anchor</p>
            <p className="text-lg font-bold text-foreground">March EBC</p>
            <p className="text-xs text-muted-foreground">Decision forum, Santa Clara</p>
          </div>
          <div className="glass-card p-4 border-l-4 border-l-accent">
            <p className="text-sm font-semibold text-accent">H1 Target</p>
            <p className="text-lg font-bold text-foreground">CRM POC Complete</p>
            <p className="text-xs text-muted-foreground">Technical validation</p>
          </div>
          <div className="glass-card p-4 border-l-4 border-l-emerald-500">
            <p className="text-sm font-semibold text-emerald-400">H2 Goal</p>
            <p className="text-lg font-bold text-foreground">Phase 1 Live</p>
            <p className="text-xs text-muted-foreground">Production deployment</p>
          </div>
        </div>
      </div>
    </div>
  );
};
