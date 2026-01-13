import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Sparkles, Info, ArrowRight } from "lucide-react";

export const RoadmapSlide = () => {
  const { data } = useAccountData();
  const plan = data.generatedPlan;
  const companyName = data.basics.accountName || "the customer";

  // Get big bets as initiatives/strategy items
  const bigBets = data.accountStrategy?.bigBets?.filter(b => b.title) || [];
  const hasData = bigBets.length > 0 || (plan?.executiveSummaryPillars?.length ?? 0) > 0;
  
  // Roadmap phases from AI generation
  const phases = plan?.roadmapPhases?.slice(0, 3) || [];
  const hasPhases = phases.length > 0;

  // Purpose/Vision
  const purpose = data.accountStrategy.visionStatement || 
    plan?.executiveSummaryNarrative?.substring(0, 200) ||
    `Enable ${companyName}'s digital transformation through strategic platform adoption`;

  // Strategic Objectives from priorities or generated plan
  const objectives = plan?.strategicPriorities?.slice(0, 4).map(p => p.title) ||
    data.strategy?.transformationThemes?.slice(0, 4).map(t => t.title) ||
    ["Digital Transformation", "Operational Excellence", "Customer Experience", "Innovation"];

  // Value Drivers from plan or defaults
  const valueDrivers = plan?.executiveSummaryPillars?.slice(0, 4).map(p => ({
    title: p.title,
    description: p.tagline || p.description?.substring(0, 60)
  })) || plan?.coreValueDrivers?.slice(0, 4).map(d => ({
    title: d.title,
    description: d.description?.substring(0, 60)
  })) || [
    { title: "Platform Consolidation", description: "Unified technology landscape" },
    { title: "Process Automation", description: "Streamlined workflows" },
    { title: "Data Intelligence", description: "Actionable insights" },
    { title: "Employee Experience", description: "Enhanced productivity" }
  ];

  // Strategy/Initiatives from Big Bets
  const initiatives = bigBets.slice(0, 6).map(b => ({
    title: b.title,
    phase: b.dealStatus === "Active Pursuit" ? "now" : 
           b.dealStatus === "Strategic Initiative" ? "next" : "later",
    value: b.netNewACV || ""
  }));

  // Fallback initiatives if no big bets
  const displayInitiatives = initiatives.length > 0 ? initiatives : [
    { title: "Platform Foundation", phase: "now", value: "" },
    { title: "ITSM Modernization", phase: "now", value: "" },
    { title: "HRSD Expansion", phase: "next", value: "" },
    { title: "CSM Implementation", phase: "next", value: "" },
    { title: "AI/ML Adoption", phase: "later", value: "" },
    { title: "Enterprise Scale", phase: "later", value: "" }
  ];

  // Measurable Impact from success metrics or defaults
  const impacts = plan?.successMetrics?.slice(0, 4) || [
    { metric: "TBD", label: "Cost Reduction", description: "" },
    { metric: "TBD", label: "Productivity Gain", description: "" },
    { metric: "TBD", label: "Customer Satisfaction", description: "" },
    { metric: "TBD", label: "Time to Value", description: "" }
  ];

  // Group initiatives by phase
  const nowItems = displayInitiatives.filter(i => i.phase === "now");
  const nextItems = displayInitiatives.filter(i => i.phase === "next");
  const laterItems = displayInitiatives.filter(i => i.phase === "later");

  return (
    <div className="h-full overflow-auto p-4 md:p-6 pb-32 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Strategic Roadmap</h1>
            <p className="text-sm text-muted-foreground">{companyName} • Transformation Journey</p>
          </div>
          <div className="flex items-center gap-2">
            <RegenerateSectionButton section="roadmapPhases" />
            {hasPhases && (
              <span className="pill-badge bg-accent/20 text-accent border-accent/30 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
          </div>
        </div>

        {/* 5-Column Layout */}
        <div className="grid grid-cols-12 gap-3 h-[calc(100vh-180px)]">
          {/* Column 1: Purpose */}
          <div className="col-span-2 flex flex-col">
            <div className="bg-primary text-primary-foreground rounded-t-lg py-2 px-3 text-center">
              <span className="text-sm font-bold uppercase tracking-wider">Purpose</span>
            </div>
            <div className="flex-1 bg-primary/10 border border-primary/20 rounded-b-lg p-4 flex items-center">
              <p className="text-sm text-foreground leading-relaxed text-center">
                {purpose}
              </p>
            </div>
          </div>

          {/* Column 2: Objectives */}
          <div className="col-span-2 flex flex-col">
            <div className="bg-primary text-primary-foreground rounded-t-lg py-2 px-3 text-center">
              <span className="text-sm font-bold uppercase tracking-wider">Objectives</span>
            </div>
            <div className="flex-1 bg-primary/10 border border-primary/20 rounded-b-lg p-3 flex flex-col justify-center gap-2">
              {objectives.map((obj, i) => (
                <div 
                  key={i} 
                  className="bg-background/80 rounded-md p-2.5 border border-border/50 text-center opacity-0 animate-fade-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span className="text-sm font-medium text-foreground">{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Value Drivers */}
          <div className="col-span-2 flex flex-col">
            <div className="bg-primary text-primary-foreground rounded-t-lg py-2 px-3 text-center">
              <span className="text-sm font-bold uppercase tracking-wider">Value Drivers</span>
            </div>
            <div className="flex-1 bg-primary/10 border border-primary/20 rounded-b-lg p-3 flex flex-col justify-center gap-2">
              {valueDrivers.map((driver, i) => (
                <div 
                  key={i} 
                  className="bg-background/80 rounded-md p-2.5 border border-border/50 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${(i + 4) * 80}ms` }}
                >
                  <div className="text-sm font-semibold text-foreground text-center">{driver.title}</div>
                  {driver.description && (
                    <div className="text-[10px] text-muted-foreground text-center mt-0.5 line-clamp-1">{driver.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Strategy / Initiatives (Timeline) */}
          <div className="col-span-4 flex flex-col">
            <div className="bg-primary text-primary-foreground rounded-t-lg py-2 px-3 text-center">
              <span className="text-sm font-bold uppercase tracking-wider">Strategy / Initiatives</span>
            </div>
            <div className="flex-1 bg-primary/10 border border-primary/20 rounded-b-lg p-3">
              {/* Timeline Header */}
              <div className="flex items-center mb-3">
                <div className="flex-1 flex items-center justify-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                  <span className="text-xs font-bold text-accent uppercase">Now</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/50 mx-1" />
                <div className="flex-1 flex items-center justify-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-xs font-bold text-primary uppercase">Next</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/50 mx-1" />
                <div className="flex-1 flex items-center justify-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/60" />
                  <span className="text-xs font-bold text-muted-foreground uppercase">Later</span>
                </div>
              </div>

              {/* Timeline Grid */}
              <div className="grid grid-cols-3 gap-2 flex-1">
                {/* Now Column */}
                <div className="space-y-2">
                  {(nowItems.length > 0 ? nowItems : displayInitiatives.slice(0, 2)).map((item, i) => (
                    <div 
                      key={i} 
                      className="bg-accent/20 border border-accent/40 rounded-md p-2.5 opacity-0 animate-fade-in"
                      style={{ animationDelay: `${(i + 8) * 80}ms` }}
                    >
                      <div className="text-xs font-semibold text-accent line-clamp-2">{item.title}</div>
                      {item.value && (
                        <div className="text-[10px] text-accent/70 mt-1">{item.value}</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Next Column */}
                <div className="space-y-2">
                  {(nextItems.length > 0 ? nextItems : displayInitiatives.slice(2, 4)).map((item, i) => (
                    <div 
                      key={i} 
                      className="bg-primary/20 border border-primary/40 rounded-md p-2.5 opacity-0 animate-fade-in"
                      style={{ animationDelay: `${(i + 10) * 80}ms` }}
                    >
                      <div className="text-xs font-semibold text-primary line-clamp-2">{item.title}</div>
                      {item.value && (
                        <div className="text-[10px] text-primary/70 mt-1">{item.value}</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Later Column */}
                <div className="space-y-2">
                  {(laterItems.length > 0 ? laterItems : displayInitiatives.slice(4, 6)).map((item, i) => (
                    <div 
                      key={i} 
                      className="bg-muted/50 border border-muted-foreground/30 rounded-md p-2.5 opacity-0 animate-fade-in"
                      style={{ animationDelay: `${(i + 12) * 80}ms` }}
                    >
                      <div className="text-xs font-semibold text-muted-foreground line-clamp-2">{item.title}</div>
                      {item.value && (
                        <div className="text-[10px] text-muted-foreground/70 mt-1">{item.value}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow connector at bottom */}
              <div className="flex items-center justify-center mt-3 pt-2 border-t border-border/30">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-[10px] uppercase tracking-wider">Continuous Improvement</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Column 5: Measurable Impact */}
          <div className="col-span-2 flex flex-col">
            <div className="bg-primary text-primary-foreground rounded-t-lg py-2 px-3 text-center">
              <span className="text-sm font-bold uppercase tracking-wider">Measurable Impact</span>
            </div>
            <div className="flex-1 bg-primary/10 border border-primary/20 rounded-b-lg p-3 flex flex-col justify-center gap-2">
              {impacts.map((impact, i) => (
                <div 
                  key={i} 
                  className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-md p-3 border border-accent/30 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${(i + 14) * 80}ms` }}
                >
                  <div className="text-lg font-bold text-accent text-center">{impact.metric}</div>
                  <div className="text-[10px] text-muted-foreground text-center mt-0.5">{impact.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* No Data State */}
        {!hasData && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-center p-8">
              <Info className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Add Data to Populate Roadmap</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Add strategic priorities and Big Bets in the Input Form to see your customized roadmap.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
