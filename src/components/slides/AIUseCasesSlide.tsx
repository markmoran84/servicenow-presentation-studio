import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Cpu, Brain, MessageSquare, FileSearch, Sparkles, Bot, Zap, AlertCircle, TrendingUp, Clock, Target, ArrowRight } from "lucide-react";

const iconOptions = [MessageSquare, FileSearch, Brain, Sparkles, Bot, Zap, Cpu];

const getImpactLevel = (priority: string) => {
  switch (priority) {
    case 'High': return { label: 'High Impact', color: 'text-primary', bg: 'bg-primary/10', barWidth: 'w-full' };
    case 'Medium': return { label: 'Medium Impact', color: 'text-accent', bg: 'bg-accent/10', barWidth: 'w-2/3' };
    default: return { label: 'Standard Impact', color: 'text-muted-foreground', bg: 'bg-muted', barWidth: 'w-1/3' };
  }
};

const getStatusStyle = (status: string) => {
  const normalized = status?.toLowerCase() || '';
  if (normalized.includes('active') || normalized.includes('progress')) {
    return { bg: 'bg-emerald-500/10', text: 'text-emerald-600', dot: 'bg-emerald-500' };
  }
  if (normalized.includes('pilot') || normalized.includes('poc')) {
    return { bg: 'bg-amber-500/10', text: 'text-amber-600', dot: 'bg-amber-500' };
  }
  if (normalized.includes('planned') || normalized.includes('future')) {
    return { bg: 'bg-blue-500/10', text: 'text-blue-600', dot: 'bg-blue-500' };
  }
  return { bg: 'bg-accent/10', text: 'text-accent', dot: 'bg-accent' };
};

export const AIUseCasesSlide = () => {
  const { data } = useAccountData();
  const { generatedPlan, basics } = data;

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
    <div className="h-full overflow-auto p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/20 flex items-center justify-center shadow-lg">
            <Cpu className="w-7 h-7 text-accent" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-foreground">AI-Led Use Case Portfolio</h1>
            <p className="text-muted-foreground text-lg">
              {basics.accountName ? `Priority AI use cases aligned to ${basics.accountName}'s AI-first strategy` : "Priority AI use cases aligned to customer AI-first strategy"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RegenerateSectionButton section="aiUseCases" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
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
          <div className="grid grid-cols-2 gap-5">
            {useCases.map((uc, i) => {
              const impact = getImpactLevel(uc.priority);
              const statusStyle = getStatusStyle(uc.status);
              const IconComponent = uc.icon;
              
              return (
                <div 
                  key={uc.title} 
                  className="glass-card p-0 opacity-0 animate-fade-in overflow-hidden group hover:shadow-xl transition-all duration-300" 
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Card Header with Icon and Status */}
                  <div className="flex items-start justify-between p-5 pb-3">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <IconComponent className="w-7 h-7 text-accent" />
                      </div>
                      <div className="flex-1 pt-1">
                        <h3 className="font-bold text-lg text-foreground leading-tight mb-1">{uc.title}</h3>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusStyle.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} animate-pulse`} />
                          <span className={`text-xs font-medium ${statusStyle.text}`}>{uc.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="px-5 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{uc.description}</p>
                  </div>

                  {/* Metrics Row */}
                  <div className="px-5 pb-4 grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/30">
                      <Target className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Priority</p>
                        <p className={`text-xs font-bold ${impact.color}`}>{uc.priority}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/30">
                      <TrendingUp className="w-4 h-4 text-accent" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Impact</p>
                        <p className={`text-xs font-bold ${impact.color}`}>{impact.label}</p>
                      </div>
                    </div>
                  </div>

                  {/* Impact Progress Bar */}
                  <div className="px-5 pb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Business Value Score</span>
                      <span className={`text-xs font-bold ${impact.color}`}>
                        {uc.priority === 'High' ? '85-100%' : uc.priority === 'Medium' ? '60-84%' : '40-59%'}
                      </span>
                    </div>
                    <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                      <div className={`h-full ${impact.barWidth} bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500`} />
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-3 bg-muted/20 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs">AI-Recommended</span>
                    </div>
                    <div className="flex items-center gap-1 text-accent text-xs font-medium group-hover:gap-2 transition-all">
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
