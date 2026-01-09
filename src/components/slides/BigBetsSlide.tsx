import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Sparkles } from "lucide-react";

const defaultExecutives = [
  { name: "Risham Sahi", role: "SVP Bus. Platforms" },
  { name: "Marielle Lindgren", role: "GVP EMEA North" },
  { name: "Hartmut Mueller", role: "CTO" },
  { name: "Navneet Kapoor", role: "EVP & CTIO" },
  { name: "Amit Zavery", role: "President" },
  { name: "Narin Pohl", role: "EVP & CPO L&S" },
  { name: "Vincent Clerc", role: "CEO MAERSK" },
  { name: "Bill McDermott", role: "CEO ServiceNow" },
  { name: "John Ball", role: "EVP CRM" },
  { name: "Karsten Kildahl", role: "CCO" },
  { name: "Paul Fipps", role: "CCO" },
  { name: "Katharina Poehlmann", role: "Head of strategy" },
  { name: "Surali Kewairamani", role: "VP Strategic Cust." },
];

const defaultWorkstreams = [
  {
    title: "Maersk Line Ocean – SFDC Takeout",
    dealClose: "Q4 – 2025 – Mature upside",
    statusColor: "bg-primary",
    barColor: "from-primary to-primary",
    insight: "Maersk is pursuing an ambitious AI strategy, but Salesforce's current offerings aren't delivering the required value. As a result, Maersk plans to replace Service Cloud with solutions from ServiceNow, Microsoft, or Oracle. A final decision is expected in Q4.",
    netNewACV: "$5m",
    steadyStateBenefit: "$565M",
    people: [
      { name: "Tan Gill", role: "SVP, IT Logistics" },
      { name: "Mark Graham", role: "SVP, IT Logistics" },
      { name: "Arjun Ghatttuara", role: "Procurement Lead" },
      { name: "Sarah Sharples", role: "Head of strategic vendors" },
    ],
  },
  {
    title: "Lead to Agreement- CPQ",
    dealClose: "Q4 – 2026 – Mature upside",
    statusColor: "bg-primary",
    barColor: "from-primary to-primary",
    insight: "Maersk's CPQ process has been a long-standing challenge, with significant gaps still filled using Excel. Over 230 people currently maintain the existing system. The goal is to start with a small-scale implementation and expand over time.",
    netNewACV: "$10m",
    steadyStateBenefit: "N/a",
    people: [
      { name: "Jakob Skovsgaard", role: "Head of CX" },
      { name: "Thomas Lassen", role: "SVP, Global Process Lead" },
      { name: "Oscar Ohde", role: "CPQ Platform Owner" },
      { name: "Sunil Kumar", role: "Engineering Director" },
    ],
  },
  {
    title: "Maersk L&S - CSM",
    dealClose: "Q2 – 2026 – Upside",
    statusColor: "bg-accent",
    barColor: "from-primary to-accent",
    insight: "Maersk Logistics and Services currently lacks a CSM system, and the business line is relatively immature. ServiceNow is running a pilot, and the team is awaiting results from the Ocean RFP before further decisions.",
    netNewACV: "$4m",
    steadyStateBenefit: "$423M",
    people: [
      { name: "Scott Hom", role: "SVP, IT Logistics" },
      { name: "Krishnan Srinivasan", role: "SVP of AI and Data" },
      { name: "Geoffrey Breed", role: "Director FbM Platform" },
    ],
  },
];

