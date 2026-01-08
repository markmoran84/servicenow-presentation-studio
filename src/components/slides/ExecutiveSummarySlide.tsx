import { ArrowRight, Target, Zap, Shield, TrendingUp } from "lucide-react";

const keyMetrics = [
  { value: "$55.5B", label: "Revenue 2024", sublabel: "+9% YoY" },
  { value: "$6.5B", label: "EBIT", sublabel: "+65% YoY" },
  { value: "93%", label: "Gemini Reliability", sublabel: "Network Performance" },
  { value: "100K+", label: "Employees", sublabel: "Global Workforce" },
];

const valueProps = [
  {
    icon: Zap,
    title: "AI Operationalisation",
    description: "Platform to activate Maersk's AI-first ambition at enterprise scale",
  },
  {
    icon: Shield,
    title: "Digital Backbone",
    description: "Unified workflow layer across Ocean, Logistics & Services, Terminals",
  },
  {
    icon: TrendingUp,
    title: "Cost Discipline Enabler",
    description: "Demonstrable ROI through process standardisation and automation",
  },
];

export const ExecutiveSummarySlide = () => {
  return (
    <div className="min-h-screen px-8 pt-10 pb-32 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center">
        <div className="w-full">
          {/* Title Block */}
          <div className="mb-12 opacity-0 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <span className="pill-badge">FY26 Account Plan</span>
              <span className="text-muted-foreground text-sm">Confidential</span>
            </div>
            <h1 className="text-6xl font-bold text-foreground tracking-tight mb-4">
              <span className="text-gradient">ServiceNow</span>
              <span className="text-muted-foreground mx-4">×</span>
              <span>Maersk</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
              Strategic partnership to operationalise Maersk's "All the Way" vision — 
              from digital transformation to AI-first execution across integrated logistics.
            </p>
          </div>

          {/* Metrics Strip */}
          <div className="grid grid-cols-4 gap-4 mb-12">
            {keyMetrics.map((metric, index) => (
              <div
                key={metric.label}
                className="stat-card opacity-0 animate-fade-in"
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                <div className="metric-highlight mb-2">{metric.value}</div>
                <div className="text-foreground font-medium">{metric.label}</div>
                <div className="text-sm text-muted-foreground">{metric.sublabel}</div>
              </div>
            ))}
          </div>

          {/* Value Propositions */}
          <div className="grid grid-cols-3 gap-6">
            {valueProps.map((prop, index) => (
              <div
                key={prop.title}
                className="glass-card p-6 opacity-0 animate-fade-in group cursor-pointer"
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="icon-container flex-shrink-0 group-hover:animate-pulse-glow">
                    <prop.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      {prop.title}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {prop.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Quote */}
          <div className="mt-12 opacity-0 animate-fade-in animation-delay-800">
            <div className="quote-block max-w-2xl">
              <p className="text-lg text-foreground italic">
                "We are uniquely positioned to support our customers in an era where geopolitical 
                changes and disruptions continue to reinforce the need for resilient supply chains."
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                — Vincent Clerc, CEO, A.P. Moller-Maersk
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
