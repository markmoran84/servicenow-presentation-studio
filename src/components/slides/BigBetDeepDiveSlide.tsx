import { useAccountData, BigBet } from "@/context/AccountDataContext";
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Users, 
  DollarSign,
  ChevronRight,
  Zap,
  Box,
  Lightbulb,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface BigBetDeepDiveSlideProps {
  betIndex: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Accelerating": return "bg-primary text-primary-foreground";
    case "On Track": return "bg-accent/20 text-accent border border-accent/30";
    case "Needs Attention": return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    case "At Risk": return "bg-destructive/20 text-destructive border border-destructive/30";
    default: return "bg-muted text-muted-foreground";
  }
};

const getStageProgress = (stage: string) => {
  switch (stage) {
    case "Qualification": return 20;
    case "Discovery": return 40;
    case "Proof of Value": return 55;
    case "Proposal": return 70;
    case "Negotiation": return 85;
    case "Closed Won": return 100;
    default: return 10;
  }
};

const getDealStatusStyle = (status: string) => {
  switch (status) {
    case "Active Pursuit": return "bg-primary text-background";
    case "Strategic Initiative": return "bg-accent text-background";
    case "Foundation Growth": return "bg-primary/80 text-background";
    case "Pipeline": return "bg-muted text-foreground";
    default: return "bg-muted text-foreground";
  }
};

