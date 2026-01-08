import { Lightbulb, ArrowRight, TrendingUp, Building2 } from "lucide-react";

export const InsightSlide = () => {
  const paradigmShifts = [
    {
      old: "Point solutions for each capability",
      new: "Unified platform as enterprise backbone",
    },
    {
      old: "AI as isolated experiments",
      new: "AI operationalised through workflows",
    },
    {
      old: "Cost reduction through headcount",
      new: "Cost reduction through automation",
    },
    {
      old: "Customer service as reactive function",
      new: "Customer experience as competitive advantage",
    },
  ];

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32 flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center animate-pulse-glow">
            <Lightbulb className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Insight</h1>
            <p className="text-muted-foreground text-lg">Point of View — Step 4: What Leading Enterprises Do Differently</p>
          </div>
          <div className="ml-auto pill-badge-accent">
            PoV Framework
          </div>
        </div>

        {/* Main Insight */}
        <div className="glass-card p-8 mb-8 border-l-4 border-l-accent">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Leading enterprises don't just automate processes — they build platforms that operationalise AI at scale.
              </h2>
              <p className="text-lg text-muted-foreground">
                The most successful digital transformations share a common pattern: they treat workflow automation 
                as the foundation for AI operationalisation, not as separate initiatives. This creates a flywheel 
                where automation enables AI, and AI accelerates automation.
              </p>
            </div>
          </div>
        </div>

        {/* Paradigm Shifts */}
        <h3 className="text-xl font-bold text-foreground mb-6">The Paradigm Shift</h3>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {paradigmShifts.map((shift, index) => (
            <div 
              key={index}
              className="glass-card p-5 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="flex-1 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                  <span className="text-xs font-semibold text-destructive uppercase tracking-wider block mb-1">Old</span>
                  <p className="text-sm text-foreground/80">{shift.old}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 p-3 rounded-lg bg-accent/5 border border-accent/20">
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider block mb-1">New</span>
                  <p className="text-sm text-foreground/80">{shift.new}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Evidence */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-6 text-center opacity-0 animate-fade-in animation-delay-500">
            <p className="text-4xl font-bold text-gradient mb-2">73%</p>
            <p className="text-sm text-muted-foreground">
              of AI initiatives fail to reach production due to lack of operationalisation layer
            </p>
          </div>
          <div className="glass-card p-6 text-center opacity-0 animate-fade-in animation-delay-600">
            <p className="text-4xl font-bold text-gradient-accent mb-2">5x</p>
            <p className="text-sm text-muted-foreground">
              faster AI deployment when using unified workflow platform
            </p>
          </div>
          <div className="glass-card p-6 text-center opacity-0 animate-fade-in animation-delay-700">
            <p className="text-4xl font-bold text-primary mb-2">40%</p>
            <p className="text-sm text-muted-foreground">
              cost reduction through platform consolidation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
