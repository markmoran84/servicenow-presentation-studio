// Component to render a pixel-perfect replica of a PPTX slide with AI improvements
import { Check, Quote, Mic, Clock, MessageCircle, TrendingUp, ArrowRight, Sparkles, Lightbulb } from "lucide-react";
import type {
  PPTXSlideLayout,
  PPTXShape,
  PPTXParagraph,
  PPTXColor,
} from "@/types/pptxLayout";
import type { EnhancedImprovedSlide } from "@/types/pptxLayout";

interface PPTSlideRendererProps {
  slide: EnhancedImprovedSlide;
  showNotes?: boolean;
  theme: {
    colors: {
      accent1: string;
      accent2: string;
      accent3: string;
      background1: string;
      background2: string;
      text1: string;
      text2: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
  };
}

// Convert theme color reference to actual color
function resolveColor(color: PPTXColor, theme: PPTSlideRendererProps["theme"]): string {
  if (color.type === "solid") return color.value;
  if (color.type === "theme") {
    const themeColorMap: Record<string, string> = {
      tx1: theme.colors.text1,
      tx2: theme.colors.text2,
      bg1: theme.colors.background1,
      bg2: theme.colors.background2,
      accent1: theme.colors.accent1,
      accent2: theme.colors.accent2,
      accent3: theme.colors.accent3,
      lt1: theme.colors.text1,
      lt2: theme.colors.text2,
      dk1: theme.colors.background1,
      dk2: theme.colors.background2,
    };
    return themeColorMap[color.value] || theme.colors.text1;
  }
  return theme.colors.text1;
}

// Render a single paragraph
function renderParagraph(
  para: PPTXParagraph,
  index: number,
  theme: PPTSlideRendererProps["theme"],
  isImproved?: boolean
) {
  const textAlign = para.alignment;
  const paddingLeft = para.level * 24;

  return (
    <p
      key={index}
      className={`mb-2 leading-relaxed ${isImproved ? "text-primary font-medium" : ""}`}
      style={{
        textAlign,
        paddingLeft,
        fontFamily: theme.fonts.body,
      }}
    >
      {para.bulletType === "bullet" && (
        <span className="inline-block w-4 mr-2" style={{ color: theme.colors.accent1 }}>
          •
        </span>
      )}
      {para.bulletType === "number" && (
        <span className="inline-block w-6 mr-2" style={{ color: theme.colors.accent1 }}>
          {index + 1}.
        </span>
      )}
      {para.runs.map((run, runIdx) => (
        <span
          key={runIdx}
          style={{
            fontWeight: run.font?.bold ? "bold" : undefined,
            fontStyle: run.font?.italic ? "italic" : undefined,
            textDecoration: run.font?.underline ? "underline" : undefined,
            fontSize: run.font?.size ? `${run.font.size}px` : undefined,
            color: run.font?.color ? resolveColor(run.font.color, theme) : undefined,
          }}
        >
          {run.text}
        </span>
      ))}
    </p>
  );
}

// Render a shape
function renderShape(
  shape: PPTXShape,
  theme: PPTSlideRendererProps["theme"],
  improvedContent?: EnhancedImprovedSlide["improvedContent"],
  slideNumber?: number
) {
  const { position, fill, placeholder, paragraphs } = shape;

  const style: React.CSSProperties = {
    position: "absolute",
    left: `${position.x}%`,
    top: `${position.y}%`,
    width: `${position.width}%`,
    height: `${position.height}%`,
    backgroundColor: fill ? resolveColor(fill, theme) : undefined,
    borderRadius: shape.cornerRadius || 0,
    overflow: "hidden",
  };

  // Apply shadow if present
  if (shape.shadow) {
    style.boxShadow = `${shape.shadow.offsetX}px ${shape.shadow.offsetY}px ${shape.shadow.blur}px ${shape.shadow.color}`;
  }

  // Special handling for placeholders with improved content
  if (placeholder?.type === "title" && improvedContent?.title) {
    return (
      <div key={shape.id} style={style} className="flex items-center">
        <h1
          className="text-4xl md:text-5xl font-bold"
          style={{
            fontFamily: theme.fonts.heading,
            color: theme.colors.text1,
          }}
        >
          {improvedContent.title}
          <Sparkles className="inline-block w-6 h-6 ml-3 text-primary animate-pulse" />
        </h1>
      </div>
    );
  }

  // Body content with improved key points
  if ((placeholder?.type === "body" || placeholder?.type === "content") && improvedContent?.keyPoints) {
    return (
      <div key={shape.id} style={style} className="p-4 overflow-y-auto">
        <div className="space-y-3">
          {improvedContent.keyPoints.map((point, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-lg transition-all duration-300"
              style={{
                backgroundColor: `${theme.colors.accent1}15`,
                borderLeft: `3px solid ${theme.colors.accent1}`,
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: `${theme.colors.accent1}30` }}
              >
                <Check className="w-3.5 h-3.5" style={{ color: theme.colors.accent1 }} />
              </div>
              <p
                className="text-base leading-relaxed"
                style={{
                  fontFamily: theme.fonts.body,
                  color: theme.colors.text1,
                }}
              >
                {point}
              </p>
            </div>
          ))}
        </div>

        {/* Data points callout */}
        {improvedContent.dataPoints && improvedContent.dataPoints.length > 0 && (
          <div
            className="mt-4 p-4 rounded-lg"
            style={{
              backgroundColor: `${theme.colors.accent2}15`,
              borderLeft: `3px solid ${theme.colors.accent2}`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4" style={{ color: theme.colors.accent2 }} />
              <span
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: theme.colors.accent2 }}
              >
                Key Data
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {improvedContent.dataPoints.map((data, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${theme.colors.accent2}20`,
                    color: theme.colors.accent2,
                  }}
                >
                  {data}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Visual suggestion */}
        {improvedContent.visualSuggestion && (
          <div
            className="mt-4 p-3 rounded-lg flex items-start gap-3"
            style={{
              backgroundColor: `${theme.colors.accent3}10`,
              border: `1px dashed ${theme.colors.accent3}50`,
            }}
          >
            <Lightbulb className="w-5 h-5 flex-shrink-0" style={{ color: theme.colors.accent3 }} />
            <p className="text-sm" style={{ color: theme.colors.text2 }}>
              <span className="font-semibold" style={{ color: theme.colors.accent3 }}>
                Visual Idea:
              </span>{" "}
              {improvedContent.visualSuggestion}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Default rendering for other shapes
  return (
    <div key={shape.id} style={style} className="p-4">
      {paragraphs?.map((para, idx) => renderParagraph(para, idx, theme))}
    </div>
  );
}

export const PPTSlideRenderer = ({ slide, showNotes = false, theme }: PPTSlideRendererProps) => {
  const { originalLayout, improvedContent, speakerNotes, slideNumber } = slide;
  const layout = originalLayout;

  // Determine background style
  let backgroundStyle: React.CSSProperties = {};
  if (layout.background.type === "solid" && layout.background.color) {
    backgroundStyle.backgroundColor = resolveColor(layout.background.color, theme);
  } else if (layout.background.type === "gradient") {
    backgroundStyle.background = `linear-gradient(135deg, ${theme.colors.background1} 0%, ${theme.colors.background2} 100%)`;
  } else if (layout.background.type === "image" && layout.background.imageData) {
    backgroundStyle.backgroundImage = `url(${layout.background.imageData})`;
    backgroundStyle.backgroundSize = "cover";
    backgroundStyle.backgroundPosition = "center";
  } else {
    // Default premium background
    backgroundStyle.background = `linear-gradient(155deg, ${theme.colors.background1} 0%, ${theme.colors.background2} 50%, ${theme.colors.background1} 100%)`;
  }

  // Define gradient accent themes for cycling
  const accentThemes = [
    { accent: theme.colors.accent1, glow: `${theme.colors.accent1}15` },
    { accent: theme.colors.accent2, glow: `${theme.colors.accent2}15` },
    { accent: theme.colors.accent3, glow: `${theme.colors.accent3}15` },
  ];
  const currentTheme = accentThemes[(slideNumber - 1) % accentThemes.length];

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
      {/* Background layer */}
      <div className="absolute inset-0" style={backgroundStyle} />

      {/* Ambient glow orbs matching extracted theme */}
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full blur-[150px] translate-x-1/4 -translate-y-1/4 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${currentTheme.glow} 0%, transparent 70%)` }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${theme.colors.accent2}10 0%, transparent 70%)` }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${theme.colors.text1} 1px, transparent 1px), linear-gradient(90deg, ${theme.colors.text1} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Slide content area - 16:9 aspect ratio */}
      <div className="flex-1 relative z-10 px-8 md:px-12 lg:px-16 pt-8 pb-32">
        {/* Slide header badges */}
        <div className="flex items-center gap-3 mb-4 opacity-0 animate-fade-in">
          <span
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: `${currentTheme.accent}20`,
              color: currentTheme.accent,
              border: `1px solid ${currentTheme.accent}30`,
            }}
          >
            Slide {slideNumber}
          </span>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${theme.colors.accent2}10`,
              color: theme.colors.accent2,
              border: `1px solid ${theme.colors.accent2}20`,
            }}
          >
            <Sparkles className="w-3 h-3" />
            AI Enhanced
          </span>
        </div>

        {/* Render shapes in their original positions */}
        <div
          className="relative w-full opacity-0 animate-fade-in"
          style={{ aspectRatio: "16 / 9", animationDelay: "50ms" }}
        >
          {layout.shapes.map((shape) =>
            renderShape(shape, theme, improvedContent, slideNumber)
          )}

          {/* Fallback if no shapes - render improved content directly */}
          {layout.shapes.length === 0 && (
            <div className="absolute inset-0 flex flex-col p-8">
              {/* Title */}
              {improvedContent?.title && (
                <h1
                  className="text-4xl md:text-5xl font-bold mb-8 opacity-0 animate-fade-in"
                  style={{
                    fontFamily: theme.fonts.heading,
                    color: theme.colors.text1,
                    animationDelay: "100ms",
                  }}
                >
                  {improvedContent.title}
                </h1>
              )}

              {/* Key Points Grid */}
              {improvedContent?.keyPoints && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
                  {improvedContent.keyPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl opacity-0 animate-fade-in transition-all duration-300 hover:scale-[1.01]"
                      style={{
                        backgroundColor: `${theme.colors.text1}05`,
                        borderLeft: `4px solid ${currentTheme.accent}`,
                        border: `1px solid ${theme.colors.text1}10`,
                        animationDelay: `${150 + idx * 75}ms`,
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${currentTheme.accent}, ${theme.colors.accent2})`,
                          }}
                        >
                          <Check className="w-5 h-5 text-white" />
                        </div>
                        <p
                          className="text-[15px] leading-relaxed"
                          style={{
                            fontFamily: theme.fonts.body,
                            color: `${theme.colors.text1}E6`,
                          }}
                        >
                          {point}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Speaker Notes Panel */}
      {showNotes && speakerNotes && (
        <div
          className="mt-auto p-6 opacity-0 animate-fade-in mx-8 mb-8 rounded-xl"
          style={{
            backgroundColor: `${theme.colors.text1}05`,
            border: `1px solid ${theme.colors.text1}10`,
            animationDelay: "300ms",
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.accent}, ${theme.colors.accent2})`,
              }}
            >
              <Mic className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold" style={{ color: theme.colors.text1 }}>
              Speaker Notes
            </h3>
            {speakerNotes.estimatedDuration && (
              <div
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                style={{
                  backgroundColor: `${theme.colors.text1}05`,
                  border: `1px solid ${theme.colors.text1}10`,
                  color: theme.colors.text2,
                }}
              >
                <Clock className="w-3.5 h-3.5" />
                {speakerNotes.estimatedDuration}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Opening Hook */}
            {speakerNotes.openingHook && (
              <div
                className="col-span-full p-4 rounded-xl"
                style={{
                  backgroundColor: `${currentTheme.accent}10`,
                  border: `1px solid ${currentTheme.accent}20`,
                }}
              >
                <div className="flex items-start gap-3">
                  <Quote className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: currentTheme.accent }} />
                  <div>
                    <span
                      className="text-xs font-semibold uppercase tracking-wide mb-1 block"
                      style={{ color: currentTheme.accent }}
                    >
                      Opening Hook
                    </span>
                    <p className="text-sm italic leading-relaxed" style={{ color: `${theme.colors.text1}CC` }}>
                      {speakerNotes.openingHook}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Talking Points */}
            {speakerNotes.talkingPoints && speakerNotes.talkingPoints.length > 0 && (
              <div
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: `${theme.colors.text1}02`,
                  border: `1px solid ${theme.colors.text1}05`,
                }}
              >
                <span className="text-xs font-semibold uppercase tracking-wide mb-3 block" style={{ color: theme.colors.text2 }}>
                  Key Talking Points
                </span>
                <div className="space-y-2">
                  {speakerNotes.talkingPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: `linear-gradient(135deg, ${currentTheme.accent}, ${theme.colors.accent2})`,
                        }}
                      >
                        <MessageCircle className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-sm" style={{ color: `${theme.colors.text1}B3` }}>
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data to Mention */}
            {speakerNotes.dataToMention && speakerNotes.dataToMention.length > 0 && (
              <div
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: `${theme.colors.text1}02`,
                  border: `1px solid ${theme.colors.text1}05`,
                }}
              >
                <span className="text-xs font-semibold uppercase tracking-wide mb-3 block" style={{ color: theme.colors.text2 }}>
                  Data Points to Mention
                </span>
                <div className="flex flex-wrap gap-2">
                  {speakerNotes.dataToMention.map((data, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                      style={{
                        backgroundColor: `${theme.colors.accent2}10`,
                        border: `1px solid ${theme.colors.accent2}20`,
                        color: theme.colors.accent2,
                      }}
                    >
                      <TrendingUp className="w-3 h-3" />
                      {data}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Transition */}
            {speakerNotes.transitionToNext && (
              <div
                className="col-span-full p-4 rounded-xl"
                style={{
                  backgroundColor: `${theme.colors.accent2}10`,
                  border: `1px solid ${theme.colors.accent2}20`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.accent2}, ${theme.colors.accent3})`,
                    }}
                  >
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <span
                      className="text-xs font-semibold uppercase tracking-wide mb-1 block"
                      style={{ color: theme.colors.accent2 }}
                    >
                      Transition to Next Slide
                    </span>
                    <p className="text-sm" style={{ color: `${theme.colors.text1}CC` }}>
                      {speakerNotes.transitionToNext}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
