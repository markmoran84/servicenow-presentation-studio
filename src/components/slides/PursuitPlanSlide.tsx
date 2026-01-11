import { useAccountData } from "@/context/AccountDataContext";
import { 
  Rocket, Users, Search, Shield, FileText, 
  ArrowRight, CheckCircle2, Target, Lightbulb,
  Building2, Presentation, MessageSquare, Compass
} from "lucide-react";

export const PursuitPlanSlide = () => {
  const { data } = useAccountData();
  const { basics, accountStrategy, engagement, generatedPlan } = data;
  const companyName = basics.accountName || "the customer";

  // Build pursuit activities from data
  const bigBets = accountStrategy.bigBets || [];
  const keyWorkstreams = generatedPlan?.keyWorkstreams || [];
  const executives = engagement.knownExecutiveSponsors || [];
  const events = engagement.plannedExecutiveEvents || [];

  // Derive activities for each quadrant
  const executiveEngagementActivities = [
    ...executives.slice(0, 2).map(exec => `Executive connect: ${exec}`),
    ...events.slice(0, 2).map(event => event),
    ...(executives.length === 0 && events.length === 0 ? [
      "Executive connects (top-to-top alignment)",
      "EBC sessions (strategic briefings)",
      "Stakeholder mapping & influence plans"
    ] : [])
  ].slice(0, 4);

  const discoveryActivities = bigBets.length > 0 || keyWorkstreams.length > 0
    ? [
        "Business discovery sessions",
        ...bigBets.slice(0, 2).map(bet => `Value validation: ${bet.title}`),
        "Architecture & platform assessments"
      ].slice(0, 4)
    : [
        "Business discovery sessions",
        "Process deep-dives",
        "Value hypothesis validation",
        "Architecture assessments"
      ];

  const proofActivities = bigBets.length > 0
    ? bigBets.slice(0, 3).map(bet => `POV: ${bet.title}`)
    : [
        "Proof of Value pilots",
        "Targeted demos aligned to use cases",
        "AI & CX workshops",
        "Reference customer sessions"
      ];

  const narrativeActivities = [
    "Strategic POV development",
    "Business case shaping",
    "Vision & roadmap co-creation",
    `Alignment to ${companyName} strategy`
  ];

  // Calculate pursuit readiness score
  const hasExecutiveEngagement = executives.length > 0 || events.length > 0;
  const hasDiscovery = bigBets.length > 0 || keyWorkstreams.length > 0;
  const hasProof = bigBets.some(bet => bet.dealStatus === "Active Pursuit");
  const hasNarrative = accountStrategy.strategyNarrative || generatedPlan?.executiveSummaryNarrative;
  
  const readinessFactors = [hasExecutiveEngagement, hasDiscovery, hasProof, hasNarrative];
  const readinessScore = Math.round((readinessFactors.filter(Boolean).length / 4) * 100);

  const getReadinessLabel = (score: number) => {
    if (score >= 75) return { label: "Decision Ready", color: "text-primary", bg: "bg-primary/20" };
    if (score >= 50) return { label: "Building Confidence", color: "text-accent", bg: "bg-accent/20" };
    if (score >= 25) return { label: "Early Discovery", color: "text-amber-500", bg: "bg-amber-500/20" };
    return { label: "Not Started", color: "text-muted-foreground", bg: "bg-muted" };
  };

  const readiness = getReadinessLabel(readinessScore);

  const quadrants = [
    {
      title: "Executive & Stakeholder Engagement",
      icon: Users,
      color: "primary",
      description: "Building executive alignment and sponsorship",
      activities: executiveEngagementActivities,
      outcome: "Executive confidence increases"
    },
    {
      title: "Discovery & Validation",
      icon: Search,
      color: "accent",
      description: "Understanding needs and validating hypotheses",
      activities: discoveryActivities,
      outcome: "Value clarity emerges"
    },
    {
      title: "Proof & Confidence Building",
      icon: Shield,
      color: "primary",
      description: "Demonstrating capability and reducing risk",
      activities: proofActivities.slice(0, 4),
      outcome: "Risk perception decreases"
    },
    {
      title: "Narrative & Positioning",
      icon: FileText,
      color: "accent",
      description: "Shaping the strategic story and vision",
      activities: narrativeActivities,
      outcome: "Scope and ambition converge"
    }
  ];

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Rocket className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Pursuit Plan</h1>
              <p className="text-muted-foreground">
                {companyName} — Building Confidence & Alignment
              </p>
            </div>
          </div>

          {/* Readiness Indicator */}
          <div className="text-right">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${readiness.bg}`}>
              <Target className={`w-5 h-5 ${readiness.color}`} />
              <span className={`font-semibold ${readiness.color}`}>{readiness.label}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Pursuit Readiness: {readinessScore}%</p>
          </div>
        </div>

        {/* Purpose Banner */}
        <div className="glass-card p-4 mb-6 border-l-4 border-l-primary opacity-0 animate-fade-in">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Purpose: Create Momentum, Alignment & Confidence</p>
              <p className="text-sm text-muted-foreground mt-1">
                "What are we actively doing to earn the right to close?" — The pursuit plan defines the tangible actions 
                we deliberately drive to build executive alignment, reduce perceived risk, and advance decision readiness.
              </p>
            </div>
          </div>
        </div>

        {/* Four Quadrants */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {quadrants.map((quadrant, index) => {
            const Icon = quadrant.icon;
            const isAccent = quadrant.color === "accent";
            
            return (
              <div 
                key={quadrant.title}
                className="glass-card p-5 opacity-0 animate-fade-in"
                style={{ animationDelay: `${100 + index * 100}ms` }}
              >
                {/* Quadrant Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isAccent ? 'bg-accent/20' : 'bg-primary/20'
                  }`}>
                    <Icon className={`w-5 h-5 ${isAccent ? 'text-accent' : 'text-primary'}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{quadrant.title}</h3>
                    <p className="text-xs text-muted-foreground">{quadrant.description}</p>
                  </div>
                </div>

                {/* Activities */}
                <div className="space-y-2 mb-4">
                  {quadrant.activities.map((activity, actIdx) => (
                    <div key={actIdx} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        isAccent ? 'text-accent' : 'text-primary'
                      }`} />
                      <span className="text-sm text-foreground">{activity}</span>
                    </div>
                  ))}
                </div>

                {/* Outcome */}
                <div className={`p-2 rounded-lg text-center ${
                  isAccent ? 'bg-accent/10 border border-accent/20' : 'bg-primary/10 border border-primary/20'
                }`}>
                  <span className={`text-xs font-medium ${isAccent ? 'text-accent' : 'text-primary'}`}>
                    ✓ {quadrant.outcome}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Outcome Summary */}
        <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "500ms" }}>
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            Outcome of a Strong Pursuit Plan
          </h3>
          
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 rounded-xl bg-primary/10">
              <Building2 className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">Executive confidence increases</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-accent/10">
              <Shield className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">Risk perception decreases</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-primary/10">
              <Presentation className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">Decision criteria become clearer</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-accent/10">
              <MessageSquare className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">Scope and ambition converge</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-center text-muted-foreground">
              <span className="font-semibold text-foreground">The pursuit plan creates belief</span> — but it does not yet secure commitment.
              <ArrowRight className="inline w-4 h-4 mx-2 text-primary" />
              <span className="text-primary font-medium">See Close Plan for commercial execution →</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
