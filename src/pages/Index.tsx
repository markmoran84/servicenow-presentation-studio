import { useState, useCallback, useEffect, useRef } from "react";
import { SlideNavigation } from "@/components/slides/SlideNavigation";
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
import { RiskRadarSlide } from "@/components/slides/RiskRadarSlide";
import { GovernanceSlide } from "@/components/slides/GovernanceSlide";
import { WeeklyUpdateSlide } from "@/components/slides/WeeklyUpdateSlide";
import { ExecutiveEngagementSlide } from "@/components/slides/ExecutiveEngagementSlide";
import { PursuitPlanSlide } from "@/components/slides/PursuitPlanSlide";
import { SuccessSlide } from "@/components/slides/SuccessSlide";
import { IntegratorStrategySlide } from "@/components/slides/IntegratorStrategySlide";
import { AIChatAssistant } from "@/components/AIChatAssistant";

const SLIDE_DESIGN_WIDTH = 1920;
const SLIDE_DESIGN_HEIGHT = 1080;

const slides = [
  { component: InputFormSlide, label: "Input Form", isForm: true },
  { component: CoverSlide, label: "Cover" },
  { component: ExecutiveSummarySlide, label: "1. Executive Summary" },
  { component: CustomerSnapshotSlide, label: "2. Customer Snapshot" },
  { component: IntegratorStrategySlide, label: "3. Integrator Strategy" },
  { component: CustomerStrategySlide, label: "4. Customer Strategy" },
  { component: AccountStrategySlide, label: "5. Account Strategy" },
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
  { component: RiskRadarSlide, label: "15. Risk Radar" },
  { component: RiskMitigationSlide, label: "16. Risk & Mitigation" },
  { component: GovernanceSlide, label: "18. Governance" },
  { component: WeeklyUpdateSlide, label: "19. Weekly Update" },
  { component: ExecutiveEngagementSlide, label: "20. Engagement" },
  { component: PursuitPlanSlide, label: "21. Pursuit Plan" },
  { component: SuccessSlide, label: "22. Success Metrics" },
];

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSlideIndex, setExportSlideIndex] = useState<number | null>(null);

  const slideContainerRef = useRef<HTMLDivElement>(null);
  const savedSlideRef = useRef<number>(0);

  // Used only for on-screen presentation slides.
  // We scale a fixed 1920×1080 "stage" to avoid aspect-ratio distortion.
  const presentationViewportRef = useRef<HTMLDivElement>(null);
  const [presentationScale, setPresentationScale] = useState(1);

  const goToPrevious = useCallback(() => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
  }, []);

  const goToFirstSlide = useCallback(() => {
    setCurrentSlide(1); // Navigate to Cover slide
  }, []);

  // Export handlers
  const handleExportStart = useCallback(() => {
    savedSlideRef.current = currentSlide;
    setIsExporting(true);
  }, [currentSlide]);

  const handleExportSlide = useCallback(async (index: number) => {
    setExportSlideIndex(index);
    setCurrentSlide(index);
    // Return a promise that resolves after state update and render
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isExporting) return; // Disable keyboard nav during export

      // Ignore if user is typing in an input/textarea
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious, isExporting]);

  // Keep the on-screen slide stage perfectly 16:9 by scaling a fixed 1920×1080 canvas.
  useEffect(() => {
    if (isExporting) return;
    const viewport = presentationViewportRef.current;
    if (!viewport) return;

    const update = () => {
      const rect = viewport.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (!w || !h) return;
      const nextScale = Math.min(w / SLIDE_DESIGN_WIDTH, h / SLIDE_DESIGN_HEIGHT);
      setPresentationScale(nextScale || 1);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(viewport);
    return () => ro.disconnect();
  }, [isExporting, currentSlide]);

  const currentSlideConfig = slides[currentSlide];
  const CurrentSlideComponent = currentSlideConfig.component;

  // Is this a form slide (needs full screen scrolling) or presentation slide (needs 16:9)?
  const isFormSlide = currentSlideConfig.isForm;

  return (
    <div className="min-h-screen gradient-hero relative flex flex-col">
      {/* Background decorations - hidden during export */}
      {!isExporting && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        </div>
      )}

      {/* Main content area */}
      {isFormSlide ? (
        /* Form slides - full screen scrollable */
        <div className="flex-1 overflow-auto pb-24">
          <div
            ref={slideContainerRef}
            className={`relative z-10 ${isExporting ? "" : "animate-fade-in"}`}
            key={currentSlide}
          >
            <CurrentSlideComponent onGenerate={goToFirstSlide} />
          </div>
        </div>
      ) : isExporting ? (
        /* Export mode - force exact 1920×1080 for pixel-perfect capture */
        <div className="flex-1 flex items-center justify-center pb-20 px-4 overflow-hidden">
          <div
            ref={slideContainerRef}
            className={`relative z-10 ${isExporting ? "" : "animate-fade-in"}`}
            key={currentSlide}
            style={{
              width: `${SLIDE_DESIGN_WIDTH}px`,
              height: `${SLIDE_DESIGN_HEIGHT}px`,
              overflow: "hidden",
              background:
                "linear-gradient(135deg, #0B1D26 0%, #1a3a4a 50%, #0B1D26 100%)",
            }}
          >
            <CurrentSlideComponent />
          </div>
        </div>
      ) : (
        /* Presentation slides - 16:9 stage scaled to viewport (no squashing) */
        <div
          ref={presentationViewportRef}
          className="flex-1 flex items-center justify-center pb-20 px-4 overflow-hidden"
        >
          <div
            className={`relative z-10 ${exportSlideIndex === currentSlide ? "" : "animate-fade-in"}`}
            style={{
              width: `${SLIDE_DESIGN_WIDTH * presentationScale}px`,
              height: `${SLIDE_DESIGN_HEIGHT * presentationScale}px`,
            }}
          >
            <div
              ref={slideContainerRef}
              key={currentSlide}
              style={{
                position: "absolute",
                inset: 0,
                width: `${SLIDE_DESIGN_WIDTH}px`,
                height: `${SLIDE_DESIGN_HEIGHT}px`,
                transform: `scale(${presentationScale})`,
                transformOrigin: "top left",
                overflow: "hidden",
              }}
            >
              <CurrentSlideComponent />
            </div>
          </div>
        </div>
      )}

      <SlideNavigation
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onPrevious={goToPrevious}
        onNext={goToNext}
        slideLabels={slides.map((s) => s.label)}
        onExportStart={handleExportStart}
        onExportSlide={handleExportSlide}
        onExportEnd={handleExportEnd}
        getSlideElement={getSlideElement}
      />

      {/* AI Chat Assistant - floating button */}
      <AIChatAssistant />
    </div>
  );
};

export default Index;
