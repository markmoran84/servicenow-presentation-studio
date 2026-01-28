import { useAccountData } from "@/context/AccountDataContext";
import { 
  Users, 
  Cog, 
  Package, 
  Heart, 
  Handshake, 
  Truck, 
  Target, 
  DollarSign, 
  TrendingUp,
  Info,
  Swords
} from "lucide-react";

export const BusinessCanvasSlide = () => {
  const { data } = useAccountData();
  const { businessModel, basics } = data;
  const companyName = basics.accountName || "Customer";

  const hasContent = 
    businessModel.keyPartners.length > 0 ||
    businessModel.keyActivities.length > 0 ||
    businessModel.keyResources.length > 0 ||
    businessModel.valueProposition.length > 0 ||
    businessModel.customerRelationships.length > 0 ||
    businessModel.channels.length > 0 ||
    businessModel.customerSegments.length > 0 ||
    businessModel.costStructure.length > 0 ||
    businessModel.revenueStreams.length > 0;

  const canvasBlocks = [
    {
      title: "Key Partners",
      icon: Handshake,
      items: businessModel.keyPartners,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      gridArea: "partners",
    },
    {
      title: "Key Activities",
      icon: Cog,
      items: businessModel.keyActivities,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      gridArea: "activities",
    },
    {
      title: "Key Resources",
      icon: Package,
      items: businessModel.keyResources,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/30",
      gridArea: "resources",
    },
    {
      title: "Value Proposition",
      icon: Heart,
      items: businessModel.valueProposition,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
      gridArea: "value",
    },
    {
      title: "Customer Relationships",
      icon: Users,
      items: businessModel.customerRelationships,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30",
      gridArea: "relationships",
    },
    {
      title: "Channels",
      icon: Truck,
      items: businessModel.channels,
      color: "text-teal-400",
      bgColor: "bg-teal-500/10",
      borderColor: "border-teal-500/30",
      gridArea: "channels",
    },
    {
      title: "Customer Segments",
      icon: Target,
      items: businessModel.customerSegments,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      gridArea: "segments",
    },
    {
      title: "Cost Structure",
      icon: DollarSign,
      items: businessModel.costStructure,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      gridArea: "costs",
    },
    {
      title: "Revenue Streams",
      icon: TrendingUp,
      items: businessModel.revenueStreams,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      gridArea: "revenue",
    },
  ];

  return (
    <div className="min-h-screen p-8 pb-32">
      {/* Header */}
      <div className="mb-6 opacity-0 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">Business Model Canvas</h1>
        <p className="text-muted-foreground mt-1">Understanding {companyName}'s business model</p>
      </div>

      {hasContent ? (
        <div className="opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          {/* Canvas Grid - Traditional BMC Layout */}
          <div 
            className="grid gap-3"
            style={{
              gridTemplateColumns: "repeat(5, 1fr)",
              gridTemplateRows: "repeat(3, auto)",
              gridTemplateAreas: `
                "partners activities value relationships segments"
                "partners resources value channels segments"
                "costs costs costs revenue revenue"
              `,
            }}
          >
            {canvasBlocks.map((block, index) => {
              const Icon = block.icon;
              return (
                <div
                  key={block.title}
                  className={`glass-card p-4 ${block.bgColor} border ${block.borderColor} opacity-0 animate-fade-in`}
                  style={{ 
                    gridArea: block.gridArea,
                    animationDelay: `${150 + index * 50}ms`
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className={`w-4 h-4 ${block.color}`} />
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${block.color}`}>
                      {block.title}
                    </h3>
                  </div>
                  
                  {block.items.length > 0 ? (
                    <ul className="space-y-1.5">
                      {block.items.slice(0, 5).map((item, i) => (
                        <li key={i} className="text-xs text-foreground/90 flex items-start gap-2">
                          <span className={`w-1 h-1 rounded-full ${block.color.replace('text-', 'bg-')} mt-1.5 flex-shrink-0`} />
                          <span>{item}</span>
                        </li>
                      ))}
                      {block.items.length > 5 && (
                        <li className="text-xs text-muted-foreground italic">
                          +{block.items.length - 5} more
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground/50 italic">Not defined</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Competitors Section */}
          {businessModel.competitors.length > 0 && (
            <div className="mt-4 glass-card p-4 opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
              <div className="flex items-center gap-2 mb-3">
                <Swords className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Competitive Landscape
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {businessModel.competitors.map((competitor, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs text-amber-400"
                  >
                    {competitor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Info className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Business Model Data</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Upload an annual report or use web enrichment to automatically populate the Business Model Canvas for {companyName}.
          </p>
        </div>
      )}
    </div>
  );
};