import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  corsHeaders,
  callAIGateway,
  handleAPIError,
  getAPIKey,
  parseJsonSafe,
  successResponse,
  errorResponse,
} from "../_shared/validation.ts";

type Section =
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
  | "keyRisks"
  | "fy1Retrospective"
  | "customerStrategySynthesis"
  | "weeklyUpdateContext"
  | "marketingPlan"
  | "insight"
  | "platformCapabilities"
  | "riskOpportunityMatrix"
  | "strategicAlignment";

const sectionSpecs: Record<
  Section,
  { keys: string[]; instruction: string; outputShapeHint: string }
> = {
  executiveSummary: {
    keys: ["executiveSummaryNarrative", "executiveSummaryPillars"],
    instruction:
      "Create an executive-ready 3-4 sentence narrative plus exactly 4 pillars. Pillars must use icon in {network|customer|technology|efficiency}.",
    outputShapeHint:
      '{"executiveSummaryNarrative":"...","executiveSummaryPillars":[{"icon":"network","keyword":"BETTER","title":"NETWORK","tagline":"...","description":"...","outcome":"..."}]}',
  },
  keyWorkstreams: {
    keys: ["keyWorkstreams"],
    instruction:
      "Create exactly 3 transformation workstreams with commercial clarity (close date, ACV, insight, stakeholders).",
    outputShapeHint:
      '{"keyWorkstreams":[{"title":"...","subtitle":"...","dealStatus":"Active Pursuit","targetClose":"Q1 FY26","acv":"$X","steadyStateBenefit":"$Y","insight":"...","people":[{"name":"...","role":"..."}]}]}',
  },
  strategicPriorities: {
    keys: ["strategicPriorities"],
    instruction:
      "Create exactly 3 must-win priorities. Keep them specific, economically meaningful, and board-ready.",
    outputShapeHint:
      '{"strategicPriorities":[{"title":"...","whyNow":"...","ifWeLose":"...","winningLooks":"...","alignment":"...","color":"from-primary to-accent"}]}',
  },
  coreValueDrivers: {
    keys: ["coreValueDrivers"],
    instruction:
      "Create exactly 4 value drivers with crisp outcomes (3 bullets each) and clear strategic alignment.",
    outputShapeHint:
      '{"coreValueDrivers":[{"title":"...","description":"...","outcomes":["...","...","..."],"alignment":"..."}]}',
  },
  aiUseCases: {
    keys: ["aiUseCases"],
    instruction:
      "Create exactly 4 AI use cases. Provide priority (High/Medium/Low) and status (Pilot Ready/Discovery/Scoped/Planned).",
    outputShapeHint:
      '{"aiUseCases":[{"title":"...","description":"...","priority":"High","status":"Pilot Ready"}]}',
  },
  successMetrics: {
    keys: ["successMetrics"],
    instruction:
      "Create exactly 4 success metrics with measurable targets and plain-language descriptions.",
    outputShapeHint:
      '{"successMetrics":[{"metric":"$X","label":"...","description":"..."}]}',
  },
  roadmapPhases: {
    keys: ["roadmapPhases"],
    instruction:
      "Create exactly 3 transformation roadmap phases with quarter (e.g., Q1 FY26), title, and 3-4 activities per phase.",
    outputShapeHint:
      '{"roadmapPhases":[{"quarter":"Q1 FY26","title":"Foundation","activities":["Activity 1","Activity 2","Activity 3"]}]}',
  },
  strategicObservations: {
    keys: ["strategicObservations"],
    instruction:
      "Create exactly 4 strategic observations. Each should be a verifiable fact about the account's current situation with clear business implications.",
    outputShapeHint:
      '{"strategicObservations":[{"heading":"AI-First Ambition","detail":"Declared AI-first strategy with execution infrastructure lagging behind ambition."}]}',
  },
  strategicImplications: {
    keys: ["strategicImplications"],
    instruction:
      "Create exactly 4 strategic implications. Each should explain what must change based on the observations - be specific about the transformation required.",
    outputShapeHint:
      '{"strategicImplications":[{"heading":"Workflow Automation","detail":"Manual processes cannot scale with AI ambition. Every workflow must be automatable."}]}',
  },
  strategicTensions: {
    keys: ["strategicTensions"],
    instruction:
      "Create exactly 4 strategic tensions the customer faces. Each tension represents opposing forces that must be balanced. Include heading, detail, leftLabel (one side of tension), leftDescription, rightLabel (opposing side), rightDescription, and dilemma (the core challenge).",
    outputShapeHint:
      '{"strategicTensions":[{"heading":"Speed vs. Stability","detail":"The pressure to innovate rapidly conflicts with the need for operational reliability.","leftLabel":"Innovation Speed","leftDescription":"Rapid deployment of new capabilities to stay competitive","rightLabel":"Operational Stability","rightDescription":"Maintaining reliable systems and avoiding disruption","dilemma":"How to accelerate innovation without destabilizing core operations?"}]}',
  },
  valueHypotheses: {
    keys: ["valueHypotheses"],
    instruction:
      "Create exactly 4 value hypotheses. Each must have a testable outcome, mechanism, timeframe, and economic impact.",
    outputShapeHint:
      '{"valueHypotheses":[{"outcome":"Reduce cost-to-serve by 30%","mechanism":"Platform consolidation eliminates duplicate systems","timeframe":"12-18 months","impact":"$15-20M annual savings"}]}',
  },
  risksMitigations: {
    keys: ["risksMitigations"],
    instruction:
      "Create exactly 4 risks with mitigation strategies. Level must be High, Medium, or Low. Be specific about the risk and actionable on mitigation.",
    outputShapeHint:
      '{"risksMitigations":[{"risk":"Incumbent Vendor Lock-in","mitigation":"Lead with differentiated AI narrative; demonstrate clear TCO advantage","level":"High"}]}',
  },
  keyRisks: {
    keys: ["keyRisks"],
    instruction:
      `Create exactly 10-13 categorized risks distributed across 4 categories. Analyze ALL input data to identify synergies, dependencies, and strategic threads. Each risk must have:
      - "risk": Clear, specific risk title
      - "description": Brief explanation of the risk context
      - "category": One of "Strategic" | "Operational" | "Governance" | "Commercial"
      - "severity": Number 1-5 (5 = highest/most critical)
      - "mitigation": Specific mitigation strategy
      
      CATEGORY DISTRIBUTION:
      • Strategic (3-4 risks): Risks limiting ServiceNow positioning - competitor displacement, strategy misalignment, sponsor changes
      • Operational (3-4 risks): Risks impacting execution - implementation delays, resource constraints, change management failures
      • Governance (2-3 risks): Governance risks - decision bottlenecks, stakeholder alignment, compliance requirements
      • Commercial (3-4 risks): Commercial risks - budget constraints, procurement delays, competitive pricing pressure
      
      CRITICAL: Derive risks from ACTUAL account data - financial pressures, prior failures, SWOT threats, pain points, strategic tensions.`,
    outputShapeHint:
      '{"keyRisks":[{"risk":"Executive Sponsor Transition","description":"Key sponsor departing creates relationship gap","category":"Strategic","severity":5,"mitigation":"Accelerate multi-threaded engagement across leadership team"},{"risk":"Budget Cycle Misalignment","description":"Customer fiscal year ends Q4, may delay Q1 decisions","category":"Commercial","severity":3,"mitigation":"Pre-negotiate framework agreement before budget lock"}]}',
  },
  fy1Retrospective: {
    keys: ["fy1Retrospective"],
    instruction:
      "Create a FY-1 retrospective with exactly 4 focus areas (title + description), a keyLessons string summarizing what was learned from the previous year, and a lookingAhead string explaining how FY-1 sets up the coming year. Base this on the account history data.",
    outputShapeHint:
      '{"fy1Retrospective":{"focusAreas":[{"title":"Rebuilding Trust","description":"Re-establishing credibility with stakeholders..."}],"keyLessons":"Despite initial setbacks, the team demonstrated...","lookingAhead":"The foundation laid in FY-1 positions us for..."}}',
  },
  customerStrategySynthesis: {
    keys: ["customerStrategySynthesis"],
    instruction:
      "Create a synthesis of the customer's strategy and how ServiceNow aligns. Include a 2-3 sentence narrative and exactly 4 alignment pairs showing customer priority matched to ServiceNow value.",
    outputShapeHint:
      '{"customerStrategySynthesis":{"narrative":"The customer is pursuing an integrated logistics strategy...","serviceNowAlignment":[{"customerPriority":"AI-First Operations","serviceNowValue":"Workflow orchestration layer for AI operationalisation"}]}}',
  },
  weeklyUpdateContext: {
    keys: ["weeklyUpdateContext"],
    instruction:
      "Generate weekly update context based on the account's current situation. Include overallStatus (On Track/At Risk/Blocked), 3 keyHighlights for stakeholder communication, and 2-3 criticalActions that need decisions.",
    outputShapeHint:
      '{"weeklyUpdateContext":{"overallStatus":"On Track","keyHighlights":["Secured executive sponsorship for CRM initiative","Technical discovery completed"],"criticalActions":["Approval needed for expanded POC scope","Alignment on contract structure"]}}',
  },
  marketingPlan: {
    keys: ["marketingPlan"],
    instruction:
      "Create a marketing plan with exactly 3 campaigns (each with title, description, timeline, and channels array) and a 2-3 sentence narrative describing the overall marketing approach for this account.",
    outputShapeHint:
      '{"marketingPlan":{"campaigns":[{"title":"Executive Engagement Series","description":"Quarterly C-suite briefings on digital transformation trends","timeline":"Q1-Q4 FY26","channels":["Executive Events","Webinars","1:1 Meetings"]}],"narrative":"Our marketing approach focuses on executive education and thought leadership..."}}',
  },
  insight: {
    keys: ["insight"],
    instruction:
      "Create a strategic insight with a provocative headline that captures a key revelation about the account, 3 supporting observations (each with title and detail), and an actionable recommendation.",
    outputShapeHint:
      '{"insight":{"headline":"The Hidden Cost of Fragmentation","observations":[{"title":"Siloed Systems","detail":"Customer operates 47 disconnected workflow tools"}],"recommendation":"Propose unified platform assessment to quantify consolidation opportunity"}}',
  },
  platformCapabilities: {
    keys: ["platformCapabilities"],
    instruction:
      "Create exactly 4 platform capabilities that address the customer's needs. Each capability should have a title, description of what it does, and value explaining the business impact. Include a 2-3 sentence narrative on overall platform strategy.",
    outputShapeHint:
      '{"platformCapabilities":{"capabilities":[{"title":"Workflow Automation Engine","description":"Orchestrate complex multi-step processes across departments","value":"Reduces manual handoffs by 80%, accelerating resolution times"}],"narrative":"ServiceNow\'s platform provides a unified foundation for digital transformation..."}}',
  },
  riskOpportunityMatrix: {
    keys: ["riskOpportunityMatrix"],
    instruction:
      "Create a risk/opportunity matrix with exactly 6 items (mix of risks and opportunities). Each item needs title, type (risk or opportunity), impact (High/Medium/Low), likelihood (High/Medium/Low), and mitigation for risks. Include a summary narrative.",
    outputShapeHint:
      '{"riskOpportunityMatrix":{"items":[{"title":"Competitor Displacement","type":"opportunity","impact":"High","likelihood":"Medium"},{"title":"Budget Constraints","type":"risk","impact":"High","likelihood":"Medium","mitigation":"Phase implementation to spread costs across fiscal years"}],"narrative":"The account presents a balanced risk/opportunity profile with significant upside potential..."}}',
  },
  strategicAlignment: {
    keys: ["strategicAlignment"],
    instruction:
      "Create exactly 4 strategic alignment pairs showing how ServiceNow capabilities map to customer objectives. Each pair should have customerObjective, serviceNowCapability, and expected outcome. Include a 2-3 sentence narrative on strategic fit.",
    outputShapeHint:
      '{"strategicAlignment":{"alignments":[{"customerObjective":"Reduce operational costs by 20%","serviceNowCapability":"IT Service Management automation","outcome":"Projected 25% reduction in IT support costs within 18 months"}],"narrative":"ServiceNow\'s capabilities directly address the customer\'s strategic imperatives..."}}',
  },
};

