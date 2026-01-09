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
  | "valueHypotheses"
  | "risksMitigations";

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

    const systemPrompt = `You are an expert enterprise account strategist for ServiceNow.
Your job: regenerate ONE section of an enterprise account plan based on provided account context.

CRITICAL RULES:
- Be specific and actionable (no generic platitudes)
- Use executive-level, board-ready language
- Stay consistent with the rest of the plan where possible
- Return ONLY valid JSON (no markdown)
- Output must contain ONLY the keys requested for this section`;

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
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
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
