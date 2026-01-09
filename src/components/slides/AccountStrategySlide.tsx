import { useAccountData } from "@/context/AccountDataContext";
import { 
  Compass, 
  Target, 
  Lightbulb, 
  ArrowRight, 
  Sparkles,
  TrendingUp,
  Zap,
  Clock,
  FileText,
  Building2,
  Cpu
} from "lucide-react";

// Strategic alignment mapping - connects our opportunities to customer context
interface StrategicAlignment {
  opportunity: { title: string; description: string };
  customerContext: {
    source: "corporate" | "digital" | "ceo" | "annual_report";
    sourceLabel: string;
    title: string;
    description: string;
  };
  whyNow: string;
  narrative: string;
}

export const AccountStrategySlide = () => {
  const { data } = useAccountData();
  const { basics, strategy, opportunities, annualReport, accountStrategy } = data;

  // Build intelligent alignments by matching opportunities to the most relevant customer context
  const buildAlignments = (): StrategicAlignment[] => {
    const opps = opportunities.opportunities.slice(0, 4);
    
    // Gather all customer context sources
    const contextSources = [
      ...strategy.corporateStrategy.map(s => ({ ...s, source: "corporate" as const, sourceLabel: "Corporate Strategy" })),
      ...strategy.digitalStrategies.map(s => ({ ...s, source: "digital" as const, sourceLabel: "Digital Strategy" })),
      ...strategy.ceoBoardPriorities.map(s => ({ ...s, source: "ceo" as const, sourceLabel: "CEO/Board Priority" })),
    ];

    // Keywords for intelligent matching
    const keywordMatches: Record<string, string[]> = {
      "ai": ["ai", "artificial", "intelligence", "automation", "predictive", "machine learning"],
      "customer": ["customer", "experience", "cx", "nps", "service", "satisfaction"],
      "platform": ["platform", "consolidation", "unified", "integration", "fragmented", "applications"],
      "cost": ["cost", "efficiency", "optimize", "reduce", "savings", "productivity"],
      "operations": ["operations", "operational", "workflow", "process", "resilience"],
    };

    const findBestMatch = (oppTitle: string, oppDesc: string) => {
      const oppText = `${oppTitle} ${oppDesc}`.toLowerCase();
      let bestMatch = contextSources[0];
      let bestScore = 0;

      contextSources.forEach(ctx => {
        const ctxText = `${ctx.title} ${ctx.description}`.toLowerCase();
        let score = 0;

        // Check keyword category matches
        Object.values(keywordMatches).forEach(keywords => {
          const oppHasKeyword = keywords.some(k => oppText.includes(k));
          const ctxHasKeyword = keywords.some(k => ctxText.includes(k));
          if (oppHasKeyword && ctxHasKeyword) score += 3;
        });

        // Direct word overlap bonus
        const oppWords = oppText.split(/\s+/);
        const ctxWords = new Set(ctxText.split(/\s+/));
        oppWords.forEach(word => {
          if (word.length > 4 && ctxWords.has(word)) score += 1;
        });

        if (score > bestScore) {
          bestScore = score;
          bestMatch = ctx;
        }
      });

      return bestMatch;
    };

    // Generate "Why Now" based on annual report and context
    const generateWhyNow = (opp: { title: string; description: string }, ctx: { title: string; source: string }) => {
      const oppLower = opp.title.toLowerCase();
      
      if (oppLower.includes("ai") || oppLower.includes("automation")) {
        return `${basics.accountName.split(" ").pop()} has formally adopted an AI-first strategy with executive mandate. Their ${annualReport.ebitImprovement} EBIT improvement creates investment capacity for transformative initiatives.`;
      }
      if (oppLower.includes("customer") || oppLower.includes("service") || oppLower.includes("experience")) {
        return `With NPS improvement of 12 points YoY, momentum exists to accelerate customer experience transformation. Competitive pressure demands continued differentiation.`;
      }
      if (oppLower.includes("platform") || oppLower.includes("consolidation") || oppLower.includes("unified")) {
        return `700+ applications create operational friction and $15M+ in redundant costs. Platform consolidation is now a board-level priority with explicit CEO sponsorship.`;
      }
      if (oppLower.includes("cost") || oppLower.includes("efficiency") || oppLower.includes("optimize")) {
        return `Despite ${annualReport.revenue} revenue, cost discipline remains paramount. The $2B share buyback signals capital efficiency focus that operational improvements can support.`;
      }
      
      return `Strategic alignment with ${ctx.title} creates urgency. The ${annualReport.revenue} business requires scalable solutions that deliver measurable outcomes within FY26.`;
    };

    // Generate narrative connecting opportunity to customer context
    const generateNarrative = (opp: { title: string; description: string }, ctx: { title: string; description: string; source: string }) => {
      const sourceMap: Record<string, string> = {
        corporate: "core corporate strategy",
        digital: "digital transformation agenda",
        ceo: "CEO/Board priority",
      };
      
      return `Our ${opp.title.toLowerCase()} capability directly enables their ${sourceMap[ctx.source] || "strategic initiative"} of "${ctx.title}". This creates a compelling value story grounded in their stated objectives.`;
    };

    return opps.map(opp => {
      const match = findBestMatch(opp.title, opp.description);
      return {
        opportunity: opp,
        customerContext: {
          source: match.source,
          sourceLabel: match.sourceLabel,
          title: match.title,
          description: match.description,
        },
        whyNow: generateWhyNow(opp, match),
        narrative: generateNarrative(opp, match),
      };
    });
  };

  const alignments = buildAlignments();

  const sourceIcons: Record<string, typeof Building2> = {
    corporate: Building2,
    digital: Cpu,
    ceo: Target,
    annual_report: FileText,
  };

  const gradientColors = [
    { bg: "from-primary/20 to-primary/5", border: "border-primary/40", icon: "text-primary", glow: "shadow-primary/20", accent: "bg-primary" },
    { bg: "from-accent/20 to-accent/5", border: "border-accent/40", icon: "text-accent", glow: "shadow-accent/20", accent: "bg-accent" },
    { bg: "from-purple-500/20 to-purple-500/5", border: "border-purple-500/40", icon: "text-purple-400", glow: "shadow-purple-500/20", accent: "bg-purple-500" },
    { bg: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/40", icon: "text-amber-400", glow: "shadow-amber-500/20", accent: "bg-amber-500" },
  ];

  return (
    <div className="min-h-screen p-8 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="opacity-0 animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="badge-primary text-xs">FY26 Strategic Focus</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Account Strategy
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Our strategic opportunities aligned to {basics.accountName.split(" ").pop()}'s priorities — with context on why now
            </p>
          </div>
        </div>

        {/* Strategic Alignment Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {alignments.map((alignment, index) => {
            const style = gradientColors[index % gradientColors.length];
            const SourceIcon = sourceIcons[alignment.customerContext.source] || Target;
            
            return (
              <div
                key={alignment.opportunity.title}
                className="opacity-0 animate-fade-in"
                style={{ animationDelay: `${150 + index * 100}ms` }}
              >
                <div className={`glass-card rounded-2xl border ${style.border} overflow-hidden group hover:scale-[1.01] transition-all duration-300 shadow-lg ${style.glow}`}>
                  {/* Customer Context Header */}
                  <div className={`p-4 bg-gradient-to-r ${style.bg} border-b ${style.border}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl ${style.accent} flex items-center justify-center flex-shrink-0`}>
                        <SourceIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {alignment.customerContext.sourceLabel}
                          </span>
                        </div>
                        <h3 className="font-bold text-foreground text-sm leading-tight">
                          {alignment.customerContext.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {alignment.customerContext.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Connection Indicator */}
                  <div className="flex items-center justify-center py-2 bg-background/50">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${style.accent}`} />
                      <ArrowRight className={`w-4 h-4 ${style.icon}`} />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Enabled By
                      </span>
                      <ArrowRight className={`w-4 h-4 ${style.icon}`} />
                      <div className={`w-2 h-2 rounded-full ${style.accent}`} />
                    </div>
                  </div>

                  {/* Our Strategic Response */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className={`w-4 h-4 ${style.icon}`} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        Our Strategic Response
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground text-base mb-2 group-hover:text-primary transition-colors">
                      {alignment.opportunity.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      {alignment.opportunity.description}
                    </p>

                    {/* Why Now Section */}
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${style.bg} border ${style.border}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className={`w-3.5 h-3.5 ${style.icon}`} />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">
                          Why Now
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {alignment.whyNow}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Strategic Thesis Footer */}
        <div 
          className="mt-6 glass-card p-5 rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-0 animate-fade-in"
          style={{ animationDelay: "600ms" }}
        >
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-1">Strategic Thesis</h3>
              <p className="text-sm text-muted-foreground">
                {accountStrategy.strategyNarrative 
                  ? accountStrategy.strategyNarrative.split('.').slice(0, 2).join('.') + '.'
                  : `By directly aligning our capabilities to ${basics.accountName.split(" ").pop()}'s stated corporate and digital priorities, we create a defensible value proposition grounded in their strategic imperatives — not feature comparison.`
                }
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">{alignments.length}</span>
                <span className="text-xs text-muted-foreground block">Strategic Priorities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sparkle decoration */}
        <div className="absolute top-20 right-20 opacity-10 pointer-events-none">
          <Sparkles className="w-24 h-24 text-primary animate-pulse" />
        </div>
      </div>
    </div>
  );
};
