import { Check, Layout, TrendingUp, Mic, Clock, MessageCircle, Quote, ArrowRight } from "lucide-react";
import { ImprovedSlide } from "@/context/AccountDataContext";

interface ImprovedSlideComponentProps {
  slide: ImprovedSlide;
  showNotes?: boolean;
}

export const ImprovedSlideComponent = ({ slide, showNotes = false }: ImprovedSlideComponentProps) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="container mx-auto px-8 py-12 max-w-6xl">
        {/* Slide Title */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {slide.slideNumber}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{slide.title}</h1>
          </div>
        </div>

        {/* Key Points */}
        <div className="space-y-4 mb-8">
          {slide.keyPoints.map((point, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 hover:border-primary/20 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <p className="text-lg text-foreground leading-relaxed">{point}</p>
            </div>
          ))}
        </div>

        {/* Visual Suggestion & Data Highlight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {slide.visualSuggestion && (
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Layout className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-semibold text-blue-400 uppercase tracking-wide">Visual Suggestion</span>
              </div>
              <p className="text-muted-foreground">{slide.visualSuggestion}</p>
            </div>
          )}
          {slide.dataHighlight && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-semibold text-amber-400 uppercase tracking-wide">Data Highlight</span>
              </div>
              <p className="text-muted-foreground">{slide.dataHighlight}</p>
            </div>
          )}
        </div>

        {/* Speaker Notes - Shown when notes toggle is on */}
        {showNotes && slide.speakerNotes && (
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-4">
              <Mic className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-purple-300">Speaker Notes</h3>
              {slide.speakerNotes.estimatedDuration && (
                <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {slide.speakerNotes.estimatedDuration}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Opening Hook */}
              {slide.speakerNotes.openingHook && (
                <div className="flex items-start gap-3">
                  <Quote className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1" />
                  <p className="text-emerald-300 italic">{slide.speakerNotes.openingHook}</p>
                </div>
              )}

              {/* Talking Points */}
              {slide.speakerNotes.talkingPoints && slide.speakerNotes.talkingPoints.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Key Talking Points</span>
                  <ul className="space-y-2">
                    {slide.speakerNotes.talkingPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-foreground/90">
                        <MessageCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-1" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Data to Mention */}
              {slide.speakerNotes.dataToMention && slide.speakerNotes.dataToMention.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Data Points</span>
                  <ul className="space-y-1">
                    {slide.speakerNotes.dataToMention.map((data, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-amber-300">
                        <TrendingUp className="w-3.5 h-3.5 flex-shrink-0 mt-1" />
                        {data}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Transition */}
              {slide.speakerNotes.transitionToNext && (
                <div className="flex items-start gap-2 pt-2 border-t border-slate-700">
                  <ArrowRight className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-cyan-300">{slide.speakerNotes.transitionToNext}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
