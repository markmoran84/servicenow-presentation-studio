import { useAccountData } from "@/context/AccountDataContext";
import { Cpu, Brain, MessageSquare, FileSearch, Sparkles, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  messagesquare: MessageSquare,
  filesearch: FileSearch,
  brain: Brain,
  sparkles: Sparkles,
};

const defaultUseCases = [
  { icon: MessageSquare, title: "Predictive Case Routing", description: "AI-powered case classification and intelligent routing to optimal agents", priority: "High", status: "Pilot Ready" },
  { icon: FileSearch, title: "Intelligent Document Processing", description: "Automated extraction and processing of documents and contracts", priority: "High", status: "Discovery" },
  { icon: Brain, title: "Customer Sentiment Analysis", description: "Real-time sentiment detection to prioritise and escalate critical cases", priority: "Medium", status: "Scoped" },
  { icon: Sparkles, title: "AI Knowledge Management", description: "Generative AI-powered knowledge base with contextual recommendations", priority: "Medium", status: "Planned" },
];

export const AIUseCasesSlide = () => {
  const { data } = useAccountData();
  const { generatedPlan, basics } = data;

  // Use AI-generated use cases if available
  const isAIGenerated = !!generatedPlan?.aiUseCases;
  const useCases = generatedPlan?.aiUseCases?.map((uc, idx) => ({
    icon: idx === 0 ? MessageSquare : idx === 1 ? FileSearch : idx === 2 ? Brain : Sparkles,
    title: uc.title,
    description: uc.description,
    priority: uc.priority,
    status: uc.status,
  })) || defaultUseCases;

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
            <Cpu className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">AI-Led Use Case Portfolio</h1>
            <p className="text-muted-foreground text-lg">Priority AI use cases aligned to {basics.accountName}'s AI-first strategy</p>
          </div>
          {isAIGenerated && (
            <span className="ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
              <Sparkles className="w-3 h-3" />
              AI Generated
            </span>
          )}
        </div>

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
      </div>
    </div>
  );
};
