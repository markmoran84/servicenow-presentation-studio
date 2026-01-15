import { Check, Layout, TrendingUp, Mic, Clock, MessageCircle, Quote, ArrowRight, Sparkles } from "lucide-react";
import { ImprovedSlide } from "@/context/AccountDataContext";

interface ImprovedSlideComponentProps {
  slide: ImprovedSlide;
  showNotes?: boolean;
}

export const ImprovedSlideComponent = ({ slide, showNotes = false }: ImprovedSlideComponentProps) => {
  // Define gradient accents for visual variety
  const accentGradients = [
    "from-blue-500 to-cyan-400",
    "from-violet-500 to-purple-400",
    "from-emerald-500 to-teal-400",
    "from-amber-500 to-orange-400",
  ];
  
  const slideAccent = accentGradients[(slide.slideNumber - 1) % accentGradients.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 pb-28">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        
        {/* Minimal Header - matching AccountStrategySlide */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-1 h-12 bg-gradient-to-b ${slideAccent} rounded-full`} />
            <div>
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${slideAccent} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {slide.slideNumber}
                </span>
                <h1 className="text-3xl font-light text-white tracking-tight">
                  {slide.title}
                </h1>
              </div>
              <p className="text-slate-500 text-sm mt-1 ml-14">Improved Slide</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400">
            <Sparkles className="w-3 h-3" />
            AI Enhanced
          </span>
        </div>

        {/* Key Points - Using glass-card style */}
        <div className="space-y-4 mb-8">
          {slide.keyPoints.map((point, idx) => (
            <div
              key={idx}
              className="group relative glass-card p-5 border-l-4 opacity-0 animate-fade-in hover:scale-[1.01] transition-all duration-300"
              style={{ 
                animationDelay: `${idx * 100}ms`,
                borderLeftColor: `var(--tw-gradient-from)`,
              }}
            >
              {/* Gradient accent line at top */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${slideAccent} rounded-t-xl opacity-40 group-hover:opacity-80 transition-opacity`} />
              
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${slideAccent} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-foreground/90 leading-relaxed text-[15px]">{point}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Suggestion & Data Highlight - Two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {slide.visualSuggestion && (
            <div 
              className="glass-card p-5 border-l-4 border-l-blue-500 opacity-0 animate-fade-in"
              style={{ animationDelay: `${slide.keyPoints.length * 100 + 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0 border border-white/5">
                  <Layout className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <span className="text-xs font-medium text-blue-400 uppercase tracking-[0.15em] mb-2 block">Visual Suggestion</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{slide.visualSuggestion}</p>
                </div>
              </div>
            </div>
          )}
          {slide.dataHighlight && (
            <div 
              className="glass-card p-5 border-l-4 border-l-amber-500 opacity-0 animate-fade-in"
              style={{ animationDelay: `${slide.keyPoints.length * 100 + 150}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0 border border-white/5">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="text-xs font-medium text-amber-400 uppercase tracking-[0.15em] mb-2 block">Data Highlight</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{slide.dataHighlight}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Speaker Notes - Premium dark panel matching design system */}
        {showNotes && slide.speakerNotes && (
          <div 
            className="mt-auto rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/5 p-6 opacity-0 animate-fade-in"
            style={{ animationDelay: `${slide.keyPoints.length * 100 + 200}ms` }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${slideAccent} flex items-center justify-center shadow-lg`}>
                <Mic className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Speaker Notes</h3>
              {slide.speakerNotes.estimatedDuration && (
                <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {slide.speakerNotes.estimatedDuration}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Opening Hook */}
              {slide.speakerNotes.openingHook && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Quote className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1" />
                  <p className="text-emerald-300 italic text-sm leading-relaxed">{slide.speakerNotes.openingHook}</p>
                </div>
              )}

              {/* Talking Points */}
              {slide.speakerNotes.talkingPoints && slide.speakerNotes.talkingPoints.length > 0 && (
                <div>
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.15em] mb-3 block">Key Talking Points</span>
                  <div className="space-y-2">
                    {slide.speakerNotes.talkingPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <MessageCircle className="w-3 h-3 text-white" />
                        </div>
                        <p className="text-sm text-foreground/80">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Data to Mention */}
              {slide.speakerNotes.dataToMention && slide.speakerNotes.dataToMention.length > 0 && (
                <div>
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.15em] mb-3 block">Data Points</span>
                  <div className="flex flex-wrap gap-2">
                    {slide.speakerNotes.dataToMention.map((data, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300"
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
                <div className="flex items-start gap-3 pt-4 border-t border-white/5">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.15em] mb-1 block">Transition</span>
                    <p className="text-sm text-cyan-300">{slide.speakerNotes.transitionToNext}</p>
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
