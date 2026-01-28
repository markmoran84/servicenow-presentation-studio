import { useMemo } from "react";
import { AccountData } from "@/context/AccountDataContext";

export type CompletionStatus = "complete" | "partial" | "empty";

export interface SlideField {
  path: string; // e.g., "basics.accountName"
  label: string;
  required: boolean;
  type: "text" | "number" | "date" | "array" | "object";
  validation?: (value: any) => boolean;
  aiSuggestionPrompt?: string; // Prompt for AI to generate this field
}

export interface SlideRequirement {
  slideId: string;
  slideName: string;
  slideNumber: number;
  fields: SlideField[];
}

// Define what data each slide requires
export const slideRequirements: SlideRequirement[] = [
  {
    slideId: "cover",
    slideName: "Cover",
    slideNumber: 0,
    fields: [
      { path: "basics.accountName", label: "Account Name", required: true, type: "text" },
      { path: "basics.coreTeamMembers", label: "Core Team Members", required: false, type: "array" },
    ],
  },
  {
    slideId: "customer-snapshot",
    slideName: "Customer Snapshot",
    slideNumber: 1,
    fields: [
      { path: "basics.accountName", label: "Account Name", required: true, type: "text" },
      { path: "basics.industry", label: "Industry", required: true, type: "text" },
      { path: "financial.customerRevenue", label: "Customer Revenue", required: true, type: "text", validation: (v) => /^\$?[\d,.]+[BMKbmk]?$/.test(v) },
      { path: "financial.growthRate", label: "Growth Rate", required: false, type: "text" },
      { path: "financial.marginEBIT", label: "EBIT Margin", required: false, type: "text" },
      { path: "basics.numberOfEmployees", label: "Number of Employees", required: false, type: "text" },
      { path: "financial.costPressureAreas", label: "Cost Pressure Areas", required: false, type: "text" },
      { path: "basics.currentContractValue", label: "Current ACV", required: false, type: "text" },
      { path: "basics.nextFYAmbition", label: "Pipeline Value", required: false, type: "text" },
      { path: "basics.threeYearAmbition", label: "3-Year Target", required: false, type: "text" },
    ],
  },
  {
    slideId: "fy25-retrospective",
    slideName: "FY25 Retrospective",
    slideNumber: 2,
    fields: [
      { path: "history.lastPlanSummary", label: "Last Plan Summary", required: false, type: "text", aiSuggestionPrompt: "Generate a summary of what FY25 focused on based on the account context" },
      { path: "history.whatDidNotWork", label: "Lessons Learned", required: false, type: "text" },
      { path: "generatedPlan.fy1Retrospective", label: "AI Retrospective", required: false, type: "object" },
    ],
  },
  {
    slideId: "account-team",
    slideName: "Account Team",
    slideNumber: 3,
    fields: [
      { path: "basics.coreTeamMembers", label: "Core Team Members", required: true, type: "array" },
      { path: "basics.extendedTeam", label: "Extended Team", required: false, type: "array" },
    ],
  },
  {
    slideId: "customer-strategy",
    slideName: "Customer Strategy",
    slideNumber: 4,
    fields: [
      { path: "annualReport.visionStatement", label: "Vision Statement", required: false, type: "text", aiSuggestionPrompt: "Extract or generate the customer's vision statement" },
      { path: "annualReport.purposeStatement", label: "Purpose Statement", required: false, type: "text" },
      { path: "strategy.ceoBoardPriorities", label: "CEO/Board Priorities", required: true, type: "array" },
      { path: "annualReport.longTermAims", label: "Long-Term Aims", required: false, type: "array" },
      { path: "strategy.transformationThemes", label: "Transformation Themes", required: false, type: "array" },
    ],
  },
  {
    slideId: "strategic-priorities",
    slideName: "Strategic Priorities",
    slideNumber: 5,
    fields: [
      { path: "generatedPlan.strategicPriorities", label: "Strategic Priorities", required: true, type: "array" },
      { path: "strategy.corporateStrategy", label: "Corporate Strategy", required: false, type: "array" },
    ],
  },
  {
    slideId: "account-strategy",
    slideName: "Account Strategy",
    slideNumber: 6,
    fields: [
      { path: "accountStrategy.strategyNarrative", label: "Strategy Narrative", required: true, type: "text", aiSuggestionPrompt: "Generate an account strategy narrative based on the customer context" },
      { path: "basics.visionStatement", label: "Account Vision", required: false, type: "text" },
      { path: "accountStrategy.bigBets", label: "Big Bets / Focus Areas", required: true, type: "array" },
    ],
  },
  {
    slideId: "key-workstreams",
    slideName: "Key Workstreams",
    slideNumber: 7,
    fields: [
      { path: "accountStrategy.bigBets", label: "Workstreams", required: true, type: "array" },
    ],
  },
  {
    slideId: "workstream-detail",
    slideName: "Workstream Detail",
    slideNumber: 8,
    fields: [
      { path: "accountStrategy.bigBets", label: "Big Bets with Details", required: true, type: "array" },
    ],
  },
  {
    slideId: "roadmap",
    slideName: "Roadmap",
    slideNumber: 9,
    fields: [
      { path: "generatedPlan.roadmapPhases", label: "Roadmap Phases", required: false, type: "array" },
      { path: "basics.threeYearAmbition", label: "3-Year Target ACV", required: false, type: "text" },
    ],
  },
  {
    slideId: "pursuit-plan",
    slideName: "Pursuit Plan",
    slideNumber: 10,
    fields: [
      { path: "engagement.plannedExecutiveEvents", label: "Planned Executive Events", required: false, type: "array" },
      { path: "engagement.knownExecutiveSponsors", label: "Executive Sponsors", required: false, type: "array" },
    ],
  },
  {
    slideId: "close-plan",
    slideName: "Close Plan",
    slideNumber: 11,
    fields: [], // TBC placeholder
  },
  {
    slideId: "swot",
    slideName: "SWOT Analysis",
    slideNumber: 12,
    fields: [
      { path: "swot.strengths", label: "Strengths", required: true, type: "array", aiSuggestionPrompt: "Generate SWOT strengths for ServiceNow positioning at this customer" },
      { path: "swot.weaknesses", label: "Weaknesses", required: true, type: "array" },
      { path: "swot.opportunities", label: "Opportunities", required: true, type: "array" },
      { path: "swot.threats", label: "Threats", required: true, type: "array" },
    ],
  },
  {
    slideId: "key-asks",
    slideName: "Key Asks",
    slideNumber: 13,
    fields: [
      { path: "engagement.knownExecutiveSponsors", label: "P5 Leadership Contacts", required: false, type: "array" },
    ],
  },
  {
    slideId: "key-risks",
    slideName: "Key Risks",
    slideNumber: 14,
    fields: [
      { path: "generatedPlan.keyRisks", label: "Categorized Risks", required: false, type: "array" },
      { path: "generatedPlan.risksMitigations", label: "Risk & Mitigations", required: false, type: "array" },
    ],
  },
  {
    slideId: "risk-mitigation",
    slideName: "Risk & Mitigation",
    slideNumber: 15,
    fields: [
      { path: "generatedPlan.risksMitigations", label: "Mitigation Strategies", required: false, type: "array" },
    ],
  },
  {
    slideId: "thank-you",
    slideName: "Thank You",
    slideNumber: 16,
    fields: [
      { path: "basics.accountName", label: "Account Name", required: true, type: "text" },
      { path: "basics.coreTeamMembers", label: "Team Names", required: false, type: "array" },
    ],
  },
];

