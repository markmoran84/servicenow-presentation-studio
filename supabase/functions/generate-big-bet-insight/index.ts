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

    // Get overall account strategy for alignment
    const accountStrategyNarrative = accountData.accountStrategy?.strategyNarrative || "";

    // Add variety through different insight angles
    const insightAngles = [
      "Focus on the COMPETITIVE URGENCY - what happens if a competitor gets there first?",
      "Focus on the EXECUTIVE PRESSURE - what is the CEO/board demanding right now?",
      "Focus on the HIDDEN COST - what is the true cost of inaction they haven't calculated?",
      "Focus on the MARKET TIMING - why is this the perfect moment in their industry?",
      "Focus on the TRANSFORMATION CATALYST - how does this unlock their bigger vision?",
      "Focus on the RISK MITIGATION - what existential risk does this address?"
    ];
    const randomAngle = insightAngles[Math.floor(Math.random() * insightAngles.length)];

    const prompt = `You are a legendary enterprise sales strategist known for writing insights that win $10M+ deals. Your insights make executives stop scrolling and lean in.

CRITICAL: Write a PROVOCATIVE, SPECIFIC insight for this Big Bet. No generic platitudes. Make it feel like insider knowledge.

WRITING STYLE:
- Sound like a trusted advisor who knows something they don't
- Use specific numbers, timeframes, competitive references
- Create urgency without being salesy
- Reference their specific pain points by name
- Include a "what they'll lose" element
- Make it memorable - something they'd quote in their internal meetings

ANGLE TO TAKE: ${randomAngle}

BIG BET DETAILS:
• Title: ${bet.title}
• Subtitle: ${bet.subtitle || "Not specified"}
• Deal Status: ${bet.dealStatus || "Not specified"}  
• Target Close: ${bet.targetClose || "Not specified"}
• Investment: ${bet.netNewACV || "Not specified"}

ACCOUNT:
${accountData.basics?.accountName} (${accountData.basics?.industry})

${accountStrategyNarrative ? `OUR WINNING STRATEGY FOR THIS ACCOUNT:
${accountStrategyNarrative}` : ""}

WHAT THE C-SUITE IS PUSHING:
${accountData.strategy?.ceoBoardPriorities?.map((s: any) => `• ${s.title}: ${s.description || ""}`).join("\n") || "Not specified"}

THEIR STRATEGIC BETS:
${accountData.strategy?.corporateStrategy?.map((s: any) => `• ${s.title}`).join("\n") || "Not specified"}

PAIN POINTS TO EXPLOIT:
${accountData.painPoints?.painPoints?.map((p: any) => `• ${p.title}: ${p.description}`).join("\n") || "Not specified"}

OPPORTUNITIES WE'RE TARGETING:
${accountData.opportunities?.opportunities?.map((o: any) => `• ${o.title}`).join("\n") || "Not specified"}

Write exactly 2-3 sentences. No headers, no bullets, no formatting. Just the insight text that makes executives say "they really understand our business."`;

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
        max_tokens: 250,
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
    const insight = result.choices?.[0]?.message?.content?.trim() || "";

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
