import { CategorizedRisk } from "@/context/AccountDataContext";

/**
 * Comprehensive threat assessment for ServiceNow-Maersk partnership
 * Organized by severity: Critical (5), High (4), Medium (3)
 */
export const maerskRiskData: CategorizedRisk[] = [
  // CRITICAL THREATS (Severity 5)
  {
    risk: "Executive Turnover & Relationship Discontinuity",
    description: "CFO transition could reset financial approval processes. Navneet's potential exit risks losing the primary technical champion. New executives bring different priorities and decision-making styles.",
    category: "Strategic",
    severity: 5,
    mitigation: "Map succession plans for key stakeholders NOW. Build relationships one level down. Create transition briefing materials. Establish senior executive relationships with stable contacts like Karsten (CCO). Accelerate March Executive Briefing to lock in commitments before transitions."
  },
  {
    risk: "Delivery Risk Perception",
    description: "Navneet's explicit concerns about ServiceNow's implementation capability. No clear reference story at Maersk scale. Risk aversion amplified by 5% IT FTE cuts. One failed delivery could poison the entire relationship.",
    category: "Operational",
    severity: 5,
    mitigation: "Commission formal delivery assurance review with Professional Services leadership. Propose phased implementation with clear milestones. Bring in VP-level delivery executives to address concerns. Identify 2-3 reference customers in logistics/maritime. Offer delivery 'war room' model with dedicated executive oversight."
  },
  {
    risk: "$67M CRM Deal Delay → Cancellation Risk",
    description: "Already delayed from February to end of March. Executive silence suggests deprioritization. Salesforce defending aggressively. Procurement delays may be strategic stalling.",
    category: "Commercial",
    severity: 5,
    mitigation: "Request urgent executive alignment meeting with Karsten (CCO). Propose splitting deal: Phase 1 (smaller, faster win) + Phase 2 (full transformation). Engage Cathy Mauzaize for direct executive-to-executive call. Prepare 'walk away' alternative plan. Reframe business case from cost savings to revenue enablement."
  },
  
  // HIGH THREATS (Severity 4)
  {
    risk: "Microsoft Platform Consolidation",
    description: "Azure, Office 365 already embedded with land-and-expand advantage. Potential for Dynamics 365 as 'integrated' CRM alternative. Bundled pricing gives Microsoft commercial leverage. Microsoft's AI narrative (Copilot) may resonate with CAIO Krishnan.",
    category: "Strategic",
    severity: 4,
    mitigation: "Develop explicit 'coexistence with Microsoft' positioning - not either/or but best-of-breed. Show how ServiceNow integrates WITH Microsoft tools. Position as the workflow layer that makes Microsoft investments work better. Engage Krishnan on AI differentiation: agentic AI vs. Copilot assistance model."
  },
  {
    risk: "Salesforce Defensive Counter-Attack",
    description: "4,000+ users create organizational inertia and switching costs. Salesforce likely offering significant commercial concessions. They'll position ServiceNow as risky 'challenger' vs. proven CRM leader. Integration complexity will be weaponized.",
    category: "Commercial",
    severity: 4,
    mitigation: "Don't fight on CRM features - fight on total cost of ownership and AI differentiation. Position around workflow automation and cross-functional integration. Quantify the 'Salesforce tax'. Bring forward customers who've switched FROM Salesforce successfully. Make it about future-proofing (agentic AI, platform extensibility)."
  },
  {
    risk: "ServiceNow Market Perception & Viability Concerns",
    description: "Stock performance challenges may raise 'is ServiceNow stable?' questions. Expensive acquisitions creating debt/margin pressure narratives. Subscription revenue guidance concerns affecting enterprise buyer confidence.",
    category: "Commercial",
    severity: 4,
    mitigation: "Proactively address with facts: customer retention, R&D investment, market position. Position acquisitions as strategic capability building not desperation. Emphasize long-term customer commitments and product roadmap stability. Involve corporate strategy/investor relations for CFO stakeholders. Highlight Marquee top 75 status."
  },
  
  // MEDIUM THREATS (Severity 3)
  {
    risk: "Lack of Multi-Year Strategic Partnership Framework",
    description: "Relationship currently defined by individual opportunities, not strategic partnership. No shared vision for 3-5 year transformation. Risk of being viewed as tactical vendor vs. strategic platform.",
    category: "Governance",
    severity: 3,
    mitigation: "Use March Executive Briefing to CO-CREATE a multi-year partnership roadmap. Map ServiceNow capabilities to Maersk's public strategic priorities (sustainability, digitalization, CX). Propose formal Strategic Partnership Agreement with governance and innovation labs. Position Marquee program benefits as exclusive value."
  },
  {
    risk: "Internal ServiceNow Knowledge & Continuity Risk",
    description: "Morten transitioning to AI specialist role. Long sales cycles require institutional memory. Complex stakeholder relationships hard to transfer between team members.",
    category: "Operational",
    severity: 3,
    mitigation: "Document everything in structured account plan. Record key relationship insights in CRM. Create formal transition/onboarding protocols. Leverage Lone Føns Schrøder's previous Maersk experience. Build redundancy with multiple team members knowing key contacts. Use collaboration tools to share intelligence."
  },
  {
    risk: "Cost Pressure & ROI Scrutiny",
    description: "5% IT FTE cuts signal aggressive cost management. Business cases requiring upfront investment face harder scrutiny. 'Do more with less' mandate limits appetite for transformation projects.",
    category: "Commercial",
    severity: 3,
    mitigation: "Reframe proposals to emphasize OPEX reduction and fast payback. Show how ServiceNow reduces costs of OTHER systems. Propose consumption-based or phased payment models. Quantify opportunity cost of NOT transforming. Align to FTE reduction goals by showing automation benefits. Bring CFO-level business case validation."
  }
];

