import { useAccountData } from "@/context/AccountDataContext";
import { Cpu, Brain, MessageSquare, FileSearch, Gauge, Sparkles } from "lucide-react";

export const AIUseCasesSlide = () => {
  const { data } = useAccountData();

  const useCases = [
    { icon: MessageSquare, title: "Predictive Case Routing", description: "AI-powered case classification and intelligent routing to optimal agents", priority: "High", status: "Pilot Ready" },
    { icon: FileSearch, title: "Intelligent Document Processing", description: "Automated extraction and processing of shipping documents and contracts", priority: "High", status: "Discovery" },
    { icon: Brain, title: "Customer Sentiment Analysis", description: "Real-time sentiment detection to prioritise and escalate critical cases", priority: "Medium", status: "Scoped" },
    { icon: Sparkles, title: "AI Knowledge Management", description: "Generative AI-powered knowledge base with contextual recommendations", priority: "Medium", status: "Planned" },
  ];

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
            <Cpu className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">AI-Led Use Case Portfolio</h1>
            <p className="text-muted-foreground text-lg">Priority AI use cases aligned to Maersk's AI-first strategy</p>
          </div>
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
                  <p className="text-sm text-muted-foreground">{uc.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
