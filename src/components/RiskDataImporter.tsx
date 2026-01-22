import { Button } from "@/components/ui/button";
import { useAccountData } from "@/context/AccountDataContext";
import { maerskRiskData, riskOpportunityMatrixData, swotThreats, risksMitigationsData } from "@/utils/riskDataImport";
import { toast } from "sonner";
import { ShieldAlert, Check } from "lucide-react";

export function RiskDataImporter() {
  const { patchGeneratedPlan, updateData, data } = useAccountData();

  const handleImportRisks = () => {
    // Update keyRisks in generated plan
    patchGeneratedPlan({
      keyRisks: maerskRiskData,
      risksMitigations: risksMitigationsData,
      riskOpportunityMatrix: riskOpportunityMatrixData,
    });

    // Update SWOT threats
    updateData("swot", {
      ...data.swot,
      threats: swotThreats,
    });

    toast.success("Risk data imported successfully!", {
      description: `${maerskRiskData.length} key risks and ${swotThreats.length} SWOT threats added.`,
    });
  };

  const hasRisks = data.generatedPlan?.keyRisks && data.generatedPlan.keyRisks.length > 0;

  return (
    <Button
      onClick={handleImportRisks}
      variant={hasRisks ? "outline" : "default"}
      size="sm"
      className="gap-2"
    >
      {hasRisks ? (
        <>
          <Check className="w-4 h-4" />
          Update Risks
        </>
      ) : (
        <>
          <ShieldAlert className="w-4 h-4" />
          Import JP Risk Assessment
        </>
      )}
    </Button>
  );
}
