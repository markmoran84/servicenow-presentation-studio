import React, { createContext, useContext, useState, ReactNode } from "react";

// Core Team Member for Cover Slide
export interface CoreTeamMember {
  firstName: string;
  lastName: string;
  title: string;
}

// Extended Team Member for Account Team Slide
export interface ExtendedTeamMember {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone?: string;
  responsibilities: string[];
  subTeams?: string[];
  region?: string;
  roleType?: "Guiding the Team" | "Building the PoV" | "Supporting the Team" | "Mapping the Value";
}

// Section A — Account Basics
export interface AccountBasics {
  accountName: string;
  industry: string;
  region: string;
  tier: "Strategic" | "Enterprise" | "Growth";
  numberOfEmployees: string;
  currentContractValue: string;
  nextFYAmbition: string;
  threeYearAmbition: string;
  renewalDates: string;
  visionStatement: string; // Account team vision for ServiceNow at [Customer]
  coreTeamMembers: CoreTeamMember[];
  extendedTeam: ExtendedTeamMember[];
}

// Section B — Account History / Prior Plan
export interface AccountHistory {
  lastPlanDate: string;
  plannerName: string;
  plannerRole: string;
  lastPlanSummary: string;
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

// Strategy item with title and optional description
export interface StrategyItem {
  title: string;
  description: string;
}

// Section D — Customer Strategy Inputs
export interface CustomerStrategy {
  corporateStrategy: StrategyItem[];
  digitalStrategies: StrategyItem[];
  ceoBoardPriorities: StrategyItem[];
  transformationThemes: StrategyItem[];
}

// Pain Point item with title and description
export interface PainPointItem {
  title: string;
  description: string;
}

// Section E — Strategic Pain Points (simple list)
export interface StrategicPainPoints {
  painPoints: PainPointItem[];
}

// Opportunity item with title and description
export interface OpportunityItem {
  title: string;
  description: string;
}

// Section F — Strategic Opportunities (simple list)
export interface StrategicOpportunities {
  opportunities: OpportunityItem[];
}

// Section G — Executive Engagement
export interface ExecutiveEngagement {
  knownExecutiveSponsors: string[];
  plannedExecutiveEvents: string[];
  decisionDeadlines: string;
  renewalRFPTiming: string;
}

// Big Bet / Key Workstream
export interface BigBet {
  title: string;
  subtitle: string;
  sponsor: string; // Executive sponsor for this initiative
  dealStatus: "Active Pursuit" | "Strategic Initiative" | "Foundation Growth" | "Pipeline";
  targetClose: string;
  netNewACV: string;
  steadyStateBenefit: string;
  insight: string;
  people: { name: string; role: string }[];
  products: string[]; // ServiceNow products e.g. CSM, AI Control Tower, CPQ
}

// Section G2 — Account Strategy
export interface AccountStrategy {
  strategyNarrative: string;
  bigBets: BigBet[];
  keyExecutives: { name: string; role: string }[];
}

// Section H — SWOT Analysis
export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

// Strategic Pillar (for Executive Summary slide)
export interface StrategicPillar {
  icon: "network" | "customer" | "technology" | "efficiency";
  keyword: string;
  title: string;
  tagline: string;
  description: string;
  outcome: string;
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
  strategicPillars: StrategicPillar[];
}

// Business Model Canvas (9 building blocks)
export interface BusinessModelCanvas {
  keyPartners: string[];
  keyActivities: string[];
  keyResources: string[];
  valueProposition: string[];
  customerRelationships: string[];
  channels: string[];
  customerSegments: string[];
  costStructure: string[];
  revenueStreams: string[];
  competitors: string[];
}

// Strategic Tension interface for StrategicTensionSlide
export interface StrategicTension {
  heading: string;
  detail: string;
  leftLabel: string;
  leftDescription: string;
  rightLabel: string;
  rightDescription: string;
  dilemma: string;
}

// AI-Generated Strategic Plan Content
export interface AIGeneratedPlan {
  executiveSummaryNarrative: string;
  executiveSummaryPillars?: { icon: "network" | "customer" | "technology" | "efficiency"; keyword: string; title: string; tagline: string; description: string; outcome: string }[];
  strategicObservations: { heading: string; detail: string }[];
  strategicImplications: { heading: string; detail: string }[];
  strategicTensions: StrategicTension[];
  strategicInsights: { heading: string; detail: string }[];
  valueHypotheses: { outcome: string; mechanism: string; timeframe: string; impact: string }[];
  strategicPriorities: { title: string; whyNow: string; ifWeLose: string; winningLooks?: string; alignment?: string; color?: string }[];
  keyWorkstreams: { title: string; subtitle?: string; dealStatus?: string; targetClose: string; acv: string; steadyStateBenefit?: string; insight: string; people?: { name: string; role: string }[] }[];
  risksMitigations: { risk: string; mitigation: string; level: string }[];
  roadmapPhases: { quarter: string; title: string; activities: string[] }[];
  engagementStrategy: { executiveAlignment: string[]; keyForums: string[] };
  successMetrics: { metric: string; label: string; description: string }[];
  coreValueDrivers?: { title: string; description: string; outcomes: string[]; alignment: string }[];
  aiUseCases?: { title: string; description: string; priority: string; status: string }[];
  // FY-1 Retrospective AI-generated content
  fy1Retrospective?: { focusAreas: { title: string; description: string }[]; keyLessons: string; lookingAhead: string };
  // Customer Strategy AI synthesis
  customerStrategySynthesis?: { narrative: string; serviceNowAlignment: { customerPriority: string; serviceNowValue: string }[] };
  // Weekly Update dynamic content
  weeklyUpdateContext?: { overallStatus: string; keyHighlights: string[]; criticalActions: string[] };
  // Marketing Plan AI-generated content
  marketingPlan?: { campaigns: { title: string; description: string; timeline: string; channels: string[] }[]; narrative: string };
  // Insight AI-generated content
  insight?: { headline: string; observations: { title: string; detail: string }[]; recommendation: string };
  // Platform Capabilities AI-generated content
  platformCapabilities?: { capabilities: { title: string; description: string; value: string }[]; narrative: string };
  // Risk Opportunity Matrix AI-generated content
  riskOpportunityMatrix?: { items: { title: string; type: "risk" | "opportunity"; impact: string; likelihood: string; mitigation?: string }[]; narrative: string };
  // Strategic Alignment AI-generated content
  strategicAlignment?: { alignments: { customerObjective: string; serviceNowCapability: string; outcome: string }[]; narrative: string };
}

export interface AccountData {
  basics: AccountBasics;
  history: AccountHistory;
  financial: FinancialSnapshot;
  strategy: CustomerStrategy;
  painPoints: StrategicPainPoints;
  opportunities: StrategicOpportunities;
  engagement: ExecutiveEngagement;
  accountStrategy: AccountStrategy;
  swot: SWOTAnalysis;
  annualReport: AnnualReportHighlights;
  businessModel: BusinessModelCanvas;
  generatedPlan?: AIGeneratedPlan;
}

// Default placeholder data (generic)
const defaultData: AccountData = {
  basics: {
    accountName: "",
    industry: "",
    region: "",
    tier: "Enterprise",
    numberOfEmployees: "",
    currentContractValue: "",
    nextFYAmbition: "",
    threeYearAmbition: "",
    renewalDates: "",
    visionStatement: "",
    coreTeamMembers: [],
    extendedTeam: [],
  },
  history: {
    lastPlanDate: "",
    plannerName: "",
    plannerRole: "",
    lastPlanSummary: "",
    whatDidNotWork: "",
    priorTransformationAttempts: "",
    currentPerception: "Medium",
  },
  financial: {
    customerRevenue: "",
    growthRate: "",
    marginEBIT: "",
    costPressureAreas: "",
    strategicInvestmentAreas: "",
  },
  strategy: {
    corporateStrategy: [],
    digitalStrategies: [],
    ceoBoardPriorities: [],
    transformationThemes: [],
  },
  painPoints: {
    painPoints: [],
  },
  opportunities: {
    opportunities: [],
  },
  engagement: {
    knownExecutiveSponsors: [],
    plannedExecutiveEvents: [],
    decisionDeadlines: "",
    renewalRFPTiming: "",
  },
  accountStrategy: {
    strategyNarrative: "",
    bigBets: [],
    keyExecutives: [],
  },
  swot: {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  },
  annualReport: {
    revenue: "",
    revenueComparison: "",
    ebitImprovement: "",
    netZeroTarget: "",
    keyMilestones: [],
    strategicAchievements: [],
    executiveSummaryNarrative: "",
    strategicPillars: [],
  },
  businessModel: {
    keyPartners: [],
    keyActivities: [],
    keyResources: [],
    valueProposition: [],
    customerRelationships: [],
    channels: [],
    customerSegments: [],
    costStructure: [],
    revenueStreams: [],
    competitors: [],
  },
};

interface AccountDataContextType {
  data: AccountData;
  updateData: (section: keyof AccountData, value: Partial<AccountData[keyof AccountData]>) => void;
  resetToDefaults: () => void;
  setGeneratedPlan: (plan: AIGeneratedPlan) => void;
  patchGeneratedPlan: (patch: Partial<AIGeneratedPlan>) => void;
  reorderExtendedTeam: (oldIndex: number, newIndex: number) => void;
}

// Create context with a stable reference to prevent HMR issues
const AccountDataContext = createContext<AccountDataContextType | null>(null);

export const AccountDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AccountData>(defaultData);

