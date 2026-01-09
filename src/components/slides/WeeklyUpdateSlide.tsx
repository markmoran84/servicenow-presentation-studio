import { useState } from "react";
import { useAccountData } from "@/context/AccountDataContext";
import { 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  Shield,
  Zap,
  HandHelping,
  ArrowUpCircle,
  FileText,
  Edit3,
  Save,
  Target,
  ChevronRight
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const HEPRItem = ({ 
  icon: Icon, 
  label, 
  color, 
  bgColor,
  items 
}: { 
  icon: React.ElementType; 
  label: string; 
  color: string; 
  bgColor: string;
  items: { title: string; detail: string; owner?: string }[] 
}) => (
  <div className={`glass-card p-4 border-l-4 ${color} h-full`}>
    <div className={`flex items-center gap-2 mb-3 ${bgColor} rounded-lg px-2 py-1.5 w-fit`}>
      <Icon className="w-4 h-4" />
      <span className="font-bold text-xs uppercase tracking-wider">{label}</span>
    </div>
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="bg-background/50 rounded-lg p-3 hover:bg-background/70 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="font-medium text-sm text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
            </div>
            {item.owner && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium whitespace-nowrap">
                {item.owner}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const WeeklyUpdateSlide = () => {
  const { data } = useAccountData();
  const { basics } = data;
  const [isEditing, setIsEditing] = useState(false);
  const [executiveNotes, setExecutiveNotes] = useState(
    "Strategic engagement with CTO scheduled for next week. Focus on AI operationalisation narrative and platform consolidation value proposition. Key message: ServiceNow as the enterprise backbone for AI at scale."
  );

  const currentDate = new Date().toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });

  const weekNumber = Math.ceil((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));

  // HEPR Data
  const heprData = {
    help: [
      { title: "Executive Sponsor Access", detail: "Need intro to Group CFO for business case presentation", owner: "VP Sales" },
      { title: "Technical Resources", detail: "Solution architect support for AI demo environment", owner: "PreSales" },
    ],
    escalations: [
      { title: "Competitor Activity", detail: "Microsoft intensifying engagement with IT leadership", owner: "Account Lead" },
    ],
    progress: [
      { title: "ITSM Discovery Complete", detail: "Mapped 12 legacy tools, $8M consolidation opportunity identified" },
      { title: "CIO Workshop Confirmed", detail: "April 15th strategic alignment session locked in" },
      { title: "RFP Response Submitted", detail: "Customer Service transformation proposal delivered on time" },
    ],
    risks: [
      { title: "Budget Freeze Q2", detail: "Potential delay to ITSM decision pending FY review", owner: "Deal Team" },
      { title: "Stakeholder Changes", detail: "New VP IT starting May - relationship building required", owner: "Account Lead" },
    ],
  };

  // Exception Plans
  const exceptionPlans = [
    { 
      trigger: "Deal slips past Q2", 
      action: "Escalate to CRO for executive intervention; propose phased approach",
      probability: "Medium"
    },
    { 
      trigger: "Competitor wins ITSM", 
      action: "Pivot to CSM entry point; leverage customer experience narrative",
      probability: "Low"
    },
    { 
      trigger: "Budget reduction >20%", 
      action: "Propose subscription model with deferred payment structure",
      probability: "Medium"
    },
  ];

  // Risk Framework
  const riskFramework = [
    { category: "Commercial", level: "medium", score: 6, trend: "stable", mitigation: "Multi-year discount structure approved" },
    { category: "Technical", level: "low", score: 3, trend: "improving", mitigation: "PoC completed successfully" },
    { category: "Political", level: "high", score: 8, trend: "stable", mitigation: "Building multi-thread relationships" },
    { category: "Timeline", level: "medium", score: 5, trend: "improving", mitigation: "Phased approach reduces risk" },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "bg-red-500";
      case "medium": return "bg-amber-500";
      case "low": return "bg-emerald-500";
      default: return "bg-muted";
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case "high": return "bg-red-500/10 border-red-500/30";
      case "medium": return "bg-amber-500/10 border-amber-500/30";
      case "low": return "bg-emerald-500/10 border-emerald-500/30";
      default: return "bg-muted/10 border-muted/30";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving": return <TrendingUp className="w-3 h-3 text-emerald-500" />;
      case "declining": return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />;
      default: return <div className="w-3 h-0.5 bg-muted-foreground/50 rounded" />;
    }
  };

  // Calculate overall risk
  const overallRisk = (riskFramework.reduce((acc, r) => acc + r.score, 0) / riskFramework.length).toFixed(1);

  return (
    <div className="min-h-screen p-6 md:p-8 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <Calendar className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Week {weekNumber}
                </span>
                <span className="text-xs text-muted-foreground">{currentDate}</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground">{basics.accountName}</h1>
              <p className="text-muted-foreground">Weekly Stakeholder Update</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right mr-4">
              <p className="text-xs text-muted-foreground mb-1">Account Status</p>
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-400 font-semibold text-sm">On Track</span>
              </div>
            </div>
            <span className="pill-badge bg-primary/20 text-primary border-primary/30">FY26</span>
          </div>
        </div>

        {/* Top Row: HEPR Grid */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          <HEPRItem 
            icon={HandHelping} 
            label="Help Needed" 
            color="border-l-blue-500" 
            bgColor="bg-blue-500/20 text-blue-400"
            items={heprData.help} 
          />
          <HEPRItem 
            icon={ArrowUpCircle} 
            label="Escalations" 
            color="border-l-orange-500" 
            bgColor="bg-orange-500/20 text-orange-400"
            items={heprData.escalations} 
          />
          <HEPRItem 
            icon={CheckCircle2} 
            label="Progress" 
            color="border-l-emerald-500" 
            bgColor="bg-emerald-500/20 text-emerald-400"
            items={heprData.progress} 
          />
          <HEPRItem 
            icon={AlertTriangle} 
            label="Risks" 
            color="border-l-red-500" 
            bgColor="bg-red-500/20 text-red-400"
            items={heprData.risks} 
          />
        </div>

        {/* Middle Row: Executive Notes + Exception Plans */}
        <div className="grid grid-cols-5 gap-4 mb-5">
          {/* Executive Notes - Editable - Takes 3 cols */}
          <div className="col-span-3 glass-card p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">Executive Notes</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium">Editable</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="h-8 px-3 text-xs"
              >
                {isEditing ? (
                  <><Save className="w-3 h-3 mr-1.5" /> Save</>
                ) : (
                  <><Edit3 className="w-3 h-3 mr-1.5" /> Edit</>
                )}
              </Button>
            </div>
            <div className="flex-1">
              {isEditing ? (
                <Textarea
                  value={executiveNotes}
                  onChange={(e) => setExecutiveNotes(e.target.value)}
                  className="h-full min-h-[100px] bg-background/50 border-primary/20 focus:border-primary/40 text-sm resize-none"
                  placeholder="Add your executive notes here..."
                />
              ) : (
                <div className="bg-background/50 rounded-xl p-4 h-full">
                  <p className="text-sm text-foreground/90 leading-relaxed">{executiveNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Exception Plans - Takes 2 cols */}
          <div className="col-span-2 glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                <FileText className="w-4 h-4 text-accent" />
              </div>
              <h3 className="font-bold text-foreground">Exception Plans</h3>
            </div>
            <div className="space-y-2">
              {exceptionPlans.map((plan, i) => (
                <div key={i} className="bg-background/50 rounded-lg p-3 hover:bg-background/70 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-medium text-sm text-foreground flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-muted-foreground" />
                      If: {plan.trigger}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      plan.probability === "High" ? "bg-red-500/20 text-red-400" :
                      plan.probability === "Medium" ? "bg-amber-500/20 text-amber-400" :
                      "bg-emerald-500/20 text-emerald-400"
                    }`}>
                      {plan.probability}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 ml-4">
                    <Zap className="w-3 h-3 text-accent" /> {plan.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: Risk Framework */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-foreground">Risk Framework</h3>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Low (1-3)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Medium (4-6)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> High (7-10)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-4">
            {/* Risk Cards */}
            {riskFramework.map((risk, i) => (
              <div key={i} className={`rounded-xl p-4 text-center border ${getRiskBgColor(risk.level)}`}>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${getRiskColor(risk.level)}`} />
                  <span className="font-bold text-sm text-foreground">{risk.category}</span>
                  {getTrendIcon(risk.trend)}
                </div>
                
                {/* Risk Score Visual */}
                <div className="relative h-1.5 bg-muted/30 rounded-full mb-2 overflow-hidden">
                  <div 
                    className={`absolute left-0 top-0 h-full rounded-full transition-all ${getRiskColor(risk.level)}`}
                    style={{ width: `${risk.score * 10}%` }}
                  />
                </div>
                <div className="text-xl font-bold text-foreground mb-1">{risk.score}<span className="text-sm text-muted-foreground">/10</span></div>
                <p className="text-[10px] text-muted-foreground leading-tight">{risk.mitigation}</p>
              </div>
            ))}

            {/* Overall Risk Summary Card */}
            <div className="rounded-xl p-4 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex flex-col justify-center">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Overall Risk</p>
                <p className={`text-3xl font-bold ${
                  parseFloat(overallRisk) >= 7 ? "text-red-500" :
                  parseFloat(overallRisk) >= 4 ? "text-amber-500" :
                  "text-emerald-500"
                }`}>{overallRisk}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs text-emerald-500 font-medium">Improving</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1 mt-3 text-[10px] text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Updated {currentDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
