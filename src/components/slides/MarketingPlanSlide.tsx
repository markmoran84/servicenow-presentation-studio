import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { SectionHeader } from "@/components/SectionHeader";
import { Calendar, Megaphone, Target, Info, Sparkles } from "lucide-react";

export const MarketingPlanSlide = () => {
  const { data } = useAccountData();
  const { generatedPlan, basics } = data;
  const companyName = basics.accountName || "the customer";

  // Use AI-generated marketing plan if available
  const marketingPlan = generatedPlan?.marketingPlan;
  const isAIGenerated = !!marketingPlan;

  const campaigns = marketingPlan?.campaigns || [];
  const narrative = marketingPlan?.narrative || "";

  const hasContent = campaigns.length > 0 || narrative;

  return (
    <div className="px-8 pt-6 pb-32">
      <div className="flex items-center justify-between mb-6 opacity-0 animate-fade-in">
        <div className="flex items-center gap-3">
          <Megaphone className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">Marketing Plan</h1>
        </div>
        <div className="flex items-center gap-2">
          <RegenerateSectionButton section="marketingPlan" />
          {isAIGenerated && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
              <Sparkles className="w-3 h-3" />
              AI Generated
            </span>
          )}
        </div>
      </div>

      {hasContent ? (
        <>
          {/* Narrative */}
          {narrative && (
            <div className="glass-card p-6 mb-6 border-l-4 border-l-primary opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <p className="text-foreground/90">{narrative}</p>
            </div>
          )}

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {campaigns.map((campaign, index) => (
              <div
                key={campaign.title}
                className="glass-card p-6 opacity-0 animate-fade-in"
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">{campaign.title}</h3>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="w-3 h-3" />
                  <span>{campaign.timeline}</span>
                </div>

                {campaign.channels && campaign.channels.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {campaign.channels.map((channel, chIndex) => (
                      <span 
                        key={chIndex}
                        className="text-xs px-2 py-1 rounded-full bg-secondary text-foreground/80"
                      >
                        {channel}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Marketing Plan Generated</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Complete the Input Form with account details and click <span className="font-medium text-foreground">Generate with AI</span> to create a comprehensive marketing plan tailored to {companyName}.
          </p>
        </div>
      )}
    </div>
  );
};
