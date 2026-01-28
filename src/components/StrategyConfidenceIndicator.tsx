import { CheckCircle2, AlertCircle, Info, Database, FileText, Users, Target, TrendingUp, Shield, Lightbulb, Building2, BarChart3 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { StrategyMetadata } from "@/context/AccountDataContext";

interface StrategyConfidenceIndicatorProps {
  metadata?: StrategyMetadata;
}

const sourceIcons: Record<string, React.ElementType> = {
  "Annual Report": FileText,
  "CEO/Board Priorities": Target,
  "Transformation Themes": TrendingUp,
  "Digital Strategies": Lightbulb,
  "Corporate Strategy": Building2,
  "Pain Points": AlertCircle,
  "Opportunities": CheckCircle2,
  "SWOT Analysis": Shield,
  "Financial Context": BarChart3,
  "Executive Sponsors": Users,
};

export const StrategyConfidenceIndicator = ({ metadata }: StrategyConfidenceIndicatorProps) => {
  if (!metadata) return null;

  const { dataSources, confidenceScore, generatedAt } = metadata;

  const getConfidenceLevel = (score: number) => {
    if (score >= 70) return { label: "High", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30" };
    if (score >= 40) return { label: "Medium", color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30" };
    return { label: "Low", color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30" };
  };

  const confidence = getConfidenceLevel(confidenceScore);
  const formattedDate = new Date(generatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-3">
        {/* Confidence Score Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Data Sources</span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${confidence.bg} ${confidence.border} border cursor-help`}>
                <div className={`w-2 h-2 rounded-full ${confidence.color.replace("text-", "bg-")} animate-pulse`} />
                <span className={`text-xs font-semibold ${confidence.color}`}>
                  {confidenceScore}% {confidence.label}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <p className="text-xs">
                Strategy confidence based on available data sources. Higher scores indicate more comprehensive context for AI generation.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Data Sources Grid */}
        <div className="flex flex-wrap gap-1.5">
          {dataSources.map((source) => {
            const IconComponent = sourceIcons[source] || Info;
            return (
              <Tooltip key={source}>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-xs font-medium text-primary cursor-help">
                    <IconComponent className="w-3 h-3" />
                    <span>{source}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Used in strategy generation</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Generated Timestamp */}
        <p className="text-[10px] text-muted-foreground">
          Generated {formattedDate}
        </p>
      </div>
    </TooltipProvider>
  );
};