/**
 * Risk/Opportunity Matrix items derived from the threat assessment
 */
export const riskOpportunityMatrixData = {
  items: [
    // CRITICAL RISKS
    { title: "Executive Turnover", type: "risk" as const, impact: "Critical", likelihood: "High", mitigation: "Build relationships one level down; accelerate March Executive Briefing" },
    { title: "Delivery Risk Perception", type: "risk" as const, impact: "Critical", likelihood: "High", mitigation: "Commission delivery assurance review; identify reference customers" },
    { title: "CRM Deal Cancellation", type: "risk" as const, impact: "Critical", likelihood: "Medium", mitigation: "Urgent executive alignment with Karsten; consider deal splitting" },
    // HIGH RISKS
    { title: "Microsoft Platform Consolidation", type: "risk" as const, impact: "High", likelihood: "Medium", mitigation: "Coexistence positioning; demonstrate integration value" },
    { title: "Salesforce Counter-Attack", type: "risk" as const, impact: "High", likelihood: "High", mitigation: "Focus on TCO and AI differentiation, not feature parity" },
    { title: "ServiceNow Market Perception", type: "risk" as const, impact: "High", likelihood: "Low", mitigation: "Proactive communication on stability; leverage Marquee status" },
    // OPPORTUNITIES
    { title: "March Executive Briefing", type: "opportunity" as const, impact: "High", likelihood: "High", mitigation: "Use to lock in multi-year partnership commitments" },
    { title: "AI/Agentic Differentiation", type: "opportunity" as const, impact: "High", likelihood: "Medium", mitigation: "Engage CAIO Krishnan; position beyond Copilot" },
    { title: "Automation for FTE Reduction", type: "opportunity" as const, impact: "Medium", likelihood: "High", mitigation: "Align proposals to headcount optimization goals" },
  ],
  narrative: "The ServiceNow-Maersk partnership faces critical near-term risks around executive continuity and delivery confidence, alongside competitive pressure from Microsoft and Salesforce. The March Executive Briefing represents a pivotal opportunity to lock in strategic commitments before potential leadership transitions. Success requires demonstrating delivery capability through reference customers while positioning ServiceNow's agentic AI as differentiated from Microsoft's Copilot approach."
};

/**
 * SWOT Threats derived from the risk assessment
 */
export const swotThreats = [
  "Executive turnover (CFO transition, Navneet exit risk) could reset approval processes and champion relationships",
  "Delivery risk perception: Navneet's explicit concerns about ServiceNow implementation capability at Maersk scale",
  "$67M CRM deal delay suggests potential deprioritization amid Salesforce defensive counter-attack",
  "Microsoft platform consolidation opportunity via Dynamics 365 bundled with existing Azure/O365 footprint",
  "Salesforce's 4,000+ user base creates significant organizational inertia and switching costs",
  "ServiceNow stock/margin concerns may raise enterprise buyer questions about long-term viability",
  "Cost pressure (5% IT FTE cuts) limits appetite for transformation projects requiring upfront investment",
  "Lack of strategic partnership framework risks positioning as tactical vendor vs. strategic platform"
];

/**
 * Legacy format for risksMitigations (for backward compatibility)
 */
export const risksMitigationsData = maerskRiskData.map(risk => ({
  risk: risk.risk,
  mitigation: risk.mitigation,
  level: risk.severity >= 5 ? "High" : risk.severity >= 4 ? "Medium" : "Low"
}));
