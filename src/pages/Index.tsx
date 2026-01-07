import { useState, useCallback, useEffect } from "react";
import { SlideFooter } from "@/components/SlideFooter";
import { SlideNavigation } from "@/components/slides/SlideNavigation";
import { AccountTeamSlide } from "@/components/slides/AccountTeamSlide";
import { CustomerOverviewSlide } from "@/components/slides/CustomerOverviewSlide";
import { BusinessPerformanceSlide } from "@/components/slides/BusinessPerformanceSlide";
import { StrategicPrioritiesSlide } from "@/components/slides/StrategicPrioritiesSlide";
import { GovernanceSlide } from "@/components/slides/GovernanceSlide";
import { MarketingPlanSlide } from "@/components/slides/MarketingPlanSlide";
import { StrategyMapSlide } from "@/components/slides/StrategyMapSlide";
import { RoadmapSlide } from "@/components/slides/RoadmapSlide";
import { ClosePlanSlide } from "@/components/slides/ClosePlanSlide";
import { RiskMatrixSlide } from "@/components/slides/RiskMatrixSlide";

const slides = [
  { component: AccountTeamSlide, label: "Account Team" },
  { component: CustomerOverviewSlide, label: "Customer Overview" },
  { component: BusinessPerformanceSlide, label: "Business Performance" },
  { component: StrategicPrioritiesSlide, label: "Strategic Priorities" },
  { component: StrategyMapSlide, label: "Strategy Map" },
  { component: RoadmapSlide, label: "Roadmap" },
  { component: RiskMatrixSlide, label: "Risk Matrix" },
  { component: ClosePlanSlide, label: "Close Plan" },
  { component: GovernanceSlide, label: "Governance" },
  { component: MarketingPlanSlide, label: "Marketing Plan" },
];

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToPrevious = useCallback(() => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
  }, []);

  // Keyboard navigation
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
    <div className="min-h-screen gradient-hero relative overflow-y-auto">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sn-navy/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Slide content with transition */}
      <div className="relative z-10 animate-fade-in" key={currentSlide}>
        <CurrentSlideComponent />
      </div>

      {/* Navigation */}
      <SlideNavigation
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onPrevious={goToPrevious}
        onNext={goToNext}
        slideLabels={slides.map((s) => s.label)}
      />

      <SlideFooter />
    </div>
  );
};

export default Index;
