import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { SlideFooter } from "@/components/SlideFooter";
import { SlideNavigation } from "@/components/slides/SlideNavigation";
import { TalkingNotesPanel } from "@/components/TalkingNotesPanel";
import { InputFormSlide } from "@/components/slides/InputFormSlide";
import { CoverSlide } from "@/components/slides/CoverSlide";
import { ExecutiveSummarySlide } from "@/components/slides/ExecutiveSummarySlide";
import { CustomerSnapshotSlide } from "@/components/slides/CustomerSnapshotSlide";
import { CustomerStrategySlide } from "@/components/slides/CustomerStrategySlide";
import { AccountStrategySlide } from "@/components/slides/AccountStrategySlide";
import { FY1RetrospectiveSlide } from "@/components/slides/FY1RetrospectiveSlide";
import { StrategicAlignmentSlide } from "@/components/slides/StrategicAlignmentSlide";
import { AccountTeamSlide } from "@/components/slides/AccountTeamSlide";
import AgileTeamModelSlide from "@/components/slides/AgileTeamModelSlide";
import { SWOTSlide } from "@/components/slides/SWOTSlide";
import { CoreValueDriversSlide } from "@/components/slides/CoreValueDriversSlide";
import { BigBetsSlide } from "@/components/slides/BigBetsSlide";
import { WorkstreamDetailSlide } from "@/components/slides/WorkstreamDetailSlide";
import { AIUseCasesSlide } from "@/components/slides/AIUseCasesSlide";
import { PlatformSlide } from "@/components/slides/PlatformSlide";
import { RoadmapSlide } from "@/components/slides/RoadmapSlide";
import { RiskMitigationSlide } from "@/components/slides/RiskMitigationSlide";
import { GovernanceSlide } from "@/components/slides/GovernanceSlide";
import { WeeklyUpdateSlide } from "@/components/slides/WeeklyUpdateSlide";
import { ExecutiveEngagementSlide } from "@/components/slides/ExecutiveEngagementSlide";
import { PursuitPlanSlide } from "@/components/slides/PursuitPlanSlide";
import { KeyAsksSlide } from "@/components/slides/KeyAsksSlide";
import { ExecutionTimelineSlide } from "@/components/slides/ExecutionTimelineSlide";
import { SuccessSlide } from "@/components/slides/SuccessSlide";
import { ImprovedSlideComponent } from "@/components/slides/ImprovedSlideComponent";
import { PPTSlideRenderer } from "@/components/slides/PPTSlideRenderer";
import { useAccountData } from "@/context/AccountDataContext";

// Default slides for annual report / manual input flow
const defaultSlides = [
  { component: InputFormSlide, label: "Input Form", isForm: true },
  { component: CoverSlide, label: "Cover" },
  { component: ExecutiveSummarySlide, label: "1. Executive Summary" },
  { component: CustomerSnapshotSlide, label: "2. Customer Snapshot" },
  { component: CustomerStrategySlide, label: "3. Customer Strategy" },
  { component: AccountStrategySlide, label: "4. Account Strategy" },
  { component: FY1RetrospectiveSlide, label: "5. FY-1 Retrospective" },
  { component: StrategicAlignmentSlide, label: "6. Strategic Alignment" },
  { component: AccountTeamSlide, label: "7. Account Team" },
  { component: AgileTeamModelSlide, label: "8. Agile Team Model" },
  { component: SWOTSlide, label: "9. SWOT Analysis" },
  { component: CoreValueDriversSlide, label: "9. Value Drivers" },
  { component: BigBetsSlide, label: "10. Key Workstreams" },
  { component: WorkstreamDetailSlide, label: "11. Workstream Detail" },
  { component: AIUseCasesSlide, label: "12. AI Portfolio" },
  { component: PlatformSlide, label: "13. Platform Vision" },
  { component: RoadmapSlide, label: "14. Roadmap" },
  { component: RiskMitigationSlide, label: "15. Risk & Mitigation" },
  { component: GovernanceSlide, label: "16. Governance" },
  { component: WeeklyUpdateSlide, label: "17. Weekly Update" },
  { component: ExecutiveEngagementSlide, label: "18. Engagement" },
  { component: PursuitPlanSlide, label: "18. Pursuit Plan" },
  { component: KeyAsksSlide, label: "19. Key Asks" },
  { component: ExecutionTimelineSlide, label: "20. Execution Timeline" },
  { component: SuccessSlide, label: "21. Success Metrics" },
];