export const BigBetsSlide = () => {
  const { data } = useAccountData();
  const { generatedPlan, engagement } = data;

  const isAIGenerated = !!generatedPlan?.keyWorkstreams;
  const workstreams = generatedPlan?.keyWorkstreams?.map((ws, idx) => ({
    title: ws.title,
    dealClose: ws.targetClose,
    statusColor: idx === 0 ? "bg-primary" : idx === 1 ? "bg-primary" : "bg-accent",
    barColor: idx === 2 ? "from-primary to-accent" : "from-primary to-primary",
    insight: ws.insight,
    netNewACV: ws.acv,
    steadyStateBenefit: ws.steadyStateBenefit || "TBD",
    people: ws.people || [],
  })) || defaultWorkstreams;

  const executives = engagement.knownExecutiveSponsors.length > 0
    ? engagement.knownExecutiveSponsors.slice(0, 13).map(sponsor => {
        const parts = sponsor.split("(");
        return {
          name: parts[0].trim(),
          role: parts[1]?.replace(")", "") || "Executive Sponsor",
        };
      })
    : defaultExecutives;

  return (
    <div className="px-8 pt-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 opacity-0 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Key Transformation Workstreams</h1>
          <p className="text-lg text-muted-foreground mt-1">Aligning stakeholders to accelerate impact and outcomes</p>
        </div>
        <div className="flex items-center gap-2">
          <RegenerateSectionButton section="keyWorkstreams" />
          {isAIGenerated && (
            <span className="badge-accent">
              <Sparkles className="w-3 h-3 mr-1.5" />
              AI Generated
            </span>
          )}
        </div>
      </div>

      {/* Execs Row with Connected Line */}
      <div className="mb-6 opacity-0 animate-fade-in animation-delay-100">
        <span className="text-xs font-medium text-muted-foreground mb-3 block">Execs</span>
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-gradient-to-r from-primary via-primary to-primary/50 z-0" />
          {/* Executives */}
          <div className="flex justify-between relative z-10">
            {executives.map((exec, idx) => (
              <div key={exec.name} className="flex flex-col items-center text-center" style={{ maxWidth: '70px' }}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 border-2 border-primary flex items-center justify-center mb-1 bg-background">
                  <span className="text-[10px] font-bold text-foreground">
                    {exec.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <span className="text-[9px] font-medium text-foreground leading-tight">{exec.name}</span>
                <span className="text-[8px] text-primary leading-tight">{exec.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workstreams - 3 Column Layout */}
      <div className="grid grid-cols-3 gap-6">
        {workstreams.map((stream, index) => (
          <div
            key={stream.title}
            className="flex flex-col opacity-0 animate-fade-in"
            style={{ animationDelay: `${200 + index * 100}ms` }}
          >
            {/* Stream Title Section */}
            <div className="mb-3">
              <span className="text-xs font-medium text-muted-foreground mb-2 block">Streams</span>
              <h3 className="text-lg font-bold text-primary leading-tight">{stream.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Deal close: {stream.dealClose}</p>
              {/* Progress Bar */}
              <div className={`mt-2 h-1 rounded-full bg-gradient-to-r ${stream.barColor}`} />
            </div>

            {/* Insights Section */}
            <div className="mb-4">
              <span className="text-xs font-medium text-muted-foreground mb-2 block">Insights</span>
              <p className="text-[11px] text-foreground/80 leading-relaxed">
                {stream.insight}
              </p>
              
              {/* Financials */}
              <div className="mt-3 pt-3 border-t border-border/30 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] text-muted-foreground block">Net new annual</span>
                  <span className="text-[9px] text-muted-foreground block mb-0.5">contract value</span>
                  <span className="text-2xl font-bold text-foreground">{stream.netNewACV}</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground block">Steady-state</span>
                  <span className="text-[9px] text-muted-foreground block mb-0.5">benefit (Annual)</span>
                  <span className="text-2xl font-bold text-primary">{stream.steadyStateBenefit}</span>
                </div>
              </div>
            </div>

            {/* People Section */}
            <div>
              <span className="text-xs font-medium text-muted-foreground mb-2 block">People</span>
              {/* Progress Bar */}
              <div className={`mb-3 h-1 rounded-full bg-gradient-to-r ${stream.barColor}`} />
              <div className="grid grid-cols-2 gap-2">
                {stream.people.slice(0, 4).map((person) => (
                  <div key={person.name} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-primary/50 flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-bold text-foreground">
                        {person.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-medium text-foreground block leading-tight truncate">{person.name}</span>
                      <span className="text-[9px] text-muted-foreground block leading-tight truncate">{person.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};