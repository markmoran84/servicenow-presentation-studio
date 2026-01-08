import { useState, useCallback, useEffect } from "react";
import { SlideFooter } from "@/components/SlideFooter";
import { SlideNavigation } from "@/components/slides/SlideNavigation";
import { ExecutiveSummarySlide } from "@/components/slides/ExecutiveSummarySlide";
import { StrategicAlignmentSlide } from "@/components/slides/StrategicAlignmentSlide";
import { AccountTeamSlide } from "@/components/slides/AccountTeamSlide";
import { BigBetsSlide } from "@/components/slides/BigBetsSlide";
import { BusinessPerformanceSlide } from "@/components/slides/BusinessPerformanceSlide";
import { RiskOpportunitySlide } from "@/components/slides/RiskOpportunitySlide";
import { FinancialOpportunitySlide } from "@/components/slides/FinancialOpportunitySlide";
import { ClosePlanSlide } from "@/components/slides/ClosePlanSlide";
import { GovernanceSlide } from "@/components/slides/GovernanceSlide";
import { MarketingPlanSlide } from "@/components/slides/MarketingPlanSlide";

const slides = [
  { component: ExecutiveSummarySlide, label: "Executive Summary" },
  { component: StrategicAlignmentSlide, label: "Strategic Alignment" },
  { component: AccountTeamSlide, label: "Account Team" },
  { component: BigBetsSlide, label: "Big Bets" },
  { component: BusinessPerformanceSlide, label: "Business Performance" },
  { component: RiskOpportunitySlide, label: "Risks & Opportunities" },
  { component: FinancialOpportunitySlide, label: "Financial Opportunity" },
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
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Slide content */}
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
  );
};

export default Index;
