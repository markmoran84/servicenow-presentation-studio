import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Fetch supplementary financial data from the web
async function fetchFinancialData(companyName: string): Promise<string> {
  const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
  if (!apiKey) {
    console.log("Firecrawl not configured, skipping web search");
    return "";
  }

  try {
    console.log(`Searching for financial data: ${companyName}`);
    const response = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `${companyName} annual report 2024 revenue EBIT financial results`,
        limit: 3,
        scrapeOptions: { formats: ["markdown"] },
      }),
    });

    if (!response.ok) {
      console.error("Firecrawl search failed:", response.status);
      return "";
    }

    const data = await response.json();
    const results = data.data || [];
    const combinedContent = results
      .map((r: any) => r.markdown || r.description || "")
      .join("\n\n");

    console.log(`Found ${results.length} search results, content length: ${combinedContent.length}`);
    return combinedContent;
  } catch (error) {
    console.error("Error fetching financial data:", error);
    return "";
  }
}

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

    // First pass: Extract company name and check what data we have
    const initialPrompt = `You are an expert strategic account executive at ServiceNow analyzing a customer's annual report to build an account plan.

CRITICAL INSTRUCTIONS:
1. Read the ENTIRE document carefully before responding
2. Look for financial figures (revenue, profit, EBIT, margins) - they may be in tables, charts, or footnotes
3. Look for strategic priorities, CEO statements, and business highlights
4. For executiveSummaryNarrative: Write 2-3 compelling sentences that describe what the company does, their market position, and strategic direction. DO NOT just describe the document - summarize the COMPANY.
5. For SWOT: Infer from challenges mentioned (weaknesses/threats) and achievements mentioned (strengths/opportunities)
6. If you find mentions of "geopolitical", "supply chain", "competition", "costs" - these are threats
7. If you find mentions of "growth", "expansion", "innovation", "market leader" - these are strengths

PAIN POINTS - MUST BE STRATEGICALLY ALIGNED:
Extract 3-5 pain points that are DIRECTLY DERIVED from challenges, risks, or gaps mentioned in the annual report.
- These must connect to the customer's STATED priorities (not generic industry pain points)
- Look for: CEO concerns, risk factors, operational challenges, transformation blockers, cost pressures
- Frame each pain point as an obstacle to achieving their stated strategic goals

Each pain point needs:
- title: Short, punchy headline derived from their language (e.g., if they mention "digital fragmentation", use that)
- description: 1-2 sentences linking the pain to their strategic priority with quantification where available

Example GOOD pain point (strategically aligned):
{
  "title": "Digital Fragmentation Blocking AI-First Ambition",
  "description": "Multiple disconnected systems across regions prevent the unified data layer required for AI operationalisation - directly blocking CEO's stated AI-first strategy"
}

Example BAD pain point (generic, not from report):
{
  "title": "Need for Digital Transformation",
  "description": "Companies need to transform digitally to stay competitive"
}

STRATEGIC OPPORTUNITIES - ServiceNow Perspective:
Extract 3-5 opportunities that DIRECTLY ADDRESS the pain points and ENABLE their stated strategic priorities.
- Each opportunity should map to a stated customer goal from the annual report
- Frame as how ServiceNow can accelerate what they're already trying to achieve
- Use language like "Accelerate...", "Reduce...", "Transform...", "Enable..."

Each opportunity needs:
- title: Action-oriented headline (e.g., "Unified Service Excellence Platform", "AI-First Operations Enablement")
- description: Exec-ready value proposition showing how ServiceNow helps achieve THEIR goals (reference their language)

Example GOOD opportunity (tied to their strategy):
{
  "title": "Accelerate AI-First Operations",
  "description": "Enable the CEO's AI-first mandate through unified workflow orchestration, reducing AI time-to-production from 18 months to 6 months"
}

Example good narrative: "Maersk is the world's leading integrated logistics company, operating in 130+ countries and providing end-to-end supply chain solutions. With $55.5B in revenue and a commitment to Net Zero by 2040, the company is transforming through AI-first operations and customer experience excellence."

Example bad narrative: "This document contains links to Maersk's annual report sections." - DO NOT DO THIS.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: initialPrompt },
          { role: "user", content: `Analyze this annual report content thoroughly and extract all available data:\n\n${content}` }
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
                  accountName: { type: "string", description: "Company name" },
                  industry: { type: "string", description: "Industry/sector" },
                  revenue: { type: "string", description: "Total revenue figure with currency (e.g. $55.5B)" },
                  revenueComparison: { type: "string", description: "Prior year revenue" },
                  growthRate: { type: "string", description: "YoY growth rate" },
                  ebitImprovement: { type: "string", description: "EBIT improvement %" },
                  marginEBIT: { type: "string", description: "EBIT margin or absolute" },
                  costPressureAreas: { type: "string", description: "Cost pressures" },
                  strategicInvestmentAreas: { type: "string", description: "Investment areas" },
                  corporateStrategyPillars: { type: "array", items: { type: "string" }, description: "3-5 strategic pillars" },
                  ceoBoardPriorities: { type: "array", items: { type: "string" }, description: "CEO priorities" },
                  transformationThemes: { type: "array", items: { type: "string" }, description: "Transformation themes" },
                  aiDigitalAmbition: { type: "string", description: "AI/digital ambition" },
                  costDisciplineTargets: { type: "string", description: "Cost targets" },
                  // Pain points with title/description
                  painPoints: { 
                    type: "array", 
                    items: { 
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Short punchy headline" },
                        description: { type: "string", description: "1-2 sentences with business impact" }
                      },
                      required: ["title", "description"]
                    }, 
                    description: "3-5 pain points with title and description" 
                  },
                  // Opportunities with title/description
                  opportunities: { 
                    type: "array", 
                    items: { 
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Action-oriented headline" },
                        description: { type: "string", description: "Exec-ready value proposition from ServiceNow perspective" }
                      },
                      required: ["title", "description"]
                    }, 
                    description: "3-5 opportunities with title and description" 
                  },
                  strengths: { type: "array", items: { type: "string" }, description: "3-5 internal strengths" },
                  weaknesses: { type: "array", items: { type: "string" }, description: "3-5 internal weaknesses" },
                  swotOpportunities: { type: "array", items: { type: "string" }, description: "3-5 external opportunities" },
                  threats: { type: "array", items: { type: "string" }, description: "3-5 external threats" },
                  netZeroTarget: { type: "string", description: "Net zero year" },
                  keyMilestones: { type: "array", items: { type: "string" }, description: "3-5 milestones" },
                  strategicAchievements: { type: "array", items: { type: "string" }, description: "3-5 achievements" },
                  executiveSummaryNarrative: { type: "string", description: "2-3 sentence company summary - describe what they DO and their strategy, not the document" }
                },
                required: ["accountName", "executiveSummaryNarrative"],
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
    console.log("Initial AI response received");

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "extract_annual_report_data") {
      throw new Error("Unexpected AI response format");
    }

    let extractedData = JSON.parse(toolCall.function.arguments);
    const companyName = extractedData.accountName || "";

    // Track data sources
    const dataSources: Record<string, "document" | "web"> = {};
    const documentFields = Object.keys(extractedData).filter(k => {
      const val = extractedData[k];
      return val && val !== "N/A" && val !== "Not specified" && 
        (typeof val === "string" ? val.length > 0 : Array.isArray(val) && val.length > 0);
    });
    documentFields.forEach(f => dataSources[f] = "document");

    // Check if we need to fetch supplementary data
    const needsFinancialData = 
      !extractedData.revenue || 
      extractedData.revenue === "N/A" || 
      extractedData.revenue === "Not specified" ||
      !extractedData.ebitImprovement ||
      extractedData.ebitImprovement === "N/A";

    let usedWebSearch = false;

    if (needsFinancialData && companyName) {
      console.log("Financial data missing, fetching from web...");
      const supplementaryContent = await fetchFinancialData(companyName);

      if (supplementaryContent) {
        usedWebSearch = true;
        // Second pass with supplementary data
        const enrichPrompt = `You previously extracted data but some financial fields were missing. Here is additional data from web search. 
