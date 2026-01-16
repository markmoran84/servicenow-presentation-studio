// Fully designed, presentation-ready slide component
// This renders actual designed slides - not suggestions or analysis
import { Check, TrendingUp, Target, Zap, Users, Lightbulb, BarChart3, Shield, Rocket, Award, ArrowRight } from "lucide-react";
import { ImprovedSlide } from "@/context/AccountDataContext";

interface PresentationSlideProps {
  slide: ImprovedSlide;
  companyName?: string;
  showNotes?: boolean;
  slideTheme?: {
    primaryColor: string;
    accentColor: string;
    style: "corporate" | "modern" | "bold" | "minimal";
  };
}

// Icon mapping for different slide types
const getSlideIcon = (title: string, slideNumber: number) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes("strategy") || titleLower.includes("strategic")) return Target;
  if (titleLower.includes("team") || titleLower.includes("people")) return Users;
  if (titleLower.includes("data") || titleLower.includes("metric") || titleLower.includes("performance")) return BarChart3;
  if (titleLower.includes("risk")) return Shield;
  if (titleLower.includes("growth") || titleLower.includes("opportunity")) return TrendingUp;
  if (titleLower.includes("innovation") || titleLower.includes("transform")) return Rocket;
  if (titleLower.includes("value") || titleLower.includes("benefit")) return Award;
  if (titleLower.includes("insight") || titleLower.includes("idea")) return Lightbulb;
  
  // Default based on slide number
  const icons = [Target, Zap, TrendingUp, Users, BarChart3, Lightbulb, Rocket, Shield, Award];
  return icons[(slideNumber - 1) % icons.length];
};

// Color themes that cycle through slides
const slideColorThemes = [
  { primary: "#84CC16", accent: "#22D3EE", gradient: "from-lime-500 to-emerald-500" },
  { primary: "#22D3EE", accent: "#8B5CF6", gradient: "from-cyan-500 to-blue-500" },
  { primary: "#8B5CF6", accent: "#EC4899", gradient: "from-violet-500 to-purple-500" },
  { primary: "#F59E0B", accent: "#EF4444", gradient: "from-amber-500 to-orange-500" },
  { primary: "#10B981", accent: "#06B6D4", gradient: "from-emerald-500 to-teal-500" },
];

export const PresentationSlide = ({ 
  slide, 
  companyName = "Company",
  showNotes = false 
}: PresentationSlideProps) => {
  const SlideIcon = getSlideIcon(slide.title, slide.slideNumber);
  const theme = slideColorThemes[(slide.slideNumber - 1) % slideColorThemes.length];
  const keyPoints = slide.keyPoints || [];
  
  // Determine layout based on content
  const hasMultiplePoints = keyPoints.length > 2;
  const useGridLayout = keyPoints.length >= 4;
  
  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
      {/* Premium gradient background */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'linear-gradient(155deg, hsl(210 40% 8%) 0%, hsl(220 35% 12%) 50%, hsl(230 30% 10%) 100%)' 
        }}
      />
      
      {/* Accent glow in corner */}
      <div 
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[150px] translate-x-1/3 -translate-y-1/3 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${theme.primary}20 0%, transparent 70%)` }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${theme.accent}15 0%, transparent 70%)` }}
      />
      
      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col px-12 md:px-16 lg:px-20 pt-12 pb-32 relative z-10">
        
        {/* Slide Number Badge */}
        <div className="mb-6 opacity-0 animate-fade-in">
          <span 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
            style={{ 
              backgroundColor: `${theme.primary}20`, 
              color: theme.primary,
              border: `1px solid ${theme.primary}40`
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }} />
            Slide {slide.slideNumber}
          </span>
        </div>
        
        {/* Title Section */}
        <div className="flex items-start gap-6 mb-10 opacity-0 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <div 
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/20`}
          >
            <SlideIcon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              {slide.title}
            </h1>
            {slide.dataHighlight && (
              <p className="mt-3 text-xl text-slate-400 max-w-3xl">
                {slide.dataHighlight}
              </p>
            )}
          </div>
        </div>

        {/* Key Points Section */}
        {keyPoints.length > 0 && (
          <div className={`flex-1 ${useGridLayout ? 'grid grid-cols-2 gap-6' : 'space-y-4'} mb-8`}>
            {keyPoints.map((point, idx) => (
              <div
                key={idx}
                className="group relative opacity-0 animate-fade-in"
                style={{ animationDelay: `${100 + idx * 75}ms` }}
              >
                <div 
                  className="h-full p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.01]"
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    borderColor: `${theme.primary}20`,
                    borderLeftWidth: '4px',
                    borderLeftColor: theme.primary
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ 
                        background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                        boxShadow: `0 4px 12px ${theme.primary}40`
                      }}
                    >
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg text-white/90 leading-relaxed font-medium">
                        {point}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Visual Suggestion as a design element */}
        {slide.visualSuggestion && (
          <div 
            className="mt-auto p-6 rounded-2xl opacity-0 animate-fade-in"
            style={{ 
              animationDelay: `${100 + keyPoints.length * 75 + 50}ms`,
              background: `linear-gradient(135deg, ${theme.primary}10, ${theme.accent}05)`,
              border: `1px dashed ${theme.primary}30`
            }}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${theme.accent}20` }}
              >
                <Lightbulb className="w-6 h-6" style={{ color: theme.accent }} />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.accent }}>
                  Visual Enhancement Opportunity
                </span>
                <p className="text-sm text-slate-400 mt-1">{slide.visualSuggestion}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Speaker Notes Panel - Only shown when enabled */}
      {showNotes && slide.speakerNotes && (
        <div 
          className="absolute bottom-0 left-0 right-0 p-6 bg-slate-900/95 border-t border-slate-700/50 backdrop-blur-xl opacity-0 animate-fade-in"
          style={{ animationDelay: `${100 + keyPoints.length * 75 + 100}ms` }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Speaker Notes</h3>
              {slide.speakerNotes.estimatedDuration && (
                <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {slide.speakerNotes.estimatedDuration}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Opening Hook */}
              {slide.speakerNotes.openingHook && (
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: theme.primary }}>
                    Opening
                  </span>
                  <p className="text-sm text-slate-300 italic">"{slide.speakerNotes.openingHook}"</p>
                </div>
              )}
              
              {/* Key Talking Points */}
              {slide.speakerNotes.talkingPoints && slide.speakerNotes.talkingPoints.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                    Talk About
                  </span>
                  <ul className="space-y-1">
                    {slide.speakerNotes.talkingPoints.slice(0, 3).map((point, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                        <ArrowRight className="w-3 h-3 mt-1.5 flex-shrink-0" style={{ color: theme.primary }} />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Transition */}
              {slide.speakerNotes.transitionToNext && (
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: theme.accent }}>
                    Transition
                  </span>
                  <p className="text-sm text-slate-300">{slide.speakerNotes.transitionToNext}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Company watermark */}
      <div className="absolute bottom-8 right-12 opacity-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <span className="text-xs text-slate-600 font-medium tracking-wide">
          {companyName} • Confidential
        </span>
      </div>
    </div>
  );
};
