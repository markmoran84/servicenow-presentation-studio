import { useAccountData } from "@/context/AccountDataContext";

interface Risk {
  id: number;
  title: string;
  description: string;
}

export const KeyRisksSlide = () => {
  const { data } = useAccountData();
  const companyName = data.basics.accountName || "Customer";

  const strategicRisks: Risk[] = [
    { id: 1, title: "Executive Sponsorship Instability (Navneet at Risk)", description: "Primary technical sponsor may exit or disengage, creating loss of momentum, reset of priorities, and increased delivery scrutiny" },
    { id: 2, title: "Strategic Partner Positioning Risk", description: "Without a clear multi-year partnership narrative, ServiceNow risks being seen as a tactical vendor rather than a strategic platform" },
    { id: 3, title: "Incumbent Platform Entrenchment (Salesforce)", description: "Deep CRM adoption and organisational inertia increase switching costs and weaken future displacement opportunities" },
    { id: 4, title: "Platform Consolidation Pressure (Microsoft)", description: "Microsoft's footprint and bundled offerings position it as a \"good enough\" alternative across workflow and AI use cases" },
  ];

  const operationalRisks: Risk[] = [
    { id: 7, title: "Delivery Confidence Perception", description: "Explicit concerns about ServiceNow's ability to deliver at Maersk scale threaten adoption and expansion" },
    { id: 8, title: "Execution Capacity Constraints", description: "Maersk teams are stretched, limiting bandwidth for onboarding, change, and transformation execution" },
    { id: 9, title: "Knowledge & Continuity Gaps", description: "Role changes across teams risk loss of context, relationship history, and execution consistency" },
    { id: 10, title: "Adoption & Value Realisation Risk", description: "Slow adoption or under-realised outcomes could reinforce scepticism and reduce executive confidence" },
  ];

  const governanceRisks: Risk[] = [
    { id: 5, title: "Financial Governance Reset (CFO Exit)", description: "CFO departure has reset approval models, business case scrutiny, and investment thresholds, slowing decision velocity" },
    { id: 6, title: "Decision Ownership Ambiguity", description: "Unclear post-exit governance and decision authority increases risk of stalled approvals and fragmented sponsorship" },
  ];

  const commercialRisks: Risk[] = [
    { id: 11, title: "CRM Deal Slippage / Cancellation Risk", description: "Delays and executive silence increase risk of deal deferral or loss, reinforcing incumbent position" },
    { id: 12, title: "Cost Pressure & ROI Scrutiny", description: "IT cost reductions increase resistance to upfront investment, even where long-term value is clear" },
    { id: 13, title: "Renewal & Expansion Confidence Risk", description: "If value is not visibly realised, renewal confidence and long-term expansion are at risk" },
  ];

  const RiskList = ({ risks, category }: { risks: Risk[]; category: string }) => (
    <div className="space-y-3">
      {risks.map((risk) => (
        <div key={risk.id} className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-xs font-bold text-primary">{risk.id}</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">{risk.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{risk.description}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen p-6 pb-32">
      {/* Header */}
      <div className="mb-4 opacity-0 animate-fade-in">
        <h1 className="text-4xl font-bold text-primary mb-2">Key Risks to The FY26 Plan</h1>
        <p className="text-sm text-muted-foreground text-center max-w-3xl mx-auto">
          The {companyName} account team categorises risks into four different areas to provide the appropriate level of governance and oversight to effectively manage these risks.
        </p>
      </div>

      {/* Main Layout - Radar in center with risk lists on sides */}
      <div className="grid grid-cols-[1fr_400px_1fr] gap-6 items-start">
        {/* Left Column - Strategic & Governance */}
        <div className="space-y-6 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div>
            <h3 className="text-lg font-bold text-primary mb-3">Strategic</h3>
            <p className="text-xs text-muted-foreground mb-4">Risks that could limit our ability to position ServiceNow as a strategic platform partner and scale the account.</p>
            <RiskList risks={strategicRisks} category="Strategic" />
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-cyan-400 mb-3">Governance</h3>
            <p className="text-xs text-muted-foreground mb-4">Risks associated with governance and oversight mechanisms.</p>
            <RiskList risks={governanceRisks} category="Governance" />
          </div>
        </div>

        {/* Center - Risk Radar */}
        <div className="flex items-center justify-center opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="relative w-[350px] h-[350px]">
            {/* Concentric circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full rounded-full border border-primary/20" />
            </div>
            <div className="absolute inset-[15%] flex items-center justify-center">
              <div className="w-full h-full rounded-full border border-primary/20" />
            </div>
            <div className="absolute inset-[30%] flex items-center justify-center">
              <div className="w-full h-full rounded-full border border-primary/20" />
            </div>
            <div className="absolute inset-[45%] flex items-center justify-center">
              <div className="w-full h-full rounded-full border border-primary/20 bg-primary/5" />
            </div>

            {/* Quadrant Labels */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-xs text-muted-foreground">Low</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 text-xs text-muted-foreground flex flex-col items-center">
              <span>Low</span>
              <span className="text-[10px]">Risk Severity</span>
            </div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 text-xs text-muted-foreground">Low</div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 text-xs text-muted-foreground">Low</div>
            
            {/* Quadrant Names */}
            <div className="absolute top-[15%] left-[25%] text-xs font-medium text-primary/60 -rotate-45">Strategic</div>
            <div className="absolute top-[15%] right-[25%] text-xs font-medium text-primary/60 rotate-45">Operational</div>
            <div className="absolute bottom-[15%] left-[25%] text-xs font-medium text-primary/60 rotate-45">Governance</div>
            <div className="absolute bottom-[15%] right-[25%] text-xs font-medium text-primary/60 -rotate-45">Commercial</div>

            {/* Risk Points */}
            {/* Strategic (top-left) */}
            <div className="absolute top-[35%] left-[35%] w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-background">1</div>
            <div className="absolute top-[42%] left-[28%] w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-background">2</div>
            <div className="absolute top-[30%] left-[42%] w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-background">3</div>
            <div className="absolute top-[38%] left-[38%] w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-background">4</div>

            {/* Operational (top-right) */}
            <div className="absolute top-[30%] right-[35%] w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-background">8</div>
            <div className="absolute top-[35%] right-[28%] w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-background">9</div>
            <div className="absolute top-[42%] right-[40%] w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-background">7</div>
            <div className="absolute top-[48%] right-[32%] w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-background">10</div>

            {/* Governance (bottom-left) */}
            <div className="absolute bottom-[28%] left-[35%] w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-background">5</div>
            <div className="absolute bottom-[35%] left-[28%] w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-background">6</div>

            {/* Commercial (bottom-right) */}
            <div className="absolute bottom-[35%] right-[30%] w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-background">11</div>
            <div className="absolute bottom-[28%] right-[38%] w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-background">12</div>
            <div className="absolute bottom-[22%] right-[32%] w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-background">13</div>

            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold text-foreground">Key Risks</span>
            </div>

            {/* High Label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-4 text-xs text-muted-foreground">High</div>
          </div>
        </div>

        {/* Right Column - Operational & Commercial */}
        <div className="space-y-6 opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div>
            <h3 className="text-lg font-bold text-primary mb-3">Operational</h3>
            <p className="text-xs text-muted-foreground mb-4">Risks that impact execution velocity, adoption, and realised value from ServiceNow deployments.</p>
            <RiskList risks={operationalRisks} category="Operational" />
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-orange-400 mb-3">Commercial</h3>
            <p className="text-xs text-muted-foreground mb-4">Risks that could affect account growth, renewal confidence, and long-term commercial expansion.</p>
            <RiskList risks={commercialRisks} category="Commercial" />
          </div>
        </div>
      </div>
    </div>
  );
};
