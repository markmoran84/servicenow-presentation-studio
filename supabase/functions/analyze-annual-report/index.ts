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
    const { content } = await req.json();

    if (!content || content.trim().length < 100) {
      return new Response(
        JSON.stringify({ error: "Please provide sufficient annual report content (at least 100 characters)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert financial analyst specializing in extracting key information from annual reports and investor relations documents.

Your task is to analyze the provided annual report content and extract structured data for an executive summary slide.

Extract the following information and return it as a JSON object using the exact tool schema provided:
- revenue: The total revenue figure (e.g., "$55.5B" or "£3.2B")
- revenueComparison: Prior year comparison (e.g., "2023: $51.1B")
- ebitImprovement: EBIT or profit improvement percentage (e.g., "+65%" or "-12%")
- netZeroTarget: Sustainability/net zero target year if mentioned (e.g., "2040" or "N/A")
- keyMilestones: 3-5 key operational or business milestones achieved (short bullet points)
- strategicAchievements: 3-5 major strategic accomplishments (short bullet points)
- executiveSummaryNarrative: A 2-3 sentence executive summary describing the company's position and strategic direction

If specific data isn't available, make reasonable inferences or indicate "Not specified".`;

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
          { role: "user", content: `Please analyze this annual report content and extract the key highlights:\n\n${content}` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_annual_report_data",
              description: "Extract structured data from an annual report",
              parameters: {
                type: "object",
                properties: {
                  revenue: { type: "string", description: "Total revenue figure" },
                  revenueComparison: { type: "string", description: "Prior year revenue for comparison" },
                  ebitImprovement: { type: "string", description: "EBIT or profit improvement percentage" },
                  netZeroTarget: { type: "string", description: "Net zero or sustainability target year" },
                  keyMilestones: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 key operational milestones"
                  },
                  strategicAchievements: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 strategic achievements"
                  },
                  executiveSummaryNarrative: {
                    type: "string",
                    description: "2-3 sentence executive summary"
                  }
                },
                required: ["revenue", "revenueComparison", "ebitImprovement", "netZeroTarget", "keyMilestones", "strategicAchievements", "executiveSummaryNarrative"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "extract_annual_report_data" } }
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

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data, null, 2));

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "extract_annual_report_data") {
      throw new Error("Unexpected AI response format");
    }

    const extractedData = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ success: true, data: extractedData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error analyzing annual report:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to analyze report" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});