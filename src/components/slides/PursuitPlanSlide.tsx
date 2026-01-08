import { useAccountData } from "@/context/AccountDataContext";
import { Target, Calendar, DollarSign, Users, ArrowRight, CheckCircle, Clock, Zap } from "lucide-react";

interface Pursuit {
  name: string;
  product: string;
  stage: string;
  closeDate: string;
  acv: string;
  probability: number;
  sponsor: string;
  nextAction: string;
  status: "on-track" | "at-risk" | "closed";
}

export const PursuitPlanSlide = () => {
  const { data } = useAccountData();
  const { basics } = data;

  const pursuits: Pursuit[] = [
    {
      name: "CRM Modernisation - Service Cloud Displacement",
      product: "CSM Pro, Customer Workflows",
      stage: "Technical Validation",
      closeDate: "Q1 FY26",
      acv: "$5M",
      probability: 65,
      sponsor: "John Ball (EVP CRM)",
      nextAction: "Complete proof of concept and present to steering committee",
      status: "on-track",
    },
    {
      name: "AI Use Case Portfolio - Phase 1",
      product: "AI Platform, Predictive Intelligence",
      stage: "Proposal",
      closeDate: "Q2 FY26",
      acv: "$2M",
      probability: 50,
      sponsor: "Navneet Kapoor (EVP & CTIO)",
      nextAction: "Align on priority use cases with AI Platform Owner",
      status: "on-track",
    },
    {
      name: "SecOps & ITOM Expansion",
      product: "Security Operations, ITOM Visibility",
      stage: "Discovery",
      closeDate: "Q3 FY26",
      acv: "$3M",
      probability: 35,
      sponsor: "Scott Horn (SVP IT Logistics)",
      nextAction: "Schedule security operations discovery workshop",
      status: "at-risk",
    },
  ];

  const totalACV = pursuits.reduce((sum, p) => sum + parseFloat(p.acv.replace(/[^0-9.]/g, '')), 0);
  const weightedACV = pursuits.reduce((sum, p) => sum + (parseFloat(p.acv.replace(/[^0-9.]/g, '')) * p.probability / 100), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track": return "bg-primary text-primary-foreground";
      case "at-risk": return "bg-amber-500 text-white";
      case "closed": return "bg-accent text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getProgressColor = (probability: number) => {
    if (probability >= 60) return "bg-primary";
    if (probability >= 40) return "bg-accent";
    return "bg-amber-500";
  };

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Target className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Pursuit Plan</h1>
              <p className="text-muted-foreground text-lg">{basics.accountName} — Commercial Roadmap</p>
            </div>
          </div>
          
          {/* Summary Metrics */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total Pipeline</p>
              <p className="text-2xl font-bold text-foreground">${totalACV}M</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Weighted Value</p>
              <p className="text-2xl font-bold text-primary">${weightedACV.toFixed(1)}M</p>
            </div>
          </div>
        </div>

        {/* Pursuit Cards */}
        <div className="space-y-4">
          {pursuits.map((pursuit, index) => (
            <div
              key={pursuit.name}
              className="glass-card overflow-hidden opacity-0 animate-fade-in"
              style={{ animationDelay: `${100 + index * 100}ms` }}
            >
              <div className="grid grid-cols-12 gap-4 p-5">
                {/* Pursuit Info */}
                <div className="col-span-5">
                  <div className="flex items-start gap-3">
                    <div className={`px-2 py-1 rounded text-[10px] font-bold ${getStatusColor(pursuit.status)}`}>
                      {pursuit.status.replace("-", " ").toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{pursuit.name}</h3>
                      <p className="text-sm text-primary">{pursuit.product}</p>
                    </div>
                  </div>
                </div>

                {/* Stage & Timeline */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Stage</span>
                  </div>
                  <p className="font-semibold text-foreground text-sm">{pursuit.stage}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3 text-accent" />
                    <span className="text-xs text-accent">{pursuit.closeDate}</span>
                  </div>
                </div>

                {/* Value & Probability */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Value</span>
                  </div>
                  <p className="text-xl font-bold text-gradient">{pursuit.acv}</p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Probability</span>
                      <span className="font-semibold text-foreground">{pursuit.probability}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-border overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${getProgressColor(pursuit.probability)}`}
                        style={{ width: `${pursuit.probability}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Sponsor & Next Action */}
                <div className="col-span-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Executive Sponsor</span>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-2">{pursuit.sponsor}</p>
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-start gap-2">
                      <ArrowRight className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-foreground">{pursuit.nextAction}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline Summary */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="glass-card p-5 text-center opacity-0 animate-fade-in" style={{ animationDelay: "500ms" }}>
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{pursuits.length}</p>
            <p className="text-sm text-muted-foreground">Active Pursuits</p>
          </div>
          <div className="glass-card p-5 text-center opacity-0 animate-fade-in" style={{ animationDelay: "550ms" }}>
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary">{pursuits.filter(p => p.status === 'on-track').length}</p>
            <p className="text-sm text-muted-foreground">On Track</p>
          </div>
          <div className="glass-card p-5 text-center opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-3">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-accent">Q1</p>
            <p className="text-sm text-muted-foreground">Priority Close</p>
          </div>
        </div>
      </div>
    </div>
  );
};
