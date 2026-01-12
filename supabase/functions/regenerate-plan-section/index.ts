import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
      `Transform the customer's extracted strategy into a STRATEGIC IMPERATIVES format - a structured canvas that translates raw strategy into executable priorities.

CRITICAL INSTRUCTIONS:
- Use the customer's EXACT language and phrasing from their annual report/strategy documents wherever possible
- Do NOT invent generic business jargon or consulting-speak  
- Preserve specificity: if they say "ROIC >7.5%" keep that exact figure
- Mirror their terminology: if they call it "Gemini Network" use that name
- This is a TRANSLATION exercise, not a rewriting exercise

OUTPUT STRUCTURE:

1. purpose: The customer's stated purpose/mission (1 sentence, use their exact words if available)

2. longerTermAims: Array of 4-6 VERB-FIRST action statements representing long-term ambitions. Each has:
   - title: VERB-FIRST action statement (e.g., "Become the global integrator of container logistics", "Deliver a connected, simplified customer experience end-to-end"). Start with action verbs like Become, Deliver, Improve, Grow, Digitise, Decarbonise, Lead, Drive, Transform, Scale
   - description: 1-2 sentence elaboration with specific details from the customer's strategy

3. annualTasks: Array of 3-4 focus areas for the current/next fiscal year. Each has:
   - title: Task theme (customer's own strategic pillars)
   - color: One of {blue|emerald|amber|cyan} for visual variety
   
4. objectives: Array of 6-8 specific objectives/initiatives that ladder up to the tasks. Each has:
   - title: Specific objective (numbered if customer uses numbering)
   - detail: Brief elaboration
   - taskIndex: Which annualTask this objective supports (0-based index)
   - isAIEnabled: true if this objective involves AI/automation (mark with green indicator)

5. serviceNowAlignment: Array of 3-4 showing platform enablement opportunities:
   - customerPriority: Customer's stated objective
   - serviceNowValue: How ServiceNow enables this (be specific to products/capabilities)

6. accentColor: Choose from {blue|emerald|amber|cyan|indigo} based on customer's brand/industry

TONE: Senior strategist translating board-level strategy into an execution canvas. Preserve customer voice.`,
    outputShapeHint:
      `{"customerStrategySynthesis":{"purpose":"Improving life for all by integrating the world","longerTermAims":[{"title":"Become the global integrator of container logistics","description":"Position as the end-to-end partner connecting Ocean, Logistics & Services, and Terminals as one integrated offering."},{"title":"Deliver a connected, simplified customer experience end-to-end","description":"Remove friction across touchpoints; make it effortless to do business with us regardless of service line."},{"title":"Improve reliability and network performance across Ocean–L&S–Terminals","description":"Raise schedule reliability and reduce dwell times through better coordination and visibility."},{"title":"Grow Logistics & Services with disciplined profitability","description":"Expand L&S revenue while maintaining ROIC >7.5% and healthy margins."},{"title":"Digitise and automate supply chain operations and decision-making","description":"Shift manual processes to digital workflows; enable real-time decisions through data."},{"title":"Decarbonise the business and lead green logistics at scale","description":"Deploy green methanol fleet; achieve net zero by 2040 across Scope 1, 2, and 3 emissions."}],"annualTasks":[{"title":"Strengthen customer focus and profitable growth","color":"blue"},{"title":"Drive operational excellence across the network","color":"emerald"},{"title":"Accelerate technology and transformation","color":"amber"},{"title":"Scale AI and data to power intelligent operations","color":"cyan"}],"objectives":[{"title":"1. Win with customers through speed and reliability","detail":"Deliver faster, more predictable experiences across every touchpoint","taskIndex":0,"isAIEnabled":false},{"title":"10. Deploy agentic AI workflows","detail":"Reduce customer query turnaround time and improve service speed","taskIndex":3,"isAIEnabled":true}],"serviceNowAlignment":[{"customerPriority":"Deploy agentic AI workflows","serviceNowValue":"Now Assist for workflow automation and case deflection"}],"accentColor":"emerald"}}`,
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
      return new Response(JSON.stringify({ success: false, error: "Invalid section" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.75,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ success: false, error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ success: false, error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ success: false, error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await response.json();
    const content = aiResponse?.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content in AI response");

    let parsed: any;
    try {
      parsed = JSON.parse(cleanJson(content));
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI-generated section");
    }

    // Validate required keys exist
    const missing = spec.keys.filter((k) => parsed?.[k] == null);
    if (missing.length > 0) {
      throw new Error(`AI output missing keys: ${missing.join(", ")}`);
    }

    const patch: Record<string, unknown> = {};
    for (const k of spec.keys) patch[k] = parsed[k];

    return new Response(JSON.stringify({ success: true, patch }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error regenerating plan section:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
