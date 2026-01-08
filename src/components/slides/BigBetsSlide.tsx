import { SectionHeader } from "@/components/SectionHeader";
import { Users, Cpu, Shield, Layers, AlertCircle, Trophy, Zap, ArrowRight } from "lucide-react";

const bigBets = [
  {
    icon: Users,
    title: "CRM Modernisation & Service Cloud Expansion",
    status: "Active Pursuit — Moved to Q1",
    statusColor: "bg-warning/20 text-warning",
    whyNow: "Salesforce Service Cloud takeout opportunity identified. Maersk seeking to consolidate customer service platforms aligned to 'All the Way' customer experience strategy.",
    ifWeLose: "Salesforce cements position. ServiceNow marginalised to IT workflows only. Customer-facing expansion blocked.",
    winningInFY26: "Service Cloud deal closed Q1. Customer success deployed. CSAT baseline established for expansion justification.",
    alignment: ["Customer Centricity", "Digital Transformation"],
    color: "from-primary to-accent",
  },
  {
    icon: Cpu,
    title: "AI Use Cases & Workflow Automation",
    status: "Strategic Initiative",
    statusColor: "bg-primary/20 text-primary",
    whyNow: "Maersk explicitly AI-first. ServiceNow positioned as the operationalisation layer for AI — connecting intelligence to automated workflows.",
    ifWeLose: "AI initiatives fragment across point solutions. No enterprise workflow backbone. Value unrealised.",
    winningInFY26: "2+ AI use cases in production (e.g., predictive case routing, intelligent document processing). Measurable efficiency gains.",
    alignment: ["AI-First Ambition", "Operational Excellence"],
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    title: "IT & Security Operations Enhancement",
    status: "Foundation Expansion",
    statusColor: "bg-accent/20 text-accent",
    whyNow: "Existing ITSM footprint provides platform for SecOps and ITOM expansion. Maersk's global operations require unified visibility.",
    ifWeLose: "Competitors capture security orchestration. Platform relevance constrained to core ITSM.",
    winningInFY26: "SecOps pilot deployed. ITOM discovery completed. Unified IT visibility dashboard for leadership.",
    alignment: ["Cost Discipline", "Risk Management"],
    color: "from-accent to-teal-500",
  },
  {
    icon: Layers,
    title: "Platform Consolidation & Workflow Expansion",
    status: "Growth Engine",
    statusColor: "bg-blue-500/20 text-blue-400",
    whyNow: "Success in CRM creates expansion opportunity. HR, Legal, and Risk workflows are natural adjacencies with proven ROI models.",
    ifWeLose: "ACV stagnates. ServiceNow remains point solution. Strategic relevance diminishes.",
    winningInFY26: "Expansion pipeline formalised. Executive roadmap endorsed. Multi-workflow commitment secured.",
    alignment: ["Cost Discipline", "All the Way"],
    color: "from-blue-500 to-cyan-500",
  },
];

export const BigBetsSlide = () => {
  return (
    <div className="px-8 pt-6 pb-32">
      <div className="flex items-center justify-between mb-6 opacity-0 animate-fade-in">
        <div className="flex items-center gap-3">
          <Zap className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">Big Bets & Strategic Initiatives</h1>
        </div>
        <div className="pill-badge">
          "AI-first, with a platform to operationalise it"
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {bigBets.map((bet, index) => (
          <div
            key={bet.title}
            className="glass-card p-5 opacity-0 animate-fade-in"
            style={{ animationDelay: `${100 + index * 100}ms` }}
          >
            <div className="flex items-start gap-4">
              {/* Icon & Status */}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bet.color} flex items-center justify-center flex-shrink-0`}>
                  <bet.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${bet.statusColor}`}>
                  {bet.status}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground mb-2">{bet.title}</h3>
                
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {bet.alignment.map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Why Now */}
                  <div className="p-2.5 rounded-lg bg-secondary/50 border border-border/30">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">Why Now</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{bet.whyNow}</p>
                  </div>

                  {/* If We Lose */}
                  <div className="p-2.5 rounded-lg bg-destructive/5 border border-destructive/20">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                      <span className="text-[10px] font-semibold text-destructive uppercase tracking-wide">If We Lose</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{bet.ifWeLose}</p>
                  </div>

                  {/* Winning */}
                  <div className="p-2.5 rounded-lg bg-accent/5 border border-accent/20">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Trophy className="w-3.5 h-3.5 text-accent" />
                      <span className="text-[10px] font-semibold text-accent uppercase tracking-wide">Winning in FY26</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{bet.winningInFY26}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CRM Priority Call-out */}
      <div className="mt-4 glass-card p-4 opacity-0 animate-fade-in animation-delay-500">
        <div className="flex items-center gap-4">
          <div className="icon-container animate-pulse-glow">
            <ArrowRight className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">CRM Modernisation is the Primary Commercial Wedge</h4>
            <p className="text-sm text-muted-foreground">
              Q1 FY26 focus: Close Service Cloud opportunity. Success here unlocks multi-workflow expansion across 
              the Maersk enterprise and validates ServiceNow as the digital execution backbone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
