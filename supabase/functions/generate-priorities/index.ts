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

    const prompt = `You are a strategic account planning expert for enterprise technology sales at ServiceNow. ${isImproveMode ? "Improve and enhance the existing account team priorities" : "Generate strategic account team priorities"} based on the account context.

${isImproveMode ? `
IMPROVE MODE: You have existing priorities to enhance. Make them:
- More specific and actionable
- Better aligned with the customer's stated priorities
- More compelling with clearer business outcomes
- Executive-ready with quantified impact where possible

Existing Priorities to Improve:
${existingPriorities.map((p: any, i: number) => `${i + 1}. ${p.title}: ${p.description}`).join("\n")}
` : `
GENERATE MODE: Create 4-6 strategic priorities that:
- Align ServiceNow solutions to customer pain points and strategies
- Are specific, actionable, and outcome-focused
- Represent the account team's focus areas for the fiscal year
- Include clear business value propositions
`}

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

CEO/Board Priorities:
${accountData.strategy?.ceoBoardPriorities?.map((s: any) => `- ${s.title}: ${s.description}`).join("\n") || "Not specified"}

Key Pain Points:
${accountData.painPoints?.painPoints?.map((p: any) => `- ${p.title}: ${p.description}`).join("\n") || "Not specified"}

Annual Report Highlights:
${accountData.annualReport?.executiveSummaryNarrative || "Not available"}

Big Bets/Workstreams:
${accountData.accountStrategy?.bigBets?.map((b: any) => `- ${b.title}: ${b.subtitle || ""}`).join("\n") || "Not defined"}

Return a JSON array of priorities with this exact structure:
[
  {
    "title": "Short priority title (5-8 words)",
    "description": "Detailed, exec-ready description with specific outcomes and value proposition (2-3 sentences)"
  }
]

Return ONLY the JSON array, no additional text or formatting.`;

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
