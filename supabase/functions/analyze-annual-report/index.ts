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
    const { content, accountContext } = await req.json();

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

    // Build context from account data if provided
    let accountContextStr = "";
    if (accountContext) {
      const { basics, history, financial, engagement } = accountContext;
      accountContextStr = `
═══════════════════════════════════════════════════════════════
ACCOUNT INTELLIGENCE (Pre-populated by Account Executive)
═══════════════════════════════════════════════════════════════
ACCOUNT PROFILE:
• Customer: ${basics?.accountName || "Unknown"} 
• Industry: ${basics?.industry || "Unknown"} | Region: ${basics?.region || "Unknown"}
• Strategic Tier: ${basics?.tier || "Unknown"} | Employees: ${basics?.numberOfEmployees || "Unknown"}

COMMERCIAL POSITION:
• Current ACV: ${basics?.currentContractValue || "Unknown"}
• Next FY Target: ${basics?.nextFYAmbition || "Unknown"} | 3-Year Target: ${basics?.threeYearAmbition || "Unknown"}
• Renewal Window: ${basics?.renewalDates || "Unknown"}
• Incumbent Competitors: ${basics?.keyIncumbents || "Unknown"}

RELATIONSHIP HISTORY:
• Last Account Plan: ${history?.lastPlanDate || "Unknown"} by ${history?.plannerName || "Unknown"} (${history?.plannerRole || ""})
• Previous Failures: ${history?.whatDidNotWork || "Not specified"}
• Prior Transformation Attempts: ${history?.priorTransformationAttempts || "Not specified"}
• Current ServiceNow Perception: ${history?.currentPerception || "Unknown"}

EXECUTIVE ACCESS:
• Known Sponsors: ${engagement?.knownExecutiveSponsors?.join(", ") || "Unknown"}
• Decision Deadlines: ${engagement?.decisionDeadlines || "Unknown"}
• RFP/Renewal Timing: ${engagement?.renewalRFPTiming || "Unknown"}
═══════════════════════════════════════════════════════════════
`;
    }

    // Premium strategic analysis prompt
    const initialPrompt = `You are a McKinsey-caliber strategic advisor embedded in ServiceNow's most elite account team. You analyze Fortune 500 annual reports to craft board-ready account strategies that win transformational deals.

${accountContextStr}

═══════════════════════════════════════════════════════════════
ANALYSIS FRAMEWORK: STRATEGIC EXCELLENCE
═══════════════════════════════════════════════════════════════

PHASE 1: DEEP DOCUMENT ANALYSIS
Read the ENTIRE document with the precision of a financial analyst and the strategic lens of a management consultant:
• Extract exact financial figures - revenue, margins, EBIT, growth rates (check tables, footnotes, charts)
• Identify the CEO's voice - their exact language, priorities, and transformation vision
• Map the strategic narrative - what story is leadership telling investors?
• Detect tension points - where does ambition exceed current capability?

PHASE 2: EXECUTIVE SUMMARY NARRATIVE
Write a 2-3 sentence executive brief that a C-suite sponsor could use verbatim in a board presentation:
• Lead with market position and scale (revenue, geography, employee count)
• Articulate strategic direction using THEIR language
• Connect to transformation imperatives that ServiceNow can address
• NEVER describe the document - describe the COMPANY and its trajectory

EXCELLENT EXAMPLE:
"A.P. Møller-Maersk is the world's leading integrated logistics company, operating across 130+ countries with $55.5B in revenue and 100,000+ employees. Under CEO Vincent Clerc's 'Gemini Strategy,' Maersk is pivoting from container shipping to end-to-end supply chain orchestration, targeting 8% EBIT margins through operational AI and customer experience transformation."

POOR EXAMPLE (NEVER DO THIS):
"This annual report discusses Maersk's financial performance and strategic initiatives."

PHASE 3: STRATEGIC PAIN POINTS (The "Why Act Now" Story)
Extract 3-5 pain points that create URGENCY for executive action:
• Derive DIRECTLY from stated challenges, risks, or gaps in the annual report
• Use the customer's OWN LANGUAGE (if they say "fragmented systems," use that exact phrase)
• Connect each pain to a strategic priority they've publicly committed to
• Quantify impact where possible (e.g., "$2.3B cost overrun," "18-month delay in AI deployment")
• Frame as obstacles to achieving stated board-level goals

PAIN POINT FORMAT:
{
  "title": "Punchy 5-7 word headline using their terminology",
  "description": "1-2 sentences: [Specific pain] is blocking [their stated priority], resulting in [quantified impact or strategic risk]"
}

EXCELLENT PAIN POINT:
{
  "title": "Fragmented Tech Stack Blocking AI-First Vision",
  "description": "130+ disconnected systems across regions prevent the unified data layer CEO cited as prerequisite for AI operationalisation—directly threatening the 2026 'AI-first operations' commitment made to investors."
}

PHASE 4: STRATEGIC OPPORTUNITIES (The "How ServiceNow Wins" Story)
Extract 3-5 opportunities that position ServiceNow as the strategic enabler:
• Each opportunity MUST address a specific pain point
• Each opportunity MUST accelerate a stated customer priority
• Frame as business outcomes, not product features
• Use action verbs: Accelerate, Consolidate, Transform, Enable, Reduce, Eliminate
• Include proof points or benchmarks where credible

OPPORTUNITY FORMAT:
{
  "title": "Action-Oriented 5-8 word headline",
  "description": "1-2 sentences: ServiceNow enables [their goal] by [specific capability], delivering [quantified outcome based on comparable deployments]"
}

EXCELLENT OPPORTUNITY:
{
  "title": "Unified AI Platform for Global Operations",
  "description": "Consolidate 130+ regional systems onto ServiceNow's AI-native platform, enabling the CEO's 'single source of truth' vision and reducing AI deployment cycles from 18 months to 6 months—as achieved at comparable logistics enterprises."
}

PHASE 5: SWOT ANALYSIS (Four-Dimensional Strategic Assessment)
Generate SWOT items that synthesize annual report insights WITH account context across FOUR PERSPECTIVES:

A) ORGANIZATIONAL (Customer's Internal Capabilities)
   STRENGTHS: Operational excellence, market position, talent, culture, scale advantages
   WEAKNESSES: Legacy systems, skill gaps, silos, execution challenges, tech debt

B) ACCOUNT RELATIONSHIP (ServiceNow's Position)
   STRENGTHS: Existing deployments, exec relationships, proven value, expansion momentum
   WEAKNESSES: Limited footprint, past failures, competitive threats, perception gaps

C) COMMERCIAL (Financial & Business Dynamics)
   OPPORTUNITIES: Renewal timing, budget cycles, M&A activity, transformation funding
   THREATS: Cost-cutting mandates, procurement pressure, economic headwinds, competitive pricing

D) SERVICENOW PLATFORM (Technology & Market Position)
   OPPORTUNITIES: White space products, AI/workflow differentiation, consolidation plays, partner ecosystem
   THREATS: Incumbent entrenchment, build-vs-buy decisions, point solution alternatives, platform fatigue

SWOT QUALITY STANDARDS:
• Each item should be specific, actionable, and defensible with evidence
• Reference annual report data AND account context where relevant
• Prioritize insights that inform deal strategy and executive engagement
• Avoid generic statements that could apply to any company

═══════════════════════════════════════════════════════════════`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: initialPrompt },
          { role: "user", content: `Conduct a comprehensive strategic analysis of this annual report. Extract all financial data, strategic priorities, pain points, opportunities, and SWOT insights. Produce board-ready outputs:\n\n${content}` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_annual_report_data",
              description: "Extract comprehensive structured data from an annual report for strategic account planning",
              parameters: {
                type: "object",
                properties: {
                  accountName: { type: "string", description: "Full company name as it appears officially" },
                  industry: { type: "string", description: "Primary industry/sector with specificity (e.g., 'Integrated Logistics & Container Shipping' not just 'Transportation')" },
                  revenue: { type: "string", description: "Total revenue with currency and period (e.g., '$55.5B FY2024')" },
                  revenueComparison: { type: "string", description: "Prior year revenue for comparison" },
                  growthRate: { type: "string", description: "YoY growth rate with context (e.g., '+12% YoY' or '-8% due to market normalization')" },
                  ebitImprovement: { type: "string", description: "EBIT improvement or margin change" },
                  marginEBIT: { type: "string", description: "EBIT margin percentage or absolute figure" },
                  costPressureAreas: { type: "string", description: "Key cost pressure areas mentioned by leadership" },
                  strategicInvestmentAreas: { type: "string", description: "Where the company is investing for growth" },
                  corporateStrategyPillars: { type: "array", items: { type: "string" }, description: "3-5 core strategic pillars using their exact terminology" },
                  ceoBoardPriorities: { type: "array", items: { type: "string" }, description: "CEO's stated priorities from letters/presentations" },
                  transformationThemes: { type: "array", items: { type: "string" }, description: "Digital/operational transformation themes" },
                  aiDigitalAmbition: { type: "string", description: "Stated AI and digital transformation ambition with timeline" },
                  costDisciplineTargets: { type: "string", description: "Specific cost reduction or efficiency targets" },
                  painPoints: { 
                    type: "array", 
                    items: { 
                      type: "object",
                      properties: {
                        title: { type: "string", description: "5-7 word punchy headline using customer's language" },
                        description: { type: "string", description: "1-2 sentences linking pain to strategic priority with quantification" }
                      },
                      required: ["title", "description"]
                    }, 
                    description: "3-5 strategically-aligned pain points derived from the document" 
                  },
                  opportunities: { 
                    type: "array", 
                    items: { 
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Action-oriented 5-8 word headline" },
                        description: { type: "string", description: "Exec-ready value proposition with quantified outcomes" }
                      },
                      required: ["title", "description"]
                    }, 
                    description: "3-5 ServiceNow opportunities that address pain points" 
                  },
                  strengths: { type: "array", items: { type: "string" }, description: "4-6 strengths combining organizational and account relationship factors" },
                  weaknesses: { type: "array", items: { type: "string" }, description: "4-6 weaknesses combining organizational gaps and ServiceNow position challenges" },
                  swotOpportunities: { type: "array", items: { type: "string" }, description: "4-6 opportunities combining commercial timing and platform white space" },
                  threats: { type: "array", items: { type: "string" }, description: "4-6 threats combining market risks and competitive dynamics" },
                  netZeroTarget: { type: "string", description: "Sustainability/Net Zero commitment with year" },
                  keyMilestones: { type: "array", items: { type: "string" }, description: "3-5 key milestones or achievements from the year" },
                  strategicAchievements: { type: "array", items: { type: "string" }, description: "3-5 strategic achievements that demonstrate execution capability" },
                  executiveSummaryNarrative: { type: "string", description: "2-3 sentence board-ready company summary describing market position, scale, and strategic direction" }
                },
                required: ["accountName", "executiveSummaryNarrative", "painPoints", "opportunities", "strengths", "weaknesses", "swotOpportunities", "threats"],
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
        // Second pass with supplementary data - use pro model for best quality
        const enrichPrompt = `You are a senior strategic analyst enriching an account analysis with additional financial intelligence.

ORIGINAL EXTRACTION:
${JSON.stringify(extractedData, null, 2)}

SUPPLEMENTARY WEB INTELLIGENCE:
${supplementaryContent}

ENRICHMENT INSTRUCTIONS:
1. Update financial figures (revenue, EBIT, margins, growth) with the most recent and accurate data
2. Enhance the executiveSummaryNarrative to be more compelling and board-ready
3. Add any additional strategic pillars, achievements, or SWOT items discovered
4. Maintain the executive-grade quality and ServiceNow strategic framing for all opportunities
5. Preserve existing high-quality content - only enhance, don't diminish`;

        const enrichResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-pro",
            messages: [
              { role: "system", content: "You are a McKinsey-caliber analyst enriching strategic account data. Merge new intelligence while maintaining board-ready quality. Prioritize accuracy and strategic insight." },
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
