import { useAccountData } from "@/context/AccountDataContext";
import { Anchor, Cpu, Users, Zap } from "lucide-react";

export const ExecutiveSummarySlide = () => {
  const { data } = useAccountData();
  const { basics } = data;

  const companyName = basics.accountName.split(" ").pop()?.toUpperCase() || "PARTNER";

  const pillars = [
    {
      icon: Anchor,
      keyword: "BETTER",
      title: "NETWORK",
      tagline: "More reliable. More predictable. More integrated.",
      description: "Strengthened network reliability and operational discipline across Ocean, Logistics & Services, and Terminals — operating as one connected system through network redesign, capacity discipline, and digitised execution.",
      outcome: "schedule reliability, resilience, and end-to-end flow"
    },
    {
      icon: Users,
      keyword: "BETTER",
      title: "CUSTOMER EXPERIENCE",
      tagline: "Connected journeys, not fragmented interactions.",
      description: "Improving customer experience by simplifying engagement, reducing handoffs, and connecting customer-facing processes to operational execution with aligned digital channels and service operations.",
      outcome: "trust, transparency, and reduced friction"
    },
    {
      icon: Cpu,
      keyword: "BETTER",
      title: "TECHNOLOGY & AI",
      tagline: "From digital ambition to operational execution.",
      description: "Accelerated AI-first agenda by embedding intelligence into core workflows — moving beyond pilots to operational use cases with data, automation, and AI improving decision-making and execution speed.",
      outcome: "AI in execution, not experimentation"
    },
    {
      icon: Zap,
      keyword: "BETTER",
      title: "EFFICIENCY",
      tagline: "Lower cost-to-serve through standardisation and automation.",
      description: "Continued to reduce structural cost-to-serve by simplifying systems, standardising processes, and automating manual work — improving productivity and reducing complexity.",
      outcome: "efficiency as a structural advantage"
    }
  ];

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto h-full">
        {/* Header */}
        <div className="mb-10">
          <p className="text-muted-foreground text-lg mb-2">Delivering</p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="text-foreground">A </span>
            <span className="text-primary">BETTER</span>
            <span className="text-foreground"> {companyName}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Executing the Integrator Strategy with discipline, intelligence, and scale
          </p>
        </div>

        {/* Brand Concept */}
        <div className="glass-card p-6 mb-8 max-w-4xl">
          <p className="text-foreground/90 leading-relaxed">
            {companyName} is transforming from a traditional shipping company into an integrated logistics enterprise. 
            The focus has been on strengthening execution, simplifying operations, and embedding data and AI 
            to deliver more reliable, connected outcomes for customers — while maintaining strong cost and capital discipline.
          </p>
        </div>

        {/* Four Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, index) => (
            <div 
              key={pillar.title}
              className="glass-card p-6 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <pillar.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">
                  <span className="text-primary">{pillar.keyword}</span>
                  <span className="text-foreground ml-2">{pillar.title}</span>
                </h3>
              </div>
              
              <p className="text-sm font-medium text-accent mb-3">{pillar.tagline}</p>
              
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {pillar.description}
              </p>
              
              <div className="border-t border-border pt-3">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Outcome focus:</span> {pillar.outcome}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
