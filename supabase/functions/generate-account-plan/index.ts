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
    const { accountData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating enterprise account plan for:", accountData.basics?.accountName);

    const systemPrompt = `You are an expert enterprise account strategist for ServiceNow. Your role is to analyze raw account data and produce a polished, strategic account plan.

You will receive raw input data about a customer account and must synthesize it into enterprise-grade strategic content.

CRITICAL RULES:
1. Be specific and actionable - avoid generic platitudes
2. Reference the customer's actual situation, not hypotheticals
3. Use executive-level language appropriate for C-suite presentations
4. Connect insights to ServiceNow's value proposition
5. Quantify impact where possible
6. Identify strategic tensions and how ServiceNow resolves them

OUTPUT FORMAT: Return a JSON object with the enhanced account plan content.`;

    const userPrompt = `Analyze this account data and generate an enterprise-grade strategic account plan:

ACCOUNT: ${accountData.basics?.accountName || "Unknown"}
VISION: ${accountData.basics?.visionStatement || "Not defined"}

FINANCIAL CONTEXT:
- Revenue: ${accountData.financial?.customerRevenue || "Unknown"}
- Growth: ${accountData.financial?.growthRate || "Unknown"}
- EBIT Margin: ${accountData.financial?.marginEBIT || "Unknown"}
- Cost Pressures: ${accountData.financial?.costPressureAreas || "Unknown"}
- Strategic Investments: ${accountData.financial?.strategicInvestmentAreas || "Unknown"}

SERVICENOW POSITION:
- Current Contract: ${accountData.basics?.currentContractValue || "Unknown"}
- FY Target: ${accountData.basics?.nextFYAmbition || "Unknown"}
- 3-Year Target: ${accountData.basics?.threeYearAmbition || "Unknown"}
- Renewal Date: ${accountData.basics?.renewalDates || "Unknown"}

CORPORATE STRATEGY:
${JSON.stringify(accountData.strategy?.corporateStrategy || [], null, 2)}

DIGITAL STRATEGY:
${JSON.stringify(accountData.strategy?.digitalStrategies || [], null, 2)}

CEO/BOARD PRIORITIES:
${JSON.stringify(accountData.strategy?.ceoBoardPriorities || [], null, 2)}

TRANSFORMATION THEMES:
${JSON.stringify(accountData.strategy?.transformationThemes || [], null, 2)}

PAIN POINTS:
${JSON.stringify(accountData.painPoints?.painPoints || [], null, 2)}

SWOT ANALYSIS:
- Strengths: ${JSON.stringify(accountData.swot?.strengths || [])}
- Weaknesses: ${JSON.stringify(accountData.swot?.weaknesses || [])}
- Opportunities: ${JSON.stringify(accountData.swot?.opportunities || [])}
- Threats: ${JSON.stringify(accountData.swot?.threats || [])}

HISTORY:
- Last Plan: ${accountData.history?.lastPlanSummary || "Unknown"}
- What Didn't Work: ${accountData.history?.whatDidNotWork || "Unknown"}
- Prior Attempts: ${accountData.history?.priorTransformationAttempts || "Unknown"}

EXECUTIVE ENGAGEMENT:
- Sponsors: ${JSON.stringify(accountData.engagement?.knownExecutiveSponsors || [])}
- Events: ${JSON.stringify(accountData.engagement?.plannedExecutiveEvents || [])}

ANNUAL REPORT DATA:
${JSON.stringify(accountData.annualReport || {}, null, 2)}

Generate a comprehensive, enterprise-grade account plan with the following sections:

1. executiveSummaryNarrative: A compelling 3-4 sentence executive summary that synthesizes the strategic opportunity
2. strategicObservations: Array of 4 strategic observations (each with "heading" and "detail")
3. strategicImplications: Array of 4 implications for action (each with "heading" and "detail")
4. strategicTensions: Array of 4 tensions the customer faces (each with "heading" and "detail")
5. strategicInsights: Array of 4 key insights (each with "heading" and "detail")
6. valueHypotheses: Array of 4 testable value hypotheses (each with "outcome", "mechanism", "timeframe", "impact")
7. strategicPriorities: Array of 3 must-win priorities (each with "title", "whyNow", "ifWeLose")
8. keyWorkstreams: Array of 3 transformation workstreams (each with "title", "status", "targetClose", "acv", "insight")
9. risksMitigations: Array of 4 risks (each with "risk", "mitigation", "level" as High/Medium/Low)
10. roadmapPhases: Array of 3 phases (each with "quarter", "title", "activities" array)
11. engagementStrategy: Object with "executiveAlignment" and "keyForums" arrays
12. successMetrics: Array of 4 metrics (each with "metric", "label", "description")

Return ONLY valid JSON, no markdown formatting.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("AI response received, parsing...");

    // Parse the JSON response
    let parsedPlan;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      parsedPlan = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI-generated plan");
    }

    console.log("Account plan generated successfully");

    return new Response(JSON.stringify({ 
      success: true, 
      plan: parsedPlan 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating account plan:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
