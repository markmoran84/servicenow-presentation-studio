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
      ? `EXISTING BIG BETS (generate something COMPLETELY DIFFERENT from these):
${existingBets.map((b: any, i: number) => `${i + 1}. ${b.title || "Untitled"}: ${b.subtitle || "No subtitle"}`).join("\n")}`
      : "";

    // Get overall account strategy for alignment
    const accountStrategyNarrative = accountData.accountStrategy?.strategyNarrative || "";

    // Add variety through different strategic angles
    const angles = [
      "competitive displacement opportunity",
      "digital transformation catalyst", 
      "cost optimization play",
      "customer experience differentiator",
      "operational efficiency accelerator",
      "risk mitigation initiative",
      "innovation enablement platform",
      "strategic consolidation opportunity"
    ];
    const randomAngle = angles[Math.floor(Math.random() * angles.length)];
    const betNumber = (existingBets?.length || 0) + 1;

    const prompt = `You are a world-class strategic account executive at ServiceNow, known for creative deal-making and thought leadership. Your insights regularly win multi-million dollar enterprise deals.

CRITICAL: Generate a BOLD, CREATIVE Big Bet that will impress C-level executives. Avoid generic language. Be specific and provocative.

STYLE REQUIREMENTS:
- Write like a confident sales leader, not a template
- Use specific numbers, timeframes, and business outcomes
- Reference industry-specific challenges and trends
- Make the insight feel like a genuine strategic revelation
- Avoid clichés like "leverage", "synergy", "optimize" - use vivid, action-oriented language
- Think about competitive angles: what happens if they DON'T act with ServiceNow?

STRATEGIC ANGLE TO EXPLORE: ${randomAngle}
This is Big Bet #${betNumber} - make it distinctive and complementary to any existing bets.

ACCOUNT CONTEXT:
Company: ${accountData.basics?.accountName || "Unknown"} (${accountData.basics?.industry || "Unknown"})
Current investment: ${accountData.basics?.currentContractValue || "Unknown"} → Target: ${accountData.basics?.nextFYAmbition || "Unknown"} (FY) → ${accountData.basics?.threeYearAmbition || "Unknown"} (3yr)

${accountStrategyNarrative ? `OUR ACCOUNT STRATEGY:
${accountStrategyNarrative}` : ""}

CUSTOMER'S STRATEGIC PRIORITIES:
${accountData.strategy?.corporateStrategy?.map((s: any) => `• ${s.title}: ${s.description}`).join("\n") || "Not specified"}

DIGITAL TRANSFORMATION AGENDA:
${accountData.strategy?.digitalStrategies?.map((s: any) => `• ${s.title}: ${s.description}`).join("\n") || "Not specified"}

WHAT KEEPS THEIR EXECUTIVES UP AT NIGHT:
${accountData.strategy?.ceoBoardPriorities?.map((s: any) => `• ${s.title}: ${s.description || ""}`).join("\n") || "Not specified"}

PAIN POINTS WE CAN EXPLOIT:
${accountData.painPoints?.painPoints?.map((p: any) => `• ${p.title}: ${p.description}`).join("\n") || "Not specified"}

WHITE SPACE OPPORTUNITIES:
${accountData.opportunities?.opportunities?.map((o: any) => `• ${o.title}: ${o.description}`).join("\n") || "Not specified"}

COMPETITIVE LANDSCAPE:
- Strengths: ${accountData.swot?.strengths?.slice(0, 2).join("; ") || "Not specified"}
- Vulnerabilities: ${accountData.swot?.weaknesses?.slice(0, 2).join("; ") || "Not specified"}
- Market opportunities: ${accountData.swot?.opportunities?.slice(0, 2).join("; ") || "Not specified"}
- Threats to navigate: ${accountData.swot?.threats?.slice(0, 2).join("; ") || "Not specified"}

MARKET INTELLIGENCE:
${accountData.annualReport?.executiveSummaryNarrative?.slice(0, 500) || "Not available"}

${existingBetsContext}

Generate a Big Bet that would make a CRO say "this is exactly how we win this account." Return JSON:
{
  "title": "Punchy, memorable title - think deal name that sticks (max 6 words)",
  "subtitle": "Specific outcome-focused description",
  "dealStatus": "Active Pursuit | Strategic Initiative | Foundation Growth | Pipeline",
  "targetClose": "Specific quarter and year",
  "netNewACV": "Realistic but ambitious figure with $",
  "steadyStateBenefit": "Quantified annual business value to customer",
  "insight": "A PROVOCATIVE 2-3 sentence insight that reveals WHY this matters NOW. Reference specific customer context. Include what they'll LOSE if they don't act. Make executives lean forward."
}

Return ONLY valid JSON, no markdown.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 600,
        temperature: 0.95,
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
    
    const bigBet = JSON.parse(content);

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
