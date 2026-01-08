import { useState, useCallback, useEffect } from "react";
import { AccountDataProvider } from "@/context/AccountDataContext";
import { SlideFooter } from "@/components/SlideFooter";
import { SlideNavigation } from "@/components/slides/SlideNavigation";
import { InputFormSlide } from "@/components/slides/InputFormSlide";
import { ExecutiveSummarySlide } from "@/components/slides/ExecutiveSummarySlide";
import { CustomerOverviewSlide } from "@/components/slides/CustomerOverviewSlide";
import { StrategicAlignmentSlide } from "@/components/slides/StrategicAlignmentSlide";
import { FY1RetrospectiveSlide } from "@/components/slides/FY1RetrospectiveSlide";
import { CurrentStateSlide } from "@/components/slides/CurrentStateSlide";
import { StrategicObservationSlide } from "@/components/slides/StrategicObservationSlide";
import { StrategicImplicationSlide } from "@/components/slides/StrategicImplicationSlide";
import { StrategicTensionSlide } from "@/components/slides/StrategicTensionSlide";
import { InsightSlide } from "@/components/slides/InsightSlide";
import { ValueHypothesisSlide } from "@/components/slides/ValueHypothesisSlide";
import { CoreValueDriversSlide } from "@/components/slides/CoreValueDriversSlide";
import { BigBetsSlide } from "@/components/slides/BigBetsSlide";
import { AIUseCasesSlide } from "@/components/slides/AIUseCasesSlide";
import { AutomationSlide } from "@/components/slides/AutomationSlide";
import { PlatformSlide } from "@/components/slides/PlatformSlide";
import { RoadmapSlide } from "@/components/slides/RoadmapSlide";
import { GovernanceSlide } from "@/components/slides/GovernanceSlide";
import { ExecutiveEngagementSlide } from "@/components/slides/ExecutiveEngagementSlide";
import { ClosePlanSlide } from "@/components/slides/ClosePlanSlide";
import { SuccessSlide } from "@/components/slides/SuccessSlide";

const slides = [
  { component: InputFormSlide, label: "Input Form" },
  { component: ExecutiveSummarySlide, label: "1. Executive Summary" },
  { component: CustomerOverviewSlide, label: "2. Customer Overview" },
  { component: StrategicAlignmentSlide, label: "3. Strategy & Direction" },
  { component: FY1RetrospectiveSlide, label: "4. FY-1 Retrospective" },
  { component: CurrentStateSlide, label: "5. Current State" },
  { component: StrategicObservationSlide, label: "6. Observation" },
  { component: StrategicImplicationSlide, label: "7. Implication" },
  { component: StrategicTensionSlide, label: "8. Tension" },
  { component: InsightSlide, label: "9. Insight" },
  { component: ValueHypothesisSlide, label: "10. Value Hypothesis" },
  { component: CoreValueDriversSlide, label: "11. Value Drivers" },
  { component: BigBetsSlide, label: "12. Big Bets" },
  { component: AIUseCasesSlide, label: "13. AI Use Cases" },
  { component: AutomationSlide, label: "14. Automation" },
  { component: PlatformSlide, label: "15. Platform" },
  { component: RoadmapSlide, label: "16. Roadmap" },
  { component: GovernanceSlide, label: "17. Governance" },
  { component: ExecutiveEngagementSlide, label: "18. Engagement" },
  { component: ClosePlanSlide, label: "19. Close Plan" },
  { component: SuccessSlide, label: "20. Success" },
];

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToPrevious = useCallback(() => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious]);

  const CurrentSlideComponent = slides[currentSlide].component;

  return (
    <AccountDataProvider>
      <div className="min-h-screen gradient-hero relative overflow-y-auto">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative z-10 animate-fade-in" key={currentSlide}>
          <CurrentSlideComponent />
        </div>

        <SlideNavigation
          currentSlide={currentSlide}
          totalSlides={slides.length}
          onPrevious={goToPrevious}
          onNext={goToNext}
          slideLabels={slides.map((s) => s.label)}
        />

        <SlideFooter />
      </div>
    </AccountDataProvider>
  );
};

export default Index;
