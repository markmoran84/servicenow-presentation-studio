import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Layers, Shield, Zap, Eye, GitBranch, Info, Sparkles, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  gitbranch: GitBranch,
  shield: Shield,
  zap: Zap,
  eye: Eye,
  layers: Layers,
};

export const PlatformSlide = () => {
  const { data } = useAccountData();
  const { generatedPlan, basics } = data;
  const companyName = basics.accountName || "the customer";

  // Use AI-generated platform capabilities if available
  const isAIGenerated = !!generatedPlan?.platformCapabilities;
  const capabilities = generatedPlan?.platformCapabilities || [];
  const hasCapabilities = capabilities.length > 0;

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Layers className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Platform as Execution Layer</h1>
            <p className="text-muted-foreground text-lg">How the platform enables enterprise transformation for {companyName}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <RegenerateSectionButton section="platformCapabilities" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
          </div>
        </div>

        {hasCapabilities ? (
          <div className="grid grid-cols-2 gap-6">
            {capabilities.slice(0, 4).map((cap, i) => {
              const IconComponent = iconMap[cap.icon?.toLowerCase()] || Layers;
              return (
                <div 
                  key={cap.title} 
                  className="glass-card p-6 opacity-0 animate-fade-in" 
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{cap.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{cap.description}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Platform Capabilities Generated</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Complete the Input Form with account details and click <span className="font-medium text-foreground">Generate with AI</span> to create platform capability analysis tailored to {companyName}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
