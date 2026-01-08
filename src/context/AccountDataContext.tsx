import React, { createContext, useContext, useState, ReactNode } from "react";

// Section A — Account Basics
export interface AccountBasics {
  accountName: string;
  industry: string;
  region: string;
  tier: "Strategic" | "Enterprise" | "Growth";
  currentContractValue: string;
  renewalDates: string;
  keyIncumbents: string;
}

// Section B — Account History
export interface AccountHistory {
  relationshipStartYear: string;
  whatWorked: string;
  whatDidNotWork: string;
  priorTransformationAttempts: string;
  currentPerception: "Low" | "Medium" | "High";
}

// Section C — Financial & Performance Snapshot
export interface FinancialSnapshot {
  customerRevenue: string;
  growthRate: string;
  marginEBIT: string;
  costPressureAreas: string;
  strategicInvestmentAreas: string;
}

// Section D — Customer Strategy Inputs
export interface CustomerStrategy {
  corporateStrategyPillars: string[];
  ceoBoardPriorities: string[];
  transformationThemes: string[];
  aiDigitalAmbition: string;
  costDisciplineTargets: string;
}

// Section E — Strategic Pain Points
export interface StrategicPainPoints {
  costToServeDrivers: string[];
  customerExperienceChallenges: string[];
  commercialInefficiencies: string[];
  technologyFragmentation: string[];
  aiGovernanceGaps: string[];
  timeToValueIssues: string[];
}

// Section F — Opportunity Hypotheses
export interface OpportunityHypotheses {
  aiOpportunities: string[];
  automationOpportunities: string[];
  standardisationOpportunities: string[];
  governanceOpportunities: string[];
}

// Section G — Executive Engagement
export interface ExecutiveEngagement {
  knownExecutiveSponsors: string[];
  plannedExecutiveEvents: string[];
  decisionDeadlines: string;
  renewalRFPTiming: string;
}

// Section H — Risk & Constraints
export interface RiskConstraints {
  politicalRisk: "Low" | "Medium" | "High";
  incumbentRisk: "Low" | "Medium" | "High";
  deliveryRisk: "Low" | "Medium" | "High";
  adoptionRisk: "Low" | "Medium" | "High";
  governanceMaturity: "Low" | "Medium" | "High";
}

export interface AccountData {
  basics: AccountBasics;
  history: AccountHistory;
  financial: FinancialSnapshot;
  strategy: CustomerStrategy;
  painPoints: StrategicPainPoints;
  opportunities: OpportunityHypotheses;
  engagement: ExecutiveEngagement;
  risks: RiskConstraints;
}

