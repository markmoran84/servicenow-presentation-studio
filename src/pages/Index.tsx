import { useState, useCallback, useEffect } from "react";
import { AccountDataProvider } from "@/context/AccountDataContext";
import { SlideFooter } from "@/components/SlideFooter";
import { SlideNavigation } from "@/components/slides/SlideNavigation";
import { InputFormSlide } from "@/components/slides/InputFormSlide";
import { CoverSlide } from "@/components/slides/CoverSlide";
import { ExecutiveSummarySlide } from "@/components/slides/ExecutiveSummarySlide";
import { CustomerSnapshotSlide } from "@/components/slides/CustomerSnapshotSlide";
import { CustomerStrategySlide } from "@/components/slides/CustomerStrategySlide";
import { FY1RetrospectiveSlide } from "@/components/slides/FY1RetrospectiveSlide";
import { StrategicAlignmentSlide } from "@/components/slides/StrategicAlignmentSlide";
import { AccountTeamSlide } from "@/components/slides/AccountTeamSlide";
import { SWOTSlide } from "@/components/slides/SWOTSlide";
import { CoreValueDriversSlide } from "@/components/slides/CoreValueDriversSlide";
import { BigBetsSlide } from "@/components/slides/BigBetsSlide";
import { AIUseCasesSlide } from "@/components/slides/AIUseCasesSlide";
import { PlatformSlide } from "@/components/slides/PlatformSlide";
import { RoadmapSlide } from "@/components/slides/RoadmapSlide";
import { RiskMitigationSlide } from "@/components/slides/RiskMitigationSlide";
import { GovernanceSlide } from "@/components/slides/GovernanceSlide";
import { ExecutiveEngagementSlide } from "@/components/slides/ExecutiveEngagementSlide";
import { PursuitPlanSlide } from "@/components/slides/PursuitPlanSlide";
import { SuccessSlide } from "@/components/slides/SuccessSlide";

const slides = [
  { component: InputFormSlide, label: "Input Form", isForm: true },
  { component: CoverSlide, label: "Cover" },
  { component: ExecutiveSummarySlide, label: "1. Executive Summary" },
  { component: CustomerSnapshotSlide, label: "2. Customer Snapshot" },
  { component: CustomerStrategySlide, label: "3. Customer Strategy" },
  { component: FY1RetrospectiveSlide, label: "4. FY-1 Retrospective" },
  { component: StrategicAlignmentSlide, label: "5. Strategic Alignment" },
  { component: AccountTeamSlide, label: "6. Account Team" },
  { component: SWOTSlide, label: "7. SWOT Analysis" },
  { component: CoreValueDriversSlide, label: "8. Value Drivers" },
  { component: BigBetsSlide, label: "9. Key Workstreams" },
  { component: AIUseCasesSlide, label: "10. AI Portfolio" },
  { component: PlatformSlide, label: "11. Platform Vision" },
  { component: RoadmapSlide, label: "12. Roadmap" },
  { component: RiskMitigationSlide, label: "13. Risk & Mitigation" },
  { component: GovernanceSlide, label: "14. Governance" },
  { component: ExecutiveEngagementSlide, label: "15. Engagement" },
  { component: PursuitPlanSlide, label: "16. Pursuit Plan" },
  { component: SuccessSlide, label: "17. Success Metrics" },
];

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToPrevious = useCallback(() => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
  }, []);

  const goToFirstSlide = useCallback(() => {
    setCurrentSlide(1); // Navigate to Cover slide
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

  const currentSlideConfig = slides[currentSlide];
  const CurrentSlideComponent = currentSlideConfig.component;

  return (
    <AccountDataProvider>
      <div className="min-h-screen gradient-hero relative overflow-y-auto">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative z-10 animate-fade-in" key={currentSlide}>
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
        />

        <SlideFooter />
      </div>
    </AccountDataProvider>
  );
};

export default Index;
