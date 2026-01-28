import { useAccountData } from "@/context/AccountDataContext";
import { 
  FileText, Target, Lightbulb, Users, TrendingUp, 
  CheckCircle, AlertCircle, ChevronDown, ChevronUp,
  Building2, Compass, Sparkles
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  items: { label: string; value: string | string[] | undefined }[];
  color: string;
  defaultOpen?: boolean;
}

const CollapsibleSection = ({ title, icon, items, color, defaultOpen = false }: SectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const hasData = items.some(item => 
    item.value && (typeof item.value === 'string' ? item.value.trim() : item.value.length > 0)
  );

  return (
    <div className={cn(
      "border rounded-lg overflow-hidden transition-all",
      hasData ? `border-${color}/30 bg-${color}/5` : "border-border/50 bg-muted/30"
    )}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-sm text-foreground">{title}</span>
          {hasData ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-muted-foreground/50" />
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-3 pb-3 space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="text-sm">
              <span className="text-muted-foreground">{item.label}: </span>
              {item.value ? (
                typeof item.value === 'string' ? (
                  <span className="text-foreground">{item.value}</span>
                ) : item.value.length > 0 ? (
                  <ul className="mt-1 ml-4 space-y-1">
                    {item.value.slice(0, 5).map((v, i) => (
                      <li key={i} className="text-foreground text-xs flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {v}
                      </li>
                    ))}
                    {item.value.length > 5 && (
                      <li className="text-muted-foreground text-xs">
                        +{item.value.length - 5} more...
                      </li>
                    )}
                  </ul>
                ) : (
                  <span className="text-muted-foreground italic">Not extracted</span>
                )
              ) : (
                <span className="text-muted-foreground italic">Not extracted</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ExtractedDataPreview = () => {
  const { data } = useAccountData();
  const { basics, strategy, annualReport, painPoints, opportunities, swot, engagement } = data;

  const hasAnyData = basics.accountName || 
    annualReport.executiveSummaryNarrative || 
    strategy.corporateStrategy?.length > 0 ||
    painPoints.painPoints?.length > 0;

  if (!hasAnyData) {
    return null;
  }

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-foreground">Extracted Data Preview</h3>
        <span className="text-xs text-muted-foreground ml-auto">
          From Annual Report Analysis
        </span>
      </div>

      {/* Company Overview */}
      <CollapsibleSection
        title="Company Overview"
        icon={<Building2 className="w-4 h-4 text-primary" />}
        color="primary"
        defaultOpen={true}
        items={[
          { label: "Company", value: basics.accountName },
          { label: "Industry", value: basics.industry },
          { label: "Summary", value: annualReport.executiveSummaryNarrative },
        ]}
      />

      {/* Vision & Purpose */}
      <CollapsibleSection
        title="Vision & Purpose"
        icon={<Compass className="w-4 h-4 text-cyan-500" />}
        color="cyan"
        items={[
          { label: "Vision", value: annualReport.visionStatement || basics.visionStatement },
          { label: "Purpose", value: annualReport.purposeStatement },
          { label: "Long-term Aims", value: annualReport.longTermAims },
        ]}
      />

      {/* Corporate Strategy */}
      <CollapsibleSection
        title="Corporate Strategy"
        icon={<Target className="w-4 h-4 text-emerald-500" />}
        color="emerald"
        items={[
          { label: "Strategic Pillars", value: strategy.corporateStrategy?.map(s => s.title) },
          { label: "CEO Priorities", value: strategy.ceoBoardPriorities?.map(s => s.title) },
        ]}
      />

      {/* Digital & Transformation */}
      <CollapsibleSection
        title="Digital Transformation"
        icon={<Lightbulb className="w-4 h-4 text-purple-500" />}
        color="purple"
        items={[
          { label: "Digital Strategies", value: strategy.digitalStrategies?.map(s => s.title) },
          { label: "Transformation Themes", value: strategy.transformationThemes?.map(s => s.title) },
        ]}
      />

      {/* Pain Points & Opportunities */}
      <CollapsibleSection
        title="Pain Points & Opportunities"
        icon={<TrendingUp className="w-4 h-4 text-amber-500" />}
        color="amber"
        items={[
          { label: "Pain Points", value: painPoints.painPoints?.map(p => p.title) },
          { label: "Opportunities", value: opportunities.opportunities?.map(o => o.title) },
        ]}
      />

      {/* Financials */}
      <CollapsibleSection
        title="Financial Highlights"
        icon={<FileText className="w-4 h-4 text-blue-500" />}
        color="blue"
        items={[
          { label: "Revenue", value: annualReport.revenue },
          { label: "Growth Rate", value: data.financial.growthRate },
          { label: "Net Zero Target", value: annualReport.netZeroTarget },
          { label: "Achievements", value: annualReport.strategicAchievements },
        ]}
      />

      {/* Executives */}
      <CollapsibleSection
        title="Key Executives"
        icon={<Users className="w-4 h-4 text-rose-500" />}
        color="rose"
        items={[
          { label: "Executive Sponsors", value: engagement.knownExecutiveSponsors },
        ]}
      />

      {/* SWOT */}
      <CollapsibleSection
        title="SWOT Analysis"
        icon={<Target className="w-4 h-4 text-indigo-500" />}
        color="indigo"
        items={[
          { label: "Strengths", value: swot.strengths?.slice(0, 3) },
          { label: "Weaknesses", value: swot.weaknesses?.slice(0, 3) },
          { label: "Opportunities", value: swot.opportunities?.slice(0, 3) },
          { label: "Threats", value: swot.threats?.slice(0, 3) },
        ]}
      />
    </div>
  );
};