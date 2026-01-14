import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Sparkles, ChevronRight } from "lucide-react";

export const RoadmapSlide = () => {
  const { data } = useAccountData();
  const companyName = data.basics.accountName || "the customer";

  // Strategic pillars with objectives
  const strategicPillars = [
    {
      id: 1,
      title: "Strengthen customer focus and profitable growth",
      color: "from-cyan-400 to-cyan-500",
      objectives: [
        "Reduce cost-to-serve through workflow automation and digital self-service",
        "Release frontline capacity from manual case handling and rework",
        "Improve service consistency while absorbing volume growth without proportional increases in operational cost"
      ]
    },
    {
      id: 2,
      title: "Drive operational excellence across the network",
      color: "from-teal-400 to-teal-500",
      objectives: [
        "Reduce manual coordination and exception handling across Ocean, L&S, and Terminals",
        "Increase operational productivity and execution capacity through orchestration and automation",
        "Improve reliability and response without adding structural overhead"
      ]
    },
    {
      id: 3,
      title: "Accelerate technology & transformation",
      color: "from-emerald-400 to-emerald-500",
      objectives: [
        "Simplify platforms and workflows to reduce dependency on manual intervention",
        "Enable teams to scale execution through standardised, automated processes",
        "Improve change velocity without increasing run cost"
      ]
    },
    {
      id: 4,
      title: "Scale AI & data to power intelligent operations",
      color: "from-green-400 to-green-500",
      objectives: [
        "Embed AI to augment teams and improve decision productivity",
        "Reduce repetitive, low-value work through AI-assisted execution",
        "Enable capacity uplift across customer and operational teams without additional headcount"
      ]
    }
  ];

  // Long-term aims (6 cells in 2 rows)
  const longTermAims = [
    "Lead as the global integrator of logistics (Ocean, L&S, Terminals working as one).",
    "Build resilient, efficient networks (Gemini design; disciplined capacity)",
    "Grow profitably with strong cost discipline (ROIC >7.5%; Ocean EBIT >6%)",
    "Deliver reliable, connected customer experiences end-to-end",
    "Digitise operations and decisions with data, automation and AI",
    "Decarbonise at scale (green methanol fleet All the way to zero 2040)"
  ];

  // Medium-term ambitions
  const mediumTermAmbitions = [
    {
      title: "Better efficiencies",
      bullets: [
        "Sustained productivity improvements across customer and operational teams",
        "Lower manual effort and rework",
        "Increased execution capacity per team"
      ]
    },
    {
      title: "Improve free cash flow",
      bullets: [
        "Margin improvement driven by productivity and automation",
        "Ability to scale volumes without proportional cost increases"
      ]
    },
    {
      title: "Grow the business",
      bullets: []
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 pb-32 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900/30">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-slate-400 mb-1">ServiceNow Internal Confidential</p>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent italic">
                The Integrator
              </span>
              <span className="text-emerald-400 ml-2">Strategy</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <RegenerateSectionButton section="roadmapPhases" />
            <span className="pill-badge bg-accent/20 text-accent border-accent/30 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-3 h-3" />
              AI Generated
            </span>
          </div>
        </div>

        {/* All the way banner */}
        <div className="bg-slate-700/40 rounded-lg py-2 px-4 mb-3 text-center">
          <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            All the way
          </span>
        </div>

        {/* Purpose */}
        <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg py-2 px-4 mb-3 text-center">
          <span className="text-slate-300 text-sm">
            <span className="font-semibold text-white">Our purpose</span> Improving life for all by integrating the world
          </span>
        </div>

        {/* Main Grid Structure */}
        <div className="space-y-3">
          
          {/* Row: Long-term aims */}
          <div className="grid grid-cols-12 gap-3">
            {/* Label */}
            <div className="col-span-2 bg-slate-300 rounded-lg p-3 flex flex-col justify-center">
              <div className="text-slate-800 font-bold text-sm">Our six longer-term aims</div>
              <div className="text-slate-600 text-sm">Our ambition is...</div>
              <ChevronRight className="w-5 h-5 text-slate-500 mt-1 self-end" />
            </div>
            {/* 6 aims in 2 rows of 3 */}
            <div className="col-span-10 grid grid-cols-3 gap-2">
              {longTermAims.slice(0, 3).map((aim, i) => (
                <div key={i} className="bg-cyan-700/60 border border-cyan-600/40 rounded-lg p-3 text-center">
                  <p className="text-white text-xs font-medium leading-snug">{aim}</p>
                </div>
              ))}
              {longTermAims.slice(3, 6).map((aim, i) => (
                <div key={i + 3} className="bg-cyan-700/60 border border-cyan-600/40 rounded-lg p-3 text-center">
                  <p className="text-white text-xs font-medium leading-snug">{aim}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Row: Tasks for 2025/26 */}
          <div className="grid grid-cols-12 gap-3">
            {/* Label */}
            <div className="col-span-2 bg-amber-200 rounded-lg p-3 flex flex-col justify-center">
              <div className="text-slate-800 font-bold text-sm">Our Tasks for 2025/26</div>
              <div className="text-slate-600 text-sm">We must...</div>
              <ChevronRight className="w-5 h-5 text-slate-500 mt-1 self-end" />
            </div>
            {/* 4 pillars */}
            <div className="col-span-10 grid grid-cols-4 gap-2">
              {strategicPillars.map((pillar) => (
                <div key={pillar.id} className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3">
                  <h4 className={`text-sm font-bold bg-gradient-to-r ${pillar.color} bg-clip-text text-transparent text-center mb-2`}>
                    {pillar.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 text-center">+ For more see page #xx</p>
                </div>
              ))}
            </div>
          </div>

          {/* Row: Objectives for 2026+ */}
          <div className="grid grid-cols-12 gap-3">
            {/* Label */}
            <div className="col-span-2 bg-amber-200 rounded-lg p-3 flex flex-col justify-center">
              <div className="text-slate-800 font-bold text-sm">Our Objectives for 2026 +</div>
              <div className="text-slate-600 text-sm">We will...</div>
              <ChevronRight className="w-5 h-5 text-slate-500 mt-1 self-end" />
            </div>
            {/* 4 objective columns */}
            <div className="col-span-10 grid grid-cols-4 gap-2">
              {strategicPillars.map((pillar) => (
                <div key={pillar.id} className="bg-slate-800/80 border border-slate-600/50 rounded-lg p-3">
                  <ul className="space-y-2">
                    {pillar.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${pillar.color} mt-1.5 flex-shrink-0`} />
                        <span className="text-[11px] text-slate-300 leading-snug">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Row: Medium-term ambitions */}
          <div className="grid grid-cols-12 gap-3">
            {/* Label */}
            <div className="col-span-2 bg-cyan-700 rounded-lg p-3 flex flex-col justify-center">
              <div className="text-white font-bold text-sm">Delivering on our medium-term ambitions</div>
              <ChevronRight className="w-5 h-5 text-cyan-300 mt-1 self-end" />
            </div>
            {/* 3 ambition columns spanning 4 pillars */}
            <div className="col-span-10 grid grid-cols-3 gap-2">
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
                    <p className="text-slate-500 text-xs">Tbc</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer banner */}
        <div className="mt-4 bg-cyan-700/50 rounded-lg py-3 px-6 text-center">
          <span className="text-white text-sm font-medium">
            Underpinned by Group governance, support services and risk management
          </span>
        </div>
      </div>
    </div>
  );
};
