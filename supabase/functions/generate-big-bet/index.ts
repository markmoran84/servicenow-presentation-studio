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
      ? `Already defined Big Bets (avoid duplicating these themes):
${existingBets.map((b: any, i: number) => `${i + 1}. ${b.title || "Untitled"}: ${b.subtitle || "No subtitle"}`).join("\n")}`
      : "No existing Big Bets defined yet.";

    const prompt = `You are a strategic account planning expert for enterprise technology sales (ServiceNow). Generate a compelling Big Bet / strategic workstream suggestion for the following account.

A "Big Bet" is a major strategic initiative or deal opportunity that ServiceNow should pursue with this customer. It should be:
- Tied to a specific customer pain point or strategic priority
- Commercially significant (suggest realistic ACV and business benefit)
- Actionable with clear timing

Account Context:
- Account Name: ${accountData.basics?.accountName || "Unknown"}
- Industry: ${accountData.basics?.industry || "Unknown"}
- Current ACV: ${accountData.basics?.currentContractValue || "Unknown"}
- Next FY Ambition: ${accountData.basics?.nextFYAmbition || "Unknown"}
- 3 Year Ambition: ${accountData.basics?.threeYearAmbition || "Unknown"}

Customer Corporate Strategy:
${accountData.strategy?.corporateStrategy?.map((s: any) => `- ${s.title}: ${s.description}`).join("\n") || "Not specified"}

Customer Digital Strategies:
${accountData.strategy?.digitalStrategies?.map((s: any) => `- ${s.title}: ${s.description}`).join("\n") || "Not specified"}

Key Pain Points:
${accountData.painPoints?.painPoints?.map((p: any) => `- ${p.title}: ${p.description}`).join("\n") || "Not specified"}

Strategic Opportunities:
${accountData.opportunities?.opportunities?.map((o: any) => `- ${o.title}: ${o.description}`).join("\n") || "Not specified"}

SWOT Analysis:
- Strengths: ${accountData.swot?.strengths?.join(", ") || "Not specified"}
- Weaknesses: ${accountData.swot?.weaknesses?.join(", ") || "Not specified"}
- Opportunities: ${accountData.swot?.opportunities?.join(", ") || "Not specified"}
- Threats: ${accountData.swot?.threats?.join(", ") || "Not specified"}

Annual Report Insights:
${accountData.annualReport?.executiveSummaryNarrative || "Not available"}

${existingBetsContext}

Generate a NEW Big Bet (different from existing ones) that ServiceNow should pursue. Return a JSON object with these exact fields:
{
  "title": "Short, impactful title (e.g., 'Global ITSM Consolidation')",
  "subtitle": "Descriptive subtitle (e.g., 'Unified IT Operations Platform')",
  "dealStatus": "One of: Active Pursuit, Strategic Initiative, Foundation Growth, Pipeline",
  "targetClose": "e.g., Q2 2026",
  "netNewACV": "e.g., $3M",
  "steadyStateBenefit": "Annual business benefit, e.g., $250M",
  "insight": "2-3 sentences explaining the strategic rationale and why now"
}

Return ONLY the JSON object, no markdown formatting or additional text.`;

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
        max_tokens: 500,
        temperature: 0.8,
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
