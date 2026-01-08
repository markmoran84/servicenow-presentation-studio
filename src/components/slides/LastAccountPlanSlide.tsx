import { ExternalLink, CheckCircle } from "lucide-react";

export const LastAccountPlanSlide = () => {
  return (
    <div className="min-h-screen px-12 py-10">
      <h1 className="text-5xl font-bold mb-10 opacity-0 animate-fade-in">
        <span className="text-primary">Summary of</span>{" "}
        <span className="text-foreground">Last Account Plan</span>
      </h1>
      
      {/* Header Info Boxes */}
      <div className="grid grid-cols-2 gap-6 mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center gap-8 p-4 rounded-lg border border-primary/30 bg-card/30">
          <div>
            <p className="text-muted-foreground text-sm">Previous Account Plan Date:</p>
          </div>
          <p className="text-foreground font-medium">MM/DD/YYY</p>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg border border-primary/30 bg-card/30">
          <div>
            <p className="text-muted-foreground text-sm">Previous Account Planner:</p>
          </div>
          <div className="text-right">
            <p className="text-foreground font-semibold">Jakob Hjortsø</p>
            <p className="text-muted-foreground text-sm">Client Director</p>
          </div>
        </div>
      </div>
      
      {/* Main Content Box */}
      <div className="p-8 rounded-xl border border-primary/30 bg-card/30 mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <p className="text-foreground text-lg leading-relaxed mb-6">
          In FY25, our focus was on stabilising the Maersk–ServiceNow partnership and restoring confidence in execution. 
          Platform health challenges driven by over-customisation had constrained the perceived value of existing 
          investments, making remediation of the foundation a critical priority within the plan.
        </p>
        <p className="text-foreground text-lg leading-relaxed">
          From there, the account strategy was deliberately shaped around Maersk's AI-first ambition. We centred the 
          engagement on AI-led use cases, with ServiceNow positioned as the underlying platform to embed AI as a core 
          capability across customer, commercial, and service workflows. Within this context, CRM modernisation, 
          including the Service Cloud takeout, was framed as a primary lever to elevate customer experience, reduce cost-to-serve 
          and simplify operations. CPQ and broader CRM capabilities were positioned to unlock greater commercial 
          agility. These AI-centred opportunities were advanced through FY25 and now carry into Q1 with clear intent, 
          alongside other prioritised initiatives.
        </p>
      </div>
      
      {/* Footer Box */}
      <div className="flex items-center justify-between p-4 rounded-lg border border-primary/30 bg-card/30 opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <a href="#" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <ExternalLink className="w-4 h-4" />
          <span className="text-sm font-medium">Link of Last Account Plan Summary</span>
        </a>
        <div className="flex items-center gap-2 text-primary">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Approved</span>
        </div>
      </div>
    </div>
  );
};
