import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Search web for company business model info
async function searchBusinessInfo(companyName: string, searchType: string): Promise<string> {
  const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
  if (!apiKey) {
    console.log("Firecrawl not configured, skipping web search");
    return "";
  }

  try {
    const queries: Record<string, string> = {
      competitors: `${companyName} competitors market share industry rivals 2024`,
      businessModel: `${companyName} business model revenue streams how makes money`,
      customers: `${companyName} customer segments target market clients`,
      channels: `${companyName} sales channels distribution go-to-market strategy`,
    };

    const query = queries[searchType] || `${companyName} business model`;
    console.log(`Searching: ${query}`);

    const response = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        limit: 5,
        scrapeOptions: { formats: ["markdown"] },
      }),
    });

    if (!response.ok) {
      console.error("Firecrawl search failed:", response.status);
      return "";
    }

    const data = await response.json();
    const results = data.data || [];
    return results.map((r: any) => r.markdown || r.description || "").join("\n\n").slice(0, 10000);
  } catch (error) {
    console.error("Error searching:", error);
    return "";
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyName, annualReportContent, existingData } = await req.json();

    if (!companyName) {
      return new Response(
        JSON.stringify({ error: "Company name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch supplementary web data in parallel
    console.log(`Researching business model for: ${companyName}`);
    const [competitorInfo, businessModelInfo, customerInfo, channelInfo] = await Promise.all([
      searchBusinessInfo(companyName, "competitors"),
      searchBusinessInfo(companyName, "businessModel"),
      searchBusinessInfo(companyName, "customers"),
      searchBusinessInfo(companyName, "channels"),
    ]);

    const webResearchContext = `
═══════════════════════════════════════════════════════════════
WEB RESEARCH INTELLIGENCE
═══════════════════════════════════════════════════════════════

COMPETITOR LANDSCAPE:
${competitorInfo || "No competitor data found"}

BUSINESS MODEL INSIGHTS:
${businessModelInfo || "No business model data found"}

CUSTOMER SEGMENTS:
${customerInfo || "No customer data found"}

CHANNELS & GO-TO-MARKET:
${channelInfo || "No channel data found"}
═══════════════════════════════════════════════════════════════`;

    const annualReportContext = annualReportContent 
      ? `\n\nANNUAL REPORT CONTENT:\n${annualReportContent.slice(0, 15000)}`
      : "";

    const existingContext = existingData
      ? `\n\nEXISTING DATA TO REFINE:\n${JSON.stringify(existingData, null, 2)}`
      : "";

    const systemPrompt = `You are a McKinsey-caliber business analyst creating a comprehensive Business Model Canvas for ${companyName}.

${webResearchContext}
${annualReportContext}
${existingContext}

Your task: Synthesize all available information to create a COMPLETE Business Model Canvas with the 9 standard building blocks PLUS a competitor analysis.

QUALITY STANDARDS:
- Each item should be specific and evidence-based, not generic
- Use concrete examples from the research (e.g., "MSC (Gemini network alliance)" not just "shipping partners")
- Include quantification where available (e.g., "30% of operating costs" not just "fuel costs")
- For competitors, include their relative positioning and market share if available
- Prioritize the most strategically important items (3-7 per category)

BUSINESS MODEL CANVAS FRAMEWORK:

1. KEY PARTNERS: Who helps deliver the value proposition?
   - Strategic alliances, suppliers, technology vendors, channel partners

2. KEY ACTIVITIES: What must the company do exceptionally well?
   - Core operations, platform development, customer service

3. KEY RESOURCES: What unique assets enable the business model?
   - Physical, intellectual, human, financial resources

4. VALUE PROPOSITION: What value is delivered to customers?
   - Pain relievers, gain creators, unique differentiators

5. CUSTOMER RELATIONSHIPS: How does the company interact with customers?
   - Self-service, dedicated support, communities, co-creation

6. CHANNELS: How does the company reach and deliver to customers?
   - Direct sales, digital platforms, partners, marketing

7. CUSTOMER SEGMENTS: Who are the target customers?
   - Industries, company sizes, geographies, use cases

8. COST STRUCTURE: What are the major cost drivers?
   - Fixed vs variable, economies of scale, cost priorities

9. REVENUE STREAMS: How does the company make money?
   - Product sales, subscriptions, services, licensing

10. COMPETITORS: Who competes for the same customers?
    - Direct competitors, indirect competitors, emerging threats`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Create a comprehensive Business Model Canvas for ${companyName}. Use all available research to make it specific and actionable for strategic account planning.` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_business_model_canvas",
              description: "Create a comprehensive Business Model Canvas from research",
              parameters: {
                type: "object",
                properties: {
                  keyPartners: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-7 key strategic partners and alliances"
                  },
                  keyActivities: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-7 core activities the company must excel at"
                  },
                  keyResources: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-7 unique assets and resources"
                  },
                  valueProposition: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-7 key value propositions for customers"
                  },
                  customerRelationships: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-7 types of customer relationships"
                  },
                  channels: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-7 channels to reach customers"
                  },
                  customerSegments: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-7 target customer segments"
                  },
                  costStructure: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-7 major cost drivers with percentages if available"
                  },
                  revenueStreams: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-7 revenue streams with relative importance"
                  },
                  competitors: {
                    type: "array",
                    items: { type: "string" },
                    description: "5-10 key competitors with brief positioning"
                  }
                },
                required: ["keyPartners", "keyActivities", "keyResources", "valueProposition", "customerRelationships", "channels", "customerSegments", "costStructure", "revenueStreams", "competitors"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_business_model_canvas" } }
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

    if (!toolCall || toolCall.function.name !== "create_business_model_canvas") {
      throw new Error("Unexpected AI response format");
    }

    const businessModelData = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: businessModelData,
        usedWebSearch: !!(competitorInfo || businessModelInfo || customerInfo || channelInfo)
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error researching business model:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to research business model" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