const Index = () => {
  const { data, setImprovedPresentation, setEnhancedPresentation } = useAccountData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSlideIndex, setExportSlideIndex] = useState<number | null>(null);
  const [talkingNotesOpen, setTalkingNotesOpen] = useState(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const savedSlideRef = useRef<number>(0);

  // Check if we're in PPT mode (enhanced or legacy improved presentation)
  const enhancedPresentation = data.enhancedPresentation;
  const isPPTMode = !!enhancedPresentation || !!data.improvedPresentation;
  const improvedPresentation = data.improvedPresentation;

  // Build active slides based on mode
  const activeSlides = useMemo(() => {
    // Enhanced PPT mode with pixel-perfect layout
    if (enhancedPresentation) {
      return [
        { label: "Input Form", isForm: true, component: InputFormSlide },
        ...enhancedPresentation.slides.map((slide) => ({
          label: `${slide.slideNumber}. ${slide.title}`,
          isForm: false,
          enhancedSlide: slide,
          theme: enhancedPresentation.extractedTheme,
        })),
      ];
    }
    // Legacy improved presentation mode
    if (isPPTMode && improvedPresentation) {
      return [
        { label: "Input Form", isForm: true, component: InputFormSlide },
        ...improvedPresentation.slides.map((slide) => ({
          label: `${slide.slideNumber}. ${slide.title}`,
          isForm: false,
          pptSlide: slide,
        })),
      ];
    }
    // Default mode: use standard slide deck
    return defaultSlides;
  }, [isPPTMode, improvedPresentation, enhancedPresentation]);

  // Get slide labels for navigation
  const slideLabels = useMemo(() => activeSlides.map((s) => s.label), [activeSlides]);

  const goToPrevious = useCallback(() => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(activeSlides.length - 1, prev + 1));
  }, [activeSlides.length]);

  const goToFirstSlide = useCallback(() => {
    setCurrentSlide(1); // Navigate to first content slide (after Input Form)
  }, []);

  // Navigate to first content slide after accepting PPT improvements
  const handleAcceptImprovedSlides = useCallback(() => {
    setCurrentSlide(1); // First PPT slide (index 1, after Input Form)
  }, []);

  // Reset to default mode (exit PPT mode)
  const handleResetToDefault = useCallback(() => {
    setImprovedPresentation(undefined);
    setEnhancedPresentation(undefined);
    setCurrentSlide(0);
  }, [setImprovedPresentation, setEnhancedPresentation]);

  // Export handlers
  const handleExportStart = useCallback(() => {
    savedSlideRef.current = currentSlide;
    setIsExporting(true);
  }, [currentSlide]);

  const handleExportSlide = useCallback(async (index: number) => {
    setExportSlideIndex(index);
    setCurrentSlide(index);
    return new Promise<void>((resolve) => {
      setTimeout(resolve, 100);
    });
  }, []);

  const handleExportEnd = useCallback(() => {
    setIsExporting(false);
    setExportSlideIndex(null);
    setCurrentSlide(savedSlideRef.current);
  }, []);

  const getSlideElement = useCallback(() => {
    return slideContainerRef.current;
  }, []);

  const handleOpenTalkingNotes = useCallback(() => {
    setTalkingNotesOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isExporting) return;

      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "n" || e.key === "N") {
        // Toggle speaker notes with 'N' key in PPT mode
        if (isPPTMode) {
          e.preventDefault();
          setShowSpeakerNotes((prev) => !prev);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious, isExporting, isPPTMode]);

  // Render the current slide
  const renderCurrentSlide = () => {
    const currentSlideConfig = activeSlides[currentSlide];
    if (!currentSlideConfig) return null;

    // Check if it's an enhanced PPT slide (pixel-perfect)
    if ("enhancedSlide" in currentSlideConfig && currentSlideConfig.enhancedSlide) {
      return (
        <PPTSlideRenderer 
          slide={currentSlideConfig.enhancedSlide} 
          showNotes={showSpeakerNotes}
          theme={currentSlideConfig.theme || enhancedPresentation?.extractedTheme || {
            colors: { accent1: '#84CC16', accent2: '#22D3EE', accent3: '#A855F7', background1: '#0B1D26', background2: '#1a3a4a', text1: '#FFFFFF', text2: '#94A3B8' },
            fonts: { heading: 'Inter', body: 'Inter' }
          }}
        />
      );
    }

    // Check if it's a legacy PPT slide
    if ("pptSlide" in currentSlideConfig && currentSlideConfig.pptSlide) {
      return (
        <ImprovedSlideComponent 
          slide={currentSlideConfig.pptSlide} 
          showNotes={showSpeakerNotes} 
        />
      );
    }

    // Default slide component
    if ("component" in currentSlideConfig && currentSlideConfig.component) {
      const CurrentSlideComponent = currentSlideConfig.component;
      
      if (currentSlideConfig.isForm) {
        return (
          <CurrentSlideComponent 
            onGenerate={goToFirstSlide} 
            onAcceptImprovedSlides={handleAcceptImprovedSlides} 
          />
        );
      }

      return <CurrentSlideComponent />;
    }

    return null;
  };

  return (
    <div className="min-h-screen gradient-hero relative overflow-y-auto">
      {/* Background decorations - hidden during export */}
      {!isExporting && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        </div>
      )}

      {/* PPT Mode Indicator */}
      {isPPTMode && !isExporting && currentSlide > 0 && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs text-blue-400 font-medium">
            PPT Mode • {improvedPresentation?.totalSlides} slides
          </span>
          <button
            onClick={handleResetToDefault}
            className="px-3 py-1.5 rounded-full bg-slate-700/50 border border-slate-600/30 text-xs text-slate-300 hover:bg-slate-600/50 transition-colors"
          >
            Exit PPT Mode
          </button>
          <button
            onClick={() => setShowSpeakerNotes((prev) => !prev)}
            className={`px-3 py-1.5 rounded-full border text-xs transition-colors ${
              showSpeakerNotes 
                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" 
                : "bg-slate-700/50 border-slate-600/30 text-slate-300 hover:bg-slate-600/50"
            }`}
          >
            {showSpeakerNotes ? "Hide Notes" : "Show Notes"}
          </button>
        </div>
      )}

      {/* Slide container */}
      <div
        ref={slideContainerRef}
        className={`relative z-10 ${isExporting ? "" : "animate-fade-in"} ${talkingNotesOpen ? "mr-[420px]" : ""}`}
        key={`slide-${currentSlide}`}
        style={
          isExporting
            ? {
                width: "1920px",
                height: "1080px",
                overflow: "hidden",
                background: "linear-gradient(135deg, #0B1D26 0%, #1a3a4a 50%, #0B1D26 100%)",
              }
            : undefined
        }
      >
        {renderCurrentSlide()}
      </div>

      <SlideNavigation
        currentSlide={currentSlide}
        totalSlides={activeSlides.length}
        onPrevious={goToPrevious}
        onNext={goToNext}
        slideLabels={slideLabels}
        onExportStart={handleExportStart}
        onExportSlide={handleExportSlide}
        onExportEnd={handleExportEnd}
        getSlideElement={getSlideElement}
        onOpenTalkingNotes={handleOpenTalkingNotes}
        talkingNotesOpen={talkingNotesOpen}
      />

      <TalkingNotesPanel
        isOpen={talkingNotesOpen}
        onClose={() => setTalkingNotesOpen(false)}
        currentSlideIndex={currentSlide}
        slideLabels={slideLabels}
      />

      <SlideFooter />
    </div>
  );
};

export default Index;
