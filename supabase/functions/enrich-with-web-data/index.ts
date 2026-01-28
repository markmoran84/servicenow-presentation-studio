import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, createErrorResponse } from "../_shared/validation.ts";

// Search web for company info with timeout protection
async function searchCompanyInfo(companyName: string, searchType: string): Promise<string> {
  const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
  if (!apiKey) {
    console.log("Firecrawl not configured, skipping web search");
    return "";
  }

  try {
    // Sanitize company name for search
    const sanitizedName = companyName.replace(/[^\w\s-]/g, '').substring(0, 100);
    
    const queries: Record<string, string> = {
      financial: `${sanitizedName} revenue EBIT financial results 2024 2025`,
      strategy: `${sanitizedName} strategic priorities CEO vision transformation`,
      leadership: `${sanitizedName} CEO CFO CIO CTO executive team`,
      competitors: `${sanitizedName} competitors market share industry`,
      technology: `${sanitizedName} digital transformation AI technology investments`,
      sustainability: `${sanitizedName} ESG sustainability net zero carbon`,
    };

    const query = queries[searchType] || `${sanitizedName} company overview`;
    console.log(`Searching ${searchType} for ${sanitizedName}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout per search

    const response = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        limit: 3, // Reduced for faster response
        scrapeOptions: { formats: ["markdown"] },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Search failed for ${searchType}:`, response.status);
      return "";
    }

    const data = await response.json();
    const results = data.data || [];
    const content = results
      .map((r: any) => r.markdown || r.description || "")
      .join("\n\n")
      .slice(0, 5000); // Limit content size

    console.log(`Found ${results.length} results for ${searchType}`);
    return content;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log(`Search timeout for ${searchType}`);
    } else {
      console.error(`Search error for ${searchType}:`, error);
    }
    return "";
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyName, existingData, fieldsToEnrich } = await req.json();

    if (!companyName || typeof companyName !== 'string' || companyName.trim().length < 2) {
      return createErrorResponse(400, "Company name is required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return createErrorResponse(503, "Service temporarily unavailable");
    }

    // Check if Firecrawl is available
    const hasFirecrawl = !!Deno.env.get("FIRECRAWL_API_KEY");
    if (!hasFirecrawl) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Web enrichment requires the Firecrawl connector. Please enable it in Settings → Connectors."
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Enriching data for: ${companyName}`);
    console.log(`Fields to enrich:`, fieldsToEnrich || 'all');

    // Determine which searches to run based on missing data
    const searchTypes: string[] = [];
    const missing = existingData?.missingFields || [];
    
    if (missing.includes('financial') || missing.includes('revenue') || !existingData?.financial?.customerRevenue) {
      searchTypes.push('financial');
    }
    if (missing.includes('strategy') || !existingData?.strategy?.corporateStrategy?.length) {
      searchTypes.push('strategy');
    }
    if (missing.includes('leadership') || !existingData?.engagement?.knownExecutiveSponsors?.length) {
      searchTypes.push('leadership');
    }
    if (missing.includes('competitors') || !existingData?.businessModel?.competitors?.length) {
      searchTypes.push('competitors');
    }
    if (missing.includes('technology') || !existingData?.strategy?.digitalStrategies?.length) {
      searchTypes.push('technology');
    }
    if (missing.includes('sustainability') || !existingData?.annualReport?.netZeroTarget) {
      searchTypes.push('sustainability');
    }

    // If no specific gaps identified, search for common missing areas
    if (searchTypes.length === 0) {
      searchTypes.push('financial', 'strategy', 'leadership');
    }

    // Run searches in parallel (max 3 to avoid timeout)
    const limitedSearchTypes = searchTypes.slice(0, 3);
    console.log(`Running searches for: ${limitedSearchTypes.join(', ')}`);

    const searchResults = await Promise.all(
      limitedSearchTypes.map(type => searchCompanyInfo(companyName, type))
    );

    const webContext: Record<string, string> = {};
    limitedSearchTypes.forEach((type, index) => {
      webContext[type] = searchResults[index];
    });

    // Build context for AI
    const webContextStr = Object.entries(webContext)
      .filter(([_, content]) => content.length > 0)
      .map(([type, content]) => `\n### ${type.toUpperCase()} INTELLIGENCE:\n${content}`)
      .join('\n');

    if (!webContextStr) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: {},
          enrichedFields: [],
          message: "No additional information found from web search"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create AI enrichment prompt
    const systemPrompt = `You are a business intelligence analyst enriching account data for ${companyName}.

EXISTING DATA AVAILABLE:
${JSON.stringify(existingData || {}, null, 2)}

WEB RESEARCH RESULTS:
${webContextStr}

Your task: Extract NEW information from the web research to fill gaps in the existing data.

RULES:
1. Only extract information that is MISSING from existing data
2. Use specific facts, figures, and names from the research
3. For executives, include full names and titles
4. For financial data, include specific numbers and years
5. For strategies, extract specific initiative names
6. Do NOT repeat information already present in existing data`;

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
          { role: "user", content: `Extract new data points to enrich our understanding of ${companyName}. Focus on filling gaps.` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "enrich_account_data",
              description: "Add new data points discovered from web research",
              parameters: {
                type: "object",
                properties: {
                  revenue: {
                    type: "string",
                    description: "Company revenue with year (e.g., '$55.5B (2024)')"
                  },
                  growthRate: {
                    type: "string",
                    description: "Revenue or profit growth rate"
                  },
                  marginEBIT: {
                    type: "string",
                    description: "EBIT margin percentage"
                  },
                  netZeroTarget: {
                    type: "string",
                    description: "Sustainability/net zero commitment"
                  },
                  visionStatement: {
                    type: "string",
                    description: "Company vision statement - a short aspirational phrase (e.g., 'All the way', 'Making it easier for everyone to experience the world')"
                  },
                  purposeStatement: {
                    type: "string",
                    description: "Company purpose/mission statement - why they exist"
                  },
                  longTermAims: {
                    type: "array",
                    items: { type: "string" },
                    description: "Long-term strategic aims (4-6 items)"
                  },
                  executives: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        title: { type: "string" },
                        focus: { type: "string" }
                      }
                    },
                    description: "Key executives discovered"
                  },
                  strategicPriorities: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" }
                      }
                    },
                    description: "Strategic priorities discovered"
                  },
                  digitalInitiatives: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" }
                      }
                    },
                    description: "Digital/technology initiatives discovered"
                  },
                  competitors: {
                    type: "array",
                    items: { type: "string" },
                    description: "Competitors discovered"
                  },
                  additionalInsights: {
                    type: "array",
                    items: { type: "string" },
                    description: "Other valuable insights discovered"
                  }
                },
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "enrich_account_data" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return createErrorResponse(429, "Rate limit exceeded. Please try again in a moment.");
      }
      if (response.status === 402) {
        return createErrorResponse(402, "AI credits exhausted. Please add credits to continue.");
      }
      console.error("AI gateway error:", response.status);
      return createErrorResponse(500, "Failed to analyze web data");
    }

    const responseData = await response.json();
    const toolCall = responseData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall || toolCall.function.name !== "enrich_account_data") {
      console.error("Unexpected AI response format");
      return createErrorResponse(500, "Failed to process web data");
    }

    const enrichedData = JSON.parse(toolCall.function.arguments);
    
    // Track which fields were enriched
    const enrichedFields: string[] = [];
    if (enrichedData.revenue) enrichedFields.push('revenue');
    if (enrichedData.growthRate) enrichedFields.push('growthRate');
    if (enrichedData.marginEBIT) enrichedFields.push('marginEBIT');
    if (enrichedData.netZeroTarget) enrichedFields.push('netZeroTarget');
    if (enrichedData.visionStatement) enrichedFields.push('visionStatement');
    if (enrichedData.purposeStatement) enrichedFields.push('purposeStatement');
    if (enrichedData.longTermAims?.length) enrichedFields.push('longTermAims');
    if (enrichedData.executives?.length) enrichedFields.push('executives');
    if (enrichedData.strategicPriorities?.length) enrichedFields.push('strategicPriorities');
    if (enrichedData.digitalInitiatives?.length) enrichedFields.push('digitalInitiatives');
    if (enrichedData.competitors?.length) enrichedFields.push('competitors');
    if (enrichedData.additionalInsights?.length) enrichedFields.push('insights');

    console.log(`Enriched ${enrichedFields.length} fields from web data`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: enrichedData,
        enrichedFields,
        searchesCompleted: limitedSearchTypes
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error enriching data:", error);
    return createErrorResponse(500, "Failed to enrich data with web intelligence");
  }
});
