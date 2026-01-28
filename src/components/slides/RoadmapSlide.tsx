import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Sparkles, ChevronRight, AlertCircle } from "lucide-react";

export const RoadmapSlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, annualReport } = data;
  const companyName = basics.accountName || "the customer";

  // Extract dynamic data from annual report and strategy
  const visionStatement = annualReport.visionStatement || basics.visionStatement || "";
  const purposeStatement = annualReport.purposeStatement || "";
  
  // Long-term aims from annual report or derive from strategy
  const longTermAims = annualReport.longTermAims?.length > 0 
    ? annualReport.longTermAims 
    : strategy.ceoBoardPriorities?.slice(0, 6).map(p => p.title + (p.description ? `: ${p.description}` : "")) || [];

  // Strategic pillars for "Tasks" row - derive from corporate strategy or transformation themes
  const strategicPillars = strategy.corporateStrategy?.length > 0 
    ? strategy.corporateStrategy.slice(0, 4).map((s, idx) => ({
        id: idx + 1,
        title: s.title,
        description: s.description,
        color: idx === 0 ? "from-cyan-400 to-cyan-500" : 
               idx === 1 ? "from-teal-400 to-teal-500" : 
               idx === 2 ? "from-emerald-400 to-emerald-500" : "from-green-400 to-green-500"
      }))
    : [];

  // Objectives - derive from digital strategies and transformation themes
  const objectives = strategy.digitalStrategies?.length > 0 || strategy.transformationThemes?.length > 0
    ? [...(strategy.digitalStrategies || []), ...(strategy.transformationThemes || [])]
        .slice(0, 4)
        .map((item, idx) => ({
          id: idx + 1,
          title: item.title,
          bullets: [item.description],
          color: idx === 0 ? "from-cyan-400 to-cyan-500" : 
                 idx === 1 ? "from-teal-400 to-teal-500" : 
                 idx === 2 ? "from-emerald-400 to-emerald-500" : "from-green-400 to-green-500"
        }))
    : [];

  // Medium-term ambitions from annual report or generate from strategy
  const mediumTermAmbitions = annualReport.mediumTermAmbitions?.length > 0
    ? annualReport.mediumTermAmbitions.slice(0, 3)
    : strategy.ceoBoardPriorities?.slice(0, 3).map(p => ({
        title: p.title,
        bullets: p.description ? [p.description] : []
      })) || [];

  // Check if we have enough data to show the slide
  const hasData = visionStatement || purposeStatement || longTermAims.length > 0 || strategicPillars.length > 0;

  if (!hasData) {
    return (
      <div className="min-h-screen p-4 md:p-6 pb-32 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900/30 flex items-center justify-center">
        <div className="glass-card p-12 text-center max-w-lg">
          <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Strategy Data</h3>
          <p className="text-sm text-muted-foreground">
            Upload an annual report or complete the Strategy section in the Input Form to populate this slide with the customer's vision, purpose, and strategic aims.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 pb-32 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900/30">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-slate-400 mb-1">ServiceNow Internal Confidential</p>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent italic">
                {companyName}
              </span>
              <span className="text-emerald-400 ml-2">Strategy</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <RegenerateSectionButton section="roadmapPhases" />
            <span className="pill-badge bg-accent/20 text-accent border-accent/30 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-3 h-3" />
              Extracted from Report
            </span>
          </div>
        </div>

        {/* Vision banner */}
        {visionStatement && (
          <div className="bg-slate-700/40 rounded-lg py-2 px-4 mb-3 text-center">
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              {visionStatement}
            </span>
          </div>
        )}

        {/* Purpose */}
        {purposeStatement && (
          <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg py-2 px-4 mb-3 text-center">
            <span className="text-slate-300 text-sm">
              <span className="font-semibold text-white">Our purpose: </span>{purposeStatement}
            </span>
          </div>
        )}

        {/* Main Grid Structure */}
        <div className="space-y-3">
          
          {/* Row: Long-term aims */}
          {longTermAims.length > 0 && (
            <div className="grid grid-cols-12 gap-3">
              {/* Label */}
              <div className="col-span-2 bg-slate-300 rounded-lg p-3 flex flex-col justify-center">
                <div className="text-slate-800 font-bold text-sm">Long-term Strategic Aims</div>
                <div className="text-slate-600 text-sm">Our ambition is...</div>
                <ChevronRight className="w-5 h-5 text-slate-500 mt-1 self-end" />
              </div>
              {/* Aims grid */}
              <div className="col-span-10 grid grid-cols-3 gap-2">
                {longTermAims.slice(0, 6).map((aim, i) => (
                  <div key={i} className="bg-cyan-700/60 border border-cyan-600/40 rounded-lg p-3 text-center">
                    <p className="text-white text-xs font-medium leading-snug">{aim}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Row: Strategic Pillars / Tasks */}
          {strategicPillars.length > 0 && (
            <div className="grid grid-cols-12 gap-3">
              {/* Label */}
              <div className="col-span-2 bg-amber-200 rounded-lg p-3 flex flex-col justify-center">
                <div className="text-slate-800 font-bold text-sm">Strategic Pillars</div>
                <div className="text-slate-600 text-sm">We must...</div>
                <ChevronRight className="w-5 h-5 text-slate-500 mt-1 self-end" />
              </div>
              {/* Pillars */}
              <div className={`col-span-10 grid grid-cols-${Math.min(strategicPillars.length, 4)} gap-2`}>
                {strategicPillars.map((pillar) => (
                  <div key={pillar.id} className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3">
                    <h4 className={`text-sm font-bold bg-gradient-to-r ${pillar.color} bg-clip-text text-transparent text-center mb-2`}>
                      {pillar.title}
                    </h4>
                    {pillar.description && (
                      <p className="text-[10px] text-slate-400 text-center line-clamp-2">{pillar.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Row: Objectives / Digital Strategies */}
          {objectives.length > 0 && (
            <div className="grid grid-cols-12 gap-3">
              {/* Label */}
              <div className="col-span-2 bg-amber-200 rounded-lg p-3 flex flex-col justify-center">
                <div className="text-slate-800 font-bold text-sm">Transformation Focus</div>
                <div className="text-slate-600 text-sm">We will...</div>
                <ChevronRight className="w-5 h-5 text-slate-500 mt-1 self-end" />
              </div>
              {/* Objectives */}
              <div className={`col-span-10 grid grid-cols-${Math.min(objectives.length, 4)} gap-2`}>
                {objectives.map((obj) => (
                  <div key={obj.id} className="bg-slate-800/80 border border-slate-600/50 rounded-lg p-3">
                    <h4 className={`text-xs font-bold bg-gradient-to-r ${obj.color} bg-clip-text text-transparent mb-2`}>
                      {obj.title}
                    </h4>
                    <ul className="space-y-1">
                      {obj.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${obj.color} mt-1.5 flex-shrink-0`} />
                          <span className="text-[11px] text-slate-300 leading-snug">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Row: Medium-term ambitions */}
          {mediumTermAmbitions.length > 0 && (
            <div className="grid grid-cols-12 gap-3">
              {/* Label */}
              <div className="col-span-2 bg-cyan-700 rounded-lg p-3 flex flex-col justify-center">
                <div className="text-white font-bold text-sm">Medium-term Ambitions</div>
                <ChevronRight className="w-5 h-5 text-cyan-300 mt-1 self-end" />
              </div>
              {/* Ambitions */}
              <div className={`col-span-10 grid grid-cols-${Math.min(mediumTermAmbitions.length, 3)} gap-2`}>
                {mediumTermAmbitions.map((ambition, i) => (
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
                      <p className="text-slate-500 text-xs">Details to be added</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer banner */}
        <div className="mt-4 bg-cyan-700/50 rounded-lg py-3 px-6 text-center">
          <span className="text-white text-sm font-medium">
            {companyName} strategic direction extracted from annual report and corporate communications
          </span>
        </div>
      </div>
    </div>
  );
};