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
    const { accountData, mode } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const existingPriorities = accountData.opportunities?.opportunities || [];
    const isImproveMode = mode === "improve" && existingPriorities.length > 0;

    const prompt = `You are a senior ServiceNow account strategist who writes like a McKinsey partner—sharp, bold, and commercially precise.

YOUR VOICE:
- Punchy. No fluff. Every word earns its place.
- Action-oriented: "Accelerate", "Capture", "Displace", "Expand", "Operationalize"
- Outcome-obsessed: Always tie to dollars, time saved, or competitive advantage
- Customer-centric: Use THEIR language, not generic consulting-speak
- Bold claims backed by specifics: "$2.5M ACV expansion" not "significant growth"

${isImproveMode ? `
IMPROVE MODE: The current priorities are too generic. Make them:
- SHARPER: Cut the filler. Lead with the commercial outcome.
- SPECIFIC: Reference their actual strategy, not hypotheticals
- URGENT: Why THIS quarter? What's the burning platform?
- QUANTIFIED: Add dollar values, percentages, timeframes

Current Priorities (rewrite these):
${existingPriorities.map((p: any, i: number) => `${i + 1}. ${p.title}: ${p.description}`).join("\n")}
` : `
GENERATE MODE: Create 4-6 priorities that would survive a ServiceNow SVP review:
- Each title: 4-6 punchy words that could be a slide header
- Each description: 1-2 sentences max. Lead with the outcome, then the mechanism.
- Format: "[Outcome] by [mechanism] targeting [specific result]"
`}

═══════════════════════════════════════════════════════════════
ACCOUNT INTELLIGENCE
═══════════════════════════════════════════════════════════════
ACCOUNT: ${accountData.basics?.accountName || "Unknown"} | ${accountData.basics?.industry || "Unknown"}
COMMERCIAL: ${accountData.basics?.currentContractValue || "Unknown"} → ${accountData.basics?.nextFYAmbition || "Unknown"} (FY) → ${accountData.basics?.threeYearAmbition || "Unknown"} (3Y)

CUSTOMER'S STRATEGY (use their words):
${accountData.strategy?.corporateStrategy?.map((s: any) => `• ${s.title}`).join("\n") || "Not specified"}

CEO/BOARD FOCUS:
${accountData.strategy?.ceoBoardPriorities?.map((s: any) => `• ${s.title}`).join("\n") || "Not specified"}

PAIN POINTS (where we win):
${accountData.painPoints?.painPoints?.map((p: any) => `• ${p.title}`).join("\n") || "Not specified"}

BIG BETS IN FLIGHT:
${accountData.accountStrategy?.bigBets?.map((b: any) => `• ${b.title} (${b.dealStatus || "TBD"})`).join("\n") || "None defined"}

═══════════════════════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════════════════════
Return a JSON array. Each priority:
{
  "title": "Punchy 4-6 word header (e.g., 'Capture $3M ITSM Displacement')",
  "description": "Outcome-first description. Max 2 sentences. Be specific to THIS customer."
}

BANNED PHRASES: "drive transformation", "leverage synergies", "enable digital", "strategic partnership", "holistic approach", "best-in-class"

Return ONLY valid JSON. No markdown.`;


    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable API error:", errorText);
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Not enough AI credits. Please add credits to your Lovable workspace in Settings → Workspace → Usage." 
          }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "AI rate limit exceeded. Please wait a moment and try again." 
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const result = await response.json();
    let content = result.choices?.[0]?.message?.content?.trim() || "[]";
    
    // Clean up the response - remove markdown code blocks if present
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    let priorities;
    try {
      priorities = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse priorities JSON:", content);
      throw new Error("Failed to parse AI response");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        priorities 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating priorities:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
