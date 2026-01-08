import { useAccountData } from "@/context/AccountDataContext";
import { Eye, Quote, TrendingUp, Target } from "lucide-react";

export const StrategicObservationSlide = () => {
  const { data } = useAccountData();

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32 flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Eye className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Strategic Observation</h1>
            <p className="text-muted-foreground text-lg">Point of View — Step 1: Verifiable Fact</p>
          </div>
          <div className="ml-auto pill-badge">
            PoV Framework
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Quote / Observation */}
          <div className="col-span-2">
            <div className="glass-card p-8">
              <div className="quote-block mb-6">
                <p className="text-2xl font-medium text-foreground leading-relaxed italic">
                  "We are an AI-first company. Every process, every decision, every customer interaction 
                  will be enhanced by artificial intelligence. This is not optional — it is foundational 
                  to our competitive position."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                  <span className="text-sm font-bold">VC</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Vincent Clerc</p>
                  <p className="text-sm text-muted-foreground">CEO, A.P. Møller - Maersk</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-sm text-muted-foreground">FY24 Earnings Call</p>
                  <p className="text-xs text-muted-foreground">Q4 2024</p>
                </div>
              </div>
            </div>

            {/* Supporting Metrics */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="glass-card p-4 text-center">
                <p className="text-3xl font-bold text-gradient">{data.financial.customerRevenue.split(' ')[0]}</p>
                <p className="text-sm text-muted-foreground">Revenue FY24</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-3xl font-bold text-gradient-accent">{data.financial.growthRate}</p>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-3xl font-bold text-primary">130+</p>
                <p className="text-sm text-muted-foreground">Countries</p>
              </div>
            </div>
          </div>

          {/* Strategic Importance */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground">Strategic Importance</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <span className="text-sm text-foreground/90">
                    AI ambition is board-level mandate, not a departmental initiative
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <span className="text-sm text-foreground/90">
                    Investment is accelerating — $500M+ committed to digital transformation
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <span className="text-sm text-foreground/90">
                    Competitive pressure from digital-native freight forwarders
                  </span>
                </li>
              </ul>
            </div>

            <div className="glass-card p-6 border-l-4 border-l-accent">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-accent" />
                <h3 className="font-bold text-foreground">Key Metrics</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">EBIT Improvement</span>
                  <span className="font-semibold text-accent">+65%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Digital Investment</span>
                  <span className="font-semibold text-accent">Accelerating</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">AI Ambition</span>
                  <span className="font-semibold text-accent">Foundational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
