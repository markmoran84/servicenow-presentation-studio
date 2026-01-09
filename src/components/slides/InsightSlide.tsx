import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Lightbulb, ArrowRight, Building2, Info, Sparkles } from "lucide-react";

export const InsightSlide = () => {
  const { data } = useAccountData();
  const { generatedPlan, basics } = data;
  const companyName = basics.accountName || "the customer";

  // Use AI-generated insight if available
  const isAIGenerated = !!generatedPlan?.insight;
  const insight = generatedPlan?.insight;
  
  const mainInsight = insight?.mainInsight || "";
  const supportingText = insight?.supportingText || "";
  const paradigmShifts = insight?.paradigmShifts || [];
  const evidence = insight?.evidence || [];
  
  const hasContent = mainInsight || paradigmShifts.length > 0;

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32 flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center animate-pulse-glow">
            <Lightbulb className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Insight</h1>
            <p className="text-muted-foreground text-lg">Point of View — Step 4: What Leading Enterprises Do Differently</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <RegenerateSectionButton section="insight" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
            <div className="pill-badge-accent">
              PoV Framework
            </div>
          </div>
        </div>

        {hasContent ? (
          <>
            {/* Main Insight */}
            <div className="glass-card p-8 mb-8 border-l-4 border-l-accent">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    {mainInsight}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {supportingText}
                  </p>
                </div>
              </div>
            </div>

            {/* Paradigm Shifts */}
            {paradigmShifts.length > 0 && (
              <>
                <h3 className="text-xl font-bold text-foreground mb-6">The Paradigm Shift</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {paradigmShifts.slice(0, 4).map((shift, index) => (
                    <div 
                      key={index}
                      className="glass-card p-5 opacity-0 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-1 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                          <span className="text-xs font-semibold text-destructive uppercase tracking-wider block mb-1">Old</span>
                          <p className="text-sm text-foreground/80">{shift.old}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 p-3 rounded-lg bg-accent/5 border border-accent/20">
                          <span className="text-xs font-semibold text-accent uppercase tracking-wider block mb-1">New</span>
                          <p className="text-sm text-foreground/80">{shift.new}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Evidence */}
            {evidence.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {evidence.slice(0, 3).map((item, index) => (
                  <div 
                    key={index}
                    className="glass-card p-6 text-center opacity-0 animate-fade-in"
                    style={{ animationDelay: `${500 + index * 100}ms` }}
                  >
                    <p className={`text-4xl font-bold mb-2 ${
                      index === 0 ? 'text-gradient' : index === 1 ? 'text-gradient-accent' : 'text-primary'
                    }`}>{item.stat}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Insight Generated</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Complete the Input Form with account details and click <span className="font-medium text-foreground">Generate with AI</span> to create strategic insights tailored to {companyName}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
