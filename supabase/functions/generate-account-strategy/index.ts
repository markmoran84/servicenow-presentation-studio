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

    const existingStrategy = accountData.accountStrategy?.strategyNarrative;
    const existingBigBets = accountData.accountStrategy?.bigBets || [];

    const prompt = `You are a senior ServiceNow account strategist. Write a strategy narrative that's sharp, commercially precise, and outcome-obsessed.

YOUR VOICE:
- Punchy. Every sentence earns its place.
- Action verbs that drive urgency: "capture," "accelerate," "unlock," "dominate"
- Lead with outcomes and dollar impact, not activities
- Be specific: name products, quote metrics, call out timelines
- Sound like a McKinsey partner selling to the board, not a vendor pitch

THE NARRATIVE:
- 2-3 tight paragraphs (150-250 words max)
- Open with the commercial prize: what's the revenue opportunity?
- Connect customer pain directly to ServiceNow capability
- Name the wedge deal and expansion path
- Write in first-person plural ("We will...")

BANNED PHRASES:
- "drive transformation" / "digital transformation journey"
- "leverage synergies" / "strategic partnership"
- "holistic approach" / "best-in-class"
- "enable digital" / "unlock value"
- "comprehensive solution"

ACCOUNT CONTEXT:
- Account: ${accountData.basics?.accountName || "Unknown"}
- Industry: ${accountData.basics?.industry || "Unknown"}
- Current ACV: ${accountData.basics?.currentContractValue || "Unknown"}
- FY Target: ${accountData.basics?.nextFYAmbition || "Unknown"}
- 3-Year Ambition: ${accountData.basics?.threeYearAmbition || "Unknown"}

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

${existingBigBets.length > 0 ? `Big Bets (align to these):
${existingBigBets.map((b: any) => `- ${b.title}: ${b.subtitle || ""} (${b.dealStatus}, ${b.netNewACV})`).join("\n")}` : ""}

${existingStrategy ? `EXISTING STRATEGY (sharpen this, make it punchier):
${existingStrategy}` : ""}

Write only the strategy narrative. No headers, no formatting, no preamble.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable API error:", errorText);
      if (response.status === 402) {
        return new Response(JSON.stringify({ success: false, error: "Not enough AI credits. Please add credits to your Lovable workspace in Settings → Workspace → Usage." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 429) {
        return new Response(JSON.stringify({ success: false, error: "AI rate limit exceeded. Please wait a moment and try again." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const result = await response.json();
    const strategyNarrative = result.choices?.[0]?.message?.content?.trim() || "";

    return new Response(JSON.stringify({ success: true, strategyNarrative }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error generating account strategy:", error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
