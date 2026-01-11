import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAccountData } from "@/context/AccountDataContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

export type RegeneratablePlanSection =
  | "executiveSummary"
  | "keyWorkstreams"
  | "strategicPriorities"
  | "coreValueDrivers"
  | "aiUseCases"
  | "successMetrics"
  | "roadmapPhases"
  | "strategicObservations"
  | "strategicImplications"
  | "strategicTensions"
  | "valueHypotheses"
  | "risksMitigations"
  | "fy1Retrospective"
  | "customerStrategySynthesis"
  | "weeklyUpdateContext"
  | "marketingPlan"
  | "insight"
  | "platformCapabilities"
  | "riskOpportunityMatrix"
  | "strategicAlignment";

const sectionMeta: Record<
  RegeneratablePlanSection,
  { label: string; planKeys: string[] }
> = {
  executiveSummary: {
    label: "Executive Summary",
    planKeys: ["executiveSummaryNarrative", "executiveSummaryPillars"],
  },
  keyWorkstreams: {
    label: "Key Workstreams",
    planKeys: ["keyWorkstreams"],
  },
  strategicPriorities: {
    label: "Strategic Priorities",
    planKeys: ["strategicPriorities"],
  },
  coreValueDrivers: {
    label: "Core Value Drivers",
    planKeys: ["coreValueDrivers"],
  },
  aiUseCases: {
    label: "AI Use Cases",
    planKeys: ["aiUseCases"],
  },
  successMetrics: {
    label: "Success Metrics",
    planKeys: ["successMetrics"],
  },
  roadmapPhases: {
    label: "Roadmap Phases",
    planKeys: ["roadmapPhases"],
  },
  strategicObservations: {
    label: "Strategic Observations",
    planKeys: ["strategicObservations"],
  },
  strategicImplications: {
    label: "Strategic Implications",
    planKeys: ["strategicImplications"],
  },
  strategicTensions: {
    label: "Strategic Tensions",
    planKeys: ["strategicTensions"],
  },
  valueHypotheses: {
    label: "Value Hypotheses",
    planKeys: ["valueHypotheses"],
  },
  risksMitigations: {
    label: "Risks & Mitigations",
    planKeys: ["risksMitigations"],
  },
  fy1Retrospective: {
    label: "FY-1 Retrospective",
    planKeys: ["fy1Retrospective"],
  },
  customerStrategySynthesis: {
    label: "Customer Strategy Synthesis",
    planKeys: ["customerStrategySynthesis"],
  },
  weeklyUpdateContext: {
    label: "Weekly Update",
    planKeys: ["weeklyUpdateContext"],
  },
  marketingPlan: {
    label: "Marketing Plan",
    planKeys: ["marketingPlan"],
  },
  insight: {
    label: "Strategic Insight",
    planKeys: ["insight"],
  },
  platformCapabilities: {
    label: "Platform Capabilities",
    planKeys: ["platformCapabilities"],
  },
  riskOpportunityMatrix: {
    label: "Risk/Opportunity Matrix",
    planKeys: ["riskOpportunityMatrix"],
  },
  strategicAlignment: {
    label: "Strategic Alignment",
    planKeys: ["strategicAlignment"],
  },
};

export function RegenerateSectionButton({
  section,
}: {
  section: RegeneratablePlanSection;
}) {
  const { data, patchGeneratedPlan } = useAccountData();
  const [isLoading, setIsLoading] = useState(false);

  const meta = sectionMeta[section];

  const hasSection = useMemo(() => {
    const gp: any = data.generatedPlan;
    return meta.planKeys.some((k) => gp?.[k] != null);
  }, [data.generatedPlan, meta.planKeys]);

  const actionVerb = hasSection ? "Regenerate" : "Generate";

  const handleClick = async () => {
    setIsLoading(true);

    const toastId = `regen-${section}`;
    toast.loading(`${actionVerb} ${meta.label}...`, { id: toastId });

    try {
      const { data: responseData, error } = await supabase.functions.invoke(
        "regenerate-plan-section",
        {
          body: {
            section,
            accountData: data,
          },
        },
      );

      if (error) {
        console.error("Section regeneration error:", error);
        throw error;
      }

      if (!responseData?.success) {
        throw new Error(responseData?.error || "Failed to regenerate section");
      }

      patchGeneratedPlan(responseData.patch);
      toast.success(`${meta.label} updated.`, { id: toastId });
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Failed to regenerate section.", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={handleClick}
      disabled={isLoading}
    >
      <RefreshCw className={isLoading ? "w-3 h-3 animate-spin" : "w-3 h-3"} />
      {actionVerb}
    </Button>
  );
}
