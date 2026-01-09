/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accountData, existingBets, betIndex } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Build context about existing bets to avoid duplication
    const existingBetsContext = existingBets?.length > 0
      ? `EXISTING BIG BETS (do NOT repeat these themes, phrases, or titles):\n${existingBets
          .map((b: any, i: number) => `${i + 1}. ${b.title || "Untitled"}: ${b.subtitle || "No subtitle"}`)
          .join("\n")}`
      : "";

    // Detect sample/template data and avoid hard-coding the sample company name into outputs
    const sampleAccountNames = new Set(["A.P. Møller - Maersk", "Maersk"]);
    const rawAccountName = (accountData.basics?.accountName || "").trim();
    const isSampleAccount = !rawAccountName || sampleAccountNames.has(rawAccountName);
    const companyRef = isSampleAccount ? "the customer" : rawAccountName;
    const industryRef = (accountData.basics?.industry || "").trim() || "the industry";

    // Get overall account strategy for alignment
    const accountStrategyNarrativeRaw = (accountData.accountStrategy?.strategyNarrative || "").trim();
    const accountStrategyNarrative = isSampleAccount
      ? accountStrategyNarrativeRaw.replaceAll("Maersk", "the customer")
      : accountStrategyNarrativeRaw;

    // Add variety through different strategic angles
    const angles = [
      "competitive displacement opportunity",
      "digital transformation catalyst",
      "cost optimization play",
      "customer experience differentiator",
      "operational efficiency accelerator",
      "risk mitigation initiative",
      "innovation enablement platform",
      "strategic consolidation opportunity",
    ];
    const randomAngle = angles[Math.floor(Math.random() * angles.length)];

    const prompt = `You are a world-class enterprise sales strategist (ServiceNow). You create thought-leading, board-level deal narratives that do NOT sound templated.

TASK
Generate 3 DISTINCT Big Bet options for this account. Each option must be a materially different thesis (different wedge / different executive trigger / different value narrative).

NON-NEGOTIABLE QUALITY BAR
- No generic rewording of pain points; produce a fresh *point of view*.
- Include a second-order consequence (what breaks if they don't act) AND a competitive consequence.
- Be specific about timing and value.
- Avoid buzzwords ("leverage", "synergy", "optimize", "transform") unless truly necessary.
- Do NOT copy phrases from EXISTING BIG BETS or the existing strategy narrative; keep meaning but change wording.

VOICE
Trusted-advisor, crisp, slightly provocative, executive-ready.

IMPORTANT NAMING
- Unless the company name is explicitly provided by the user, refer to them as "the customer".
- Never mention "Maersk" in the output.

ANGLE TO PRIORITIZE THIS TIME: ${randomAngle}

ACCOUNT CONTEXT
Company: ${companyRef} (${industryRef})
Current investment: ${accountData.basics?.currentContractValue || "Unknown"} → Target: ${accountData.basics?.nextFYAmbition || "Unknown"} (FY) → ${accountData.basics?.threeYearAmbition || "Unknown"} (3yr)

${accountStrategyNarrative ? `OVERALL ACCOUNT STRATEGY (align to this, but do NOT reuse wording):\n${accountStrategyNarrative}` : ""}

CUSTOMER STRATEGY (extract what matters, don't copy):
${accountData.strategy?.corporateStrategy?.map((s: any) => `• ${s.title}: ${s.description}`).join("\n") || "Not specified"}

CEO/BOARD PRESSURE:
${accountData.strategy?.ceoBoardPriorities?.map((s: any) => `• ${s.title}: ${s.description || ""}`).join("\n") || "Not specified"}

PAIN POINTS:
${accountData.painPoints?.painPoints?.map((p: any) => `• ${p.title}: ${p.description}`).join("\n") || "Not specified"}

OPPORTUNITIES:
${accountData.opportunities?.opportunities?.map((o: any) => `• ${o.title}: ${o.description}`).join("\n") || "Not specified"}

${existingBetsContext}

OUTPUT
Return ONLY valid JSON, no markdown, in this schema:
{
  "options": [
    {
      "title": "Deal-name style (max 6 words)",
      "subtitle": "Outcome-focused subtitle",
      "dealStatus": "Active Pursuit | Strategic Initiative | Foundation Growth | Pipeline",
      "targetClose": "e.g., Q3 2026",
      "netNewACV": "e.g., $4.5M",
      "steadyStateBenefit": "e.g., $120M/year",
      "insight": "3 sentences max. Sentence 1: contrarian truth. Sentence 2: why now + quantified stakes. Sentence 3: why ServiceNow is the wedge and what they lose if they delay."
    },
    { "title": "...", "subtitle": "...", "dealStatus": "...", "targetClose": "...", "netNewACV": "...", "steadyStateBenefit": "...", "insight": "..." },
    { "title": "...", "subtitle": "...", "dealStatus": "...", "targetClose": "...", "netNewACV": "...", "steadyStateBenefit": "...", "insight": "..." }
  ]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 900,
        temperature: 1.05,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("Lovable AI error:", errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const result = await response.json();
    let content = result.choices?.[0]?.message?.content?.trim() || "";

    // Clean up potential markdown formatting
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const parsed = JSON.parse(content);
    const options = Array.isArray(parsed?.options) ? parsed.options : [parsed];
    if (options.length === 0) {
      throw new Error("AI returned no options");
    }

    // Deterministic selection when betIndex is provided; otherwise random
    const pickIndex = typeof betIndex === "number"
      ? Math.abs(betIndex) % options.length
      : Math.floor(Math.random() * options.length);

    const bigBet = options[pickIndex];

    return new Response(
      JSON.stringify({ 
        success: true, 
        bigBet 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating big bet:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
