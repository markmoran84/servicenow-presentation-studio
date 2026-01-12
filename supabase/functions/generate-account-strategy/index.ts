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
    const { accountData } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Check if there's an existing strategy to build upon
    const existingStrategy = accountData.accountStrategy?.strategyNarrative;
    const existingBigBets = accountData.accountStrategy?.bigBets || [];

    const prompt = `You are a strategic account planning expert for enterprise technology sales. Based on the following account data, write a compelling account strategy narrative.

The narrative should:
- Be 2-3 paragraphs (150-250 words)
- Focus on the strategic opportunity for ServiceNow at this account
- Reference key pain points and how ServiceNow addresses them
- Mention the primary commercial wedge and expansion path
- Be written in first-person plural ("Our strategy..." "We will...")
- Sound professional and confident, suitable for executive presentations
${existingBigBets.length > 0 ? "- Reference and align with the defined Big Bets/workstreams" : ""}
${existingStrategy ? "- Build upon and improve the existing strategy direction shown below" : ""}

Account Data:
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

Strategic Opportunities:
${accountData.opportunities?.opportunities?.map((o: any) => `- ${o.title}: ${o.description}`).join("\n") || "Not specified"}

Annual Report Highlights:
${accountData.annualReport?.executiveSummaryNarrative || "Not available"}

${existingBigBets.length > 0 ? `Defined Big Bets (align strategy to these workstreams):
${existingBigBets.map((b: any) => `- ${b.title}: ${b.subtitle || ""} (${b.dealStatus}, ${b.netNewACV})`).join("\n")}` : ""}

${existingStrategy ? `Existing Strategy Direction (improve and build upon this):
${existingStrategy}` : ""}

Write only the strategy narrative, no headers or formatting.`;

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
        max_tokens: 800,
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
    const strategyNarrative = result.choices?.[0]?.message?.content?.trim() || "";

    return new Response(
      JSON.stringify({ 
        success: true, 
        strategyNarrative 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating account strategy:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
