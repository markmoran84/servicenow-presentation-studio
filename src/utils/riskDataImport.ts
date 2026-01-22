import { CategorizedRisk } from "@/context/AccountDataContext";

/**
 * Comprehensive threat assessment for ServiceNow-Maersk partnership
 * Organized by category: Strategic, Governance, Operational, Commercial
 */
export const maerskRiskData: CategorizedRisk[] = [
  // STRATEGIC RISKS
  {
    risk: "Executive Sponsorship Instability",
    description: "Primary technical sponsor (Navneet) may exit or disengage, creating loss of momentum, reset of priorities, and increased delivery scrutiny.",
    category: "Strategic",
    severity: 5,
    mitigation: "Map succession plans for key stakeholders NOW. Build relationships one level down. Create transition briefing materials. Establish senior executive relationships with stable contacts like Karsten (CCO). Accelerate March Executive Briefing to lock in commitments."
  },
  {
    risk: "Strategic Partner Positioning Risk",
    description: "Without a clear multi-year partnership narrative, ServiceNow risks being seen as a tactical vendor rather than a strategic platform.",
    category: "Strategic",
    severity: 4,
    mitigation: "Use March Executive Briefing to CO-CREATE a multi-year partnership roadmap. Map ServiceNow capabilities to Maersk's strategic priorities. Propose formal Strategic Partnership Agreement with governance and executive sponsorship. Position Marquee program benefits as exclusive partnership value."
  },
  {
    risk: "Incumbent Platform Entrenchment (Salesforce)",
    description: "Deep CRM adoption with 4,000+ users and organisational inertia increase switching costs and weaken future displacement opportunities.",
    category: "Strategic",
    severity: 4,
    mitigation: "Fight on total cost of ownership and AI differentiation, not CRM features. Position around workflow automation and cross-functional integration. Quantify the 'Salesforce tax'. Bring forward customers who've switched FROM Salesforce successfully. Make it about future-proofing (agentic AI, platform extensibility)."
  },
  {
    risk: "Platform Consolidation Pressure (Microsoft)",
    description: "Microsoft's footprint (Azure, Office 365) and bundled offerings position it as a 'good enough' alternative across workflow and AI use cases.",
    category: "Strategic",
    severity: 4,
    mitigation: "Develop explicit 'coexistence with Microsoft' positioning - best-of-breed, not either/or. Show how ServiceNow integrates WITH Microsoft tools. Position as the workflow layer that makes Microsoft investments work better. Engage CAIO Krishnan on AI differentiation: agentic AI vs. Copilot."
  },

  // GOVERNANCE RISKS
  {
    risk: "Financial Governance Reset (CFO Exit)",
    description: "CFO departure has reset approval models, business case scrutiny, and investment thresholds, slowing decision velocity.",
    category: "Governance",
    severity: 5,
    mitigation: "Proactively engage incoming CFO with ServiceNow business case validation. Bring CFO-level peer benchmarking and ROI evidence. Show ServiceNow's customer retention, R&D investment, market position. Prepare comprehensive financial impact documentation."
  },
  {
    risk: "Decision Ownership Ambiguity",
    description: "Unclear post-exit governance and decision authority increases risk of stalled approvals and fragmented sponsorship.",
    category: "Governance",
    severity: 4,
    mitigation: "Map and clarify decision-making authority across stakeholders. Identify interim governance processes and approval chains. Engage multiple sponsors to reduce single-point-of-failure risk. Document and socialize decision criteria with all stakeholders."
  },

  // OPERATIONAL RISKS
  {
    risk: "Delivery Confidence Perception",
    description: "Explicit concerns about ServiceNow's ability to deliver at Maersk scale threaten adoption and expansion.",
    category: "Operational",
    severity: 5,
    mitigation: "Commission formal delivery assurance review with Professional Services leadership. Propose phased implementation with clear milestones. Bring in VP-level delivery executives to address concerns. Identify 2-3 reference customers in logistics/maritime. Offer delivery 'war room' model."
  },
  {
    risk: "Execution Capacity Constraints",
    description: "Maersk teams are stretched with 5% IT FTE cuts, limiting bandwidth for onboarding, change, and transformation execution.",
    category: "Operational",
    severity: 4,
    mitigation: "Reframe proposals to emphasize OPEX reduction and fast payback. Propose consumption-based or phased payment models. Align to FTE reduction goals - show how automation enables headcount optimization. Offer ServiceNow resources to reduce burden on Maersk teams."
  },
  {
    risk: "Knowledge & Continuity Gaps",
    description: "Role changes across teams (e.g., Morten to AI specialist) risk loss of context, relationship history, and execution consistency.",
    category: "Operational",
    severity: 3,
    mitigation: "Document everything in structured account plan. Record key relationship insights in CRM. Create formal transition/onboarding protocols. Leverage Lone Føns Schrøder's previous Maersk experience. Build redundancy with multiple team members knowing key contacts."
  },
  {
    risk: "Adoption & Value Realisation Risk",
    description: "Slow adoption or under-realised outcomes could reinforce scepticism and reduce executive confidence.",
    category: "Operational",
    severity: 4,
    mitigation: "Define clear success metrics and value tracking from day one. Implement adoption monitoring and proactive intervention. Create executive dashboards showing value realisation. Establish regular business reviews to demonstrate progress."
  },

  // COMMERCIAL RISKS
  {
    risk: "CRM Deal Slippage / Cancellation Risk",
    description: "Delays and executive silence on $67M deal increase risk of deferral or loss, reinforcing incumbent Salesforce position.",
    category: "Commercial",
    severity: 5,
    mitigation: "Request urgent executive alignment meeting with Karsten (CCO). Propose splitting deal: Phase 1 (smaller, faster win) + Phase 2 (full transformation). Engage Cathy Mauzaize for executive-to-executive call. Prepare 'walk away' alternative. Reframe business case to revenue enablement."
  },
  {
    risk: "Cost Pressure & ROI Scrutiny",
    description: "IT cost reductions increase resistance to upfront investment, even where long-term value is clear.",
    category: "Commercial",
    severity: 4,
    mitigation: "Reframe proposals to emphasize OPEX reduction and fast payback. Show how ServiceNow reduces costs of OTHER systems. Propose consumption-based or phased payment models. Quantify opportunity cost of NOT transforming. Bring CFO-level business case validation."
  },
  {
    risk: "Renewal & Expansion Confidence Risk",
    description: "If value is not visibly realised, renewal confidence and long-term expansion opportunities are at risk.",
    category: "Commercial",
    severity: 3,
    mitigation: "Establish value tracking and reporting from initial deployment. Schedule regular executive business reviews. Document and celebrate wins to build expansion narrative. Create multi-year roadmap tied to Maersk's strategic initiatives."
  }
];

