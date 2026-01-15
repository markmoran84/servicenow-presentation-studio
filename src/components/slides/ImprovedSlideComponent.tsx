import { Check, Layout, TrendingUp, Mic, Clock, MessageCircle, Quote, ArrowRight, Sparkles, Target, Lightbulb, BarChart3 } from "lucide-react";
import { ImprovedSlide } from "@/context/AccountDataContext";

interface ImprovedSlideComponentProps {
  slide: ImprovedSlide;
  showNotes?: boolean;
}

export const ImprovedSlideComponent = ({ slide, showNotes = false }: ImprovedSlideComponentProps) => {
  // Define gradient themes for visual variety - matching design system
  const slideThemes = [
    { 
      accent: "from-primary to-sn-green",
      border: "border-l-primary",
      iconBg: "bg-primary/15",
      glowColor: "hsl(82 85% 55% / 0.08)",
      textAccent: "text-primary"
    },
    { 
      accent: "from-accent to-cyan-400",
      border: "border-l-accent",
      iconBg: "bg-accent/15",
      glowColor: "hsl(200 90% 50% / 0.08)",
      textAccent: "text-accent"
    },
    { 
      accent: "from-purple-500 to-pink-400",
      border: "border-l-purple-500",
      iconBg: "bg-purple-500/15",
      glowColor: "hsl(270 70% 50% / 0.08)",
      textAccent: "text-purple-400"
    },
    { 
      accent: "from-amber-500 to-orange-400",
      border: "border-l-amber-500",
      iconBg: "bg-amber-500/15",
      glowColor: "hsl(40 90% 50% / 0.08)",
      textAccent: "text-amber-400"
    },
  ];
  
  const theme = slideThemes[(slide.slideNumber - 1) % slideThemes.length];

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
      {/* Premium background with depth - matching CoverSlide */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'linear-gradient(155deg, hsl(175 25% 7%) 0%, hsl(210 35% 5%) 40%, hsl(235 30% 7%) 100%)' 
        }}
      />
      
      {/* Ambient glow orbs */}
      <div 
        className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full blur-[150px] translate-x-1/4 -translate-y-1/4"
        style={{ background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 70%)` }} 
      />
      <div 
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4"
        style={{ background: 'radial-gradient(circle, hsl(200 90% 50% / 0.05) 0%, transparent 70%)' }} 
      />
      
      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-8 md:px-12 lg:px-16 pt-8 pb-32 relative z-10">
        
        {/* Header Section - Premium style */}
        <div className="mb-8 opacity-0 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge-primary">
              Slide {slide.slideNumber}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
              <Sparkles className="w-3 h-3" />
              AI Enhanced
            </span>
          </div>
          
          <h1 
            className="slide-title mb-3 opacity-0 animate-fade-in"
            style={{ animationDelay: '50ms' }}
          >
            <span className={theme.textAccent}>{slide.title}</span>
          </h1>
        </div>

        {/* Key Points - Premium glass cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {slide.keyPoints.map((point, idx) => (
            <div
              key={idx}
              className={`glass-card p-5 ${theme.border} border-l-4 opacity-0 animate-fade-in hover:scale-[1.01] transition-all duration-300`}
              style={{ animationDelay: `${100 + idx * 75}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.accent} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-foreground/90 leading-relaxed text-[15px]">{point}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Suggestion & Data Highlight - Two column premium cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {slide.visualSuggestion && (
            <div 
              className="glass-card p-6 border-l-4 border-l-accent opacity-0 animate-fade-in"
              style={{ animationDelay: `${100 + slide.keyPoints.length * 75 + 50}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0 border border-white/5">
                  <Layout className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="card-title mb-2">Visual Enhancement</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{slide.visualSuggestion}</p>
                </div>
              </div>
            </div>
          )}
          {slide.dataHighlight && (
            <div 
              className="glass-card p-6 border-l-4 border-l-amber-500 opacity-0 animate-fade-in"
              style={{ animationDelay: `${100 + slide.keyPoints.length * 75 + 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0 border border-white/5">
                  <BarChart3 className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="card-title mb-2">Key Data Point</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{slide.dataHighlight}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Speaker Notes - Premium dark panel */}
        {showNotes && slide.speakerNotes && (
          <div 
            className="mt-auto glass-card p-6 opacity-0 animate-fade-in"
            style={{ animationDelay: `${100 + slide.keyPoints.length * 75 + 150}ms` }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.accent} flex items-center justify-center shadow-lg`}>
                <Mic className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Speaker Notes</h3>
              {slide.speakerNotes.estimatedDuration && (
                <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {slide.speakerNotes.estimatedDuration}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Opening Hook */}
              {slide.speakerNotes.openingHook && (
                <div className="col-span-full bg-primary/10 rounded-xl p-4 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <Quote className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-primary uppercase tracking-wide mb-1 block">Opening Hook</span>
                      <p className="text-sm text-foreground/80 italic leading-relaxed">{slide.speakerNotes.openingHook}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Talking Points */}
              {slide.speakerNotes.talkingPoints && slide.speakerNotes.talkingPoints.length > 0 && (
                <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">Key Talking Points</span>
                  <div className="space-y-2">
                    {slide.speakerNotes.talkingPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${theme.accent} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <MessageCircle className="w-3 h-3 text-white" />
                        </div>
                        <p className="text-sm text-foreground/70">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Data to Mention */}
              {slide.speakerNotes.dataToMention && slide.speakerNotes.dataToMention.length > 0 && (
                <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">Data Points to Mention</span>
                  <div className="flex flex-wrap gap-2">
                    {slide.speakerNotes.dataToMention.map((data, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300"
                      >
                        <TrendingUp className="w-3 h-3" />
                        {data}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Transition */}
              {slide.speakerNotes.transitionToNext && (
                <div className="col-span-full bg-accent/10 rounded-xl p-4 border border-accent/20">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent to-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ArrowRight className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-accent uppercase tracking-wide mb-1 block">Transition to Next Slide</span>
                      <p className="text-sm text-foreground/80">{slide.speakerNotes.transitionToNext}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
