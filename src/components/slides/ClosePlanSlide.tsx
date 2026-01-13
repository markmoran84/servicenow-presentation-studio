import { useAccountData } from "@/context/AccountDataContext";
import { 
  FileSignature, DollarSign, Milestone, Truck, ShieldAlert,
  CheckCircle2, Calendar, Users, ArrowRight, Target,
  Gavel, ClipboardCheck, Briefcase, AlertTriangle, Lock
} from "lucide-react";

export const ClosePlanSlide = () => {
  const { data } = useAccountData();
  const { basics, accountStrategy, engagement, generatedPlan } = data;
  const companyName = basics.accountName || "the customer";

  // Derive close plan data from context
  const bigBets = accountStrategy.bigBets || [];
  const keyWorkstreams = generatedPlan?.keyWorkstreams || [];
  const decisionDeadlines = engagement.decisionDeadlines || "";
  const renewalTiming = engagement.renewalRFPTiming || "";

  // Calculate total commercial value
  const parseACV = (acv: string) => {
    if (!acv) return 0;
    const cleaned = acv.replace(/[^0-9.]/g, '');
    const value = parseFloat(cleaned) || 0;
    if (acv.toLowerCase().includes('k')) return value / 1000;
    return value;
  };

  const totalValue = bigBets.reduce((sum, bet) => sum + parseACV(bet.netNewACV || "0"), 0);

  // Build activities for each category
  const commercialMechanics = [
    "Commercial structure & pricing",
    "Contracting approach",
    "Procurement & legal steps",
    "Commercial approvals & governance"
  ];

  const decisionMilestones = [
    decisionDeadlines ? `Decision deadline: ${decisionDeadlines}` : "Executive sign-off points",
    "Steering committee approvals",
    "Budget confirmation",
    renewalTiming ? `Renewal timing: ${renewalTiming}` : "Scope & phasing agreement"
  ];

  const deliveryReadiness = [
    "Implementation approach",
    "Partner alignment",
    "Governance model",
    "Success metrics & KPIs"
  ];

  const riskManagement = [
    "Final objections & blockers",
    "Risk mitigation plans",
    "Competitive displacement strategy",
    "Internal alignment on concessions"
  ];

  // Determine close readiness
  const hasCommercialDiscussion = bigBets.some(bet => 
    bet.dealStatus === "Active Pursuit" || bet.netNewACV
  );
  const hasTimeline = decisionDeadlines || renewalTiming;
  const hasValue = totalValue > 0;
  const hasWorkstreams = bigBets.length > 0 || keyWorkstreams.length > 0;

  const closeFactors = [hasCommercialDiscussion, hasTimeline, hasValue, hasWorkstreams];
  const closeReadiness = Math.round((closeFactors.filter(Boolean).length / 4) * 100);

  const getCloseStatus = (score: number) => {
    if (score >= 75) return { label: "Ready to Close", color: "text-primary", bg: "bg-primary/20", icon: FileSignature };
    if (score >= 50) return { label: "In Negotiation", color: "text-accent", bg: "bg-accent/20", icon: Gavel };
    if (score >= 25) return { label: "Building Commercial Case", color: "text-amber-500", bg: "bg-amber-500/20", icon: Briefcase };
    return { label: "Pre-Commercial", color: "text-muted-foreground", bg: "bg-muted", icon: Target };
  };

  const status = getCloseStatus(closeReadiness);
  const StatusIcon = status.icon;

  const categories = [
    {
      title: "Commercial Mechanics",
      icon: DollarSign,
      color: "primary",
      description: "Structure, pricing, and procurement path",
      activities: commercialMechanics,
      outcome: "Clear commercial path defined"
    },
    {
      title: "Decision Milestones",
      icon: Milestone,
      color: "accent",
      description: "Approvals, sign-offs, and governance",
      activities: decisionMilestones,
      outcome: "Defined approval owners"
    },
    {
      title: "Delivery Readiness",
      icon: Truck,
      color: "primary",
      description: "Implementation and success planning",
      activities: deliveryReadiness,
      outcome: "Execution plan confirmed"
    },
    {
      title: "Risk & Objection Management",
      icon: ShieldAlert,
      color: "accent",
      description: "Blockers, competition, and mitigation",
      activities: riskManagement,
      outcome: "Minimal execution ambiguity"
    }
  ];

  return (
    <div className="h-full overflow-auto p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
              <FileSignature className="w-7 h-7 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Close Plan</h1>
              <p className="text-muted-foreground">
                {companyName} — Converting Alignment to Commitment
              </p>
            </div>
          </div>

          {/* Close Status & Value */}
          <div className="text-right">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${status.bg}`}>
              <StatusIcon className={`w-5 h-5 ${status.color}`} />
              <span className={`font-semibold ${status.color}`}>{status.label}</span>
            </div>
            {totalValue > 0 && (
              <p className="text-lg font-bold text-foreground mt-1">
                ${totalValue.toFixed(1)}M <span className="text-sm font-normal text-muted-foreground">Total Value</span>
              </p>
            )}
          </div>
        </div>

        {/* Purpose Banner */}
        <div className="glass-card p-4 mb-6 border-l-4 border-l-accent opacity-0 animate-fade-in">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Purpose: Convert Alignment into Commitment</p>
              <p className="text-sm text-muted-foreground mt-1">
                "What must happen for this to legally and commercially close?" — The close plan begins once strategic 
                intent is clear. It is <span className="font-medium text-foreground">decision-led, not activity-led</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Four Categories */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isAccent = category.color === "accent";
            
            return (
              <div 
                key={category.title}
                className="glass-card p-5 opacity-0 animate-fade-in"
                style={{ animationDelay: `${100 + index * 100}ms` }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isAccent ? 'bg-accent/20' : 'bg-primary/20'
                  }`}>
                    <Icon className={`w-5 h-5 ${isAccent ? 'text-accent' : 'text-primary'}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{category.title}</h3>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>
                </div>

                {/* Activities */}
                <div className="space-y-2 mb-4">
                  {category.activities.map((activity, actIdx) => (
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
                    ✓ {category.outcome}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Outcome Summary */}
        <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "500ms" }}>
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-accent" />
            Outcome of a Strong Close Plan
          </h3>
          
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 rounded-xl bg-accent/10">
              <CheckCircle2 className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">Clear "yes" decision path</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-primary/10">
              <Users className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">Defined approval owners</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-accent/10">
              <Calendar className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">Known timelines</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-primary/10">
              <AlertTriangle className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">Minimal execution ambiguity</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-center text-muted-foreground">
              <span className="font-semibold text-foreground">The close plan secures commitment</span> — but only works if the pursuit plan has done its job.
            </p>
          </div>
        </div>

        {/* Relationship Summary */}
        <div className="mt-4 grid grid-cols-2 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Pursuit Plan</p>
              <p className="text-sm text-primary">Earns the close</p>
              <p className="text-xs text-muted-foreground">Exploratory, strategic, activity-led</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <FileSignature className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Close Plan</p>
              <p className="text-sm text-accent">Executes the close</p>
              <p className="text-xs text-muted-foreground">Deterministic, commercial, decision-led</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
