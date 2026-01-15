import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Search for company information
async function searchCompanyInfo(companyName: string, searchType: string): Promise<string> {
  const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
  if (!apiKey) {
    console.log("Firecrawl not configured, skipping web search");
    return "";
  }

  try {
    const sanitizedName = companyName.replace(/[^\w\s-]/g, '').substring(0, 100);
    
    const queries: Record<string, string> = {
      annual_report: `${sanitizedName} annual report 2024 2025 investor relations`,
      financial: `${sanitizedName} revenue profit EBIT earnings financial results 2024`,
      strategy: `${sanitizedName} strategic priorities CEO vision transformation digital strategy`,
      news: `${sanitizedName} latest news press release announcements 2024 2025`,
      leadership: `${sanitizedName} CEO CTO CIO executive team leadership`,
    };

    const query = queries[searchType] || `${sanitizedName} business overview`;
    console.log(`Searching ${searchType} for presentation analysis`);

    const response = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        limit: 4,
        scrapeOptions: { formats: ["markdown"] },
      }),
    });

    if (!response.ok) {
      console.error("Search failed:", response.status);
      return "";
    }

    const data = await response.json();
    const results = data.data || [];
    const content = results
      .map((r: any) => r.markdown || r.description || "")
      .join("\n\n")
      .slice(0, 8000);

    console.log(`Found ${results.length} results for ${searchType}`);
    return content;
  } catch (error) {
    console.error(`Search error for ${searchType}`);
    return "";
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { presentationContent, slideCount } = await req.json();

    if (!presentationContent || presentationContent.length < 50) {
      return new Response(
        JSON.stringify({ success: false, error: "Presentation content is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Service temporarily unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // First, identify the company from the presentation
    console.log("Identifying company from presentation...");
    const identifyResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        temperature: 0,
        messages: [
          { 
            role: "system", 
            content: "You are a data extraction specialist. Extract the company name from the presentation content. Return ONLY the company name, nothing else. If you cannot determine the company name, return 'Unknown Company'." 
          },
          { role: "user", content: `Extract the customer/company name this presentation is about:\n\n${presentationContent.slice(0, 10000)}` }
        ],
      }),
    });

    if (!identifyResponse.ok) {
      throw new Error("Failed to identify company");
    }

    const identifyData = await identifyResponse.json();
    const companyName = identifyData.choices?.[0]?.message?.content?.trim() || "Unknown Company";
    console.log(`Identified company: ${companyName}`);

    // Fetch web intelligence in parallel
    let webResearch = "";
    if (companyName !== "Unknown Company") {
      console.log(`Fetching web intelligence for ${companyName}`);
      const [annualReport, financial, strategy, news, leadership] = await Promise.all([
        searchCompanyInfo(companyName, "annual_report"),
        searchCompanyInfo(companyName, "financial"),
        searchCompanyInfo(companyName, "strategy"),
        searchCompanyInfo(companyName, "news"),
        searchCompanyInfo(companyName, "leadership"),
      ]);

      webResearch = `
═══════════════════════════════════════════════════════════════
WEB RESEARCH ON ${companyName.toUpperCase()}
═══════════════════════════════════════════════════════════════
${annualReport ? `\n📊 ANNUAL REPORT & INVESTOR INFO:\n${annualReport.slice(0, 4000)}\n` : ""}
${financial ? `\n💰 FINANCIAL DATA:\n${financial.slice(0, 3000)}\n` : ""}
${strategy ? `\n🎯 STRATEGY & PRIORITIES:\n${strategy.slice(0, 3000)}\n` : ""}
${news ? `\n📰 RECENT NEWS:\n${news.slice(0, 2000)}\n` : ""}
${leadership ? `\n👔 LEADERSHIP:\n${leadership.slice(0, 2000)}\n` : ""}
`;
    }

    // Now analyze the presentation
    const systemPrompt = `You are an expert presentation analyst and executive coach. You're reviewing an account plan or annual report presentation to provide constructive feedback and suggestions.

Your job is to:
1. Identify strengths in the current presentation
2. Highlight gaps or areas for improvement
3. Suggest specific enhancements based on web research about the company
4. Provide actionable recommendations for each slide

Be constructive, specific, and actionable. Focus on making the presentation more compelling for executive audiences.

${webResearch}`;

    const userPrompt = `Analyze this presentation (${slideCount || 'multiple'} slides) and provide detailed feedback:

PRESENTATION CONTENT:
${presentationContent.slice(0, 40000)}

Provide a comprehensive analysis including:
1. Overall assessment of the presentation quality
2. Key strengths to preserve
3. Critical gaps or missing elements
4. Specific suggestions for improvement
5. Information from web research that should be incorporated`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        temperature: 0.5,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_presentation",
              description: "Provide structured analysis and feedback on the presentation",
              parameters: {
                type: "object",
                properties: {
                  companyName: { 
                    type: "string", 
                    description: "The company/customer name this presentation is about" 
                  },
                  industry: { 
                    type: "string", 
                    description: "The industry the company operates in" 
                  },
                  overallScore: { 
                    type: "number", 
                    description: "Overall quality score from 1-10" 
                  },
                  overallAssessment: { 
                    type: "string", 
                    description: "2-3 sentence executive summary of the presentation quality" 
                  },
                  strengths: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Strength category" },
                        detail: { type: "string", description: "What they did well" }
                      }
                    },
                    description: "3-5 key strengths of the presentation"
                  },
                  gaps: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Gap or issue category" },
                        detail: { type: "string", description: "What's missing or could be improved" },
                        priority: { type: "string", enum: ["high", "medium", "low"], description: "Priority level" }
                      }
                    },
                    description: "3-6 gaps or areas for improvement"
                  },
                  webInsights: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        insight: { type: "string", description: "Key fact or insight from web research" },
                        suggestion: { type: "string", description: "How to incorporate this into the presentation" }
                      }
                    },
                    description: "3-5 insights from web research that should be added"
                  },
                  slideSuggestions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        slideTitle: { type: "string", description: "Slide name or topic" },
                        currentState: { type: "string", description: "What's currently in the slide" },
                        suggestion: { type: "string", description: "Specific improvement recommendation" },
                        priority: { type: "string", enum: ["high", "medium", "low"] }
                      }
                    },
                    description: "Specific suggestions for individual slides"
                  },
                  missingSlides: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Suggested slide title" },
                        rationale: { type: "string", description: "Why this slide should be added" },
                        suggestedContent: { type: "string", description: "What content should be included" }
                      }
                    },
                    description: "Slides that should be added to the presentation"
                  },
                  executiveTips: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 tips for presenting to executives"
                  }
                },
                required: ["companyName", "overallScore", "overallAssessment", "strengths", "gaps", "slideSuggestions"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_presentation" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: false, error: "Failed to analyze presentation" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response");
      return new Response(
        JSON.stringify({ success: false, error: "Failed to parse AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: analysis,
        webSearchUsed: webResearch.length > 100
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error analyzing presentation:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
