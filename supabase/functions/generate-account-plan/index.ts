import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  corsHeaders,
  callAIGateway,
  handleAPIError,
  getAPIKey,
  parseJsonSafe,
  successResponse,
  PREMIUM_MODEL,
} from "../_shared/validation.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accountData } = await req.json();
    const LOVABLE_API_KEY = getAPIKey();

    console.log("Generating enterprise account plan for:", accountData.basics?.accountName);

    const systemPrompt = `You are an elite McKinsey-caliber enterprise account strategist for ServiceNow, trusted to craft account plans that have won $100M+ transformational deals. Your output quality must match the standards of Fortune 100 board presentations.

STRATEGIC EXCELLENCE MANDATE:
You synthesize raw account data into polished, executive-ready strategic content that drives C-suite conviction and accelerates complex enterprise sales.

CRITICAL QUALITY STANDARDS:
1. PRECISION OVER PLATITUDES: Every insight must be specific, quantified where possible, and defensible. Generic statements like "drive digital transformation" are unacceptable.
2. CUSTOMER-FIRST LANGUAGE: Use the customer's terminology, strategic priorities, and business context. Reference their stated goals, not hypotheticals.
3. EXECUTIVE GRAVITAS: Write for C-suite audiences. Every sentence should pass the "Would a CEO quote this?" test.
4. STRATEGIC COHERENCE: All sections must tell a unified story—observations lead to implications, implications to priorities, priorities to workstreams.
5. COMMERCIAL RIGOR: Connect insights to ServiceNow's value proposition with quantified outcomes based on comparable deployments.
6. TENSION AWARENESS: Identify the strategic dilemmas the customer faces and position ServiceNow as the resolution.

OUTPUT EXCELLENCE: Return a comprehensive JSON object with institutional-grade strategic content.`;

    const userPrompt = `Conduct a comprehensive strategic analysis and generate an enterprise-grade account plan for:

═══════════════════════════════════════════════════════════════
ACCOUNT PROFILE
═══════════════════════════════════════════════════════════════
ACCOUNT: ${accountData.basics?.accountName || "Unknown"}
VISION: ${accountData.basics?.visionStatement || "Not defined"}
INDUSTRY: ${accountData.basics?.industry || "Unknown"}
TIER: ${accountData.basics?.tier || "Unknown"}

═══════════════════════════════════════════════════════════════
FINANCIAL INTELLIGENCE
═══════════════════════════════════════════════════════════════
• Customer Revenue: ${accountData.financial?.customerRevenue || "Unknown"}
• Growth Trajectory: ${accountData.financial?.growthRate || "Unknown"}
• EBIT Margin: ${accountData.financial?.marginEBIT || "Unknown"}
• Cost Pressure Areas: ${accountData.financial?.costPressureAreas || "Unknown"}
• Strategic Investment Zones: ${accountData.financial?.strategicInvestmentAreas || "Unknown"}

═══════════════════════════════════════════════════════════════
SERVICENOW COMMERCIAL POSITION
═══════════════════════════════════════════════════════════════
• Current ACV: ${accountData.basics?.currentContractValue || "Unknown"}
• Next FY Target: ${accountData.basics?.nextFYAmbition || "Unknown"}
• 3-Year Ambition: ${accountData.basics?.threeYearAmbition || "Unknown"}
• Renewal Window: ${accountData.basics?.renewalDates || "Unknown"}

═══════════════════════════════════════════════════════════════
CUSTOMER STRATEGIC CONTEXT
═══════════════════════════════════════════════════════════════
CORPORATE STRATEGY PILLARS:
${JSON.stringify(accountData.strategy?.corporateStrategy || [], null, 2)}

DIGITAL/AI AMBITION:
${JSON.stringify(accountData.strategy?.digitalStrategies || [], null, 2)}

CEO/BOARD PRIORITIES:
${JSON.stringify(accountData.strategy?.ceoBoardPriorities || [], null, 2)}

TRANSFORMATION THEMES:
${JSON.stringify(accountData.strategy?.transformationThemes || [], null, 2)}

═══════════════════════════════════════════════════════════════
STRATEGIC PAIN POINTS & OPPORTUNITIES
═══════════════════════════════════════════════════════════════
PAIN POINTS:
${JSON.stringify(accountData.painPoints?.painPoints || [], null, 2)}

OPPORTUNITIES:
${JSON.stringify(accountData.opportunities?.opportunities || [], null, 2)}

═══════════════════════════════════════════════════════════════
SWOT ANALYSIS
═══════════════════════════════════════════════════════════════
• Strengths: ${JSON.stringify(accountData.swot?.strengths || [])}
• Weaknesses: ${JSON.stringify(accountData.swot?.weaknesses || [])}
• Opportunities: ${JSON.stringify(accountData.swot?.opportunities || [])}
• Threats: ${JSON.stringify(accountData.swot?.threats || [])}

═══════════════════════════════════════════════════════════════
ACCOUNT HISTORY & CONTEXT
═══════════════════════════════════════════════════════════════
• Previous Plan Summary: ${accountData.history?.lastPlanSummary || "Unknown"}
• What Didn't Work: ${accountData.history?.whatDidNotWork || "Unknown"}
• Prior Transformation Attempts: ${accountData.history?.priorTransformationAttempts || "Unknown"}

═══════════════════════════════════════════════════════════════
EXECUTIVE ENGAGEMENT LANDSCAPE
═══════════════════════════════════════════════════════════════
• Executive Sponsors: ${JSON.stringify(accountData.engagement?.knownExecutiveSponsors || [])}
• Planned Executive Events: ${JSON.stringify(accountData.engagement?.plannedExecutiveEvents || [])}

═══════════════════════════════════════════════════════════════
ANNUAL REPORT INTELLIGENCE
═══════════════════════════════════════════════════════════════
${JSON.stringify(accountData.annualReport || {}, null, 2)}

═══════════════════════════════════════════════════════════════
ACCOUNT PRIORITIES (Pre-Defined Strategic Focus Areas)
═══════════════════════════════════════════════════════════════
These are the user-defined strategic priorities for this account. You MUST incorporate these into the plan and ensure strategic coherence:
${JSON.stringify(accountData.strategy?.corporateStrategy || [], null, 2)}

DIGITAL/AI PRIORITIES:
${JSON.stringify(accountData.strategy?.digitalStrategies || [], null, 2)}

CEO/BOARD PRIORITIES:
${JSON.stringify(accountData.strategy?.ceoBoardPriorities || [], null, 2)}

TRANSFORMATION PRIORITIES:
${JSON.stringify(accountData.strategy?.transformationThemes || [], null, 2)}

═══════════════════════════════════════════════════════════════
ACCOUNT STRATEGY & BIG BETS (Pre-Defined Workstreams)
═══════════════════════════════════════════════════════════════
Strategy Narrative: ${accountData.accountStrategy?.strategyNarrative || "Not yet defined"}

Big Bets / Key Workstreams (These are the user's defined initiatives—incorporate and enhance):
${JSON.stringify(accountData.accountStrategy?.bigBets || [], null, 2)}

Key Executives:
${JSON.stringify(accountData.accountStrategy?.keyExecutives || [], null, 2)}

═══════════════════════════════════════════════════════════════
BUSINESS MODEL CANVAS
═══════════════════════════════════════════════════════════════
${JSON.stringify(accountData.businessModel || {}, null, 2)}

═══════════════════════════════════════════════════════════════
CRITICAL SYNTHESIS INSTRUCTIONS
═══════════════════════════════════════════════════════════════
1. THREAD ALL INPUT DATA: Every section you generate must reference and build upon the input data provided above.
2. RESPECT USER-DEFINED PRIORITIES: The Account Priorities and Big Bets are user-defined inputs—enhance and elaborate on them, don't replace them.
3. STRATEGIC COHERENCE: Observations → Implications → Priorities → Workstreams must tell ONE unified story.
4. CUSTOMER LANGUAGE: Use terminology from the annual report and customer strategies throughout.
5. QUANTIFIED OUTCOMES: Reference financial data to create credible impact projections.

═══════════════════════════════════════════════════════════════
REQUIRED OUTPUT STRUCTURE
═══════════════════════════════════════════════════════════════
Generate a comprehensive, board-ready account plan with these sections. Each section must demonstrate strategic depth and commercial acumen:

1. executiveSummaryNarrative: A compelling 3-4 sentence executive summary that a CEO could use verbatim. Lead with customer context, articulate strategic opportunity, quantify the prize.

2. executiveSummaryPillars: Array of 4 strategic pillars (each with "icon" as "network"|"customer"|"technology"|"efficiency", "keyword" like "BETTER", "title", "tagline", "description", "outcome" with quantified impact)

3. strategicObservations: Array of 4 observations—verifiable facts about the account's current situation with clear business implications. Use their language.

4. strategicImplications: Array of 4 implications—what must change based on observations. Be specific about transformation required.

5. strategicTensions: Array of 4 tensions—opposing forces the customer must balance (each with "heading", "detail", "leftLabel", "leftDescription", "rightLabel", "rightDescription", "dilemma")

6. strategicInsights: Array of 4 provocative insights—"aha moments" that reframe the opportunity. Each should pass the "Would an executive remember this?" test.

7. valueHypotheses: Array of 4 testable hypotheses (each with "outcome", "mechanism", "timeframe", "impact" with specific dollar amounts)

8. strategicPriorities: Array of 3 must-win priorities (each with "title", "whyNow", "ifWeLose", "winningLooks", "alignment", "color" as gradient)

9. keyWorkstreams: Array of 3 transformation workstreams (each with "title", "subtitle", "dealStatus", "targetClose", "acv", "steadyStateBenefit", "insight", "people" array)

10. risksMitigations: Array of 4 risks (each with "risk", "mitigation", "level" as High/Medium/Low)

11. keyRisks: Array of 10-13 categorized risks distributed across 4 categories. This is CRITICAL - analyze ALL input data to identify synergies, dependencies, and strategic threads. Each risk must have:
   - "risk": Clear, specific risk title
   - "description": Brief explanation of the risk context
   - "category": One of "Strategic" | "Operational" | "Governance" | "Commercial"
   - "severity": Number 1-5 (5 = highest/most critical, closest to center of risk radar)
   - "mitigation": Specific mitigation strategy
   
   CATEGORY DEFINITIONS:
   • Strategic (3-4 risks): Risks that could limit positioning ServiceNow as a strategic platform partner - e.g., competitor displacement, misalignment with customer strategy, executive sponsor changes
   • Operational (3-4 risks): Risks impacting execution velocity, adoption, and realized value - e.g., implementation delays, resource constraints, change management failures
   • Governance (2-3 risks): Risks with governance and oversight - e.g., decision-making bottlenecks, stakeholder alignment, compliance requirements
   • Commercial (3-4 risks): Risks affecting account growth, renewal confidence, and commercial expansion - e.g., budget constraints, procurement delays, competitive pricing pressure
   
   CRITICAL: Derive risks from the ACTUAL account data provided - financial pressures, prior failures, SWOT threats, pain points, and strategic tensions. Each risk should have clear threads connecting to specific input data.

12. roadmapPhases: Array of 3 phases (each with "quarter", "title", "activities" array of 3-4 items)

13. engagementStrategy: Object with "executiveAlignment" and "keyForums" arrays

14. successMetrics: Array of 4 metrics (each with "metric" showing target, "label", "description")

15. coreValueDrivers: Array of 4 value drivers (each with "title", "description", "outcomes" array of 3 quantified strings, "alignment")

16. aiUseCases: Array of 4 AI use cases (each with "title", "description", "priority" as High/Medium/Low, "status")

17. fy1Retrospective: Object with "focusAreas" (array of 4), "keyLessons" (string), "lookingAhead" (string)

18. customerStrategySynthesis: Object with "narrative" and "serviceNowAlignment" (array of 4 with "customerPriority" and "serviceNowValue")

19. weeklyUpdateContext: Object with "overallStatus", "keyHighlights" (array of 3), "criticalActions" (array of 2-3)

20. marketingPlan: Object with "campaigns" (array of 3), "narrative"

21. insight: Object with "headline" (provocative), "observations" (array of 3), "recommendation"

22. platformCapabilities: Object with "capabilities" (array of 4), "narrative"

23. riskOpportunityMatrix: Object with "items" (array of 6), "narrative"

24. strategicAlignment: Object with "alignments" (array of 4), "narrative"

Return ONLY valid JSON. No markdown. Every element must reflect institutional-quality strategic thinking.`;

    const { content } = await callAIGateway({
      apiKey: LOVABLE_API_KEY,
      model: PREMIUM_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 32000,
    });

    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("AI response received, parsing...");
    const parsedPlan = parseJsonSafe(content, "account plan");
    console.log("Account plan generated successfully");

    return successResponse({ plan: parsedPlan });

  } catch (error) {
    console.error("Error generating account plan:", error);
    return handleAPIError(error);
  }
});
