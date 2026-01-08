import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accountContext } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const companyName = accountContext?.basics?.accountName || "the customer";
    
    // Build comprehensive context for vision generation
    const contextSummary = `
COMPANY: ${companyName}
INDUSTRY: ${accountContext?.basics?.industry || "Unknown"}
TIER: ${accountContext?.basics?.tier || "Unknown"}

CURRENT SERVICENOW FOOTPRINT:
- Current ACV: ${accountContext?.basics?.currentContractValue || "Unknown"}
- Next FY Ambition: ${accountContext?.basics?.nextFYAmbition || "Unknown"}
- 3-Year Ambition: ${accountContext?.basics?.threeYearAmbition || "Unknown"}
- Renewal: ${accountContext?.basics?.renewalDates || "Unknown"}

CUSTOMER STRATEGIC PRIORITIES:
${accountContext?.strategy?.corporateStrategyPillars?.map((p: string) => `• ${p}`).join("\n") || "Not specified"}

CEO/BOARD PRIORITIES:
${accountContext?.strategy?.ceoBoardPriorities?.map((p: string) => `• ${p}`).join("\n") || "Not specified"}

TRANSFORMATION THEMES:
${accountContext?.strategy?.transformationThemes?.map((t: string) => `• ${t}`).join("\n") || "Not specified"}

AI/DIGITAL AMBITION: ${accountContext?.strategy?.aiDigitalAmbition || "Not specified"}

KEY PAIN POINTS:
${accountContext?.painPoints?.painPoints?.map((p: { title: string; description: string }) => `• ${p.title}: ${p.description}`).join("\n") || "Not specified"}

STRATEGIC OPPORTUNITIES:
${accountContext?.opportunities?.opportunities?.map((o: { title: string; description: string }) => `• ${o.title}: ${o.description}`).join("\n") || "Not specified"}

FINANCIAL CONTEXT:
- Revenue: ${accountContext?.financial?.customerRevenue || "Unknown"}
- Growth: ${accountContext?.financial?.growthRate || "Unknown"}
- EBIT: ${accountContext?.financial?.marginEBIT || "Unknown"}

EXECUTIVE NARRATIVE:
${accountContext?.annualReport?.executiveSummaryNarrative || "Not available"}
`;

    const systemPrompt = `You are a strategic advisor crafting a vision statement for a ServiceNow account plan.

TASK: Write ONE single sentence that defines ServiceNow's strategic role for ${companyName}.

TONE: Strategic, precise, confident. No hype. No generic transformation language. Use the customer's own strategic terminology.

FORMAT: Start with "To..." and complete in one clear, purposeful sentence.

EXCELLENT EXAMPLES:
• "To build the digital backbone that powers Maersk's Integrator Strategy to deliver seamless, integrated logistics across a connected global network."
• "To become the enterprise automation layer that enables HSBC's cost transformation while accelerating customer-facing innovation."
• "To serve as the AI orchestration platform that unifies Shell's operational technology and IT landscapes into a single intelligent enterprise."

POOR EXAMPLES (NEVER DO THIS):
• "To help the customer with digital transformation." (too generic)
• "To partner with the customer to drive value." (meaningless)
• "ServiceNow will be instrumental in..." (weak, passive)

Generate ONE sentence. Be specific to their strategy. No fluff.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Based on this account context, generate a compelling vision statement for "ServiceNow at ${companyName}":\n\n${contextSummary}` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_vision_statement",
              description: "Generate a strategic vision statement",
              parameters: {
                type: "object",
                properties: {
                  visionStatement: { 
                    type: "string", 
                    description: "2-3 sentence aspirational vision statement for the ServiceNow partnership" 
                  }
                },
                required: ["visionStatement"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_vision_statement" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const responseData = await response.json();
    const toolCall = responseData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall || toolCall.function.name !== "generate_vision_statement") {
      throw new Error("Unexpected AI response format");
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ 
        success: true, 
        visionStatement: result.visionStatement
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating vision:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to generate vision" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
