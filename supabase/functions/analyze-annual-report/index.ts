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

const systemPrompt = `You are an expert financial analyst specializing in extracting comprehensive information from annual reports and investor relations documents.

Your task is to analyze the provided annual report content and extract structured data to populate an account planning tool. Extract as much relevant information as possible.

Extract the following information and return it using the exact tool schema provided:

BASICS:
- accountName: The company name
- industry: The industry/sector they operate in

FINANCIAL:
- revenue: The total revenue figure (e.g., "$55.5B" or "£3.2B")
- revenueComparison: Prior year comparison (e.g., "2023: $51.1B")
- growthRate: Year-over-year growth rate (e.g., "+9% YoY")
- ebitImprovement: EBIT or profit improvement percentage (e.g., "+65%" or "-12%")
- marginEBIT: EBIT margin or absolute figure if available
- costPressureAreas: Key cost pressure areas mentioned
- strategicInvestmentAreas: Where the company is investing

STRATEGY:
- corporateStrategyPillars: 3-5 key strategic pillars or focus areas
- ceoBoardPriorities: CEO/Board stated priorities
- transformationThemes: Digital or business transformation themes
- aiDigitalAmbition: AI or digital ambition statements
- costDisciplineTargets: Cost reduction or efficiency targets mentioned

PAIN POINTS (infer from challenges, risks, or areas of focus mentioned):
- customerExperienceChallenges: Customer-related challenges
- technologyFragmentation: Technology or system challenges
- timeToValueIssues: Speed or efficiency issues mentioned

OPPORTUNITIES (infer from initiatives, investments, or stated goals):
- aiOpportunities: AI-related opportunities or initiatives
- automationOpportunities: Automation initiatives
- standardisationOpportunities: Consolidation or standardization efforts

SWOT ANALYSIS (critical - extract from the report content):
- strengths: Internal positive attributes and competitive advantages (3-5 items)
- weaknesses: Internal limitations, challenges, or areas needing improvement (3-5 items)
- swotOpportunities: External favorable factors or market opportunities (3-5 items)
- threats: External risks, competitive pressures, or market challenges (3-5 items)

ANNUAL REPORT:
- netZeroTarget: Sustainability/net zero target year if mentioned (e.g., "2040" or "N/A")
- keyMilestones: 3-5 key operational or business milestones achieved (short bullet points)
- strategicAchievements: 3-5 major strategic accomplishments (short bullet points)
- executiveSummaryNarrative: A 2-3 sentence executive summary describing the company's position and strategic direction

If specific data isn't available, provide empty arrays or "Not specified" as appropriate.`;

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
              description: "Extract comprehensive structured data from an annual report",
              parameters: {
                type: "object",
                properties: {
                  // Basics
                  accountName: { type: "string", description: "Company name" },
                  industry: { type: "string", description: "Industry/sector" },
                  // Financial
                  revenue: { type: "string", description: "Total revenue figure" },
                  revenueComparison: { type: "string", description: "Prior year revenue for comparison" },
                  growthRate: { type: "string", description: "YoY growth rate" },
                  ebitImprovement: { type: "string", description: "EBIT or profit improvement percentage" },
                  marginEBIT: { type: "string", description: "EBIT margin or absolute figure" },
                  costPressureAreas: { type: "string", description: "Cost pressure areas" },
                  strategicInvestmentAreas: { type: "string", description: "Strategic investment areas" },
                  // Strategy
                  corporateStrategyPillars: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 strategic pillars"
                  },
                  ceoBoardPriorities: {
                    type: "array",
                    items: { type: "string" },
                    description: "CEO/Board priorities"
                  },
                  transformationThemes: {
                    type: "array",
                    items: { type: "string" },
                    description: "Transformation themes"
                  },
                  aiDigitalAmbition: { type: "string", description: "AI/digital ambition statement" },
                  costDisciplineTargets: { type: "string", description: "Cost discipline targets" },
                  // Pain Points
                  customerExperienceChallenges: {
                    type: "array",
                    items: { type: "string" },
                    description: "Customer experience challenges"
                  },
                  technologyFragmentation: {
                    type: "array",
                    items: { type: "string" },
                    description: "Technology challenges"
                  },
                  timeToValueIssues: {
                    type: "array",
                    items: { type: "string" },
                    description: "Speed/efficiency issues"
                  },
                  // Opportunities
                  aiOpportunities: {
                    type: "array",
                    items: { type: "string" },
                    description: "AI opportunities"
                  },
                  automationOpportunities: {
                    type: "array",
                    items: { type: "string" },
                    description: "Automation opportunities"
                  },
                  standardisationOpportunities: {
                    type: "array",
                    items: { type: "string" },
                    description: "Standardisation opportunities"
                  },
                  // SWOT Analysis
                  strengths: {
                    type: "array",
                    items: { type: "string" },
                    description: "Internal strengths and competitive advantages"
                  },
                  weaknesses: {
                    type: "array",
                    items: { type: "string" },
                    description: "Internal weaknesses and limitations"
                  },
                  swotOpportunities: {
                    type: "array",
                    items: { type: "string" },
                    description: "External opportunities"
                  },
                  threats: {
                    type: "array",
                    items: { type: "string" },
                    description: "External threats and risks"
                  },
                  // Annual Report
                  netZeroTarget: { type: "string", description: "Net zero target year" },
                  keyMilestones: {
                    type: "array",
                    items: { type: "string" },
                    description: "Key milestones"
                  },
                  strategicAchievements: {
                    type: "array",
                    items: { type: "string" },
                    description: "Strategic achievements"
                  },
                  executiveSummaryNarrative: {
                    type: "string",
                    description: "Executive summary narrative"
                  }
                },
                required: ["accountName", "revenue", "executiveSummaryNarrative"],
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