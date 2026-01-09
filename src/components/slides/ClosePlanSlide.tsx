import { useAccountData } from "@/context/AccountDataContext";
import { Target, Info } from "lucide-react";

export const ClosePlanSlide = () => {
  const { data } = useAccountData();
  const companyName = data.basics.accountName || "the customer";

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Executive Close Plan
              </h1>
              <p className="text-muted-foreground text-lg">Strategic Engagement Timeline for {companyName}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Close Plan Configuration</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Complete the Input Form with account details and generate an AI plan to populate the close plan timeline for {companyName}.
          </p>
        </div>

        {/* Quarterly Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">Q1-Q2</div>
            <div className="text-sm text-muted-foreground">Discovery & Validation</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-accent">Q2-Q3</div>
            <div className="text-sm text-muted-foreground">Commercialisation</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-foreground">Q3-Q4</div>
            <div className="text-sm text-muted-foreground">Delivery & Adoption</div>
          </div>
        </div>
      </div>
    </div>
  );
};
