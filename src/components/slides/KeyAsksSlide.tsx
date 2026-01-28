import { useAccountData } from "@/context/AccountDataContext";

export const KeyAsksSlide = () => {
  const { data } = useAccountData();

  const p5LeadershipAsks = [
    {
      title: "Executive Sponsorship & Air Cover",
      items: [
        "Quarterly executive touchpoints with customer C-suite",
        "Internal alignment on account priorities and investments",
        "Executive air cover for strategic decisions (Global/Local)",
        "Targeted GAC engagement during key decision windows"
      ]
    },
    {
      title: "Resource & Capacity Commitment",
      items: [
        "Ring-fenced delivery resources for key initiatives",
        "Budget allocation for solution development",
        "Dedicated customer success resources",
        "Pre-sales investment for POCs",
        "Access to specialist skills and expertise"
      ]
    },
    {
      title: "Deal Velocity & Commercial Flexibility",
      items: [
        "Fast-track deal desk approvals",
        "Pricing flexibility for multi-year",
        "Creative commercial structures"
      ]
    }
  ];

  const organisationAsks = [
    {
      title: "Strategic Account Governance & Decision Velocity",
      items: [
        "Clear decision ownership and escalation paths for the Maersk account",
        "Rapid internal decision-making to match Maersk's pace and decision windows"
      ]
    },
    {
      title: "Partner & Ecosystem Leverage",
      items: [
        "SI partner co-sell support",
        "Partner-funded POV resources"
      ]
    },
    {
      title: "Marketing & Demand Investment",
      items: [
        "Executive events and roundtables",
        "Custom content and thought leadership",
        "Reference customer development",
        "Pursuit Based Marketing Support"
      ]
    }
  ];

  const criticalSuccessFactors = [
    "P5 commitment signals priority",
    "Resource certainty enables execution",
    "Commercial flexibility wins deals",
    "Cross-BU alignment prevents friction"
  ];

  return (
    <div className="min-h-screen p-8 pb-32">
      {/* Header */}
      <div className="mb-6 opacity-0 animate-fade-in">
        <h1 className="text-5xl font-bold text-primary mb-2">Key Asks</h1>
        <p className="text-xl text-muted-foreground">What we need to execute our '4 For the Win' Account strategy</p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        {/* From P5 Leadership */}
        <div className="opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <h3 className="text-lg font-bold text-primary mb-4">From P5 Leadership</h3>
          <div className="space-y-4">
            {p5LeadershipAsks.map((ask, index) => (
              <div key={ask.title} className="glass-card p-4 border-l-4 border-l-primary">
                <h4 className="font-bold text-primary mb-3">{ask.title}</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {ask.items.map((item, i) => (
                    <p key={i} className="text-sm text-foreground/80">• {item}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* From the Organisation */}
        <div className="opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <h3 className="text-lg font-bold text-primary mb-4">From the Organisation</h3>
          <div className="space-y-4">
            {organisationAsks.map((ask, index) => (
              <div key={ask.title} className="glass-card p-4 border-l-4 border-l-accent">
                <h4 className="font-bold text-primary mb-3">{ask.title}</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {ask.items.map((item, i) => (
                    <p key={i} className="text-sm text-foreground/80">• {item}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Success Factors */}
      <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <h4 className="font-bold text-primary mb-4">Critical Success Factors</h4>
        <div className="grid grid-cols-4 gap-4">
          {criticalSuccessFactors.map((factor, index) => (
            <div key={index} className="text-sm font-medium text-foreground">
              {factor}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
