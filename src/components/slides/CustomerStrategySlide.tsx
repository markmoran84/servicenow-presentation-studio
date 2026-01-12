import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { Sparkles, ArrowRight, CheckCircle, AlertCircle, Target, Zap, Bot } from "lucide-react";

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  blue: { bg: "bg-blue-500/20", border: "border-blue-500/40", text: "text-blue-300" },
  emerald: { bg: "bg-emerald-500/20", border: "border-emerald-500/40", text: "text-emerald-300" },
  amber: { bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-300" },
  cyan: { bg: "bg-cyan-500/20", border: "border-cyan-500/40", text: "text-cyan-300" },
  indigo: { bg: "bg-indigo-500/20", border: "border-indigo-500/40", text: "text-indigo-300" },
  purple: { bg: "bg-purple-500/20", border: "border-purple-500/40", text: "text-purple-300" },
  rose: { bg: "bg-rose-500/20", border: "border-rose-500/40", text: "text-rose-300" },
};

const taskColors: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-600/90", text: "text-white" },
  emerald: { bg: "bg-emerald-600/90", text: "text-white" },
  amber: { bg: "bg-amber-600/90", text: "text-white" },
  cyan: { bg: "bg-cyan-600/90", text: "text-white" },
};

export const CustomerStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, generatedPlan } = data;

  // AI-generated synthesis
  const synthesis = generatedPlan?.customerStrategySynthesis;
  const accentColor = synthesis?.accentColor || "emerald";
  const palette = colorMap[accentColor] || colorMap.emerald;
  
  // New Strategic Imperatives format
  const purpose = synthesis?.purpose;
  const longerTermAims = synthesis?.longerTermAims || [];
  const annualTasks = synthesis?.annualTasks || [];
  const objectives = synthesis?.objectives || [];
  const serviceNowAlignment = synthesis?.serviceNowAlignment || [];
  
  // Legacy format fallback
  const strategicPillars = synthesis?.strategicPillars || [];
  
  // Check if we have new format vs legacy
  const hasNewFormat = purpose || longerTermAims.length > 0 || annualTasks.length > 0;
  const isAIGenerated = hasNewFormat || strategicPillars.length > 0;

  // Fallback to raw input data if no AI synthesis
  const normalizeKey = (s: { title?: string; description?: string }) =>
    `${(s.title ?? "").trim().toLowerCase().replace(/\s+/g, " ")}||${(s.description ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")}`;

  const dedupeItems = (items: { title?: string; description?: string }[]) => {
    const seen = new Set<string>();
    return items.filter((it) => {
      const key = normalizeKey(it);
      if (key === "||") return false;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const corporate = dedupeItems((strategy.corporateStrategy ?? []).filter(
    (s) => (s.title || "").trim().length > 0 || (s.description || "").trim().length > 0,
  ));

  const digitalRaw = dedupeItems((strategy.digitalStrategies ?? []).filter(
    (s) => (s.title || "").trim().length > 0 || (s.description || "").trim().length > 0,
  ));

  const corporateKeys = new Set(corporate.map(normalizeKey));
  const digital = digitalRaw.filter((s) => !corporateKeys.has(normalizeKey(s)));

  const hasData = isAIGenerated || corporate.length > 0 || digital.length > 0;

  // Group objectives by task index
  const objectivesByTask = annualTasks.map((_, taskIdx) => 
    objectives.filter(obj => obj.taskIndex === taskIdx)
  );

  // Render Strategic Imperatives Canvas (new format)
  const renderStrategicImperatives = () => (
    <div className="space-y-6">
      {/* Purpose Banner */}
      {purpose && (
        <div className="glass-card p-4 bg-gradient-to-r from-slate-700/50 to-slate-600/30 border border-slate-500/30 opacity-0 animate-fade-in">
          <p className="text-sm text-muted-foreground mb-1 font-medium">Our Purpose...</p>
          <p className="text-xl font-semibold text-foreground text-center py-2">
            {purpose}
          </p>
        </div>
      )}

      {/* Longer-term Aims Section */}
      {longerTermAims.length > 0 && (
        <div className="opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <p className="text-sm text-muted-foreground mb-3 font-medium">Our longer-term ambitions – From the Annual Report</p>
          <div className="glass-card p-5 bg-gradient-to-r from-cyan-900/30 to-teal-900/20 border border-cyan-500/20">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {longerTermAims.map((aim, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-0.5 text-lg">•</span>
                  <div>
                    <p className="text-foreground font-semibold leading-snug">{aim.title}</p>
                    {aim.description && (
                      <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{aim.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Annual Tasks Section */}
      {annualTasks.length > 0 && (
        <div className="opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <p className="text-sm text-muted-foreground mb-3 font-medium">Our Tasks for FY – We must...</p>
          <div className="grid grid-cols-4 gap-3">
            {annualTasks.map((task, idx) => {
              const colors = taskColors[task.color] || taskColors.blue;
              return (
                <div 
                  key={idx} 
                  className={`${colors.bg} ${colors.text} rounded-lg p-4 text-left`}
                >
                  <p className="font-semibold text-sm leading-tight mb-1">{task.title}</p>
                  {task.description && (
                    <p className="text-xs opacity-90 leading-snug">{task.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Objectives Grid */}
      {objectives.length > 0 && (
        <div className="opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <p className="text-sm text-muted-foreground mb-3 font-medium">Our Objectives for FY – We will...</p>
          <div className="grid grid-cols-4 gap-3">
            {annualTasks.map((task, taskIdx) => {
              const taskObjs = objectivesByTask[taskIdx] || [];
              return (
                <div key={taskIdx} className="space-y-2">
                  {taskObjs.map((obj, objIdx) => (
                    <div 
                      key={objIdx}
                      className="glass-card p-3 bg-slate-800/50 border border-slate-600/30 text-sm"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-foreground font-medium flex-1 leading-tight">
                          {obj.title}
                        </span>
                        {obj.isAIEnabled && (
                          <Bot className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        )}
                      </div>
                      {obj.detail && (
                        <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                          {obj.detail}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          
          {/* AI-spanning objectives (objectives that span multiple columns) */}
          {objectives.filter(obj => obj.isAIEnabled && obj.taskIndex === -1).length > 0 && (
            <div className="mt-3 space-y-2">
              {objectives.filter(obj => obj.isAIEnabled && obj.taskIndex === -1).map((obj, idx) => (
                <div 
                  key={idx}
                  className="glass-card p-3 bg-emerald-900/20 border border-emerald-500/30 text-sm flex items-center gap-2"
                >
                  <Bot className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-foreground font-medium">{obj.title}</span>
                  {obj.detail && (
                    <span className="text-muted-foreground">– {obj.detail}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ServiceNow Alignment Section */}
      {serviceNowAlignment.length > 0 && (
        <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">ServiceNow Enablement</h2>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${palette.bg} ${palette.text}`}>
              Platform Alignment
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {serviceNowAlignment.slice(0, 4).map((alignment, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg bg-secondary/30 border ${palette.border}`}
              >
                <p className="text-muted-foreground text-sm mb-2">{alignment.customerPriority}</p>
                <div className="flex items-center gap-2">
                  <ArrowRight className={`w-3 h-3 ${palette.text} flex-shrink-0`} />
                  <p className="text-foreground font-medium text-sm">{alignment.serviceNowValue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Render Legacy Pillars (old format)
  const renderLegacyPillars = () => (
    <div className="grid grid-cols-2 gap-6 mb-8">
      {strategicPillars.map((pillar, index) => (
        <div 
          key={index} 
          className={`glass-card p-6 bg-gradient-to-br ${palette.bg} opacity-0 animate-fade-in`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center flex-shrink-0">
              <Target className={`w-6 h-6 ${palette.text}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground leading-tight mb-1">
                {pillar.headline}
              </h3>
              <p className={`text-lg font-medium ${palette.text} mb-3`}>
                {pillar.subtitle}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {pillar.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Render raw fallback data
  const renderFallbackData = () => (
    <div className="grid grid-cols-2 gap-6 mb-8">
      {corporate.map((item, index) => (
        <div 
          key={`corp-${index}`} 
          className="glass-card p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 opacity-0 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-foreground leading-tight">
                  {item.title}
                </h3>
                {(item as any).confidence && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-medium ${
                    (item as any).confidence === 'explicit' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {(item as any).confidence === 'explicit' ? 'Explicit' : 'Derived'}
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                  {item.description}
                </p>
              )}
              {(item as any).sourceReference && (
                <p className="text-[11px] text-muted-foreground/60 italic">
                  Source: {(item as any).sourceReference}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
      {digital.map((item, index) => (
        <div 
          key={`dig-${index}`} 
          className="glass-card p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 opacity-0 animate-fade-in"
          style={{ animationDelay: `${(corporate.length + index) * 100}ms` }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-foreground leading-tight">
                  {item.title}
                </h3>
                {(item as any).confidence && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-medium ${
                    (item as any).confidence === 'explicit' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {(item as any).confidence === 'explicit' ? 'Explicit' : 'Derived'}
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                  {item.description}
                </p>
              )}
              {(item as any).sourceReference && (
                <p className="text-[11px] text-muted-foreground/60 italic">
                  Source: {(item as any).sourceReference}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
            {basics.accountName ? `${basics.accountName} Strategic Imperatives` : "Customer Strategy"}
          </h1>
          <div className="flex items-center gap-2">
            <RegenerateSectionButton section="customerStrategySynthesis" label="Generate with AI" />
            {isAIGenerated && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
                <Sparkles className="w-3 h-3" />
                AI Synthesized
              </span>
            )}
          </div>
        </div>

        {!hasData ? (
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in">
            <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Strategy Data</h3>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
              Upload an annual report or click "Generate with AI" to create a Strategic Imperatives canvas.
            </p>
          </div>
        ) : (
          <>
            {/* Render based on format */}
            {hasNewFormat ? (
              renderStrategicImperatives()
            ) : strategicPillars.length > 0 ? (
              renderLegacyPillars()
            ) : (
              renderFallbackData()
            )}

            {/* Legacy narrative section - only show for old format */}
            {!hasNewFormat && synthesis?.narrative && (
              <div className="glass-card p-6 mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
                <p className="text-muted-foreground leading-relaxed italic">
                  "{synthesis.narrative}"
                </p>
              </div>
            )}

            {/* Status Bar */}
            <div className="glass-card p-4 flex items-center justify-between mt-6">
              <span className="text-sm text-muted-foreground">
                {basics.accountName} strategic priorities {hasNewFormat ? 'translated to execution canvas' : 'extracted from annual report'}
              </span>
              <div className={`flex items-center gap-2 ${palette.text}`}>
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Strategy Mapped</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
