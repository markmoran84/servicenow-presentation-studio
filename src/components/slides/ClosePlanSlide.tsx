import { Target, MessageSquare, Search, FileCheck, Settings, Package, CheckCircle, Clock, AlertCircle } from "lucide-react";

const closePlanStages = [
  {
    stage: "Discovery Discussions",
    icon: MessageSquare,
    actions: ["Align goals & priorities", "Business value discovery", "High level intro demo"],
    owner: "Account Team",
    dueDate: "Jan 2026",
    status: "complete"
  },
  {
    stage: "Solution Deep-Dive",
    icon: Search,
    actions: ["Demos & workshop", "Technical validation", "Architecture review"],
    owner: "Solutions Team",
    dueDate: "Feb 2026",
    status: "complete"
  },
  {
    stage: "Executive Briefing Center",
    icon: Target,
    actions: ["Santa Clara EBC", "Decision forum alignment", "FY26 priority validation"],
    owner: "Executive Sponsors",
    dueDate: "Mar 2026",
    status: "ongoing"
  },
  {
    stage: "Executive Signoff",
    icon: FileCheck,
    actions: ["IT & paper process", "Commercial negotiation", "Sponsorship commitment"],
    owner: "CIO / CFO",
    dueDate: "Apr 2026",
    status: "incomplete"
  },
  {
    stage: "Commercialisation",
    icon: Settings,
    actions: ["Contract finalisation", "SOW development", "Procurement alignment"],
    owner: "Legal / Procurement",
    dueDate: "May 2026",
    status: "incomplete"
  },
  {
    stage: "Delivery Activation",
    icon: Package,
    actions: ["Kick-off call", "Implementation planning", "Scaled adoption"],
    owner: "Delivery Team",
    dueDate: "Jun 2026",
    status: "incomplete"
  }
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "complete":
      return { 
        icon: CheckCircle, 
        label: "Complete", 
        bgColor: "bg-emerald-500/20", 
        textColor: "text-emerald-400",
        dotColor: "bg-emerald-500"
      };
    case "ongoing":
      return { 
        icon: Clock, 
        label: "Ongoing", 
        bgColor: "bg-primary/20", 
        textColor: "text-primary",
        dotColor: "bg-primary"
      };
    default:
      return { 
        icon: AlertCircle, 
        label: "Incomplete", 
        bgColor: "bg-muted/30", 
        textColor: "text-muted-foreground",
        dotColor: "bg-muted-foreground"
      };
  }
};

export const ClosePlanSlide = () => {
  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Executive Close Plan
              </h1>
              <p className="text-muted-foreground text-lg">FY26 Strategic Engagement Timeline</p>
            </div>
          </div>
          
          {/* EBC Highlight */}
          <div className="glass-card p-4 border-l-4 border-l-primary mt-6">
            <p className="text-foreground/90">
              <span className="font-semibold text-primary">March Executive Briefing Center (Santa Clara)</span> serves as the anchor moment for FY26 — 
              positioned as a <span className="font-medium">decision forum</span>, not a showcase, to align executives, validate sequencing, and secure sponsorship.
            </p>
          </div>
        </div>

        {/* Close Plan Table */}
        <div className="glass-card overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-primary/10 border-b border-border/30">
            <div className="col-span-3">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Stage</span>
            </div>
            <div className="col-span-4">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Action Steps</span>
            </div>
            <div className="col-span-2">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Owner</span>
            </div>
            <div className="col-span-1">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Due</span>
            </div>
            <div className="col-span-2">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Status</span>
            </div>
          </div>

          {/* Table Rows */}
          {closePlanStages.map((stage, index) => {
            const StatusIcon = stage.icon;
            const statusConfig = getStatusConfig(stage.status);
            
            return (
              <div 
                key={stage.stage}
                className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-primary/5 ${
                  index !== closePlanStages.length - 1 ? "border-b border-border/20" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Stage */}
                <div className="col-span-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      stage.status === "ongoing" ? "bg-primary/20" : "bg-accent/10"
                    }`}>
                      <StatusIcon className={`w-5 h-5 ${
                        stage.status === "ongoing" ? "text-primary" : "text-accent"
                      }`} />
                    </div>
                    <span className={`font-medium ${
                      stage.status === "ongoing" ? "text-primary" : "text-foreground"
                    }`}>
                      {stage.stage}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-4">
                  <ul className="space-y-1">
                    {stage.actions.map((action, i) => (
                      <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                        <span className="text-primary/60 mt-1">○</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Owner */}
                <div className="col-span-2">
                  <span className="text-sm text-foreground/80">{stage.owner}</span>
                </div>

                {/* Due Date */}
                <div className="col-span-1">
                  <span className="text-sm text-foreground/80">{stage.dueDate}</span>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bgColor}`}>
                    <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`} />
                    <span className={`text-sm font-medium ${statusConfig.textColor}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Post-EBC Focus */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">Q2</div>
            <div className="text-sm text-muted-foreground">Commercialisation</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-accent">Q3</div>
            <div className="text-sm text-muted-foreground">Delivery Activation</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-foreground">Q4</div>
            <div className="text-sm text-muted-foreground">Scaled Adoption</div>
          </div>
        </div>
      </div>
    </div>
  );
};
