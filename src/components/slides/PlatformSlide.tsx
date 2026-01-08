import { Layers, Shield, Zap, Eye, GitBranch } from "lucide-react";

export const PlatformSlide = () => {
  const capabilities = [
    { icon: GitBranch, title: "Orchestration", description: "Unified workflow engine connecting all enterprise processes" },
    { icon: Shield, title: "Governance", description: "Enterprise-grade security, compliance, and audit controls" },
    { icon: Zap, title: "Scale", description: "Cloud-native architecture that scales with business growth" },
    { icon: Eye, title: "Control", description: "Real-time visibility and analytics across all workflows" },
  ];

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Layers className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Platform as Execution Layer</h1>
            <p className="text-muted-foreground text-lg">How the platform enables enterprise transformation</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {capabilities.map((cap, i) => (
            <div key={cap.title} className="glass-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <cap.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{cap.title}</h3>
              </div>
              <p className="text-muted-foreground">{cap.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
