import { useAccountData } from "@/context/AccountDataContext";
import { RegenerateSectionButton } from "@/components/RegenerateSectionButton";
import { SectionHeader } from "@/components/SectionHeader";
import { UserCircle, Lightbulb, MessageSquare, Calendar, Star, ArrowUpRight, Info, Sparkles } from "lucide-react";

export const MarketingPlanSlide = () => {
  const { data } = useAccountData();
  const { generatedPlan, basics } = data;
  const companyName = basics.accountName || "the customer";

  // Use AI-generated marketing plan if available
  const marketingPlan = generatedPlan?.marketingPlan;
  const isAIGenerated = !!marketingPlan;

  const executiveEngagements = marketingPlan?.executiveEngagements || [];
  const thoughtLeadership = marketingPlan?.thoughtLeadership || [];
  const strategicNarratives = marketingPlan?.strategicNarratives || [];

  const hasContent = executiveEngagements.length > 0 || thoughtLeadership.length > 0 || strategicNarratives.length > 0;

  const iconMap: Record<string, typeof Lightbulb> = {
    lightbulb: Lightbulb,
    messagesquare: MessageSquare,
    star: Star,
  };

  return (
    <div className="px-8 pt-6 pb-32">
      <div className="flex items-center justify-between mb-6 opacity-0 animate-fade-in">
        <h1 className="text-4xl font-bold text-foreground">Marketing Plan</h1>
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
        <div className="grid grid-cols-3 gap-6">
          {/* Executive Engagement */}
          <div className="glass-card rounded-2xl p-5">
            <SectionHeader
              title="Executive Engagement"
              description={`Structured touchpoints with ${companyName} leadership`}
              delay={100}
            />

            <div className="mt-5 space-y-3">
              {executiveEngagements.length > 0 ? executiveEngagements.map((engagement, index) => (
                <div
                  key={engagement.title}
                  className="bg-card/50 rounded-xl p-3 border border-border/50 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground text-sm">{engagement.title}</h4>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      {engagement.frequency}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{engagement.objective}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {engagement.format}
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No executive engagements defined.</p>
              )}
            </div>
          </div>

          {/* Thought Leadership */}
          <div className="glass-card rounded-2xl p-5">
            <SectionHeader
              title="Thought Leadership"
              description="Content and assets to reinforce positioning"
              delay={150}
            />

            <div className="mt-5 space-y-3">
              {thoughtLeadership.length > 0 ? thoughtLeadership.map((item, index) => {
                const IconComponent = iconMap[item.icon?.toLowerCase()] || Lightbulb;
                return (
                  <div
                    key={item.title}
                    className="bg-card/50 rounded-xl p-3 border border-border/50 opacity-0 animate-fade-in hover:border-primary/30 transition-all"
                    style={{ animationDelay: `${300 + index * 100}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mb-1">{item.narrative}</p>
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <ArrowUpRight className="w-3 h-3" />
                          {item.deliverable}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-sm text-muted-foreground">No thought leadership defined.</p>
              )}
            </div>
          </div>

          {/* Strategic Narratives */}
          <div className="glass-card rounded-2xl p-5">
            <SectionHeader
              title="Strategic Narratives"
              description={`Core messages for all ${companyName} communications`}
              delay={200}
            />

            <div className="mt-5 space-y-3">
              {strategicNarratives.length > 0 ? strategicNarratives.map((narrative, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-r from-primary/10 to-transparent rounded-xl border-l-4 border-primary opacity-0 animate-fade-in"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <p className="text-sm text-foreground leading-relaxed">{narrative}</p>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No strategic narratives defined.</p>
              )}
            </div>

            <div className="mt-5 p-3 bg-secondary/30 rounded-xl border border-border/30 opacity-0 animate-fade-in" style={{ animationDelay: "800ms" }}>
              <div className="flex items-center gap-2 mb-1">
                <UserCircle className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">Tone & Voice</span>
              </div>
              <p className="text-xs text-muted-foreground">
                SVP / Board-ready. Clear, calm, confident. Outcomes over activities. Value over features.
              </p>
            </div>
          </div>
        </div>
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
