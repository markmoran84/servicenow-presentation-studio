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

    const systemPrompt = `You are an elite McKinsey-caliber strategic advisor crafting a vision statement that will anchor a $50M+ ServiceNow engagement for ${companyName}.

VISION STATEMENT EXCELLENCE:
The vision statement must be memorable enough that the CIO quotes it in their next board meeting. It defines ServiceNow's strategic role and creates executive conviction.

CRAFT CRITERIA:
1. SINGLE SENTENCE: Start with "To..." and complete in ONE powerful statement (max 25 words)
2. USE THEIR LANGUAGE: Reference the customer's stated strategic priorities and terminology
3. OUTCOME FOCUSED: Describe the end state, not activities
4. DIFFERENTIATED: No generic transformation language. Be specific to their context.
5. MEMORABLE: Would a CEO remember and repeat this?

PROVEN VISION PATTERNS (select and adapt the most relevant):

PLATFORM FOR INNOVATION:
• "To be ${companyName}'s platform for enterprise innovation, unlocking strategic value as the foundation for AI-powered operations."

CUSTOMER EXPERIENCE ORCHESTRATION:
• "To enable seamless, end-to-end customer journeys that differentiate ${companyName} in every interaction."
• "To power consistent, predictable customer outcomes that drive loyalty and lifetime value at enterprise scale."

AI OPERATIONS PLATFORM:
• "To operationalise AI at enterprise scale by embedding intelligence directly into ${companyName}'s critical workflows."
• "To serve as the execution layer that transforms AI ambition into measurable business outcomes across every function."

ENTERPRISE BACKBONE:
• "To serve as the digital backbone orchestrating ${companyName}'s enterprise execution across people, processes, and systems."
• "To unify fragmented operations into one governed, scalable execution platform that enables ${companyName}'s strategic vision."

OPERATIONAL EXCELLENCE:
• "To enable operational excellence by automating complexity and surfacing intelligence where decisions are made."
• "To provide the control plane that aligns teams, workflows, and decisions across ${companyName}'s global operations."

AVOID AT ALL COSTS:
• "To help the customer with digital transformation." (too generic)
• "To partner with the customer to drive value." (meaningless platitude)
• "ServiceNow will be instrumental in..." (weak, passive voice)
• Any sentence with "and" that lists multiple disconnected ideas
• Vague terms like "leverage", "synergies", "best-in-class" without specifics

Generate ONE sentence tailored to ${companyName}'s specific strategic context. Be precise. Be bold. Be memorable.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5.2",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Based on this comprehensive account context, generate a compelling, memorable vision statement for "ServiceNow at ${companyName}" that would resonate with their C-suite:\n\n${contextSummary}` }
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