Merge this with what you know and provide updated values. Keep existing values if the new data doesn't have better information.

Original extraction: ${JSON.stringify(extractedData)}

Additional web search results:
${supplementaryContent}

IMPORTANT: 
- Update revenue, EBIT, growth figures if you find them
- Improve the executiveSummaryNarrative to be more compelling
- Add any strategic pillars, achievements, or SWOT items you find
- For opportunities, maintain the ServiceNow exec-ready framing`;

        const enrichResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: "You are enriching company data with additional financial information. Merge and improve the data. For opportunities, keep the ServiceNow exec-ready framing." },
              { role: "user", content: enrichPrompt }
            ],
            tools: [
              {
                type: "function",
                function: {
                  name: "extract_annual_report_data",
                  description: "Extract enriched data",
                  parameters: {
                    type: "object",
                    properties: {
                      accountName: { type: "string" },
                      industry: { type: "string" },
                      revenue: { type: "string" },
                      revenueComparison: { type: "string" },
                      growthRate: { type: "string" },
                      ebitImprovement: { type: "string" },
                      marginEBIT: { type: "string" },
                      costPressureAreas: { type: "string" },
                      strategicInvestmentAreas: { type: "string" },
                      corporateStrategyPillars: { type: "array", items: { type: "string" } },
                      ceoBoardPriorities: { type: "array", items: { type: "string" } },
                      transformationThemes: { type: "array", items: { type: "string" } },
                      aiDigitalAmbition: { type: "string" },
                      costDisciplineTargets: { type: "string" },
                      painPoints: { 
                        type: "array", 
                        items: { 
                          type: "object",
                          properties: {
                            title: { type: "string" },
                            description: { type: "string" }
                          }
                        }
                      },
                      opportunities: { 
                        type: "array", 
                        items: { 
                          type: "object",
                          properties: {
                            title: { type: "string" },
                            description: { type: "string" }
                          }
                        }
                      },
                      strengths: { type: "array", items: { type: "string" } },
                      weaknesses: { type: "array", items: { type: "string" } },
                      swotOpportunities: { type: "array", items: { type: "string" } },
                      threats: { type: "array", items: { type: "string" } },
                      netZeroTarget: { type: "string" },
                      keyMilestones: { type: "array", items: { type: "string" } },
                      strategicAchievements: { type: "array", items: { type: "string" } },
                      executiveSummaryNarrative: { type: "string" }
                    },
                    additionalProperties: false
                  }
                }
              }
            ],
            tool_choice: { type: "function", function: { name: "extract_annual_report_data" } }
          }),
        });

        if (enrichResponse.ok) {
          const enrichData = await enrichResponse.json();
          const enrichToolCall = enrichData.choices?.[0]?.message?.tool_calls?.[0];
          if (enrichToolCall) {
            const enrichedExtraction = JSON.parse(enrichToolCall.function.arguments);
            // Merge enriched data (prefer non-empty values)
            for (const key of Object.keys(enrichedExtraction)) {
              const newValue = enrichedExtraction[key];
              const oldValue = extractedData[key];
              if (newValue && newValue !== "N/A" && newValue !== "Not specified") {
                if (Array.isArray(newValue) && newValue.length > 0) {
                  if (!oldValue || oldValue.length === 0) {
                    extractedData[key] = newValue;
                    dataSources[key] = "web";
                  }
                } else if (!Array.isArray(newValue) && newValue) {
                  if (!oldValue || oldValue === "N/A" || oldValue === "Not specified") {
                    extractedData[key] = newValue;
                    dataSources[key] = "web";
                  }
                }
              }
            }
            console.log("Data enriched with web search results");
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: extractedData,
        dataSources,
        usedWebSearch 
      }),
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
