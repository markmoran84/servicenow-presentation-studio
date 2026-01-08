import { Layers, Shield, Zap, Eye, GitBranch } from "lucide-react";

export const PlatformSlide = () => {
  const capabilities = [
    { icon: GitBranch, title: "Orchestration", description: "Unified workflow engine connecting all enterprise processes" },
    { icon: Shield, title: "Governance", description: "Enterprise-grade security, compliance, and audit controls" },
    { icon: Zap, title: "Scale", description: "Cloud-native architecture that scales with business growth" },
    { icon: Eye, title: "Control", description: "Real-time visibility and analytics across all workflows" },
  ];

  return (
    <div className="min-h-screen p-8 md:p-12 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header - Two-tone style */}
        <div className="slide-header flex items-center gap-4">
          <div className="sn-icon-box">
            <Layers className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="slide-header-title">
              <span className="text-primary">Platform</span>{" "}
              <span className="text-foreground">as Execution Layer</span>
            </h1>
            <p className="slide-header-subtitle">How the platform enables enterprise transformation</p>
          </div>
        </div>

        {/* 2x2 Grid of capabilities */}
        <div className="grid grid-cols-2 gap-6">
          {capabilities.map((cap, i) => (
            <div 
              key={cap.title} 
              className="sn-glass-emphasis p-8 opacity-0 animate-fade-in" 
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="sn-icon-box">
                  <cap.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{cap.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{cap.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
