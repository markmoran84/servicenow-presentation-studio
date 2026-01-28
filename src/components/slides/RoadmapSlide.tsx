import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Sparkles, ChevronRight, Target, Rocket, Zap, Globe, TrendingUp, Shield } from "lucide-react";

const pillarIcons = [Target, Rocket, Zap, Globe, TrendingUp, Shield];

export const RoadmapSlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, generatedPlan } = data;
  const companyName = basics.accountName || "the customer";

  // Pull from context - corporate strategy becomes strategic pillars
  const corporateStrategy = (strategy.corporateStrategy ?? []).filter(
    (s) => (s.title || "").trim().length > 0
  );
  
  // CEO/Board priorities become tasks
  const ceoPriorities = (strategy.ceoBoardPriorities ?? []).filter(
    (s) => (s.title || "").trim().length > 0
  );
  
  // Digital strategies become transformation themes
  const digitalStrategies = (strategy.digitalStrategies ?? []).filter(
    (s) => (s.title || "").trim().length > 0
  );
  
  // Transformation themes
  const transformationThemes = (strategy.transformationThemes ?? []).filter(
    (s) => (s.title || "").trim().length > 0
  );

  // AI-generated synthesis for additional context
  const synthesis = generatedPlan?.customerStrategySynthesis;
  const isAIGenerated = !!synthesis?.narrative || corporateStrategy.length > 0;

  // Build strategic pillars from corporate strategy
  const strategicPillars = corporateStrategy.slice(0, 4).map((item, index) => ({
    id: index + 1,
    title: item.title,
    description: item.description || "",
    color: [
      "from-cyan-400 to-cyan-500",
      "from-teal-400 to-teal-500", 
      "from-emerald-400 to-emerald-500",
      "from-green-400 to-green-500"
    ][index % 4],
    Icon: pillarIcons[index % pillarIcons.length]
  }));

  // Build long-term aims from CEO priorities + digital strategies
  const longTermAims = [
    ...ceoPriorities.slice(0, 3).map(p => p.title + (p.description ? ` (${p.description.slice(0, 60)}...)` : "")),
    ...digitalStrategies.slice(0, 3).map(d => d.title + (d.description ? ` (${d.description.slice(0, 60)}...)` : ""))
  ].slice(0, 6);

  // Build medium-term ambitions from transformation themes
  const mediumTermAmbitions = transformationThemes.slice(0, 3).map(theme => ({
    title: theme.title,
    bullets: theme.description ? [theme.description] : []
  }));

  // Fallback content if no data
  const hasData = strategicPillars.length > 0 || longTermAims.length > 0;

  // Default pillars if no data extracted yet
  const defaultPillars = [
    { id: 1, title: "Customer & Commercial Excellence", description: "Strengthen customer focus and drive profitable growth", color: "from-cyan-400 to-cyan-500", Icon: Target },
    { id: 2, title: "Operational Excellence", description: "Drive operational efficiency across the organization", color: "from-teal-400 to-teal-500", Icon: Rocket },
    { id: 3, title: "Technology & Transformation", description: "Accelerate digital transformation initiatives", color: "from-emerald-400 to-emerald-500", Icon: Zap },
    { id: 4, title: "AI & Data Intelligence", description: "Scale AI and data to power intelligent operations", color: "from-green-400 to-green-500", Icon: Globe }
  ];

  const displayPillars = strategicPillars.length > 0 ? strategicPillars : defaultPillars;

  // Default aims if no data
  const defaultAims = [
    "Establish leadership position in core markets",
    "Build resilient and efficient operations",
    "Grow profitably with strong cost discipline",
    "Deliver exceptional customer experiences",
    "Digitise operations with data, automation and AI",
    "Achieve sustainability and ESG commitments"
  ];

  const displayAims = longTermAims.length > 0 ? longTermAims : defaultAims;

  // Default ambitions if no data
  const defaultAmbitions = [
    { title: "Improve Efficiency", bullets: ["Sustained productivity improvements", "Lower manual effort and rework"] },
    { title: "Strengthen Cash Flow", bullets: ["Margin improvement through automation", "Scale without proportional cost"] },
    { title: "Accelerate Growth", bullets: ["Expand market presence", "Drive new revenue streams"] }
  ];

  const displayAmbitions = mediumTermAmbitions.length > 0 ? mediumTermAmbitions : defaultAmbitions;

  // Extract company tagline/purpose from synthesis or use generic
  const companyPurpose = synthesis?.narrative 
    ? synthesis.narrative.split('.')[0] + "."
    : `${companyName}'s strategic vision and transformation priorities`;

  return (
    <div className="min-h-screen p-4 md:p-6 pb-32 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900/30">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-slate-400 mb-1">{companyName}</p>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Customer Strategy
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <RegenerateSectionButton section="customerStrategySynthesis" />
            {isAIGenerated && (
              <span className="pill-badge bg-accent/20 text-accent border-accent/30 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
          </div>
        </div>

        {/* Vision/Purpose Banner */}
        <div className="bg-slate-700/40 rounded-lg py-3 px-4 mb-3">
          <p className="text-sm md:text-base text-center text-slate-200 leading-relaxed">
            {companyPurpose}
          </p>
        </div>

        {/* Main Grid Structure */}
        <div className="space-y-3">
          
          {/* Row: Long-term Strategic Aims */}
          <div className="grid grid-cols-12 gap-3">
            {/* Label */}
            <div className="col-span-2 bg-slate-300 rounded-lg p-3 flex flex-col justify-center">
              <div className="text-slate-800 font-bold text-sm">Strategic Aims</div>
              <div className="text-slate-600 text-sm">Long-term vision</div>
              <ChevronRight className="w-5 h-5 text-slate-500 mt-1 self-end" />
            </div>
            {/* 6 aims in 2 rows of 3 */}
            <div className="col-span-10 grid grid-cols-3 gap-2">
              {displayAims.slice(0, 3).map((aim, i) => (
                <div key={i} className="bg-cyan-700/60 border border-cyan-600/40 rounded-lg p-3 text-center">
                  <p className="text-white text-xs font-medium leading-snug">{aim}</p>
                </div>
              ))}
              {displayAims.slice(3, 6).map((aim, i) => (
                <div key={i + 3} className="bg-cyan-700/60 border border-cyan-600/40 rounded-lg p-3 text-center">
                  <p className="text-white text-xs font-medium leading-snug">{aim}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Row: Strategic Pillars */}
          <div className="grid grid-cols-12 gap-3">
            {/* Label */}
            <div className="col-span-2 bg-amber-200 rounded-lg p-3 flex flex-col justify-center">
              <div className="text-slate-800 font-bold text-sm">Strategic Pillars</div>
              <div className="text-slate-600 text-sm">Key focus areas</div>
              <ChevronRight className="w-5 h-5 text-slate-500 mt-1 self-end" />
            </div>
            {/* 4 pillars */}
            <div className="col-span-10 grid grid-cols-4 gap-2">
              {displayPillars.map((pillar) => {
                const Icon = pillar.Icon;
                return (
                  <div key={pillar.id} className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 rounded-md bg-gradient-to-r ${pillar.color} flex items-center justify-center`}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <h4 className={`text-sm font-bold bg-gradient-to-r ${pillar.color} bg-clip-text text-transparent`}>
                        {pillar.title}
                      </h4>
                    </div>
                    {pillar.description && (
                      <p className="text-[10px] text-slate-400 leading-snug">{pillar.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row: Transformation Priorities */}
          <div className="grid grid-cols-12 gap-3">
            {/* Label */}
            <div className="col-span-2 bg-amber-200 rounded-lg p-3 flex flex-col justify-center">
              <div className="text-slate-800 font-bold text-sm">Transformation Priorities</div>
              <div className="text-slate-600 text-sm">How they'll achieve it</div>
              <ChevronRight className="w-5 h-5 text-slate-500 mt-1 self-end" />
            </div>
            {/* 4 objective columns */}
            <div className="col-span-10 grid grid-cols-4 gap-2">
              {displayPillars.map((pillar) => (
                <div key={pillar.id} className="bg-slate-800/80 border border-slate-600/50 rounded-lg p-3">
                  <ul className="space-y-2">
                    {pillar.description ? (
                      <li className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${pillar.color} mt-1.5 flex-shrink-0`} />
                        <span className="text-[11px] text-slate-300 leading-snug">{pillar.description}</span>
                      </li>
                    ) : (
                      <li className="text-[11px] text-slate-500 italic">Details to be extracted from report</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Row: Medium-term Ambitions */}
          <div className="grid grid-cols-12 gap-3">
            {/* Label */}
            <div className="col-span-2 bg-cyan-700 rounded-lg p-3 flex flex-col justify-center">
              <div className="text-white font-bold text-sm">Medium-Term Outcomes</div>
              <ChevronRight className="w-5 h-5 text-cyan-300 mt-1 self-end" />
            </div>
            {/* 3 ambition columns */}
            <div className="col-span-10 grid grid-cols-3 gap-2">
              {displayAmbitions.map((ambition, i) => (
                <div key={i} className="bg-slate-800/80 border border-slate-600/50 rounded-lg p-4">
                  <h4 className="text-cyan-400 font-bold text-sm mb-2">{ambition.title}</h4>
                  {ambition.bullets.length > 0 ? (
                    <ul className="space-y-1.5">
                      {ambition.bullets.map((bullet, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                          <span className="text-[10px] text-slate-400 leading-snug">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 text-xs italic">To be extracted</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ServiceNow Alignment Row - only show if AI synthesis available */}
          {synthesis?.serviceNowAlignment && synthesis.serviceNowAlignment.length > 0 && (
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-2 bg-emerald-600 rounded-lg p-3 flex flex-col justify-center">
                <div className="text-white font-bold text-sm">ServiceNow Alignment</div>
                <ChevronRight className="w-5 h-5 text-emerald-200 mt-1 self-end" />
              </div>
              <div className="col-span-10 grid grid-cols-3 gap-2">
                {synthesis.serviceNowAlignment.slice(0, 3).map((alignment, i) => (
                  <div key={i} className="bg-emerald-900/40 border border-emerald-600/30 rounded-lg p-3">
                    <p className="text-emerald-300 text-xs font-medium mb-1">{alignment.customerPriority}</p>
                    <p className="text-white text-xs">{alignment.serviceNowValue}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 bg-cyan-700/50 rounded-lg py-3 px-6 text-center">
          <span className="text-white text-sm font-medium">
            {companyName} strategic direction and transformation priorities
          </span>
        </div>
      </div>
    </div>
  );
};
