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
    const { accountData, priorityTitle } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const prompt = `You are an elite McKinsey-caliber strategic account planner for ServiceNow enterprise sales. Generate a single, powerful description for this account strategy.

STRATEGY TITLE: "${priorityTitle}"

ACCOUNT CONTEXT:
- Account: ${accountData.basics?.accountName || "Enterprise Customer"}
- Industry: ${accountData.basics?.industry || "Unknown"}
- Current ACV: ${accountData.basics?.currentContractValue || "Unknown"}
- FY Ambition: ${accountData.basics?.nextFYAmbition || "Unknown"}

CUSTOMER PRIORITIES:
${accountData.strategy?.corporateStrategy?.map((s: any) => `• ${s.title}: ${s.description}`).join("\n") || "Not specified"}

CUSTOMER PAIN POINTS:
${accountData.painPoints?.painPoints?.map((p: any) => `• ${p.title}: ${p.description}`).join("\n") || "Not specified"}

ANNUAL REPORT INTELLIGENCE:
${accountData.annualReport?.executiveSummaryNarrative || "Not available"}

═══════════════════════════════════════════════════════════════
EXEMPLARY DESCRIPTIONS (match this caliber exactly):
═══════════════════════════════════════════════════════════════

1. "Building on the FY25 commercial evaluation to deliver a scalable, orchestrated customer service and commercial execution foundation that reduces cost-to-serve and enables growth."

2. "Operationalising AI beyond isolated use cases to improve execution speed, decision quality, and productivity across customer, commercial, and operational workflows."

3. "FY26 focuses on broadening platform adoption beyond IT, using customer and service workflows as the entry point to enable enterprise-wide workflow orchestration aligned to ${accountData.basics?.accountName || "the customer"}'s integrator strategy."

4. "Evolving the relationship from execution recovery toward long-term strategic partner underpinning ${accountData.basics?.accountName || "the customer"}'s digital, AI, and operating model ambitions."

═══════════════════════════════════════════════════════════════
MANDATORY REQUIREMENTS:
═══════════════════════════════════════════════════════════════

FORMAT: Single sentence, 25-40 words. No bullet points. No headers.

STRUCTURE: [Action verb] + [specific approach/mechanism] + [to achieve] + [quantified/specific outcomes] + [aligned to customer context]

ACTION VERBS TO USE: Building, Delivering, Operationalising, Expanding, Evolving, Accelerating, Orchestrating, Transforming, Enabling, Maturing

MUST INCLUDE:
• Reference to customer's actual priorities, language, or stated strategy
• Specific, measurable outcomes (cost reduction, speed improvement, growth enablement)
• Clear "from → to" transformation or scope expansion
• Connection to FY timing or prior work where relevant

MUST AVOID:
• Generic phrases ("drive digital transformation", "leverage technology")
• Vague outcomes ("improve efficiency", "enhance capabilities")  
• ServiceNow product names unless contextually essential
• Fluffy adjectives without substance

Return ONLY the description. No quotes. No explanation. One sentence.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-5.2",
        messages: [
          { role: "user", content: prompt }
        ],
        max_completion_tokens: 300,
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
    const description = result.choices?.[0]?.message?.content?.trim() || "";

    return new Response(
      JSON.stringify({ 
        success: true, 
        description 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating description:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
