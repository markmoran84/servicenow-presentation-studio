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
    const { accountData, bet } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

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

    const priorInsight = (bet?.insight || "").trim();

    // Add variety through different insight angles
    const insightAngles = [
      "Competitive urgency: what happens if a competitor gets there first?",
      "Board pressure: which KPI or mandate forces action now?",
      "Hidden cost: the cost of inaction they haven't priced in.",
      "Market timing: why the next 6-12 months matter.",
      "Transformation unlock: how this unlocks the larger strategy.",
      "Risk: the operational / compliance / reputational failure mode.",
    ];
    const randomAngle = insightAngles[Math.floor(Math.random() * insightAngles.length)];

    const prompt = `You are a top-tier enterprise strategist. Write insights that feel like genuine thought leadership (not paraphrased inputs).

TASK
Generate 3 materially different insight options for the Big Bet below. They must be different angles, different wording, and different framing.

QUALITY RULES
- No company-name shoutouts. Refer to the account as "the customer".
- Do NOT reuse phrases from any prior insight.
- Include: (1) a contrarian truth, (2) quantified stakes or consequence, (3) why now + competitive risk.
- 3 sentences max per option.

ANGLE TO PRIORITIZE THIS TIME: ${randomAngle}

BIG BET
Title: ${bet.title}
Subtitle: ${bet.subtitle || ""}
Deal Status: ${bet.dealStatus || ""}
Target Close: ${bet.targetClose || ""}
Investment: ${bet.netNewACV || ""}

ACCOUNT
${companyRef} (${industryRef})

${accountStrategyNarrative ? `OVERALL ACCOUNT STRATEGY (align to this, but do NOT reuse wording):\n${accountStrategyNarrative}` : ""}

PAIN POINTS
${accountData.painPoints?.painPoints?.map((p: any) => `• ${p.title}: ${p.description}`).join("\n") || "Not specified"}

CEO/BOARD PRESSURE
${accountData.strategy?.ceoBoardPriorities?.map((s: any) => `• ${s.title}: ${s.description || ""}`).join("\n") || "Not specified"}

${priorInsight ? `PRIOR INSIGHT (do NOT paraphrase this; create a NEW framing):\n${priorInsight}` : ""}

OUTPUT
Return ONLY JSON:
{ "options": ["insight option 1", "insight option 2", "insight option 3"] }`; 

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 1.1,
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

    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let insight = "";
    try {
      const parsed = JSON.parse(content);
      const opts = Array.isArray(parsed?.options) ? parsed.options : [];
      if (opts.length) {
        insight = opts[Math.floor(Math.random() * opts.length)]?.toString()?.trim() || "";
      }
    } catch {
      // If the model didn't return JSON, fall back to raw text
      insight = content;
    }

    if (!insight) insight = content;

    return new Response(
      JSON.stringify({ 
        success: true, 
        insight 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating insight:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
