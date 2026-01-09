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

    const prompt = `You are writing internal account intelligence briefings for enterprise sales. Your tone is JOURNALISTIC and FACTUAL - like an analyst briefing, not a sales pitch.

STUDY THESE EXAMPLES OF GOOD INSIGHTS:
- "${companyRef} is pursuing an ambitious AI strategy, but Salesforce's current offerings aren't delivering the required value. As a result, ${companyRef} plans to replace Service Cloud with solutions from ServiceNow, Microsoft, or Oracle. A final decision is expected in Q1."
- "${companyRef}'s CPQ process has been a long-standing challenge, with significant gaps still filled using Excel. Over 230 people currently maintain the existing system. The goal is to start with a small-scale implementation and expand over time."
- "${companyRef} Logistics currently lacks a CSM system, and the business line is relatively immature. ServiceNow is running a pilot, and the team is awaiting results from the Ocean RFP before further decisions."

NOTICE THE STYLE:
- Starts with "[Customer] is..." or "[Customer]'s [process] has..."
- Uses SPECIFIC numbers (230 people, Q1 decision, 18 months)
- Names competitors directly (Salesforce, Microsoft, Oracle, SAP)
- Short, declarative sentences
- Sounds like an informed insider, not a salesperson
- No buzzwords, no hype, no "transform" or "leverage"
- Mentions decision timelines and current state

TASK: Generate 3 distinct Big Bet options. Each must have a DIFFERENT strategic angle.

ACCOUNT CONTEXT
Company: ${companyRef} (${industryRef})
Current ServiceNow: ${accountData.basics?.currentContractValue || "Unknown"} 
Target: ${accountData.basics?.nextFYAmbition || "Unknown"} (next FY)

${accountStrategyNarrative ? `ACCOUNT STRATEGY:\n${accountStrategyNarrative}` : ""}

CUSTOMER PRIORITIES:
${accountData.strategy?.corporateStrategy?.map((s: any) => `• ${s.title}: ${s.description}`).join("\n") || "Not specified"}

CEO/BOARD FOCUS:
${accountData.strategy?.ceoBoardPriorities?.map((s: any) => `• ${s.title}: ${s.description || ""}`).join("\n") || "Not specified"}

PAIN POINTS:
${accountData.painPoints?.painPoints?.map((p: any) => `• ${p.title}: ${p.description}`).join("\n") || "Not specified"}

OPPORTUNITIES:
${accountData.opportunities?.opportunities?.map((o: any) => `• ${o.title}: ${o.description}`).join("\n") || "Not specified"}

${existingBetsContext}

OUTPUT: Return ONLY valid JSON:
{
  "options": [
    {
      "title": "Short deal name (4-6 words)",
      "subtitle": "Outcome description",
      "dealStatus": "Active Pursuit | Strategic Initiative | Foundation Growth | Pipeline",
      "targetClose": "Q# YYYY",
      "netNewACV": "$XM",
      "steadyStateBenefit": "$XM annual",
      "insight": "Write 2-3 SHORT SENTENCES in the journalistic style shown above. Start with the customer's situation. Include specific numbers, competitor context, and timeline. Sound like an internal briefing."
    },
    {...},
    {...}
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
        max_tokens: 2000,
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