// Helper to get nested value from data object
export const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

// Check if a field has a valid value
const isFieldFilled = (value: any, field: SlideField): boolean => {
  if (value === undefined || value === null) return false;
  
  if (field.type === "array") {
    return Array.isArray(value) && value.length > 0;
  }
  
  if (field.type === "object") {
    return value !== null && typeof value === "object" && Object.keys(value).length > 0;
  }
  
  if (field.type === "text" || field.type === "date") {
    return typeof value === "string" && value.trim() !== "";
  }
  
  if (field.type === "number") {
    return typeof value === "number" || (typeof value === "string" && !isNaN(parseFloat(value)));
  }
  
  return false;
};

// Validate a field value
export const validateField = (value: any, field: SlideField): { valid: boolean; error?: string } => {
  if (!isFieldFilled(value, field)) {
    return field.required 
      ? { valid: false, error: `${field.label} is required` }
      : { valid: true };
  }
  
  if (field.validation && !field.validation(value)) {
    return { valid: false, error: `${field.label} has invalid format` };
  }
  
  return { valid: true };
};

export interface SlideCompletionResult {
  slideId: string;
  slideName: string;
  slideNumber: number;
  status: CompletionStatus;
  completedFields: number;
  totalFields: number;
  requiredCompleted: number;
  requiredTotal: number;
  missingFields: SlideField[];
  missingRequiredFields: SlideField[];
  percentage: number;
}

export interface OverallCompletion {
  slides: SlideCompletionResult[];
  overallStatus: CompletionStatus;
  overallPercentage: number;
  totalComplete: number;
  totalPartial: number;
  totalEmpty: number;
}

export const useSlideCompletion = (data: AccountData): OverallCompletion => {
  return useMemo(() => {
    const slides: SlideCompletionResult[] = slideRequirements.map((req) => {
      let completedFields = 0;
      let requiredCompleted = 0;
      const missingFields: SlideField[] = [];
      const missingRequiredFields: SlideField[] = [];
      
      req.fields.forEach((field) => {
        const value = getNestedValue(data, field.path);
        const filled = isFieldFilled(value, field);
        
        if (filled) {
          completedFields++;
          if (field.required) requiredCompleted++;
        } else {
          missingFields.push(field);
          if (field.required) missingRequiredFields.push(field);
        }
      });
      
      const totalFields = req.fields.length;
      const requiredTotal = req.fields.filter(f => f.required).length;
      const percentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 100;
      
      let status: CompletionStatus;
      if (totalFields === 0 || completedFields === totalFields) {
        status = "complete";
      } else if (completedFields === 0) {
        status = "empty";
      } else {
        status = "partial";
      }
      
      return {
        slideId: req.slideId,
        slideName: req.slideName,
        slideNumber: req.slideNumber,
        status,
        completedFields,
        totalFields,
        requiredCompleted,
        requiredTotal,
        missingFields,
        missingRequiredFields,
        percentage,
      };
    });
    
    const totalComplete = slides.filter(s => s.status === "complete").length;
    const totalPartial = slides.filter(s => s.status === "partial").length;
    const totalEmpty = slides.filter(s => s.status === "empty").length;
    
    const overallPercentage = Math.round(
      slides.reduce((acc, s) => acc + s.percentage, 0) / slides.length
    );
    
    let overallStatus: CompletionStatus;
    if (totalEmpty === slides.length) {
      overallStatus = "empty";
    } else if (totalComplete === slides.length) {
      overallStatus = "complete";
    } else {
      overallStatus = "partial";
    }
    
    return {
      slides,
      overallStatus,
      overallPercentage,
      totalComplete,
      totalPartial,
      totalEmpty,
    };
  }, [data]);
};
