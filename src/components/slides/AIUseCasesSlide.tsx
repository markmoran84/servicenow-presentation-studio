import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Cpu, Brain, MessageSquare, FileSearch, Sparkles, Bot, Zap, AlertCircle } from "lucide-react";

const iconOptions = [MessageSquare, FileSearch, Brain, Sparkles, Bot, Zap, Cpu];

export const AIUseCasesSlide = () => {
  const { data } = useAccountData();
  const { generatedPlan, basics } = data;

  // Use AI-generated use cases if available
  const isAIGenerated = !!generatedPlan?.aiUseCases && generatedPlan.aiUseCases.length > 0;
  const useCases = generatedPlan?.aiUseCases?.map((uc, idx) => ({
    icon: iconOptions[idx % iconOptions.length],
    title: uc.title,
    description: uc.description,
    priority: uc.priority,
    status: uc.status,
  })) || [];

  const hasData = useCases.length > 0;

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
            <Cpu className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">AI-Led Use Case Portfolio</h1>
            <p className="text-muted-foreground text-lg">
              {basics.accountName ? `Priority AI use cases aligned to ${basics.accountName}'s AI-first strategy` : "Priority AI use cases aligned to customer AI-first strategy"}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <RegenerateSectionButton section="aiUseCases" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
          </div>
        </div>

        {!hasData ? (
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in">
            <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No AI Use Cases Defined</h3>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
              Complete the Input Form and generate an AI-powered strategic plan to populate AI use cases aligned to customer priorities.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {useCases.map((uc, i) => (
              <div key={uc.title} className="glass-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <uc.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-foreground">{uc.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">{uc.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{uc.description}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        uc.priority === 'High' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        Priority: {uc.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