  const updateData = (section: keyof AccountData, value: Partial<AccountData[keyof AccountData]>) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...value },
    }));
  };

  const setGeneratedPlan = (plan: AIGeneratedPlan) => {
    setData((prev) => ({
      ...prev,
      generatedPlan: plan,
    }));
  };

  const patchGeneratedPlan = (patch: Partial<AIGeneratedPlan>) => {
    setData((prev) => ({
      ...prev,
      generatedPlan: {
        ...(prev.generatedPlan ?? ({} as AIGeneratedPlan)),
        ...patch,
      },
    }));
  };

  const resetToDefaults = () => setData(defaultData);

  const reorderExtendedTeam = (oldIndex: number, newIndex: number) => {
    setData((prev) => {
      const newExtendedTeam = [...prev.basics.extendedTeam];
      const [removed] = newExtendedTeam.splice(oldIndex, 1);
      newExtendedTeam.splice(newIndex, 0, removed);
      return {
        ...prev,
        basics: {
          ...prev.basics,
          extendedTeam: newExtendedTeam,
        },
      };
    });
  };

  return (
    <AccountDataContext.Provider value={{ data, updateData, resetToDefaults, setGeneratedPlan, patchGeneratedPlan, reorderExtendedTeam }}>
      {children}
    </AccountDataContext.Provider>
  );
};

export const useAccountData = (): AccountDataContextType => {
  const context = useContext(AccountDataContext);
  if (context === null) {
    throw new Error("useAccountData must be used within an AccountDataProvider");
  }
  return context;
};
