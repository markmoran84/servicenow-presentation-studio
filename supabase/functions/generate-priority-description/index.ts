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

═══════════════════════════════════════════════════════════════
CRITICAL: USE THIS ACCOUNT CONTEXT TO INFORM YOUR RESPONSE
═══════════════════════════════════════════════════════════════

ACCOUNT: ${accountData.basics?.accountName || "Enterprise Customer"}
INDUSTRY: ${accountData.basics?.industry || "Unknown"}
CURRENT ACV: ${accountData.basics?.currentContractValue || "Unknown"}
FY AMBITION: ${accountData.basics?.nextFYAmbition || "Unknown"}

CUSTOMER'S STATED CORPORATE STRATEGIES (use their language):
${accountData.strategy?.corporateStrategy?.map((s: any) => `• ${s.title}: ${s.description}`).join("\n") || "Not specified"}

CUSTOMER'S DIGITAL/AI STRATEGIES:
${accountData.strategy?.digitalStrategies?.map((s: any) => `• ${s.title}: ${s.description}`).join("\n") || "Not specified"}

CEO/BOARD PRIORITIES:
${accountData.strategy?.ceoBoardPriorities?.map((s: any) => `• ${s.title}: ${s.description}`).join("\n") || "Not specified"}

CUSTOMER'S PAIN POINTS:
${accountData.painPoints?.painPoints?.map((p: any) => `• ${p.title}: ${p.description}`).join("\n") || "Not specified"}

ANNUAL REPORT INTELLIGENCE (key insights to reference):
${accountData.annualReport?.executiveSummaryNarrative || "Not available"}

${accountData.annualReport?.strategicPillars ? `STRATEGIC PILLARS FROM ANNUAL REPORT:
${accountData.annualReport.strategicPillars.map((p: any) => `• ${p.title}: ${p.description}`).join("\n")}` : ""}

═══════════════════════════════════════════════════════════════
OUTPUT REQUIREMENTS
═══════════════════════════════════════════════════════════════

FORMAT: Single sentence, 25-40 words. No bullet points. No headers.

STRUCTURE PATTERN: [Action verb] + [specific approach derived from account context] + [to achieve] + [outcomes aligned to customer's stated priorities]

STRONG ACTION VERBS: Building, Delivering, Operationalising, Expanding, Evolving, Accelerating, Orchestrating, Transforming, Enabling, Maturing

CRITICAL REQUIREMENTS:
• MUST reference the customer's actual stated strategies, priorities, or annual report themes - use THEIR terminology
• MUST connect to specific, measurable outcomes relevant to THIS customer's industry and goals
• MUST show clear "from → to" transformation or scope expansion
• Reference FY timing, prior work, or customer's transformation journey where context allows

MUST AVOID:
• Generic phrases not grounded in the account context
• Vague outcomes without specificity to this customer
• ServiceNow product names unless essential
• Any content that could apply to any company - be SPECIFIC to ${accountData.basics?.accountName || "this customer"}

The description must sound like it was written by someone who deeply understands ${accountData.basics?.accountName || "this customer"}'s business, read their annual report, and knows their strategic priorities.

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
