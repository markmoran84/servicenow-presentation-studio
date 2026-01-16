import { useAccountData } from "@/context/AccountDataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Loader2, 
  Building2, 
  Target, 
  Users, 
  DollarSign,
  CheckCircle2,
  AlertCircle,
  ChevronRight
} from "lucide-react";

interface ReviewStepProps {
  onGenerate: () => void;
  isGenerating: boolean;
}

export function ReviewStep({ onGenerate, isGenerating }: ReviewStepProps) {
  const { data } = useAccountData();

  // Calculate completeness
  const sections = [
    {
      name: "Company Info",
      icon: Building2,
      complete: !!data.basics.accountName && !!data.basics.industry,
      items: [
        { label: "Company Name", value: data.basics.accountName, required: true },
        { label: "Industry", value: data.basics.industry },
        { label: "Region", value: data.basics.region },
        { label: "Tier", value: data.basics.tier },
      ]
    },
    {
      name: "Financials",
      icon: DollarSign,
      complete: !!data.basics.currentContractValue || !!data.basics.nextFYAmbition,
      items: [
        { label: "Current ACV", value: data.basics.currentContractValue },
        { label: "Next FY Target", value: data.basics.nextFYAmbition },
        { label: "3-Year Ambition", value: data.basics.threeYearAmbition },
      ]
    },
    {
      name: "Strategy",
      icon: Target,
      complete: (data.strategy?.corporateStrategy?.length || 0) > 0 || 
                (data.opportunities?.opportunities?.length || 0) > 0,
      items: [
        { label: "Strategic Priorities", value: `${data.strategy?.corporateStrategy?.length || 0} items` },
        { label: "Opportunities", value: `${data.opportunities?.opportunities?.length || 0} items` },
        { label: "Challenges", value: `${data.painPoints?.painPoints?.length || 0} items` },
      ]
    },
    {
      name: "Team",
      icon: Users,
      complete: (data.basics.coreTeamMembers?.length || 0) > 0,
      items: [
        { label: "Team Members", value: `${data.basics.coreTeamMembers?.length || 0} people` },
        { label: "Key Executives", value: `${data.accountStrategy?.keyExecutives?.length || 0} people` },
      ]
    },
  ];

  const completedSections = sections.filter(s => s.complete).length;
  const canGenerate = !!data.basics.accountName;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-3">Review & Generate</h2>
        <p className="text-lg text-muted-foreground">
          Review your information before generating your account plan. 
          AI will fill in gaps and enhance your content.
        </p>
      </div>

      {/* Readiness Indicator */}
      <Card className="glass-card border-primary/20 max-w-xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                canGenerate ? 'bg-primary/20' : 'bg-amber-500/20'
              }`}>
                {canGenerate ? (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-500" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">
                  {canGenerate ? 'Ready to Generate' : 'Missing Required Info'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {completedSections} of {sections.length} sections completed
                </p>
              </div>
            </div>
            <Badge variant={canGenerate ? "default" : "secondary"}>
              {Math.round((completedSections / sections.length) * 100)}% Complete
            </Badge>
          </div>

          {!canGenerate && (
            <p className="text-sm text-amber-500 bg-amber-500/10 rounded-lg p-3">
              Please add at least a company name to generate your plan.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Section Summary */}
      <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {sections.map((section) => (
          <Card 
            key={section.name} 
            className={`glass-card ${section.complete ? 'border-primary/20' : 'border-border/30'}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  section.complete ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  <section.icon className="w-4 h-4" />
                </div>
                <span className="font-medium">{section.name}</span>
                {section.complete && (
                  <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
                )}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className={item.value ? 'text-foreground' : 'text-muted-foreground/50'}>
                      {item.value || '—'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generate CTA */}
      <div className="text-center space-y-4">
        <Button 
          onClick={onGenerate} 
          disabled={isGenerating || !canGenerate}
          size="lg"
          className="gap-3 h-14 px-8 text-lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Your Plan...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Account Plan
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </Button>
        
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          AI will create a comprehensive 20+ slide presentation with strategic insights, 
          recommendations, and talking points tailored to your account.
        </p>
      </div>
    </div>
  );
}
