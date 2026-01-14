import { useState, useCallback, useEffect, useRef } from "react";
import { SlideFooter } from "@/components/SlideFooter";
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
import { GovernanceSlide } from "@/components/slides/GovernanceSlide";
import { WeeklyUpdateSlide } from "@/components/slides/WeeklyUpdateSlide";
import { ExecutiveEngagementSlide } from "@/components/slides/ExecutiveEngagementSlide";
import { PursuitPlanSlide } from "@/components/slides/PursuitPlanSlide";
import { KeyAsksSlide } from "@/components/slides/KeyAsksSlide";
import { ExecutionTimelineSlide } from "@/components/slides/ExecutionTimelineSlide";
import { SuccessSlide } from "@/components/slides/SuccessSlide";

const slides = [
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSlideIndex, setExportSlideIndex] = useState<number | null>(null);
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const savedSlideRef = useRef<number>(0);

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
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
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

  const currentSlideConfig = slides[currentSlide];
  const CurrentSlideComponent = currentSlideConfig.component;

  return (
    <div className="min-h-screen gradient-hero relative overflow-y-auto">
      {/* Background decorations - hidden during export */}
      {!isExporting && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        </div>
      )}

      {/* Slide container - sized for export when exporting */}
      <div 
        ref={slideContainerRef}
        className={`relative z-10 ${isExporting ? '' : 'animate-fade-in'}`}
        key={currentSlide}
        style={isExporting ? {
          width: '1920px',
          height: '1080px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0B1D26 0%, #1a3a4a 50%, #0B1D26 100%)',
        } : undefined}
      >
        {currentSlideConfig.isForm ? (
          <CurrentSlideComponent onGenerate={goToFirstSlide} />
        ) : (
          <CurrentSlideComponent />
        )}
      </div>

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

      <SlideFooter />
    </div>
  );
};

export default Index;
