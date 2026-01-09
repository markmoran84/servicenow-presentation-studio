import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Scale, AlertTriangle, TrendingUp, Shield, Info, Sparkles } from "lucide-react";

export const StrategicTensionSlide = () => {
  const { data } = useAccountData();
  const { generatedPlan, basics } = data;
  const companyName = basics.accountName || "the customer";

  // Use AI-generated strategic tensions if available
  const isAIGenerated = !!generatedPlan?.strategicTensions;
  const tensions = generatedPlan?.strategicTensions || [];
  const hasTensions = tensions.length > 0;

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32 flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 rounded-2xl bg-warning/20 flex items-center justify-center">
            <Scale className="w-7 h-7 text-warning" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Strategic Tension</h1>
            <p className="text-muted-foreground text-lg">Point of View — Step 3: The Executive Dilemma</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <RegenerateSectionButton section="strategicTensions" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
            <div className="pill-badge">
              PoV Framework
            </div>
          </div>
        </div>

        {hasTensions ? (
          <>
            {/* Tensions */}
            <div className="space-y-8">
              {tensions.slice(0, 2).map((tension, index) => (
                <div 
                  key={index}
                  className="glass-card p-8 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="grid grid-cols-5 gap-6 items-center">
                    {/* Left Force */}
                    <div className="col-span-2 p-6 rounded-xl bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-primary">{tension.leftLabel}</h3>
                      </div>
                      <p className="text-sm text-foreground/80">{tension.leftDescription}</p>
                    </div>

                    {/* Tension Indicator */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-warning/20 border-2 border-warning flex items-center justify-center mb-2">
                        <AlertTriangle className="w-7 h-7 text-warning" />
                      </div>
                      <span className="text-xs text-warning font-semibold uppercase tracking-wider">TENSION</span>
                    </div>

                    {/* Right Force */}
                    <div className="col-span-2 p-6 rounded-xl bg-accent/5 border border-accent/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-accent" />
                        </div>
                        <h3 className="text-xl font-bold text-accent">{tension.rightLabel}</h3>
                      </div>
                      <p className="text-sm text-foreground/80">{tension.rightDescription}</p>
                    </div>
                  </div>

                  {/* Dilemma */}
                  <div className="mt-6 p-4 rounded-xl bg-warning/5 border border-warning/20 text-center">
                    <p className="text-lg font-medium text-foreground italic">"{tension.dilemma}"</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Synthesis */}
            <div className="mt-8 glass-card p-6 border-l-4 border-l-warning opacity-0 animate-fade-in animation-delay-500">
              <p className="text-foreground/90">
                <span className="font-semibold text-warning">The Strategic Tension:</span> {companyName}'s leadership faces a fundamental 
                challenge — pursuing aggressive transformation while maintaining the operational discipline 
                that stakeholders expect. This tension cannot be resolved by traditional approaches.
              </p>
            </div>
          </>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Strategic Tensions Generated</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Complete the Input Form with account details and click <span className="font-medium text-foreground">Generate with AI</span> to create strategic tension analysis tailored to {companyName}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
