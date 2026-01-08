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

// Section F — Strategic Opportunities (ServiceNow perspective)
export interface StrategicOpportunities {
  serviceExcellence: string[];
  operationalEfficiency: string[];
  digitalTransformation: string[];
  platformConsolidation: string[];
}

// Section G — Executive Engagement
export interface ExecutiveEngagement {
  knownExecutiveSponsors: string[];
  plannedExecutiveEvents: string[];
  decisionDeadlines: string;
  renewalRFPTiming: string;
}

// Section H — SWOT Analysis
export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

// Annual Report Highlights (for Executive Summary slide)
export interface AnnualReportHighlights {
  revenue: string;
  revenueComparison: string;
  ebitImprovement: string;
  netZeroTarget: string;
  keyMilestones: string[];
  strategicAchievements: string[];
  executiveSummaryNarrative: string;
}

export interface AccountData {
  basics: AccountBasics;
  history: AccountHistory;
  financial: FinancialSnapshot;
  strategy: CustomerStrategy;
  painPoints: StrategicPainPoints;
  opportunities: StrategicOpportunities;
  engagement: ExecutiveEngagement;
  swot: SWOTAnalysis;
  annualReport: AnnualReportHighlights;
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
    serviceExcellence: [
      "Transform customer experience with AI-powered self-service and intelligent case routing, driving NPS improvement of 15+ points",
      "Reduce time-to-resolution by 50% through predictive case management and proactive customer notifications",
      "Enable seamless omnichannel service delivery across 130+ countries with unified service catalog",
    ],
    operationalEfficiency: [
      "Reduce cost-to-serve by 30% through intelligent automation of case handling and document processing",
      "Accelerate quote-to-cash cycle by 40% with automated quote generation and approval workflows",
      "Eliminate $15M+ in redundant licensing through platform consolidation from 700+ applications",
    ],
    digitalTransformation: [
      "Accelerate AI operationalisation from 18 months to 6 months through unified workflow orchestration layer",
      "Enable AI-first strategy with production-ready model governance, deployment, and monitoring",
      "Drive 5-7% annual productivity improvement through intelligent automation at scale",
    ],
    platformConsolidation: [
      "Unify fragmented CRM landscape onto single platform, reducing complexity and improving data quality",
      "Consolidate multiple regional ITSM tools into enterprise-wide service management backbone",
      "Create single source of truth for customer interactions, enabling 360° visibility across all touchpoints",
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
  swot: {
    strengths: [
      "Global leader in integrated logistics with 130+ country presence",
      "Strong financial position with $6.5B EBIT",
      "Industry-leading sustainability commitment (Net Zero 2040)",
      "Established technology infrastructure and digital platforms",
    ],
    weaknesses: [
      "700+ fragmented applications across the technology landscape",
      "Over-customisation of existing platforms limiting agility",
      "Slow adoption of new capabilities and extended change cycles",
      "Multiple ITSM and CRM tools by region creating inconsistency",
    ],
    opportunities: [
      "AI-first strategy with explicit executive mandate",
      "Platform consolidation to reduce complexity",
      "Customer experience differentiation through digital",
      "Operational efficiency through automation",
    ],
    threats: [
      "High incumbent vendor risk (Salesforce, SAP, Microsoft)",
      "Geopolitical disruptions (Red Sea, supply chain volatility)",
      "Competitive pressure from digital-native logistics players",
      "Rising fuel and operational costs",
    ],
  },
  annualReport: {
    revenue: "$55.5B",
    revenueComparison: "2023: $51.1B",
    ebitImprovement: "+65%",
    netZeroTarget: "2040",
    keyMilestones: [
      "Gemini network launch with MSC strengthened reliability",
      "Green methanol vessel fleet expansion to 25 ships",
      "AI-first strategy formally adopted by executive team",
      "Customer NPS improved by 12 points YoY",
    ],
    strategicAchievements: [
      "Successfully navigated Red Sea disruption via Cape routing",
      "Completed Landside logistics integration in 45 countries",
      "Launched unified digital booking platform",
      "$2B share buyback program initiated",
    ],
    executiveSummaryNarrative: "We are the world's leading integrated logistics company. Maersk operates across 130+ countries, connecting and simplifying global trade for customers. We provide end-to-end supply chain solutions underpinned by market-leading technology, creating seamless experiences.",
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