// Default Maersk data
const defaultMaerskData: AccountData = {
  basics: {
    accountName: "A.P. Møller - Maersk",
    industry: "Integrated Logistics & Shipping",
    region: "Global (HQ: Copenhagen)",
    tier: "Strategic",
    currentContractValue: "$8.5M ARR",
    renewalDates: "October 2026",
    keyIncumbents: "Salesforce, SAP, Microsoft",
  },
  history: {
    relationshipStartYear: "2018",
    whatWorked: "ITSM implementation, incident management standardisation, platform stability",
    whatDidNotWork: "Over-customisation constrained value perception, slow adoption of new capabilities",
    priorTransformationAttempts: "CRM pilot (2022) stalled due to change management, HR service delivery postponed",
    currentPerception: "Medium",
  },
  financial: {
    customerRevenue: "$55.5B (FY24)",
    growthRate: "+9% YoY",
    marginEBIT: "$6.5B (+65% YoY)",
    costPressureAreas: "Fuel costs, port congestion, technology sprawl, labour costs",
    strategicInvestmentAreas: "AI & automation, digital customer experience, green methanol fleet, integrated logistics platform",
  },
  strategy: {
    corporateStrategyPillars: [
      "Integrated Logistics ('All the Way')",
      "Customer Experience Excellence",
      "AI-First Operations",
      "Net Zero 2040",
    ],
    ceoBoardPriorities: [
      "Operational resilience (Red Sea/Cape routing)",
      "Cost discipline with ROIC focus",
      "Digital transformation acceleration",
      "Platform consolidation",
    ],
    transformationThemes: [
      "End-to-end supply chain visibility",
      "Predictive analytics and AI operationalisation",
      "Customer-centric service delivery",
      "Technology standardisation",
    ],
    aiDigitalAmbition: "AI-first: Deploy AI across operations, customer service, and decision-making. Explicit executive mandate.",
    costDisciplineTargets: "5-7% annual productivity improvement, $2B share buyback signals capital discipline",
  },
  painPoints: {
    costToServeDrivers: [
      "Fragmented CRM across regions",
      "Manual case handling",
      "Duplicate data entry across systems",
    ],
    customerExperienceChallenges: [
      "Inconsistent service levels across touchpoints",
      "Limited self-service capabilities",
      "Slow resolution times for complex queries",
    ],
    commercialInefficiencies: [
      "Sales tool sprawl (SFDC, custom apps)",
      "Poor pipeline visibility",
      "Manual quoting processes",
    ],
    technologyFragmentation: [
      "700+ applications in landscape",
      "Multiple ITSM tools by region",
      "No unified service catalog",
    ],
    aiGovernanceGaps: [
      "AI experiments not production-ready",
      "No central orchestration layer",
      "Model deployment complexity",
    ],
    timeToValueIssues: [
      "18-24 month implementation cycles",
      "Extended change management periods",
      "Slow user adoption curves",
    ],
  },
  opportunities: {
    aiOpportunities: [
      "Predictive case routing",
      "Intelligent document processing",
      "Customer sentiment analysis",
      "AI-powered knowledge management",
    ],
    automationOpportunities: [
      "Case auto-classification",
      "Quote generation automation",
      "Proactive customer notifications",
      "Incident auto-resolution",
    ],
    standardisationOpportunities: [
      "Global service catalog",
      "Unified CRM platform",
      "Single workflow backbone",
      "Consolidated ITSM",
    ],
    governanceOpportunities: [
      "AI model governance framework",
      "Enterprise workflow orchestration",
      "Cross-functional process ownership",
      "Value realisation tracking",
    ],
  },
  engagement: {
    knownExecutiveSponsors: [
      "Navneet Kapoor (EVP & CTIO)",
      "Narin Pohl (EVP & CPO L&S)",
      "John Ball (EVP CRM)",
      "Karsten Kildahl (CCO)",
    ],
    plannedExecutiveEvents: [
      "EBC Santa Clara (March 2026)",
      "Quarterly Business Review (May 2026)",
      "Innovation Day (September 2026)",
    ],
    decisionDeadlines: "Q1 2026 for CRM decision, Q2 2026 for AI use cases",
    renewalRFPTiming: "Renewal discussions begin August 2026",
  },
  risks: {
    politicalRisk: "Medium",
    incumbentRisk: "High",
    deliveryRisk: "Medium",
    adoptionRisk: "Medium",
    governanceMaturity: "Medium",
  },
};

interface AccountDataContextType {
  data: AccountData;
  updateData: (section: keyof AccountData, value: Partial<AccountData[keyof AccountData]>) => void;
  resetToDefaults: () => void;
}

const AccountDataContext = createContext<AccountDataContextType | undefined>(undefined);

export const AccountDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AccountData>(defaultMaerskData);

  const updateData = (section: keyof AccountData, value: Partial<AccountData[keyof AccountData]>) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...value },
    }));
  };

  const resetToDefaults = () => setData(defaultMaerskData);

  return (
    <AccountDataContext.Provider value={{ data, updateData, resetToDefaults }}>
      {children}
    </AccountDataContext.Provider>
  );
};

export const useAccountData = () => {
  const context = useContext(AccountDataContext);
  if (!context) {
    throw new Error("useAccountData must be used within an AccountDataProvider");
  }
  return context;
};
