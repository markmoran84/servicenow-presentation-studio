import React, { createContext, useContext, useState, ReactNode } from "react";

// Core Team Member for Cover Slide
export interface CoreTeamMember {
  firstName: string;
  lastName: string;
  title: string;
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

// AI-Generated Strategic Plan Content
export interface AIGeneratedPlan {
  executiveSummaryNarrative: string;
  executiveSummaryPillars?: { icon: "network" | "customer" | "technology" | "efficiency"; keyword: string; title: string; tagline: string; description: string; outcome: string }[];
  strategicObservations: { heading: string; detail: string }[];
  strategicImplications: { heading: string; detail: string }[];
  strategicTensions: { heading: string; detail: string }[];
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
  businessModel: BusinessModelCanvas;
  generatedPlan?: AIGeneratedPlan;
}

// Default Maersk data
const defaultMaerskData: AccountData = {
  basics: {
    accountName: "A.P. Møller - Maersk",
    industry: "Integrated Logistics & Shipping",
    region: "Global (HQ: Copenhagen)",
    tier: "Strategic",
    numberOfEmployees: "100,000+",
    currentContractValue: "$8.5M ARR",
    nextFYAmbition: "$12M ARR",
    threeYearAmbition: "$25M ARR",
    renewalDates: "October 2026",
    visionStatement: "ServiceNow will be the digital backbone powering Maersk's AI-first operations strategy, unifying 700+ fragmented applications into a single intelligent platform that accelerates decision-making from days to minutes and enables the 'All the Way' integrated logistics vision.",
    coreTeamMembers: [
      { firstName: "Jakob", lastName: "Hjortsø", title: "Client Director" },
      { firstName: "Morten", lastName: "Kristensen", title: "Sr Solution Consultant" },
      { firstName: "Mark", lastName: "Moran", title: "Sr Advisory Enterprise Architect" },
    ],
  },
  history: {
    lastPlanDate: "March 2025",
    plannerName: "Sarah Mitchell",
    plannerRole: "Strategic Account Executive",
    lastPlanSummary: "FY25 plan focused on ITSM expansion and initial CRM pilot. Achieved 95% renewal but CRM pilot stalled due to change management challenges.",
    whatDidNotWork: "Over-customisation constrained value perception, slow adoption of new capabilities, CRM pilot stalled",
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
    corporateStrategy: [
      { title: "Integrated Logistics ('All the Way')", description: "Transform from a container shipping company to an integrated logistics provider offering end-to-end supply chain solutions." },
      { title: "Customer Experience Excellence", description: "Deliver seamless, consistent customer experiences across all touchpoints and channels." },
      { title: "AI-First Operations", description: "Deploy AI across operations, customer service, and decision-making with explicit executive mandate." },
      { title: "Net Zero 2040", description: "Industry-leading sustainability commitment through green methanol fleet and operational efficiency." },
    ],
    digitalStrategies: [
      { title: "AI-First Operations", description: "Deploy AI across operations, customer service, and decision-making with explicit executive mandate. Target 5-7% annual productivity improvement through intelligent automation and predictive analytics." },
      { title: "Platform Consolidation", description: "Reduce 700+ application footprint through strategic platform decisions, eliminating redundancy and creating unified data foundation." },
    ],
    ceoBoardPriorities: [
      { title: "Operational resilience (Red Sea/Cape routing)", description: "Navigate geopolitical disruptions through flexible routing and network optimization while maintaining service levels and cost efficiency." },
      { title: "Cost discipline with ROIC focus", description: "$2B share buyback program signals capital discipline. Target consistent returns on invested capital through operational excellence." },
      { title: "Digital transformation acceleration", description: "Accelerate technology modernization and platform consolidation to enable AI-first operations and improve customer experience." },
      { title: "Platform consolidation", description: "Reduce 700+ application footprint through strategic platform decisions, eliminating redundancy and creating unified data foundation." },
    ],
    transformationThemes: [
      { title: "End-to-end supply chain visibility", description: "Enable real-time tracking and predictive insights across the entire supply chain journey." },
      { title: "Predictive analytics and AI operationalisation", description: "Move AI from pilots to production through unified workflow orchestration." },
      { title: "Customer-centric service delivery", description: "Consistent service levels across all touchpoints with proactive engagement." },
      { title: "Technology standardisation", description: "Consolidate fragmented technology landscape onto unified platforms." },
    ],
  },
  painPoints: {
    painPoints: [
      {
        title: "Fragmented CRM Landscape",
        description: "Multiple CRM systems across regions creating inconsistent customer data, duplicate processes, and $15M+ in redundant licensing costs",
      },
      {
        title: "AI Operationalisation Gap",
        description: "18-24 month implementation cycles for AI initiatives with no central orchestration layer, causing 60% of AI pilots to fail production deployment",
      },
      {
        title: "Technology Sprawl",
        description: "700+ applications in the technology landscape with multiple ITSM tools by region, no unified service catalog, and limited integration",
      },
      {
        title: "Customer Experience Inconsistency",
        description: "Inconsistent service levels across touchpoints, limited self-service capabilities, and slow resolution times impacting NPS by 15+ points",
      },
    ],
  },
  opportunities: {
    opportunities: [
      {
        title: "Unified Service Excellence Platform",
        description: "Transform customer experience with AI-powered self-service and intelligent case routing, driving NPS improvement of 15+ points and reducing time-to-resolution by 50%",
      },
      {
        title: "AI-First Operations Enablement",
        description: "Accelerate AI operationalisation from 18 months to 6 months through unified workflow orchestration, enabling production-ready model governance and 5-7% annual productivity improvement",
      },
      {
        title: "Cost-to-Serve Optimisation",
        description: "Reduce cost-to-serve by 30% through intelligent automation of case handling, document processing, and proactive customer notifications",
      },
      {
        title: "Platform Consolidation",
        description: "Unify fragmented CRM and ITSM landscape onto single platform, eliminating $15M+ in redundant licensing and creating single source of truth for customer interactions",
      },
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
    strategicPillars: [
      {
        icon: "network",
        keyword: "BETTER",
        title: "NETWORK",
        tagline: "More reliable. More predictable. More integrated.",
        description: "Strengthened network reliability and operational discipline across Ocean, Logistics & Services, and Terminals — operating as one connected system through network redesign, capacity discipline, and digitised execution.",
        outcome: "schedule reliability, resilience, and end-to-end flow"
      },
      {
        icon: "customer",
        keyword: "BETTER",
        title: "CUSTOMER EXPERIENCE",
        tagline: "Connected journeys, not fragmented interactions.",
        description: "Improving customer experience by simplifying engagement, reducing handoffs, and connecting customer-facing processes to operational execution with aligned digital channels and service operations.",
        outcome: "trust, transparency, and reduced friction"
      },
      {
        icon: "technology",
        keyword: "BETTER",
        title: "TECHNOLOGY & AI",
        tagline: "From digital ambition to operational execution.",
        description: "Accelerated AI-first agenda by embedding intelligence into core workflows — moving beyond pilots to operational use cases with data, automation, and AI improving decision-making and execution speed.",
        outcome: "AI in execution, not experimentation"
      },
      {
        icon: "efficiency",
        keyword: "BETTER",
        title: "EFFICIENCY",
        tagline: "Lower cost-to-serve through standardisation and automation.",
        description: "Continued to reduce structural cost-to-serve by simplifying systems, standardising processes, and automating manual work — improving productivity and reducing complexity.",
        outcome: "efficiency as a structural advantage"
      }
    ],
  },
  businessModel: {
    keyPartners: [
      "Port authorities and terminal operators globally",
      "MSC (Gemini network alliance)",
      "Technology vendors (SAP, Salesforce, Microsoft)",
      "Green fuel suppliers (methanol producers)",
      "Freight forwarders and customs brokers",
    ],
    keyActivities: [
      "Container shipping and ocean freight",
      "End-to-end logistics orchestration",
      "Port and terminal operations",
      "Digital platform development",
      "Fleet management and vessel operations",
    ],
    keyResources: [
      "Global fleet of 700+ vessels",
      "130+ country operational network",
      "Digital booking and visibility platforms",
      "Port terminals and logistics hubs",
      "100,000+ employees worldwide",
    ],
    valueProposition: [
      "End-to-end integrated logistics ('All the Way')",
      "Global network with local expertise",
      "Digital visibility and real-time tracking",
      "Sustainable shipping (Net Zero 2040)",
      "Reliability through operational excellence",
    ],
    customerRelationships: [
      "Dedicated key account management",
      "Digital self-service platforms",
      "24/7 customer service centers",
      "Industry-specific solutions teams",
      "Strategic partnership programs",
    ],
    channels: [
      "Direct sales force",
      "Digital booking platform (maersk.com)",
      "Freight forwarder partnerships",
      "Industry trade shows and events",
      "API integrations with shipper systems",
    ],
    customerSegments: [
      "Global enterprises (Fortune 500)",
      "SME exporters and importers",
      "Retail and e-commerce companies",
      "Automotive and manufacturing",
      "Chemical and pharmaceutical",
    ],
    costStructure: [
      "Fuel and bunker costs (30% of operating)",
      "Port and terminal fees",
      "Crew and vessel operating costs",
      "Technology and digital investments",
      "Green fleet transition investments",
    ],
    revenueStreams: [
      "Ocean freight (container shipping)",
      "Logistics services (warehousing, trucking)",
      "Terminal handling and port services",
      "Value-added services (customs, insurance)",
      "Digital platform subscriptions",
    ],
    competitors: [
      "MSC - Mediterranean Shipping Company",
      "CMA CGM Group",
      "COSCO Shipping",
      "Hapag-Lloyd",
      "Evergreen Marine",
      "Kuehne + Nagel (logistics)",
      "DHL Supply Chain (logistics)",
    ],
  },
};

interface AccountDataContextType {
  data: AccountData;
  updateData: (section: keyof AccountData, value: Partial<AccountData[keyof AccountData]>) => void;
  resetToDefaults: () => void;
  setGeneratedPlan: (plan: AIGeneratedPlan) => void;
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

  const setGeneratedPlan = (plan: AIGeneratedPlan) => {
    setData((prev) => ({
      ...prev,
      generatedPlan: plan,
    }));
  };

  const resetToDefaults = () => setData(defaultMaerskData);

  return (
    <AccountDataContext.Provider value={{ data, updateData, resetToDefaults, setGeneratedPlan }}>
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
