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

    const prompt = `You are a strategic account planning expert for enterprise technology sales (ServiceNow). Generate a compelling strategic insight for a Big Bet / workstream.

The insight should:
- Be 2-3 sentences
- Explain the strategic rationale and business context
- Reference why this is important NOW for the customer
- Connect to customer pain points or strategic priorities where relevant

Big Bet Details:
- Title: ${bet.title || "Not specified"}
- Subtitle: ${bet.subtitle || "Not specified"}
- Deal Status: ${bet.dealStatus || "Not specified"}
- Target Close: ${bet.targetClose || "Not specified"}
- Net New ACV: ${bet.netNewACV || "Not specified"}

Account Context:
- Account Name: ${accountData.basics?.accountName || "Unknown"}
- Industry: ${accountData.basics?.industry || "Unknown"}

Customer Corporate Strategy:
${accountData.strategy?.corporateStrategy?.map((s: any) => `- ${s.title}`).join("\n") || "Not specified"}

Key Pain Points:
${accountData.painPoints?.painPoints?.map((p: any) => `- ${p.title}: ${p.description}`).join("\n") || "Not specified"}

Strategic Opportunities:
${accountData.opportunities?.opportunities?.map((o: any) => `- ${o.title}`).join("\n") || "Not specified"}

Write ONLY the insight text (2-3 sentences), no headers or formatting.`;

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
        max_tokens: 200,
        temperature: 0.7,
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