export const BigBetDeepDiveSlide = ({ betIndex }: BigBetDeepDiveSlideProps) => {
  const { data } = useAccountData();
  const { accountStrategy, generatedPlan, basics } = data;
  const companyName = basics.accountName || "Customer";

  // Get big bets from account strategy or generated plan
  const bigBets: BigBet[] = accountStrategy?.bigBets?.length > 0 
    ? accountStrategy.bigBets
    : generatedPlan?.keyWorkstreams?.map(ws => ({
        title: ws.title,
        subtitle: ws.subtitle || "Strategic Initiative",
        sponsor: "",
        dealStatus: (ws.dealStatus as BigBet["dealStatus"]) || "Pipeline",
        targetClose: ws.targetClose,
        netNewACV: ws.acv,
        steadyStateBenefit: ws.steadyStateBenefit || "TBD",
        insight: ws.insight,
        people: ws.people || [],
        products: [],
      })) || [];

  const bet = bigBets[betIndex];
  
  if (!bet) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <Target className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground">Big Bet Not Found</h2>
          <p className="text-muted-foreground">This workstream has not been defined yet.</p>
        </div>
      </div>
    );
  }

  // Generate opportunities from products
  const opportunities = bet.products?.map((product, idx) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const closeMonth = months[(new Date().getMonth() + idx + 2) % 12];
    const closeYear = new Date().getFullYear() + (new Date().getMonth() + idx + 2 >= 12 ? 1 : 0);
    const stages = ["Qualification", "Discovery", "Proposal", "Negotiation"];
    const statuses = ["On Track", "Accelerating", "Needs Attention", "On Track"];
    
    return {
      name: `${product} Implementation`,
      value: `$${(Math.random() * 1.5 + 0.2).toFixed(1)}M`,
      stage: stages[idx % 4],
      probability: Math.floor(Math.random() * 40 + 40),
      status: statuses[idx % 4],
      oppNumber: `OPP-${new Date().getFullYear()}-${String(idx + 1).padStart(3, '0')}`,
      closeDate: `${closeMonth} ${closeYear}`,
      product,
    };
  }) || [];

  return (
    <div className="min-h-screen p-8 pb-32">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 opacity-0 animate-fade-in">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-muted-foreground">Big Bet {betIndex + 1} of {bigBets.length}</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${getDealStatusStyle(bet.dealStatus)}`}>
              {bet.dealStatus}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">{bet.title}</h1>
          <p className="text-xl text-muted-foreground">{bet.subtitle}</p>
        </div>
        
        {/* Financial Summary */}
        <div className="flex items-center gap-6 glass-card px-6 py-4">
          <div className="text-center">
            <span className="text-xs text-muted-foreground block mb-1">Net New ACV</span>
            <span className="text-3xl font-bold text-primary">{bet.netNewACV || "TBD"}</span>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <span className="text-xs text-muted-foreground block mb-1">Steady-State</span>
            <span className="text-3xl font-bold text-foreground/80">{bet.steadyStateBenefit || "TBD"}</span>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <span className="text-xs text-muted-foreground block mb-1">Target Close</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-lg font-semibold text-foreground">{bet.targetClose || "TBD"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column: Strategic Context */}
        <div className="space-y-4 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          {/* Strategic Insight */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Strategic Insight</h3>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {bet.insight || "Strategic context and rationale for this initiative will be generated based on account data."}
            </p>
          </div>

          {/* Products / Capabilities */}
          {bet.products && bet.products.length > 0 && (
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Box className="w-5 h-5 text-accent" />
                <h3 className="text-sm font-bold text-accent uppercase tracking-wider">Products & Capabilities</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {bet.products.map((product) => (
                  <Badge 
                    key={product}
                    className="bg-accent/10 text-accent border-accent/30 text-sm px-3 py-1"
                  >
                    {product}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Executive Sponsor */}
          {bet.sponsor && (
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Executive Sponsor</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 flex items-center justify-center">
                  <span className="text-lg font-bold text-foreground">
                    {bet.sponsor.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <span className="text-lg font-semibold text-foreground">{bet.sponsor}</span>
              </div>
            </div>
          )}

          {/* Key Stakeholders */}
          {bet.people && bet.people.length > 0 && (
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Key Stakeholders</h3>
              </div>
              <div className="space-y-3">
                {bet.people.slice(0, 5).map((person, idx) => (
                  <div key={person.name || idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-background border border-primary/30 flex items-center justify-center">
                      <span className="text-xs font-bold text-foreground">
                        {(person.name || '').split(' ').filter(Boolean).map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground block">{person.name}</span>
                      <span className="text-xs text-muted-foreground">{person.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Columns: Opportunities */}
        <div className="col-span-2 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="glass-card p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Opportunities & Initiatives</h3>
              </div>
              <span className="text-xs text-muted-foreground">{opportunities.length} active opportunities</span>
            </div>

            {opportunities.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {opportunities.map((opp) => (
                  <div 
                    key={opp.name}
                    className="group relative bg-background/50 rounded-xl border border-border/50 p-4 hover:border-primary/30 hover:bg-background/80 transition-all duration-300"
                  >
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={`text-[10px] px-2 py-0.5 ${getStatusColor(opp.status)}`}>
                        {opp.status}
                      </Badge>
                      <span className="text-lg font-bold text-primary">{opp.value}</span>
                    </div>

                    {/* Opportunity Number & Close Date */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                        {opp.oppNumber}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {opp.closeDate}
                      </span>
                    </div>

                    {/* Opportunity Name */}
                    <h4 className="font-semibold text-sm text-foreground mb-2 leading-tight">{opp.name}</h4>

                    {/* Product Badge */}
                    <Badge 
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 bg-accent/10 border-accent/30 text-accent mb-3"
                    >
                      {opp.product}
                    </Badge>

                    {/* Stage & Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{opp.stage}</span>
                        <span className="text-primary font-medium">{opp.probability}%</span>
                      </div>
                      <Progress value={getStageProgress(opp.stage)} className="h-1.5" />
                    </div>

                    {/* Hover Arrow */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Box className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Add products to this Big Bet to generate opportunities.
                </p>
              </div>
            )}

            {/* Progress Summary */}
            <div className="mt-6 pt-4 border-t border-border/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Pursuit Progress</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(8)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-2 w-6 rounded-full ${i < 5 ? 'bg-primary' : 'bg-muted'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span>On Track</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span>Attention</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
