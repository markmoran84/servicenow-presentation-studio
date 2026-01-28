import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { SlideFooter } from "@/components/SlideFooter";
import { SlideNavigation } from "@/components/slides/SlideNavigation";
import { TalkingNotesPanel } from "@/components/TalkingNotesPanel";
import { InputFormSlide } from "@/components/slides/InputFormSlide";
import { CoverSlide } from "@/components/slides/CoverSlide";
import { CustomerSnapshotSlide } from "@/components/slides/CustomerSnapshotSlide";
import { FY1RetrospectiveSlide } from "@/components/slides/FY1RetrospectiveSlide";
import { CustomerStrategySlide } from "@/components/slides/CustomerStrategySlide";
import { AccountStrategySlide } from "@/components/slides/AccountStrategySlide";
import { AccountTeamSlide } from "@/components/slides/AccountTeamSlide";
import { StrategicPrioritiesSlide } from "@/components/slides/StrategicPrioritiesSlide";
import { BigBetsSlide } from "@/components/slides/BigBetsSlide";
import { BigBetDeepDiveSlide } from "@/components/slides/BigBetDeepDiveSlide";
import { WorkstreamDetailSlide } from "@/components/slides/WorkstreamDetailSlide";
import { RoadmapSlide } from "@/components/slides/RoadmapSlide";
import { PursuitPlanSlide } from "@/components/slides/PursuitPlanSlide";
import { ClosePlanSlide } from "@/components/slides/ClosePlanSlide";
import { SWOTSlide } from "@/components/slides/SWOTSlide";
import { BusinessCanvasSlide } from "@/components/slides/BusinessCanvasSlide";
import { KeyAsksSlide } from "@/components/slides/KeyAsksSlide";
import { KeyRisksSlide } from "@/components/slides/KeyRisksSlide";
import { RiskMitigationSlide } from "@/components/slides/RiskMitigationSlide";
import { ThankYouSlide } from "@/components/slides/ThankYouSlide";
import { PresentationSlide } from "@/components/slides/PresentationSlide";
import { PPTSlideRenderer } from "@/components/slides/PPTSlideRenderer";
import { useAccountData, BigBet } from "@/context/AccountDataContext";

// Static slides that don't depend on big bets count
const staticSlidesBefore = [
  { component: InputFormSlide, label: "Input Form", isForm: true },
  { component: CoverSlide, label: "Cover" },
  { component: CustomerSnapshotSlide, label: "1. Customer Snapshot" },
  { component: BusinessCanvasSlide, label: "2. Business Model" },
  { component: FY1RetrospectiveSlide, label: "3. FY25 Retrospective" },
  { component: AccountTeamSlide, label: "4. Account Team" },
  { component: CustomerStrategySlide, label: "5. Customer Strategy" },
  { component: StrategicPrioritiesSlide, label: "6. Strategic Priorities" },
  { component: AccountStrategySlide, label: "7. Account Strategy" },
  { component: BigBetsSlide, label: "8. Key Workstreams" },
];

const staticSlidesAfter = [
  { component: WorkstreamDetailSlide, label: "Workstream Summary" },
  { component: RoadmapSlide, label: "Roadmap" },
  { component: PursuitPlanSlide, label: "Pursuit Plan" },
  { component: ClosePlanSlide, label: "Close Plan" },
  { component: SWOTSlide, label: "SWOT Analysis" },
  { component: KeyAsksSlide, label: "Key Asks" },
  { component: KeyRisksSlide, label: "Key Risks" },
  { component: RiskMitigationSlide, label: "Risk & Mitigation" },
  { component: ThankYouSlide, label: "Thank You" },
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

  // Get big bets for dynamic deep dive slides
  const bigBets: BigBet[] = data.accountStrategy?.bigBets?.length > 0 
    ? data.accountStrategy.bigBets
    : data.generatedPlan?.keyWorkstreams?.map(ws => ({
        title: ws.title,
        subtitle: ws.subtitle || "Strategic Initiative",
        sponsor: "",
        dealStatus: (ws.dealStatus as BigBet["dealStatus"]) || "Pipeline",
        targetClose: ws.targetClose,
        netNewACV: ws.acv,
        steadyStateBenefit: ws.steadyStateBenefit || "TBD",
        insight: ws.insight,
        people: ws.people || [],
        products: [],
      })) || [];

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
    
    // Default mode: build dynamic slides with deep dives for each big bet
    const deepDiveSlides = bigBets.map((bet, index) => ({
      component: () => <BigBetDeepDiveSlide betIndex={index} />,
      label: `7.${index + 1}. ${bet.title}`,
      isDeepDive: true,
      betIndex: index,
    }));

    // Calculate slide numbers dynamically
    const beforeCount = staticSlidesBefore.length; // 9 slides (including input form)
    const deepDiveCount = deepDiveSlides.length;
    
    // Renumber the after slides
    const numberedAfterSlides = staticSlidesAfter.map((slide, index) => ({
      ...slide,
      label: `${beforeCount + deepDiveCount + index}. ${slide.label.replace(/^\d+\.\s*/, '')}`,
    }));

    return [
      ...staticSlidesBefore,
      ...deepDiveSlides,
      ...numberedAfterSlides,
    ];
  }, [isPPTMode, improvedPresentation, enhancedPresentation, bigBets]);

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
        <PresentationSlide 
          slide={currentSlideConfig.pptSlide} 
          companyName={improvedPresentation?.companyName || data.basics.accountName || "Company"}
          showNotes={showSpeakerNotes} 
        />
      );
    }

    // Default slide component
    if ("component" in currentSlideConfig && currentSlideConfig.component) {
      const CurrentSlideComponent = currentSlideConfig.component;
      
      if ("isForm" in currentSlideConfig && currentSlideConfig.isForm) {
        return (
          <CurrentSlideComponent 
            onGenerate={goToFirstSlide} 
            onAcceptImprovedSlides={handleAcceptImprovedSlides}
            onNavigateToSlide={setCurrentSlide}
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
