import { SectionHeader } from "@/components/SectionHeader";
import { DollarSign, TrendingUp, Target, BarChart3, Layers, ArrowUpRight } from "lucide-react";

const currentState = {
  acv: "$4.2M",
  products: ["ITSM", "ITOM (Limited)", "Virtual Agent"],
  relationship: "Marquee Account",
  healthScore: 72,
};

const expansionTargets = [
  {
    workflow: "Customer Service Management",
    currentState: "Greenfield",
    targetACV: "$2.5M",
    probability: 75,
    timeline: "Q1-Q2 FY26",
    notes: "Primary commercial wedge. Service Cloud takeout.",
  },
  {
    workflow: "AI & Workflow Automation",
    currentState: "Pilot",
    targetACV: "$1.5M",
    probability: 60,
    timeline: "H1-H2 FY26",
    notes: "Predictive routing, document AI, process automation.",
  },
  {
    workflow: "Security Operations",
    currentState: "Discovery",
    targetACV: "$750K",
    probability: 50,
    timeline: "H2 FY26",
    notes: "SecOps expansion from ITSM foundation.",
  },
  {
    workflow: "HR Service Delivery",
    currentState: "Vision",
    targetACV: "$1.2M",
    probability: 35,
    timeline: "FY27",
    notes: "Employee experience, onboarding workflows.",
  },
];

const getStateColor = (state: string) => {
  switch (state) {
    case "Greenfield": return "bg-accent/20 text-accent";
    case "Pilot": return "bg-primary/20 text-primary";
    case "Discovery": return "bg-warning/20 text-warning";
    case "Vision": return "bg-muted text-muted-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

export const FinancialOpportunitySlide = () => {
  const totalTarget = expansionTargets.reduce((sum, t) => {
    const val = parseFloat(t.targetACV.replace(/[$MK]/g, ''));
    return sum + (t.targetACV.includes('K') ? val / 1000 : val);
  }, 0);

  return (
    <div className="px-8 pt-6 pb-32">
      <div className="flex items-center gap-3 mb-6 opacity-0 animate-fade-in">
        <DollarSign className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-bold text-foreground">Financial Opportunity</h1>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Current State */}
        <div className="glass-card p-6 opacity-0 animate-fade-in animation-delay-100">
          <SectionHeader
            title="Current Position"
            description="Existing ServiceNow footprint at Maersk"
            delay={100}
          />

          <div className="mt-6 space-y-4">
            {/* ACV */}
            <div className="p-4 rounded-xl bg-secondary/50">
              <div className="text-sm text-muted-foreground mb-1">Current ACV</div>
              <div className="metric-highlight text-4xl">{currentState.acv}</div>
            </div>

            {/* Products */}
            <div className="p-4 rounded-xl bg-secondary/50">
              <div className="text-sm text-muted-foreground mb-2">Active Products</div>
              <div className="flex flex-wrap gap-2">
                {currentState.products.map((product) => (
                  <span key={product} className="pill-badge">{product}</span>
                ))}
              </div>
            </div>

            {/* Relationship */}
            <div className="p-4 rounded-xl bg-secondary/50">
              <div className="text-sm text-muted-foreground mb-1">Account Status</div>
              <div className="text-lg font-semibold text-foreground">{currentState.relationship}</div>
            </div>

            {/* Health Score */}
            <div className="p-4 rounded-xl bg-secondary/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Health Score</span>
                <span className="text-lg font-bold text-primary">{currentState.healthScore}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${currentState.healthScore}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Expansion Targets */}
        <div className="col-span-2">
          <div className="glass-card p-6 opacity-0 animate-fade-in animation-delay-200">
            <SectionHeader
              title="Expansion Roadmap"
              description="Workflow expansion targets aligned to Maersk strategic priorities"
              delay={150}
            />

            <div className="mt-5 space-y-3">
              {expansionTargets.map((target, index) => (
                <div
                  key={target.workflow}
                  className="p-4 rounded-xl bg-secondary/30 border border-border/30 opacity-0 animate-fade-in hover:border-primary/30 transition-all"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    {/* Workflow Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <Layers className="w-4 h-4 text-primary" />
                        <h4 className="font-semibold text-foreground">{target.workflow}</h4>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${getStateColor(target.currentState)}`}>
                          {target.currentState}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{target.notes}</p>
                    </div>

                    {/* Target ACV */}
                    <div className="text-center px-4">
                      <div className="text-2xl font-bold text-gradient">{target.targetACV}</div>
                      <div className="text-[10px] text-muted-foreground">Target ACV</div>
                    </div>

                    {/* Probability */}
                    <div className="w-20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Prob.</span>
                        <span className="text-sm font-semibold text-accent">{target.probability}%</span>
                      </div>
                      <div className="progress-track h-1.5">
                        <div className="progress-fill h-1.5" style={{ width: `${target.probability}%` }} />
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">{target.timeline}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-5 grid grid-cols-3 gap-4">
              <div className="stat-card opacity-0 animate-fade-in animation-delay-700">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Target ACV (FY27)</span>
                </div>
                <div className="metric-highlight text-3xl">${(parseFloat(currentState.acv.replace(/[$M]/g, '')) + totalTarget).toFixed(1)}M</div>
                <div className="text-xs text-muted-foreground mt-1">Current + Expansion</div>
              </div>

              <div className="stat-card opacity-0 animate-fade-in animation-delay-800">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <span className="text-sm text-muted-foreground">Growth Potential</span>
                </div>
                <div className="metric-highlight-accent text-3xl">+{Math.round((totalTarget / parseFloat(currentState.acv.replace(/[$M]/g, ''))) * 100)}%</div>
                <div className="text-xs text-muted-foreground mt-1">ACV Uplift</div>
              </div>

              <div className="stat-card opacity-0 animate-fade-in animation-delay-800">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Priority Focus</span>
                </div>
                <div className="text-xl font-bold text-foreground">CRM + AI</div>
                <div className="text-xs text-muted-foreground mt-1">Highest impact initiatives</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