function cleanJson(raw: string) {
  let s = (raw || "").trim();
  if (s.startsWith("```json")) s = s.slice(7);
  if (s.startsWith("```")) s = s.slice(3);
  if (s.endsWith("```")) s = s.slice(0, -3);
  return s.trim();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accountData, section } = await req.json();

    if (!section || !(section in sectionSpecs)) {
      return errorResponse(400, "Invalid section");
    }

    const LOVABLE_API_KEY = getAPIKey();
    const spec = sectionSpecs[section as Section];

    const systemPrompt = `You are an elite McKinsey-caliber enterprise account strategist for ServiceNow.
Your task: Regenerate ONE section of an enterprise account plan with institutional-quality strategic content.

EXCELLENCE STANDARDS:
- Every insight must be specific, quantified where possible, and defensible
- Use executive-level, board-ready language that a CEO could quote verbatim
- Reference the customer's actual situation, terminology, and stated priorities
- Stay consistent with the rest of the plan while elevating quality
- Connect all insights to ServiceNow's differentiated value
- Ensure commercial rigor with quantified outcomes where credible

OUTPUT RULES:
- Return ONLY valid JSON (no markdown code blocks)
- Include ONLY the keys requested for this section
- Every element must pass the "Would this impress a Fortune 100 executive?" test`;

    const userPrompt = `Regenerate ONLY this section: ${section}

SECTION REQUIREMENTS:
${spec.instruction}

ACCOUNT:
- Name: ${accountData?.basics?.accountName || "Unknown"}
- Vision: ${accountData?.basics?.visionStatement || "Not defined"}
- Current Contract: ${accountData?.basics?.currentContractValue || "Unknown"}
- FY Target: ${accountData?.basics?.nextFYAmbition || "Unknown"}
- 3-Year Target: ${accountData?.basics?.threeYearAmbition || "Unknown"}

FINANCIAL CONTEXT:
- Revenue: ${accountData?.financial?.customerRevenue || "Unknown"}
- Growth: ${accountData?.financial?.growthRate || "Unknown"}
- EBIT: ${accountData?.financial?.marginEBIT || "Unknown"}
- Cost Pressures: ${accountData?.financial?.costPressureAreas || "Unknown"}
- Strategic Investments: ${accountData?.financial?.strategicInvestmentAreas || "Unknown"}

STRATEGY INPUTS (raw):
- Corporate Strategy: ${JSON.stringify(accountData?.strategy?.corporateStrategy || [])}
- Digital Strategy: ${JSON.stringify(accountData?.strategy?.digitalStrategies || [])}
- CEO/Board Priorities: ${JSON.stringify(accountData?.strategy?.ceoBoardPriorities || [])}
- Transformation Themes: ${JSON.stringify(accountData?.strategy?.transformationThemes || [])}

PAIN POINTS:
${JSON.stringify(accountData?.painPoints?.painPoints || [])}

OPPORTUNITIES:
${JSON.stringify(accountData?.opportunities?.opportunities || [])}

SWOT:
${JSON.stringify(accountData?.swot || {})}

EXISTING AI PLAN (for consistency):
${JSON.stringify(accountData?.generatedPlan || {}, null, 2)}

OUTPUT SHAPE EXAMPLE (follow this exactly, but with real content):
${spec.outputShapeHint}

Return ONLY valid JSON.`;

    const { content } = await callAIGateway({
      apiKey: LOVABLE_API_KEY,
      model: "openai/gpt-5.2",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.75,
    });

    if (!content) throw new Error("No content in AI response");

    const parsed = parseJsonSafe<Record<string, unknown>>(content, "section");

    // Validate required keys exist
    const missing = spec.keys.filter((k) => parsed[k] == null);
    if (missing.length > 0) {
      throw new Error(`AI output missing keys: ${missing.join(", ")}`);
    }

    const patch: Record<string, unknown> = {};
    for (const k of spec.keys) patch[k] = parsed[k];

    return successResponse(patch, { patch });
  } catch (error) {
    console.error("Error regenerating plan section:", error);
    return handleAPIError(error);
  }
});
