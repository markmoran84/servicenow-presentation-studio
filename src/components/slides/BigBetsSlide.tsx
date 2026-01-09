import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Sparkles } from "lucide-react";

type Person = { name: string; role: string };

type Workstream = {
  title: string;
  dealClose: string;
  barColor: string; // tailwind gradient classes (semantic tokens)
  insight: string;
  netNewACV: string;
  steadyStateBenefit: string;
  people: Person[];
};

const defaultExecutives: Person[] = [
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

const defaultWorkstreams: Workstream[] = [
  {
    title: "Maersk Line Ocean – SFDC Takeout",
    dealClose: "Q4 – 2025 – Mature upside",
    barColor: "from-primary to-accent",
    insight:
      "Maersk is pursuing an ambitious AI strategy, but Salesforce's current offerings aren't delivering the required value. As a result, Maersk plans to replace Service Cloud with solutions from ServiceNow, Microsoft, or Oracle. A final decision is expected in Q4.",
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
    barColor: "from-primary to-primary",
    insight:
      "Maersk's CPQ process has been a long-standing challenge, with significant gaps still filled using Excel. Over 230 people currently maintain the existing system. The goal is to start with a small-scale implementation and expand over time.",
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
    barColor: "from-primary to-accent",
    insight:
      "Maersk Logistics and Services currently lacks a CSM system, and the business line is relatively immature. ServiceNow is running a pilot, and the team is awaiting results from the Ocean RFP before further decisions.",
    netNewACV: "$4m",
    steadyStateBenefit: "$423M",
    people: [
      { name: "Scott Hom", role: "SVP, IT Logistics" },
      { name: "Krishnan Srinivasan", role: "SVP of AI and Data" },
      { name: "Geoffrey Breed", role: "Director FbM Platform" },
    ],
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function StreamTitle({ title }: { title: string }) {
  const parts = title.split(/\s*[–-]\s*/);
  if (parts.length >= 2) {
    const first = parts[0];
    const rest = parts.slice(1).join(" – ");
    return (
      <span>
        <span className="text-primary">{first}</span>
        <span className="text-accent">{` – ${rest}`}</span>
      </span>
    );
  }
  return <span className="text-primary">{title}</span>;
}

function AvatarChip({ person, ring }: { person: Person; ring: "primary" | "accent" }) {
  return (
    <div className="flex flex-col items-center text-center w-[90px]">
      <div
        className={
          "w-9 h-9 rounded-full bg-background border-2 flex items-center justify-center " +
          (ring === "accent" ? "border-accent" : "border-primary")
        }
      >
        <span className="text-[9px] font-bold text-foreground">{initials(person.name)}</span>
      </div>
      <div className="mt-1 text-[10px] font-medium text-foreground leading-tight truncate w-full">
        {person.name}
      </div>
      <div className="text-[9px] text-muted-foreground leading-tight truncate w-full">{person.role}</div>
    </div>
  );
}

function PeopleCard({ stream, index }: { stream: Workstream; index: number }) {
  const people = (stream.people || []).slice(0, 4);
  const top = people.slice(0, 2);
  const bottom = people.slice(2, 4);

  // Mimic reference: the 3rd column often has a yellow line.
  const topLine = index === 2 ? "from-[hsl(var(--warning))] to-[hsl(var(--warning))]" : stream.barColor;
  const bottomLine = stream.barColor;

  return (
    <div className="sn-glass-basic px-4 py-4">
      <div className="space-y-5">
        <div>
          <div className={`h-1 rounded-full bg-gradient-to-r ${topLine}`} />
          <div className="mt-2 flex justify-between">
            {top.map((p, i) => (
              <AvatarChip key={p.name} person={p} ring={i % 2 ? "accent" : "primary"} />
            ))}
          </div>
        </div>

        {bottom.length > 0 && (
          <div>
            <div className={`h-1 rounded-full bg-gradient-to-r ${bottomLine}`} />
            <div className="mt-2 flex justify-between">
              {bottom.map((p, i) => (
                <AvatarChip key={p.name} person={p} ring={i % 2 ? "accent" : "primary"} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const BigBetsSlide = () => {
  const { data } = useAccountData();
  const { generatedPlan, engagement } = data;

  const isAIGenerated = !!generatedPlan?.keyWorkstreams;

  const workstreams: Workstream[] =
    generatedPlan?.keyWorkstreams?.slice(0, 3).map((ws, idx) => ({
      title: ws.title,
      dealClose: ws.targetClose,
      barColor: idx === 0 ? "from-primary to-accent" : idx === 1 ? "from-primary to-primary" : "from-primary to-accent",
      insight: ws.insight,
      netNewACV: ws.acv,
      steadyStateBenefit: ws.steadyStateBenefit || "TBD",
      people: ws.people || [],
    })) || defaultWorkstreams;

  const executives: Person[] =
    engagement.knownExecutiveSponsors.length > 0
      ? engagement.knownExecutiveSponsors.slice(0, 13).map((sponsor) => {
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
      <div className="flex items-start justify-between mb-6 opacity-0 animate-fade-in">
        <div>
          <h1 className="slide-title text-primary">Key Transformation Workstreams</h1>
          <p className="slide-subtitle">Aligning stakeholders to accelerate impact and outcomes</p>
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

      {/* Reference layout grid */}
      <div className="grid grid-cols-[84px_1fr] gap-x-6 gap-y-5">
        {/* Execs */}
        <div className="text-xs text-muted-foreground pt-4">Execs</div>
        <div className="sn-glass-emphasis px-5 py-4">
          <div className="relative">
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-gradient-to-r from-accent via-primary to-primary" />
            <div className="flex justify-between relative">
              {executives.map((exec, idx) => (
                <div key={exec.name} className="flex flex-col items-center text-center w-[64px]">
                  <div
                    className={
                      "w-10 h-10 rounded-full bg-background border-2 flex items-center justify-center " +
                      (idx % 2 ? "border-accent" : "border-primary")
                    }
                  >
                    <span className="text-[10px] font-bold text-foreground">{initials(exec.name)}</span>
                  </div>
                  <span className="mt-1 text-[9px] font-medium text-foreground leading-tight">{exec.name}</span>
                  <span className="text-[8px] text-primary leading-tight">{exec.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Streams */}
        <div className="text-xs text-muted-foreground pt-7">Streams</div>
        <div className="grid grid-cols-3 gap-4">
          {workstreams.slice(0, 3).map((stream) => (
            <div key={stream.title} className="sn-glass-basic px-5 py-4">
              <div className="text-center">
                <div className="text-base font-semibold leading-tight">
                  <StreamTitle title={stream.title} />
                </div>
                <p className="mt-1 text-[11px] text-foreground/80 italic">Deal close: {stream.dealClose}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Insights */}
        <div className="text-xs text-muted-foreground pt-6">Insights</div>
        <div className="grid grid-cols-3 gap-4">
          {workstreams.slice(0, 3).map((stream) => (
            <div key={stream.title} className="sn-glass-basic p-5 flex flex-col min-h-[230px]">
              <p className="text-[12px] leading-relaxed text-foreground/85 flex-1">{stream.insight}</p>

              <div className="mt-4 pt-4 border-t border-border/30">
                <div className="grid grid-cols-2">
                  <div className="pr-4">
                    <div className="text-[9px] text-primary leading-tight">Net new annual</div>
                    <div className="text-[9px] text-primary leading-tight">contract value</div>
                    <div className="mt-1 text-3xl font-bold text-foreground">{stream.netNewACV}</div>
                  </div>

                  <div className="pl-4 border-l border-border/30">
                    <div className="text-[9px] text-primary leading-tight">Steady-state</div>
                    <div className="text-[9px] text-primary leading-tight">benefit (Annual)</div>
                    <div className="mt-1 text-3xl font-bold text-foreground">{stream.steadyStateBenefit}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* People */}
        <div className="text-xs text-muted-foreground pt-6">People</div>
        <div className="grid grid-cols-3 gap-4">
          {workstreams.slice(0, 3).map((stream, idx) => (
            <PeopleCard key={stream.title} stream={stream} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};