/**
 * Risk/Opportunity Matrix items derived from the threat assessment
 */
export const riskOpportunityMatrixData = {
  items: [
    // STRATEGIC RISKS
    { title: "Executive Sponsorship Instability", type: "risk" as const, impact: "Critical", likelihood: "High", mitigation: "Build relationships one level down; accelerate March Executive Briefing" },
    { title: "Strategic Partner Positioning", type: "risk" as const, impact: "High", likelihood: "Medium", mitigation: "Co-create multi-year partnership roadmap at March briefing" },
    { title: "Salesforce Entrenchment", type: "risk" as const, impact: "High", likelihood: "High", mitigation: "Focus on TCO and AI differentiation, not feature parity" },
    { title: "Microsoft Platform Consolidation", type: "risk" as const, impact: "High", likelihood: "Medium", mitigation: "Coexistence positioning; demonstrate integration value" },
    // GOVERNANCE RISKS
    { title: "CFO Exit / Governance Reset", type: "risk" as const, impact: "Critical", likelihood: "High", mitigation: "Engage incoming CFO with business case validation" },
    { title: "Decision Ownership Ambiguity", type: "risk" as const, impact: "High", likelihood: "Medium", mitigation: "Map decision authority; engage multiple sponsors" },
    // OPERATIONAL RISKS
    { title: "Delivery Confidence Perception", type: "risk" as const, impact: "Critical", likelihood: "High", mitigation: "Commission delivery assurance review; identify reference customers" },
    { title: "Adoption & Value Realisation", type: "risk" as const, impact: "High", likelihood: "Medium", mitigation: "Define success metrics; implement value tracking" },
    // COMMERCIAL RISKS
    { title: "CRM Deal Cancellation", type: "risk" as const, impact: "Critical", likelihood: "Medium", mitigation: "Urgent executive alignment with Karsten; consider deal splitting" },
    // OPPORTUNITIES
    { title: "March Executive Briefing", type: "opportunity" as const, impact: "High", likelihood: "High", mitigation: "Use to lock in multi-year partnership commitments" },
    { title: "AI/Agentic Differentiation", type: "opportunity" as const, impact: "High", likelihood: "Medium", mitigation: "Engage CAIO Krishnan; position beyond Copilot" },
    { title: "Automation for FTE Reduction", type: "opportunity" as const, impact: "Medium", likelihood: "High", mitigation: "Align proposals to headcount optimization goals" },
  ],
  narrative: "The ServiceNow-Maersk partnership faces critical near-term risks around executive continuity (Navneet at risk, CFO exit) and delivery confidence. Governance ambiguity is slowing decision velocity while Salesforce and Microsoft exert competitive pressure. The March Executive Briefing represents a pivotal opportunity to establish strategic partner positioning before leadership transitions. Success requires demonstrating delivery capability and positioning ServiceNow's agentic AI as differentiated from Microsoft's Copilot approach."
};

/**
 * SWOT Threats derived from the risk assessment
 */
export const swotThreats = [
  "Executive sponsorship instability: Navneet may exit/disengage, creating loss of momentum and priority reset",
  "CFO departure has reset financial governance, approval models, and investment thresholds",
  "Decision ownership ambiguity increases risk of stalled approvals and fragmented sponsorship",
  "Delivery confidence perception: explicit concerns about ServiceNow's ability to deliver at Maersk scale",
  "Salesforce entrenchment: 4,000+ users create significant organisational inertia and switching costs",
  "Microsoft platform consolidation via Dynamics 365 bundled with existing Azure/O365 footprint",
  "$67M CRM deal delays and executive silence suggest potential deferral or cancellation risk",
  "Cost pressure (5% IT FTE cuts) limits appetite for upfront investment even with clear long-term value",
  "Adoption and value realisation risk could reinforce scepticism and reduce executive confidence"
];

/**
 * Legacy format for risksMitigations (for backward compatibility)
 */
export const risksMitigationsData = maerskRiskData.map(risk => ({
  risk: risk.risk,
  mitigation: risk.mitigation,
  level: risk.severity >= 5 ? "High" : risk.severity >= 4 ? "Medium" : "Low"
}));
