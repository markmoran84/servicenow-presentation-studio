import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Target, Building2, Users, Zap, CheckCircle2, Info, Sparkles, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  building2: Building2,
  users: Users,
  zap: Zap,
  checkcircle2: CheckCircle2,
};

const colorMap: Record<string, string> = {
  primary: "primary",
  accent: "accent",
};

export const StrategicAlignmentSlide = () => {
  const { data } = useAccountData();
  const { generatedPlan, basics } = data;
  const companyName = basics.accountName || "the customer";

  // Use AI-generated strategic alignment if available
  const isAIGenerated = !!generatedPlan?.strategicAlignment;
  const alignmentData = generatedPlan?.strategicAlignment || [];
  const hasAlignment = alignmentData.length > 0;

  return (
    <div className="px-8 pt-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 opacity-0 animate-fade-in">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold text-foreground">Strategic Alignment</h1>
            <p className="text-muted-foreground mt-1">Connecting {companyName} priorities to platform value</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RegenerateSectionButton section="strategicAlignment" />
          {isAIGenerated && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
              <Sparkles className="w-3 h-3" />
              AI Generated
            </span>
          )}
          <div className="pill-badge">
            FY26 Planning
          </div>
        </div>
      </div>

      {hasAlignment ? (
        <>
          {/* Four Column Grid */}
          <div className="grid grid-cols-4 gap-4">
            {alignmentData.slice(0, 4).map((column, colIndex) => {
              const IconComponent = iconMap[column.icon?.toLowerCase()] || Building2;
              const color = colorMap[column.color?.toLowerCase()] || (colIndex % 2 === 0 ? "primary" : "accent");
              
              return (
                <div
                  key={column.category}
                  className="opacity-0 animate-fade-in"
                  style={{ animationDelay: `${100 + colIndex * 100}ms` }}
                >
                  {/* Column Header */}
                  <div className={`flex items-center gap-2 mb-4 pb-3 border-b-2 ${
                    color === 'accent' ? 'border-accent' : 'border-primary'
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      color === 'accent' 
                        ? 'bg-accent/20' 
                        : 'bg-primary/20'
                    }`}>
                      <IconComponent className={`w-4 h-4 ${
                        color === 'accent' ? 'text-accent' : 'text-primary'
                      }`} />
                    </div>
                    <h2 className="font-bold text-foreground text-sm uppercase tracking-wide">
                      {column.category}
                    </h2>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {(column.items || []).map((item, itemIndex) => (
                      <div
                        key={item.title}
                        className="glass-card p-4 hover:border-primary/30 transition-all group"
                        style={{ animationDelay: `${200 + colIndex * 100 + itemIndex * 50}ms` }}
                      >
                        <h3 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Connection Flow Indicator */}
          <div className="mt-6 flex items-center justify-center gap-4 opacity-0 animate-fade-in animation-delay-500">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">{companyName} Strategy</span>
              <div className="w-24 h-0.5 bg-gradient-to-r from-primary to-primary/50"></div>
            </div>
            <div className="w-3 h-3 rounded-full bg-primary/50 animate-pulse"></div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-0.5 bg-gradient-to-r from-accent/50 to-accent"></div>
              <span className="text-xs font-medium text-muted-foreground">Platform Value</span>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Strategic Alignment Generated</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Complete the Input Form with account details and click <span className="font-medium text-foreground">Generate with AI</span> to create strategic alignment analysis tailored to {companyName}.
          </p>
        </div>
      )}
    </div>
  );
};
